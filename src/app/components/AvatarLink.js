import React, {useState} from "react";
import clsx from "clsx";
import {useHistory} from "react-router-dom";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {Avatar} from "@material-ui/core";
import emojiRegex from "emoji-regex";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {handleMediaUrl} from "src/util/imageUtils";
import {ReactComponent as DefaultAvatarImage} from "src/assets/images/avatar148.svg";
import {zoomImage} from "src/util/imageUtils";
import {PopupImages} from "src/app/components/PopupImages";

const useStyles = makeStyles((theme) =>
  createStyles({
    avatar: {
      border: `1px solid ${theme.palette.line.grey_2}`,
      boxSizing: "content-box",
      "& span": {
        width: "100%",
        textAlign: "center",
        letterSpacing: "-0.05em",
      },
    },
  }),
);

export const AvatarLink = ({
  avatarUrl,
  styleClasses,
  userId,
  username,
  userNotExist,
  noRedirect = false,
  bigAvatar = false,
  disableHistoryPush,
  openUserMenu,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [hasImage, setHasImage] = useState(!!avatarUrl);
  const [imagesOpen, setImagesOpen] = useState(false);

  const handleClick = (e) => {
    if (!noRedirect) {
      e.stopPropagation();
      history.push(`/user/${userId}`);
    } else {
      e.stopPropagation();
      hasImage && setImagesOpen(true);
    }
  };

  const alt = username || userId || "G";
  const [all, emojiStr, subStr] = alt.match(
    new RegExp(`^(${emojiRegex().source})?(.{0,2})`),
  );
  const text = emojiStr || subStr;
  const handleBrokenImage = (e) => setHasImage(false);

  return (
    <>
      <Avatar
        alt={alt}
        src={zoomImage(
          handleMediaUrl(process.env.REACT_APP_MEDIA_BASE, avatarUrl),
          bigAvatar ? 400 : 70,
          bigAvatar ? 400 : 70,
        )}
        className={clsx(classes.avatar, styleClasses)}
        onClick={(e) => {
          openUserMenu
            ? openUserMenu(true)
            : !disableHistoryPush && handleClick(e);
        }}
        imgProps={{onError: handleBrokenImage}}
      >
        {userNotExist ? (
          <DefaultAvatarImage />
        ) : (
          <GTwemoji text={alt.charCodeAt(0) > 255 ? text : alt[0]} />
        )}
      </Avatar>
      <div>
        {avatarUrl && (
          <PopupImages
            imageURLs={[avatarUrl]}
            open={imagesOpen}
            onClose={() => {
              setImagesOpen(false);
            }}
            type="avatar"
            currentIndex={1}
          />
        )}
      </div>
    </>
  );
};
