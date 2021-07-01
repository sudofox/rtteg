import React from "react";
import {AccountPage} from "../pages/profile/AccountPage";
import AppConsts from "../AppConsts";
import {NewUIPage} from "../base/NewUIPage";
import Global from "src/system/Global";
import XUserInfo from "src/core/model/user/XUserInfo";

export const NewAccount = ({history}) => {
  const api = Global.GetPortal().getAppService();
  const title = api.getUserId();

  if (title === null || title === undefined) {
    history.replace("/login");
    return null;
  }

  const userInfo = XUserInfo.Wrap(api.getUserInfo());

  return (
    <NewUIPage
      title={title}
      description={`${AppConsts.APP_NAME} user ${title}`}
    >
      <AccountPage userInfo={userInfo} userId={title} />
    </NewUIPage>
  );
};
