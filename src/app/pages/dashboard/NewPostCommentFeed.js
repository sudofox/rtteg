import {makeStyles} from "@material-ui/core";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Waypoint} from "react-waypoint";
import {CommentComposerNew} from "src/app/components/post/comps/CommentComposerNew";
import {FeedItem} from "src/app/components/post/comps/FeedItem";
import {RepostComposerNew} from "src/app/components/post/comps/RepostComposerNew";
import {
  addLikedPost,
  addSharedPost,
  updatePostCommentCount,
} from "src/app/components/timeline/store";
import {timelineConstants} from "src/app/components/timeline/_constants";
import {t} from "src/i18n/utils";
import {changeCommentStats} from "src/store/modules/status";
import {GLoader} from "src/styles/components/GLoader";
import eventBus from "src/util/EventUtils";
import {isResponseOk, parseCommentFeed, parseUser} from "src/util/FeedUtils";
import GAxios from "src/util/GAxios";

const useStyles = makeStyles((theme) => ({
  noMoreComment: {
    padding: theme.spacing(4, 0),
    color: theme.palette.text.gray,
    textAlign: "center",
  },
}));

export const NewPostCommentFeed = ({id}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {postStats} = useSelector((state) => state.timelineNew.userFeed);
  const {commentStats} = useSelector((state) => state.status);
  const [pageNumber, setPageNumber] = useState(0);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState({});
  const offset = timelineConstants.MAX_BATCH_SIZE * pageNumber;
  const reachedEnd = offset + timelineConstants.MAX_BATCH_SIZE > items?.length;

  useEffect(() => {
    const fetchCommentFeed = () => {
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/u/post/${id}/comments`,
        params: {
          offset,
          max: timelineConstants.MAX_BATCH_SIZE,
          dir: timelineConstants.DIRECTION_REVERSED,
          incl: "posts|stats|userinfo|shared|liked",
        },
      };
      GAxios(
        config,
        (res) => {
          if (isResponseOk(res)) {
            const list = res?.data?.result?.data?.list;
            const aux = res?.data?.result?.aux;

            const postsData = parseCommentFeed(list, aux);
            const usersData = parseUser(aux);
            setItems([...postsData, ...(items ?? [])]);
            setUsers({...users, ...(usersData ?? {})});

            if (Array.isArray(aux.lks)) {
              aux.lks.forEach((id) => dispatch(addLikedPost(id)));
            }
            if (Array.isArray(aux.shrs)) {
              aux.shrs.forEach((id) => dispatch(addSharedPost(id)));
            }
          }
        },
        () => setItems([]), // empty array if error,
      );
    };
    fetchCommentFeed();
  }, [id, pageNumber]);

  const deleteComment = useCallback(
    (commentId) => {
      setItems(items.filter(({id}) => id !== commentId));

      const commentCount = postStats[id]?.numComments;
      const commentCommentCount = commentStats[id]?.num_comment;

      if (commentCount) {
        dispatch(
          updatePostCommentCount({
            postId: id,
            count: commentCount - 1,
          }),
        );
      } else if (commentCommentCount) {
        // backend is does not decrement comment count so this only happens on front-end
        dispatch(
          changeCommentStats({
            commentId: id,
            stats: {
              num_comment: commentCommentCount - 1,
            },
          }),
        );
      }
    },
    [id, items, setItems, postStats],
  );

  useEffect(() => {
    eventBus.remove("commentPublish_" + id);
    eventBus.on("commentPublish_" + id, (newFeed) => {
      const {result, userFeed} = newFeed;
      setUsers({...users, ...userFeed});
      const {
        acl,
        pid,
        puid: originUser,
        udate,
        _id: id,
        _t: type,
        ...rest
      } = result.data;
      const data = {
        id,
        type,
        originUser,
        comments: 0,
        likes: 0,
        replies: 0,
        ...rest,
      };

      setItems([data, ...(items ?? [])]);
    });
    return eventBus.remove("commentPublish_" + id);
  }, [id, items, users]);

  if (items === null) {
    return (
      <GLoader
        wrapperStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: 600,
          height: `calc(100vh - 552px)`,
        }}
      />
    );
  }

  return (
    <>
      {items.map((item) => {
        const {originUser, uid} = item;
        const user = uid ? users[uid] : null;
        const originalUser = originUser ? users[originUser] : null;

        return (
          <FeedItem
            item={item}
            originalUser={originalUser}
            user={user}
            scene="comment-feed"
            deleteItem={deleteComment}
          />
        );
      })}
      {!reachedEnd && items ? (
        <Waypoint
          scrollableAncestor={window}
          onEnter={() => setPageNumber((oldPageNumber) => oldPageNumber + 1)}
          topOffset={3000}
        />
      ) : null}
      {reachedEnd && items?.length ? (
        <div className={classes.noMoreComment}>
          {t("getter_fe.post.text.noMoreComments")}
        </div>
      ) : null}
      <CommentComposerNew isPopup />
      <RepostComposerNew isPopup />
    </>
  );
};
