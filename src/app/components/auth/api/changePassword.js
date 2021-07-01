import GAxios from "src/util/GAxios";
import {userConstants} from "../_constants";

export const changePassword = async (params) => {
  const email = params.email;
  const code = params.code;
  const newPwd = params.newPwd;
  const token = params.token;

  if (!newPwd || !email || !code || !token) {
    return;
  }

  const data = JSON.stringify({
    content: {
      email: email,
      password: newPwd,
      verifycode: code,
      token,
    },
  });

  const config = {
    method: "post",
    url: userConstants.API_CHANGE_PWD,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  let res = false;

  await GAxios(config, (response) => {
    if (response && response.data.result.success) {
      res = true;
    } else {
      res = false;
    }
  });

  return res;
};
