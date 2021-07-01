import React, {useEffect, useState, Fragment, useRef} from "react";
import {connect} from "react-redux";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Link, useHistory} from "react-router-dom";
import {
  Collapse,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@material-ui/core";
import {ReactComponent as RepostIcon} from "src/assets/icons/feature/retweet.svg";
import {ReactComponent as MenuDropDownIcon} from "src/assets/icons/basic/more_horizontal.svg";
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";
import {ModelType, ActivityLogProps} from "src/core/model/ModelConsts";
import {TimeUtil} from "src/core/Util";
import {PostContentView} from "src/app/components/post/comps/PostContentView";
import AppConsts, {UIStyleConsts} from "src/app/AppConsts";
import classnames from "classnames";

import {ReactComponent as MuteIcon} from "src/assets/icons/feature/mute.svg";
import {ReactComponent as BlockIcon} from "src/assets/icons/feature/block.svg";
import {ReactComponent as ReportIcon} from "src/assets/icons/feature/report.svg";
import {ReactComponent as FollowIcon} from "src/assets/icons/feature/follow.svg";
import {ReactComponent as UnfollowIcon} from "src/assets/icons/feature/unfollow.svg";
import {ReactComponent as PinIcon} from "src/assets/icons/feature/pin.svg";
import {ReactComponent as DeleteIcon} from "src/assets/icons/basic/delete.svg";
import {getLang, t} from "src/i18n/utils";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import XUserInfo from "src/core/model/user/XUserInfo";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {GMobileDrawer} from "src/styles/components/GMobileDrawer";
import {PostFeedItemViewForPopup} from "src/app/pages/dashboard/PostFeedItemViewForPopup";
import {PostFeedItemViewForDetail} from "src/app/pages/dashboard/PostFeedItemViewForDetail";
import {PostFeedItemViewForTimeline} from "src/app/pages/dashboard/PostFeedItemViewForTimeline";

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
  addItemHeight,
} from "../../timeline/store";
import {addPinPost, deletePinPost} from "../../auth/store";
import Global from "src/system/Global";
import {NewCommentContentView} from "src/app/pages/post/NewCommentContentView";
import {handleClearSameText} from "src/util/TextUtil";
import {useAuthRedirect} from "src/util/useAuthRedirect";

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
            verticalAlign: "top",
          },
          "& a": {
            color: theme.palette.text.gray,
            marginRight: theme.spacing(1.25),
          },
        },
      },
    },
    icon: {
      "& path": {
        fill: theme.palette.text.lightGray,
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
    repostIcon: {
      "& path": {
        fill: theme.palette.text.light,
      },
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
      color: theme.palette.text.gray,
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
              "& path:first-of-type": {
                fill: theme.palette.error.main,
              },
            },
          },
        },

        "& .wrapper": {
          display: "flex",
          alignItems: "center",
        },

        "& .icon": {
          width: theme.spacing(2.5),
          "& svg": {
            width: theme.spacing(2.5),
          },
          margin: theme.spacing(0, 1.875, 0, 1.25),
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
    deleteIcon: {
      "& path:first-of-type": {
        fill: theme.palette.text.light,
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
    addItemHeight,
  },
);

export const PostFeedItem = connector(_PostFeedItem);

function _PostFeedItem(props) {
  const {
    currentUserMutesUser,
    currentUserFollowsUser,
    currentUserBlockedUser,
    hasMounted,
    type,
    item: postItem,
    usermap,
    postId,
    loggedinUserId,
    setTimelineId,
    sharedObj,
    sharedUser,
    authenticated,
    loggedinUserInfo,
    scene,
    onDelete,
    userMuted,
    userFollowing,
    userBlocked,
    timelineId,
    removePost,
    isPinnedPost,
    addPinPost,
    deletePinPost,
    pinnedPostIds,
    updatePinnedPostsIds,
    removePinnedPost,
    getPinnedPost,
    userInfoProfile,
    removePostFromProfile,
    toggleMute,
    toggleFollowing,
    toggleBlock,
    addItemHeight,
  } = props;

  if (!postItem.getPost()) return null;

  const classes = useStyles();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));
  const [dd, setDd] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [canShowMuted, setCanShowMuted] = useState(false);
  const [canShowFollowing, setCanShowFollowing] = useState(false);
  const [canShowBlocked, setCanShowBlocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(-5);
  const history = useHistory();
  const authRedirect = useAuthRedirect();
  const api = Global.GetPortal().getAppService();

  const postItemRef = useRef(null);

  const post = postItem.getPost();

  let posterInfo = postItem.getUserInfo(true);
  // If posterInfo doesn't exist, assume it's the current user.
  if (posterInfo === null) {
    posterInfo = api.getXUserInfo();
  }
  // If it's still null, don't render at all.
  if (posterInfo === null) {
    return null;
  }

  let posterId = post.getPosterId();
  const isPost = post.isPost();

  const isNoContentRepost =
    (posterId === postItem.getPosterId()
      ? postItem.isShared()
      : posterId !== postItem.getPosterId()) && type !== "for-medias";
  const reposterUsername = XUserInfo.GetOriginalUsername(posterInfo, true, "");
  const reposterUserId = posterInfo.getUserId();

  if (isNoContentRepost) {
    posterInfo = XUserInfo.Wrap(postItem._tp?.aux?.uinf[posterId]);
  }

  const isMyPost = loggedinUserId === posterInfo.getUserId();
  const displayName = XUserInfo.GetNickname(posterInfo, null);
  const username = XUserInfo.GetOriginalUsername(posterInfo, true, "");
  const isAdmin = api.userHasAdminRole();
  const canDelete = api.canDeleteResource(posterInfo);
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

  const isRepost = post.isPost() && post.isRepost();
  const isLikedAPost = postItem?.getAction() === ActivityLogProps.LIKES_POST;

  useEffect(() => {
    if (typeof hasMounted === "function") {
      hasMounted();
    }

    if (timelineId === postItem.getId()) {
      setTimeout(() => {
        postItemRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 500);
      setTimelineId(null);
    }

    if (scene === "timeline" && !sharedObj) {
      /**
       * TODO: will calculate the itemHeight once the all the data(images, videos...) is loaded
       *
       */
      if (postItemRef.current) {
        addItemHeight({
          itemId: postItem.data.domId,
          itemHeight: postItemRef.current.scrollHeight + 16, // 16 is the margin bottom of the item
          index: postItem.data.index,
          isNewPost: postItem.data.isNewPost,
        });
      }
    }
  }, []);

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
      <NotifMessage message={t("getter_fe.post.tips.deleted_post_success")} />,
      {
        type: toast.TYPE.SUCCESS,
      },
    );

    removePost(postId);
    if (isRepost && Array.isArray(post.data?.rpstIds)) {
      handleClearSameText(`prevRepost${post.data?.rpstIds[0]}`);
    } else {
      handleClearSameText("prevPost");
    }

    if (scene === "timeline" || scene === "profile") {
      setIsDeleted(true);

      isDeleted && onDelete();

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
      title: t("getter_fe.post.tips.delete_getter"),
      text: t(deleteMsg),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.button.delete"),
        type: "danger",
        callback: (close) => {
          const postItemAction = postItem.getAction();

          if (
            postItemAction === ActivityLogProps.SHARES_POST ||
            postItemAction === ActivityLogProps.SHARES_COMMENT
          ) {
            api.userUnshares(
              postId,
              postItemAction === ActivityLogProps.SHARES_POST ? "p" : "c",
              removePostItemCallback,
            );
          } else {
            api.deletePost(postId, removePostItemCallback);
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

  let menuItems;
  if (isMyPost) {
    menuItems = (
      <Fragment>
        {isPost ? (
          <div
            className={UIStyleConsts.DROPDOWN_MENU_ITEM}
            onClick={isPinned ? handleUnpinPost : handlePinPost}
          >
            <div className="wrapper">
              <div className="icon">
                <PinIcon className={classes.icon} />
              </div>
              <div className="menu-item-name">
                {isPinned
                  ? t("getter_fe.profile.common.unpinFromProfile")
                  : t("getter_fe.profile.common.pinToYourProfile")}
              </div>
            </div>
          </div>
        ) : null}

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
        {loggedinUserInfo &&
          canShowFollowing &&
          (isFollowing ? (
            <div
              className={UIStyleConsts.DROPDOWN_MENU_ITEM}
              onClick={handleFollowing}
            >
              <div className="wrapper">
                <div className="icon">
                  <UnfollowIcon className={classes.icon} />
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
                  <MuteIcon className={classes.icon} />
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
                  <MuteIcon className={classes.icon} />
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
                  <BlockIcon className={classes.icon} />
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
                  <BlockIcon className={classes.icon} />
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
              <ReportIcon className={classes.icon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.reportPost")}
            </div>
          </div>
        </div>

        {canDelete || isAdmin ? (
          <div
            className={classnames(UIStyleConsts.DROPDOWN_MENU_ITEM)}
            onClick={handlePostDelete}
          >
            <div className="wrapper">
              <div className="icon">
                <DeleteIcon className={classes.deleteIcon} />
              </div>
              <div className="menu-item-name">
                {t("getter_fe.profile.common.removePost")}
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

  let headLine = null;
  let postObj = post;
  let itemId = postItem.getId();

  // Replace if it's a repost
  // todo: It's a bug cause the backend api make the repost action as a post
  //        so it's always return false.(USER_PUB_POST/SHARES_POST)
  // 1 in the timeline page
  //    1.1 isRepost
  //    1.2 isNoContentRepost
  // 2 in the profile like tab page
  //    2.1 like a post
  //    2.2 like a repost
  //    2.3 like a noContentRepost
  // 3 in the post detail page

  let originalPosterInfo = null;
  let originalUserId = null;
  let originalPost = null;

  if (isRepost) {
    originalPost = postItem.getSharedPost();
    if (!originalPost) {
      originalPost = postItem.getLikedSharedPost();
    }
    if (originalPost) {
      originalPosterInfo = postItem
        .getTParent()
        .getAuxDataXField(ModelType.USER_INFO);
      originalUserId = originalPost.createXPostItem().getPosterId();
      originalPosterInfo = originalPosterInfo[originalUserId];
    }
  }

  //in the profile like tab
  // the post is a repost and the user liked the post
  if (isLikedAPost && isRepost && !originalPosterInfo) {
    originalPost = postItem._tp?.aux?.post;

    originalPosterInfo = postItem._tp?.aux?.uinf;
    let originalPostId = postItem?.getPost()?.data?.rpstIds[0];
    originalUserId = postItem?.getPost()?.data?.rusrIds[0];
    originalPosterInfo = originalPosterInfo[originalUserId];
    originalPost = originalPost[originalPostId];
  }

  if (sharedUser) {
    originalPosterInfo = sharedUser;
  }

  if (isNoContentRepost) {
    headLine = (
      <>
        <Link
          className="header-msg reposted-info"
          style={{display: "block"}}
          onClick={(e) => e.stopPropagation()}
          to={`/user/${reposterUserId}`}
        >
          <RepostIcon className={classes.repostIcon} />
          <span className={classes.repostSpacing} />
          {reposterUserId === loggedinUserId
            ? t("getter_fe.post.text.you_reposted")
            : t("getter_fe.post.text.reposted", {username: reposterUsername})}
        </Link>
      </>
    );
  }

  if (isLikedAPost) {
    headLine = null;
  }

  if (scene === "post-page-view") {
    headLine = null;
    originalUserId = post.getOriginalPosterId();
    originalPosterInfo =
      postItem.aux?.uinf && postItem.aux?.uinf[originalUserId];
  }

  const timeStamp =
    postItem.data?.activity?.cdate ?? postItem.aux?.post[postId]?.cdate;

  const sinceTime = TimeUtil.SinceTimeV5(
    timeStamp,
    Date.now(),
    getLang(),
    false,
  );
  const sinceTimeFormat = TimeUtil.SinceTimeV4(timeStamp, Date.now(), false);
  const postedTime = TimeUtil.Ts2hh_mm_MM_DD_YYYY(timeStamp, getLang());

  const detailLink = window.location.origin + api.getUrlPostPage(postId);

  if (posterInfo === null) {
    if (usermap) {
      posterInfo = usermap[posterId];
    } else {
      // this is what's causing the username to be current signed in user...
      posterInfo = api.getUserInfo();
    }
  }

  const contentType = postItem.getXMActivityLog().getContentType();
  let mainContent = null;
  if (contentType === ModelType.POST) {
    mainContent = (
      <PostContentView
        setTimelineId={setTimelineId}
        objId={postId}
        obj={post}
        pageType={type}
        sharedObj={sharedObj}
        originalPosterInfo={originalPosterInfo}
        {...props}
      />
    );
  } else if (contentType === ModelType.COMMENT) {
    mainContent = (
      <NewCommentContentView
        objId={postId}
        obj={postItem}
        pageType={type}
        {...props}
      />
    );
  }

  let avatarUrl = XUserInfo.GetIconUrl(posterInfo, null);

  let comp = null;
  const allProps = {
    id: "cid_" + postId,
    scene: scene,
    mainContent,
    postItemRef,
    avatarUrl,
    api,
    posterId,
    posterInfo,
    originalPosterInfo,
    displayName,
    username,
    sinceTime,
    sinceTimeFormat,
    setTimelineId,
    headLine,
    menuDropDown,
    isOpen: isDialogOpen,
    xPostItem: postItem,
    detailLink,
    type,
    itemId,
    postedTime,
    postId,
    sharedObj: sharedObj,
    isPinnedPost,
    hideDropdown,
    removePostFromProfile,
    handleClose: () => {
      setIsDialogOpen(false);
    },
    handleSubmit: (reasonId) => {
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
    },
  };

  if (/comment|repost/.test(scene)) {
    comp = <PostFeedItemViewForPopup {...allProps} />;
  } else if (/post-detail|comment-detail/.test(type)) {
    comp = <PostFeedItemViewForDetail {...allProps} />;
  } else {
    comp = <PostFeedItemViewForTimeline {...allProps} />;
  }

  return <Collapse in={!isDeleted}>{comp}</Collapse>;
}
