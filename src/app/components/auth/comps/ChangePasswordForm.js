import React, {useEffect, useRef} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Formik} from "formik";
import {object, ref, string} from "yup";
import {FormControl, FormHelperText, Link, Typography} from "@material-ui/core";
import clsx from "clsx";
import {GTextField} from "src/styles/components/GTextField";
import {GButton} from "src/styles/components/GButton";
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import {
  changePassword,
  changeLoginStep,
  resetchangePasswordStatus,
} from "../store";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {ReactComponent as WarningIcon} from "src/assets/icons/feature/warning.svg";
import {userConstants} from "../_constants";
import ReCaptcha from "./ReCaptcha";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      margin: "0 auto",
      [theme.breakpoints.up("xl")]: {
        maxWidth: theme.spacing(62.5),
      },
      [theme.breakpoints.down("lg")]: {
        maxWidth: theme.spacing(48.5),
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: theme.spacing(61),
      },
    },
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2.5),
    },
    btn: {
      height: theme.spacing(6),
      margin: theme.spacing(10.625, 0, 5, 0),
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
    textHelperContainer: {
      display: "flex",
      alignItems: "center",
    },
    warningIcon: {
      "& path": {
        fill: theme.palette.error.main,
      },
      marginRight: 3,
      minWidth: 16,
      marginTop: 2,
      marginBottom: 2,
    },
    textHelper: {
      maxWidth: theme.spacing(42.5),
      fontSize: 12,
      lineHeight: "16px",
      marginTop: 0,
    },
    linkHelperWrapper: {
      textAlign: "center",
    },
    linkHelper: {
      marginTop: theme.spacing(0.625),
      fontSize: 14,
      lineHeight: "16.71px",
      color: theme.palette.text.link,
      fontWeight: 400,
      cursor: "pointer",
      "&:hover": {
        color: theme.palette.primary.main,
        textDecoration: "none",
      },
    },
    formControlCP: {
      marginTop: 0,
      marginBottom: 0,
    },
    tabTitle: {
      marginBottom: theme.spacing(4.5),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
      textTransform: "capitalize",
    },
    inputField: {
      marginTop: 0,
    },
    inputFieldError: {
      "& fieldset": {
        borderWidth: 2,
        borderColor: theme.palette.error.light,
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      code: state.auth?.verifCode?.code,
      email: state.auth?.sendVerifCode?.data?.email,
      isLoading: state.auth?.changePassword?.isLoading,
      error: state.auth?.changePassword?.error,
      success: state.auth?.changePassword?.success,
    };
  },
  {
    changePassword,
    changeLoginStep,
    resetchangePasswordStatus,
  },
);

export const ChangePasswordForm = connector(_ChangePasswordForm);

function _ChangePasswordForm({
  goBack,
  email,
  code,
  changePassword,
  isLoading,
  error,
  success,
  changeLoginStep,
  resetchangePasswordStatus,
}) {
  const classes = useStyles();
  const {t, i18n} = useTranslation();
  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";

  useEffect(() => {
    if (!code || !email) {
      goBack();
    }
  }, []);

  useEffect(() => {
    success &&
      toast(<NotifMessage message={t("getter_fe.auth.common.pwdUpdated")} />, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });

    success && changeLoginStep(userConstants.STEP_LOGIN);
  }, [success]);

  useEffect(() => {
    error &&
      toast(
        <NotifMessage
          message={t("getter_fe.auth.errors.somethingWentWrong")}
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.WARNING,
        },
      );
  }, [error]);

  useEffect(() => {
    return () => {
      resetchangePasswordStatus();
    };
  });

  return (
    <div className={classes.wrapper}>
      <Typography variant="h1" className={classes.tabTitle}>
        {t("getter_fe.auth.common.changeYourPwd")}
      </Typography>
      <Formik
        initialValues={{
          newPass: "",
          confirmPass: "",
        }}
        validationSchema={object().shape({
          newPass: string()
            .required(t("getter_fe.auth.common.newPwdRequired"))
            .min(6, t("getter_fe.auth.common.minCharact"))
            .matches(
              /^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!#$&()*+,\-.:;<=>?@[\]^_{|}~]{6,128}$/,
              t("getter_fe.settings.errors.passwordValidation"),
            )
            .matches(
              /^(?!\d+$)(?=.*[a-zA-Z\d].*)[a-zA-Z\d!#$&()*+,\-.:;<=>?@[\]^_{|}~]{6,128}$/,
              t("getter_fe.settings.errors.onlyNumbers"),
            ),
          confirmPass: string()
            .oneOf(
              [ref("newPass")],
              t("getter_fe.settings.errors.passwordsNotMatch"),
            )
            .required(t("getter_fe.settings.errors.confirmPasswordRequired")),
        })}
        onSubmit={async ({newPass}) => {
          const token = recaptchaDisabled
            ? null
            : await reCaptchaRef.current?.executeAsync();

          changePassword({
            newPwd: newPass,
            email: email,
            code: code,
            token,
          });

          !recaptchaDisabled && reCaptchaRef.current?.reset();
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
            dirty,
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
                  id="password-new"
                  type="password"
                  name="newPass"
                  value={values.newPass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.newPass && errors.newPass)}
                  className={clsx(
                    classes.inputField,
                    Boolean(touched.newPass && errors.newPass) &&
                      classes.inputFieldError,
                  )}
                  label={t("getter_fe.settings.common.newPassword")}
                  disabled={isLoading}
                />

                {touched.newPass && errors.newPass && (
                  <div className={classes.textHelperContainer}>
                    <WarningIcon className={classes.warningIcon} />
                    <FormHelperText
                      className={classes.textHelper}
                      error={Boolean(touched.newPass && errors.newPass)}
                    >
                      {errors.newPass}
                    </FormHelperText>
                  </div>
                )}
              </FormControl>
              <FormControl
                fullWidth
                margin="dense"
                className={clsx(classes.formControl, classes.formControlCP)}
              >
                <GTextField
                  id="password-confirm"
                  type="password"
                  name="confirmPass"
                  value={values.confirmPass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.confirmPass && errors.confirmPass)}
                  className={clsx(
                    classes.inputField,
                    Boolean(touched.confirmPass && errors.confirmPass) &&
                      classes.inputFieldError,
                  )}
                  label={t("getter_fe.settings.common.confirmPassword")}
                  disabled={isLoading}
                />
                {touched.confirmPass && errors.confirmPass && (
                  <div className={classes.textHelperContainer}>
                    <WarningIcon className={classes.warningIcon} />
                    <FormHelperText
                      error={Boolean(touched.confirmPass && errors.confirmPass)}
                    >
                      {errors.confirmPass}
                    </FormHelperText>
                  </div>
                )}
              </FormControl>

              <GButton
                type="submit"
                variant="contained"
                className={classes.btn}
                disabled={Boolean(!isValid || isLoading || !dirty)}
                loading={isLoading}
              >
                {t("getter_fe.auth.common.save")}
              </GButton>

              <div className={classes.linkHelperWrapper}>
                <Link
                  href="/login"
                  className={clsx(classes.linkHelper, "text-link")}
                >
                  {t("getter_fe.auth.common.backToLogin")}
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
