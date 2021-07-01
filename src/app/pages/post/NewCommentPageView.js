import {makeStyles} from "@material-ui/core";
import {useDispatch, connect} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {t} from "src/i18n/utils";
import {GBackTitle} from "src/styles/components/GBackTitle";
import Global from "src/system/Global";
import {CommentFeedItem} from "src/app/components/post/comps/CommentFeedItem";
import {PostFeedItem} from "src/app/components/post/comps/PostFeedItem";
import {PostCommentFeed} from "../dashboard/PostCommentFeed";
import {changeCommentStats} from "src/store/modules/status";
import {addLikedPost, addSharedPost} from "src/app/components/timeline/store";
import {GHemlmet} from "src/styles/components/GHelmet";
import {NewPostCommentFeed} from "../dashboard/NewPostCommentFeed";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
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
  commentContainer: {
    minHeight: "calc(100vh - 70px)",
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
  commentDetailCard: {
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.mixins.post.shadow,
    marginBottom: theme.spacing(2),
    borderRadius: 10,
  },
}));

const connector = connect(
  (state) => {
    return {
      commentStats: state.status.commentStats,
      likedComments: state.userComments.commentFeed.likedComments,
      sharedComments: state.userComments.commentFeed.sharedComments,
    };
  },
  {
    changeCommentStats,
    addLikedPost,
    addSharedPost,
  },
);

export const NewCommentPageView = connector(_NewCommentPageView);

function _NewCommentPageView({
  commentId,
  changeCommentStats,
  addLikedPost,
  addSharedPost,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [commentObj, setCommentObj] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const ref = useRef(null);

  const api = Global.GetPortal().getAppService();

  const changeStats = (val) => {
    dispatch(changeCommentStats(val));
  };

  useEffect(() => {
    const fetchLikeStatus = async (id, isPost = false) => {
      try {
        let res;
        if (isPost) {
          res = await api.userLikePostStatus(id);
          if (res === "y") {
            addLikedPost(id);
          }
        } else {
          res = await api.userLikeCommentStatus(id);
          changeStats({
            commentId: id,
            stats: {
              likeStatus: res,
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchRepostStatus = async (id, isPost = false) => {
      try {
        let res = null;
        if (isPost) {
          res = await api.userSharePostStatus(id);
          if (res === "y") {
            addSharedPost(id);
          }
        } else {
          res = await api.userShareCommentStatus(id);
          if (res === null) {
            // for some reason null is returned if the comment has been reposted
            changeStats({
              commentId: id,
              stats: {repostStatus: "y"},
            });
          } else {
            changeStats({
              commentId: id,
              stats: {repostStatus: res},
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchCommentObj = async () => {
      const res = await api.fetchCommentWithStats_UserInfo_Post(commentId);
      if (res.data.nfound) {
        setNotFound(true);
        return;
      }
      let postId = res.getPostId(); //post or comment
      let isPost = res.getPost().isPost();
      fetchLikeStatus(postId, isPost);
      fetchRepostStatus(postId, isPost);
      setCommentObj(res);
    };

    fetchCommentObj();
    fetchLikeStatus(commentId);
    fetchRepostStatus(commentId);
  }, [commentId]);

  useEffect(() => {
    if (commentObj && ref.current) {
      setTimeout(() => {
        const headerOffset = 110;
        const elementPosition = ref.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
        });
      }, 100);
    }
  }, [commentObj]);

  if (notFound) {
    return <GBackTitle title={t("getter_fe.common.pageNotFoundTitle")} />;
  }

  let bodyComp = null;
  if (commentObj) {
    const commentItem = commentObj.createXPostItem();
    const postObj = commentObj.getPost();
    const xPostItem = postObj.createXPostItem();
    const sharedPost = postObj.getSharedPost();
    const posterInfo = xPostItem.getUserInfo();
    const isSuspended = posterInfo?.isSuspended();
    const commentUserId = commentObj.data?.uid;

    bodyComp = (
      <>
        <GHemlmet
          description={commentObj.data?.txt}
          imageURL={
            Array.isArray(commentObj.data?.imgs)
              ? commentObj.data?.imgs[0]
              : null
          }
          originalUsername={commentObj.aux?.uinf[commentUserId]?.ousername}
          type="article"
        />
        <div className={classes.commentDetailCard}>
          {postObj.isPost() ? (
            <PostFeedItem
              item={xPostItem}
              type="comment-detail"
              scene="post-detail"
              userId={xPostItem.getTargetId()}
              sharedObj={sharedPost}
              postId={xPostItem.getPostId()}
            />
          ) : (
            <CommentFeedItem
              commentId={postObj.getId()}
              comment={postObj}
              postPosterInfo={xPostItem && xPostItem.getUserInfo()}
              type="comment-comment-detail"
            />
          )}
          {isSuspended ? (
            <div className="unavailable-post-container" ref={ref}>
              <div className={classes.unavailablePost}>
                {t("getter_fe.post.tips.unavailable_comment")}
              </div>
            </div>
          ) : (
            <div ref={ref}>
              <CommentFeedItem
                commentId={commentObj.getId()}
                item={commentItem}
                comment={commentObj}
                postPosterInfo={xPostItem.getUserInfo()}
                type="comment-detail"
              />
            </div>
          )}
        </div>
        {isSuspended ? null : (
          <div className={classes.commentContainer}>
            <NewPostCommentFeed id={commentId} />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <GBackTitle title={t("getter_fe.post.button.post")} />
      {bodyComp}
    </>
  );
}
