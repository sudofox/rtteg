import {connect} from "react-redux";
import {
  makeStyles,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  ClickAwayListener,
} from "@material-ui/core";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {AvatarLink} from "src/app/components/AvatarLink";
import {GBackTitle} from "src/styles/components/GBackTitle";

import {PostFeed} from "src/app/pages/profile/PostFeed";
import {ClaimMessage} from "src/app/pages/profile/ClaimMessage";

import {userConstants} from "src/app/components/auth/_constants";
import {handleMediaUrl} from "src/util/imageUtils";
import {useEffect, useRef, useState} from "react";
import {shortNum} from "src/util/NumberUtil";
import {getLang, t} from "../../../../i18n/utils";

import classnames from "classnames";
import {Link, useHistory} from "react-router-dom";
import {TimeUtil} from "src/core/Util";
import {ReportUserDialog} from "src/app/components/ReportUserDialog";
import {FollowUserButton} from "src/app/components/FollowUserButton";
import EditProfileDialog from "./EditProfileDialog";
import AppConsts from "src/app/AppConsts";
import XUserInfo from "src/core/model/user/XUserInfo";

import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";

import {ReactComponent as VerificationIcon} from "../../../../assets/icons/feature/verification.svg";
import {ReactComponent as DateIcon} from "src/assets/icons/feature/date.svg";
import {ReactComponent as ProfileOptionsIcon} from "src/assets/icons/basic/filled_more_outline.svg";
import {ReactComponent as LinkIcon} from "src/assets/icons/feature/link.svg";
import {ReactComponent as LocationIcon} from "src/assets/icons/feature/location.svg";

