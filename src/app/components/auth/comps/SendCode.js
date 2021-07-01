import React, {useState, useEffect, useRef} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ReactCodeInput from "react-verification-code-input";
import clsx from "clsx";
import {FormHelperText, Typography} from "@material-ui/core";
import {t} from "src/i18n/utils";
import {connect} from "react-redux";
import {
  verifCode,
  changeLoginStep,
  sendVerifCode,
  resetVerifCodeStatus,
  sendVerifCodeSignup,
} from "../store";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {ReactComponent as ArrowLeftIcon} from "src/assets/icons/basic/back_arrow_large.svg";
import {Counter} from "./Counter";
import {ReactComponent as WarningIcon} from "src/assets/icons/feature/warning.svg";
import {userConstants} from "../_constants";
import AppConst from "src/app/AppConsts";
import ReCaptcha from "./ReCaptcha";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(3.75),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
    },
    titleMbSmall: {
      marginBottom: theme.spacing(1.25),
    },
    formContainer: {
      maxWidth: theme.spacing(55),
    },
    textHelper: {
      fontSize: 15,
      lineHeight: "20px",
      fontWeight: 400,
      color: theme.palette.text.lightGray,
      letterSpacing: "0.01em",
    },
    inputs: {
      minWidth: theme.spacing(40.5),
      marginTop: theme.spacing(5),
      width: "auto !important",

      "& > div": {
        position: "relative",
        paddingTop: 0,
        top: 0,
        textAlign: "left",
      },
      "& > div:first-child": {
        display: "flex",
        paddingTop: 0,
      },
      "& input:not([type='checkbox']):not([type='radio'])": {
        marginRight: theme.spacing(3.75),
        border: `1px solid ${theme.input.borderColor}`,
        backgroundColor: theme.input.background,
        borderRadius: 5,
        fontSize: 22,
        fontWeight: 700,
        color: theme.palette.text.main,
        [theme.breakpoints.only("xs")]: {
          marginRight: theme.spacing(1),
        },
      },
      "& input:not([type='checkbox']):not([type='radio']):last-child": {
        marginRight: 0,
      },
    },
    contentBottom: {
      fontSize: 14,
      color: theme.palette.text.main,
      textAlign: "center",
      letterSpacing: "0.01em",
      "& span": {
        display: "inline-block",
        marginLeft: theme.spacing(1),
        fontWeight: 400,
      },
    },
    contentBottomSendCode: {
      marginTop: theme.spacing(13),
      textAlign: "left",
      color: theme.palette.text.primary,
    },
    textHelperContainer: {
      display: "flex",
    },
    warningIcon: {
      "& path": {
        fill: theme.palette.error.main,
      },
      marginTop: 18,
      marginRight: 4,
      minWidth: 16,
    },
    textHelperError: {
      fontSize: 14,
      lineHeight: "18.2px",
      fontWeight: 400,
      color: theme.palette.error.main,
      textTransform: "capitalize",
    },
    textHelperErrorSendCode: {
      marginTop: theme.spacing(2.25),
      textTransform: "none",
    },
    incorrectEmail: {
      marginTop: theme.spacing(0.5),
    },
    link: {
      textTransform: "capitalize",
      cursor: "pointer",
      color: theme.palette.text.link,
      fontWeight: 400,
      display: "inline-block",
      letterSpacing: "0.01em",
    },
    linkDisabled: {
      "& span": {
        color: theme.palette.text.light,
        cursor: "default",
      },
      "& span:hover": {
        color: theme.palette.text.light,
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
      "& svg": {
        transform: "scale(1.5)",
      },
    },
    icon: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      stroke: theme.palette.text.main,
    },
    infoText: {
      fontSize: 12,
      letterSpacing: "0.01em",
      marginTop: theme.spacing(2.5),
      color: theme.palette.primary.light,
      lineHeight: "16px",
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      email: state.auth?.sendVerifCode?.data?.email,
      password: state.auth?.sendVerifCode?.data?.password,
      username: state.auth?.sendVerifCode?.data?.username,
      isLoading: state.auth?.verifCode?.isLoading,
      error: state.auth?.verifCode?.error,
      success: state.auth?.verifCode?.success,
    };
  },
  {
    verifCode,
    changeLoginStep,
    sendVerifCode,
    resetVerifCodeStatus,
    sendVerifCodeSignup,
  },
);

export const SendCode = connector(_SendCode);

