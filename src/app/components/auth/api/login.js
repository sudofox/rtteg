import Util from "src/core/Util";
import {userConstants} from "../_constants";
// import XAuthInfo from "src/core/model/user/XAuthInfo";
import XUserInfo from "src/core/model/user/XUserInfo";
import GAxios from "src/util/GAxios";

export const login2 = async (params) => {
  const {pwd, username, token} = params;
  let content;
  if (username.indexOf("@") === -1) {
    content = {
      username: username.toLowerCase(),
      pwd: pwd,
      token: token,
    };
  } else {
    content = {
      email: username.toLowerCase(),
      pwd: pwd,
      token: token,
    };
  }
  const data = {
    content: content,
  };

  const config = {
    method: "post",
    url: userConstants.API_LOGIN_URL2,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  let loginData = {
    authenticated: false,
    userinfo: null,
  };

  await GAxios(
    config,
    (response) => {
      const data = response.data.result;
      console.info(data);

      loginData.authenticated = true;
      loginData.userinfo = data.user;
      XUserInfo.SetUserToken(loginData.userinfo, loginData.token);

      console.info(loginData);

      console.info(JSON.stringify(loginData));
      localStorage.setItem(
        userConstants.LS_SESSION_INFO,
        JSON.stringify(loginData),
      );

      this._setUserInfo(loginData.userinfo, rememberMe);
    },
    (err) => {
      console.error(err);
    },
  );

  return loginData;
};

export const login = async (params) => {
  if (!params) return;

  const {pwd, username, token, portal} = params;

  let userInfo = new XUserInfo();
  let loginData = {
    authenticated: false,
    userinfo: null,
  };

  await portal.login(userInfo, username, pwd, token, true, (err, res) => {
    if (err?.data?.emsg === "E_USER_SUSPENDED") {
      loginData.userinfo = "E_USER_SUSPENDED";
    } else {
      loginData.authenticated = !err;
      loginData.userinfo = res;

      localStorage.setItem(
        userConstants.LS_SESSION_INFO,
        JSON.stringify(loginData),
      );
    }
  });

  return loginData;
};
