import {makeStyles} from "@material-ui/core";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Waypoint} from "react-waypoint";
import {t} from "src/i18n/utils";
import {GLoader} from "src/styles/components/GLoader";
import {scrollHelper} from "src/util/scrollUtils";
import {CommentComposerNew} from "../../post/comps/CommentComposerNew";
import {FeedItem} from "../../post/comps/FeedItem";
import {RepostComposerNew} from "../../post/comps/RepostComposerNew";
import {timelineConstants} from "../_constants";

import {getUserFeed} from "../store";

const useStyles = makeStyles((theme) => ({
  noDataTips: {
    padding: "50px 0",
    textAlign: "center",
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000",
    marginBottom: theme.spacing(1),
  },
  endTips: {
    display: "block",
    textAlign: "center",
    color: theme.palette.primary.light,
    padding: "40px 0",
    fontSize: 16,
    lineHeight: "19px",
    fontWeight: "bold",
    "&:before,&:after": {
      content: "' '",
      display: "inline-block",
      height: 0,
      width: 100,
      borderTop: `1px solid ${theme.palette.primary.light}`,
      verticalAlign: "super",
    },
    "& span": {
      padding: "0 20px",
    },
  },
}));

export const NewUserFeed = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {data, offset, isLoading, reachEnd, users} = useSelector(
    (state) => state.timelineNew?.userFeed ?? initialState,
  );
  const authData = useSelector((state) => state.auth?.session?.userinfo);
  const loggedinUserId = authData?.username;
  useEffect(() => {
    scrollHelper.scrollToAndForget("post-timeline");
  }, []);

  useEffect(() => {
    if (data.length === 0 && offset === 0) {
      dispatch(getUserFeed(null));
    }
  }, [offset]);

  if (isLoading && data.length === 0) {
    return (
      <GLoader
        wrapperStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      />
    );
  }

  return (
    <>
      {data.map((post, idx) => {
        const {uid, id, originUser, embedId, embedPost, embedUser, index} = post;

        const user = uid ? users[uid] : null;
        const originalUser = originUser ? users[originUser] : null;
        const embededUser = embedUser ? users[embedUser] : null;
        const embededPost = embedId
          ? data.filter(({id}) => id === embedId[0])[0]
          : embedPost;

        return (
          <>
            <FeedItem
              key={id + uid}
              scene="timeline"
              item={post}
              user={user}
              originalUser={originalUser}
              embededPost={embededPost}
              embededUser={embededUser}
              loggedinUserId={loggedinUserId}
            />
            {idx === data.length - timelineConstants.LOAD_MORE_CUTOFF_SIZE &&
            !reachEnd ? (
              <Waypoint
                scrollableAncestor={window}
                onEnter={() => dispatch(getUserFeed(null))}
              />
            ) : null}

            {reachEnd && data.length > 0 && index === data[data.length - 1].index && (
              <div className={classes.endTips}>
                <span>{t("getter_fe.post.tips.end")}</span>
              </div>
            )}
          </>
        );
      })}
      {data.length === 0 ? (
        <h5 className={classes.noDataTips}>
          {t("getter_fe.post.tips.no_post_yet")}
        </h5>
      ) : null}
      {isLoading && (
        <GLoader
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        />
      )}
      <CommentComposerNew isPopup />
      <RepostComposerNew isPopup />
    </>
  );
};
