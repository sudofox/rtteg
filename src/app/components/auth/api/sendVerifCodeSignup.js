import GAxios from "src/util/GAxios";
import {toast} from "react-toastify";
import AppConst from "src/app/AppConsts";
import {userConstants} from "../_constants";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {t} from "src/i18n/utils";

export const sendVerifCodeSignup = async (params) => {
  const {username, email, password, token} = params;

  if (!username || !email || !password) return;

  const data = JSON.stringify({
    content: {
      email: email.toLowerCase(),
      lang: "en", // [TODO]: will be replace when the current lang will be available in the Redux Store.
      reqtype: userConstants.VERIF_CODE_REQ_TYPE_SIGNUP,
      token: token,
    },
  });

  const config = {
    method: "post",
    url: userConstants.API_SEND_VERIF_CODE,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  let res;

  await GAxios(
    config,
    (response) => {
      if (response && response.data.result.success) {
        res = params;
      } else {
        res = null;
      }
    },
    (err) => {
      if (err?.response?.status === 400) {
        toast(
          <NotifMessage
            message={
              err?.response?.data?.error?.emsg === "Invalid email address."
                ? t("getter_fe.auth.errors.emailInvalid")
                : t("getter_fe.auth.errors.signupShutDown")
            }
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: AppConst.NOTIF_MESSAGE_ERROR,
          },
        );
      }
      res = null;
    },
  );

  return res;
};
