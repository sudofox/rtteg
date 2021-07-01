import React, {Fragment, useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {Link, useHistory} from "react-router-dom";
import clsx from "clsx";
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";
import {
  Collapse,
  ClickAwayListener,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {Box} from "@material-ui/core";
import {ModelType} from "src/core/model/ModelConsts";
import {NewCommentContentView} from "src/app/pages/post/NewCommentContentView";
import AppConsts, {UIStyleConsts} from "src/app/AppConsts";
import {UserLabelLink} from "src/app/components/UserLabelLink";
import XUserInfo from "src/core/model/user/XUserInfo";
import {TimeUtil} from "src/core/Util";
import {getLang, t} from "src/i18n/utils";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {GMobileDrawer} from "src/styles/components/GMobileDrawer";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import HoverPopup from "src/app/components/HoverPopup";
import {AvatarLink} from "src/app/components/AvatarLink";
import {ReportContentDialog} from "src/app/components/ReportContentDialog";
import {ReactComponent as MenuDropDownIcon} from "src/assets/icons/basic/more_horizontal.svg";
import {ReactComponent as MuteIcon} from "src/assets/icons/feature/mute.svg";
import {ReactComponent as UnmuteIcon} from "src/assets/icons/ico-unmute.svg";
import {ReactComponent as BlockIcon} from "src/assets/icons/feature/block.svg";
import {ReactComponent as ReportIcon} from "src/assets/icons/feature/report.svg";
import {ReactComponent as FollowIcon} from "src/assets/icons/feature/follow.svg";
import {ReactComponent as UnfollowIcon} from "src/assets/icons/feature/unfollow.svg";
import {ReactComponent as DeleteIcon} from "src/assets/icons/basic/delete.svg";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {ReactComponent as RepostIcon} from "src/assets/icons/feature/retweet.svg";
import {
  changeCommentStats,
  currentUserFollowsUser,
  toggleFollowing,
  currentUserMutesUser,
  toggleMute,
  currentUserBlockedUser,
  toggleBlock,
} from "src/store/modules/status";
import {CommentStatLine} from "src/app/pages/dashboard/CommentStatLine";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import Global from "src/system/Global";
import {postConstants} from "../_constants";
import {handleClearSameText} from "src/util/TextUtil";
import {addItemHeight} from "src/app/components/timeline/store";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      marginBottom: theme.spacing(2),
      boxShadow: ({isCommentDetail}) =>
        isCommentDetail ? null : theme.mixins.post.shadow,
      borderRadius: 10,
      display: "flex",
      flexDirection: "row",
      position: "relative",
      cursor: "pointer",
      "&.repost": {
        padding: "0 15px 15px 0",
      },
      "&:hover .header-msg": {
        backgroundColor: theme.palette.background.dark,
      },
    },
    repostSpacing: {
      marginRight: theme.spacing(1.25),
    },
    content: {
      width: "100%",
      padding: ({isCommentDetail, hasPaddingTop}) =>
        isCommentDetail && !hasPaddingTop ? "0 0 0 18px" : "15px 0 0 18px",
      display: "flex",
      flexDirection: "row",
      fontSize: "15px",
      "& > div > div": {
        maxWidth: "100%",
      },
    },
    commentDetailContent: {},
    mainContent: {
      width: "calc(100% - 66px)",
    },
    commentDetail: {
      width: "100%",
    },
    commentDetailAvatar: {
      position: "relative",
      // marginRight: "15px",

      "&::after": {
        content: "' '",
        position: "absolute",
        top: "56px",
        left: "27px",
        bottom: "-30px",
        width: "3px",
        backgroundColor: "#d9d9d9",
        borderRadius: "3px",
        transform: "translate(-50%, 0)",
      },
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "100%",
      marginRight: "10px",
      "&.repost": {
        width: 25,
        height: 25,
      },
      "&.feed": {
        marginRight: theme.spacing(1.875),
      },
    },
    header: {
      fontSize: 14,
      paddingRight: "4px",
      "& > div > div:first-child": {
        minWidth: "66px",
      },
      "& > div > div:nth-child(3)": {
        minWidth: "0px",
      },
    },
    headerDescription: {
      fontSize: "15px",
    },
    description: {
      paddingRight: "18px",

      marginTop: 8,
    },
    verification: {
      margin: "0 8px 0",
    },
    secondFont: {
      color: "#5C6872",
      width: "100%",
      "& a": {
        fontWeight: "normal",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
    replyingContent: {
      padding: "15px 0 16px 0",
    },
    dropdownImageWrapper: {
      display: "flex",
      width: 34,
      height: 34,
      marginTop: -6,
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
      fill: theme.palette.text.main,
      "&:hover": {
        backgroundColor: theme.palette.background.notif,
        cursor: "pointer",
      },
    },
    dotmr: {
      marginRight: theme.spacing(1.25),
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

        "&.danger": {
          border: "1px solid white",
          transition: "all .3s ease-in-out",
          "& svg": {},
          "&:hover": {
            color: theme.palette.error.secondary,
            borderRadius: theme.spacing(0.5),
            border: "1px solid red",
            backgroundColor: theme.palette.background.red,
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
        },

        "& .icon": {
          marginRight: theme.spacing(1),
        },

        "& .menu-item-name": {
          lineHeight: "31px",
        },
      },
    },
    statsLine: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 6,
      paddingBottom: 6,
    },
    usernameLinkHover: {
      display: "inline",
    },
    usernameLink: {
      "& a": {
        color: theme.palette.text.link,
      },
    },
    statsCounts: {
      fontSize: "17px",
      color: theme.palette.text.gray,
      paddingBottom: "20px",
      margin: "20px 0",
      borderBottom: `1px solid ${theme.palette.grey.A800}`,
      display: "flex",
    },
    countLabel: {
      fontWeight: "700",
      color: theme.palette.text.primary,
    },
    message: {
      wordBreak: "break-word",
      cursor: "pointer",
      "& .text-content": {
        display: "-webkit-box",
        "-webkit-line-clamp": 5,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
      },
      "&.c-detail > div > .text-content": {
        fontSize: 24,
        fontWeight: "300",
        letterSpacing: 1.5,
        "-webkit-line-clamp": "unset",
        overflow: "unset",
      },
      "&.c-detail .main-image": {
        marginTop: 4,
        marginBottom: 4,
      },
    },
    postedTime: {
      color: theme.palette.text.gray,
      fontSize: 18,
      padding: "16px 0 20px 0",
      borderBottom: `1px solid ${theme.mixins.avatar.borderColor}`,
      letterSpacing: 0.9,
    },
    commentDetailStatLine: {
      [theme.breakpoints.only("xs")]: {
        paddingBottom: "70px",
      },
    },
    icon: {
      width: 16,
      height: 16,
      margin: theme.spacing(0, 0, 0, 0.5),
      borderRadius: "100%",
    },
    hoverPopup: {
      display: "flex",
      flexShrink: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginRight: "3px",
    },
    userDisplayName: {
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    influencer: {
      display: "flex",
      flexShrink: 0,
      marginRight: "3px",
      paddingTop: theme.spacing(0.25),
    },
    repostIcon: {
      "& path": {
        fill: theme.palette.text.light,
      },
    },
    blockIcon: {
      "& path": {
        fill: theme.palette.text.light,
      },
    },
    reportIcon: {
      "& path": {
        fill: theme.palette.text.light,
        stroke: theme.palette.text.light,
      },
    },
    muteIcon: {
      "& path": {
        fill: theme.palette.text.light,
      },
    },
    unmuteIcon: {
      "& path": {
        stroke: theme.palette.text.light,
      },
    },
    followIcon: {
      "& path": {
        fill: theme.palette.text.light,
      },
    },
    unfollowIcon: {
      "& path": {
        fill: theme.palette.text.light,
      },
    },
    userAtNameShort: {
      flexShrink: 99,
      marginRight: "3px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontWeight: "400",
      [theme.breakpoints.down("xs")]: {
        flexShrink: 99,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        Display: "block",
      },
    },
    userAtName: {
      color: theme.palette.text.gray,
      cursor: "pointer",
      fontWeight: "400",
    },
    dot: {
      color: theme.palette.text.gray,
      display: "flex",
      fontSize: 15,
      flexShrink: 0,
      marginLeft: 5,
      marginRight: 5,
    },
    sinceTime: {
      display: "flex",
      flexShrink: 0,
      color: theme.palette.text.gray,
      fontWeight: 400,
    },
    unavailablePost: {
      border: "1px solid #E0E6EA",
      backgroundColor: "#F3F5F8",
      borderRadius: 10,
      width: "auto",
      padding: theme.spacing(1.75),
      color: theme.palette.text.gray,
      lineHeight: "15px",
      margin: theme.spacing(2.5),
    },
    repostHeader: {
      color: theme.palette.text.gray,
      fontSize: "13px",
      lineHeight: "13px",
      paddingLeft: theme.spacing(6.5),
      paddingBottom: theme.spacing(1),
      marginBottom: theme.spacing(-2.5),
      paddingTop: "14px",
      fontWeight: "700",
      "&:hover": {
        color: theme.palette.text.gray,
      },
      "& svg": {
        verticalAlign: "top",
      },
    },
    removeIcon: {
      "& path:first-of-type": {
        fill: theme.palette.text.light,
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      authenticated: state.auth?.session?.authenticated,
      loggedInUserId: state.auth.session?.userinfo?._id,
      token: state.auth.session?.userinfo?.token,
      userFollowing: state.status.following,
      userMuted: state.status.muted,
      userBlocked: state.status.blocked,
      commentStats: state.status.commentStats,
      likedComments: state.userComments.commentFeed?.likedComments,
      sharedComments: state.userComments.commentFeed?.sharedComments,
    };
  },
  {
    changeCommentStats,
    currentUserFollowsUser,
    currentUserMutesUser,
    currentUserBlockedUser,
    toggleFollowing,
    toggleMute,
    toggleBlock,
    addItemHeight,
  },
);

export const CommentFeedItem = connector(_CommentFeedItem);

function _CommentFeedItem(props) {
  const {
    changeCommentStats,
    currentUserFollowsUser,
    currentUserMutesUser,
    currentUserBlockedUser,
    comment: xComment,
    usermap,
    postOwner,
    authenticated,
    userFollowing,
    userMuted,
    userBlocked,
    commentStats,
    type,
    showMenuDropDown,
    scene,
    loggedInUserId,
    deleteComment,
    ousername,
    toggleFollowing,
    toggleMute,
    toggleBlock,
    addItemHeight,
    sharedCom,
  } = props;

  const classes = useStyles({
    isCommentDetail:
      type === "comment-detail" || type === "comment-comment-detail",
    hasPaddingTop: type === "comment-comment-detail",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [canShowFollowing, setCanShowFollowing] = useState(false);
  const [canShowMuted, setCanShowMuted] = useState(false);
  const [canShowBlocked, setCanShowBlocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(-5);
  const history = useHistory();
  const authRedirect = useAuthRedirect();

  const ddRef = useRef(null);
  const commentItemRef = useRef(null);

  const portal = Global.GetPortal();
  const api = portal.getAppService();

  const posts = xComment._tp?.aux?.post;
  const isNotProfilePage = !posts;
  const xStats = xComment.getAuxDataXField(ModelType.COMMENT_STATS);

  let commentId;
  if (isNotProfilePage) {
    commentId = xComment.getId();
  } else {
    commentId = xComment.getPostId();
  }

  let userInfoMap = usermap;
  if (userInfoMap == null)
    userInfoMap = xComment.getAuxDataField(ModelType.USER_INFO);
  if (!userInfoMap) {
    userInfoMap = xComment.getTParent()?.getXUserInfoMap();
  }

  const posterId = xComment.getCommentPosterId
    ? xComment.getCommentPosterId()
    : xComment.getPosterId();

  const isFollowing = userFollowing[posterId];
  const isMuted = userMuted[posterId];
  const isBlocked = userBlocked[posterId];

  const isNoContentRepost = xComment.data?.action === "shares_cm";

  let originPosterId;
  if (isNotProfilePage) {
    originPosterId = xComment.data.puid;
  } else {
    originPosterId = xComment.getOriginalPosterId();
    if (!originPosterId) originPosterId = xComment?.data?.activity?.uid;
  }

  let posterInfo = userInfoMap ? userInfoMap[posterId] : null;
  if (posterInfo) {
    posterInfo = XUserInfo.WrapXObject(posterInfo, XUserInfo);
  }

  let originPosterInfo = userInfoMap ? userInfoMap[originPosterId] : null;
  if (originPosterInfo) {
    originPosterInfo = XUserInfo.WrapXObject(originPosterInfo, XUserInfo);
  }

  const nickname = posterInfo?.getNickname() ?? posterId;
  const username = posterInfo?.getUsername() ?? posterId;
  const upperCaseId =
    posterInfo?.getOriginalUsername() || ousername || posterId;

  const postUsername =
    AppConsts.CHAR_AROBASE +
    (originPosterInfo?.getOriginalUsername
      ? originPosterInfo?.getOriginalUsername()
      : originPosterInfo?.getUsername()
      ? originPosterInfo?.getUsername()
      : originPosterId);

  const avatarUrl = posterInfo?.getIconUrl(null) ?? null;
  const sinceTime = TimeUtil.SinceTimeV5(
    xComment.getCreatedTS(null),
    Date.now(),
    getLang(),
    false,
  );
  const sinceTimeFormat = TimeUtil.SinceTimeV4(
    xComment.getCreatedTS(null),
    Date.now(),
    false,
  );
  const postedTime = TimeUtil.Ts2hh_mm_MM_DD_YYYY(
    xComment.getCreatedTS(null),
    getLang(),
  );
  const isSuspended = posterInfo?.isSuspended();
  const isMyPost = loggedInUserId === posterInfo?.getUserId();
  const isPostOwner = postOwner === loggedInUserId;
  const userHasModeratorRole = portal.userHasModeratorRole();

  useEffect(() => {
    if (/repost|comment-composer/.test(scene)) {
      return;
    }

    if (type === "comment-timeline" && !sharedCom) {
      /**
       * TODO: will calculate the itemHeight once the all the data(images, videos...) is loaded
       *
       */
      if (commentItemRef.current) {
        addItemHeight({
          itemId: xComment.data.domId,
          itemHeight: commentItemRef.current.scrollHeight + 16, // 16 is the margin bottom of the item
          index: xComment.data.index,
          isNewPost: xComment.data.isNewPost,
        });
      }
    }

    let num_comment;
    let num_likes;
    let num_reposts;
    let likeStatus;
    let repostStatus;
    if (/comment-detail|comment-comment-detail/.test(type)) {
      num_comment = xComment.aux?.s_cmst?.cm;
      num_likes = xComment.aux?.s_cmst?.lkbcm;
      num_reposts = xComment.aux?.s_cmst?.shbcm;
    } else if (!posts) {
      num_comment = xComment._tp?.aux?.s_cmst[commentId]?.cm;
      num_likes = xComment._tp?.aux?.s_cmst[commentId]?.lkbcm;
      num_reposts = xComment._tp?.aux?.s_cmst[commentId]?.shbcm;
    } else {
      num_comment = xComment._tp?.aux?.s_pst[commentId]?.cm;
      num_likes = xComment._tp?.aux?.s_pst[commentId]?.lkbcm;
      num_reposts = xComment._tp?.aux?.s_pst[commentId]?.shbcm;
    }

    if (commentStats[commentId]?.likeStatus) {
      likeStatus = commentStats[commentId].likeStatus;
    } else {
      likeStatus = xComment._tp?.aux?.lks.includes(commentId) ? "y" : "n";
    }

    if (commentStats[commentId]?.repostStatus) {
      repostStatus = commentStats[commentId].repostStatus;
    } else {
      repostStatus = xComment._tp?.aux?.shrs.includes(commentId) ? "y" : "n";
    }

    num_comment = parseInt(num_comment);
    num_likes = parseInt(num_likes);
    num_reposts = parseInt(num_reposts);

    if (num_reposts < 0 || num_reposts === undefined || isNaN(num_reposts)) {
      num_reposts = 0;
    }

    if (num_comment < 0 || num_comment === undefined || isNaN(num_comment)) {
      num_comment = 0;
    }

    if (num_likes < 0 || num_likes === undefined || isNaN(num_likes)) {
      num_likes = 0;
    }

    changeCommentStats({
      commentId,
      stats: {
        num_comment,
        num_likes,
        num_reposts,
        likeStatus,
        repostStatus,
      },
    });
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selection = window.getSelection().toString();

    if (selection.length > 0) {
      return;
    }

    history.push(`/comment/${commentId}`);
  };

  const hideDropdown = () => {
    if (ddRef.current) {
      ddRef.current.hide();
    }
  };

  const goToLoginPage = () => {
    authRedirect();
  };

  const handlePostCommentDelete = (e) => {
    e.stopPropagation();
    toggleDrawer(false)();
    GConfirmAlert({
      confirmType: postConstants.DELETEPOST,
      title: t("getter_fe.post.tips.delete_comment_title"),
      text: t("getter_fe.post.tips.delete_comment_text"),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.button.delete"),
        type: "danger",
        callback: (close) => {
          api.deletePostComment(commentId, (err, result) => {
            handleClearSameText(`prevComment${xComment.data?.pid}`);
            if (err) {
              console.log(err);
              toast.info(
                <NotifMessage message={"ERROR CODE: " + err.data.code} />,
                {
                  type: toast.TYPE.WARNING,
                },
              );
              return;
            }
            if (result) {
              toast.info(
                <NotifMessage
                  message={t("getter_fe.post.tips.deleted_comment_success")}
                />,
                {
                  type: toast.TYPE.SUCCESS,
                },
              );
              setIsDeleted(true);
              deleteComment && deleteComment(commentId);
            }
          });
          close();
        },
      },
    });
  };

  const handleMute = (e) => {
    if (!authenticated) {
      goToLoginPage();
      return;
    }
    e.stopPropagation();
    hideDropdown();
    let title;
    if (isMuted) {
      title = t("getter_fe.profile.common.unmuteUsername", {
        username: upperCaseId || posterId,
      });
    } else {
      title = t("getter_fe.profile.common.muteUsername", {
        username: upperCaseId || posterId,
      });
    }
    GConfirmAlert({
      title,
      text: isMuted
        ? " "
        : t("getter_fe.post.tips.mute_getter_tips", {
            username: upperCaseId || posterId,
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
              close();
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
              close();
            },
          });
          toggleDrawer(false)();
        },
      },
    });
  };

  const handleFollowing = (e) => {
    if (!authenticated) {
      goToLoginPage();
      return;
    }
    e.stopPropagation();
    hideDropdown();
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
        title: t("getter_fe.profile.common.unfollowUsername", {
          username: upperCaseId || posterId,
        }),
        text: t("getter_fe.post.tips.unfollow_tips", {
          username: upperCaseId || posterId,
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
            toggleDrawer(false)();
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

  const handleBlock = (e) => {
    if (!authenticated) {
      goToLoginPage();
      return;
    }
    e.stopPropagation();
    hideDropdown();
    let title;
    if (isBlocked) {
      title = t("getter_fe.profile.common.unblockUsername", {
        username: upperCaseId || posterId,
      });
    } else {
      title = t("getter_fe.profile.common.blockUsername", {
        username: upperCaseId || posterId,
      });
    }
    GConfirmAlert({
      title,
      text: isBlocked
        ? " "
        : t("getter_fe.post.tips.block_getter_tips", {
            username: upperCaseId || posterId,
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
              close();
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
              close();
            },
          });
          toggleDrawer(false)();
        },
      },
    });
  };

  const onShowDrawerOrMenu = async () => {
    const userId = loggedInUserId;
    const targetId = posterInfo.getUserId();

    if (userFollowing[targetId] === undefined) {
      await currentUserFollowsUser({userId, targetId});
    }
    if (userMuted[targetId] === undefined) {
      await currentUserMutesUser({userId, targetId});
    }
    if (userBlocked[targetId] === undefined) {
      await currentUserBlockedUser({userId, targetId});
    }

    setCanShowMuted(true);
    setCanShowFollowing(true);
    setCanShowBlocked(true);
  };

  const toggleDrawer = (open) => async () => {
    setIsDrawerOpen(open);

    if (open) {
      onShowDrawerOrMenu();
    }
  };

  let menuDropDown = null;
  if (scene !== "repost") {
    let menuItems;

    if (posterInfo && !isMyPost) {
      menuItems = (
        <Fragment>
          {canShowFollowing &&
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

          {canShowMuted &&
            (isMuted ? (
              <div
                className={UIStyleConsts.DROPDOWN_MENU_ITEM}
                onClick={handleMute}
              >
                <div className="wrapper">
                  <div className="icon">
                    <UnmuteIcon className={classes.unmuteIcon} />
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
          {canShowBlocked &&
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
            onClick={(e) => {
              e.stopPropagation();
              if (!authenticated) {
                goToLoginPage();
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
          {userHasModeratorRole || isPostOwner ? (
            <div
              className={classnames(UIStyleConsts.DROPDOWN_MENU_ITEM)}
              onClick={handlePostCommentDelete}
            >
              <div className="wrapper">
                <div className="icon">
                  <DeleteIcon className={classes.removeIcon} />
                </div>
                <div className="menu-item-name">
                  {t("getter_fe.profile.common.removeComment")}
                </div>
              </div>
            </div>
          ) : null}
        </Fragment>
      );
    } else {
      menuItems = (
        <div
          className={classnames(UIStyleConsts.DROPDOWN_MENU_ITEM, "danger")}
          onClick={handlePostCommentDelete}
        >
          <div className="wrapper">
            <div className="icon">
              <DeleteIcon className={classes.removeIcon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.removeComment")}
            </div>
          </div>
        </div>
      );
    }
    menuDropDown = isMobile ? (
      <Fragment>
        <MenuDropDownIcon
          className={classes.dropdownImage}
          onClick={(e) => {
            e.stopPropagation();
            toggleDrawer(true)();
          }}
        />
        <GMobileDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer}>
          {menuItems}
        </GMobileDrawer>
      </Fragment>
    ) : (
      <ClickAwayListener
        onClickAway={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(false);
        }}
      >
        <Dropdown
          active={isDropdownOpen}
          removeElement={true}
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
            document.body.click();
            const DEFAULT_TOP = -5;
            const countedTop =
              window.innerHeight -
              e.target.getBoundingClientRect().y -
              (menuItems.props.children.length || 1) * 52 -
              10;
            setDropdownTop(Math.min(DEFAULT_TOP, countedTop));
          }}
          ref={ddRef}
          onShow={onShowDrawerOrMenu}
        >
          <DropdownTrigger onClick={() => {}}>
            <div
              className={classnames(
                classes.dropdownImageWrapper,
                scene === "comment-detail" ? classes.dotmr : "",
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
  }

  const reposterUserId = xComment.data?.activity?.init_id;

  return (
    <Collapse in={!isDeleted}>
      <div
        className={`post-feed-item ${scene}`}
        key={commentId}
        ref={commentItemRef}
      >
        <div className={`${classes.root} ${scene}`} onClick={onClick}>
          <div style={{width: "100%"}}>
            {isNoContentRepost ? (
              <Link
                className={classes.repostHeader}
                style={{display: "block"}}
                onClick={(e) => e.stopPropagation()}
                to={`/user/${reposterUserId}`}
              >
                <RepostIcon className={classes.repostIcon} />
                <span className={classes.repostSpacing} />
                {reposterUserId === loggedInUserId
                  ? t("getter_fe.post.text.you_reposted")
                  : t("getter_fe.post.text.reposted", {
                      username: reposterUserId,
                    })}
              </Link>
            ) : null}
            <div
              className={classnames(
                classes.content,
                type === "comment-detail" && classes.commentDetailContent,
              )}
            >
              {type === "comment-detail" ? null : (
                <div
                  className={
                    type === "comment-comment-detail" &&
                    !(showMenuDropDown === "no")
                      ? classes.commentDetailAvatar
                      : ""
                  }
                >
                  {scene === "repost" || scene === "comment-composer" ? (
                    <AvatarLink
                      avatarUrl={avatarUrl}
                      styleClasses={`${classes.avatar} ${scene}`}
                      userId={posterId}
                      username={nickname}
                    />
                  ) : (
                    <HoverPopup userId={posterId} userInfoTemp={posterInfo}>
                      <div key="popup-handler ">
                        <AvatarLink
                          avatarUrl={avatarUrl}
                          styleClasses={`${classes.avatar} ${scene}`}
                          userId={posterId}
                          username={nickname}
                        />
                      </div>
                    </HoverPopup>
                  )}
                </div>
              )}
              <Box
                className={
                  type === "comment-detail"
                    ? classes.commentDetail
                    : classes.mainContent
                }
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  className={classes.header}
                >
                  <Box
                    width="80%"
                    display="flex"
                    flexGrow={1}
                    flexDirection={type === "comment-detail" ? "row" : "column"}
                    alignItems={type === "comment-detail" ? "center" : ""}
                    className={classes.headerDescription}
                  >
                    {type === "comment-detail" ? (
                      <HoverPopup userId={posterId} userInfoTemp={posterInfo}>
                        <div
                          key="popup-handler"
                          className={classes.avatarContent}
                        >
                          <AvatarLink
                            avatarUrl={avatarUrl}
                            styleClasses={classes.avatar}
                            userId={posterId}
                            username={nickname}
                          />
                        </div>
                      </HoverPopup>
                    ) : null}
                    <Box display="flex" flexDirection="row" flex="1">
                      <Box
                        display={type === "comment-detail" ? "block" : "flex"}
                        width="80%"
                        flexGrow={1}
                        flexDirection="row"
                        alignItems="center"
                        mr={1}
                      >
                        <HoverPopup
                          userId={posterId}
                          userInfoTemp={posterInfo}
                          leftAligned={true}
                        >
                          <div
                            key="popup-handler"
                            name="handler"
                            className={classes.hoverPopup}
                          >
                            <div className={classes.userDisplayName}>
                              <UserLabelLink
                                userId={posterId}
                                nickname={nickname}
                              />
                            </div>
                            {posterInfo?.isInfluencer &&
                              posterInfo?.isInfluencer() > 0 && (
                                <div className={classes.influencer}>
                                  <VerificationIcon className={classes.icon} />
                                </div>
                              )}
                          </div>
                        </HoverPopup>
                        <Box display="flex" alignItems="center" flexShrink="0">
                          {scene === "repost" ? null : (
                            <div
                              className={
                                sinceTimeFormat
                                  ? classes.userAtNameShort
                                  : classes.userAtName
                              }
                            >
                              {AppConsts.CHAR_AROBASE}
                              {upperCaseId || username}
                            </div>
                          )}

                          <div className={classes.dot}>·</div>
                          <div className={classes.sinceTime}>{sinceTime}</div>
                        </Box>
                      </Box>
                    </Box>
                    {type === "comment-detail" ||
                    scene === "comment-detail" ||
                    scene === "repost" ||
                    showMenuDropDown === "no" ? null : (
                      <Box mt={1}>
                        <span className={classes.secondFont}>
                          {t("getter_fe.post.text.reply_to")}{" "}
                          <HoverPopup
                            userId={originPosterId}
                            userInfoTemp={posterInfo}
                            extraClass={classes.usernameLinkHover}
                          >
                            <span className={classes.usernameLink}>
                              <UserLabelLink
                                userId={originPosterId}
                                nickname={postUsername}
                              />
                            </span>
                          </HoverPopup>
                        </span>
                      </Box>
                    )}
                  </Box>
                  {!(showMenuDropDown === "no") && menuDropDown}
                </Box>
                {type === "comment-detail" ? (
                  <div
                    className={`${classes.secondFont} ${classes.replyingContent}`}
                  >
                    {t("getter_fe.post.text.reply_to")}{" "}
                    <HoverPopup
                      userId={originPosterId}
                      userInfoTemp={posterInfo}
                      extraClass={classes.usernameLinkHover}
                    >
                      <span className={classes.usernameLink}>
                        <UserLabelLink
                          userId={originPosterId}
                          nickname={postUsername}
                        />
                      </span>
                    </HoverPopup>
                  </div>
                ) : null}
                {isSuspended ? (
                  <div className="unavailable-post-container" key={commentId}>
                    <div className={classes.unavailablePost}>
                      {t("getter_fe.post.tips.unavailable_comment")}
                    </div>
                  </div>
                ) : (
                  <div
                    className={classes.description}
                    style={{marginTop: type === "comment-detail" ? 0 : 8}}
                  >
                    <div
                      className={clsx(
                        classes.message,
                        type === "comment-detail" ? "c-detail" : null,
                      )}
                    >
                      <NewCommentContentView
                        objId={commentId}
                        obj={xComment}
                        pageType={type}
                        {...props}
                      />
                    </div>
                    {type === "comment-detail" ||
                    (scene !== "comment" && scene !== "repost") ? (
                      <>
                        {type === "comment-detail" ? (
                          <div className={classes.postedTime}>{postedTime}</div>
                        ) : null}
                        <div
                          className={
                            type === "comment-detail"
                              ? classes.commentDetailStatLine
                              : classes.statsLine
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <CommentStatLine
                            item={xComment}
                            classes={classes}
                            type={type}
                            scene={scene}
                            xStats={xStats}
                            skin="none"
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </Box>
            </div>
          </div>
          <ReportContentDialog
            isOpen={isDialogOpen}
            handleClose={() => {
              setIsDialogOpen(false);
            }}
            handleSubmit={(reasonId) => {
              const postId = xComment.getPostId();

              api.reportPost(postId, reasonId, () => {
                toast.info(
                  <NotifMessage
                    message={t(
                      "getter_fe.common.reportContent.reportSuccessMessage",
                    )}
                  />,
                  {
                    type: toast.TYPE.SUCCESS,
                  },
                );
              });
            }}
          />
        </div>
      </div>
    </Collapse>
  );
}
