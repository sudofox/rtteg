import React from "react";
import {t} from "../../i18n/utils";
import {NewMyDashboard} from "../pages/dashboard/NewMyDashboard";
import {NewUIPage} from "../base/NewUIPage";

/**
 * (logged in) User Dashboard URL Entry - /dashboard
 */

export const NewDashboard = () => {
  return (
    <NewUIPage id="dashboard" title={t("getter_fe.common.home")} description="">
      <NewMyDashboard />
    </NewUIPage>
  );
};
