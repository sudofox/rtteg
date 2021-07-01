import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {Box, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {t} from "../../../i18n/utils";
import {CommentComposer} from "src/app/components/post/comps/CommentComposer";
import {LikeButton} from "../post/LikeButton";
import {RepostButton} from "../post/RepostButton";
import {CommentPostButton} from "../post/CommentPostButton";
import classnames from "classnames";
import {formatLongNumber} from "src/util/NumberUtil";
import {ShareButton} from "../post/ShareButton";
import ModelType from "src/core/model/ModelConsts";
import Global from "src/system/Global";
import {
  addLikedPost,
  addSharedPost,
  removeLikedPost,
  removeSharedPost,
  setPostCounts,
  updatePostCommentCount,
  updatePostLikedCount,
  updatePostRepostCount,
} from "src/app/components/timeline/store";
import {UserListDialog} from "src/app/components/UserListDialog";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  stats: {
    display: "flex",
    flexDirection: " column",
    marginTop: 6,
    "&.post-detail": {
      marginTop: 0,
      marginLeft: 0,
      marginBottom: -13, // remove padding from feedItemMain
    },
    "&.comment-detail": {
      marginLeft: 0,
    },
  },
  detailStats: {
    margin: "0 17px",
  },
  detailLine: {
    padding: 12,
    [theme.breakpoints.only("xs")]: {
      paddingBottom: "70px",
    },
  },
  statsCounts: {
    fontSize: 16,
    color: theme.palette.text.gray,
    padding: "15px 0",
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
    display: "flex",
  },
  countItem: {
    marginRight: 25,
    "&.clickable": {
      cursor: "pointer",
    },
  },
  countLabel: {
    fontWeight: "700",
    color: theme.palette.text.primary,
  },
  commentStats: {
    padding: "0 !important",
  },
  statsLine: {
    "&.stats-line": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      margin: "0px -9px",
      justifyContent: "space-between",
      [theme.breakpoints.only("xs")]: {
        width: "100%",
      },
      "& .stats-box": {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: theme.palette.text.primary,
        fontSize: "13px",
        "& .post-feed-item-button": {
          position: "absolute",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "& .icon": {
            position: "relative",
            top: "1px",
            alignSelf: "center",
            fontSize: "30px",
            "& svg": {
              transform: ({isImagePopup}) =>
                isImagePopup ? "scale(1.2)" : null,
              position: "relative",
            },
          },
          "& .text": {
            marginLeft: 4,
            display: "flex",
            fontSize: "13px",
            color: theme.palette.text.composer,
            wordBreak: "normal",
            "& .count": {
              paddingRight: "4px",
            },
          },
        },
        "&.comment": {
          position: "relative",
          top: "2px",
          // marginRight: "auto",
          fontSize: "12px",
          "& .count": {
            paddingRight: "5px",
          },
        },
      },
      "& .like-post-button": {
        "&.active svg": {
          marginTop: "-4px",
        },
      },
      "& div[class*='menuButton']": {
        "& svg": {
          marginTop: "1px",
          marginLeft: "1px",
        },
      },
    },
  },
  commentPostContainer: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
  },
  loading: {
    textAlign: "center",
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
      authenticated: state.auth?.session?.authenticated,
      likedPosts: state.timelineNew.userFeed.likedPosts,
      sharedPosts: state.timelineNew.userFeed.sharedPosts,
      postStats: state.timelineNew.userFeed.postStats,
    };
  },
  {
    updatePostCommentCount,
    updatePostRepostCount,
    updatePostLikedCount,
    removeLikedPost,
    removeSharedPost,
    setPostCounts,
    addLikedPost,
    addSharedPost,
  },
);

export const PostStatLine = connector(_PostStatLine);

