import React, {useEffect, useRef} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FormControl, Typography, FormHelperText} from "@material-ui/core";
import {Link} from "react-router-dom";
import clsx from "clsx";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {connect} from "react-redux";
import {login, resetSessionStatus} from "../store";
import {GTextField} from "src/styles/components/GTextField";
import {GButton} from "src/styles/components/GButton";
import {Formik} from "formik";
import {object, string} from "yup";
import {useTranslation} from "react-i18next";
import ReCaptcha from "./ReCaptcha";
import {GLoader} from "src/styles/components/GLoader";

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%", // handle if the screen height is small
};

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(4.375),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
    },
    formContainer: {
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(52.125),
      },
    },
    formControl: {
      marginTop: 0,
    },
    formHelperText: {
      marginBottom: 40,
    },
    btn: {
      height: theme.spacing(6),
      margin: theme.spacing(10.625, 0, 5, 0),
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
    forgotPwdWrapper: {
      marginTop: theme.spacing(0.625),
      textAlign: "right",
    },
    forgotPwdLink: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "16.7px",
      color: theme.blue.light,
      cursor: "pointer",
      "&:hover": {
        color: theme.blue.light,
      },
    },
    contentBottom: {
      fontSize: 14,
      color: theme.palette.text.main,
      textAlign: "center",
      "& a": {
        display: "inline-block",
        marginLeft: theme.spacing(1),
        color: theme.palette.text.link,
        fontWeight: 400,
        lineHeight: "17px",
        "&:hover": {
          color: theme.palette.text.link,
        },
      },
    },
    inputField: {},
    borderBottom: {
      "& .MuiOutlinedInput-notchedOutline": {
        // borderBottom: `2px solid ${theme.palette.primary.main} !important`,
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      isLoading: state.auth?.session?.isLoading,
      error: state.auth?.session?.error,
      isSuspended: state.auth?.session?.isSuspended,
    };
  },
  {login, resetSessionStatus},
);

export const LoginForm = connector(_LoginForm);

function _LoginForm({
  gotoForgotPassword,
  setPageSeo,
  login,
  isLoading,
  error,
  isSuspended,
  portal,
  resetSessionStatus,
}) {
  const classes = useStyles();
  const {t, i18n} = useTranslation();
  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";

  useEffect(() => {
    setPageSeo(
      t("getter_fe.auth.login.seoTitle"),
      t("getter_fe.auth.login.seoDescription"),
    );
  }, []);

  useEffect(() => {
    error &&
      toast(
        <NotifMessage message={t("getter_fe.auth.errors.invalidLogin")} />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.WARNING,
        },
      );
  }, [error]);

  useEffect(() => {
    isSuspended &&
      toast(
        <NotifMessage
          message={t("getter_fe.auth.errors.suspendedUserLogin")}
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.WARNING,
        },
      );
  }, [isSuspended]);

  useEffect(() => {
    return () => {
      resetSessionStatus();
    };
  });

  return (
    <div className={classes.formContainer}>
      <Typography variant="h1" component="h2" className={classes.title}>
        {t("getter_fe.auth.login.loginTitle")}
      </Typography>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={object().shape({
          email: string().required(),
          password: string().required(),
        })}
        onSubmit={async ({email, password}) => {
          const token = recaptchaDisabled
            ? null
            : await reCaptchaRef.current?.executeAsync();

          login({username: email, pwd: password, portal: portal, token: token});

          !recaptchaDisabled && reCaptchaRef.current?.reset();
        }}
      >
        {(props) => {
          const {
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
            dirty,
            errors,
            touched,
            setFieldTouched,
          } = props;

          i18n.on("languageChanged", (lng) => {
            setTimeout(() => {
              Object.keys(errors).forEach((fieldName) => {
                if (touched[fieldName]) {
                  setFieldTouched(fieldName);
                }
              });
            }, 50);
          });

          return (
            <form className="form" onSubmit={handleSubmit}>
              <FormControl
                fullWidth
                margin="dense"
                className={classes.formControl}
              >
                <GTextField
                  id="email"
                  type="text"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={clsx(
                    classes.inputField,
                    values.email && !errors.email && classes.borderBottom,
                  )}
                  label={t("getter_fe.auth.common.emailUsername")}
                  disabled={isLoading}
                />
              </FormControl>
              <FormHelperText
                className={classes.formHelperText}
              ></FormHelperText>
              <FormControl
                fullWidth
                margin="dense"
                className={clsx(classes.formControl)}
              >
                <GTextField
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={clsx(
                    classes.inputField,
                    values.password && !errors.password && classes.borderBottom,
                  )}
                  label={t("getter_fe.auth.common.password")}
                  disabled={isLoading}
                />
              </FormControl>
              <div className={classes.forgotPwdWrapper}>
                <span
                  onClick={() => gotoForgotPassword()}
                  className={clsx(classes.forgotPwdLink, "text-link")}
                >
                  {t("getter_fe.auth.common.forgotPassword")}
                </span>
              </div>

              <div className={classes.buttonsContainer}>
                <GButton
                  type="submit"
                  variant="contained"
                  className={classes.btn}
                  disabled={Boolean(
                    (!isValid &&
                      (!values.password.length || !values.email.length)) || // handle weird yup autocomplete behavior
                      isLoading ||
                      !dirty ||
                      isSubmitting,
                  )}
                  loading={isLoading}
                >
                  {isLoading || isSubmitting ? (
                    <GLoader
                      wrapperStyle={wrapperStyle}
                      type="small"
                      isButton
                      color="#FFFFFF"
                    />
                  ) : (
                    t("getter_fe.auth.common.login")
                  )}
                </GButton>
              </div>

              <div className={classes.contentBottom}>
                {t("getter_fe.auth.common.dontHaveAccount")}
                <Link to="/signup" className="text-link">
                  {t("getter_fe.auth.common.register")}
                </Link>
              </div>
              {!recaptchaDisabled && <ReCaptcha recaptchaRef={reCaptchaRef} />}
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
