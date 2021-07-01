import React from "react";

import {NewExploreSideBar} from "src/app/pages/dashboard/NewExploreSideBar";
import {HomeMainContainer} from "./HomeMainContainer";

export const RegularLayout = ({children}) => {
  return (
    <HomeMainContainer>
      <React.Fragment key="primary">{children}</React.Fragment>
      <NewExploreSideBar key="secondary" />
    </HomeMainContainer>
  );
};
