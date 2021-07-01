import React, {useState, useEffect, Fragment, useRef} from "react";
import {connect} from "react-redux";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import clsx from "clsx";
import URI from "urijs";
import urlMetadata from "url-metadata";
import HoverPopup from "src/app/components/HoverPopup";
import {useHistory} from "react-router-dom";
import ResizeObserver from "resize-observer-polyfill";
import Util, {TimeUtil} from "src/core/Util";
import {getLang, t} from "src/i18n/utils";
import XUserInfo from "src/core/model/user/XUserInfo";
import {PopupImages} from "src/app/components/PopupImages";
import {UserLabelLink} from "src/app/components/UserLabelLink";
import {PreviewContent} from "src/app/components/PreviewContent";
import TiledImages from "src/app/components/TiledImages";
import HighlightLink from "src/app/components/HighlightLink";
import {
  zoomImage,
  handleMediaUrl,
  getShortUrls,
  getImageStyleFromMetadata,
} from "src/util/imageUtils";
import {VideoPlayer} from "src/app/components/VideoPlayer";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {AvatarLink} from "src/app/components/AvatarLink";
import {GifImage} from "src/app/components/GifImage";
import XObject from "src/core/model/XObject";
import {TwitterContentView} from "./TwitterContentView";
import {youtubeFormat} from "src/util/TextUtil";
import {checkNCR, ncrDecode} from "src/util/ncrEncodeDecode";

