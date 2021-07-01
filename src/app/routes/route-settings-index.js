import React, {useState} from "react";

import {NewUIPage} from "../base/NewUIPage";
import {NewSettingsIndex} from "../pages/settings/NewSettingsIndex";
import {t} from "src/i18n/utils";

export const NewSettings = ({match}) => {
  const [seo, setPageSeo] = useState(
    t("getter_fe.settings.common.changePassword"),
  );
  const {tab} = match.params;

  return (
    <NewUIPage title={seo}>
      <NewSettingsIndex tab={tab} setPageSeo={setPageSeo} />
    </NewUIPage>
  );
};
