import React, {useState} from "react";
import {useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {createStyles, makeStyles} from "@material-ui/core";
import clsx from "clsx";
import {ReactComponent as IconClose20} from "src/assets/icons/icon_circlefull_close.svg";
import {t} from "../../i18n/utils";
import {Gif} from "@giphy/react-components";
import {GiphyLogo} from "src/app/components/GiphyLogo";
import {getVideoImage} from "src/util/imageUtils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& .file": {
        position: "relative",
        padding: "6px",
        "& > .wrapper": {
          zIndex: 1,
          position: "relative",
          border: "1px solid rgba(0,0,0,.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "290px",
          borderRadius: "10px",
          overflow: "hidden",
          "&.single-image": {
            maxHeight: "500px",
          },
          "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            "&.gif": {
              objectFit: "contain",
              backgroundColor: "black",
            },
          },
          "& video": {
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "#000000",
            outline: "none",
          },
          "& .giphy-gif": {
            width: "100%",
          },
        },
        "& .remove": {
          position: "absolute",
          right: -2,
          top: -2,
          "& > svg": {
            width: theme.spacing(5),
            height: theme.spacing(5),
          },
          cursor: "pointer",
          borderRadius: "50%",
          "& svg": {
            transform: "scale(.66)",
            fill: "rgba(0,0,0,.8)",
            transition: "fill .3s",
            verticalAlign: "top",
          },
          "&:hover svg": {
            fill: "rgba(0,0,0,.6)",
          },
        },
        "&.tiny > .wrapper": {
          width: "100%",
          height: "100%",
          "& img": {
            height: "156px",
          },
        },
      },
    },
    hasFile: {
      margin: "10px -6px",
    },
    noSupport: {
      backgroundColor: "rgba(0,0,0,.1)",
      height: "288px",
    },
    typeTag: {
      position: "absolute",
      bottom: "10px",
      left: "10px",
      fontSize: "15px",
      backgroundColor: "rgba(0,0,0,.5)",
      color: "#fff",
      borderRadius: "3px",
      padding: "4px",
      fontWeight: 500,
      lineHeight: "14px",
      textTransform: "uppercase",
    },
  }),
);

export const GDisplayFiles = ({files, type, onDelete, gif, onGifDelete}) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));
  const [poster, setPoster] = useState("");
  if (type === "video" && mobileMatches) {
    getVideoImage(files[0]).then((poster) => {
      setPoster(poster);
    });
  } else if (poster) {
    setPoster("");
  }
  if (gif) {
    return (
      <div className={clsx(classes.root, classes.hasFile)}>
        <div className="file" style={{width: "100%"}}>
          <div className="wrapper">
            <Gif gif={gif} noLink hideAttribution></Gif>
            <span className={classes.typeTag}>GIF</span>
            <div
              className="remove"
              onClick={() => onGifDelete && onGifDelete()}
            >
              <IconClose20 />
            </div>
          </div>
        </div>
        <GiphyLogo />
      </div>
    );
  }
  return (
    <div className={clsx(classes.root, files?.length && classes.hasFile)}>
      {files?.map((item, i) => {
        return (
          <div
            key={i}
            className={clsx("file", files.length > 2 && "tiny")}
            style={{
              width: `${100 / Math.min(3, files.length)}%`,
            }}
          >
            <div
              className={clsx(
                "wrapper",
                /.mov$/.test(item) && classes.noSupport,
                files.length === 1 && type !== "video" && "single-image",
              )}
            >
              {type !== "video" ? (
                <>
                  <img src={item} alt="" className={type} />
                  {type === "gif" && (
                    <span className={classes.typeTag}>GIF</span>
                  )}
                </>
              ) : !/.mov$/.test(item) ? (
                <video src={item} controls {...(poster ? {poster} : {})}>
                  {t("getter_fe.post.tips.not_support_video")}
                </video>
              ) : (
                <div>{t("getter_fe.post.tips.not_support_video_priview")}</div>
              )}
              <div
                className="remove"
                onClick={() => (onDelete ? onDelete(i, type) : {})}
              >
                <IconClose20 />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
