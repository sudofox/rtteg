export const toggleMute = async (
  {api, targetId, successCallback, errorCallback},
  {getState},
) => {
  const {status} = getState();
  const isMuted = status.muted[targetId];

  if (isMuted) {
    api.unmuteUser(targetId, (_, result) => {
      if (result === null) {
        errorCallback();
        return null;
      }
    });
  } else {
    api.muteUser(targetId, (_, result) => {
      if (result === null) {
        errorCallback();
        return null;
      }
    });
  }

  successCallback(isMuted);
  return [!isMuted, targetId];
};
