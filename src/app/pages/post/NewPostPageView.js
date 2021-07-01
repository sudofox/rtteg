import {makeStyles} from "@material-ui/core";
import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {toast} from "react-toastify";
import AppConsts from "src/app/AppConsts";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {t} from "src/i18n/utils";
import {GBackTitle} from "src/styles/components/GBackTitle";
import {GLoader} from "src/styles/components/GLoader";
import Global from "src/system/Global";
import {refreshHelper} from "src/util/refreshHelper";
import PostCommentFeed from "../dashboard/PostCommentFeed";
import {PostFeedItem} from "src/app/components/post/comps/PostFeedItem";
import {GHemlmet} from "src/styles/components/GHelmet";
import {NewPostCommentFeed} from "../dashboard/NewPostCommentFeed";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
  },
  header: {
    padding: theme.spacing(4, 6),
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",

    "& > h1": {
      fontWeight: "bold",
      color: theme.palette.text.primary,
      fontSize: "22px",
    },

    "& > svg": {
      margin: theme.spacing(1),
      fill: theme.palette.text.primary,
    },
  },
  unavailablePost: {
    border: "1px solid #E0E6EA",
    backgroundColor: "#F3F5F8",
    borderRadius: 10,
    width: "auto",
    padding: theme.spacing(1.75),
    color: theme.palette.text.gray,
    lineHeight: "15px",
    margin: theme.spacing(3.75, 2.5, 0, 2.5),
  },
}));

export const NewPostPageView = ({postId}) => {
  const classes = useStyles();
  const history = useHistory();

  const [postInfo, setPostInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const authRedirect = useAuthRedirect();

  const api = Global.GetPortal().getAppService();

  useEffect(() => {
    const fetchPostInfo = async () => {
      setPostInfo(null); // in order for rerender in PostFeeditem
      const res = await api.fetchPostWithStats_UserInfo(postId);
      // if the post doesnt exist redirect to the dashboard
      if (res.data.nfound) {
        setIsUnavailable(true);
      } else {
        setPostInfo(res);
      }
    };
    fetchPostInfo();
  }, [postId]);

  const toggleMute = (userId, posterName, callback) => {
    if (isMuted) {
      api.unmuteUser(userId, (error, result) => {
        if (!result) {
          authRedirect();
          return;
        }
        setIsMuted(false);
        callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.unmute_success", {
              username: upperCaseId || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    } else {
      api.muteUser(userId, (error, result) => {
        if (!result) {
          authRedirect();
          return;
        }
        setIsMuted(true);
        callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.mute_success", {
              username: upperCaseId || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    }
  };

  const toggleFollowing = (userId, posterName, callback) => {
    if (isFollowing) {
      api.unfollowUser(userId, (error, result) => {
        if (!result) {
          authRedirect();
          return;
        }
        setIsFollowing(false);
        callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.unfollow_success", {
              username: upperCaseId || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    } else {
      api.followUser(userId, (error, result) => {
        if (!result) {
          authRedirect();
          return;
        }
        setIsFollowing(true);
        callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.follow_success", {
              username: upperCaseId || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    }
  };

  const toggleBlock = (userId, posterName, callback) => {
    if (isBlocked) {
      api.unblockUser(userId, (error, result) => {
        if (!result) {
          authRedirect();
          return;
        }
        setIsBlocked(false);
        callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.unblock_success", {
              username: upperCaseId || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    } else {
      api.blockUser(userId, (error, result) => {
        if (!result) {
          authRedirect();
          return;
        }
        setIsBlocked(true);
        callback();
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.block_success", {
              username: upperCaseId || posterId,
            })}
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      });
    }
  };

  const getUnavailableComp = () => {
    return (
      <div className="unavailable-post-container">
        <div className={classes.unavailablePost}>
          {t("getter_fe.post.tips.unavailable_post")}
        </div>
      </div>
    );
  };

  let bodyComp = <GLoader />;

  if (isUnavailable) {
    bodyComp = getUnavailableComp();
  }

  if (postInfo) {
    if (postInfo.isComment()) {
      history.replace(window.location.pathname.replace("/post/", "/comment/"));
      return null;
    }
    const xPostItem = postInfo.createXPostItem();
    const sharedPost = postInfo.getSharedPost();
    const posterInfo = xPostItem.getUserInfo();
    const posterId = postInfo.getOwnerId();
    const upperCaseId = posterInfo?.getOriginalUsername();
    const isSuspended = posterInfo?.isSuspended();
    const post = xPostItem.getPost();

    if (isSuspended) {
      bodyComp = getUnavailableComp();
    } else {
      bodyComp = (
        <>
          {post && (
            <GHemlmet
              description={post.data?.txt}
              imageURL={
                Array.isArray(post.data?.imgs) ? post.data?.imgs[0] : null
              }
              originalUsername={upperCaseId}
              type="article"
            />
          )}

          <PostFeedItem
            item={xPostItem}
            type="post-detail"
            scene="post-page-view"
            isMuted={isMuted}
            isFollowing={isFollowing}
            isBlocked={isBlocked}
            toggleMute={toggleMute}
            toggleFollowing={toggleFollowing}
            toggleBlock={toggleBlock}
            handleMute={setIsMuted}
            handleBlocked={setIsBlocked}
            handleFollowing={setIsFollowing}
            userId={posterId}
            sharedObj={sharedPost}
            postId={xPostItem.getPostId()}
          />
          <NewPostCommentFeed id={postId} />
        </>
      );
    }
  }

  return (
    <div className={classes.root}>
      <GBackTitle title={t("getter_fe.post.button.post")} />
      {bodyComp}
    </div>
  );
};
