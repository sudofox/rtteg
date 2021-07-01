import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {Waypoint} from "react-waypoint";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {setPostStatus} from "src/app/components/timeline/store";
import {FeedItem} from "src/app/components/post/comps/FeedItem";
// import {CommentComposerNew} from "src/app/components/post/comps/CommentComposerNew";
// import {RepostComposerNew} from "src/app/components/post/comps/RepostComposerNew";
import {t} from "../../../i18n/utils";
import {PostComposer} from "src/app/components/post/comps/PostComposer";
import {GLoader} from "src/styles/components/GLoader";
import {GButton} from "src/styles/components/GButton";
import {connect} from "react-redux";
import GAxios from "src/util/GAxios";
import {
  isResponseOk,
  parsePinnedPostID,
  parsePost,
  parsePostFeed,
  parseUser,
  getUserName,
} from "src/util/FeedUtils";
import {ActivityLogProps} from "src/core/model/ModelConsts";

const MAX_BATCH_SIZE = 20;
const LOAD_MORE_CUTOFF_SIZE = 10;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    wrapper: {
      width: "100%",
    },
    noDataWrapper: {
      textAlign: "center",
      marginTop: 60,
      marginBottom: "32px",
    },
    btn: {
      borderRadius: "100px",
      padding: "11px 0",
      width: "120%",
      backgroundColor: "#232255 !important",
      "& span": {
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "28px",
        color: "white",
      },
    },
    noDataButton: {
      color: theme.palette.text.link,
      fontSize: "14px",
      lineHeight: "17px",
      fontWeight: "500",
      marginTop: theme.spacing(4),
      cursor: "pointer",
    },
    noDataTips: {
      fontSize: "18px",
      color: "#000",
      textAlign: "center",
      lineHeight: "21px",
      marginBottom: theme.spacing(1),
    },
    noDataSubtext: {
      fontSize: 16,
      textAlign: "center",
      color: theme.palette.text.gray,
    },
  }),
);

const getTranslationWithParam = (phrase, param) => t(phrase, param);

// fetch params for each feed view
// POST,REPLIES,MEDIAS,LIKES
const POST = "f_uo";
const REPLIES = "f_uc";
const MEDIAS = "f_um";
const LIKES = "f_ul";
const FETCH_PARAMS = [POST, REPLIES, MEDIAS, LIKES];
const EMPTY_OTHER_MESSAGES = [
  "getter_fe.profile.common.otherHasntPosted",
  "getter_fe.profile.common.otherHasntCommented",
  "getter_fe.profile.common.otherHasntPosted",
  "getter_fe.profile.common.otherHasntLiked",
];
const EMPTY_MYPROFILE_MESSAGES = [
  "getter_fe.profile.common.youHavetPosted",
  "getter_fe.profile.common.youHaventCommented",
  "getter_fe.profile.common.youNoPostMedia",
  "getter_fe.profile.common.youHaventLiked",
];

const connector = connect((state) => {
  return {
    loggedinUserId: state.auth?.session?.userinfo?._id,
    refreshProfileFeed: state.timelineNew.refreshProfileFeed,
  };
});

export const PostFeed = connector(_PostFeed);

