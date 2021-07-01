import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {LinearProgress} from "@material-ui/core";
import PopupDialog from "../../app/components/PopupDialog";
import {ReactComponent as LoadingIcon} from "src/assets/icons/timeline/loading.svg";

const useStyles = makeStyles((theme) => ({
  defaultLoaderWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 10,
  },
  loader: {
    margin: "auto",
    height: ({type}) => (type === "small" ? 20 : 41),
    width: ({type}) => (type === "small" ? 20 : 41),
    animation: "$spin 1s linear infinite",
  },

  linearProgress: {
    margin: "auto",
    height: 6,
    width: 300,
    backgroundColor: theme.palette.background.light,
    borderRadius: 8,
    "& .MuiLinearProgress-barColorPrimary": {
      borderRadius: 8,
    },
  },
  popupLoaderWrapper: {
    "& .popup-content": {
      width: "394px !important",
      "& .header": {
        border: "none",
        "& .icon.cancel": {
          top: "18px",
          right: "18px",
        },
      },
      "& .content": {
        textAlign: "center",
        padding: "0 0 50px !important",
        "& .tips": {
          fontSize: "20px",
          fontWeight: 800,
          padding: "24px 72px",
          color: theme.palette.text.primary,
        },
        "& .MuiLinearProgress-root": {
          marginTop: "16px",
        },
      },
    },
  },
  loaderWrapper: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: ({isButton}) => (isButton ? 0 : "0 0 50px !important"),

    "& .tips": {
      fontSize: "20px",
      fontWeight: 800,
      padding: "24px 72px",
      color: theme.palette.text.primary,
    },
    "& .MuiLinearProgress-root": {
      marginTop: "16px",
    },
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const GLoader = ({
  progress,
  isPopup,
  tips,
  wrapperStyle,
  notCloseOnDocumentClick,
  withBorderRadius,
  type = "normal",
  isButton,
  color = "primary",
}) => {
  const classes = useStyles({isButton, color, type});

  const loaderContent = (
    <>
      {progress > -1 ? (
        <LinearProgress
          variant="determinate"
          value={progress}
          className={classes.linearProgress}
          size={41}
          thickness={2}
        />
      ) : (
        <LoadingIcon className={classes.loader} />
      )}
    </>
  );

  return !isPopup ? (
    <div
      style={{...wrapperStyle, borderRadius: withBorderRadius ? 6 : 0}}
      className={!wrapperStyle ? classes.defaultLoaderWrapper : ""}
    >
      <div className={classes.loaderWrapper}>
        {tips ? <h5 className="tips">{tips}</h5> : null}
        {loaderContent}
      </div>
    </div>
  ) : (
    <div className={classes.popupLoaderWrapper}>
      <PopupDialog
        nested={true}
        open={true}
        hasOK={true}
        hasCancel={true}
        needDoNothing={true}
        parentComp={this}
        trigger={<div />}
        closeOnDocumentClick={notCloseOnDocumentClick ? false : true}
      >
        <h5 className="tips">{tips}</h5>
        {loaderContent}
      </PopupDialog>
    </div>
  );
};