import {GMobileDrawer} from "src/styles/components/GMobileDrawer";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {toast} from "react-toastify";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {DropdownMenuItems} from "./DropdownMenuItems";
import Global from "src/system/Global";
import {GLoader} from "src/styles/components/GLoader";
import {TabPanel} from "src/app/components/TabPanel";
import UIUtil from "src/util/UIUtil";
import parse from "html-react-parser";
import {renderToString} from "react-dom/server";
import GAxios from "src/util/GAxios";
import {loginRefresh} from "src/app/components/auth/store";
import {scrollHelper} from "src/util/scrollUtils";
import {GHemlmet} from "src/styles/components/GHelmet";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) => ({
  userProfileDetails: {
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 0px 7px 6px rgba(0, 0, 0, 0.02)",
    borderRadius: "10px",
    overflow: "hidden",
    background: theme.palette.background.default,
  },
  columnHeader: {
    position: "sticky",
    display: "flex",
    alignItems: "center",
    top: "0",
    zIndex: 100,
    backgroundColor: "white",
    height: "56px",
    flexShrink: 0,
    fontSize: "19px",
    borderBottom: "1px solid var(--border-color)",
    padding: "0px 15px",
    fontWeight: "bold",
  },
  primaryColumn: {
    maxWidth: "600px",
    width: "100%",
    minHeight: "calc(var(--vh, 1vh) * 100 - 60px)",
    height: "100%",
    "& .backTitle": {
      paddingBottom: 15,
    },
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(2),
  },
  headerIcon: {
    cursor: "pointer",
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.palette.background.gray,
  },
  userBannerImage: {
    height: 199,
    backgroundColor: "#DEDEDE",
    "& img": {
      objectFit: "cover",
    },
  },
  userProfileContent: {
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(1.625),
  },
  userProfile__top: {
    display: "flex",
    position: "relative",
    justifyContent: "flex-end",
    height: 75,
  },
  userProfileAvatar: {
    cursor: "pointer",
    position: "absolute",
    left: 0,
    top: -62,
  },
  avatar: {
    height: 134,
    width: 134,
    boxShadow: "0 0 0 4px #fff",
    borderRadius: "50%",
  },

  userProfileOptions: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1.625),
    height: "fit-content",
  },
  profileOptionsIcon: {
    marginRight: theme.spacing(2),
    cursor: "pointer",
    "& .dropdown": {
      display: "flex",
      alignItems: "center",
    },
  },
  userProfileNickname: {
    fontSize: 20,
    paddingTop: 2,
    fontWeight: 800,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "& svg": {
      marginTop: 1,
      verticalAlign: "top",
    },
  },
  userProfileUsername: {
    marginTop: theme.spacing(0.5),
    lineHeight: "130%",
    fontSize: 15,
    color: theme.palette.text.user,
  },
  userProfileStats: {
    marginTop: theme.spacing(1.625),
    wordBreak: "break-word",
  },
  description: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: "20px",
    color: theme.palette.text.main,
  },
  userSubtext: {
    color: theme.palette.text.gray,
  },
  userStatsContainer: {
    display: "flex",
    marginTop: 16,
    marginBottom: 20,
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
    },
    " & a:first-child": {
      marginRight: theme.spacing(3),
    },
    "& a span:hover": {
      // textDecoration: "underline",
    },
  },
  userStatsCount: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: theme.palette.text.main,
    lineHeight: "19px",
    cursor: "pointer",
  },
  link: {
    position: "relative",
    "&::after": {
      content: "' '",
      position: "absolute",
      width: "100%",
      height: 1,
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.text.gray,
      opacity: 0,
    },

    "&:hover::after": {
      opacity: 1,
    },
  },
  userStatsText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: "130%",
    cursor: "pointer",
    color: theme.palette.text.gray,
  },
  userProfileSubtitle: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: 15,
    color: theme.palette.text.gray,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    "& .subItem": {
      position: "relative",
      maxWidth: "100%",
      marginRight: 20,
      display: "flex",
      alignItems: "center",
      fontWeight: 400,
      lineHeight: "130%",
      whiteSpace: "nowrap",
      marginBottom: "5px",
      [theme.breakpoints.down("xs")]: {
        marginBottom: "9px",
      },
      "& span": {
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      "& svg": {
        marginLeft: 3,
        marginRight: 7,
        flexShrink: 0,
      },
      "& a": {
        color: theme.palette.text.link,
        fontWeight: 400,
        "&:hover": {
          textDecoration: "underline",
        },
      },
      "&:last-child": {
        marginRight: 0,
      },
      "&-with-link": {
        position: "relative",
        paddingLeft: "22px",
        "& svg": {
          position: "absolute",
          left: -3,
          "& path": {
            fill: theme.palette.text.secondary,
          },
        },
        "& a": {
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          "-webkit-line-clamp": "1",
          "-webkit-box-orient": "vertical",
          wordBreak: "break-all",
        },
      },
    },
  },
  locationIcon: {
    "& path": {
      fill: theme.palette.text.secondary,
    },
  },
  dropdownContent: {
    width: theme.mixins.dropdownMenu.width,
    position: "absolute",
    right: 10,
    top: -5,
    borderRadius: 6,

    "& .menu-item": {
      padding: theme.spacing(1),
      borderRadius: 0,

      "& .wrapper": {
        display: "flex",
      },

      "& .icon": {
        marginRight: theme.spacing(1),
      },

      "& .menu-item-name": {
        lineHeight: "31px",
        whiteSpace: "nowrap",
      },
    },
  },
  ExploreSideBar: {
    maxWidth: "425px",
    [theme.breakpoints.up("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
  icon: {
    width: theme.spacing(2),
    margin: theme.spacing(0, 0, 0, 0.5),
  },
  dateIcon: {
    height: 20,
    width: 20,
    "& path": {
      fill: theme.palette.text.secondary,
    },
    marginLeft: "2px !important",
  },
  joinDate: {
    marginLeft: theme.spacing(0.5),
  },
  noDataWrapper: {
    textAlign: "center",
    paddingTop: "32px",
    marginTop: "32px",
    borderTop: `1px solid ${theme.palette.grey.A200}`,
  },
  noDataTips: {
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000",
  },
  noDataSubTips: {
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000",
    marginTop: "10px",
  },
  tabsContainer: {
    minHeight: 1000,
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 52,
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: 640,
    },
  },
  tabs: {
    marginTop: 12,
    marginBottom: 15,
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#CC0000",
      borderRadius: 10,
      height: 4,
    },
  },
  tab: {
    color: "#505050",
    textTransform: "capitalize",
    fontSize: 18,
    lineHeight: "21px",
    letterSpacing: "-0.02em",
    opacity: 1,
    fontWeight: "bold",
    minWidth: "auto",
    marginBottom: 8,
    "&.Mui-selected": {
      color: "#CC0000",
    },
    "& .MuiTab-wrapper": {
      opacity: 0.5,
      color: theme.palette.text.gray,
    },
    "&.Mui-selected .MuiTab-wrapper": {
      opacity: 1,
      color: "#CC0000",
    },
  },
  nicknameWrapper: {
    display: "flex",
    alignItems: "center",
    width: "97%",
    "&.spacing": {
      marginLeft: 19,
      display: "flex",
    },
  },
}));

