import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {t} from "src/i18n/utils";
import {GButton} from "src/styles/components/GButton";
import clsx from "clsx";
import Global from "src/system/Global";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";

import {
  checkUsername,
  checkEmail,
  sendVerifCodeSignup,
  resetVerifCodeStatus,
  resetSendVerifCodeStatus,
  changeSignupStep,
  setClaimUsername,
} from "../store";
import {useDispatch, connect} from "react-redux";
import GAxios from "src/util/GAxios";
import {userConstants} from "../_constants";

const useStyles = makeStyles((theme) =>
  createStyles({
    contentWrapper: {
      maxWidth: theme.spacing(67.5),
    },
    title: {
      marginBottom: theme.spacing(1.875),
      fontSize: 24,
      lineHeight: "130%",
      fontWeight: 600,
      color: theme.palette.text.main,
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(8.125),
      },
    },
    subTitle: {
      marginBottom: theme.spacing(1.875),
      fontSize: 16,
      lineHeight: "12px",
      fontWeight: 600,
      color: theme.palette.text.main,
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(8.125),
      },
    },
    paragraph: {
      marginBottom: theme.spacing(2.5),
      fontSize: 16,
      lineHeight: "140%",
      color: theme.palette.text.secondary,
      [theme.breakpoints.down("sm")]: {
        fontSize: 16,
        lineHeight: "22px",
      },
    },
    stepParagraph: {
      marginBottom: theme.spacing(1.875),
      marginLeft: "3vw",
      fontSize: 14,
      lineHeight: "140%",
      color: theme.palette.text.secondary,
      [theme.breakpoints.down("sm")]: {
        fontSize: 14,
        lineHeight: "22px",
      },
    },
    wrapper: {
      maxHeight: theme.spacing(64.5),
      overflowY: "scroll",
      "& .u-card div:first-child a": {
        borderTop: `1px solid ${theme.palette.grey.A700}`,
      },
    },

    nextBtn: {
      height: theme.spacing(6),
      margin: theme.spacing(0, 0, 5, 0),
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
    step: {
      marginBottom: theme.spacing(3),
    },
    btn: {
      display: "block",
      maxWidth: theme.spacing(20),
      height: theme.spacing(6),
      margin: theme.spacing(0, 0, 1.875, 0),
      marginLeft: "3vw",
      marginRight: "auto",
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
    contentBottom: {
      fontSize: 14,
      color: theme.palette.text.main,
      marginLeft: "3vw",
      cursor: "pointer",
      "& span": {
        display: "inline-block",
        color: theme.palette.text.link,
        marginLeft: theme.spacing(0.5),
        fontSize: 14,
        textDecoration: "underline",
        fontWeight: 400,
        lineHeight: "140%",
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
      success: state.auth.sendVerifCode.success,
      error: state.auth.sendVerifCode.error,
      isLoading: state.auth.sendVerifCode.isLoading,
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

export const ClaimVerify = connector(_ClaimVerify);

function _ClaimVerify() {
  const classes = useStyles();
  const api = Global.GetPortal().getAppService();

  const username = window.sessionStorage.getItem("ClaimUsername");
  const [twitterToken, setTwitterToken] = useState(false);

  const handleCopy = () => {
    let msg =
      t("getter_fe.auth.common.twitterKeyCopied") +
      "" +
      t("getter_fe.auth.common.verifyTwitterAccountStep1Desc1") +
      "" +
      t("getter_fe.auth.common.verifyTwitterAccountStep1Desc2", {
        username: username,
      });
    toast.info(<NotifMessage message={msg} />, {
      type: toast.TYPE.SUCCESS,
    });
  };

  useEffect(() => {
    const getTwitterToken = async () => {
      let result = null;
      let userId = username;
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/u/user/socialauth/${userId}/${userId}`,
        headers: {
          "Content-Type": "application/json",
        },
      };
      let res = await GAxios(
        config,
        (response) => {
          result = "<" + response.data?.result + ">";
          setTwitterToken(response.data?.result);
        },
        (err) => {
          console.info(err);
        },
      );

      return result;
    };

    getTwitterToken();
  }, []);

  const handleTwitter = async () => {
    // let result = await getTwitterToken();
    let result = twitterToken;
    console.info(result);
    let text =
      "<" + result + ">" + "\n" + t("getter_fe.auth.common.twitterText");
    text = encodeURIComponent(text);

    if (result) {
      let href = window.location.origin + `/user/${username}`;
      window.open(
        `https://twitter.com/intent/tweet?url=${href}&text=${text}`,
        "_blank",
      );
    }
  };

  const handleNext = async () => {
    window.location.href = `/claim?token=${twitterToken}`;
  };

  return (
    <div className={classes.contentWrapper}>
      <Typography variant="h1" component="h2" className={classes.title}>
        {t("getter_fe.auth.common.verifyTwitterAccount")}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        {t("getter_fe.auth.common.verifyTwitterAccountDesc1", {
          username: username,
        })}
      </Typography>
      <Typography variant="body1" className={classes.paragraph}>
        {t("getter_fe.auth.common.verifyTwitterAccountDesc2")}
      </Typography>
      <div className={classes.step}>
        <Typography variant="body1" className={classes.subTitle}>
          {t("getter_fe.auth.common.verifyTwitterAccountStep1")}
        </Typography>
        <Typography variant="body1" className={classes.stepParagraph}>
          {t("getter_fe.auth.common.verifyTwitterAccountStep1Desc1")}
          <br />
          {t("getter_fe.auth.common.verifyTwitterAccountStep1Desc2", {
            username: username,
          })}
        </Typography>

        <GButton
          type="submit"
          variant="contained"
          className={classes.btn}
          onClick={handleTwitter}
        >
          {t("getter_fe.auth.common.verifyTwitterAccountStep1Desc3")}
        </GButton>

        <div className={classes.contentBottom}>
          <CopyToClipboard text={twitterToken} onCopy={handleCopy}>
            <div className={clsx(classes.link, "text-link")}>
              {t("getter_fe.auth.common.verifyTwitterAccountStep1Desc4")}{" "}
              <span>
                {t("getter_fe.auth.common.verifyTwitterAccountStep1Desc5")}
              </span>
            </div>
          </CopyToClipboard>
        </div>
      </div>

      <div className={classes.step}>
        <Typography variant="body1" className={classes.subTitle}>
          {t("getter_fe.auth.common.verifyTwitterAccountStep2")}
        </Typography>
        <Typography variant="body1" className={classes.stepParagraph}>
          {t("getter_fe.auth.common.verifyTwitterAccountStep2Desc1")}
          <br />
          {t("getter_fe.auth.common.verifyTwitterAccountStep2Desc2")}
        </Typography>
      </div>
      <GButton
        type="submit"
        variant="contained"
        className={classes.nextBtn}
        onClick={handleNext}
        disabled={!twitterToken}
      >
        {t("getter_fe.auth.common.next")}
      </GButton>
    </div>
  );
}
