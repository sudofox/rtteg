import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {GButton} from "../../styles/components/GButton";
import {t} from "../../i18n/utils";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {changeFollowingStatus} from "src/store/modules/status";
import {GLoader} from "src/styles/components/GLoader";
import {toast} from "react-toastify";
import {
  STATUS_FOLLOWING,
  STATUS_NOT_FOLLOWING,
  STATUS_PENDING,
  STATUS_BLOCKED,
  STATUS_UNKNOWN,
} from "../../core/model/social/XMFollow";
import Global from "src/system/Global";
import {removePuByUserId} from "src/app/components/timeline/store";
import {useAuthRedirect} from "src/util/useAuthRedirect";
import AppConsts from "../AppConsts";

const useStyles = makeStyles((theme) =>
  createStyles({
    btn: {
      lineHeight: "26px",
      fontWeight: theme.typography.fontWeightBold,
      textTransform: "capitalize",
      borderRadius: 32,
      transition: "width 0.25s",
      color: theme.palette.text.primary,
      "&:hover": {
        backgroundColor: `${theme.palette.background.button.grey.default} !important`,
      },
      "&.unlock-following": {
        backgroundColor: `${theme.palette.background.button.grey.default} !important`,
      },
      "& .MuiButton-label": {
        fontSize: 16,
        fontWeight: 700,
      },
      "&.follow-button:hover": {
        backgroundColor: "#3D3C7C !important",
      },
      "&.follow-button": {
        backgroundColor: "#232255 !important",
        color: "white !important",
      },
    },
    unfollowBtn: {
      lineHeight: "26px",
      fontWeight: theme.typography.fontWeightBold,
      textTransform: "capitalize",
      backgroundColor: `#CC0000 !important`,
      borderRadius: 32,
      "& .MuiButton-label": {
        fontSize: 16,
        fontWeight: 700,
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      authenticated: state.auth?.session?.authenticated,
      following: state.status.following,
    };
  },
  {changeFollowingStatus, removePuByUserId},
);

export const FollowUserButton = connector(_FollowUserButton);

function _FollowUserButton({
  userId,
  xUserStats,
  updateUserStats,
  getUserStatus = null,
  following,
  username,
  changeFollowingStatus,
  scene,
  suggestFollow = null,
  isPopup = false,
  authenticated,
  clsButton = null,
  removePuByUserId,
}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [statusLabel, setStatusLabel] = useState();
  const [lockFollowing, setLockFollowing] = useState(false);
  const authRedirect = useAuthRedirect();

  const api = Global.GetPortal().getAppService();
  const loggedInUserId = api.getUserId();
  userId = userId?.toLowerCase();
  const userIsSelf = loggedInUserId === userId;

  if (userIsSelf) {
    return null;
  }

  const status = following[userId] ? "y" : "n";

  useEffect(() => {
    const getFollowLabel = () => {
      if (status === STATUS_FOLLOWING && (!hover || lockFollowing)) {
        return t("getter_fe.common.user.following");
      } else if (status === STATUS_FOLLOWING && hover) {
        return t("getter_fe.common.user.unfollow");
      } else {
        return t("getter_fe.common.user.follow");
      }
    };
    if (
      authenticated &&
      scene === "public-user-view" &&
      following[userId] === undefined
    ) {
      fetchFollowStatus();
    }
    setStatusLabel(getFollowLabel());
  }, [hover, status, lockFollowing]);

  const fetchFollowStatus = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const ret = await api.userFollowStatus(userId);
      console.log(ret);
      if (ret === STATUS_NOT_FOLLOWING) {
        changeFollowingStatus({
          userId,
          status: false,
        });
      } else if (ret === STATUS_FOLLOWING) {
        changeFollowingStatus({
          userId,
          status: true,
        });
      } else if (ret === STATUS_PENDING || ret === STATUS_BLOCKED) {
        setHidden(true);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const followUser = async (e) => {
    if (loading) return;
    // setLoading(true);

    changeFollowingStatus({
      userId,
      status: true,
    });
    setLockFollowing(true);

    try {
      api.userFollows(userId, null, (err) => {
        // setLoading(false);
        if (err) {
          changeFollowingStatus({
            userId,
            status: false,
          });

          if (err && err.data?.emsg?.includes("status code 429")) {
            toast(
              <NotifMessage message={t("getter_fe.common.errorTips.err429")} />,
              {
                position: toast.POSITION.TOP_CENTER,
                type: AppConsts.NOTIF_MESSAGE_ERROR,
              },
            );
          } else if (err && err.data?.emsg?.includes("blocked")) {
            toast(
              <NotifMessage
                message={t("getter_fe.profile.common.unblockedBy", {
                  username,
                })}
              />,
              {
                type: toast.TYPE.ERROR,
              },
            );
          }
        } else {
          xUserStats?.setFollowsCount(xUserStats?.getFollowsCount() + 1);
          if (xUserStats && updateUserStats) {
            updateUserStats();
          }

          getUserStatus && getUserStatus(true);
          removePuByUserId(userId);
          suggestFollow && suggestFollow();
        }
      });
    } catch (e) {
      console.error(e);
    }

    e.stopPropagation();
  }; // followUser

  const unfollowUser = async (e, callback) => {
    if (loading) return;
    callback();

    changeFollowingStatus({
      userId,
      status: false,
    });

    try {
      api.userUnfollows(userId, null, (err) => {
        if (err) {
          changeFollowingStatus({
            userId,
            status: true,
          });
          if (err && err.data?.emsg?.includes("status code 429")) {
            toast(
              <NotifMessage message={t("getter_fe.common.errorTips.err429")} />,
              {
                position: toast.POSITION.TOP_CENTER,
                type: AppConsts.NOTIF_MESSAGE_ERROR,
              },
            );
          }
        } else {
          xUserStats?.setFollowsCount(xUserStats?.getFollowsCount() - 1);
          if (xUserStats && updateUserStats) {
            updateUserStats();
          }

          getUserStatus && getUserStatus(false);

          changeFollowingStatus({
            userId,
            status: false,
          });
        }
      });
    } catch (e) {
      console.error(e);
    }

    e.stopPropagation();
  }; // unfollowUser

  const unfollowConfirm = async (e) => {
    if (lockFollowing || loading) return;

    if (isPopup) {
      unfollowUser(e, () => {});
    } else {
      GConfirmAlert({
        title: t("getter_fe.profile.common.unfollowUsername", {
          username,
        }),
        text: t("getter_fe.post.tips.unfollow_tips", {
          username,
        }),
        close: {
          text: t("getter_fe.post.button.cancel"),
          type: "default",
        },
        confirm: {
          text: t("getter_fe.post.button.unfollow"),
          type: "danger",
          callback: (close) => {
            unfollowUser(e, close);
          },
        },
      });
    }
  }; // unfollowConfirm

  const handleMouseOver = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
    setLockFollowing(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!loggedInUserId) {
      authRedirect();
      return;
    }

    if (userId && loggedInUserId) {
      if (status === STATUS_FOLLOWING) {
        unfollowConfirm(e);
      } else if (status === STATUS_NOT_FOLLOWING || status === STATUS_UNKNOWN) {
        followUser(e);
      }
    } else {
      GConfirmAlert({
        confirmType: "LOGIN",
        title: t("getter_fe.auth.common.getter"),
        uppercase: true,
        text: t("getter_fe.auth.notification.phrase1"),
        text1: t("getter_fe.auth.notification.phrase2"),
        primary: {
          text: t("getter_fe.auth.common.login"),
          type: "primary",
          callback: (close) => {
            close();
            authRedirect();
          },
        },
        secondary: {
          text: t("getter_fe.auth.common.createAccount"),
          type: "secondary",
          callback: (close) => {
            close();
            authRedirect(AppConsts.URL_SIGNUP);
          },
        },
        showCloseIcon: true,
      });
    }
  };

  if (!loading && hidden) {
    return null;
  }

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%", // handle if the screen height is small
  };

  if (!loggedInUserId) {
    return (
      <GButton
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        variant={"outlined"}
        className={`${classes.btn} ${clsButton ? clsButton : ""}`}
      >
        {t("getter_fe.common.user.follow")}
      </GButton>
    );
  } else {
    return (
      <GButton
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        variant={
          loading || status !== STATUS_FOLLOWING ? "outlined" : "contained"
        }
        className={`${
          hover && status !== "n" && !lockFollowing
            ? classes.unfollowBtn
            : classes.btn
        }${status === "n" ? " follow-button" : ""} ${
          !lockFollowing && "unlock-following"
        } ${clsButton ? clsButton : ""}`}
      >
        {loading ? (
          <GLoader wrapperStyle={wrapperStyle} type="small" isButton />
        ) : (
          statusLabel
        )}
      </GButton>
    );
  }
}
