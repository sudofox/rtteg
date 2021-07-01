import React, {useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {t, getLang} from "../../i18n/utils";
import {Grid} from "@material-ui/core";
import {GButton} from "../../styles/components/GButton";
import {GTypography} from "../../styles/components/GTypography";
import clsx from "clsx";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    outerContainer: {
      position: "fixed",
      zIndex: theme.zIndex.snackbar,
      backgroundColor: theme.palette.text.main,
      left: 0,
      right: 0,
      bottom: 0,
      height: 80, // mobile
      [theme.breakpoints.up("sm")]: {
        height: 58, // tablet & desktop
      },
    },
    innerContainer: {
      display: "flex",
      maxWidth: theme.mixins.app.maxWidth,
      height: "100%",
      margin: "0 auto",
      padding: theme.spacing(0, 2),
      justifyContent: "space-between",
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(0, 4),
      },
    },
    leftGrid: {
      display: "flex",
      alignItems: "center",
      padding: 0,
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      },
    },
    rightGrid: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: 0,
    },
    paragraph: {
      fontSize: 15,
      letterSpacing: "0.015em",
      lineHeight: "19.5px",
      color: theme.palette.text.disabled,
      fontWeight: 400,
    },
    button: {
      maxHeight: theme.spacing(4.75),
      borderRadius: 100,
      "& .MuiButton-label": {
        fontSize: 14,
        lineHeight: "16px",
        fontWeight: 800,
      },
      "&.zh,&.tw": {
        "& span": {
          letterSpacing: "0.05em",
          fontWeight: 500,
        },
      },
    },
    acceptButton: {
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
    learnMore: {
      marginLeft: theme.spacing(1.75),
      fontSize: 14,
      lineHeight: "19px",
      fontWeight: 600,
      color: theme.palette.text.disabled,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
    },
  }),
);

export const CookieNotification = ({cookiesAccepted, setCookiesAccepted}) => {
  const classes = useStyles();
  const history = useHistory();

  if (cookiesAccepted) {
    return null;
  }

  return (
    <div className={classes.outerContainer}>
      <div className={classes.innerContainer}>
        <Grid container spacing={0}>
          <Grid item xs={12} xs={6} className={classes.leftGrid}>
            <GTypography className={classes.paragraph}>
              {t("getter_fe.auth.common.cookieMessage")}
            </GTypography>

            <span
              className={clsx(classes.learnMore, getLang())}
              onClick={() => history.push("/privacy")}
            >
              {t("getter_fe.auth.common.learnMore")}
            </span>
          </Grid>
          <Grid item xs={12} xs={6} className={classes.rightGrid}>
            <div>
              <GButton
                isBold
                color="default"
                variant="outlined"
                fullWidth={false}
                className={clsx(
                  classes.button,
                  classes.acceptButton,
                  getLang(),
                )}
                onClick={() => {
                  setCookiesAccepted(true);
                  localStorage.setItem("cookieAccepted", "true");
                }}
              >
                {t("getter_fe.auth.common.acceptCookies")}
              </GButton>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
