import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {toast} from "react-toastify";
import clsx from "clsx";
import {Typography} from "@material-ui/core";
import {ReactComponent as CheckRound} from "src/assets/icons/checkRound.svg";
import {ReactComponent as EnvelopeSent} from "src/assets/icons/envelopeSent.svg";
import {ReactComponent as IconWarning} from "src/assets/icons/feature/warning.svg";
import AppConsts from "../../../app/AppConsts";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing(0, 2.5),
    backgroundColor: theme.palette.background.notif,
    border: `0.5px solid ${theme.border.inner}`,
    borderRadius: 10,
  },
  iconWrapper: {
    display: "inline-block",
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    height: theme.spacing(2.25),
    "& svg": {
      width: theme.spacing(2.25),
      height: theme.spacing(2.25),
    },
  },
  iconWrapperMessage: {
    height: theme.spacing(3.5),
    "& svg": {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
    },
  },
  message: {
    paddingRight: theme.spacing(0.75),
    color: theme.palette.text.link,
    fontSize: 16,
    lineHeight: "20.8px",
    fontWeight: 500,
    width: "100%",
    "&::first-letter": {
      textTransform: "capitalize",
    },
  },
  wrapperError: {
    backgroundColor: theme.palette.error.background,
    borderColor: theme.palette.error.light,
    "& > p": {
      color: theme.palette.error.secondary,
    },
  },
  warningIcon: {
    "& path": {
      fill: theme.palette.error.main,
    },
  },
}));

/**
 * TODO: ADD Info and Warning types once the design is ready
 * @param {Object} toastProps toast props
 * @param {string} message message to display in the notification
 */

export const NotifMessage = ({toastProps, message}) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.wrapper,
        (toastProps.type === toast.TYPE.ERROR ||
          toastProps.type === toast.TYPE.WARNING ||
          toastProps.type === AppConsts.NOTIF_MESSAGE_ERROR) &&
          classes.wrapperError,
      )}
    >
      <div
        className={clsx(
          classes.iconWrapper,
          (toastProps.type === toast.TYPE.ERROR ||
            toastProps.type === toast.TYPE.WARNING ||
            toastProps.type === AppConsts.NOTIF_MESSAGE_ERROR) &&
            classes.iconWrapperError,
          toastProps.type === AppConsts.NOTIF_MESSAGE_SUCCESS &&
            classes.iconWrapperMessage,
        )}
      >
        {toastProps.type === toast.TYPE.SUCCESS && <CheckRound />}
        {/**
         * Will use CheckRound for error type temporary
         * TODO: Replace CheckRound with the error icon once available
         */}
        {/*{toastProps.type === toast.TYPE.ERROR && <CheckRound />}*/}
        {toastProps.type === toast.TYPE.WARNING && (
          <IconWarning className={classes.warningIcon} />
        )}
        {toastProps.type === AppConsts.NOTIF_MESSAGE_SUCCESS && (
          <EnvelopeSent />
        )}
      </div>
      <Typography variant="body1" className={classes.message}>
        {message}
      </Typography>
    </div>
  );
};
