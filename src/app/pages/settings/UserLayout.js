import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as VerificationIcon} from "../../../assets/icons/feature/verification.svg";
import {GButton} from "../../../styles/components/GButton";
import {AvatarLink} from "../../components/AvatarLink";
import {FollowUserButton} from "../../components/FollowUserButton";
import clsx from "clsx";
import {t} from "../../../i18n/utils";
import AppConsts from "../../AppConsts";
import {Link, useHistory} from "react-router-dom";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import HoverPopup from "src/app/components/HoverPopup";
import {changeMutedStatus, changeBlockedStatus} from "src/store/modules/status";
import Global from "src/system/Global";
import {shortNum} from "../../../util/NumberUtil";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    padding: theme.spacing(1.875, 2),
    marginBottom: theme.spacing(1.875),
    boxShadow: "0px 0px 7px 6px rgba(0, 0, 0, 0.02)",
    borderRadius: "10px",
    background: theme.palette.background.default,
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(6.25),
    height: theme.spacing(6.25),
    marginRight: theme.spacing(1.25),
    cursor: "pointer",
  },
  check: {
    width: theme.spacing(1.875),
    margin: theme.spacing(0, 0, 0, 0.5),
    height: "auto",
  },
  displayNameWrapper: {
    display: "flex",
    alignItems: "center",
  },
  displayName: {
    fontSize: 15,
    lineHeight: "18px",
    fontWeight: "bold",
    color: theme.palette.text.primary,
    textTransform: "capitalize",
    display: "inline-block",
    maxWidth: theme.spacing(45),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      maxWidth: theme.spacing(22.5),
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: theme.spacing(17.5),
    },
  },
  usernameWrapper: {
    display: "flex",
    marginTop: theme.spacing(0.375),
  },
  username: {
    fontSize: 15,
    lineHeight: "130%",
    marginRight: theme.spacing(0.625),
    color: theme.palette.text.gray,
  },
  btn: {
    height: theme.spacing(4),
    minHeight: theme.spacing(4),
    textTransform: "capitalize",
    padding: theme.spacing(1, 1.875),
    "& .MuiButton-label": {
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: "14px",
    },
    "&.MuiButton-containedPrimary": {
      background: `${theme.palette.primary.main} !important`,
    },
    // "&:hover": {
    //   boxShadow: "none",
    // },
  },
  btnOutlined: {
    // border: `1px solid ${theme.palette.error.light}`,
    // color: theme.palette.error.light,
    // "&.MuiButton-containedPrimary:not(:disabled)": {
    //   background: "transparent",
    // },
  },
  followBtn: {
    // "&:hover": {
    //   border: `1px solid ${theme.palette.error.light}`,
    //   color: theme.palette.error.light,
    //   "&.MuiButton-containedPrimary:not(:disabled)": {
    //     background: "transparent",
    //   },
    // },
    // "& div span:last-child": {
    //   display: "none",
    // },
    // "&:hover div span:last-child": {
    //   display: "inline-block",
    // },
    // "&:hover div span:first-child": {
    //   display: "none",
    // },
  },
}));

