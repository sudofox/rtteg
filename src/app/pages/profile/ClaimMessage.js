import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {Waypoint} from "react-waypoint";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {setPostStatus} from "src/app/components/timeline/store";
import {FeedItem} from "src/app/components/post/comps/FeedItem";
import {CommentComposerNew} from "src/app/components/post/comps/CommentComposerNew";
import {RepostComposerNew} from "src/app/components/post/comps/RepostComposerNew";
import {t} from "../../../i18n/utils";
import {PostComposer} from "src/app/components/post/comps/PostComposer";
import {GLoader} from "src/styles/components/GLoader";
import {GButton} from "src/styles/components/GButton";
import {connect} from "react-redux";
import GAxios from "src/util/GAxios";
import {Link, useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    claimTop: {
      width: "100%",
      height: "44px",
      marginBottom: "15px",
    },
    tellTwitter: {
      width: "100%",
      background: "rgba(47, 128, 237, 0.15)",
      alignItems: "center",
      textAlign: "center",
      height: "44px",
      paddingTop: "10px",
    },
    link: {
      fontFamily: "PingFang SC",
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "16px",
      lineHeight: "22px",
      color: "#2F80ED",
    },
    sync: {
      width: "100%",
      fontFamily: "PingFang SC",
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "16px",
      lineHeight: "22px",
      textAlign: "center",
      marginTop: "40px",
      marginBottom: "8px",
      color: "#333333",
    },
    sync2: {
      width: "100%",
      fontFamily: "PingFang SC",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "22px",
      textAlign: "center",
      marginBottom: "20px",
      color: "#999999",
    },
  }),
);

const connector = connect((state) => {
  return {
    loggedinUserId: state.auth?.session?.userinfo?._id,
    loggedinUserInfo: state.auth?.session?.userinfo,
  };
});

export const ClaimMessage = connector(_ClaimMessage);

function _ClaimMessage({
  tabValue,
  tabIndex,
  userId,
  loggedinUserId,
  loggedinUserInfo,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tellTwitter, setTellTwitter] = useState(false);
  const [importStatus, setImportStatus] = useState(false);
  const [endHours, setEndHours] = useState(48);

  const fetchAsyncStatus = async () => {
    if (userId === loggedinUserId) {
      let response;
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/import`,
      };

      await GAxios(
        config,
        (res) => {
          if (!res?.data?.result?.status?.finished) {
            setImportStatus(true);
          }
          if (!res.data.result) {
            response = false;
          }
        },
        (err) => {
          console.error(err);
          response = false;
        },
      );
      return response;
    }
  };

  useEffect(() => {
    if (userId === loggedinUserId) {
      let now = Date.now();
      let hours = (now - loggedinUserInfo?.cdate) / (1000 * 60 * 60);
      setEndHours(48 - Math.floor(hours));
      let mins = (now - loggedinUserInfo?.cdate) / (1000 * 60);
      const imPost = localStorage.getItem(userId + "_imPost");
      if (hours < 48 && mins > 1 && imPost) {
        let res = fetchAsyncStatus();
      }

      if (mins < 1 && imPost) {
        setImportStatus(true);
      }
      if (hours < 24) {
        setTellTwitter(true);
      }
    }
  }, [userId]);

  return (
    <div className={classes.root}>
      {tellTwitter && !importStatus && (
        <div className={classes.claimTop}>
          <div className={classes.tellTwitter}>
            <Link
              className={classes.link}
              onClick={() => {
                let text = t("getter_fe.auth.claim.tellTwitterText");
                let href = window.location.origin + `/user/${userId}`;
                window.open(
                  `https://twitter.com/intent/tweet?url=${href}&text=${text}`,
                  "_blank",
                );
              }}
            >
              {t("getter_fe.auth.claim.tellTwitter")}
            </Link>
          </div>
        </div>
      )}
      <div>
        {importStatus && (
          <div className={classes.claimTop}>
            <div className={classes.sync}>
              {t("getter_fe.auth.common.importingMSG1")}
            </div>
            <div className={classes.sync2}>
              {t("getter_fe.auth.common.importingMSG2", {hours: endHours})}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
