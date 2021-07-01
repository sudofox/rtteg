import {userConstants} from "../_constants";
import XUserInfo from "src/core/model/user/XUserInfo";

export const signup = async (params) => {
  if (!params) return;
  const {pwd, username, lang, email, code, token, portal} = params;

  let userInfo = new XUserInfo();
  let loginData = {
    authenticated: false,
    userinfo: null,
    err: null,
  };

  await portal.signup(
    userInfo,
    username,
    pwd,
    lang,
    email,
    code,
    token,
    true,
    (err, res) => {
      loginData.authenticated = !err;
      loginData.userinfo = res;
      loginData.err = err?.data?.emsg;

      localStorage.setItem(
        userConstants.LS_SESSION_INFO,
        JSON.stringify(loginData),
      );
    },
  );

  return loginData;
};
