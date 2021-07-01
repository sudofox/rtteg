import React from "react";
import {t} from "../../i18n/utils";
import {NewHelpCenterIndex} from "../pages/helpCenter/NewHelpCenterIndex";
import {NewUIPage} from "../base/NewUIPage";

export const NewHelpCenter = (props) => {
  const {match} = props;

  const {tab} = match.params;

  return (
    <NewUIPage title={t("getter_fe.menu.common.helpCenter")}>
      <NewHelpCenterIndex tab={tab} />
    </NewUIPage>
  );
};
