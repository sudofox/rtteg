import React from "react";
import {t} from "../../i18n/utils";
import {MobileAppHelpCenterIndex} from "../pages/helpCenter/MobileAppHelpCenterIndex";
import {NewUIPage} from "../base/NewUIPage";

export const MobileAppHelpCenter = ({match}) => {
  const {tab} = match.params;
  return (
    <NewUIPage title={t("getter_fe.menu.common.helpCenter")}>
      <MobileAppHelpCenterIndex tab={tab} />
    </NewUIPage>
  );
};
