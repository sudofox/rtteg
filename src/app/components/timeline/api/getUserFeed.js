import {getLang} from "src/i18n/utils";
import {isResponseOk, parseTimelineFeed, parseUser} from "src/util/FeedUtils";
import GAxios from "src/util/GAxios";
import {timelineConstants} from "../_constants";

export const getUserFeed = (_, {getState}) => {
  const {auth, timelineNew} = getState();

  const {
    authenticated,
    userinfo: {username: userId},
  } = auth.session;
  const {offset} = timelineNew.userFeed;
  const lang = getLang();

  return new Promise((resolve, reject) => {
    if (authenticated) {
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/timeline`,
        params: {
          offset,
          max: timelineConstants.MAX_BATCH_SIZE,
          dir: timelineConstants.DIRECTION_FORWARD,
          incl: "posts|stats|userinfo|shared|liked",
        },
      };

      GAxios(
        config,
        (res) => {
          if (isResponseOk(res)) {
            const {
              aux,
              data: {list},
            } = res.data?.result ?? {};
            const {lks: likedPosts, removed, shrs: sharedPosts} = aux;
            const users = parseUser(aux);
            const posts = parseTimelineFeed(list, aux);

            return resolve({
              likedPosts,
              posts,
              removed,
              users,
              sharedPosts,
              offset: offset + timelineConstants.MAX_BATCH_SIZE,
            });
          }
        },
        (err) => {
          return reject({err});
        },
      );
    } else {
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/u/posts/trends`,
        params: {
          lang,
          offset,
          max: timelineConstants.MAX_BATCH_SIZE,
          incl: "posts|stats|userinfo|shared|liked",
        },
      };
      GAxios(
        config,
        (res) => {
          if (isResponseOk(res)) {
            const {
              aux,
              data: {list},
            } = res.data?.result ?? {};
            const {lks: likedPosts, removed, shrs: sharedPosts} = aux;
            const users = parseUser(aux);
            const posts = parseTimelineFeed(list, aux);

            return resolve({
              likedPosts,
              posts,
              removed,
              users,
              sharedPosts,
              offset: offset + timelineConstants.MAX_BATCH_SIZE,
            });
          }
        },
        (err) => {
          return reject({err});
        },
      );
    }
  });
};

export const oldGetUserFeed = async (data) => {
  if (!data) return;

  const {userId, offset, startTs, lang, authenticated, api} = data;

  let res;

  authenticated &&
    (await api.fetchUserPostsFeed(
      userId,
      offset,
      timelineConstants.MAX_BATCH_SIZE,
      startTs,
      timelineConstants.DIRECTION_FORWARD,
      (err, postFeed) => {
        if (err === null && postFeed) {
          const newFeed = postFeed.getXPostItems(true);
          const likedPosts = postFeed?.aux?.lks;
          const sharedPosts = postFeed?.aux?.shrs;
          const statsObj = newFeed[0]?._tp?.aux?.s_pst;
          const postStats = {};
          const nbrRemoved = postFeed?.aux?.removed;

          statsObj &&
            Object.keys(statsObj).forEach(
              (key) =>
                (postStats[key] = {
                  numLikes: parseInt(statsObj[key].lkbpst),
                  numComments: parseInt(statsObj[key].cm),
                  numShares: parseInt(statsObj[key].shbpst),
                }),
            );

          res = {
            posts: newFeed,
            offset: offset + timelineConstants.MAX_BATCH_SIZE,
            timestamp: startTs,
            sharedPosts: sharedPosts,
            likedPosts: likedPosts || [],
            postStats: postStats || [],
            nbrRemoved: nbrRemoved || 0,
          };
        } else {
          res = null;
        }
      },
    ));

  !authenticated &&
    (await api.getTrendsPostsFeed(
      null,
      offset,
      timelineConstants.MAX_BATCH_SIZE,
      startTs,
      lang,
      (err, postFeed) => {
        if (!err && postFeed) {
          const newFeed = postFeed.getXPostItems(true);
          const statsObj = newFeed[0]?._tp?.aux?.s_pst;
          const postStats = {};
          statsObj &&
            Object.keys(statsObj).forEach(
              (key) =>
                (postStats[key] = {
                  numLikes: parseInt(statsObj[key].lkbpst),
                  numComments: parseInt(statsObj[key].cm),
                  numShares: parseInt(statsObj[key].shbpst),
                }),
            );

          res = {
            posts: newFeed,
            offset: offset + timelineConstants.MAX_BATCH_SIZE,
            timestamp: startTs,
            postStats: postStats,
            likedPosts: [],
            sharedPosts: [],
            nbrRemoved: 0,
          };
        } else {
          res = null;
        }
      },
    ));

  return res;
};
