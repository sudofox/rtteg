import {useEffect, useState} from "react";
import {
  youtubeFormat,
  getYoutubeVideoID,
  twitterFormat,
} from "src/util/TextUtil";
import {Box, makeStyles} from "@material-ui/core";
import clsx from "clsx";
import GAxios from "src/util/GAxios";
import {GTypography} from "../../styles/components/GTypography";
import {ReactComponent as LinkIcon} from "src/assets/icons/feature/link.svg";
import {ReactComponent as ArticleIcon} from "src/assets/icons/feature/article.svg";
import {ReactComponent as CirclePlayIcon} from "src/assets/icons/feature/circle_play.svg";
import AppConsts from "../AppConsts";
import URI from "urijs";
import urlMetadata from "url-metadata";
import {debounce} from "lodash";
import {YoutubeVideoPlayer} from "./YoutubeVideoPlayer";
import PrevImage from "./PrevImage";

let openUrl = "";

const handleExternalLink = (e, url) => {
  e.preventDefault();
  e.stopPropagation();
  window.open(url, "_blank");
};

const fetchMetadata = (text, callback) => {
  debounce(async () => {
    const corsHostUrl = process.env.REACT_APP_CORS_URL;
    const siteUrls = [];

    URI.withinString(text, function (url) {
      siteUrls.push(url);
    });

    if (siteUrls.length > 0) {
      let siteUrl = siteUrls[0];
      if (openUrl === siteUrl) {
        callback(null, null);
        // return;
      } else {
        openUrl = siteUrl;
      }
      if (twitterFormat(siteUrl)) {
        if (!siteUrl.startsWith("https://") && !siteUrl.startsWith("http://")) {
          siteUrl = "https://" + siteUrl;
        }
        const config = {
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/u/urlmeta/twitter?url=${siteUrl}`,
        };
        GAxios(config, (response) => {
          const meta = response?.data?.result;
          callback(null, {
            title: meta?.name,
            imageUrl: meta?.photos ? meta.photos[0] : meta?.profile_image_url,
            description: meta?.clean_tweet || meta?.bio,
            url: siteUrls[0],
          });
        });
      } else {
        urlMetadata(corsHostUrl + siteUrl)
          .then((metadata) => {
            // success handler
            const _metadata = {
              siteName: metadata["al:android:app_name"],
              title: metadata["og:title"],
              imageUrl: metadata["og:image"],
              description: metadata["og:description"],
              url: siteUrls[0],
            };

            callback(null, _metadata);
          })
          .catch((e) => callback(e, null));
      }
    } else {
      callback(null, null);
    }
  }, AppConsts.TYPE_SEARCH_DELAY_MS)();
};

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    position: "relative",
    width: "100%",
    border: ({isRepost}) => (isRepost ? "none" : "1px solid #D7D7D7"),
    borderRadius: "10px",
    marginTop: "12px",
    "&.commentDetail": {
      width: "100%",
      margin: "16px 0 0",
    },
    "&.post": {
      width: "100%",
      // margin: 0,
    },
  },
  previewEmptyContainer: {
    minHeight: 300,
    position: "relative",
    width: "calc(100% - 56px)",
    border: " 1px solid #D7D7D7",
    borderRadius: "10px",
    margin: "0 28px",
  },
  previewImg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 268,
    borderRadius: ({isRepost}) => (isRepost ? 0 : "10px 10px 0 0"),
    backgroundSize: "cover",
    backgroundRepeat: "none",
    backgroundPosition: "center",
    borderBottom: `1px solid ${theme.palette.line.grey_1}`,
  },
  mainContent: {
    padding: "8px 15px",
    fontSize: "16px",
    letterSpacing: "0.01em",
    overflow: "hidden",
  },
  url: {
    color: theme.palette.text.gray,
    fontWeight: 400,
    marginLeft: "4px",

    "&:hover": {
      color: theme.palette.text.gray,
      textDecoration: "underline",
    },
  },
  previewSecondContainer: {
    display: "flex",
    alignItems: "center",
  },
  defaultImage: {
    padding: "42px 32px",
    background: "#A7B0BA",
    borderRadius: "10px 0 0 10px",
  },
  smallPreview: {
    position: "relative",
    paddingLeft: 116,
    minHeight: 96,
    margin: theme.spacing(1.5, 1.5, 1.5, 0),
    border: `1px solid ${theme.palette.line.grey_2}`,
    overflow: "hidden",
    borderRadius: 10,
    display: "flex",

    justifyContent: "center",
    flexDirection: "column",
    "&.repost": {
      margin: theme.spacing(1.5),
      marginTop: 0,
      marginBottom: `${theme.spacing(1.5)}px !important`,
    },
    "&.comment": {
      margin: theme.spacing(1.5, 0, 0, 0),
    },
  },
  smallPreviewShared: {
    marginLeft: theme.spacing(1.5),
  },
  smallImage: {
    width: "96px",
    height: "96px",
    position: "absolute",
    top: 0,
    left: 0,
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  normalVideo: {
    width: "100%",
    height: "280px",
    borderRadius: ({isRepost}) => (isRepost ? 0 : 10),
    marginTop: ({isRepost}) => (isRepost ? -7 : theme.spacing(1.5)),
    display: ({isRepost}) => (isRepost ? "flex" : "block"),
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      height: "240px",
    },
  },
  smallVideo: {
    width: "96px",
    height: "96px",
    borderRadius: "10px",
    margin: "0 16px 8px 12px",
    border: `1px solid ${theme.divider.color}`,
    objectFit: "cover",
    flexShrink: 0,
    backgroundColor: theme.palette.grey.A300,
    "&.noCursor": {
      cursor: "auto",
    },
  },
  hasImageOrVideo: {
    margin: 0,
    marginTop: 12,
    "&.postContentView": {
      margin: "12px 15px",
    },
  },
  smallPreviewTitle: {
    display: "-webkit-box",
    overflow: "hidden",
    whiteSpace: "normal !important",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    "-webkit-line-clamp": "2 !important",
    "-webkit-box-orient": "vertical",
    fontSize: 15,
  },
  metaTitle: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  metaDescrition: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.gray,
    fontWeight: 400,
    fontSize: 15,
    lineHeight: "22.4px",
    display: "-webkit-box",
    overflow: "hidden",
    whiteSpace: "normal !important",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    "-webkit-line-clamp": "2 !important",
    "-webkit-box-orient": "vertical",
    textAlign: "left",
  },
  repostComposerYoutubeVideo: {
    marginBottom: -3,
  },
  youtubeMiniPreview: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRight: `1px solid ${theme.palette.line.grey_1}`,
  },
  youtubeUrl: {
    fontSize: 15,
  },
  circlePlayIcon: {
    height: 50,
    width: 50,
    position: "absolute",
  },
  linkIcon: {
    "& path": {
      fill: theme.palette.text.secondary,
    },
  },
}));

const SMALL_IMAGE_RESOLUTION = 100;

export const PreviewContent = ({
  setupFetchMetadata,
  scene,
  previewMetaData,
  hasMediaRepost,
  hasImageOrVideo,
  type,
}) => {
  const classes = useStyles({isRepost: /postContentView|repost/.test(scene)});
  const [imgResTooSmall, setImgResTooSmall] = useState(true);
  const [expandYoutubePreview, setExpandYoutubePreview] = useState(false);
  const showSmallImagePreview = hasMediaRepost || hasImageOrVideo;

  useEffect(() => {
    if (previewMetaData?.imageUrl && !showSmallImagePreview) {
      const img = new Image();
      img.src = previewMetaData.imageUrl;
      img.onload = () => {
        if (
          [img.width, img.height].some(
            (value) => value > SMALL_IMAGE_RESOLUTION,
          )
        ) {
          setImgResTooSmall(false);
        }
      };
    }
  }, [previewMetaData]);

  useEffect(() => {
    if (typeof setupFetchMetadata === "function") {
      setupFetchMetadata(fetchMetadata);
    }
  }, [setupFetchMetadata]);

  if (
    previewMetaData &&
    youtubeFormat(previewMetaData.url) &&
    getYoutubeVideoID(previewMetaData.url) &&
    !hasImageOrVideo
  ) {
    const formattedURL = previewMetaData?.url?.match(
      /(https?\:\/\/)?([^/]*)/,
    )[2];
    return expandYoutubePreview ? (
      <YoutubeVideoPlayer
        id={getYoutubeVideoID(previewMetaData.url)[1]}
        className={classes.normalVideo}
      />
    ) : (
      <div
        className={clsx(
          classes.smallPreview,
          scene,
          hasImageOrVideo && classes.hasImageOrVideo,
          type === "repostOrigin" ? classes.smallPreviewShared : "",
        )}
        onClick={(e) => handleExternalLink(e, previewMetaData.url)}
      >
        <div
          className={clsx(classes.smallImage, classes.youtubeMiniPreview)}
          onClick={(e) => {
            e.stopPropagation();
            setExpandYoutubePreview(true);
          }}
        >
          <CirclePlayIcon className={classes.circlePlayIcon} />
          <PrevImage url={previewMetaData.imageUrl} />
        </div>

        <GTypography className={classes.smallPreviewTitle}>
          {previewMetaData.title}
        </GTypography>
        <Box display="flex" alignItems="center" mt={1}>
          <LinkIcon className={classes.linkIcon} />
          <a
            href={previewMetaData.url}
            target="_blank"
            className={clsx(classes.url, classes.youtubeUrl)}
          >
            {formattedURL}
          </a>
        </Box>
      </div>
    );
  }

  const formattedURL = previewMetaData?.url?.match(/(https?\:\/\/)?([^/]*)/)[2];

  if (!previewMetaData) {
    return null;
  }

  if (previewMetaData.imageUrl) {
    return (
      <>
        {showSmallImagePreview || imgResTooSmall ? (
          <div
            className={clsx(
              classes.smallPreview,
              scene,
              hasImageOrVideo && classes.hasImageOrVideo,
              type === "repostOrigin" ? classes.smallPreviewShared : "",
            )}
            onClick={(e) => handleExternalLink(e, previewMetaData.url)}
          >
            <div className={classes.smallImage}>
              <PrevImage url={previewMetaData.imageUrl} />
            </div>
            <div>
              <GTypography className={classes.smallPreviewTitle}>
                {previewMetaData.title}
              </GTypography>
              <Box display="flex" alignItems="center" mt={1}>
                <LinkIcon className={classes.linkIcon} />
                <a
                  href={previewMetaData.url}
                  target="_blank"
                  className={classes.url}
                >
                  {formattedURL}
                </a>
              </Box>
            </div>
          </div>
        ) : (
          <div
            className={`${classes.previewContainer} ${scene} preview-content`}
            onClick={(e) => handleExternalLink(e, previewMetaData.url)}
          >
            <a
              href={
                /https?:\/\//.test(previewMetaData.url)
                  ? previewMetaData.url
                  : `http://${previewMetaData.url}`
              }
            >
              <div
                className={classes.previewImg}
                style={{backgroundImage: `url(${previewMetaData.imageUrl})`}}
              />
              <Box className={classes.mainContent}>
                <GTypography className={classes.metaTitle}>
                  {previewMetaData.title}
                </GTypography>
                <GTypography className={classes.metaDescrition}>
                  {previewMetaData.description}
                </GTypography>
                <Box display="flex" alignItems="center" mt={1}>
                  <LinkIcon className={classes.linkIcon} />
                  <a
                    href={previewMetaData.url}
                    target="_blank"
                    className={classes.url}
                  >
                    {formattedURL}
                  </a>
                </Box>
              </Box>
            </a>
          </div>
        )}
      </>
    );
  } else if (previewMetaData.title) {
    return (
      <div
        className={`${classes.previewContainer} ${classes.previewSecondContainer} ${scene}`}
        onClick={(e) => handleExternalLink(e, previewMetaData.url)}
      >
        <div className={classes.defaultImage}>
          <ArticleIcon />
        </div>
        <Box flex={1} className={classes.mainContent}>
          <GTypography className={classes.metaTitle}>
            {previewMetaData.title}
          </GTypography>
          <GTypography className={classes.metaDescrition}>
            {previewMetaData.description}
          </GTypography>
          <Box display="flex" alignItems="center" mt={0.5}>
            <LinkIcon className={classes.linkIcon} />
            <a
              href={previewMetaData.url}
              target="_blank"
              className={classes.url}
            >
              {previewMetaData.siteName || formattedURL}
            </a>
          </Box>
        </Box>
      </div>
    );
  } else {
    return null;
  }
};
