import {userConstants} from "../_constants";

export const loginRefresh = async () => {
  const userInfo = JSON.parse(
    localStorage.getItem(userConstants.LS_SESSION_INFO),
  );

  return userInfo;
};
