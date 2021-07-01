import {userConstants} from "../_constants";
import XUserInfo from "src/core/model/user/XUserInfo";

export const claimSignup = async (params) => {
  if (!params) return;
  const {username, pwd, url, lang, email, portal, callback} = params;

  let userInfo = new XUserInfo();
  let loginData = {
    authenticated: false,
    userinfo: null,
  };

  await portal.claimSignup(
    userInfo,
    url,
    username,
    pwd,
    lang,
    email,
    true,
    (err, res) => {
      loginData.authenticated = !err;
      loginData.userinfo = res;

      localStorage.setItem(
        userConstants.LS_SESSION_INFO,
        JSON.stringify(loginData),
      );
      callback(err, res);
    },
  );

  return loginData;
};
