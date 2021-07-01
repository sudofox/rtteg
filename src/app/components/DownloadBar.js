import React, {useEffect, useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Grid, Container} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";

import {GTypography} from "src/styles/components/GTypography";
import {t} from "src/i18n/utils";
import {GButton} from "src/styles/components/GButton";
import clsx from "clsx";
import {DownloadDialog} from "src/app/components/DownloadDialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    upperWrapper: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
      zIndex: 100,
    },
    mb: {
      bottom: theme.spacing(7.25),
      [theme.breakpoints.down("xs")]: {
        bottom: theme.spacing(10),
      },
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      backgroundColor: theme.palette.primary.main,
      zIndex: -1,
      opacity: 0.98,
    },

    innerWrapper: {
      display: "flex",
      maxWidth: theme.mixins.app.maxWidth,
      height: "100%",
      margin: "0 auto",
      padding: theme.spacing(2),
      zIndex: 9999,
    },
    leftGrid: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(0, 0, 2, 0),
    },
    buttons: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 0,
    },
    title: {
      fontWeight: 700,
      fontSize: 24,
      lineHeight: "31.2px",
      color: theme.palette.text.disabled,
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
      },
    },
    subTitle: {
      fontWeight: 400,
      fontSize: 15,
      lineHeight: "19.5px",
      color: theme.palette.text.disabled,
    },
    btn: {
      maxHeight: theme.spacing(3.5),
      borderRadius: 100,
      padding: "6px 24px",
      "& .MuiButton-label": {
        fontSize: 14,
        lineHeight: "16px",
        fontWeight: 800,
      },
    },
    btnCancel: {
      "& .MuiButton-label": {
        color: theme.palette.text.disabled,
      },
      "&.MuiButton-outlined": {
        border: "1px solid rgba(255, 255, 255, 0.5)",
      },
      "&.MuiButton-outlined:not(:disabled):hover": {
        border: "1px solid rgba(255, 255, 255, 0.5)",
      },
    },
    btnDownload: {
      marginLeft: theme.spacing(1.25),
      "&.MuiButton-contained:not(:disabled)": {
        backgroundColor: theme.palette.text.disabled,
      },
      "&.MuiButton-contained:not(:disabled):hover": {
        backgroundColor: theme.palette.text.disabled,
      },
      "& .MuiButton-label": {
        color: theme.palette.primary.main,
      },
    },
  }),
);

export const DownloadBar = ({
  setDownloadCookieAccepted,
  downloadCookieAccepted,
  cookiesAccepted,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));

  useEffect(() => {
    if (!mobileMatches) setIsDownloadDialogOpen(false);
  }, [mobileMatches]);

  const openDownload = () => {
    setOpen(false);
    setIsDownloadDialogOpen(true);
    setDownloadCookieAccepted(true);
    window.sessionStorage.setItem("downloadCookieAccepted", "true");
  };

  return (
    <>
      {!downloadCookieAccepted && open && (
        <div
          className={clsx(classes.upperWrapper, !cookiesAccepted && classes.mb)}
        >
          <Container maxWidth="lg" className={classes.innerWrapper}>
            <Grid container spacing={0}>
              <Grid item xs={12} className={classes.leftGrid}>
                <GTypography className={classes.title}>
                  {t("getter_fe.common.download.title")}
                </GTypography>
              </Grid>
              <Grid item xs={12} className={classes.leftGrid}>
                <GTypography className={classes.subTitle}>
                  {t("getter_fe.common.download.description")}
                </GTypography>
              </Grid>
              <Grid item xs={12} className={classes.buttons}>
                <GButton
                  fullWidth={false}
                  variant="outlined"
                  className={clsx(classes.btn, classes.btnCancel)}
                  onClick={() => setOpen(false)}
                >
                  {t("getter_fe.common.download.cancel")}
                </GButton>
                <GButton
                  fullWidth={false}
                  className={clsx(classes.btn, classes.btnDownload)}
                  onClick={openDownload}
                >
                  {t("getter_fe.common.download.download")}
                </GButton>
              </Grid>
              <div className={classes.overlay}></div>
            </Grid>
          </Container>
        </div>
      )}
      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        handleClose={(e) => {
          e.stopPropagation();
          setIsDownloadDialogOpen(false);
        }}
      />
    </>
  );
};
