import React from "react";
import {t} from "../../i18n/utils";
import Claim from "../pages/auth/Claim";
import {NewUIPage} from "../base/NewUIPage";

export const ClaimRoute = () => {
  return (
    <NewUIPage title={t("getter_fe.menu.common.verify")}>
      <Claim />
    </NewUIPage>
  );
};
