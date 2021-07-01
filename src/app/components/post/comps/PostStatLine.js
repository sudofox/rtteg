import React, {useState, useEffect, memo} from "react";
import {connect, useDispatch} from "react-redux";
import {Box, makeStyles} from "@material-ui/core";
import {t} from "src/i18n/utils";
import {LikeButton} from "src/app/pages/post/LikeButton";
import {CommentPostButton} from "./CommentPostButtonNew";
import {RepostButton} from "./RepostButtonNew";
import classnames from "classnames";
import {formatLongNumber} from "src/util/NumberUtil";
import {ShareButton} from "src/app/pages/post/ShareButton";
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
import {
  setPopupComment,
  togglePopupComment,
  setPopupRepost,
  togglePopupRepost,
} from "src/app/components/post/store";
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
    "& svg": {
      transform: "scale(1.25)",
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
      "& .icon-white": {
        "& .count": {
          "&:not(.is-liked)": {
            color: "#fff",
          },
        },
        "& .icon": {
          "&:not(.is-liked)": {
            "& svg": {
              "& path": {
                fill: "#fff",
              },
            },
          },
        },
        "&:hover": {
          "& .count": {
            color: "#fff",
            "&.btn-like": {
              color: theme.palette.error.light,
            },
          },
          "& .icon": {
            backgroundColor: "rgba(255,255,255,.2)",
            "&:not(.btn-like)": {
              "& svg": {
                "& path": {
                  fill: theme.blue.light,
                  stroke: theme.palette.background.default,
                },
              },
            },
            "&.btn-like": {
              "& svg": {
                "& path": {
                  fill: theme.palette.error.light,
                  stroke: theme.palette.background.default,
                },
              },
            },
          },
        },
      },
      "& .icon-dark": {
        "& .count": {
          "&:not(.is-liked)": {
            color: theme.palette.primary.dark,
          },
        },
        "& .icon": {
          "&:not(.is-liked)": {
            "& svg": {
              "& path": {
                fill: theme.palette.primary.dark,
              },
            },
          },
        },
        "&:hover": {
          "& .count": {
            color: theme.palette.primary.dark,
            "&.btn-like": {
              color: theme.palette.error.light,
            },
          },
          "& .icon": {
            backgroundColor: "rgba(255,255,255,.2)",
            "&:not(.btn-like)": {
              "& svg": {
                "& path": {
                  fill: theme.blue.light,
                },
              },
            },
            "&.btn-like": {
              "& svg": {
                "& path": {
                  fill: theme.palette.error.light,
                },
              },
            },
          },
        },
      },
      "& .stats-box": {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: theme.palette.text.primary,
        fontSize: "13px",
        [theme.breakpoints.only("xs")]: {
          marginRight: "0px",
        },
        "& .post-feed-item-button": {
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

export const PostStatLine = connector(memo(_PostStatLine));

function _PostStatLine({
  item,
  type,
  // detailLink,
  sharedObj,
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
  user,
  originalUser,
  embededPost,
  embededUser,
  loggedinUserId,
}) {
  const dispatch = useDispatch();
  const [isUserListDialogOpen, setIsUserListDialogOpen] = useState(false);
  const [postDetailType, setPostDetailType] = useState(null); // 'like' | 'repost' | 'comment' | null

  const classes = useStyles({isImagePopup});

  const postId = item.id;
  const repostStatus = sharedPosts.includes(postId) ? "y" : "n";
  const isActive = repostStatus === "y";
  const isReply = item.type === "cmt";

  const detailLink =
    window.location.origin +
    "/" +
    (isReply ? "comment" : "post") +
    "/" +
    postId;

  useEffect(() => {
    if (!postStats[postId]) {
      const numLikes = Number(item.likes);
      const numShares = Number(item.reposts);
      const numComments = Number(item.comments);
      // fallback @TODO delete after all routes are using redux
      setPostCounts({postId, counts: {numLikes, numComments, numShares}});
    }
  }, [postId]);

  const {
    numLikes: likesCount,
    numComments: commentsCount,
    numShares: repostsCount,
  } = postStats[postId] ?? {};

  const openUserListDialog = (postDetailType) => {
    setPostDetailType(postDetailType);
    setIsUserListDialogOpen(true);
  };

  const handleComment = () => {
    let count = isNaN(commentsCount) ? 0 : commentsCount;
    dispatch(
      setPopupComment({
        popupDialogOpen: true,
        postId,
        item,
        sharedObj,
        user,
        originalUser,
        embededPost,
        embededUser,
        loggedinUserId,
        hideDropdown,
        handleStats: () => updatePostCommentCount({postId, count: count + 1}),
        toggleOpen: (open) => dispatch(togglePopupComment(open)),
      }),
    );
  };
  const handleRepost = () => {
    dispatch(
      setPopupRepost({
        popupDialogOpen: true,
        postId,
        item,
        sharedObj,
        user,
        originalUser,
        embededPost,
        embededUser,
        loggedinUserId,
        hideDropdown,
        toggleOpen: (open) => dispatch(togglePopupRepost(open)),
        propOnSubmit: (isQuoted) => {
          !isQuoted && addSharedPost(postId);
          !isActive &&
            updatePostRepostCount({postId, count: Number(repostsCount) + 1});
        },
        alreadyReposted: isActive,
      }),
    );
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
          {commentsCount + likesCount + repostsCount !== 0 && (
            <div className={classes.statsCounts}>
              {commentsCount !== 0 && (
                <div className={classes.countItem}>
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
              {likesCount !== 0 && (
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
              {repostsCount !== 0 && (
                <div
                  className={clsx(
                    classes.countItem,
                    authenticated && "clickable",
                  )}
                  onClick={() => authenticated && openUserListDialog("repost")}
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
        <CommentPostButton
          isPostDetail={type === "post-detail"}
          count={commentsCount}
          loggedIn={authenticated}
          tooltip={tooltip}
          skin={skin}
          handlePopup={handleComment}
        />
        <LikeButton
          isPostDetail={type === "post-detail"}
          isComment={isReply}
          objId={postId}
          count={likesCount}
          likeStatus={likedPosts.includes(postId) ? "y" : "n"}
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
          handlePopup={handleRepost}
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