function _PostFeed({
  index,
  isMyProfile,
  isClaimed,
  loggedinUserId,
  refreshProfileFeed,
  userId,
  userInfo,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [postData, setPostData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reachEnd, setReachEnd] = useState(false);
  const pinnedPostID = parsePinnedPostID(userInfo);

  const fetchFeed = () => {
    const config = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/posts`,
      params: {
        offset: offset,
        max: MAX_BATCH_SIZE,
        dir: "fwd",
        incl: "posts|stats|userinfo|shared|liked",
        fp: FETCH_PARAMS[index],
      },
    };

    GAxios(
      config,
      (res) => {
        if (isResponseOk(res)) {
          const list = res?.data?.result?.data?.list;
          const aux = res?.data?.result?.aux;
          const posts = parsePostFeed(list, aux);
          const users = parseUser(aux);

          setUserData({...(userData ?? {}), ...users});
          setPostData([...(postData ?? []), ...posts]);

          setLoading(false);
          if (
            Array.isArray(list) &&
            list.length + (aux.removed || 0) < MAX_BATCH_SIZE
          ) {
            setReachEnd(true);
          }

          dispatch(
            setPostStatus({
              likes: aux.lks,
              shares: aux.shrs,
            }),
          );
        }
      },
      () => {
        setLoading(false);
        setReachEnd(true);
      },
    );
  };

  const loadMore = () => {
    if (!loading && !reachEnd) {
      setLoading(true);
      setOffset(offset + MAX_BATCH_SIZE);
      fetchFeed(userId, offset);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if (refreshProfileFeed) {
      setOffset(0);
      setReachEnd(false);
      setPostData(null);
      setUserData(null);
    }
  }, [refreshProfileFeed]);

  const onPostSubmit = () => {};

  if (!loading && postData?.length <= 0 && !isMyProfile) {
    return (
      <div className={classes.noDataWrapper}>
        <h5 className={classes.noDataTips}>
          {getTranslationWithParam(EMPTY_OTHER_MESSAGES[index], {
            name: getUserName(userInfo.data),
          })}
        </h5>
        <p className={classes.noDataSubtext}>
          {t("getter_fe.profile.common.otherNoPostLikeOrCommentSubtext")}
        </p>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {!postData?.length && !loading ? (
        <div className={classes.noDataWrapper}>

          {isClaimed ? (
            <>
              {index === 0 && (
                <PostComposer
                  onSubmit={onPostSubmit}
                  trigger={
                    <GButton isBold variant="outlined" className={classes.btn}>
                      {t("getter_fe.profile.common.createAPostClaim")}
                    </GButton>
                  }
                  isPopup={true}
                />
              )}
            </>
          ) : null}

          {isMyProfile && !isClaimed ? (
            <>
              <h5 className={classes.noDataTips}>
                {t(EMPTY_MYPROFILE_MESSAGES[index])}
              </h5>
              <p className={classes.noDataSubtext}>
                {t("getter_fe.profile.common.youNoPostLikeOrCommentSubtext")}
              </p>
              {index === 0 && (
                <PostComposer
                  onSubmit={onPostSubmit}
                  trigger={
                    <div className={classes.noDataButton}>
                      {t("getter_fe.profile.common.createAPost")}
                    </div>
                  }
                  isPopup={true}
                />
              )}
            </>
          ) : null}
        </div>
      ) : null}
      {index === 0 ? <PinnedPostItem pinnedPostID={pinnedPostID} /> : null}
      {userData &&
        postData?.map((item, idx) => {
          const {uid, id, originUser, embedPost, embedUser} = item;

          if (pinnedPostID === id) {
            return null;
          }

          const user = uid ? userData[uid] : null;
          const originalUser = originUser ? userData[originUser] : null;
          const embededUser = embedUser ? userData[embedUser] : null;

          return (
            <div className={classes.wrapper}>
              <FeedItem
                key={id + uid + idx}
                scene="profile"
                item={item}
                user={user}
                originalUser={originalUser}
                embededPost={embedPost}
                embededUser={embededUser}
                loggedinUserId={loggedinUserId}
              />
              {(!reachEnd && postData.length - LOAD_MORE_CUTOFF_SIZE <= 0) ||
              (!reachEnd && idx === postData.length - LOAD_MORE_CUTOFF_SIZE) ? (
                <Waypoint
                  scrollableAncestor={window}
                  onEnter={() => loadMore()}
                />
              ) : null}
            </div>
          );
        })}

      {loading && (
        <GLoader
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        />
      )}
    </div>
  );
}

const PinnedPostItem = ({pinnedPostID}) => {
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!pinnedPostID) {
      return;
    }

    const fetchPinnedPost = () => {
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/u/post/${pinnedPostID}`,
        params: {
          incl: "poststats|userinfo",
        },
      };
      GAxios(config, (res) => {
        if (isResponseOk(res)) {
          const {aux, data} = res.data.result;

          setPost(parsePost(data, aux));
          setUserData(parseUser(aux));
        }
      });
    };

    fetchPinnedPost();
  }, [pinnedPostID]);

  if (post && userData) {
    const {uid, embedUser} = post;
    const user = uid ? userData[uid] : null;
    const embeddedUser = embedUser ? userData[embedUser] : null;

    const {embeddedPost} = post;

    return (
      <FeedItem
        scene="profile"
        item={post}
        embededPost={embeddedPost}
        embededUser={embeddedUser}
        user={user}
        isPinned
      />
    );
  }

  return null;
};
