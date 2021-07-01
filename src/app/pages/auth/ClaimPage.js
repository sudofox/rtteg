import React, {useEffect, useState, useRef, Fragment} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {VerifyForm} from "./VerifyForm";
import {SendCode} from "src/app/components/auth/comps/SendCode";
import {ReCaptcha} from "src/app/components/auth/comps/ReCaptcha";
import {changeSignupStep} from "src/app/components/auth/store";
import {userConstants} from "src/app/components/auth/_constants";
import {signup, claimSignup, setClaimed} from "src/app/components/auth/store";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {getLang, t} from "src/i18n/utils";
import {useHistory} from "react-router-dom";
import Global from "src/system/Global";
import GAxios from "src/util/GAxios";
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
      loggedinUserInfo: state.auth?.session?.userinfo,
      currentStep: state.auth?.signupStep?.step,
      email: state.auth?.sendVerifCode?.data?.email,
      password: state.auth?.sendVerifCode?.data?.password,
      username: state.auth?.claimStep?.username,
      imPost: state.auth?.claimStep?.imPost,
      claimed: state.auth?.claimStep?.claimed,
      code: state.auth?.verifCode?.code,
    };
  },
  {changeSignupStep, signup, claimSignup, setClaimed},
);

export const ClaimPage = connector(_ClaimPage);

function _ClaimPage({
  currentStep,
  changeSignupStep,
  claimSignup,
  email,
  password,
  username,
  imPost,
}) {
  const classes = useStyles();
  const [step, setStep] = useState(currentStep);
  const [redirectURL, setRedirectURL] = useState("");
  const history = useHistory();
  const reCaptchaRef = useRef();
  const recaptchaDisabled =
    process.env.REACT_APP_GOOGLE_RECAPTCHA_DISABLED === "true";

  const userClaimPlan = window.sessionStorage.getItem("UserClaimPlan");

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
    let search = window.location.search;
    let url = `${process.env.REACT_APP_API_URL}/u/user/openauth/${search}`;
    if (userClaimPlan === "B")
      url = `${process.env.REACT_APP_API_URL}/u/user/socialauth/${search}`;
    const lang = getLang();
    let portal = Global.GetPortal();
    const loginState = await claimSignup({
      username,
      email,
      pwd: password,
      search,
      portal,
      url,
      callback: (err, res) => {
        console.info(res);
        console.error(err);

        if (err) {
          toast(<NotifMessage message={t("getter_fe.common.errorOccured")} />, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.ERROR,
          });
          history.push("/claim-failed");
        }
      },
    });

    if (loginState.payload?.authenticated) {
      toast(
        <NotifMessage message={t("getter_fe.auth.common.accountClaimed")} />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
        },
      );
      username = loginState.payload?.userinfo?._id;

      if (imPost) {
        //import posts
        await postImportPosts(username);
      }

      setStep(userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP);
      changeSignupStep(userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP);
      setRedirectURL("/user/" + username);
    }
  }

  const postImportPosts = async (userId) => {
    let data = null;
    const config = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/import`,
      data,
    };
    await GAxios(
      config,
      (res) => {
        //todo:
        console.info(res);
      },
      (err) => {
        console.error(err);
        // history.push("/claim-failed");
      },
    );
  };

  return (
    <div
      className={clsx(
        classes.contentWrapper,
        step === userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP
          ? classes.contentWrapperW
          : "",
      )}
    >
      {step === userConstants.STEP_SIGNUP && <VerifyForm />}

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

      {step === userConstants.DISCOVER_PEOPLE_TYPE_SIGNUP && (
        <DiscoverPeople redirectURL={redirectURL} />
      )}
    </div>
  );
}
