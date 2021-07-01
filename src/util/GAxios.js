import {userConstants} from "src/app/components/auth/_constants";
import axios from "axios";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {t} from "src/i18n/utils";
import AppConsts from "src/app/AppConsts";
import {SYS_NETERR} from "src/core/ErrorConsts";

const handle401 = (response) => {
  if (
    response.status === 401 &&
    response.data?.error?.emsg !== "E_USER_NOTFOUND"
  ) {
    toast(<NotifMessage message={t("getter_fe.auth.common.youLoggedOut")} />, {
      position: toast.POSITION.TOP_CENTER,
      type: AppConsts.NOTIF_MESSAGE_ERROR,
    });
    window.location.replace(AppConsts.URL_LOGOUT);
  }
};
const handleXError = (xerror) => {
  let errCode = xerror.getCode()().data.code;
  if (errCode === SYS_NETERR) {
    toast(<NotifMessage message={xerror.data.emsg} />, {
      position: toast.POSITION.TOP_CENTER,
      type: AppConsts.NOTIF_MESSAGE_ERROR,
    });
  }
};

export default async function GAxios(
  customConfig,
  callBack,
  errorCallback = null,
  response = null,
) {
  if (response) {
    handle401(response); //only handle the 401 logout.
    handleXError(response); //handle the XError.

    return;
  }

  const userInfo = JSON.parse(
    localStorage.getItem(userConstants.LS_SESSION_INFO),
  );

  const userId = userInfo ? userInfo.userinfo?._id : null;
  const token = userInfo ? userInfo.userinfo?.token : null;

  let xAuth = !userId
    ? `{"user": null, "token": null}`
    : `{"user": "${userId}", "token": "${token}"}`;
  let headers = {
    "Content-Type": "application/json",
    "x-app-auth": xAuth,
  };

  const initConfig = {
    method: "get",
    headers: headers,
  };

  let config = {...initConfig, ...customConfig};

  headers = {...headers, ...customConfig.headers};

  config = {...config, headers: headers, timeout: 20000};

  try {
    await axios(config)
      .then((res) => {
        callBack && callBack(res);
      })
      .catch((err) => {
        handle401(err.response);
        if (err.response && err.response.status >= 500) {
          toast(
            <NotifMessage
              message={t("getter_fe.auth.errors.somethingWentWrong")}
            />,
            {
              position: toast.POSITION.TOP_CENTER,
              type: AppConsts.NOTIF_MESSAGE_ERROR,
            },
          );
          return false;
        } else if (err.response && err.response.status === 429) {
          // handle limit exceeded error

          if (
            err.response.data.error &&
            err.response.data.error.code ===
              userConstants.E_METER_LIMIT_EXCEEDED
          ) {
            toast(<NotifMessage message={t("getter_fe.common.error429")} />, {
              position: toast.POSITION.TOP_CENTER,
              type: AppConsts.NOTIF_MESSAGE_ERROR,
            });
          }
          return false;
        } else if (errorCallback) {
          return errorCallback(err);
        } else {
          toast(
            <NotifMessage
              message={t("getter_fe.auth.errors.somethingWentWrong")}
            />,
            {
              position: toast.POSITION.TOP_CENTER,
              type: AppConsts.NOTIF_MESSAGE_ERROR,
            },
          );
          return false;
        }
      });
  } catch (error) {
    errorCallback && errorCallback(error);
  }
}
