import React, {useRef} from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import {Box} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";

import {ReactComponent as Logo} from "src/assets/images/common/logoGettr.svg";
import {ReactComponent as AppAndroidIcon} from "src/assets/icons/ico-Android-app.svg";
import {ReactComponent as AppiOSIcon} from "src/assets/icons/ico-iOS-app.svg";
import {ReactComponent as BackIcon} from "src/assets/icons/icon_circlefull_close20.svg";
import PhoneImg from "src/assets/images/phoneApp.png";
import {t} from "src/i18n/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      zIndex: "3000 !important",
      "& .MuiDialog-container": {
        height: "100%",
        marginTop: "auto",
        display: "flex",
        alignItems: "flex-end",
      },
      "& .MuiDialog-paperWidthSm": {
        maxWidth: 860,
        width: "calc(100% - 200px)",
        borderRadius: 20,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "auto",
        padding: "50px",
        [theme.breakpoints.down("xs")]: {
          flexDirection: "column",
          padding: "50px 0 20px",
          margin: 0,
          width: "100%",
          borderRadius: "20px 20px 0 0",
        },
      },
    },
    logo: {
      [theme.breakpoints.down("xs")]: {
        margin: "auto",
      },
    },
    description: {
      marginTop: 10,
      fontSize: 32,
      fontWeight: 700,
      maxWidth: 260,
      [theme.breakpoints.down("xs")]: {
        fontSize: 24,
      },
    },
    appImageContainer: {
      maxWidth: "355px",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "calc(100% - 60px)",
      },
    },
    appImage: {
      width: "100%",
      height: "100%",
    },
    appbuttons: {
      marginTop: "60px",
      fontSize: 15,
      fontWeight: 700,
      lineHeight: "18px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        fontSize: 13,
        marginTop: 0,
      },
      "& a": {
        width: 200,
        padding: "16px 34px",
        display: "flex",
        alignItems: "center",
        border: `1px solid ${theme.palette.text.main}`,
        boxSizing: "border-box",
        borderRadius: 100,
        color: theme.palette.text.main,
        [theme.breakpoints.down("xs")]: {
          padding: "14px 18px",
          width: 155,
        },
        "&:last-child": {
          marginTop: 26,
          [theme.breakpoints.down("xs")]: {
            marginTop: 0,
          },
        },
        "& span": {
          flex: 1,
          textAlign: "center",
        },
      },
    },
    closeButton: {
      top: 20,
      right: 20,
      position: "absolute",
      fill: theme.palette.grey[200],
      transform: "scale(1.25)",
      cursor: "pointer",
    },
  }),
);

export const DownloadDialog = ({isOpen, handleClose}) => {
  const classes = useStyles();
  const selectEl = useRef(null);
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));

  const downloadAppButtons = (
    <>
      <a
        href="https://apps.apple.com/app/id1571619156"
        target="_blank"
        download
      >
        <AppiOSIcon />
        <span>{t("getter_fe.common.download.iosApp")}</span>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.gettr.gettr"
        target="_blank"
        download
      >
        <AppAndroidIcon />
        <span>{t("getter_fe.common.download.androidApp")}</span>
      </a>
    </>
  );

  return (
    <div ref={selectEl}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        scroll="body"
        className={classes.root}
        container={() => (selectEl ? selectEl.current : null)}
        onClick={(e) => e.stopPropagation()}
      >
        <Box display="flex" flexDirection="column" py={3}>
          <Logo className={classes.logo} />
          <div className={classes.description}>
            {t("getter_fe.common.download.description2")}
          </div>
          {!mobileMatches && (
            <div className={classes.appbuttons}>{downloadAppButtons}</div>
          )}
        </Box>
        <Box py={3} className={classes.appImageContainer}>
          <img src={PhoneImg} className={classes.appImage} alt="phone-images" />
        </Box>
        {mobileMatches && (
          <div className={classes.appbuttons}>{downloadAppButtons}</div>
        )}

        <BackIcon className={classes.closeButton} onClick={handleClose} />
      </Dialog>
    </div>
  );
};
