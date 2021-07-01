import React from "react";
import {t} from "../../i18n/utils";
import {NewUIPage} from "../base/NewUIPage";
import {TrendingFeed} from "src/app/components/TrendingFeed";
import {GBackTitle} from "src/styles/components/GBackTitle";
import Global from "src/system/Global";
import {GSectionHeader} from "src/styles/components/GSectionHeader";

export const NewTrending = () => {
  return (
    <NewUIPage
      id="trending"
      title={t("getter_fe.common.trends.title")}
      description=""
    >
      <GBackTitle title={t("getter_fe.common.trends.title")} />
      {/* <GSectionHeader title={t("getter_fe.common.trends.subTitle")} /> */}
      <TrendingFeed />
    </NewUIPage>
  );
};
