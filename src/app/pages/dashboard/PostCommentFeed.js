import React, {useState, useEffect, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Waypoint} from "react-waypoint";
import API from "../../../core/API";
import {GLoader} from "src/styles/components/GLoader";
import {CommentFeedItem} from "src/app/components/post/comps/CommentFeedItem";
import eventBus from "src/util/EventUtils";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {t} from "../../../i18n/utils";
import {changeCommentStats} from "src/store/modules/status";
import {updatePostCommentCount} from "src/app/components/timeline/store";
import Global from "src/system/Global";

const MAX_BATCH_SIZE = 20;
const LOAD_MORE_CUTOFF_SIZE = 10;

const useStyles = makeStyles((theme) =>
  createStyles({
    postCommentFeedContainer: {},
    noMoreComment: {
      padding: theme.spacing(4, 0),
      color: theme.palette.text.gray,
      textAlign: "center",
    },
  }),
);

export const PostCommentFeed = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {postStats} = useSelector((state) => state.timelineNew.userFeed);
  const {commentStats} = useSelector((state) => state.status);
  const [offset, setOffset] = useState(0);
  const [startTs, setStartTs] = useState(null);
  const [userList, setUserList] = useState(null);
  const [commentList, setCommentList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reachEnd, setReachEnd] = useState(false);

  const api = Global.GetPortal().getAppService();

  const loadMore = (refresh = false) => {
    setIsLoading(true);
    api.fetchComments(
      props.postId,
      refresh ? 0 : offset,
      MAX_BATCH_SIZE,
      startTs,
      API.DIRECTION_REVERSE,
      (err, commentFeed) => {
        if (err == null && commentFeed) {
          const newFeed = commentFeed.getXComments(true);
          const newUserFeed = commentFeed.getXUserInfoMap() || {};
          if (!refresh && commentList) {
            setCommentList([...commentList, ...newFeed]);
          } else {
            setCommentList(newFeed);
          }
          if (!refresh && userList) {
            setUserList({...userList, ...newUserFeed});
          } else {
            setUserList(newUserFeed);
          }
          if (!newFeed || newFeed.length < MAX_BATCH_SIZE) {
            setReachEnd(true);
          }
          setIsLoading(false);
        }
      },
    );
    setOffset(offset + MAX_BATCH_SIZE);
  };

  useEffect(() => {
    if (!reachEnd) {
      setStartTs(Date.now());
    }
  }, [reachEnd]);

  useEffect(() => {
    setReachEnd(false);
  }, [props.postId]);

  useEffect(() => {
    if (startTs) {
      loadMore(true);
    }
  }, [startTs]);

  const loadNew = useCallback(
    (newFeed) => {
      let comment = newFeed.result;
      let user = newFeed.userFeed;

      if (commentList) {
        setCommentList([comment, ...commentList]);
      } else {
        setCommentList([comment]);
      }
      if (userList) {
        setUserList({...user, ...userList});
      } else {
        setUserList(user);
      }
    },
    [commentList, userList],
  );

  const deleteComment = (commentId) => {
    const newComments = commentList.filter(
      (item) => item.getId() !== commentId,
    );
    setCommentList(newComments);

    const commentCount = postStats[props.postId]?.numComments;
    const commentCommentCount = commentStats[props.postId]?.num_comment;

    if (commentCount) {
      dispatch(
        updatePostCommentCount({
          postId: props.postId,
          count: commentCount - 1,
        }),
      );
    } else if (commentCommentCount) {
      // backend is does not decrement comment count so this only happens on front-end
      dispatch(
        changeCommentStats({
          commentId: props.postId,
          stats: {
            num_comment: commentCommentCount - 1,
          },
        }),
      );
    }
  };

  useEffect(() => {
    if (startTs) {
      loadMore(true);
      setReachEnd(false);
    }
  }, [props.postId]);

  useEffect(() => {
    eventBus.remove("commentPublish_" + props.postId);
    eventBus.on("commentPublish_" + props.postId, loadNew);
    return eventBus.remove("commentPublish_" + props.postId);
  }, [props.postId, loadNew]);

  if (isLoading && !commentList?.length) {
    const headerHeight = 0; // theme.mixins.header.height;
    const othersHeight = 552; // 56px(columnHeader) - 496px(userProfileDetail)
    const wrapperStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      maxHeight: 600,
      height: `calc(100vh - ${headerHeight + othersHeight}px)`, // handle if the screen height is small
    };

    return <GLoader wrapperStyle={wrapperStyle} />;
  }

  return (
    <div className={classes.postCommentFeedContainer}>
      {commentList && commentList.length > 0
        ? commentList.map((item, index) => {
            let commentId = item.getId();
            // let commentStats = item.getCommentStats();

            return (
              <>
                <CommentFeedItem
                  key={index}
                  key={commentId}
                  comment={item}
                  // stats={commentStats}
                  usermap={userList}
                  postOwner={
                    props.posterInfo?.getUserId && props.posterInfo?.getUserId()
                  }
                  postPosterInfo={props.posterInfo}
                  deleteComment={deleteComment}
                />
                {index === commentList.length - LOAD_MORE_CUTOFF_SIZE &&
                !reachEnd ? (
                  <Waypoint
                    scrollableAncestor={window}
                    onEnter={() => loadMore()}
                  />
                ) : null}
              </>
            );
          })
        : null}

      {commentList && commentList.length % MAX_BATCH_SIZE !== 0 && (
        <div className={classes.noMoreComment}>
          {t("getter_fe.post.text.noMoreComments")}
        </div>
      )}
    </div>
  );
};

export default PostCommentFeed;