const useStyles = makeStyles((theme) =>
  createStyles({
    rootContentView: {
      wordBreak: "break-word",
      lineHeight: "19.5px",
      "&.post-page-view": {
        lineHeight: "33.6px",
      },

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
        maxHeight: theme.spacing(35.5),
        backgroundColor: theme.palette.background.light,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        "& img": {
          cursor: "pointer",
        },
        "&.single-image": {
          maxHeight: "500px",
        },
      },
      "&.comment": {
        marginLeft: theme.spacing(7.625),
        "& .main-image": {
          border: "none",
          height: "auto",
          color: theme.palette.text.gray,
          fontSize: "14px",
          overflow: "visible",
        },
        "& .comment": {
          marginLeft: 0,
          marginTop: theme.spacing(2),
        },
        "&>div:first-child": {
          padding: 0,
          display: "-webkit-box",
          overflow: "hidden",
          whiteSpace: "normal !important",
          textOverflow: "ellipsis",
          wordWrap: "break-word",
          "-webkit-line-clamp": "4 !important",
          "-webkit-box-orient": "vertical",
        },
        "& .postContentView": {
          width: "100%",
          margin: "10px 0 0",
        },
      },
      "&.repost": {
        "& > div": {
          marginBottom: 0,
          display: "-webkit-box",
          overflow: "hidden",
          whiteSpace: "normal !important",
          textOverflow: "ellipsis",
          wordWrap: "break-word",
          "-webkit-line-clamp": "4 !important",
          "-webkit-box-orient": "vertical",
        },
      },
      "&.timeline, &.profile": {
        paddingTop: 3.333,
        "& .text-content": {
          display: "-webkit-box",
          "-webkit-line-clamp": 5,
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
        },
      },
    },
    mainImages: {
      "& .main-image": {
        border: "none",
      },
    },
    originPost: {
      cursor: "pointer",
      minHeight: 45,
    },
    originPostContent: {
      overflow: "hidden",
      fontSize: 16,
      fontWeight: theme.typography.fontWeightRegular,
      borderRadius: 10,
      border: `1px solid ${theme.divider.color}`,
      marginTop: theme.spacing(1),
      "& > .postContentView.preview-content": {
        border: 0,
        borderRadius: 0,
        "& img": {
          borderRadius: 0,
        },
      },
      "& > div.main-image": {
        border: "none",
        marginTop: 0,
        borderRadius: 0,
      },
      "&.comment": {
        "& .main-image": {
          padding: theme.spacing(0, 1.25),
        },
      },
      "& .repost[class*='PostContentView-originTextContent']": {
        padding: theme.spacing(1.5),
      },
      "& .comment[class*='PostContentView-originTextContent']": {
        marginTop: 0,
      },
    },
    originHeadline: {
      display: "flex",
      alignItems: "center",
      fontSize: 16,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1.5),
    },
    originMedia: {
      paddingLeft: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.875),
      paddingRight: theme.spacing(1.5),
    },
    originTextContent: {
      "& .text-content": {
        display: "-webkit-box",
        overflow: "hidden",
        // whiteSpace: "normal !important",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        "-webkit-line-clamp": "4 !important",
        "-webkit-box-orient": "vertical",
      },
      "&.repost": {
        padding: 0,
        "& .text-content": {
          // padding: `0 ${theme.spacing(1.5)}px`,
          // marginBottom: theme.spacing(1.25),
        },
      },
      "&.comment, &.repost, &.post-page-view, &.timeline": {
        "& [class*='MuiBox-root']:not(.headline)": {
          alignItems: "flex-start",
        },
      },
    },
    originProfileImage: {
      maxHeight: theme.spacing(35.5),
      borderRadius: "0 0 10px 10px",
    },
    commentProfileImage: {
      maxHeight: theme.spacing(35.5),
      objectFit: "contain",
      backgroundColor: "black",
    },
    originSmallImage: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      borderRadius: 10,
      marginRight: theme.spacing(2),
      objectFit: "cover",
      flexShrink: 0,
      backgroundColor: theme.palette.grey.A300,
      "&.noCursor": {
        cursor: "auto",
      },
    },
    videoWrapper: {
      borderRadius: 10,
      overflow: "hidden",
      marginTop: 15,
      "& video": {
        width: "100%",
        outline: "none",
        height: theme.spacing(35.5),
      },
    },
    repostOriginVideoWrapper: {
      borderRadius: 0,
      marginTop: 0,
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
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1),
      [theme.breakpoints.only("xs")]: {
        width: theme.spacing(2.25),
        height: theme.spacing(2.25),
        marginRight: theme.spacing(0.375),
      },
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
      marginRight: theme.spacing(0.375),
      paddingTop: theme.spacing(0.25),
    },
    userAtNameShort: {
      color: theme.palette.text.gray,
      flexShrink: 99,
      marginRight: theme.spacing(0.375),
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
      marginLeft: theme.spacing(0.375),
      fontWeight: "400",
    },
    dot: {
      color: theme.palette.text.gray,
      display: "flex",
      fontSize: 16,
      flexShrink: 0,
      marginLeft: theme.spacing(0.875),
      marginRight: theme.spacing(0.875),
      [theme.breakpoints.only("xs")]: {
        marginLeft: theme.spacing(0.375),
        marginRight: theme.spacing(0.375),
      },
    },
    sinceTime: {
      color: theme.palette.text.gray,
      display: "flex",
      flexShrink: 0,
    },
    unavailablePost: {
      border: "1px solid #E0E6EA",
      backgroundColor: "#F3F5F8",
      borderRadius: 10,
      width: "100%",
      padding: theme.spacing(1.75),
      color: theme.palette.text.gray,
      lineHeight: "15px",
      marginTop: theme.spacing(1.25),
    },
    imageAlt: {
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: theme.spacing(35.5),
      objectFit: "cover",
      [theme.breakpoints.down("xs")]: {
        minHeight: theme.spacing(19.375),
      },
      "&.noCursor": {
        cursor: "auto",
      },
      "&.gif": {
        maxHeight: theme.spacing(35.5),
        objectFit: "contain",
        backgroundColor: "black",
      },
    },
    repostTilledImg: {
      maeginTop: theme.spacing(1.25),
    },
    repostHasNoFilesForText: {
      padding: "0 12px",
    },
    repostHasNoFilesForImage: {
      "&.main-image": {
        borderRadius: "0 0 10px 10px",
      },
    },
  }),
);

const _getSharedPost = (postId, userFeed) => {
  return userFeed.data.find((xPostItem) =>
    typeof xPostItem?.getPost === "function"
      ? xPostItem.getPost() === postId
      : null,
  );
};

const connector = connect((state) => {
  return {
    userInfo: state.auth.session?.userinfo,
    userFeed: state.timelineNew.userFeed,
  };
}, {});

