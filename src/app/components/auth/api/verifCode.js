import GAxios from "src/util/GAxios";
import {userConstants} from "../_constants";

export const verifCode = async (params) => {
  const email = params.data.email;
  const code = params.data.code;
  const token = params.data.token;

  if (!code || !email) return;

  if (params.type !== userConstants.VERIF_CODE_TYPE_F_PWD) return code;

  const reqType =
    params.type === userConstants.VERIF_CODE_TYPE_F_PWD
      ? userConstants.VERIF_CODE_REQ_TYPE
      : userConstants.VERIF_CODE_REQ_TYPE_SIGNUP;

  const data = JSON.stringify({
    content: {
      email: email,
      verifycode: code,
      reqtype: reqType,
      token: token,
    },
  });

  const config = {
    method: "post",
    url: userConstants.API_VERIF_CODE,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  let res = false;

  await GAxios(config, (response) => {
    if (response && response.data.result.success) {
      res = code;
    } else {
      res = false;
    }
  });

  return res;
};
