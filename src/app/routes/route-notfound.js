import React from "react";

import {NewUIPage} from "../base/NewUIPage";
import {NewNotFoundPage} from "../pages/NewNotFoundPage";

export const NewNotFound = () => {
  return (
    <NewUIPage title="Not Found" description="This is embarrassing.">
      <NewNotFoundPage />
    </NewUIPage>
  );
};
