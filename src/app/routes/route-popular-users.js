import React from "react";
import {PopularUsersFeed} from "src/app/components/PopularUsersFeed";
import {t} from "../../i18n/utils";
import {NewUIPage} from "../base/NewUIPage";
import {GBackTitle} from "src/styles/components/GBackTitle";
import Global from "src/system/Global";
import {GSectionHeader} from "src/styles/components/GSectionHeader";

export const NewPopularUsers = () => {
  const api = Global.GetPortal().getAppService();

  const token = api.getUserToken();
  const userId = api.getUserId();

  return (
    <NewUIPage
      id="popular-users"
      title={t("getter_fe.timeline.common.popularUsers")}
      description=""
    >
      <GBackTitle title={t("getter_fe.timeline.common.popularUsers")} />
      {/* <GSectionHeader title={t("getter_fe.timeline.common.popularUsers")} /> */}
      <PopularUsersFeed
        sidebar={false}
        token={token}
        userId={userId}
        isPage={true}
        isMaxPerpageFixed={false}
      />
    </NewUIPage>
  );
};
