import React, {useState, Fragment, memo} from "react";
import {connect} from "react-redux";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@material-ui/core";
import {ReactComponent as MenuDropDownIcon} from "src/assets/icons/basic/more_horizontal.svg";
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";
import {UIStyleConsts} from "src/app/AppConsts";
import classnames from "classnames";
import {getUserName} from "src/util/FeedUtils";

import {ReactComponent as MuteIcon} from "src/assets/icons/feature/mute.svg";
import {ReactComponent as BlockIcon} from "src/assets/icons/feature/block.svg";
import {ReactComponent as ReportIcon} from "src/assets/icons/feature/report.svg";
import {ReactComponent as FollowIcon} from "src/assets/icons/feature/follow.svg";
import {ReactComponent as UnfollowIcon} from "src/assets/icons/feature/unfollow.svg";
import {ReactComponent as PinIcon} from "src/assets/icons/feature/pin.svg";
import {ReactComponent as DeleteIcon} from "src/assets/icons/basic/delete.svg";

import {t} from "src/i18n/utils";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {GMobileDrawer} from "src/styles/components/GMobileDrawer";
import {ReportContentDialog} from "src/app/components/ReportContentDialog";

import {
  toggleMute,
  toggleFollowing,
  toggleBlock,
  currentUserMutesUser,
  currentUserFollowsUser,
  currentUserBlockedUser,
} from "src/store/modules/status";
import {
  removePost,
  removePinnedPost,
  getPinnedPost,
} from "../../timeline/store";
import {addPinPost, deletePinPost} from "../../auth/store";
import Global from "src/system/Global";
import {useAuthRedirect} from "src/util/useAuthRedirect";
import {handleClearSameText} from "src/util/TextUtil";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "&.post-feed-item": {
        display: "flex",
        flexDirection: "column",
        borderBottom: theme.notchedOutline.border,
        "&.comment-detail": {
          border: "none",
        },
        "&.timeline": {
          borderTop: "none",
          backgroundColor: theme.palette.background.default,
          "& > .feed-item-main > .content > .message": {
            wordBreak: "break-word",
            lineHeight: "160%",
            paddingBottom: theme.spacing(8),
            paddingLeft: theme.spacing(12),
            paddingRight: theme.spacing(3.75),
            marginTop: theme.spacing(-6.25),
            minHeight: theme.spacing(3.75),
          },
        },
        "&.post-page-view": {
          "& > .feed-item-main > .content > .description-header": {
            height: theme.spacing(2.5),
            marginLeft: "17px !important",
            "& .posterInfo_name": {
              flexDirection: "column",
              paddingTop: theme.spacing(1.25),
            },
            "& .dropdown": {
              marginTop: "-12px !important",
            },
          },
          "& > .feed-item-main > .content > .message": {
            marginTop: "-6px !important",
            padding: "0 17px !important",
            "& .post-page-view > div": {
              marginBottom: 0,
            },
          },
        },
        "& .feed-item-main": {
          display: "flex",
          flexDirection: "row",
          position: "relative",
          cursor: "pointer",
          margin: "15px 0px 20px",
          transition: "all 100ms ease-in",

          "& > .content": {
            width: "100%",

            "& .description-header": {
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "space-between",
              height: theme.spacing(7),
              margin: theme.spacing(0, 3.75),
              "& .header-msg": {
                display: "flex",
                "& > div": {
                  maxWidth: "100%",
                },
                "& .avatar": {
                  width: theme.spacing(7),
                  height: theme.spacing(7),
                  borderRadius: "50%",
                },
                "& .posterInfo_name": {
                  display: "flex",
                  // flexDirection:"column",
                  marginLeft: theme.spacing(2.5),
                  fontSize: "15px",
                  "& .posterInfo-part1": {
                    display: "flex",
                    fontWeight: 700,
                    lineHeight: "20px",
                    marginRight: theme.spacing(0.875),
                    "& a": {
                      color: theme.palette.text.primary,
                    },
                    "& svg": {
                      marginLeft: theme.spacing(0.625),
                      marginTop: theme.spacing(0.25),
                      verticalAlign: "top",
                    },
                  },
                  "& .posterInfo-part2": {
                    fontWeight: 400,
                    color: theme.palette.secondary.light,
                  },
                },

                "& .time-since": {
                  fontWeight: "lighter",
                  padding: theme.spacing(0, 1.25),
                  fontSize: "13px",
                  color: theme.palette.primary.light,
                  marginLeft: theme.spacing(1.25),
                  borderLeft: `1px solid ${theme.border.lightGray}`,
                },
              },

              "& .dropdown": {
                marginRight: theme.spacing(-2.75),
                marginTop: theme.spacing(-3.75),
                "& svg": {
                  fontSize: "24px",
                },
              },
            },

            "& .message": {
              wordBreak: "break-word",
              lineHeight: "160%",
              paddingBottom: theme.spacing(1),
              marginTop: theme.spacing(-3.75),
              minHeight: theme.spacing(3.75),
            },
          },
        },
        "& .reposted-info": {
          color: theme.palette.text.gray,
          fontSize: "13px",
          lineHeight: "13px",
          paddingLeft: theme.spacing(7.375),
          paddingBottom: theme.spacing(1),
          marginBottom: theme.spacing(-2.5),
          paddingTop: "14px",
          fontWeight: "700",
          "& svg": {
            stroke: theme.svg.color,
            verticalAlign: "top",
          },
          "& a": {
            color: theme.palette.text.gray,
            marginRight: theme.spacing(1.25),
          },
        },
      },
    },
    repostSpacing: {
      marginRight: theme.spacing(1.25),
    },
    feedItemMain: {
      display: "flex",
      flexDirection: "row",
      padding: theme.spacing(1.875, 0, 2.5, 2.25),
      transition: "all 100ms ease-in",
      fontSize: 14,
      "& .content": {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        "& .description-header": {
          height: theme.spacing(2.5),
          display: "flex",
          justifyContent: "space-between",
          paddingRight: theme.spacing(1),
        },
      },
    },
    description: {
      paddingRight: theme.spacing(1.875),
    },
    messageContent: {
      padding: 0,
      paddingRight: theme.spacing(2.125),
    },
    postDetailMessageContent: {
      padding: 0,
    },
    dropdownImageWrapper: {
      display: "flex",
      width: 30,
      height: 30,
      marginTop: -4,
      marginRight: 6,
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      borderRadius: "50%",
      "&:hover": {
        backgroundColor: theme.palette.background.notif,
        cursor: "pointer",

        "& svg": {
          fill: theme.palette.background.hover,
        },
      },
    },
    dropdownImage: {
      // transform: "scale(.85)",
      fill: theme.palette.text.primary,
    },
    dotmr: {
      marginRight: theme.spacing(1.25),
    },

    dropdownContent: {
      width: theme.mixins.dropdownMenu.width,
      position: "absolute",
      right: theme.spacing(1.375),
      top: theme.spacing(-0.625),
      borderRadius: 6,
      overflow: "hidden",

      "& .menu-item": {
        padding: theme.spacing(1),
        borderRadius: 0,
        "& svg": {
          color: theme.palette.text.lightGray,
        },
        "&.danger": {
          // color: theme.palette.error.main,
          transition: "all .15s ease-in-out",
          "&:hover": {
            backgroundColor: theme.palette.background.red,
            color: theme.palette.error.main,
            "& svg": {
              color: theme.palette.error.main,
            },
          },
        },

        "& .wrapper": {
          display: "flex",
          alignItems: "center",
        },

        "& .icon": {
          width: theme.spacing(2.5),
          marginRight: 15,
          marginLeft: 10,
        },
      },
    },
    postedTime: {
      color: theme.palette.text.gray,
      fontSize: "18px",
      padding: theme.spacing(2.5, 0),
      borderBottom: `1px solid ${theme.palette.grey.A800}`,
    },
    avatarContent: {
      marginRight: theme.spacing(1.25),
      "& > div": {
        maxWidth: "100%",
      },
    },
    avatar: {
      width: theme.spacing(6.25),
      height: theme.spacing(6.25),
      borderRadius: "100%",
      cursor: "pointer",
    },
    commentDetailAvatar: {
      position: "relative",
      marginRight: theme.spacing(1.875),

      "&::after": {
        content: "' '",
        position: "absolute",
        top: theme.spacing(10.625),
        left: theme.spacing(2.25),
        bottom: 0,
        width: theme.spacing(0.375),
        backgroundColor: "#d9d9d9",
        borderRadius: "3px",
        transform: "translate(-50%, 0)",
      },
    },
    commentFeedItemMain: {
      display: "flex",
      margin: "16px 30px 0",
      position: "relative",
      cursor: "pointer",
      transition: "all 100ms ease-in",

      "& .content": {
        width: "calc(100% - 67px)",
        marginBottom: "20px",

        "& .description-header": {
          "& .posterInfo_name": {
            display: "flex",
            alignItems: "center",
            fontSize: "15px",
            "& .posterInfo-part1": {
              fontWeight: 700,
              marginRight: "12px",
              display: "flex",
              alignItems: "center",

              "& a": {
                color: theme.palette.text.primary,
                marginRight: theme.spacing(1),
              },
            },
            "& .posterInfo-part2": {
              fontWeight: 400,
              color: theme.palette.secondary.light,
            },
          },
        },
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      authenticated: state.auth?.session?.authenticated,
      loggedinUserId: state.auth.session?.userinfo?._id,
      loggedinUserInfo: state.auth.session?.userinfo,
      userFollowing: state.status.following,
      userMuted: state.status.muted,
      userBlocked: state.status.blocked,
      pinnedPostIds: state.auth.session?.userinfo?.pinpsts,
    };
  },
  {
    currentUserMutesUser,
    currentUserFollowsUser,
    currentUserBlockedUser,
    removePost,
    addPinPost,
    deletePinPost,
    removePinnedPost,
    getPinnedPost,
    toggleMute,
    toggleFollowing,
    toggleBlock,
  },
);

