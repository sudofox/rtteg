import React, {useEffect, useRef} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FormControl, FormHelperText} from "@material-ui/core";
import clsx from "clsx";
import {Link} from "react-router-dom";
import {GTextField} from "src/styles/components/GTextField";
import {GButton} from "src/styles/components/GButton";
import {Formik} from "formik";
import {object, string} from "yup";
import {ReactComponent as ArrowLeftIcon} from "src/assets/icons/basic/back_arrow.svg";
import {ReactComponent as WarningIcon} from "src/assets/icons/feature/warning.svg";
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import {
  sendVerifCode,
  changeLoginStep,
  resetSendVerifCodeStatus,
  resetVerifCodeStatus,
} from "../store";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import AppConst from "src/app/AppConsts";
import {userConstants} from "../_constants";
import ReCaptcha from "./ReCaptcha";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(4.375),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
    },
    formContainer: {},
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2.5),
    },
    formControlLast: {
      marginBottom: 0,
    },
    btn: {
      height: theme.spacing(6),
      margin: theme.spacing(8.125, 0, 5, 0),
      borderRadius: 100,
      boxShadow: "none",
      "&:hover": {
        boxShadow: "none",
      },
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
    textHelperContainer: {
      display: "flex",
    },
    warningIcon: {
      "& path": {
        fill: theme.palette.error.main,
      },
      marginRight: 3,
      minWidth: 16,
      marginTop: 4,
    },
    textHelperError: {
      fontSize: 14,
      lineHeight: "18px",
      color: theme.palette.error.main,
    },
    inputField: {},
    inputFieldError: {
      "& fieldset": {
        borderWidth: 2,
        borderColor: theme.palette.error.light,
      },
    },
    backWrapper: {
      marginBottom: theme.spacing(4.375),
    },
    back: {
      display: "inline-flex",
      width: theme.spacing(3.75),
      height: theme.spacing(3.75),
      backgroundColor: theme.palette.grey.A300,
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    icon: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      stroke: theme.palette.text.main,
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
  }),
);

const connector = connect(
  (state) => {
    return {
      isLoading: state.auth?.sendVerifCode?.isLoading,
      error: state.auth?.sendVerifCode?.error,
      success: state.auth?.sendVerifCode?.success,
    };
  },
  {
    sendVerifCode,
    changeLoginStep,
    resetSendVerifCodeStatus,
    resetVerifCodeStatus,
  },
);

export const ForgotLoginForm = connector(_ForgotLoginForm);

function _ForgotLoginForm({
  goBack,
  handleErrorEmail,
  errorEmail,
  setPageSeo,
  sendVerifCode,
  isLoading,
  error,
  success,
  changeLoginStep,
  resetSendVerifCodeStatus,
  resetVerifCodeStatus,
}) {
  const classes = useStyles();
  const {t, i18n} = useTranslation();
  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";

  useEffect(() => {
    setPageSeo(t("getter_fe.auth.common.forgetPassword"), null);
  }, []);

  useEffect(() => {
    success && changeLoginStep(userConstants.STEP_VERIF_CODE);

    success &&
      toast(
        <NotifMessage message={t("getter_fe.auth.common.sendCodeSuccess")} />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: AppConst.NOTIF_MESSAGE_SUCCESS,
        },
      );
  }, [success]);

  useEffect(() => {
    error &&
      toast(
        <NotifMessage
          message={t("getter_fe.auth.common.failedToChangePassword")}
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: AppConst.NOTIF_MESSAGE_ERROR,
        },
      );
  }, [error]);

  useEffect(() => {
    resetVerifCodeStatus();
    return () => {
      resetSendVerifCodeStatus();
    };
  });

  return (
    <div className={classes.formContainer}>
      <div className={classes.backWrapper}>
        <span className={classes.back} onClick={goBack}>
          <ArrowLeftIcon className={classes.icon} />
        </span>
      </div>
      <div className="title" className={classes.title}>
        {t("getter_fe.auth.forgotPwd.findGetterAccount")}
      </div>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={object().shape({
          email: string()
            .required(t("getter_fe.auth.errors.emailRequired"))
            .email(t("getter_fe.auth.errors.emailInvalid")),
        })}
        onSubmit={async ({email}, {setSubmitting}) => {
          const token = recaptchaDisabled
            ? null
            : await reCaptchaRef.current?.executeAsync();
          sendVerifCode({email, token});
          !recaptchaDisabled && reCaptchaRef.current?.reset();
          // handleSendVerifCode({email});
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
                  id="email"
                  type="text"
                  name="email"
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                    handleErrorEmail(false);
                  }}
                  onBlur={handleBlur}
                  error={Boolean(touched.email && errors.email)}
                  className={clsx(
                    classes.inputField,
                    Boolean(touched.email && errors.email) &&
                      classes.inputFieldError,
                  )}
                  label={t("getter_fe.auth.common.yourEmail")}
                  disabled={isLoading}
                />

                {touched.email && errors.email && (
                  <div className={classes.textHelperContainer}>
                    <WarningIcon className={classes.warningIcon} />
                    <FormHelperText className={classes.textHelperError}>
                      {errors.email}
                    </FormHelperText>
                  </div>
                )}
              </FormControl>

              <div className={classes.buttonsContainer}>
                <GButton
                  type="submit"
                  variant="contained"
                  className={classes.btn}
                  disabled={Boolean(
                    !isValid || isLoading || !dirty || errorEmail,
                  )}
                  loading={isLoading}
                >
                  {t("getter_fe.auth.forgotPwd.sendResetCode")}
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