function _SendCode({
  goBack,
  error,
  verifCode,
  isLoading,
  success,
  email,
  username,
  password,
  changeLoginStep,
  sendVerifCode,
  resetVerifCodeStatus,
  sendVerifCodeSignup,
  type,
  handleSignup,
}) {
  const classes = useStyles();
  const [canSendAgain, setCanSendAgain] = useState(false);
  const timeBeforeSendAgain = 60000; // ms
  const inputsComp = useRef(null);
  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";

  const handleSendAgain = async (type, params) => {
    if (canSendAgain) {
      const token = recaptchaDisabled
        ? null
        : await reCaptchaRef.current?.executeAsync();

      // reset inputs values
      inputsComp.current.__clearvalues__();

      // reset status
      resetVerifCodeStatus();

      let res;

      if (type === userConstants.VERIF_CODE_TYPE_F_PWD) {
        res = await sendVerifCode({...params, token});
      } else if (type === userConstants.VERIF_CODE_TYPE_SIGNUP) {
        res = await sendVerifCodeSignup({...params, token});
      }

      !recaptchaDisabled && reCaptchaRef.current?.reset();

      if (res && res?.payload) {
        // success notification
        toast(
          <NotifMessage
            message={t("getter_fe.auth.common.sendCodeSuccessAgain")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: AppConst.NOTIF_MESSAGE_SUCCESS,
          },
        );
      } else {
        // error notification
        toast(
          <NotifMessage
            message={t("getter_fe.auth.common.failedToChangePassword")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: AppConst.NOTIF_MESSAGE_ERROR,
          },
        );
      }
    }

    setCanSendAgain(false);
    setTimeout(() => {
      setCanSendAgain(true);
    }, timeBeforeSendAgain);
  };

  useEffect(() => {
    if (!email) {
      goBack();
    }
    setTimeout(() => {
      setCanSendAgain(true);
    }, timeBeforeSendAgain);
  }, []);

  useEffect(() => {
    if (type === userConstants.VERIF_CODE_TYPE_F_PWD) {
      success &&
        toast(
          <NotifMessage message={t("getter_fe.auth.common.codeVerified")} />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.SUCCESS,
          },
        );

      success && changeLoginStep(userConstants.STEP_CHANGE_PASSWORD);
    }

    if (type === userConstants.VERIF_CODE_TYPE_SIGNUP) {
      success && handleSignup();
    }
  }, [success]);

  useEffect(() => {
    resetVerifCodeStatus();
  }, []);

  return (
    <div className={classes.formContainer}>
      <div className={classes.backWrapper}>
        <span className={classes.back} onClick={goBack}>
          <ArrowLeftIcon className={classes.icon} />
        </span>
      </div>
      <Typography
        variant="h1"
        className={clsx(classes.title, classes.titleMbSmall)}
      >
        {t("getter_fe.auth.forgotPwd.weSentYouCode")}
      </Typography>

      <Typography variant="body2" className={classes.textHelper}>
        {t("getter_fe.auth.forgotPwd.interBelowToVerify")}
        <br /> {email ? email : ""}
      </Typography>
      {/* TODO handle this link */}
      <Link className={clsx(classes.link, classes.incorrectEmail)} to="/signup">
        {t("getter_fe.auth.common.emailIncorrect")}
      </Link>

      <div className={classes.inputsWrapper}>
        <ReactCodeInput
          ref={inputsComp}
          className={classes.inputs}
          onComplete={async (code) => {
            const token = recaptchaDisabled
              ? null
              : await reCaptchaRef.current?.executeAsync();
            reCaptchaRef.current?.reset();
            const params = {
              type: type,
              data: {code: code, email: email, token: token},
            };
            await verifCode(params);
            !recaptchaDisabled && reCaptchaRef.current?.reset();
          }}
          autoFocus={true}
          fields={6}
          fieldWidth={46}
          fieldHeight={51}
          loading={!error && isLoading}
          disabled={!error && isLoading}
        />
        {error && (
          <div className={classes.textHelperContainer}>
            <WarningIcon className={classes.warningIcon} />
            <FormHelperText
              className={clsx(
                classes.textHelperError,
                classes.textHelperErrorSendCode,
              )}
            >
              {t("getter_fe.auth.common.sendCodeIncorrect")}
            </FormHelperText>
          </div>
        )}
      </div>
      <div className={classes.infoText}>
        <p>
          {t("getter_fe.auth.common.haventReceivedCode")}{" "}
          {/* TODO handle this link */}
          <Link className={classes.link} to="/">
            {t("getter_fe.auth.common.learnMore")}
          </Link>
        </p>
      </div>

      <div
        className={clsx(
          classes.contentBottom,
          classes.contentBottomSendCode,
          !canSendAgain && classes.linkDisabled,
        )}
      >
        {t("getter_fe.auth.common.didntReceiveEmail")}
        <span
          className={classes.link}
          onClick={() => {
            canSendAgain &&
              (type === userConstants.VERIF_CODE_TYPE_SIGNUP ||
                type === userConstants.VERIF_CODE_TYPE_F_PWD) &&
              handleSendAgain(type, {
                email: email,
                password: password,
                username: username,
              });
          }}
        >
          {t("getter_fe.auth.common.sendAgain")}
          {!canSendAgain && <Counter time={timeBeforeSendAgain} />}
        </span>
      </div>
      {!recaptchaDisabled && <ReCaptcha recaptchaRef={reCaptchaRef} />}
    </div>
  );
}
