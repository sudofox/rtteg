import {useDispatch} from "react-redux";
import {Box, makeStyles} from "@material-ui/core";
import {handleMediaUrl, zoomImage} from "src/util/imageUtils";
import {GifImage} from "../../GifImage";
import TiledImages from "../../TiledImages";
import {VideoPlayer} from "../../VideoPlayer";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {PreviewContent} from "../../PreviewContent";
import HighlightLink from "../../HighlightLink";
import {getDisplayName, getUserName} from "src/util/FeedUtils";
import {TimeUtil} from "src/core/Util";
import {getLang} from "src/i18n/utils";
import HoverPopup from "../../HoverPopup";
import {AvatarLink} from "../../AvatarLink";
import URI from "urijs";
import {youtubeFormat} from "src/util/TextUtil";
import {setPopupImages} from "src/app/components/post/store";
import {TwitterContentView} from "./TwitterContentView";

const REPOST_MEDIA_SIZE = 88;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: 18,
    cursor: "pointer",
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
  dot: {
    color: theme.palette.text.gray,
    fontSize: 16,
    marginLeft: theme.spacing(0.875),
    marginRight: theme.spacing(0.875),
    [theme.breakpoints.only("xs")]: {
      marginLeft: theme.spacing(0.375),
      marginRight: theme.spacing(0.375),
    },
  },
  embeddedText: {
    padding: theme.spacing(0, 1.5, 1.875),
  },
  embeddedContent: {
    border: `1px solid ${theme.palette.line.grey_2}`,
    borderRadius: 10,
    marginTop: theme.spacing(1.5),
    overflow: "hidden",
  },
  embeddedContentBody: {
    display: "grid",
    gridTemplateColumns: `${REPOST_MEDIA_SIZE}px 1fr`,
    padding: theme.spacing(0, 1.5, 1.875),
  },
  embeddedContentHeader: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    color: theme.palette.text.secondary,
    padding: theme.spacing(1.5),
  },
  icon: {
    marginRight: theme.spacing(0.75),
    width: 16,
    height: 16,
  },
  imageContainer: {
    display: "flex",
    maxHeight: 500,
    position: "relative",
  },
  mediaContainer: {
    marginTop: ({isEmbedded}) => (isEmbedded ? 0 : theme.spacing(1)),
    width: ({isEmbedded}) => (isEmbedded ? REPOST_MEDIA_SIZE : null),
    height: ({isEmbedded}) => (isEmbedded ? REPOST_MEDIA_SIZE : null),
    overflow: "hidden",
    borderRadius: 10,
    "& .video-js": {
      height: "100%",
    },
  },
  name: {
    color: theme.palette.text.primary,
    fontWeight: 700,
    fontSize: 15,
    marginRight: theme.spacing(0.5),
  },
  singleImage: {
    minHeight: ({isEmbedded}) => (isEmbedded ? 0 : 284),
    objectFit: "cover",
    height: "100%",
    width: "100%",
  },
  text: {
    fontSize: 15,
    letterSpacing: "0.01em",
    lineHeight: "19.5px",
    wordBreak: "break-word",
  },
}));

const extractYoutubeURL = (txt) => {
  const siteURLs = [];

  URI.withinString(txt, (url) => siteURLs.push(url));

  if (siteURLs.length > 0) {
    const [URL] = siteURLs;
    if (youtubeFormat(URL)) {
      return URL;
    }
  }

  return null;
};

