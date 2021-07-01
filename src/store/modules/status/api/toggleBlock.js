export const toggleBlock = async (
  {api, targetId, successCallback, errorCallback},
  {getState},
) => {
  const {status} = getState();
  const isBlocked = status.blocked[targetId];

  if (isBlocked) {
    api.unblockUser(targetId, (_, result) => {
      if (result === null) {
        errorCallback();
        return null;
      }
    });
  } else {
    api.blockUser(targetId, (_, result) => {
      if (result === null) {
        errorCallback();
        return null;
      }
    });
  }

  successCallback(isBlocked);
  return [!isBlocked, targetId];
};
