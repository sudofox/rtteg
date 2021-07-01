import GAxios from "src/util/GAxios";
import {userConstants} from "../_constants";

export const sendVerifCode = async (data) => {
  if (!data.email) return;
  const content = JSON.stringify({
    content: {
      token: data.token,
      email: data.email.toLowerCase(),
      lang: "en", // [TODO]: will be replace when the current lang will be available in the Redux Store.
      reqtype: userConstants.SEND_VERIF_CODE_REQ_TYPE,
    },
  });

  const config = {
    method: "post",
    url: userConstants.API_SEND_VERIF_CODE,
    headers: {
      "Content-Type": "application/json",
    },
    data: content,
  };

  let res = null;

  await GAxios(
    config,
    (response) => {
      if (response && response.data.result.success) {
        res = data.email;
      } else {
        res = null;
      }
    },
    () => {
      res = null;
    },
  );

  return res;
};
