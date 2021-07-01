import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Grid, Container} from "@material-ui/core";
import {GTypography} from "src/styles/components/GTypography";
import {t} from "src/i18n/utils";
import {GButton} from "src/styles/components/GButton";
import clsx from "clsx";
import AppConsts from "src/app/AppConsts";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) =>
  createStyles({
    upperWrapper: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
      zIndex: 99,
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
      padding: theme.spacing(1, 2),
      zIndex: 99,
      [theme.breakpoints.down("xs")]: {
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(2),
      },
    },
    leftGrid: {
      display: "flex",
      padding: theme.spacing(0, 0, 0.5, 0),
      [theme.breakpoints.down("xs")]: {
        justifyContent: "center",
        textAlign: "center",
      },
    },
    rightGrid: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: "0 12px 0 0",
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(3),
        padding: 0,
        justifyContent: "center",
      },
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
    btnSignIn: {
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
    btnSignUp: {
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
    closeBtn: {
      padding: theme.spacing(1),
      position: "absolute",
      right: theme.spacing(0.5),
      top: theme.spacing(0.5),
      "& path": {
        stroke: "#fff",
      },
    },
  }),
);

export const AuthBar = ({cookiesAccepted}) => {
  const classes = useStyles();
  const authRedirect = useAuthRedirect();

  const goTo = (e, to) => {
    console.log("auth bar goto func");
    e.preventDefault();
    authRedirect(to);
  };

  return (
    <div className={clsx(classes.upperWrapper, !cookiesAccepted && classes.mb)}>
      <Container maxWidth="lg" className={classes.innerWrapper}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6} className={classes.leftGrid}>
            <div>
              <GTypography className={classes.title}>
                {t("getter_fe.auth.common.dontMiss")}
              </GTypography>
              <GTypography className={classes.subTitle}>
                {t("getter_fe.auth.common.firstToKnow")}
              </GTypography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.rightGrid}>
            <div>
              <GButton
                fullWidth={false}
                variant="outlined"
                className={clsx(classes.btn, classes.btnSignIn)}
                onClick={(e) => goTo(e, AppConsts.URL_LOGIN)}
              >
                {t("getter_fe.auth.common.login")}
              </GButton>
              <GButton
                fullWidth={false}
                className={clsx(classes.btn, classes.btnSignUp)}
                onClick={(e) => goTo(e, AppConsts.URL_SIGNUP)}
              >
                {t("getter_fe.auth.common.createAccount")}
              </GButton>
            </div>
          </Grid>
          <div className={classes.overlay}></div>
        </Grid>
      </Container>
    </div>
  );
};
