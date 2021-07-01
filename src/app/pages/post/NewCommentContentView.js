import React, {Fragment, useState, useEffect} from "react";
import {makeStyles} from "@material-ui/core";
import clsx from "clsx";

import {ModelType} from "../../../core/model/ModelConsts";
import TiledImages from "../../components/TiledImages";
import {PopupImages} from "../../components/PopupImages";
import {PreviewContent} from "../../components/PreviewContent";
import HighlightLink from "../../components/HighlightLink";
import {VideoPlayer} from "../../components/VideoPlayer";
import {handleMediaUrl} from "src/util/imageUtils";
import {GifImage} from "src/app/components/GifImage";
import {isObject} from "lodash-es";

const useStyles = makeStyles((theme) => ({
  rootContentView: {
    wordBreak: "break-word",
    fontSize: 15,
    lineHeight: "1.3125",
    letterSpacing: "0.01em",
    "& .main-content": {
      color: theme.palette.text.primary,
      padding: "10px 0 16px",
      lineHeight: "140%",
    },
    "& .main-image": {
      padding: 0,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing(1.25),
      maxHeight: "284px",
      backgroundColor: "#F3F5F8",
      borderRadius: 10,
      overflow: "hidden",
      cursor: "pointer",
      "&.single-image": {
        maxHeight: "500px",
        "& img.error": {
          minHeight: "91px",
        },
      },
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
        "&.gif": {
          objectFit: "contain",
          backgroundColor: "black",
          maxHeight: "284px",
        },
      },
      "&.repost": {
        display: "block",
        border: "none",
        backgroundColor: "transparent",
        marginLeft: -35,
        "& img": {
          width: theme.spacing(12),
        },
      },
    },
    "&.repost": {
      "& .text-content": {
        marginLeft: -35,
      },
    },
    // "&.comment": {
    //   marginLeft: "70px",
    //   "& .main-image": {
    //     border: "none",
    //     height: "auto",
    //     color: theme.palette.text.gray,
    //     fontSize: "14px",
    //     overflow: "visible",
    //   },
    //   "& .comment": {
    //     marginLeft: 0,
    //     marginTop: 16,
    //   },
    //   "&>div": {
    //     padding: 0,
    //     display: "-webkit-box",
    //     overflow: "hidden",
    //     whiteSpace: "normal !important",
    //     textOverflow: "ellipsis",
    //     wordWrap: "break-word",
    //     "-webkit-line-clamp": "4 !important",
    //     "-webkit-box-orient": "vertical",
    //   },
    //   "& .postContentView": {
    //     width: "100%",
    //     margin: "10px 0 0",
    //   },
    // },
    // "&.repost": {
    //   "& > div": {
    //     marginBottom: 0,
    //     display: "-webkit-box",
    //     overflow: "hidden",
    //     whiteSpace: "normal !important",
    //     textOverflow: "ellipsis",
    //     wordWrap: "break-word",
    //     "-webkit-line-clamp": "4 !important",
    //     "-webkit-box-orient": "vertical",
    //   },
    // },
    // "&.timeline, &.profile": {
    //   "& .text-content": {
    //     display: "-webkit-box",
    //     "-webkit-line-clamp": 5,
    //     "-webkit-box-orient": "vertical",
    //     overflow: "hidden",
    //   },
    // },
  },
  mainImages: {
    "& .main-image": {
      border: "none",
    },
  },
  originSmallImage: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: 10,
    marginRight: theme.spacing(2),
    border: `1px solid ${theme.divider.color}`,
    objectFit: "cover",
    flexShrink: 0,
    backgroundColor: theme.palette.grey.A300,
    "&.noCursor": {
      cursor: "auto",
    },
  },
  originPost: {
    cursor: "pointer",
    minHeight: "83px",
  },
  originheadline: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: theme.palette.text.secondary,
    padding: 12,
  },
  originMedia: {
    paddingLeft: 12,
    paddingBottom: 12,
    paddingRight: 12,
    "&.repostOriginMedia": {
      padding: "12px 0 0",
    },
  },
  originTextContent: {
    "& .text-content": {
      display: "-webkit-box",
      overflow: "hidden",
      whiteSpace: "normal !important",
      textOverflow: "ellipsis",
      wordWrap: "break-word",
      "-webkit-line-clamp": "4 !important",
      "-webkit-box-orient": "vertical",
    },
    "&.repost": {
      padding: 0,
    },
    "&.comment, &.repost, &.post-page-view, &.timeline": {
      "& [class*='MuiBox-root']:not(.headline)": {
        alignItems: "flex-start",
      },
    },
  },
  originProfileImage: {
    maxHeight: "284px",
    borderRadius: "0 0 10px 10px",
  },
  commentProfileImage: {
    maxHeight: "284px",
    borderRadius: "10px",
  },
  videoWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 15,
    "& video": {
      width: "100%",
      outline: "none",
      height: "284px",
    },
  },
  icon: {
    width: theme.spacing(1.875),
    margin: theme.spacing(0, 0, 0, 0.5),
    height: "auto",
  },
  omittedWrapper: {
    display: "-webkit-box",
    overflow: "hidden",
    whiteSpace: "normal !important",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    "-webkit-line-clamp": "4 !important",
    "-webkit-box-orient": "vertical",
    "& .text-content": {
      display: "inline",
    },
  },
  avatar: {
    width: "24px",
    height: "24px",
    marginRight: "8px",
  },

  hoverPopup: {
    display: "flex",
    flexShrink: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userDisplayName: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  influencer: {
    display: "flex",
    flexShrink: 0,
    marginRight: "3px",
    paddingTop: theme.spacing(0.25),
  },
  userAtNameShort: {
    color: theme.palette.text.gray,
    flexShrink: 99,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: "400",
    [theme.breakpoints.down("xs")]: {
      flexShrink: 99,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      Display: "block",
    },
  },
  userAtName: {
    color: theme.palette.text.gray,
    cursor: "pointer",
    fontWeight: "400",
  },
  dot: {
    color: theme.palette.text.gray,
    display: "flex",
    marginLeft: "3px",
    marginRight: "3px",
    flexShrink: 0,
  },
  sinceTime: {
    color: theme.palette.text.gray,
    display: "flex",
    paddingLeft: "3px",
    flexShrink: 0,
  },
  unavailablePost: {
    border: "1px solid #E0E6EA",
    backgroundColor: "#F3F5F8",
    borderRadius: 10,
    width: "100%",
    padding: 14,
    color: theme.palette.text.gray,
    lineHeight: "15px",
    marginTop: 10,
  },
  imageAlt: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "284px",
    objectFit: "cover",
    [theme.breakpoints.down("xs")]: {
      minHeight: "155px",
    },
    "&.noCursor": {
      cursor: "auto",
    },
  },
}));

