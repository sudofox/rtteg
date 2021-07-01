import React from "react";
import {useHistory} from "react-router-dom";
import {t} from "../../i18n/utils";
import {NewUIPage} from "../base/NewUIPage";
import {ClaimError} from "src/app/pages/auth/ClaimError";
import {GBackTitle} from "src/styles/components/GBackTitle";

export const ClaimErrorRoute = () => {
  const history = useHistory();

  return (
    <NewUIPage
      id="verify-failed"
      title={t("getter_fe.settings.common.verify")}
      description=""
    >
      <GBackTitle
        title={t("getter_fe.settings.common.verify")}
        handleClick={() => {
          history.push(`/`);
        }}
      />
      <ClaimError />
    </NewUIPage>
  );
};
