import React, {useState, useEffect, useRef} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Formik} from "formik";
import {object, ref, string} from "yup";
import {
  FormControl,
  FormHelperText,
  Typography,
  FormControlLabel,
} from "@material-ui/core";
import {GTextField} from "src/styles/components/GTextField";
import {GButton} from "src/styles/components/GButton";
import {GCheckbox} from "src/styles/components/GCheckbox";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {emailBlacklistReg} from "src/util/TextUtil";
import AppConst from "src/app/AppConsts";
import {userConstants} from "src/app/components/auth/_constants";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import ReCaptcha from "src/app/components/auth/comps/ReCaptcha";
import {
  checkEmail,
  claimSignup,
  sendVerifCodeSignup,
  resetVerifCodeStatus,
  resetSendVerifCodeStatus,
  changeSignupStep,
  changeImpost,
} from "src/app/components/auth/store";
import {ReactComponent as WarningIcon} from "src/assets/icons/feature/warning.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(4.375),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(8.125),
      },
    },
    subTitleBold: {
      color: theme.palette.text.main,
      fontSize: 15,
      fontWeight: 700,
      lineHeight: "20px",
      marginBottom: theme.spacing(0.75),
    },
    subTitle: {
      color: theme.palette.grey.A700,
      fontSize: 15,
      fontWeight: 400,
      lineHeight: "20px",
      marginBottom: theme.spacing(5.25),
    },
    contentWrapper: {
      margin: "0 auto",
      [theme.breakpoints.up("xl")]: {
        maxWidth: theme.spacing(62.5),
      },
      [theme.breakpoints.down("lg")]: {
        maxWidth: theme.spacing(52.125),
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: theme.spacing(61),
      },
      [theme.breakpoints.down("xs")]: {
        maxWidth: "auto",
        minWidth: "auto",
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
      },
    },
    tabTitle: {
      height: 58,
      paddingLeft: theme.spacing(4),
      fontSize: 20,
      fontWeight: 800,
      lineHeight: "22px",
      color: theme.palette.text.primary,
      textTransform: "capitalize",
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        // tablet or mobile
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        borderBottom: `1px solid ${theme.palette.grey.A200}`,
        marginTop: 0,
        height: 58,
        lineHeight: "58px",
        fontSize: 18,
        "& > svg": {
          // back arrow icon
          marginRight: theme.spacing(2),
          verticalAlign: "top",
          cursor: "pointer",
          borderRadius: "50%",
          padding: 1,
          width: 26,
          height: 26,
          "&:hover": {
            backgroundColor: "#F2F9FF",
          },
        },
      },
    },
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2.5),
    },
    inputField: {
      "& > .MuiInputBase-root": {
        "& > input": {
          fontSize: 15,
        },
      },
      "& .MuiInputLabel-outlined": {
        transform: "translate(0, 15px) scale(1)",
      },
    },
    error: {
      color: "red",
    },
    checkbox: {
      padding: theme.spacing(0.5),
      "& input": {
        display: "none",
      },
    },
    checkboxLabel: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: "22px",
    },
    btn: {
      height: theme.spacing(6),
      // margin: theme.spacing(7, 0, 5, 0),
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
    mobileBtn: {
      height: theme.spacing(6),
      borderRadius: 24,
      fontWeight: 700,
      marginTop: theme.spacing(4),
    },
    passwordTextHelperContainer: {
      display: "flex",
      alignItems: "center",
    },
    textHelper: {
      maxWidth: 340,
      fontSize: 12,
      lineHeight: "16px",
    },
    impostDesc: {
      // color: "#828282",
      color: theme.palette.grey.A700,
      fontSize: 16,
      lineHeight: "140%",
      marginBottom: "50px",
      marginLeft: "4%",
    },
    warningIcon: {
      "& path": {
        fill: theme.palette.error.main,
      },
      marginRight: 3,
      minWidth: 16,
      marginTop: 4,
    },
    link: {
      color: theme.palette.text.secondary,
      fontWeight: "inherit",
    },
    formControlCP: {
      marginTop: theme.spacing(1.25),
    },
    alertWrapper: {
      textAlign: "center",
    },
    alert: {
      display: "inline-flex",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: theme.spacing(6.625),
      "& .MuiAlert-message": {
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    conditionsWrapper: {
      marginTop: theme.spacing(8.125),
      marginBottom: theme.spacing(1.5),
      textAlign: "center",
    },
    conditions: {
      fontSize: 13,
      lineHeight: "15.51px",
      fontWeight: 300,
      color: theme.palette.text.secondary,
      "& a": {
        fontWeight: "normal",
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      success: state.auth?.sendVerifCode?.success,
      error: state.auth?.sendVerifCode?.error,
      isLoading: state.auth?.sendVerifCode?.isLoading,
    };
  },
  {
    checkEmail,
    claimSignup,
    changeImpost,
    sendVerifCodeSignup,
    resetVerifCodeStatus,
    resetSendVerifCodeStatus,
    changeSignupStep,
  },
);

export const VerifyForm = connector(_VerifyForm);

function _VerifyForm({
  checkEmail,
  sendVerifCodeSignup,
  resetVerifCodeStatus,
  resetSendVerifCodeStatus,
  changeImpost,
  isLoading,
  success,
  changeSignupStep,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";
  const {t, i18n} = useTranslation();
  const [showPwd, setShowPwd] = useState(false);

  const username = window.sessionStorage.getItem("ClaimUsername");
  const [emailExistError, setEmailExistError] = useState(false);
  const [emailServerError, setEmailServerError] = useState(false);

  useEffect(() => {
    return () => {
      resetVerifCodeStatus();
      resetSendVerifCodeStatus();
    };
  });

  useEffect(() => {
    success &&
      toast(
        <NotifMessage message={t("getter_fe.auth.common.sendCodeSuccess")} />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: AppConst.NOTIF_MESSAGE_SUCCESS,
        },
      );

    success && changeSignupStep(userConstants.STEP_VERIF_CODE);
  }, [success]);

  return (
    <div className={classes.contentWrapper}>
      <Typography variant="h1" component="h2" className={classes.title}>
        {t("getter_fe.auth.signup.claimYourAccount")}
      </Typography>
      <p className={classes.subTitleBold}>
        {t("getter_fe.profile.common.claimConfirmed")}
        {username}
        {t("getter_fe.profile.common.claimConfirmed2")}
      </p>
      <p className={classes.subTitle}>
        {t("getter_fe.profile.common.claimInstruction")}
      </p>
      <Formik
        initialValues={{
          email: "",
          newPass: "",
          confirmPass: "",
          impost: false,
        }}
        validationSchema={object().shape({
          email: string()
            .required(t("getter_fe.auth.errors.emailRequired"))
            .matches(
              /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.@]*$/,
              t("getter_fe.auth.errors.emailInvalid"),
            )
            .matches(
              emailBlacklistReg,
              t("getter_fe.auth.errors.emailProvider"),
            )
            .email(t("getter_fe.auth.errors.emailInvalid")),

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
        onSubmit={async ({email, newPass, impost}, {setSubmitting}) => {
          changeImpost({imPost: impost});
          localStorage.setItem(username + "_imPost", impost);

          const token = recaptchaDisabled
            ? null
            : await reCaptchaRef.current?.executeAsync();
          sendVerifCodeSignup({
            username: email,
            email: email,
            password: newPass,
            token: token,
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
            isSubmitting,
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
                  onChange={async (e) => {
                    setEmailExistError(false);
                    handleChange(e);
                  }}
                  onBlur={async (e) => {
                    const value = e.target.value;
                    handleBlur(e);
                    if (!errors.email) {
                      const checkRes = await checkEmail(value);
                      const exist = checkRes?.payload;
                      console.info(exist);
                      if (exist === AppConst.STATUS_SERVER_ERROR) {
                        setEmailServerError(true);
                        return;
                      } else {
                        setEmailServerError(false);
                      }

                      if (exist) {
                        console.info(exist);
                        setEmailExistError(true);
                      } else {
                        setEmailExistError(false);
                      }
                    }
                  }}
                  error={Boolean(touched.email && errors.email)}
                  className={clsx(
                    classes.inputField,
                    Boolean(touched.email && errors.email) &&
                      classes.inputFieldError,
                  )}
                  label={t("getter_fe.auth.common.email")}
                  disabled={isLoading}
                />

                {touched.email && errors.email && (
                  <FormHelperText
                    className={classes.textHelper}
                    error={Boolean(touched.email && errors.email)}
                  >
                    <WarningIcon className={classes.warningIcon} />
                    {errors.email}
                  </FormHelperText>
                )}

                {emailExistError && (
                  <FormHelperText className={classes.textHelper} error={true}>
                    <WarningIcon className={classes.warningIcon} />
                    {emailExistError && t("getter_fe.auth.errors.emailExist")}
                  </FormHelperText>
                )}

                {emailServerError && (
                  <FormHelperText className={classes.textHelper} error={true}>
                    <WarningIcon className={classes.warningIcon} />
                    {emailServerError &&
                      t("getter_fe.auth.errors.somethingWentWrong")}
                  </FormHelperText>
                )}
              </FormControl>
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
                  className={classes.inputField}
                  label={t("getter_fe.settings.common.newPassword")}
                  disabled={isSubmitting}
                  showPwd={showPwd}
                  iconBtnClick={() => {
                    setShowPwd(!showPwd);
                  }}
                />
                {touched.newPass && errors.newPass && (
                  <div className={classes.passwordTextHelperContainer}>
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
                  className={classes.inputField}
                  label={t("getter_fe.settings.common.confirmPassword")}
                  disabled={isSubmitting}
                  showPwd={showPwd}
                  iconBtnClick={() => {
                    setShowPwd(!showPwd);
                  }}
                />

                {touched.confirmPass && errors.confirmPass && (
                  <div className={classes.passwordTextHelperContainer}>
                    <WarningIcon className={classes.warningIcon} />
                    <FormHelperText
                      error={Boolean(touched.confirmPass && errors.confirmPass)}
                    >
                      {errors.confirmPass}
                    </FormHelperText>
                  </div>
                )}
              </FormControl>
              <div>
                <FormControlLabel
                  control={
                    <GCheckbox
                      checked={values.impost}
                      onChange={handleChange}
                      classes={{
                        root: classes.checkbox,
                      }}
                      name="impost"
                    />
                  }
                  label={t("getter_fe.profile.common.imPost")}
                  classes={{
                    label: classes.checkboxLabel,
                  }}
                />
                <FormHelperText className={classes.impostDesc}>
                  {t("getter_fe.profile.common.imPostDesc")}
                </FormHelperText>
              </div>
              <div className={classes.conditionsWrapper}>
                <div className={classes.conditions}>
                  {`${t("getter_fe.auth.common.byClicking")} `}
                  <a
                    href={"/terms"}
                    rel="noopener noreferrer"
                    className="text-link"
                    target="_blank"
                  >
                    {t("getter_fe.auth.common.termsOfuse")}
                  </a>
                  {` ${t("getter_fe.auth.common.and")} `}
                  <a
                    href={"/privacy"}
                    rel="noopener noreferrer"
                    className="text-link"
                    target="_blank"
                  >
                    {`${t("getter_fe.auth.common.privacyPolicy")}`}
                  </a>
                </div>
              </div>
              {isMobile ? (
                <GButton
                  type="submit"
                  variant="contained"
                  className={classes.mobileBtn}
                  disabled={Boolean(
                    !isValid ||
                      isLoading ||
                      !dirty ||
                      emailExistError ||
                      emailServerError,
                  )}
                  loading={isSubmitting}
                >
                  {t("getter_fe.auth.common.next")}
                </GButton>
              ) : (
                <GButton
                  type="submit"
                  variant="contained"
                  className={classes.btn}
                  disabled={Boolean(
                    !isValid ||
                      isLoading ||
                      !dirty ||
                      emailExistError ||
                      emailServerError,
                  )}
                  loading={isSubmitting}
                >
                  {t("getter_fe.auth.common.next")}
                </GButton>
              )}

              {!recaptchaDisabled && <ReCaptcha recaptchaRef={reCaptchaRef} />}
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
