import React, {useEffect, useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {LoginForm} from "../../components/auth/comps/LoginForm";
import {ForgotLoginForm} from "../../components/auth/comps/ForgotLoginForm";
import {SendCode} from "../../components/auth/comps/SendCode";
import {ChangePasswordForm} from "../../components/auth/comps/ChangePasswordForm";
import {changeLoginStep} from "../../components/auth/store";
import {userConstants} from "../../components/auth/_constants";
import {
  resetTimelineStatus,
  resetTimelineData,
} from "src/app/components/timeline/store";
import {useRedirectAfterLogin} from "src/util/useRedirectAfterLogin";

const useStyles = makeStyles((theme) =>
  createStyles({
    contentContainer: {
      margin: "0 auto",
      [theme.breakpoints.up("xl")]: {
        maxWidth: theme.spacing(62.5),
      },
      [theme.breakpoints.down("lg")]: {
        minWidth: theme.spacing(52.125),
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
  }),
);

const connector = connect(
  (state) => {
    return {
      authenticated: state.auth?.session?.authenticated,
      currentStep: state.auth?.loginStep?.step,
    };
  },
  {changeLoginStep, resetTimelineStatus, resetTimelineData},
);

export const LoginPageNew = connector(_LoginPageNew);

function _LoginPageNew({
  setPageSeo,
  currentStep,
  changeLoginStep,
  portal,
  authenticated,
  resetTimelineStatus,
  resetTimelineData,
}) {
  const classes = useStyles();
  const redirectAfterLogin = useRedirectAfterLogin();
  const [step, setStep] = useState(currentStep);

  useEffect(() => {
    return () => {
      goToLogin();
    };
  }, []);

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (authenticated) {
      resetTimelineData();
      resetTimelineStatus();
      redirectAfterLogin();
    }
  }, [authenticated]);

  function goToLogin() {
    setStep(userConstants.STEP_LOGIN);
    changeLoginStep(userConstants.STEP_LOGIN);
  }

  function goToSendCode() {
    setStep(userConstants.STEP_SEND_CODE);
    changeLoginStep(userConstants.STEP_SEND_CODE);
  }

  return (
    <div className={classes.contentContainer}>
      {step === userConstants.STEP_LOGIN && (
        <LoginForm
          setPageSeo={setPageSeo}
          gotoForgotPassword={() => goToSendCode()}
          portal={portal}
        />
      )}

      {step === userConstants.STEP_SEND_CODE && (
        <ForgotLoginForm
          setPageSeo={setPageSeo}
          goBack={() => goToLogin()}
          handleErrorEmail={() => {}}
        />
      )}

      {step === userConstants.STEP_VERIF_CODE && (
        <SendCode
          setPageSeo={setPageSeo}
          goBack={() => {
            goToSendCode();
          }}
          type={userConstants.VERIF_CODE_TYPE_F_PWD}
          handleSignup={() => {}}
        />
      )}

      {step === userConstants.STEP_CHANGE_PASSWORD && (
        <ChangePasswordForm
          setPageSeo={setPageSeo}
          submitRequest={() => {}}
          goBack={() => {}}
        />
      )}
    </div>
  );
}
