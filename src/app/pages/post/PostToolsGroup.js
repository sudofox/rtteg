import React, {useRef} from "react";
import {createStyles, makeStyles, Tooltip} from "@material-ui/core";
import {toast} from "react-toastify";
import clsx from "clsx";
import {FileUploader} from "../../components/FileUploader";
import {GEmojiPicker} from "../../../styles/components/GEmojiPicker";
import {GGiphyPicker} from "../../../styles/components/GGiphyPicker";
import {NotifMessage} from "../../components/notifications/NotifMessage";

import {ReactComponent as IconPic} from "src/assets/icons/feature/img.svg";
import {ReactComponent as IconGif} from "src/assets/icons/feature/gif.svg";

import {t} from "../../../i18n/utils";

const IMAGES_NUMBER_LIMIT = 6;
const VIDEOS_NUMBER_LIMIT = 1;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      whiteSpace: "nowrap",
      "&.tools-group": {
        display: "flex",
        marginRight: "auto",
        marginLeft: "-4px !important",

        "& .tool": {
          transition: ".1s all ease-in-out",
          marginRight: `20px !important`,
          padding: theme.spacing(1),
          [theme.breakpoints.only("xs")]: {
            "&:last-child": {
              marginRight: "auto !important",
            },
          },
          "& span.icon": {
            width: "auto",
            height: "auto",

            "& svg": {
              width: 20,
              height: 20,
              fill: "transparent",
            },
          },
        },
      },
    },
    iconContainer: {
      width: 30,
      height: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        borderRadius: "100%",
        backgroundColor: "#EDF7FF",
      },
    },
    iconText: {
      marginLeft: 5,
    },
    capitilizeText: {
      textTransform: "uppercase",
    },
    imgIcon: {
      "& path": {
        fill: theme.blue.light,
      },
    },
    gifIcon: {
      "& path": {
        fill: theme.blue.light,
      },
    },
  }),
);

/**
 * Prototype input box for creating a post.
 */
export const PostToolsGroup = ({
  gif,
  scenes,
  onSelectFiles,
  onSelectEmoji,
  onSelectGiphy,
  setupDeleteFile,
  setupUploadFiles,
  filesToRestore,
  onCloseEmoji,
}) => {
  const classes = useStyles();
  const fileInputRef = useRef();

  return (
    <div className={`${classes.root} tools-group`}>
      <div
        className="tool"
        onClick={() => {
          const _fileInput = fileInputRef.current;
          if (gif) {
            toast.info(
              <NotifMessage
                message={t("getter_fe.post.tips.gif_with_media")}
              />,
              {
                type: toast.TYPE.WARNING,
              },
            );
          } else if (
            _fileInput.getAttribute("uploaded-type") === "video" &&
            Number(_fileInput.getAttribute("uploaded-number")) >=
              VIDEOS_NUMBER_LIMIT
          ) {
            toast.info(
              <NotifMessage
                message={t("getter_fe.post.tips.at_most_videos", {
                  number: VIDEOS_NUMBER_LIMIT,
                })}
              />,
              {
                type: toast.TYPE.WARNING,
              },
            );
          } else if (
            _fileInput.getAttribute("uploaded-type") === "image" &&
            Number(_fileInput.getAttribute("uploaded-number")) >=
              IMAGES_NUMBER_LIMIT
          ) {
            toast.info(
              <NotifMessage
                message={t("getter_fe.post.tips.at_most_images", {
                  number: IMAGES_NUMBER_LIMIT,
                })}
              />,
              {
                type: toast.TYPE.WARNING,
              },
            );
          } else {
            setTimeout(() => fileInputRef.current.click(), 100);
          }
        }}
      >
        <Tooltip title={t("getter_fe.post.button.media")} aria-label="media">
          <span className="icon">
            <span className={classes.iconContainer}>
              <IconPic className={classes.imgIcon} />
            </span>
            <span className={classes.iconText}>
              {t("getter_fe.post.button.media")}
            </span>
          </span>
        </Tooltip>
      </div>
      <GEmojiPicker
        onSelect={(e, em) => {
          onSelectEmoji && onSelectEmoji(e, em);
        }}
        onClose={onCloseEmoji}
      />
      <GGiphyPicker
        validateBeforeClick={() => {
          if (fileInputRef.current.getAttribute("uploaded-number") == 0) {
            // don't use ===
            return true;
          } else {
            toast.info(
              <NotifMessage
                message={t("getter_fe.post.tips.gif_with_media")}
              />,
              {
                type: toast.TYPE.WARNING,
              },
            );
            return false;
          }
        }}
        onSelect={(gif) => {
          onSelectGiphy && onSelectGiphy(gif);
        }}
      >
        <div className="tool">
          <Tooltip title={t("getter_fe.post.button.gif")} aria-label="gif">
            <span className="icon">
              <span className={classes.iconContainer}>
                <IconGif className={classes.gifIcon} />
              </span>
              <span className={clsx(classes.iconText, classes.capitilizeText)}>
                {t("getter_fe.post.button.gif")}
              </span>
            </span>
          </Tooltip>
        </div>
      </GGiphyPicker>
      <FileUploader
        fileInputRef={fileInputRef}
        onSelect={onSelectFiles || (() => {})}
        scenes={scenes}
        setupDeleteFile={setupDeleteFile}
        setupUploadFiles={setupUploadFiles}
        filesToRestore={filesToRestore}
      />
    </div>
  );
};
