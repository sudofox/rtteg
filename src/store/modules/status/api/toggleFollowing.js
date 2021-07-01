export const toggleFollowing = async (
  {api, targetId, successCallback, errorCallback},
  {getState},
) => {
  const {status} = getState();
  const isFollowing = status.following[targetId];

  if (isFollowing) {
    api.unfollowUser(targetId, (_, result) => {
      if (result === null) {
        errorCallback();
        return null;
      }
    });
  } else {
    api.followUser(targetId, (_, result) => {
      if (result === null) {
        errorCallback();
        return null;
      }
    });
  }

  successCallback(isFollowing);
  return [!isFollowing, targetId];
};