const GETTERS_ROUTE = "getters";
const COMMENT_ROUTE = "comments";
const MEDIAS_ROUTE = "medias";
const LIKES_ROUTE = "likes";

const views = [GETTERS_ROUTE, COMMENT_ROUTE, MEDIAS_ROUTE, LIKES_ROUTE];

const renderHtml = (html) => {
  let content = parse(html, {
    replace: (domNode) => {
      if (domNode.name === "emoji") {
        return <GTwemoji text={domNode.attribs.value} />;
      } else if (domNode.type === "tag") {
        return <></>;
      }
    },
  });
  return renderToString(content);
};

const connector = connect(
  (state) => {
    return {
      userObj: state.auth?.session?.userinfo,
      loggedInUserId: state.auth?.session?.userinfo?._id,
      authenticated: state.auth?.session?.authenticated,
    };
  },
  {loginRefresh},
);

export const NewPublicUserView = connector(_NewPublicUserView);

function _NewPublicUserView({
  userId,
  view,
  userObj,
  profileUsername,
  loggedInUserId,
  authenticated,
  loginRefresh,
  setLayoutUserInfo = null,
}) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));
  const [userInfo, setUserInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [canShowMuted, setCanShowMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [canShowBlocked, setCanShowBlocked] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [statFollowers, setStatFollowers] = useState(0);
  const [statFollows, setStatFollows] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReloading, setIsReloading] = useState(true);

  const authRedirect = useAuthRedirect();

  const dropdownRef = useRef(null);

  const username = userId;
  const api = Global.GetPortal().getAppService();
  const userHasModeratorRole = Global.GetPortal().userHasModeratorRole();

  const viewIndex = views.indexOf(view);
  const tabValue = viewIndex > -1 ? viewIndex : 0;
  const isMyProfile = userId === loggedInUserId;
  const isClaimed =
    window.sessionStorage.getItem("ClaimUsername") === loggedInUserId;

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  };

  const checkProfileChanged = (object1, object2) => {
    if (!object1 || !object2) {
      return false;
    }

    const profileChanged =
      object1.bgimg !== object2.bgimg ||
      object1.ico !== object2.ico ||
      object1.nickname !== object2.nickname ||
      object1.dsc !== object2.dsc ||
      object1.location !== object2.location ||
      object1.website !== object2.website ||
      object1.birthdate !== object2.birthdate ||
      object1.pinpsts !== object2.pinpsts;

    return profileChanged;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setUserInfo(null); //set to null for profile feed
      try {
        const res = await api.fetchUserInfo(userId);

        // refresh loggedin user info
        if (
          authenticated &&
          username === loggedInUserId &&
          userObj &&
          res?.data
        ) {
          const profileChanged = checkProfileChanged(userObj, res.data);

          if (profileChanged) {
            let LSUserInfo = JSON.parse(
              localStorage.getItem(userConstants.LS_SESSION_INFO),
            );

            if (LSUserInfo?.userinfo) {
              LSUserInfo.userinfo = res?.data;
              LSUserInfo.userinfo.token = userObj.token;
              localStorage.setItem(
                userConstants.LS_SESSION_INFO,
                JSON.stringify(LSUserInfo),
              );
              loginRefresh(LSUserInfo);
            }
          }
        }

        setUserInfo(res);
        setLayoutUserInfo && setLayoutUserInfo(res);

        let flg = res?.data?.flg ? res?.data?.flg : 0;
        let twitter = res?.data?.twt_flg ? res?.data?.twt_flg : 0;
        setStatFollowers(flg * 1 + twitter * 1);
        setStatFollows(res.getFollowsCount(0));

        if (res?.data?.status === "s") {
          setIsSuspended(true);
        } else {
          setIsSuspended(false);
        }

        return true;
      } catch (err) {
        console.log(err);
        if (err?.data?.code !== "E_NOT_ALLOWED") {
          if (
            [
              "TypeError: Network request failed",
              "Error: Network Error",
            ].includes(err?.data?.emsg)
          ) {
            history.replace(`/network-request-failed`);
          } else {
            history.replace(`/account-doesnt-exist/${userId}`);
          }
        } else {
          setUserInfo("blocked");
        }
      }
    };

    const checkIfMuted = async () => {
      if (!loggedInUserId) return;
      const res = await api.getMutedUsers();

      setCanShowMuted(true);
      const mutedUserList = res?.data?.list;
      if (Array.isArray(mutedUserList)) {
        setIsMuted(mutedUserList.indexOf(username) >= 0);
      }
    };

    const checkIfBlocked = async () => {
      const loggedInUserId = api.getUserId();
      if (!loggedInUserId) return;

      setCanShowBlocked(true);
      const res = await api.getBlockedUsers(loggedInUserId);
      const blockedUserList = res?.data?.list;
      if (Array.isArray(blockedUserList)) {
        setIsBlocked(blockedUserList.indexOf(username) >= 0);
      }
    };

    (async () => {
      const userExists = await fetchUserInfo();
      if (userExists) {
        checkIfMuted();
        checkIfBlocked();
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (userId == loggedInUserId) {
      const user = XUserInfo.Wrap(userObj);
      setUserInfo(user);
      setLayoutUserInfo && setLayoutUserInfo(user);
      setIsReloading(true);
    }
  }, [userObj]);

  useEffect(() => {
    setIsReloading(false);
  }, [isReloading]);

  const handleScroll = () => {
    scrollHelper.lock();

    setTimeout(() => {
      scrollHelper.unlock();
    }, 100);
  };

  const toggleDrawer = () => {
    if (drawerOpen) {
      setDrawerOpen(false);
      dropdownRef.current?.hide();
    } else {
      setDrawerOpen(true);
      dropdownRef.current?.show();
    }
  };

  const handleReport = () => {
    if (!authenticated) {
      authRedirect();
    } else {
      setDialogOpen(true);
      setDrawerOpen(false);
    }
  };

  const handleClaim = async () => {
    if (userId) {
      setIsClaiming(true);
      const config = {
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/s/openauth/request/${userId}`,
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
          setIsClaiming(false);
          history.push("/claim-failed");
        },
      );
    }
  };

  const handleMute = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    toggleDrawer();
    let title;
    if (isMuted) {
      title = t("getter_fe.profile.common.unmuteUsername", {
        username: profileUsername,
      });
    } else {
      title = t("getter_fe.profile.common.muteUsername", {
        username: profileUsername,
      });
    }
    if (!isMuted) {
      GConfirmAlert({
        title,
        text: isMuted
          ? " "
          : t("getter_fe.post.tips.mute_getter_tips", {
              username: profileUsername,
            }),
        close: {
          text: t("getter_fe.post.button.cancel"),
          type: "default",
        },
        confirm: {
          text: isMuted
            ? t("getter_fe.profile.common.unmute")
            : t("getter_fe.profile.common.mute"),
          type: "danger",
          callback: (callback) => {
            handleToggleMute(callback);
          },
        },
      });
    } else {
      handleToggleMute();
    }
  };

  const handleToggleMute = (callback) => {
    if (isMuted) {
      api.unmuteUser(username, () => {
        setIsMuted(false);
        callback && callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.unmute_success", {
              username: profileUsername,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    } else {
      api.muteUser(username, () => {
        setIsMuted(true);
        callback && callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.mute_success", {
              username: profileUsername,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    }
  };

  const handleBlock = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    toggleDrawer();
    let title;
    if (isBlocked) {
      title = t("getter_fe.profile.common.unblockUsername", {
        username: profileUsername,
      });
    } else {
      title = t("getter_fe.profile.common.blockUsername", {
        username: profileUsername,
      });
    }
    if (!isBlocked) {
      GConfirmAlert({
        title,
        text: isBlocked
          ? " "
          : t("getter_fe.post.tips.block_getter_tips", {
              username: profileUsername,
            }),
        close: {
          text: t("getter_fe.post.button.cancel"),
          type: "default",
        },
        confirm: {
          text: isBlocked
            ? t("getter_fe.profile.common.unblock")
            : t("getter_fe.profile.common.block"),
          type: "danger",
          callback: (callback) => {
            handleToggleBlock(callback);
          },
        },
      });
    } else {
      handleToggleBlock();
    }
  };

  const handleToggleBlock = (callback) => {
    if (isBlocked) {
      api.unblockUser(username, () => {
        setIsBlocked(false);
        callback && callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.unblock_success", {
              username: profileUsername,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    } else {
      api.blockUser(username, () => {
        setIsBlocked(true);
        callback && callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.block_success", {
              username: profileUsername,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    }
  };

  const handleSuspend = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    if (!userHasModeratorRole) return;
    toggleDrawer();
    let title;
    if (isSuspended) {
      title = t("getter_fe.profile.common.unsuspendUser", {
        username: profileUsername,
      });
    } else {
      title = t("getter_fe.profile.common.suspendUser", {
        username: profileUsername,
      });
    }
    GConfirmAlert({
      title,
      text: isSuspended
        ? " "
        : t("getter_fe.post.tips.suspend_getter_tips", {
            username: profileUsername,
          }),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: isSuspended
          ? t("getter_fe.profile.common.unSuspend")
          : t("getter_fe.profile.common.suspend"),
        type: "danger",
        callback: (callback) => {
          if (isSuspended) {
            api.unSuspendUser(username, (err, result) => {
              if (err) {
                console.log(err);
                toast.info(
                  <NotifMessage message={"Error Code: " + err.data?.code} />,
                  {
                    type: toast.TYPE.ERROR,
                  },
                );
                callback();
                return;
              }
              setIsSuspended(false);
              callback();
              toast.info(
                <NotifMessage
                  message={t("getter_fe.post.tips.unsuspend_success", {
                    username: profileUsername,
                  })}
                />,
                {
                  type: toast.TYPE.SUCCESS,
                },
              );
            });
          } else {
            api.suspendUser(username, (err, result) => {
              if (err) {
                console.log(err);
                toast.info(
                  <NotifMessage message={"Error Code: " + err.data?.code} />,
                  {
                    type: toast.TYPE.ERROR,
                  },
                );
                callback();
                return;
              }
              setIsSuspended(true);
              callback();
              toast.info(
                <NotifMessage
                  message={t("getter_fe.post.tips.suspend_success", {
                    username: profileUsername,
                  })}
                />,
                {
                  type: toast.TYPE.SUCCESS,
                },
              );
            });
          }
        },
      },
    });
  };

  let bodyComp = <GLoader />;
  if (userInfo === "blocked") {
    bodyComp = (
      <>
        <div className={classes.userProfileDetails}>
          <div className={classes.userBannerImage}></div>
          <div className={classes.userProfileContent}>
            <div className={classes.userProfile__top}>
              <div className={classes.userProfileAvatar}>
                <AvatarLink
                  styleClasses={classes.avatar}
                  userNotExist
                  noRedirect
                />
              </div>
              <div className={classes.userProfileOptions}></div>
            </div>
            <p className={classes.userProfileNickname}>
              <GTwemoji text={userId} />
            </p>
            <p className={classes.userProfileUsername}></p>
          </div>
        </div>
        <div className={classes.tabsContainer}>
          <div className={classes.noDataWrapper}>
            <h5 className={classes.noDataTips}>
              {t("getter_fe.profile.common.accountBlocked")}
            </h5>
            <div className={classes.noDataSubTips}>
              {t("getter_fe.profile.common.accountBlockedDesc", {
                username: userId,
              })}
            </div>
          </div>
        </div>
      </>
    );
  } else if (userInfo) {
    const profileUsername = userInfo.getOriginalUsername();
    const profileName = userInfo.getNickname(false, profileUsername);
    const profileUserId = userInfo.getUserId();

    const profileBgimg = userInfo.data.bgimg;
    const avatarUrl = userInfo.getIconUrl();

    const profileDescription =
      userInfo.data.dsc === "null" ? null : userInfo.data.dsc;
    const profileDescriptionHtml = profileDescription
      ? renderHtml(UIUtil.WrapEmojiToText(profileDescription))
      : null;
    const profileLocation =
      userInfo.data.location === "null" ? null : userInfo.data.location;
    const profileWebsite =
      userInfo.data.website === "null" ? null : userInfo.data.website;
    const profileBirthDate = userInfo.data.birthdate;
    const _profileWebsite = /(^https?:\/\/)|(^no$)/.test(profileWebsite)
      ? profileWebsite
      : `https://${profileWebsite}`;

    const lang = getLang();
    const jointTS = userInfo.getCreatedTS(-1);
    const jointMMYYYY =
      jointTS > 0 ? TimeUtil.Ts2MMYYYYV2(parseInt(jointTS), lang) : null;

    const isInfluencer = userInfo.isInfluencer();
    let rightOptions;
    if (!isMyProfile) {
      rightOptions = (
        <>
          {/* dropdown */}
          {mobileMatches ? (
            <>
              <ProfileOptionsIcon
                className={classes.profileOptionsIcon}
                onClick={() => setDrawerOpen(true)}
              />
              {/* the crazy arrow is necessary because of the way GMobile drawer calls toggle drawer */}
              <GMobileDrawer
                open={drawerOpen}
                toggleDrawer={(open) => () => setDrawerOpen(open)}
              >
                <DropdownMenuItems
                  username={profileUsername}
                  setDrawerOpen={setDrawerOpen}
                  isMuted={isMuted}
                  isBlocked={isBlocked}
                  isSuspended={isSuspended}
                  handleMute={handleMute}
                  handleBlock={handleBlock}
                  handleSuspend={handleSuspend}
                  handleReport={handleReport}
                  handleClaim={handleClaim}
                  canShowMuted={canShowMuted && !isBlocked}
                  canShowBlocked={canShowBlocked}
                />
              </GMobileDrawer>
            </>
          ) : (
            <ClickAwayListener
              onClickAway={(e) => {
                e.stopPropagation();
                dropdownRef.current?.hide();
                setDrawerOpen(false);
              }}
            >
              <Dropdown removeElement={true} ref={dropdownRef}>
                <DropdownTrigger>
                  <ProfileOptionsIcon
                    className={classes.profileOptionsIcon}
                    onClick={() => setDrawerOpen(true)}
                  />
                </DropdownTrigger>
                <DropdownContent className={classes.dropdownContent}>
                  <DropdownMenuItems
                    username={profileUsername}
                    setDrawerOpen={toggleDrawer}
                    isMuted={isMuted}
                    isBlocked={isBlocked}
                    isSuspended={isSuspended}
                    handleMute={handleMute}
                    handleBlock={handleBlock}
                    handleSuspend={handleSuspend}
                    handleReport={handleReport}
                    handleClaim={handleClaim}
                    canShowMuted={canShowMuted && !isBlocked}
                    canShowBlocked={canShowBlocked}
                  />
                </DropdownContent>
              </Dropdown>
            </ClickAwayListener>
          )}

          {/* endDropdown */}
          <ReportUserDialog
            username={profileUsername}
            isOpen={dialogOpen}
            handleClose={() => setDialogOpen(false)}
            handleSubmit={(reasonId) => {
              api.reportUser(profileUserId, reasonId, (result) => {
                toast.info(
                  <NotifMessage
                    message={t(
                      "getter_fe.common.reportUser.reportSuccessMessage",
                    )}
                  />,
                  {
                    type: toast.TYPE.SUCCESS,
                  },
                );
              });
            }}
          />
          <FollowUserButton
            userId={userId}
            username={profileUsername}
            scene="public-user-view"
          />
        </>
      );
    } else {
      rightOptions = (
        <EditProfileDialog
          objId={userId}
          avatarUrl={avatarUrl}
          userId={profileUserId}
          nickname={profileName}
          location={profileLocation}
          website={profileWebsite}
          birthdate={profileBirthDate}
          dsc={profileDescription}
          bgimg={profileBgimg}
          refreshView={() => window.location.reload()}
        />
      );
    }

    let feed;
    if (isSuspended) {
      feed = (
        <div className={classes.noDataWrapper}>
          <h5 className={classes.noDataTips}>
            {t("getter_fe.profile.common.accountSuspended", {
              profileUsername,
            })}
          </h5>
        </div>
      );
    } else {
      feed = (
        <>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              e.preventDefault();
              const newRoute =
                views[newValue] && views[newValue] !== "getters"
                  ? `/${views[newValue]}`
                  : "";
              history.replace(`/user/${userId}${newRoute}`);
              handleScroll();
            }}
            className={classes.tabs}
          >
            <Tab
              label={t("getter_fe.profile.common.getters")}
              className={classes.tab}
              disableRipple={true}
            />
            <Tab
              label={t("getter_fe.profile.common.comments")}
              className={classes.tab}
              disableRipple={true}
            />
            <Tab
              label={t("getter_fe.profile.common.medias")}
              className={classes.tab}
              disableRipple={true}
            />
            <Tab
              label={t("getter_fe.profile.common.likes")}
              className={classes.tab}
              disableRipple={true}
            />
          </Tabs>
          {[0, 1, 2, 3].map((idx) => (
            <TabPanel value={tabValue} index={idx} key={idx}>
              {idx === 0 ? (
                <ClaimMessage tabValue={tabValue} userId={userId} />
              ) : null}
              <PostFeed
                index={idx}
                isMyProfile={isMyProfile}
                isClaimed={isClaimed}
                userId={userId}
                userInfo={userInfo}
                wrapperStyle={wrapperStyle}
              />
            </TabPanel>
          ))}
        </>
      );
    }

    bodyComp = (
      <>
        <GHemlmet
          description={userInfo.data?.dsc}
          imageURL={userInfo.data?.ico}
          originalUsername={userInfo.data?.ousername}
          type="profile"
        />
        {isClaiming && (
          <GLoader
            isPopup={true}
            notCloseOnDocumentClick={true}
            tips={t("getter_fe.post.tips.popup_generic_loader_tips")}
          />
        )}
        <GBackTitle title={profileName} showVIcon={isInfluencer > 0} />
        <div className={classes.userProfileDetails}>
          <div className={classes.userBannerImage}>
            {profileBgimg && profileBgimg !== "Error: Network Error" ? (
              <img
                src={handleMediaUrl(
                  process.env.REACT_APP_MEDIA_BASE,
                  profileBgimg,
                )}
                alt=""
                width="100%"
                height="100%"
                onError={(event) => event.target.classList.add("error")}
              />
            ) : null}
          </div>
          <div className={classes.userProfileContent}>
            <div className={classes.userProfile__top}>
              <div className={classes.userProfileAvatar}>
                <AvatarLink
                  avatarUrl={avatarUrl}
                  styleClasses={classes.avatar}
                  userId={profileUserId}
                  username={profileName}
                  bigAvatar={true}
                  noRedirect
                />
              </div>
              <div className={classes.userProfileOptions}>
                {!isSuspended && rightOptions}
              </div>
            </div>
            <div className={classes.nicknameWrapper}>
              <p className={classes.userProfileNickname}>
                <GTwemoji text={profileName} />
              </p>
              {isInfluencer > 0 && (
                <VerificationIcon className={classes.icon} />
              )}
            </div>
            <p
              className={classes.userProfileUsername}
            >{`@${profileUsername}`}</p>
            {!isSuspended && (
              <div className={classes.userProfileStats}>
                <div
                  className={classes.description}
                  dangerouslySetInnerHTML={{__html: profileDescriptionHtml}}
                />
                <div>
                  {/* subtitleComp */}
                  <div className={classes.userProfileSubtitle}>
                    {profileLocation && (
                      <div className="subItem">
                        <LocationIcon className={classes.locationIcon} />
                        <span>{profileLocation}</span>
                      </div>
                    )}
                    {profileWebsite && (
                      <div className="subItem subItem-with-link">
                        <LinkIcon className={classes.linkIcon} />
                        <a
                          href={_profileWebsite}
                          target="_blank"
                          className={classes.url}
                          dangerouslySetInnerHTML={{
                            __html: profileWebsite
                              .replace(/(^\w+:|^)\/\//, "")
                              .replace(/(^[^\/]+\/.{14})(.+)/, "$1<br>$2"),
                          }}
                        />
                      </div>
                    )}
                    {jointTS > 0 && (
                      <div className="subItem">
                        <DateIcon className={classes.dateIcon} />
                        {t("getter_fe.profile.common.joinedSince")}
                        <span className={classes.joinDate}>{jointMMYYYY}</span>
                      </div>
                    )}
                  </div>
                  {/* endsubtitlecomp */}
                </div>
                {/* statscomp */}
                <div className={classes.userStatsContainer}>
                  <Link
                    to={`/user/${userId}/following`}
                    className={classes.link}
                  >
                    <span className={classes.userStatsCount}>
                      {shortNum(statFollows)}
                    </span>
                    <span
                      className={classnames(
                        classes.userStatsText,
                        classes.userSubtext,
                      )}
                    >
                      {t("getter_fe.profile.common.following")}
                    </span>
                  </Link>
                  <Link
                    to={`/user/${userId}/followers`}
                    className={classes.link}
                  >
                    <span className={classes.userStatsCount}>
                      {shortNum(statFollowers)}
                    </span>
                    <span
                      className={classnames(
                        classes.userStatsText,
                        classes.userSubtext,
                      )}
                    >
                      {t("getter_fe.profile.common.followers")}
                    </span>
                  </Link>
                </div>
                {/* endstatscomp */}
              </div>
            )}
          </div>
        </div>
        {/* endUserProfileDetails */}
        <div className={classes.tabsContainer}>{feed}</div>
      </>
    );
  }

  if (isMyProfile && isSuspended) {
    window.location.replace(AppConsts.URL_LOGOUT);
  }

  return (
    <div className={classes.primaryColumn}>
      {isReloading ? <GLoader /> : bodyComp}
    </div>
  );
}
