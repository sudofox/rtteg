import {useEffect, useState} from "react";
import {useDispatch, connect} from "react-redux";
import {useHistory} from "react-router";
import {CommentCommentComposer} from "src/app/components/post/comps/CommentCommentComposer";
import {CommentPostButton} from "../post/CommentPostButton";
import {LikeButton} from "../post/LikeButton";
import {ShareButton} from "../post/ShareButton";
import {RepostButton} from "../post/RepostButton";
import {
  changeFollowingStatus,
  changeMutedStatus,
  changeBlockedStatus,
  changeCommentStats,
} from "src/store/modules/status";
import {addLikedPost, removeLikedPost} from "src/app/components/timeline/store";
import Global from "src/system/Global";
import {makeStyles} from "@material-ui/core";
import {formatLongNumber} from "src/util/NumberUtil";
import {t} from "src/i18n/utils";

const useStyles = makeStyles((theme) => ({
  statsCounts: {
    fontSize: 16,
    color: theme.palette.text.gray,
    padding: "15px 0",
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
    display: "flex",
  },
  countItem: {
    marginRight: 25,
  },
  countLabel: {
    fontWeight: "700",
    color: theme.palette.text.primary,
  },
  statLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: ({isDetail}) => (isDetail ? "100%" : "calc(100% + 18px)"),
    padding: ({isDetail}) => (isDetail ? theme.spacing(2, 10, 0, 10) : null),
    margin: ({isDetail}) => (isDetail ? null : "0px -9px"),
    "& svg": {
      transform: ({isDetail}) => (isDetail ? "scale(1.25)" : null),
    },
  },
  mainStats: {
    display: "flex",
    alignItems: "center",
    columnGap: 30,
    "& .stats-box": {
      width: 54,
    },
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
    changeFollowingStatus,
    changeMutedStatus,
    changeBlockedStatus,
    changeCommentStats,
    addLikedPost,
    removeLikedPost,
  },
);

export const CommentStatLine = connector(_CommentStatLine);

function _CommentStatLine(props) {
  const {
    scene,
    item,
    xStats,
    commentStats,
    changeCommentStats,
    addLikedPost,
    removeLikedPost,
    tooltip = "top",
    type,
    skin = "white",
  } = props;
  const isDetail = type === "comment-detail";
  const classes = useStyles({isDetail});
  const history = useHistory();
  const dispatch = useDispatch();

  const api = Global.GetPortal().getAppService();

  const posts = item._tp?.aux?.post;
  let commentId;
  if (!posts) {
    commentId = item.getId();
  } else {
    commentId = item.getPostId();
  }

  const loggedIn = !!api.getUserId();
  const detailLink = window.location.origin + api.getUrlCommentPage(commentId);

  const changeStats = (val) => {
    dispatch(changeCommentStats(val));
  };

  const {
    num_likes: likes = 0,
    num_comment: comments = 0,
    num_reposts: reposts = 0,
    likeStatus,
    repostStatus,
  } = commentStats[commentId] || {};

  const commentButton = (
    <span>
      <CommentPostButton
        count={comments}
        loggedIn={loggedIn}
        tooltip={tooltip}
        skin={skin}
        isPostDetail={isDetail}
      />
    </span>
  );

  return scene === "comment-composer" ? null : (
    <>
      {isDetail && (
        <>
          {comments + likes + reposts !== 0 && (
            <div className={classes.statsCounts}>
              {comments !== 0 && (
                <div className={classes.countItem}>
                  <span className={classes.countLabel}>
                    {formatLongNumber(comments)}
                  </span>{" "}
                  {t(
                    comments > 1
                      ? "getter_fe.post.button.replies"
                      : "getter_fe.post.button.reply",
                  )}
                </div>
              )}
              {likes !== 0 && (
                <div className={classes.countItem}>
                  <span className={classes.countLabel}>
                    {formatLongNumber(likes)}
                  </span>{" "}
                  {t(
                    likes > 1
                      ? "getter_fe.post.button.likes"
                      : "getter_fe.post.button.like",
                  )}
                </div>
              )}
              {reposts !== 0 && (
                <div className={classes.countItem}>
                  <span className={classes.countLabel}>
                    {formatLongNumber(reposts)}
                  </span>{" "}
                  {t(
                    reposts > 1
                      ? "getter_fe.post.button.reposts"
                      : "getter_fe.post.button.repost",
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      {isDetail ? (
        <div className={classes.statLine}>
          <CommentCommentComposer
            history={history}
            postId={commentId}
            item={item}
            isPopup={true}
            usermap={null}
            trigger={commentButton}
            handleStats={() => {
              xStats?.setCommentCount(comments + 1);
              changeStats({
                commentId,
                stats: {
                  num_comment: comments + 1,
                },
              });
            }}
          />
          <LikeButton
            isComment
            loggedIn={loggedIn}
            objId={commentId}
            item={item}
            count={likes}
            setLikedCount={(newCount) => {
              xStats?.setLikedCommentCount(newCount);
              changeStats({
                commentId,
                stats: {
                  likeStatus: newCount > likes ? "y" : "n",
                  num_likes: newCount,
                },
              });
            }}
            updateCommentLikeStatus={(newValue) => {
              newValue === "y"
                ? addLikedPost(commentId)
                : removeLikedPost(commentId);
            }}
            likeStatus={likeStatus}
            tooltip={tooltip}
            skin={skin}
            isPostDetail={isDetail}
          />
          <RepostButton
            loggedIn={loggedIn}
            objId={commentId}
            item={item}
            repostStatus={repostStatus}
            count={reposts}
            setRepostCount={(newCount) => {
              changeStats({commentId, stats: {num_reposts: newCount}});
            }}
            updateRepostStatus={(newValue) =>
              changeStats({commentId, stats: {repostStatus: newValue}})
            }
            tooltip={tooltip}
            skin={skin}
            isPostDetail={isDetail}
          />
          <ShareButton detailLink={detailLink} tooltip={tooltip} skin={skin} />
        </div>
      ) : (
        <div className={classes.statLine}>
          <div className={classes.mainStats}>
            <div className="stats-box">
              <CommentCommentComposer
                history={history}
                postId={commentId}
                item={item}
                isPopup={true}
                usermap={null}
                trigger={commentButton}
                handleStats={() => {
                  xStats?.setCommentCount(comments + 1);
                  changeStats({
                    commentId,
                    stats: {
                      num_comment: comments + 1,
                    },
                  });
                }}
              />
            </div>
            <div className="stats-box">
              <LikeButton
                isComment
                loggedIn={loggedIn}
                objId={commentId}
                item={item}
                count={likes}
                setLikedCount={(newCount) => {
                  xStats?.setLikedCommentCount(newCount);
                  changeStats({
                    commentId,
                    stats: {
                      likeStatus: newCount > likes ? "y" : "n",
                      num_likes: newCount,
                    },
                  });
                }}
                updateCommentLikeStatus={(newValue) => {
                  newValue === "y"
                    ? addLikedPost(commentId)
                    : removeLikedPost(commentId);
                }}
                likeStatus={likeStatus}
                tooltip={tooltip}
                skin={skin}
                isPostDetail={isDetail}
              />
            </div>
            <div className="stats-box">
              <RepostButton
                loggedIn={loggedIn}
                objId={commentId}
                item={item}
                repostStatus={repostStatus}
                count={reposts}
                setRepostCount={(newCount) => {
                  changeStats({commentId, stats: {num_reposts: newCount}});
                }}
                updateRepostStatus={(newValue) =>
                  changeStats({commentId, stats: {repostStatus: newValue}})
                }
                tooltip={tooltip}
                skin={skin}
                isPostDetail={isDetail}
              />
            </div>
          </div>
          <ShareButton detailLink={detailLink} tooltip={tooltip} skin={skin} />
        </div>
      )}
    </>
  );
}
