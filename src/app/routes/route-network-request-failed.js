import React from "react";
import {NewUIPage} from "../base/NewUIPage";
import {NetworkRequestFailed} from "../pages/NetworkRequestFailed";

export const NetworkFailed = () => {
  return (
    <NewUIPage title="Not Found" description="This is embarrassing.">
      <NetworkRequestFailed />
    </NewUIPage>
  );
};
