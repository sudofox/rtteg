import React, {useState, useEffect, useRef} from "react";
import {Link, useHistory} from "react-router-dom";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
  NativeSelect,
} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import {GTextField} from "src/styles/components/GTextField";
import {GButton} from "src/styles/components/GButton";
import {Formik} from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import {emailBlacklistReg} from "src/util/TextUtil";
import AppConst from "src/app/AppConsts";
import {userConstants} from "../_constants";
import {useTranslation} from "react-i18next";
import GAxios from "src/util/GAxios";
import {useDispatch, connect} from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {
  checkUsername,
  checkEmail,
  sendVerifCodeSignup,
  resetVerifCodeStatus,
  resetSendVerifCodeStatus,
  changeSignupStep,
  setClaimUsername,
} from "../store";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {t} from "src/i18n/utils";
import ReCaptcha from "./ReCaptcha";
import {ReactComponent as WarningIcon} from "src/assets/icons/feature/warning.svg";
import {getYears} from "../../../pages/profile/public_user_view/consts";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
    formContainer: {},
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2.5),
    },
    inputField: {
      "& input:not([type=checkbox]):not([type=radio])": {
        fontSize: 15,
        fontWeight: 400,
        [theme.breakpoints.down("xs")]: {
          fontSize: 16,
        },
      },
    },
    inputFieldError: {
      "& fieldset": {
        borderWidth: 2,
        borderColor: theme.palette.error.light,
      },
    },
    textHelperPrivacy: {
      marginTop: theme.spacing(1.875),
      fontSize: 14,
      lineHeight: "16.71px",
      fontWeight: 400,
      color: theme.palette.text.secondary,
    },
    btn: {
      height: theme.spacing(6),
      margin: theme.spacing(0, 0, 5, 0),
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
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
    textHelper: {
      display: "flex",
      fontSize: 12,
      lineHeight: "14px",
      color: theme.palette.text.secondary,
      fontWeight: "normal",
      columnGap: 4,
    },
    passwordTextHelperContainer: {
      display: "flex",
      columnGap: 4,
    },
    warningIcon: {
      "& path:first-child": {
        fill: theme.palette.error.main,
      },
      width: 14,
      minWidth: 14,
      height: 14,
    },
    iconMargin: {
      marginTop: 4,
    },
    conditionsWrapper: {
      marginTop: theme.spacing(8.125),
      marginBottom: theme.spacing(5),
      textAlign: "center",
    },
    conditions: {
      fontSize: 13,
      lineHeight: "16px",
      fontWeight: 300,
      color: theme.palette.text.lightGray,
      "& a": {
        color: theme.palette.text.lightGray,
        fontWeight: 300,
        borderBottom: `0.5px solid ${theme.palette.text.lightGray}`,
      },
    },
    alertLink: {
      textDecoration: "underline",
      color: "#016EDC",
    },
    alertTitle: {
      color: "#016EDC",
      marginBottom: "13px",
    },
    alert: {
      color: "#6E7187",
      "& .MuiSvgIcon-root": {
        color: "#016EDC",
      },
    },
    dialog: {
      "& .MuiPaper-root": {
        borderRadius: 10,
        padding: theme.spacing(6, 0, 3, 0),
        height: 356,
      },
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "center",
      color: theme.palette.text.main,
      paddingBottom: 0,
      paddingTop: theme.spacing(4),
      "& h2": {
        fontSize: 28,
      },
    },
    dialogContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      padding: theme.spacing(2, 15),
      paddingTop: 0,
      "& p": {
        fontSize: 20,
        color: theme.palette.text.main,

        marginBottom: theme.spacing(6),
        lineHeight: "26px",
      },
      "& button": {
        width: theme.spacing(33),
        height: theme.spacing(6),
        borderRadius: 100,
      },
    },
    birthYearControl: {
      width: "100%",
      "& .MuiSelect-select": {
        padding: 0,
        "&:focus": {
          background: "unset",
        },
      },
      "& .MuiSelect-selectMenu": {
        minHeight: theme.spacing(6),
        lineHeight: theme.spacing(6) + "px",
      },
      "& .MuiSelect-icon": {
        // display: "none",
      },
      "& .MuiInput-underline": {
        "&:before": {
          borderBottom: `1px solid ${theme.input.borderColor}`,
        },
      },
      "& .MuiInput-underline.Mui-focused": {
        "&:before": {
          borderBottom: `2px solid ${theme.palette.primary.main} !important`,
        },
      },
      "&:hover": {
        "& .MuiInput-underline": {
          "&:before": {
            borderBottom: `1px solid ${theme.input.borderColor}`,
          },
        },
      },
      "& .MuiInput-formControl": {
        marginTop: 0,
      },
      "& .MuiInputLabel-formControl": {
        color: theme.palette.text.secondary,
        fontSize: 15,
        transform: "translate(0, 14px) scale(1)",
        textTransform: "capitalize",
      },
      "& .MuiInputLabel-shrink": {
        transform: "translate(0, -6px) scale(0.75)",
      },
      "& .MuiNativeSelect-select": {
        "&:focus": {
          backgroundColor: "unset",
        },
      },
    },
    birthYearSelectPaper: {
      maxHeight: theme.spacing(26.25),
      "& .MuiList-padding": {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    birthYearSelectItem: {
      lineHeight: theme.spacing(3.75) + "px",
      "&:hover": {
        backgroundColor: theme.palette.grey.A6,
      },
      "&.Mui-selected": {
        backgroundColor: theme.palette.grey.A6,
      },
    },
    birthYearSelectHelpText: {
      marginTop: theme.spacing(1.25),
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.grey.A3,
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
    checkUsername,
    setClaimUsername,
    checkEmail,
    sendVerifCodeSignup,
    resetVerifCodeStatus,
    resetSendVerifCodeStatus,
    changeSignupStep,
  },
);

export const SignupForm = connector(_SignupForm);

function _SignupForm({
  checkUsername,
  setClaimUsername,
  checkEmail,
  sendVerifCodeSignup,
  resetVerifCodeStatus,
  resetSendVerifCodeStatus,
  isLoading,
  success,
  error,
  changeSignupStep,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [usernameExistError, setUsernameExistError] = useState(false);
  const [usernameClaimable, setUsernameClaimable] = useState(false);
  const [claimUrl, setClaimUrl] = useState();
  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [emailExistError, setEmailExistError] = useState(false);
  const [emailServerError, setEmailServerError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const {t, i18n} = useTranslation();
  const history = useHistory();
  const reCaptchaRef = useRef();
  const dispatch = useDispatch();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const years = getYears();
  const refBirthYearSelector = useRef(null);
  const [anchorElBirthYear, setAnchorElBirthYear] = React.useState(null);

  let userClaimPlan = window.sessionStorage.getItem("UserClaimPlan");

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

  const handleClaim = async (userId) => {
    if (userId) {
      let claimStatus = await checkClaimStatus();
      if (claimStatus) {
        setPopupDialogOpen(false);
        if (userClaimPlan === "A") {
          const config = {
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/u/user/openauth/${userId}`,
            headers: {
              "Content-Type": "application/json",
            },
          };
          let res = await GAxios(
            config,
            (response) => {
              let twitterUrl = response.data.result;
              window.location.href = twitterUrl;
            },
            (err) => {
              console.info(err);
              toast(<NotifMessage message={err.response.data.error.emsg} />, {
                position: toast.POSITION.TOP_CENTER,
                type: toast.TYPE.ERROR,
              });
              history.push("/claim-failed");
            },
          );
        } else {
          changeSignupStep(userConstants.CLAIM_VERIFY);
        }
      } else {
        setPopupDialogOpen(true);
      }
    }
  };

  const checkClaimStatus = async () => {
    let result = false;
    const config = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/s/openauth/status`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    let res = await GAxios(
      config,
      (response) => {
        setPopupDialogOpen(false);
        result = response?.data?.result?.status;
        if(response?.data?.result?.result?.V2 && !response?.data?.result?.result?.V1)
          userClaimPlan = "B";
        else
          userClaimPlan = "A";
        window.sessionStorage.setItem("UserClaimPlan", userClaimPlan);
      },
      (err) => {
        console.info(err);
        setPopupDialogOpen(true);
        result = false;
      },
    );
    return result;
  };

  const onCancel = () => {
    setPopupDialogOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (refBirthYearSelector.current) {
      setAnchorElBirthYear(refBirthYearSelector.current);
    }
  }, [refBirthYearSelector.current]);

  return (
    <>
      <Dialog
        open={popupDialogOpen}
        onClose={onCancel}
        className={classes.dialog}
        maxWidth="sm"
      >
        <DialogTitle className={classes.dialogTitle}>
          {t("getter_fe.auth.claim.serviceNotAvailable")}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <p>{t("getter_fe.auth.claim.serviceNotAvailableDesc")}</p>
          <GButton onClick={() => setPopupDialogOpen(false)}>
            {t("getter_fe.auth.claim.buttonText")}
          </GButton>
        </DialogContent>
      </Dialog>
      <div className={classes.formContainer}>
        <Typography variant="h1" component="h2" className={classes.title}>
          {t("getter_fe.auth.signup.seoDescription")}
        </Typography>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPass: "",
            birthyear: "",
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .required(t("getter_fe.auth.errors.usernameRequired"))
              .matches(
                /^[a-zA-Z0-9_]*$/,
                t("getter_fe.auth.errors.usernameInvalid"),
              )
              .min(5, t("getter_fe.auth.errors.usernameMinMax"))
              .max(15, t("getter_fe.auth.errors.usernameMinMax")),
            email: Yup.string()
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
            password: Yup.string()
              .required(t("getter_fe.auth.common.pwdRequired"))
              .matches(
                /^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!#$&()*+,\-.:;<=>?@[\]^_{|}~]{6,128}$/,
                t("getter_fe.settings.errors.passwordValidation"),
              )
              .matches(
                /^(?!\d+$)(?=.*[a-zA-Z\d].*)[a-zA-Z\d!#$&()*+,\-.:;<=>?@[\]^_{|}~]{6,128}$/,
                t("getter_fe.settings.errors.onlyNumbers"),
              ),
            confirmPass: Yup.string()
              .oneOf(
                [Yup.ref("password")],
                t("getter_fe.settings.errors.passwordsNotMatch"),
              )
              .required(t("getter_fe.settings.errors.confirmPasswordRequired")),
            birthyear: Yup.string()
              .required(t("getter_fe.auth.common.birthYearRequired"))
              .matches(
                /^\d{4}$/,
                t("getter_fe.auth.common.birthYearNumberRequired"),
              ),
          })}
          onSubmit={async (
            {username, email, password, birthyear},
            {setSubmitting},
          ) => {
            // verify birth year,
            // rule: Only the age is 16 and above could continue to register  (This year - birth year >=17)
            const _thisYear = new Date().getFullYear();
            const _birthYear = parseInt(birthyear);
            if (_thisYear - _birthYear < 17) {
              // redirect to error page
              changeSignupStep(userConstants.STEP_VERIF_ERROR);
              return;
            }

            // send to back-end verify
            const token = recaptchaDisabled
              ? null
              : await reCaptchaRef.current?.executeAsync();
            sendVerifCodeSignup({
              username: username,
              email: email,
              password: password,
              birthyear: _birthYear,
              token: token,
            });
            !recaptchaDisabled && reCaptchaRef.current?.reset();

            // setSubmitting(false);
            // handleSendVerifCode({
            //   username: username,
            //   email: email,
            //   password: password,
            // });
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
                    id="username"
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={async (e) => {
                      handleBlur(e);
                      setUsernameExistError(false);
                      const value = e.target?.value;
                      if (value && value.length >= 2 && value.length <= 15) {
                        const checkRes = await checkUsername(value);
                        const exist = checkRes?.payload;
                        // const exist = await handleUsernameExist(value);
                        if (
                          exist === userConstants.ERROR_TYPE_SERVER ||
                          !exist
                        ) {
                          setServerError(true);
                          return;
                        } else {
                          setServerError(false);
                        }

                        if (exist.success && !exist.claimable) {
                          setUsernameExistError(true);
                          setUsernameClaimable(false);
                        } else if (!exist.success && !exist.claimable) {
                          setUsernameExistError(false);
                          setUsernameClaimable(false);
                        } else if (exist.success && exist.claimable) {
                          window.sessionStorage.setItem("ClaimUsername", value);
                          setUsernameClaimable(true);
                          setClaimUrl("/u/user/oenauth/" + value);
                        } else {
                          setUsernameClaimable(false);
                        }
                      }
                    }}
                    error={Boolean(
                      (touched.username && errors.username) ||
                        usernameExistError ||
                        serverError ||
                        usernameClaimable,
                    )}
                    className={clsx(
                      classes.inputField,
                      Boolean(
                        (touched.username && errors.username) ||
                          usernameExistError ||
                          serverError ||
                          usernameClaimable,
                      ) && classes.inputFieldError,
                    )}
                    label={`${t("getter_fe.auth.common.username")}`}
                    disabled={isLoading}
                  />

                  {touched.username && errors.username && (
                    <FormHelperText
                      className={classes.textHelper}
                      error={Boolean(touched.username && errors.username)}
                    >
                      <WarningIcon className={classes.warningIcon} />
                      {touched.username && errors.username}
                    </FormHelperText>
                  )}

                  {usernameExistError && (
                    <FormHelperText className={classes.textHelper} error={true}>
                      <WarningIcon className={classes.warningIcon} />
                      {usernameExistError &&
                        t("getter_fe.auth.errors.usernameExist")}
                    </FormHelperText>
                  )}
                  <FormHelperText className={classes.birthYearSelectHelpText}>
                    {t("getter_fe.auth.common.userNameSelectHelpText")}
                  </FormHelperText>

                  {usernameClaimable && (
                    <Alert severity="info" className={classes.alert}>
                      <AlertTitle className={classes.alertTitle}>
                        {t("getter_fe.auth.claim.claimDesc1", {
                          username: window.sessionStorage.getItem(
                            "ClaimUsername",
                          ),
                        })}
                      </AlertTitle>
                      {t("getter_fe.auth.claim.claimDesc2", {
                        username: window.sessionStorage.getItem(
                          "ClaimUsername",
                        ),
                      })}
                      <br />
                      <Link
                        className={classes.alertLink}
                        href="#"
                        onClick={() =>
                          handleClaim(
                            window.sessionStorage.getItem("ClaimUsername"),
                          )
                        }
                        variant="body2"
                      >
                        {t("getter_fe.auth.claim.claimYourAccount")}
                      </Link>{" "}
                      <br />
                      {t("getter_fe.auth.claim.claimDesc3")}
                    </Alert>
                  )}

                  {serverError && (
                    <FormHelperText className={classes.textHelper} error={true}>
                      <WarningIcon className={classes.warningIcon} />
                      {serverError &&
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

                        if (exist === AppConst.STATUS_SERVER_ERROR) {
                          setEmailServerError(true);
                          return;
                        } else {
                          setEmailServerError(false);
                        }

                        if (exist) {
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
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.password && errors.password)}
                    className={clsx(
                      classes.inputField,
                      Boolean(touched.password && errors.password) &&
                        classes.inputFieldError,
                    )}
                    label={t("getter_fe.auth.common.password")}
                    disabled={isLoading}
                    showPwd={showPwd}
                    iconBtnClick={() => {
                      setShowPwd(!showPwd);
                    }}
                  />

                  {touched.password && errors.password && (
                    <div className={classes.passwordTextHelperContainer}>
                      <WarningIcon
                        className={clsx(
                          classes.warningIcon,
                          classes.iconMargin,
                        )}
                      />
                      <FormHelperText
                        className={classes.textHelper}
                        error={Boolean(touched.password && errors.password)}
                      >
                        {errors.password}
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
                    showPwd={showPwd}
                    iconBtnClick={() => {
                      setShowPwd(!showPwd);
                    }}
                  />
                  {touched.confirmPass && errors.confirmPass && (
                    <FormHelperText
                      className={classes.textHelper}
                      error={Boolean(touched.confirmPass && errors.confirmPass)}
                    >
                      <WarningIcon className={classes.warningIcon} />
                      {errors.confirmPass}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl className={classes.birthYearControl}>
                  <InputLabel id="birthyear-label">
                    {t("getter_fe.auth.common.birthYear")}
                  </InputLabel>
                  {isMobile ? (
                    <NativeSelect
                      ref={refBirthYearSelector}
                      labelId="birthyear-label"
                      id="birthyear"
                      name="birthyear"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.birthyear}
                      IconComponent={ExpandMoreIcon}
                    >
                      <option value={""}>{""}</option>
                      {years.map((year, idx) => {
                        return (
                          <option
                            // className={classes.birthYearSelectItem}
                            value={year}
                            key={`${year}-${idx}`}
                          >
                            {year}
                          </option>
                        );
                      })}
                    </NativeSelect>
                  ) : (
                    <Select
                      ref={refBirthYearSelector}
                      labelId="birthyear-label"
                      id="birthyear"
                      name="birthyear"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.birthyear}
                      // native={isMobile}
                      IconComponent={ExpandMoreIcon}
                      MenuProps={{
                        anchorEl: anchorElBirthYear,
                        getContentAnchorEl: null,
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        classes: {
                          paper: classes.birthYearSelectPaper,
                        },
                      }}
                    >
                      {years.map((year, idx) => {
                        return (
                          <MenuItem
                            key={`${year}-${idx}`}
                            value={year}
                            disableRipple={true}
                            className={classes.birthYearSelectItem}
                          >
                            {year}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                  <FormHelperText className={classes.birthYearSelectHelpText}>
                    {t("getter_fe.auth.common.birthYearSelectorHelpText")}
                  </FormHelperText>
                  {touched.birthyear && errors.birthyear && (
                    <FormHelperText
                      className={classes.textHelper}
                      error={Boolean(touched.birthyear && errors.birthyear)}
                    >
                      <WarningIcon className={classes.warningIcon} />
                      {errors.birthyear}
                    </FormHelperText>
                  )}
                </FormControl>

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

                <GButton
                  type="submit"
                  variant="contained"
                  className={classes.btn}
                  disabled={Boolean(
                    !isValid ||
                      isLoading ||
                      !dirty ||
                      usernameExistError ||
                      serverError ||
                      emailExistError ||
                      usernameClaimable ||
                      emailServerError,
                  )}
                  loading={isLoading}
                >
                  {t("getter_fe.auth.common.next")}
                </GButton>

                <div className={classes.contentBottom}>
                  {t("getter_fe.auth.common.haveAccountAlready")}
                  <Link
                    to={"/login"}
                    className={clsx(classes.link, "text-link")}
                  >
                    {` ${t("getter_fe.auth.common.login")}`}
                  </Link>
                </div>

                {!recaptchaDisabled && (
                  <ReCaptcha recaptchaRef={reCaptchaRef} />
                )}
              </form>
            );
          }}
        </Formik>
      </div>
    </>
  ); // renderSignup form
} // class SignupForm
