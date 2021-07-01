import React, {useEffect, useState, useRef, Fragment} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {VerifError} from "src/app/components/auth/comps/VerifError";
import {SignupForm} from "src/app/components/auth/comps/SignupForm";
import {SendCode} from "src/app/components/auth/comps/SendCode";
import {ClaimVerify} from "src/app/components/auth/comps/ClaimVerify";
import {ReCaptcha} from "src/app/components/auth/comps/ReCaptcha";
import {changeSignupStep} from "src/app/components/auth/store";
import {userConstants} from "src/app/components/auth/_constants";
import {signup, login} from "src/app/components/auth/store";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {getLang, t} from "src/i18n/utils";
import {DiscoverPeople} from "src/app/components/auth/comps/DiscoverPeople";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
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
    contentWrapperW: {
      maxWidth: theme.spacing(74.625),
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      authenticated: state.auth?.session?.authenticated,
      currentStep: state.auth?.signupStep?.step,
      email: state.auth?.sendVerifCode?.data?.email,
      password: state.auth?.sendVerifCode?.data?.password,
      username: state.auth?.sendVerifCode?.data?.username,
      code: state.auth?.verifCode?.code,
    };
  },
  {changeSignupStep, signup, login},
);

export const SignupPageNew = connector(_SignupPageNew);

function _SignupPageNew({
  currentStep,
  changeSignupStep,
  portal,
  signup,
  code,
  email,
  password,
  username,
}) {
  const classes = useStyles();
  const [step, setStep] = useState(currentStep);

  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";

  useEffect(() => {
    return () => {
      goToSignup();
    };
  }, []);

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep]);

  function goToSignup() {
    setStep(userConstants.STEP_SIGNUP);
    changeSignupStep(userConstants.STEP_SIGNUP);
  }

  async function handleSignup() {
    const lang = getLang();
    const token = recaptchaDisabled
      ? null
      : await reCaptchaRef.current?.executeAsync();
    const loginState = await signup({
      pwd: password,
      email: email,
      lang: lang,
      username: username,
      code: code,
      token: token,
      portal: portal,
    });
    !recaptchaDisabled && reCaptchaRef.current?.reset();

    if (loginState.payload?.authenticated) {
      toast(
        <NotifMessage message={t("getter_fe.auth.common.accountCreated")} />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
        },
      );

      setStep(userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP);
      changeSignupStep(userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP);
    } else {
      toast(
        <NotifMessage
          message={
            loginState.payload?.err?.includes("Invalid email address")
              ? t("getter_fe.auth.errors.emailInvalid")
              : loginState.payload?.err?.includes("Invalid verification code")
              ? t("getter_fe.auth.errors.codeInvalid")
              : loginState.payload?.err?.includes("expired")
              ? t("getter_fe.auth.errors.codeExpired")
              : t("getter_fe.auth.errors.somethingWentWrong")
          }
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.WARNING,
        },
      );
    }
  }

  return (
    <div
      className={clsx(
        classes.contentWrapper,
        step === userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP
          ? classes.contentWrapperW
          : "",
      )}
    >
      {step === userConstants.STEP_SIGNUP && <SignupForm portal={portal} />}

      {step === userConstants.STEP_VERIF_CODE && (
        <Fragment>
          <SendCode
            goBack={() => goToSignup()}
            type={userConstants.VERIF_CODE_TYPE_SIGNUP}
            handleSignup={() => handleSignup()}
          />
          {!recaptchaDisabled && <ReCaptcha recaptchaRef={reCaptchaRef} />}
        </Fragment>
      )}

      {step === userConstants.CLAIM_VERIFY && <ClaimVerify />}

      {step === userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP && <DiscoverPeople />}

      {step === userConstants.STEP_VERIF_ERROR && <VerifError />}
    </div>
  );
}