const FeedItemContent = ({
  embeddedPost,
  embeddedUser,
  item,
  loggedinUserId,
  hidePostStatLine,
}) => {
  const classes = useStyles();

  const {
    imgs,
    ovid,
    type,
    twt_rtpst: twitterPost,
    txt,
    vid,
    vid_hgt: mediaHeight,
    vid_wid: mediaWidth,
    ...metadata
  } = item;

  const youtubeURL = extractYoutubeURL(txt);

  let previewMetadata = null;
  if (metadata.prevsrc) {
    previewMetadata = {
      imageUrl: metadata.previmg,
      url: metadata.prevsrc,
      title: metadata.ttl,
      description: metadata.dsc,
    };
  } else if (youtubeURL) {
    previewMetadata = {
      url: youtubeURL,
    };
  }

  const hasMedia = [imgs, ovid, vid].some((item) => item !== undefined);

  return (
    <Box mt={0.5} className={classes.root}>
      {txt?.length > 0 ? (
        <p className={classes.text}>
          <HighlightLink text={txt} previewUrl={previewMetadata?.url} />
        </p>
      ) : null}
      <FeedItemImageContent
        imgs={imgs}
        mediaHeight={mediaHeight}
        mediaWidth={mediaWidth}
        item={item}
        hidePostStatLine={hidePostStatLine}
      />
      <FeedItemVideoContent
        mediaHeight={mediaHeight}
        mediaWidth={mediaWidth}
        ovid={ovid}
        vid={vid}
      />
      <FeedItemEmbeddedContent
        embeddedPost={embeddedPost}
        embeddedUser={embeddedUser}
        item={item}
        loggedinUserId={loggedinUserId}
        hidePostStatLine={hidePostStatLine}
      />
      <PreviewContent
        previewMetaData={previewMetadata}
        hasImageOrVideo={hasMedia}
      />
      {twitterPost ? (
        <div className={classes.embeddedContent}>
          <TwitterContentView twitterPost={twitterPost} type={type} />
        </div>
      ) : null}
    </Box>
  );
};

const FeedItemImageContent = ({
  imgs,
  isEmbedded,
  mediaHeight,
  mediaWidth,
  item,
  hidePostStatLine,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles({isEmbedded});

  if (!Array.isArray(imgs)) {
    return null;
  }

  const imgList = imgs.filter((img) => {
    return img !== undefined && img !== null;
  });

  if (imgList.length == 0) {
    return null;
  }

  const handlePopupImages = (currentIndex) => {
    dispatch(
      setPopupImages({
        imageURLs: imgList,
        item: item,
        open: Number.isInteger(currentIndex),
        onClose: () => handlePopupImages(null),
        currentIndex: currentIndex,
        hidePostStatLine,
      }),
    );
  };

  const getImgHeight = (h) => {
    const maxHeight = 500;

    if (h < maxHeight) {
      return h;
    }

    let height,
      ratio = 0;

    ratio = maxHeight / h;
    height = h * ratio;
    height = height < 0 ? 0 : height;
    return height;
  };

  let imageContentBody = null;
  if (imgList.length === 1 || isEmbedded) {
    const [img] = imgList;
    const isGif = img.includes(".gif");

    const URL = handleMediaUrl(
      process.env.REACT_APP_MEDIA_BASE,
      isGif ? img : zoomImage(img, 500, 0),
    );
    const singleImageProps = {height: mediaHeight, width: mediaWidth};
    const dynamicImageHeight = {height: getImgHeight(mediaHeight)};

    if (isGif) {
      imageContentBody = (
        <GifImage
          handleClick={(e) => {
            e.stopPropagation();
            handlePopupImages(0);
          }}
          imageClassName={classes.singleImage}
          imageUrl={URL}
          {...singleImageProps}
        />
      );
    } else {
      imageContentBody = (
        <img
          className={classes.singleImage}
          onClick={(e) => {
            e.stopPropagation();
            handlePopupImages(0);
          }}
          onError={(event) => event.target.classList.add("error")}
          src={URL}
          style={isEmbedded ? null : dynamicImageHeight}
        />
      );
    }
  } else {
    imageContentBody = (
      <TiledImages
        handleClick={(index) => handlePopupImages(index)}
        imageURLs={imgList}
      />
    );
  }

  return (
    <>
      <div className={`${classes.imageContainer} ${classes.mediaContainer}`}>
        {imageContentBody}
      </div>
    </>
  );
};

const FeedItemVideoContent = ({
  isEmbedded,
  ovid,
  vid,
  mediaHeight,
  mediaWidth,
}) => {
  const classes = useStyles({isEmbedded});

  if (!ovid && !vid) {
    return null;
  }

  const options = {
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
        src: handleMediaUrl(process.env.REACT_APP_MEDIA_BASE, ovid),
        type: "video/mp4",
      },
    ],
  };

  return (
    <div
      className={classes.mediaContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <VideoPlayer options={options} _isVertical={mediaHeight > mediaWidth} />
    </div>
  );
};