function _PostStatLine({
  postId,
  item,
  type,
  detailLink,
  sharedObj,
  scene,
  tooltip,
  likedPosts,
  sharedPosts,
  authenticated,
  isImagePopup,
  hideDropdown,
  postStats,
  updatePostCommentCount,
  updatePostRepostCount,
  updatePostLikedCount,
  setPostCounts,
  addLikedPost,
  addSharedPost,
  removeLikedPost,
  removeSharedPost,
  skin,
  removePostFromProfile,
  isPinnedPost,
}) {
  const [loading, setLoading] = useState(false);
  const [isUserListDialogOpen, setIsUserListDialogOpen] = useState(false);
  const [postDetailType, setPostDetailType] = useState(null); // 'like' | 'repost' | 'comment' | null
  const history = useHistory();
  const classes = useStyles({isImagePopup});
  const POST_PAGE_VIEW = "post-page-view";

  const api = Global.GetPortal().getAppService();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await api.userLikePostStatus(postId);

        if (res === "y") {
          addLikedPost(postId);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchRepostStatus = async () => {
      try {
        const res = await api.userSharePostStatus(postId);

        if (res === "y") {
          addSharedPost(postId);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (!postStats[postId]) {
      const stats =
        type === "post-detail" || type === "comment-detail" || isPinnedPost
          ? item.getAuxDataXField(ModelType.POST_STATS)
          : item.getPostStats();

      const numLikes = stats?.getLikedPostCount
        ? stats?.getLikedPostCount(0)
        : 0;
      const numShares = stats?.getSharedPostCount
        ? stats?.getSharedPostCount(0)
        : 0;
      const numComments = stats?.getCommentCount
        ? stats?.getCommentCount(0)
        : 0;
      // fallback @TODO delete after all routes are using redux
      setPostCounts({postId, counts: {numLikes, numComments, numShares}});
    }

    if (
      (scene === POST_PAGE_VIEW && !postStats[postId] && authenticated) ||
      isPinnedPost
    ) {
      (async () => {
        setLoading(true);
        await fetchLikeStatus();
        await fetchRepostStatus();
        setLoading(false);
      })();
    }
  }, [postId]);

  let {
    numLikes: likesCount,
    numComments: commentsCount,
    numShares: repostsCount,
  } = postStats[postId] ?? {};

  likesCount = isNaN(likesCount) ? 0 : likesCount;
  commentsCount = isNaN(commentsCount) ? 0 : commentsCount;
  repostsCount = isNaN(repostsCount) ? 0 : repostsCount;

  const commentButton = (
    <div className={classes.commentPostContainer}>
      <CommentPostButton
        isPostDetail={type === "post-detail"}
        count={commentsCount}
        loggedIn={authenticated}
        tooltip={tooltip}
        skin={skin}
      />
    </div>
  );

  const openUserListDialog = (postDetailType) => {
    setPostDetailType(postDetailType);
    setIsUserListDialogOpen(true);
  };

  return (
    <div
      className={classnames(classes.stats, type)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {type === "post-detail" && (
        <>
          {!isNaN(likesCount + repostsCount) &&
            likesCount + repostsCount !== 0 && (
              <div className={classes.statsCounts}>
                {commentsCount !== 0 && (
                  <div style={{display: "none"}} className={classes.countItem}>
                    <span className={classes.countLabel}>
                      {formatLongNumber(commentsCount)}
                    </span>{" "}
                    {t(
                      commentsCount > 1
                        ? "getter_fe.post.button.replies"
                        : "getter_fe.post.button.reply",
                    )}
                  </div>
                )}
                {!isNaN(likesCount) && likesCount !== 0 && (
                  <div
                    className={clsx(
                      classes.countItem,
                      authenticated && "clickable",
                    )}
                    onClick={() => authenticated && openUserListDialog("like")}
                  >
                    <span className={classes.countLabel}>
                      {formatLongNumber(likesCount)}
                    </span>{" "}
                    {t(
                      likesCount > 1
                        ? "getter_fe.post.button.likes"
                        : "getter_fe.post.button.like",
                    )}
                  </div>
                )}
                {!isNaN(repostsCount) && repostsCount !== 0 && (
                  <div
                    className={clsx(
                      classes.countItem,
                      authenticated && "clickable",
                    )}
                    onClick={() =>
                      authenticated && openUserListDialog("repost")
                    }
                  >
                    <span className={classes.countLabel}>
                      {formatLongNumber(repostsCount)}
                    </span>{" "}
                    {t(
                      repostsCount > 1
                        ? "getter_fe.post.button.reposts"
                        : "getter_fe.post.button.repost",
                    )}
                  </div>
                )}
              </div>
            )}
          <UserListDialog
            postId={postId}
            postDetailType={postDetailType}
            isOpen={isUserListDialogOpen}
            handleClose={() => setIsUserListDialogOpen(false)}
          />
        </>
      )}
      <StatContainer type={type} classes={classes}>
        <CommentComposer
          history={history}
          postId={postId}
          item={item}
          isPopup={true}
          trigger={commentButton}
          sharedObj={sharedObj}
          handleStats={() => {
            updatePostCommentCount({postId, count: commentsCount + 1});
          }}
          hideDropdown={hideDropdown}
        />
        <LikeButton
          isPostDetail={type === "post-detail"}
          objId={postId}
          count={likesCount}
          likeStatus={likedPosts.includes(postId) ? "y" : "n"}
          loading={loading}
          loggedIn={authenticated}
          tooltip={tooltip}
          setLikedCount={(newCount) => {
            updatePostLikedCount({postId, count: newCount});
          }}
          updateLikeStatus={(newValue) => {
            newValue === "y" ? addLikedPost(postId) : removeLikedPost(postId);
          }}
          hideDropdown={hideDropdown}
          skin={skin}
        />
        <RepostButton
          isPostDetail={type === "post-detail"}
          objId={postId}
          item={item}
          count={repostsCount}
          type={type}
          loading={loading}
          loggedIn={authenticated}
          tooltip={tooltip}
          repostStatus={sharedPosts.includes(postId) ? "y" : "n"}
          setRepostCount={(newCount) => {
            updatePostRepostCount({postId, count: newCount});
          }}
          updateRepostStatus={(newValue) => {
            newValue === "y" ? addSharedPost(postId) : removeSharedPost(postId);
          }}
          hideDropdown={hideDropdown}
          skin={skin}
          removePostFromProfile={removePostFromProfile}
        />
        <ShareButton
          detailLink={detailLink}
          tooltip={tooltip}
          isImagePopup={isImagePopup}
          skin={skin}
        />
      </StatContainer>
    </div>
  );
}

const StatContainer = ({children, type, classes}) => {
  if (type === "post-detail") {
    return (
      <Box
        display="flex"
        justifyContent="space-around"
        className={classes.detailLine}
      >
        {children}
      </Box>
    );
  } else {
    return (
      <div
        className={classnames(
          type === "comment-detail" && classes.commentStats,
          "stats-line",
          classes.statsLine,
        )}
      >
        <div className={classes.mainStats}>
          {children.map((child, idx) => {
            if (idx < 3)
              return (
                <div key={idx} className="stats-box">
                  {child}
                </div>
              );
          })}
        </div>
        <div className="stats-box">{children[3]}</div>
      </div>
    );
  }
};