/**
 * CommentContentView - renders a single comment's content only. No
 * headers. That is job of the parent container
 */
export const NewCommentContentView = (props) => {
  const {objId, obj, comment, stats, scene, pageType} = props;
  const [metaData, setMetaData] = useState(null);
  const [canFetchMetaData, setCanFetchMetaData] = useState(false);
  const [fetchMetadataFunc, setFetchMetadataFunc] = useState(() => () => {});

  const classes = useStyles();
  const [imageURLsOpen, setImageURLsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const posts = obj._tp?.aux?.post;
  let commentObj;
  let commentId;
  if (!posts) {
    commentId = obj.getId();
    commentObj = obj;
  } else {
    commentId = objId;
    commentObj = obj.getPost();
  }
  if (!commentObj) return null;

  useEffect(() => {
    if (fetchMetadataFunc && !metaData) {
      const text = commentObj.getText();
      fetchMetadataFunc &&
        fetchMetadataFunc(text, (error, result) => {
          setMetaData(result);
        });
    }
  }, [fetchMetadataFunc]);

  const getImageURLs = () => {
    let imageURLs = commentObj.getImageURLs
      ? commentObj.getImageURLs() || []
      : [];
    return imageURLs;
  };

  const renderMainText = () => {
    const text = commentObj.getText();
    const previewUrl = commentObj.getPreviewURL && commentObj.getPreviewURL();

    return (
      <Fragment>
        <HighlightLink text={text} type={pageType} previewUrl={previewUrl} />
      </Fragment>
    );
  };

  const renderMainImage = () => {
    let imageCount = commentObj.getImageCount();
    let imageComp;

    if (imageCount === 1 || (imageCount > 0 && scene === "repost")) {
      let imagePath = commentObj.getImageURLs(null);
      let imageUrl = null;
      if (imagePath) {
        if (
          imagePath[0].startsWith("https://") ||
          imagePath[0].startsWith("http://")
        ) {
          imageUrl = imagePath[0];
        } else {
          imageUrl = handleMediaUrl(
            process.env.REACT_APP_MEDIA_BASE,
            imagePath[0],
          );
        }
      }
      if (imageUrl.includes(".gif") && !scene) {
        // !scene because only use GifImage in comment feed.
        return (
          <GifImage
            imageUrl={imageUrl}
            imageClassName="gif"
            handleClick={(e) => {
              e.stopPropagation();
              setImageURLsOpen(true);
            }}
            height={commentObj?.data?.vid_hgt}
            width={commentObj?.data?.vid_wid}
          />
        );
      }
      imageComp = imageUrl ? (
        <img
          src={imageUrl}
          height={
            commentObj?.data.vid_hgt ? commentObj.data.vid_hgt : undefined
          }
          className={
            scene === "repost"
              ? classes.originSmallImage
              : `${imageUrl.match(/[^\.]+$/)[0]}`
          }
          alt=""
          onClick={(e) => {
            e.stopPropagation();
            setImageURLsOpen(true);
          }}
          onError={(event) => event.target.classList.add("error")}
        />
      ) : null;
    } else if (imageCount > 1) {
      let imagePaths = commentObj.getImageURLs();
      let imageURLs = [];
      if (imagePaths) {
        for (let i = 0; i < imagePaths.length; i++)
          imageURLs.push(imagePaths[i]);
      }

      imageComp = (
        <TiledImages
          imageURLs={imageURLs}
          handleClick={(index) => {
            setImageURLsOpen(true);
            setCurrentIndex(index);
          }}
        />
      );
    }
    return imageComp ? (
      <Fragment>
        <div
          className={`main-image${scene ? " " + scene : ""} ${
            imageCount === 1 && "single-image"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {imageComp}
        </div>
      </Fragment>
    ) : null;
  };

  const renderMainVideo = () => {
    const videoURL = commentObj.getOriginalVideoUrl();
    let vid = commentObj.data?.vid;
    let origVid = commentObj.data?.ovid;

    if (isObject(videoURL)) {
      vid = videoURL.m3u8;
      origVid = videoURL.vid;
    }

    return videoURL ? (
      <div
        className={(clsx("main-video"), classes.videoWrapper)}
        onClick={(e) => e.stopPropagation()}
      >
        <VideoPlayer
          vid={new Date().getTime()}
          options={{
            autoplay: false,
            muted: true,
            controls: true,
            fluid: true,
            responsive: true,
            playbackRates: [1, 1.25, 1.5, 1.75, 2],
            sources: [
              {
                src: handleMediaUrl(process.env.REACT_APP_MEDIA_BASE, vid),
                type: "application/x-mpegurl",
              },
              {
                src: handleMediaUrl(process.env.REACT_APP_MEDIA_BASE, origVid),
                type: "video/mp4",
              },
            ],
          }}
          postObj={commentObj}
        />
      </div>
    ) : null;
  };

  const renderMetaData = () => {
    // let metaData = commentObj?.data?.prevsrc
    //   ? {
    //       imageUrl: commentObj.data.previmg,
    //       url: commentObj.data.prevsrc,
    //       title: commentObj.data.ttl,
    //     }
    //   : null;

    return (
      <PreviewContent
        previewMetaData={metaData}
        scene="commentDetail"
        setupFetchMetadata={(fetchMetadata) => {
          setFetchMetadataFunc(() => {
            return fetchMetadata;
          });
        }}
      />
    );
  };

  const renderData = () => {
    // if (pageType === "comment-detail") truncated = 100;
    let textComps = renderMainText();
    let imageComp = renderMainImage();
    let videoComp = renderMainVideo();
    let metaDataComp = renderMetaData();
    let imageURLs = getImageURLs();
    let xComment = comment;
    let xStats = stats;
    if (xStats == null)
      xStats = xComment?.getAuxDataXField(ModelType.COMMENT_STATS);

    let objDetails = (
      <div className={`${classes.rootContentView}${scene ? " " + scene : ""}`}>
        {textComps}
        {imageComp}
        {videoComp}
        {metaDataComp}
        <PopupImages
          imageURLs={imageURLs}
          open={imageURLsOpen}
          onClose={() => {
            setImageURLsOpen(false);
          }}
          currentIndex={currentIndex}
          item={xComment}
          commentId={commentId}
          xStats={xStats}
          type="comment"
        />
      </div>
    );

    return objDetails;
  };

  return renderData();
};