export const PostContentView = connector(_PostContentView);
function _PostContentView(props) {
  const {
    item,
    scene,
    objId,
    obj,
    originalPosterInfo,
    pageType,
    sharedObj,
    hasMediaRepost,
    type,
    userFeed,
    detailedRepostUserData,
    hasFiles,
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const [text, setText] = useState("");
  const [imageURLs, setImageURLs] = useState([]);
  const [videoURL, setVideoURL] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [imagesOpen, setImagesOpen] = useState(false);
  const [previewMetaData, setPreviewMetaData] = useState(null);
  const [imageContainerDimensions, setImageContainerDimensions] =
    useState(null);
  const [isErrorVideoImg, setIsErrorVideoImg] = useState(false);

  const imageContainerRef = useRef(null);

  const postObject = XObject.Unwrap(obj);
  const {meta: imgData} = obj.data;
  const {twt_rtpst: twitterPost} = postObject ?? {};

  useEffect(() => {
    if (!imgData) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const {
        contentRect: {width, height},
      } = entries[0];
      setImageContainerDimensions({width, height});
    });
    const imageContainerRect =
      imageContainerRef.current?.getBoundingClientRect();
    if (imageContainerRect) {
      resizeObserver.observe(imageContainerRef.current);
      const {width, height} = imageContainerRect;
      setImageContainerDimensions({width, height});
    }

    return () => {
      if (imageContainerRef?.current) {
        resizeObserver.unobserve(imageContainerRef?.current);
      }
    };
  }, []);

  useEffect(() => {
    getMetaData();
  }, [objId]);

  useEffect(() => {
    if (obj) {
      const newText = obj.getText();
      setText(newText);
      const newImageURLs =
        obj && obj.getImageURLs ? obj.getImageURLs() || [] : [];
      setImageURLs(newImageURLs);
      let newVideoURL = {
        m3u8: obj.getVideoUrl ? obj.getVideoUrl() : "",
        ori: obj.getOriginalVideoUrl ? obj.getOriginalVideoUrl() : "",
        screen: obj.getMainImageURL ? obj.getMainImageURL() : "",
      };
      if (newVideoURL?.ori?.m3u8) {
        newVideoURL = newVideoURL.ori;
      }
      setVideoURL(newVideoURL);
    }
  }, [obj]);

  const getMetaData = () => {
    if (!obj) return;

    if (obj?.data?.prevsrc) {
      setPreviewMetaData({
        imageUrl: obj.data.previmg,
        url: obj.data.prevsrc,
        title: checkNCR(obj.data.ttl) ? ncrDecode(obj.data.ttl) : obj.data.ttl,
        description: checkNCR(obj.data.dsc)
          ? ncrDecode(obj.data.dsc)
          : obj.data.dsc,
      });
    } else {
      let siteUrls = [];

      URI.withinString(obj.data?.txt, function (url) {
        siteUrls.push(url);
      });

      if (siteUrls.length > 0) {
        let siteUrl = siteUrls[0];
        if (youtubeFormat(siteUrl)) {
          setPreviewMetaData({url: siteUrl});
        }
      }
    }
  };

  let textComps = null;
  let imageComp = null;
  let videoComp = null;

  if (obj) {
    const xPostItem = obj.createXPostItem();

    if (obj.getText && obj.getOwnerId) {
      const posterId = obj.getOwnerId();
      const posterInfo = xPostItem?.getUserInfo();
      const displayId =
        posterInfo?.data?.ousername ||
        originalPosterInfo?.ousername ||
        posterInfo?.data?.username ||
        posterId;
      const updatedTS = obj.getCreatedTS(null);
      const lang = getLang();
      const sinceTime = updatedTS
        ? TimeUtil.SinceTimeV5(updatedTS, Date.now(), lang, false)
        : null;
      const sinceTimeFormat = updatedTS
        ? TimeUtil.SinceTimeV4(updatedTS, Date.now(), false)
        : null;

      let displayName = XUserInfo.GetNickname(posterInfo, null);
      if (!displayName) {
        displayName = originalPosterInfo?.nickname;
      }

      let avatarUrl = XUserInfo.GetIconUrl(posterInfo, null);
      if (!avatarUrl) {
        avatarUrl = originalPosterInfo?.ico;
      }

      const textComp = (
        <HighlightLink
          text={text}
          type={type}
          previewUrl={previewMetaData?.url}
        />
      );
      if (type === "repostOrigin" || (/repost/.test(scene) && hasFiles)) {
        textComps = (
          <div
            className={clsx(classes.originTextContent, scene)}
            style={{
              marginTop: 0,
            }}
          >
            {type !== "repostOrigin" && /repost/.test(scene) ? null : (
              <div className={classes.originHeadline}>
                <Box
                  display="flex"
                  alignItems="center"
                  mr={1}
                  className="headline"
                  style={{width: "100%"}}
                >
                  <HoverPopup userId={posterId} userInfoTemp={posterInfo}>
                    <div key="popup-handler" className="user-avatar">
                      <AvatarLink
                        avatarUrl={detailedRepostUserData?.ico ?? avatarUrl}
                        styleClasses={classes.avatar}
                        userId={posterId}
                        username={displayName}
                      />
                    </div>
                  </HoverPopup>
                  <HoverPopup
                    userId={posterId}
                    userInfoTemp={posterInfo}
                    leftAligned={true}
                  >
                    <div
                      key="popup-handler"
                      name="handler"
                      className={classes.hoverPopup}
                    >
                      <div className={classes.userDisplayName}>
                        <UserLabelLink
                          userId={posterId}
                          nickname={
                            detailedRepostUserData?.nickname ?? displayName
                          }
                        />
                      </div>
                      {posterInfo?.isInfluencer &&
                        posterInfo?.isInfluencer() > 0 && (
                          <div className={classes.influencer}>
                            <VerificationIcon className={classes.icon} />
                          </div>
                        )}
                      <div
                        className={
                          sinceTimeFormat
                            ? classes.userAtNameShort
                            : classes.userAtName
                        }
                      >
                        @{displayId}
                      </div>
                    </div>
                  </HoverPopup>

                  <div className={classes.dot}>·</div>
                  <div className={classes.sinceTime}>{sinceTime}</div>
                </Box>
              </div>
            )}
            {Util.StringIsEmpty(text) &&
            !(
              /comment|repost/.test(scene) ||
              (/post-page-view|timeline|profile/.test(scene) && hasMediaRepost)
            ) ? (
              <div style={{paddingBottom: 3}} />
            ) : (
              <Box
                display="flex"
                alignItems="center"
                className={clsx(classes.originMedia)}
              >
                {(/comment|repost/.test(scene) ||
                  (/post-page-view|timeline|profile/.test(scene) &&
                    hasMediaRepost)) &&
                imageURLs &&
                imageURLs.length > 0 ? (
                  imageURLs[0].startsWith("https://") ||
                  imageURLs[0].startsWith("http://") ? (
                    <img
                      src={imageURLs[0]}
                      alt=""
                      className={`${classes.originSmallImage} noCursor`}
                      onError={(event) => event.target.classList.add("error")}
                    />
                  ) : (
                    <img
                      src={handleMediaUrl(
                        process.env.REACT_APP_MEDIA_BASE,
                        zoomImage(imageURLs[0], 500, 0),
                      )}
                      alt=""
                      className={`${classes.originSmallImage} noCursor`}
                      onError={(event) => event.target.classList.add("error")}
                    />
                  )
                ) : null}
                {(/comment|repost/.test(scene) ||
                  (/post-page-view|timeline|profile/.test(scene) &&
                    hasMediaRepost)) &&
                videoURL &&
                videoURL.m3u8 ? (
                  videoURL.screen && !isErrorVideoImg ? (
                    <img
                      src={handleMediaUrl(
                        process.env.REACT_APP_MEDIA_BASE,
                        zoomImage(videoURL.screen, 500, 0),
                      )}
                      alt="img"
                      className={classes.originSmallImage}
                      onError={(event) => event.target.classList.add("error")}
                    />
                  ) : (
                    !(isErrorVideoImg && Util.StringIsEmpty(text)) && (
                      <div className={classes.originSmallImage} />
                    )
                  )
                ) : null}
                {textComp}
              </Box>
            )}
          </div>
        );
      } else if (/comment/.test(scene)) {
        const allUrl = [
          ...imageURLs,
          ...(videoURL && videoURL.m3u8 ? [videoURL.m3u8] : []),
        ];
        textComps = (
          <div className={classes.omittedWrapper}>
            {textComp}
            {allUrl.length ? (
              <span>
                {text ? "," : null}
                {getShortUrls({urls: allUrl, width: 403}).join(", ")}
              </span>
            ) : null}
          </div>
        );
      } else {
        textComps = (
          <div
            className={
              /repost/.test(scene) && !hasFiles
                ? classes.repostHasNoFilesForText
                : ""
            }
          >
            {textComp}
          </div>
        );
      }
    }

    let imageClassName = "";
    if (type === "repostOrigin") {
      imageClassName = classes.originProfileImage;
    } else if (pageType === "comment-detail") {
      imageClassName = classes.commentProfileImage;
    }

    let imageBodyComp = null;
    if (imageURLs?.length === 1 && imageURLs[0]) {
      const imageUrl = imageURLs[0];
      if (scene !== "comment" || pageType === "repostOrigin") {
        let formattedUrl = imageUrl;
        const isAbsolutePath =
          imageUrl.startsWith("https://") || imageUrl.startsWith("http://");

        if (!isAbsolutePath) {
          formattedUrl = handleMediaUrl(
            process.env.REACT_APP_MEDIA_BASE,
            imageUrl,
          );
        }
        if (imageUrl.includes(".gif")) {
          imageComp = (
            <GifImage
              imageUrl={formattedUrl}
              imageClassName={imageClassName}
              handleClick={(e) => {
                e.stopPropagation();
                setImagesOpen(true);
              }}
              height={obj.data?.vid_hgt}
              width={obj.data?.vid_wid}
            />
          );
        } else {
          imageBodyComp = (
            <img
              src={formattedUrl}
              onClick={(e) => {
                if (!isAbsolutePath) {
                  e.stopPropagation();
                  setImagesOpen(true);
                }
              }}
              className={`${classes.imageAlt} ${imageClassName}${
                isAbsolutePath && " noCursor"
              } ${imageUrl.match(/[^\.]+$/)[0]}`}
              style={
                imgData
                  ? getImageStyleFromMetadata(
                      imgData[0],
                      imageContainerDimensions?.width,
                      imageContainerDimensions?.height,
                    )
                  : null
              }
              onError={(event) => event.target.classList.add("error")}
            />
          );
        }
      }
    } else if (imageURLs?.length > 1) {
      imageBodyComp =
        scene !== "comment" || pageType === "repostOrigin" ? (
          <TiledImages
            imageURLs={imageURLs}
            imageClassName={imageClassName}
            handleClick={(index) => {
              setImagesOpen(true);
              setCurrentIndex(index);
            }}
            imgData={imgData}
          />
        ) : null;
    }

    imageComp = imageBodyComp ? (
      <Fragment>
        <div
          className={clsx(
            "main-image",
            imageURLs.length === 1 && "single-image",
            pageType === "comment-detail" && classes.commentProfileImage,
            /repost/.test(scene) &&
              !hasFiles &&
              classes.repostHasNoFilesForImage,
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
          ref={imageContainerRef}
        >
          {imageBodyComp}
        </div>
      </Fragment>
    ) : (
      imageComp
    );

    videoComp =
      videoURL?.m3u8 || videoURL?.ori ? (
        scene !== "comment" || pageType === "repostOrigin" ? (
          <div
            className={clsx(
              "main-video",
              classes.videoWrapper,
              type === "repostOrigin" && classes.repostOriginVideoWrapper,
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <VideoPlayer
              postObj={obj}
              options={{
                autoplay: false,
                muted: true,
                controls: true,
                fluid: true,
                responsive: true,
                playbackRates: [1, 1.25, 1.5, 1.75, 2],
                sources: [
                  {
                    src: handleMediaUrl(
                      process.env.REACT_APP_MEDIA_BASE,
                      videoURL.m3u8,
                    ),
                    type: "application/x-mpegurl",
                  },
                  {
                    src: handleMediaUrl(
                      process.env.REACT_APP_MEDIA_BASE,
                      videoURL.ori,
                    ),
                    type: "video/mp4",
                  },
                ],
              }}
            />
          </div>
        ) : (
          <span>{videoURL.ori}</span>
        )
      ) : null;
  }

  let originPostComp = null;
  if (type !== "repostOrigin" && scene !== "repost") {
    let _originalPosterInfo = originalPosterInfo;
    let _sharedObj = sharedObj;

    if (obj.data?.rpstIds?.length && !_sharedObj) {
      const target = _getSharedPost(obj.data?.rpstIds[0], userFeed);
      if (!target) {
        //post is deleted
        originPostComp = (
          <div className="unavailable-post-container">
            <div className={classes.unavailablePost}>
              {t("getter_fe.post.tips.unavailable_post")}
            </div>
          </div>
        );
      } else {
        _sharedObj = target.getPost();
        //no content repost
        if (
          target.isShared() &&
          target.getPosterId() !== target.getOriginalPosterId()
        )
          _originalPosterInfo = target.getOriginalPosterInfo()?.data;
        else _originalPosterInfo = target.getUserInfo()?.data;
      }
    }

    if (_sharedObj) {
      const origPostId = _sharedObj.getId();

      originPostComp = (
        <div
          className={
            pageType === "comment-detail"
              ? classes.commentTextContent
              : classes.textContent
          }
        >
          <div className={classes.originPost}>
            <PostContentView
              objId={origPostId}
              obj={_sharedObj}
              classes={classes}
              type="repostOrigin"
              originalPosterInfo={_originalPosterInfo}
              hasMediaRepost={
                (imageURLs && imageURLs.length > 0) ||
                videoURL?.m3u8 ||
                videoURL?.ori ||
                previewMetaData
              }
              detailedRepostUserData={
                item.aux?.uinf ? item.aux?.uinf[item.aux?.shrdpst?.uid] : {}
              }
              scene={scene}
            />
          </div>
        </div>
      );
    }
  }

  if (
    text === "Content Not Found" &&
    imageURLs &&
    !imageURLs.length &&
    !videoURL?.m3u8 &&
    !videoURL?.ori &&
    !videoURL?.screen
  ) {
    return (
      <div className="unavailable-post-container">
        <div className={classes.unavailablePost}>
          {t("getter_fe.post.tips.unavailable_post")}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        if (type === "repostOrigin") {
          e.stopPropagation();
          history.push(`/post/${objId}`);
        }
      }}
    >
      <Fragment>
        <div
          className={clsx(
            classes.rootContentView,
            imageURLs && imageURLs.length > 1 && classes.mainImages,
            "comment-reposted-post",
            scene,
          )}
        >
          {type === "repostOrigin" ? (
            <div
              className={clsx(classes.originPostContent, scene)}
              onMouseOver={(e) => e.stopPropagation()}
            >
              <div>{textComps}</div>
              {/post-page-view|timeline|profile/.test(scene) &&
                !hasMediaRepost &&
                imageComp}
              {/post-page-view|timeline|profile|search/.test(scene) &&
                ((isErrorVideoImg && Util.StringIsEmpty(text)) ||
                  !hasMediaRepost) &&
                videoComp}
              {/post-page-view|timeline|profile/.test(scene) &&
              previewMetaData ? (
                <PreviewContent
                  previewMetaData={previewMetaData}
                  scene="postContentView"
                  hasMediaRepost={Boolean(hasMediaRepost)}
                  hasImageOrVideo={
                    imageURLs.length ||
                    videoURL?.m3u8 ||
                    videoURL?.ori ||
                    videoURL?.screen
                  }
                  type={type}
                />
              ) : null}
            </div>
          ) : (
            <Fragment>
              <div>{textComps}</div>
              {(!/comment|repost/.test(scene) ||
                (/repost/.test(scene) && !hasFiles)) &&
                imageComp}
              {(!/comment|repost/.test(scene) ||
                (/repost/.test(scene) && !hasFiles)) &&
                videoComp}
              {previewMetaData?.title ||
              previewMetaData?.imageUrl ||
              youtubeFormat(previewMetaData?.url) ? (
                <PreviewContent
                  previewMetaData={previewMetaData}
                  scene={scene}
                  hasMediaRepost={
                    /comment|repost/.test(scene) || hasMediaRepost
                  }
                  hasImageOrVideo={
                    imageURLs.length ||
                    videoURL?.m3u8 ||
                    videoURL?.ori ||
                    videoURL?.screen
                  }
                  type={type}
                />
              ) : null}
              {originPostComp}
            </Fragment>
          )}
          {/* Shared PopupImages */}
          {imageURLs && (
            <PopupImages
              imageURLs={imageURLs}
              open={imagesOpen}
              onClose={() => {
                setImagesOpen(false);
              }}
              currentIndex={currentIndex}
              item={item}
              postId={objId}
            />
          )}
        </div>
        {twitterPost ? (
          <div className={classes.originPostContent}>
            <TwitterContentView
              twitterPost={twitterPost}
              scene={scene}
              type={type}
            />
          </div>
        ) : null}
      </Fragment>
    </div>
  );
}