export const MoreDropDown = connector(memo(_MoreDropDown));

function _MoreDropDown(props) {
  const {
    currentUserMutesUser,
    currentUserFollowsUser,
    currentUserBlockedUser,
    item,
    postId,
    loggedinUserId,
    authenticated,
    loggedinUserInfo,
    scene,
    onDelete,
    userMuted,
    userFollowing,
    userBlocked,
    removePost,
    addPinPost,
    deletePinPost,
    pinnedPostIds,
    updatePinnedPostsIds,
    removePinnedPost,
    getPinnedPost,
    userInfoProfile,
    toggleMute,
    toggleFollowing,
    toggleBlock,
    user,
    originalUser,
    isShared,
    embededPost,
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));
  const [dd, setDd] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [canShowMuted, setCanShowMuted] = useState(false);
  const [canShowFollowing, setCanShowFollowing] = useState(false);
  const [canShowBlocked, setCanShowBlocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(-5);
  const authRedirect = useAuthRedirect();
  const api = Global.GetPortal().getAppService();

  let posterId = user?.id;

  const isNoContentRepost = isShared && originalUser;

  const isMyPost = loggedinUserId === (user?.id ?? user?._id);
  const isComment = item.type === "cmt";

  const username = getUserName(user);
  const isAdmin = api.userHasAdminRole();
  const canDelete = isMyPost || api.userHasModeratorRole();
  const deleteMsg = isMyPost
    ? "getter_fe.post.tips.delete_getter_tips"
    : "getter_fe.post.tips.delete_getter_tips_admin";

  let ppIds;
  try {
    ppIds = JSON.parse(pinnedPostIds);
  } catch (error) {
    ppIds = null;
  }
  const isMuted = userMuted[posterId];
  const isFollowing = userFollowing[posterId];
  const isBlocked = userBlocked[posterId];

  const pinnedIds = Array.isArray(ppIds) ? ppIds : null;
  const isPinned = pinnedIds?.includes(postId);

  const hideDropdown = () => {
    if (mobileMatches) {
      setIsDrawerOpen(false);
      return;
    }

    dd?.hide();
  };

  const removePostItemCallback = async (err, result) => {
    if (err) {
      console.log(err);
      // TODO: error notification or something else
      return;
    }
    toast.info(
      <NotifMessage
        message={
          isComment
            ? t("getter_fe.post.tips.deleted_reply_success")
            : t("getter_fe.post.tips.deleted_post_success")
        }
      />,
      {
        type: toast.TYPE.SUCCESS,
      },
    );
    removePost(postId);
    if (
      scene === "timeline" ||
      scene === "profile" ||
      scene === "comment-feed"
    ) {
      if (scene === "profile" || scene === "comment-feed") {
        onDelete();
      }

      try {
        await api.userUnlikesPost(postId, null);
      } catch (err) {
        console.log(err);
      }
    } else {
      window.history.go(-1);
    }
  };

  const onShow = async () => {
    if (
      scene === "post-page-view" ||
      scene === "profile" ||
      scene === "post-detail" ||
      scene === "search" ||
      isNoContentRepost
    ) {
      if (userFollowing[posterId] === undefined) {
        await currentUserFollowsUser({
          userId: loggedinUserId,
          targetId: posterId,
        });
      }
      if (userMuted[posterId] === undefined) {
        await currentUserMutesUser({
          userId: loggedinUserId,
          targetId: posterId,
        });
      }
      if (userBlocked[posterId] === undefined) {
        await currentUserBlockedUser({
          userId: loggedinUserId,
          targetId: posterId,
        });
      }
      setCanShowMuted(true);
      setCanShowFollowing(true);
      setCanShowBlocked(true);
    }

    if (scene === "timeline" && !isNoContentRepost) {
      setCanShowMuted(true);
      setCanShowBlocked(true);
      if (loggedinUserId && userFollowing[posterId] === undefined) {
        await currentUserFollowsUser({
          userId: loggedinUserId,
          targetId: posterId,
        });
      }

      setCanShowFollowing(true);
    }
  };

  const handlePostDelete = () => {
    hideDropdown();
    GConfirmAlert({
      title: isComment
        ? t("getter_fe.post.tips.delete_reply")
        : t("getter_fe.post.tips.delete_getter"),
      text: t(deleteMsg),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.button.delete"),
        type: "danger",
        callback: (close) => {
          if (isShared) {
            api.userUnshares(
              postId,
              item.action === "shares_pst" ? "p" : "c",
              removePostItemCallback,
            );
          } else if (scene === "comment-feed") {
            api.deletePostComment(postId, removePostItemCallback);
          } else {
            api.deletePost(postId, removePostItemCallback);
            if (embededPost) {
              handleClearSameText(
                `prevRepost${
                  (item.embedId && item.embedId)[0] ?? embededPost._id
                }`,
              );
            } else {
              handleClearSameText("prevPost");
            }
          }
          close();
        },
      },
    });
  };

  const handlePinPostStatus = async (status) => {
    Array.isArray(status) &&
      toast.info(
        <NotifMessage
          message={
            isMyPost
              ? t("getter_fe.post.text.pinMyPostSuccess")
              : t("getter_fe.post.text.pinOthersPostSuccess")
          }
        />,
        {
          type: toast.TYPE.SUCCESS,
        },
      );

    Array.isArray(status) &&
      updatePinnedPostsIds &&
      updatePinnedPostsIds(status);

    Array.isArray(status) &&
      userInfoProfile &&
      loggedinUserId === userInfoProfile.data._id &&
      (await getPinnedPost({api, postId}));

    // TODO: addPinnedPost(postId)

    status === null &&
      toast.info(
        <NotifMessage message={t("getter_fe.post.text.pinPostError")} />,
        {
          type: toast.TYPE.ERROR,
        },
      );

    !Array.isArray(status) &&
      status &&
      status.length > 0 &&
      toast.info(<NotifMessage message={status} />, {
        type: toast.TYPE.ERROR,
      });
  };

  const handlePinPost = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }

    hideDropdown();

    GConfirmAlert({
      title: t("getter_fe.post.text.pinThisGetter"),
      text: t("getter_fe.post.text.pinDescrMsg"),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.button.pin"),
        type: "confirm",
        callback: async (close) => {
          close();

          const res = await addPinPost({
            userId: loggedinUserId,
            postId: postId,
          });

          handlePinPostStatus(res?.payload);
        },
      },
    });
  };

  const handleUnpinPostStatus = (status) => {
    Array.isArray(status) &&
      toast.info(
        <NotifMessage
          message={
            isMyPost
              ? t("getter_fe.post.text.unpinMyPostSuccess")
              : t("getter_fe.post.text.unpinOthersPostSuccess")
          }
        />,
        {
          type: toast.TYPE.SUCCESS,
        },
      );

    Array.isArray(status) &&
      updatePinnedPostsIds &&
      updatePinnedPostsIds(status);

    Array.isArray(status) && removePinnedPost(postId);

    status === null &&
      toast.info(
        <NotifMessage message={t("getter_fe.post.text.unpinPostError")} />,
        {
          type: toast.TYPE.ERROR,
        },
      );

    !Array.isArray(status) &&
      status &&
      status.length > 0 &&
      toast.info(<NotifMessage message={status} />, {
        type: toast.TYPE.ERROR,
      });
  };

  const handleUnpinPost = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    hideDropdown();

    GConfirmAlert({
      title: t("getter_fe.post.text.unpinPostFromProfile"),
      text: t("getter_fe.post.text.unpinDescrMsg"),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.button.unpin"),
        type: "danger",
        callback: async (close) => {
          close();

          const res = await deletePinPost({
            userId: loggedinUserId,
            postId: postId,
          });

          handleUnpinPostStatus(res?.payload);
        },
      },
    });
  };

  const handleMute = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    hideDropdown();
    let title;
    if (isMuted) {
      title = t("getter_fe.profile.common.unmuteUsername", {
        username: username || posterId,
      });
    } else {
      title = t("getter_fe.profile.common.muteUsername", {
        username: username || posterId,
      });
    }
    if (!isMuted) {
      GConfirmAlert({
        title,
        text: isMuted
          ? " "
          : t("getter_fe.post.tips.mute_getter_tips", {
              username: username || posterId,
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
          callback: (close) => {
            handleToggleMute(close);
          },
        },
      });
    } else {
      handleToggleMute();
    }
  };

  const handleToggleMute = (callback) => {
    toggleMute({
      api,
      targetId: posterId,
      successCallback: (isMuted) => {
        if (isMuted) {
          toast.info(
            <NotifMessage
              message={t("getter_fe.post.tips.unmute_success", {
                username: username || posterId,
              })}
            />,
            {
              type: toast.TYPE.SUCCESS,
            },
          );
        } else {
          toast.info(
            <NotifMessage
              message={t("getter_fe.post.tips.mute_success", {
                username: username || posterId,
              })}
            />,
            {
              type: toast.TYPE.SUCCESS,
            },
          );
        }
        callback && callback();
        setTimeout(() => {
          toggleDrawer(false);
          setDropdownOpen(false);
        }, 0);
      },
      errorCallback: () => {
        toast(
          <NotifMessage
            message={t("getter_fe.auth.errors.somethingWentWrong")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.WARNING,
          },
        );
        callback && callback();
      },
    });
  };

  const handleFollowing = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    hideDropdown();
    let title;
    if (isFollowing) {
      title = t("getter_fe.profile.common.unfollowUsername", {
        username: username || posterId,
      });
    } else {
      title = t("getter_fe.profile.common.followUsername", {
        username: username || posterId,
      });
    }
    const successCallback = (isFollowing) => {
      if (isFollowing) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.unfollow_success", {
              username: username || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      } else {
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.follow_success", {
              username: username || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      }
    };

    const errorCallback = () =>
      toast(
        <NotifMessage
          message={t("getter_fe.auth.errors.somethingWentWrong")}
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.WARNING,
        },
      );

    if (isFollowing) {
      GConfirmAlert({
        title,
        text: t("getter_fe.post.tips.unfollow_tips", {
          username: username || posterId,
        }),
        close: {
          text: t("getter_fe.post.button.cancel"),
          type: "default",
        },
        confirm: {
          text: t("getter_fe.post.button.confirm"),
          type: "danger",
          callback: (close) => {
            toggleFollowing({
              api,
              targetId: posterId,
              successCallback: (isFollowing) => {
                successCallback(isFollowing);
                close();
              },
              errorCallback: () => {
                errorCallback();
                close();
              },
            });
          },
        },
      });
    } else {
      toggleFollowing({
        api,
        targetId: posterId,
        successCallback,
        errorCallback,
      });
    }
  };

  const handleBlock = () => {
    if (!authenticated) {
      authRedirect();
      return;
    }
    hideDropdown();

    let title;
    if (isBlocked) {
      title = t("getter_fe.profile.common.unblockUsername", {
        username: username || posterId,
      });
    } else {
      title = t("getter_fe.profile.common.blockUsername", {
        username: username || posterId,
      });
    }

    if (!isBlocked) {
      GConfirmAlert({
        title,
        text: isBlocked
          ? " "
          : t("getter_fe.post.tips.block_getter_tips", {
              username: username || posterId,
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
          callback: (close) => {
            handleToggleBlock(close);
          },
        },
      });
    } else {
      handleToggleBlock();
    }
  };

  const handleToggleBlock = (callback) => {
    toggleBlock({
      api,
      targetId: posterId,
      successCallback: (isBlocked) => {
        if (isBlocked) {
          toast.info(
            <NotifMessage
              message={t("getter_fe.post.tips.unblock_success", {
                username: username || posterId,
              })}
            />,
            {
              type: toast.TYPE.SUCCESS,
            },
          );
        } else {
          toast.info(
            <NotifMessage
              message={t("getter_fe.post.tips.block_success", {
                username: username || posterId,
              })}
            />,
            {
              type: toast.TYPE.SUCCESS,
            },
          );
        }
        callback && callback();
        setTimeout(() => {
          toggleDrawer(false);
          setDropdownOpen(false);
        }, 0);
      },
      errorCallback: () => {
        toast(
          <NotifMessage
            message={t("getter_fe.auth.errors.somethingWentWrong")}
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.WARNING,
          },
        );
        callback && callback();
      },
    });
  };

  const toggleDrawer = (open) => async () => {
    setIsDrawerOpen(open);

    if (open) {
      onShow();
    }
  };

  const handleSubmit = (reasonId) => {
    api.reportPost(postId, reasonId, (result) => {
      toast.info(
        <NotifMessage
          message={t("getter_fe.common.reportContent.reportSuccessMessage")}
        />,
        {
          type: toast.TYPE.SUCCESS,
        },
      );
    });
  };

  const canPinPost = () => {
    if (!loggedinUserInfo) return false;

    if (item.originUser && !isComment) {
      return loggedinUserId === item.originUser;
    } else {
      return loggedinUserId === item?.uid;
    }
  };

  const pinMenuItem = (
    <div
      className={UIStyleConsts.DROPDOWN_MENU_ITEM}
      onClick={isPinned ? handleUnpinPost : handlePinPost}
    >
      <div className="wrapper">
        <div className="icon">
          <PinIcon className={classes.pinIcon} />
        </div>
        <div className="menu-item-name">
          {isPinned
            ? t("getter_fe.profile.common.unpinFromProfile")
            : t("getter_fe.profile.common.pinToYourProfile")}
        </div>
      </div>
    </div>
  );

  let menuItems;
  if (isMyPost) {
    menuItems = (
      <Fragment>
        {isComment ? null : pinMenuItem}

        <div
          className={classnames(UIStyleConsts.DROPDOWN_MENU_ITEM, "danger")}
          onClick={handlePostDelete}
        >
          <div className="wrapper">
            <div className="icon">
              <DeleteIcon className={classes.deleteIcon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.delete")}
            </div>
          </div>
        </div>
      </Fragment>
    );
  } else {
    menuItems = (
      <Fragment>
        {canPinPost() ? pinMenuItem : null}

        {loggedinUserInfo &&
          canShowFollowing &&
          (isFollowing ? (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleFollowing}
            >
              <div className="wrapper">
                <div className="icon">
                  <UnfollowIcon className={classes.unfollowIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.unfollowUsername", {
                    username,
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleFollowing}
            >
              <div className="wrapper">
                <div className="icon">
                  <FollowIcon className={classes.followIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.followUsername", {
                    username,
                  })}
                </div>
              </div>
            </div>
          ))}

        {loggedinUserInfo &&
          canShowMuted &&
          (isMuted ? (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleMute}
            >
              <div className="wrapper">
                <div className="icon">
                  <MuteIcon className={classes.muteIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.unmuteUsername", {
                    username,
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleMute}
            >
              <div className="wrapper">
                <div className="icon">
                  <MuteIcon className={classes.muteIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.muteUsername", {
                    username,
                  })}
                </div>
              </div>
            </div>
          ))}
        {loggedinUserInfo &&
          canShowBlocked &&
          (isBlocked ? (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleBlock}
            >
              <div className="wrapper">
                <div className="icon">
                  <BlockIcon className={classes.blockIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.unblockUsername", {
                    username,
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleBlock}
            >
              <div className="wrapper">
                <div className="icon">
                  <BlockIcon className={classes.blockIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.blockUsername", {
                    username,
                  })}
                </div>
              </div>
            </div>
          ))}

        <div
          className={UIStyleConsts.DROPDOWN_MENU_ITEM}
          onClick={() => {
            if (!authenticated) {
              authRedirect();
            } else {
              setIsDialogOpen(true);
              hideDropdown();
            }
          }}
        >
          <div className="wrapper">
            <div className="icon">
              <ReportIcon className={classes.reportIcon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.reportPost")}
            </div>
          </div>
        </div>

        {canDelete || isAdmin ? (
          <div
            className={classnames(UIStyleConsts.DROPDOWN_MENU_ITEM, "danger")}
            onClick={handlePostDelete}
          >
            <div className="wrapper">
              <div className="icon">
                <DeleteIcon className={classes.deleteIcon} />
              </div>
              <div className="menu-item-name">
                {isComment
                  ? t("getter_fe.profile.common.removeComment")
                  : t("getter_fe.profile.common.removePost")}
              </div>
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }

  const menuDropDown = mobileMatches ? (
    <>
      <MenuDropDownIcon
        className={classes.dropdownImage}
        onClick={toggleDrawer(true)}
      />

      <GMobileDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer}>
        {menuItems}
      </GMobileDrawer>
    </>
  ) : (
    <ClickAwayListener
      onClickAway={(e) => {
        e.stopPropagation();
        setDropdownOpen(false);
      }}
    >
      <Dropdown
        active={dropdownOpen}
        removeElement={true}
        ref={(dd) => {
          setDd(dd);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(true);
          document.body.click();
          const DEFAULT_TOP = -5;
          const countedTop =
            window.innerHeight -
            e.target.getBoundingClientRect().y -
            menuItems.props.children.length * 50 -
            10;
          setDropdownTop(Math.min(DEFAULT_TOP, countedTop));
        }}
        onShow={onShow}
      >
        <DropdownTrigger>
          <div
            className={classnames(
              classes.dropdownImageWrapper,
              scene === "post-page-view" ? classes.dotmr : "",
            )}
          >
            <Tooltip
              title={t("getter_fe.post.button.hoverMore")}
              aria-label={t("getter_fe.post.button.hoverMore")}
            >
              <MenuDropDownIcon className={classes.dropdownImage} />
            </Tooltip>
          </div>
        </DropdownTrigger>
        <DropdownContent
          className={classes.dropdownContent}
          style={{top: `${dropdownTop}px`}}
        >
          {menuItems}
        </DropdownContent>
      </Dropdown>
    </ClickAwayListener>
  );
  return (
    <>
      {menuDropDown}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ReportContentDialog
          isOpen={isDialogOpen}
          handleClose={() => setIsDialogOpen(false)}
          handleSubmit={(reasonId) => handleSubmit(reasonId)}
        />
      </div>
    </>
  );
}