const FeedItemEmbeddedContent = ({
  embeddedPost,
  embeddedUser,
  item,
  hidePostStatLine,
}) => {
  const classes = useStyles();

  if (!embeddedPost || !embeddedUser?.id) {
    return null;
  }

  const {
    cdate,
    imgs,
    ovid,
    txt,
    vid,
    vid_hgt: mediaHeight,
    vid_wid: mediaWidth,
    ...metadata
  } = embeddedPost;

  const {ico, id, infl} = embeddedUser;

  const youtubeURL = extractYoutubeURL(txt);

  let previewMetadata = null;
  if (metadata.prevsrc) {
    previewMetadata = {
      imageUrl: metadata.previmg,
      url: metadata.prevsrc,
      title: metadata.ttl,
      description: metadata.dsc,
    };
  } else if (youtubeURL) {
    previewMetadata = {
      url: youtubeURL,
    };
  }

  if (!Array.isArray(imgs)) {
    return null;
  }

  const imgList = imgs.filter((img) => {
    return img !== undefined && img !== null;
  });

  const embeddedUserName = getUserName(embeddedUser);
  const embeddedDisplayName = getDisplayName(embeddedUser);
  const sinceTime = TimeUtil.SinceTimeV5(cdate, Date.now(), getLang(), false);
  const isInfluencer = infl > 0;

  const hasMedia = [imgList, ovid, vid].some(
    (item) => item !== undefined && item !== null,
  );
  const textView =
    txt?.length > 0 ? (
      <p className={`${classes.text} ${classes.embeddedText}`}>
        <HighlightLink text={txt} previewUrl={previewMetadata?.url} />
      </p>
    ) : null;

  return (
    <div className={classes.embeddedContent}>
      <div className={classes.embeddedContentHeader}>
        <HoverPopup userId={id} userInfoTemp={embeddedUser}>
          <AvatarLink
            avatarUrl={ico}
            styleClasses={classes.avatar}
            userId={id}
            username={embeddedDisplayName}
          />
        </HoverPopup>
        <HoverPopup userId={id} userInfoTemp={embeddedUser} leftAligned={true}>
          <h6 className={classes.name}>
            <GTwemoji text={embeddedDisplayName} />
          </h6>
        </HoverPopup>
        {isInfluencer ? <VerificationIcon className={classes.icon} /> : null}
        <span>@{embeddedUserName}</span>
        <span className={classes.dot}>·</span>
        <span>{sinceTime}</span>
      </div>
      {hasMedia ? (
        <div className={classes.embeddedContentBody}>
          <FeedItemImageContent
            imgs={imgList}
            isEmbedded
            item={item}
            mediaHeight={mediaHeight}
            mediaWidth={mediaWidth}
            hidePostStatLine={hidePostStatLine}
          />
          <FeedItemVideoContent
            isEmbedded
            mediaHeight={mediaHeight}
            mediaWidth={mediaWidth}
            ovid={ovid}
            vid={vid}
          />
          {textView}
        </div>
      ) : (
        textView
      )}

      <PreviewContent
        previewMetaData={previewMetadata}
        hasImageOrVideo={hasMedia}
        scene="repost"
      />
    </div>
  );
};

export default FeedItemContent;
