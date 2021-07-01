import {Avatar, makeStyles} from "@material-ui/core";
import {useState} from "react";
import {TimeUtil} from "src/core/Util";
import {getLang} from "src/i18n/utils";
import {GTwemoji} from "src/styles/components/GTwemoji";
import HighlightLink from "../../HighlightLink";
import {PopupImages} from "../../PopupImages";
import TiledImages from "../../TiledImages";
import {VideoPlayer} from "../../VideoPlayer";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  headline: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    color: theme.palette.text.secondary,
    padding: theme.spacing(1.5),
  },
  name: {
    color: theme.palette.text.primary,
    fontWeight: 700,
    fontSize: 15,
    marginRight: theme.spacing(0.5),
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
  body: {
    padding: theme.spacing(1.5),
    paddingTop: 0,
    fontSize: ({detail}) => (detail ? 24 : 15),
    fontWeight: 400,
  },
  media: {
    maxHeight: ({isPostWithPreview}) => (isPostWithPreview ? 500 : 284),
    display: "grid",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  icon: {
    marginRight: theme.spacing(0.75),
    width: 16,
    height: 16,
  },
}));

export const TwitterContentView = ({twitterPost, type}) => {
  const [imagesOpen, setImagesOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    clean_tweet: cleanTweet,
    created_at: createdAt,
    name,
    photos,
    profile_image: profileImage,
    username,
    video_info: videoInfo,
    verified,
  } = twitterPost;

  const isDetail = type === "post-detail" || type === "comment-detail";

  const classes = useStyles({
    detail: isDetail,
    isPostWithPreview: videoInfo?.info || photos.length,
  });

  const safeDateString = createdAt?.split(" ").slice(0, -1).join(" ");

  const sinceTime = TimeUtil.SinceTimeV5(
    moment(safeDateString).utc(),
    Date.now(),
    getLang(),
    false,
  );

  let media = null;
  if (videoInfo?.info) {
    const {aspect_ratio: aspectRatio, variants} = videoInfo.info;

    const [primaryVideoInfo, fallbackVideoInfo] = variants.sort(
      (a, b) => a.bitrate ?? 0 - b.bitrate ?? 0,
    );

    if (
      (primaryVideoInfo?.url && primaryVideoInfo?.content_type) ||
      (fallbackVideoInfo?.url && fallbackVideoInfo?.content_type)
    ) {
      media = (
        <VideoPlayer
          _isVertical={aspectRatio[0] < aspectRatio[1]}
          options={{
            autoplay: false,
            muted: true,
            controls: true,
            fluid: true,
            responsive: true,
            playbackRates: [1, 1.25, 1.5, 1.75, 2],
            sources: [
              {
                src: primaryVideoInfo?.url,
                type: primaryVideoInfo?.content_type,
              },
              {
                src: fallbackVideoInfo?.url,
                type: fallbackVideoInfo?.content_type,
              },
            ],
          }}
        />
      );
    }
  } else if (photos.length) {
    if (photos.length === 1) {
      media = (
        <img
          src={photos[0]}
          className={classes.image}
          onClick={(e) => {
            e.stopPropagation();
            setImagesOpen(true);
          }}
          onError={(event) => event.target.classList.add("error")}
        />
      );
    } else {
      media = (
        <TiledImages
          imageURLs={photos}
          handleClick={(index) => {
            setImagesOpen(true);
            setCurrentIndex(index);
          }}
          noZoom={true}
        />
      );
    }
  }

  return (
    <>
      <div className={classes.headline}>
        <Avatar src={profileImage} className={classes.avatar} />
        <h6 className={classes.name}>
          <GTwemoji text={name} />
        </h6>
        {verified ? <VerificationIcon className={classes.icon} /> : null}
        <span>@{username}</span>
        <span className={classes.dot}>·</span>
        {createdAt ? <span>{sinceTime}</span> : null}
      </div>
      <div className={classes.body}>
        <p>
          <HighlightLink text={cleanTweet} type={type} />
        </p>
      </div>
      <div className={classes.media} onClick={(e) => e.stopPropagation()}>
        {media}
      </div>
      {photos ? (
        <PopupImages
          imageURLs={photos}
          open={imagesOpen}
          onClose={() => {
            setImagesOpen(false);
          }}
          currentIndex={currentIndex}
        />
      ) : null}
    </>
  );
};