export const UserLayout = ({
  user,
  notChecked,
  type,
  xUserStats,
  updateUserStats,
  removeItem = null,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(notChecked ? false : true);
  const [userData] = useState(user);
  // const [xUserInfo, setXUserInfo] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  const authRedirect = useAuthRedirect();

  const api = Global.GetPortal().getAppService();

  const isLoggedIn = api.portal.userLoggedIn();

  // const fetchUserInfo = async () => {
  //   if (isLoading) return;
  //   setIsLoading(true);
  //
  //   try {
  //     if (user._id) {
  //       const res = await api.fetchUserInfo(user._id);
  //       res && setXUserInfo(res);
  //     }
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleMute = async () => {
    if (!isLoggedIn) {
      authRedirect();
      return;
    }
    api.muteUser(user._id, (error, result) => {
      if (result === null) {
        toast(
          <NotifMessage
            message={t("getter_fe.auth.errors.somethingWentWrong")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.WARNING,
          },
        );
      } else {
        setIsChecked(true);
        dispatch(
          changeMutedStatus({
            userId: user._id,
            status: true,
          }),
        );
      }
    });
  };

  const handleUnmute = async () => {
    if (!isLoggedIn) {
      authRedirect();
      return;
    }
    await api.unmuteUser(user._id, (error, result) => {
      if (result === null) {
        toast(
          <NotifMessage
            message={t("getter_fe.auth.errors.somethingWentWrong")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.WARNING,
          },
        );
      } else {
        setIsChecked(false);
        dispatch(
          changeMutedStatus({
            userId: user._id,
            status: false,
          }),
        );
      }
    });
  };

  const handleUnblock = async () => {
    if (!isLoggedIn) {
      authRedirect();
      return;
    }
    api.unblockUser(user._id, (error, result) => {
      if (result === null) {
        toast(
          <NotifMessage
            message={t("getter_fe.auth.errors.somethingWentWrong")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.WARNING,
          },
        );
      } else {
        setIsChecked(false);
        dispatch(
          changeBlockedStatus({
            userId: user._id,
            status: false,
          }),
        );
      }
    });
  };

  const handleBlock = async () => {
    if (!isLoggedIn) {
      authRedirect();
      return;
    }
    api.blockUser(user._id, (error, result) => {
      if (result === null) {
        toast(
          <NotifMessage
            message={t("getter_fe.auth.errors.somethingWentWrong")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.WARNING,
          },
        );
      } else {
        setIsChecked(true);
        dispatch(
          changeBlockedStatus({
            userId: user._id,
            status: true,
          }),
        );
      }
    });
  };

  const handleFollow = async () => {
    if (!isLoggedIn) {
      authRedirect();
      return;
    }
    setIsChecked(true);
    await api.userFollows(user._id, null, (err, res) => {
      /**
       * will take any reponse different from "AppConsts.STATUS_ACCEPTED" as an error
       */
      res !== AppConsts.STATUS_ACCEPTED && setIsChecked(false);

      /**
       * will take "AppConsts.STATUS_ACCEPTED" as success reponse for now until the BE will fix it
       */
      if (res === AppConsts.STATUS_ACCEPTED) {
        xUserStats.setFollowsCount(xUserStats.getFollowsCount() + 1);
        updateUserStats();
        setIsChecked(true);
      }
    });
  };

  const handleUnfollow = async () => {
    if (!isLoggedIn) {
      authRedirect();
      return;
    }
    const title = t("getter_fe.profile.common.unfollowUsername", {
      username: user._id,
    });
    GConfirmAlert({
      title,
      text: t("getter_fe.post.tips.unfollow_tips", {
        username: user._id,
      }),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.button.unfollow"),
        type: "danger",
        callback: (close) => {
          requestUnfollow(close);
        },
      },
    });
  };

  const requestUnfollow = async (callback) => {
    setIsChecked(true);

    callback();
    await api.userUnfollows(user._id, null, (err, res) => {
      /**
       * will take any reponse different from "AppConsts.STATUS_ACCEPTED" as an success
       */
      if (res !== AppConsts.STATUS_ACCEPTED) {
        xUserStats.setFollowsCount(xUserStats.getFollowsCount() - 1);
        updateUserStats();
        setIsChecked(false);
      } else {
        setIsChecked(true);
      }
    });
  };

  const getUserStatus = (status) => {
    setIsChecked(status);
  };

  return (
    <>
      {userData && (
        <div className={classes.card}>
          <div className={classes.left}>
            <HoverPopup
              userId={userData._id}
              userInfoTemp={userData}
              getUserStatus={getUserStatus}
            >
              <div key="popup-handler" className="user-avatar">
                <AvatarLink
                  avatarUrl={userData.ico}
                  styleClasses={classes.avatar}
                  userId={userData._id}
                  username={userData.nickname}
                />
              </div>
            </HoverPopup>
          </div>
          <div className={classes.right}>
            <div className={classes.userInfoContainer}>
              <div className={classes.displayNameWrapper}>
                <HoverPopup
                  userId={userData._id}
                  userInfoTemp={userData}
                  getUserStatus={getUserStatus}
                  leftAligned={true}
                >
                  <div
                    key="popup-handler"
                    className={clsx(classes.userAvatarContainer, "user-avatar")}
                  >
                    <Link
                      className={classes.displayName}
                      to={`/user/${userData._id}`}
                    >
                      {userData.nickname || userData.username}
                    </Link>
                  </div>
                </HoverPopup>
                {userData.infl && (
                  <VerificationIcon className={classes.check} />
                )}
              </div>
              <div className={classes.usernameWrapper}>
                <span className={classes.username}>
                  {shortNum(userData.flg)}
                </span>
                <span className={classes.username}>
                  {t("getter_fe.profile.common.followers")}
                </span>
              </div>
            </div>
            <div>
              {type === AppConsts.USER_LIST_BLOCKED && (
                <GButton
                  variant={isChecked ? "outlined" : "contained"}
                  className={clsx(classes.btn, "danger")}
                  onClick={() => (isChecked ? handleUnblock() : handleBlock())}
                >
                  {isChecked
                    ? t("getter_fe.settings.common.blocked")
                    : t("getter_fe.settings.common.block")}
                </GButton>
              )}{" "}
              {type === AppConsts.USER_LIST_MUTED && (
                <GButton
                  variant={isChecked ? "outlined" : "contained"}
                  className={clsx(classes.btn, "danger")}
                  onClick={() => (isChecked ? handleUnmute() : handleMute())}
                >
                  {isChecked
                    ? t("getter_fe.settings.common.muted")
                    : t("getter_fe.settings.common.mute")}
                </GButton>
              )}
              {type === AppConsts.USER_LIST_FOLLOW &&
                userData.username !== api.getUserId() && (
                  <FollowUserButton
                    xUserStats={xUserStats}
                    updateUserStats={updateUserStats}
                    userId={user._id}
                    status={isChecked}
                  />
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
