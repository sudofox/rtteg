import API from "src/core/API";

export const fetchUserComments = async (data) => {
  if (!data) return;

  const {userId, offset, maxBatchSize, api} = data;

  let res = null;

  await api.fetchUserPosts(
    userId,
    offset * maxBatchSize,
    maxBatchSize,
    Date.now(),
    API.DIRECTION_FORWARD,
    (err, commentFeed) => {
      if (err === null && commentFeed) {
        const newFeed = commentFeed.getXPostItems(true);
        const likedComments = commentFeed.aux.lks;
        const sharedComments = commentFeed.aux.shrs;
        const nbrRemoved = commentFeed.aux.removed || 0;

        res = {
          posts: newFeed,
          likedComments: likedComments,
          sharedComments: sharedComments,
          nbrRemoved,
        };
      } else {
        res = null;
      }
    },
    "c", // c for comments
  );
  return res;
};
