import React, {useState} from "react";
import {useHistory, Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {t} from "../../i18n/utils";
import HoverPopup from "../components/HoverPopup";
import {AvatarLink} from "./AvatarLink";
import {ReactComponent as VerificationIcon} from "../../assets/icons/feature/verification.svg";
import clsx from "clsx";
import {FollowUserButton} from "./FollowUserButton";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {shortNum} from "src/util/NumberUtil";
import {
  STATUS_FOLLOWING,
  STATUS_NOT_FOLLOWING,
} from "src/core/model/social/XMFollow";

const useStyles = makeStyles((theme) => ({
  container: {
    cursor: "pointer",
    position: "relative",
    width: "100%",
    height: "auto",
    display: "block",
    padding: theme.spacing(2.5),
    borderRadius: 10,
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.mixins.post.shadow,
    "&:hover": {
      backgroundColor: "#F5F5F5", // theme.palette.background.dark
    },
  },
  card: {
    display: "block",
    width: "100%",
    height: "auto",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(11),
    height: theme.spacing(11),
    cursor: "pointer",
    margin: theme.spacing(0, "auto"),
  },
  userInfo: {
    width: "100%",
    alignItems: "center",
  },
  usernameWrapper: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  userAvatarContainer: {
    display: "flex",
  },
  displayName: {
    marginBottom: 2,
    fontSize: "13px",
    lineHeight: "18px",
    fontWeight: 700,
    color: theme.palette.text.main,
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },
  displayIcon: {
    // verticalAlign: "top",
    width: theme.spacing(1.875),
    margin: theme.spacing(-0.5, 0, 0, 0.5),
    borderRadius: "100%",
  },
  numberWrapper: {
    width: "100%",
    textAlign: "center",
  },
  number: {
    color: theme.palette.secondary.light,
    fontWeight: 400,
    fontSize: 13,
    lineHeight: "16.9px",
  },
  clickButton: {
    display: "flex",
    justifyContent: "center",
    "& .follow-btn-custom": {
      color: theme.palette.text.disabled,
      backgroundColor: theme.palette.primary.main,
      border: "unset !important",
      maxWidth: theme.spacing(15.25),
      height: theme.spacing(3.25),
      "&:hover": {
        color: "#FFFFFF !important", // theme.palette.text.disabled,
        backgroundColor: "#3D3C7C !important", // theme.palette.background.hover,
      },
      "&.MuiButton-contained": {
        "&:not(:disabled)": {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.button.grey.default,
          "&:hover": {
            color: theme.palette.text.disabled,
            width: theme.spacing(15.25),
            backgroundColor: theme.palette.background.hover,
          },
        },
      },
      "& span": {
        fontSize: "12px",
        fontWeight: 500,
      },
    },
  },
}));

export const UserCard = ({
  userInfo,
  isAt,
  suggestFollow = null,
  disableHistoryPush,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [followStatus, setFollowStatus] = useState(userInfo.isFollowing);

  const getUserStatus = (status) => {
    setFollowStatus(status);
  };

  const getTotalFollowers = () => {
    let flg = userInfo.flg ? userInfo.flg : 0;
    let twitter = userInfo.twt_flg ? userInfo.twt_flg : 0;
    return shortNum(flg * 1 + twitter * 1);
  };

  return (
    <>
      {userInfo && (
        <div className={classes.container}>
          <Link className={classes.card} to={`/user/${userInfo._id}`}>
            <div className={classes.avatar}>
              <HoverPopup
                userId={userInfo._id}
                userInfoTemp={userInfo}
                getUserStatus={getUserStatus}
              >
                <div key="popup-handler" className="user-avatar">
                  <AvatarLink
                    avatarUrl={userInfo.ico}
                    styleClasses={classes.avatar}
                    userId={userInfo._id}
                    username={userInfo.nickname}
                    disableHistoryPush={disableHistoryPush}
                  />
                </div>
              </HoverPopup>
            </div>
            <br />
            <div className={classes.userInfo}>
              <div className={classes.usernameWrapper}>
                <HoverPopup
                  userId={userInfo._id}
                  userInfoTemp={userInfo}
                  getUserStatus={getUserStatus}
                  leftAligned={true}
                >
                  <div
                    className={clsx(classes.userAvatarContainer, "user-avatar")}
                    key="popup-handler"
                  >
                    <span className={classes.displayName}>
                      <GTwemoji text={userInfo.nickname || userInfo._id} />
                    </span>
                    {userInfo.infl && (
                      <VerificationIcon className={classes.displayIcon} />
                    )}
                  </div>
                </HoverPopup>
              </div>
              <div className={classes.numberWrapper}>
                <span className={classes.number}>
                  {isAt
                    ? `@${userInfo.ousername || userInfo.username}`
                    : `${getTotalFollowers()} ${t(
                        "getter_fe.profile.common.followers",
                      )}`}
                </span>
              </div>
            </div>
          </Link>
          <div className={classes.clickButton}>
            <FollowUserButton
              clsButton={"follow-btn-custom"}
              userId={userInfo._id}
              status={followStatus ? STATUS_FOLLOWING : STATUS_NOT_FOLLOWING}
              username={
                userInfo.nickname || userInfo.ousername || userInfo.username
              }
              suggestFollow={() => suggestFollow && suggestFollow(userInfo._id)}
            />
          </div>
        </div>
      )}
    </>
  );
};
