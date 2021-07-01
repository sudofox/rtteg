import {useHistory} from "react-router";
import {connect} from "react-redux";
import {
  resetTimelineStatus,
  resetTimelineData,
} from "src/app/components/timeline/store";
import AppConsts from "../AppConsts";
import {userConstants} from "../components/auth/_constants";
import Global from "src/system/Global";
import {useEffect} from "react";
import {logout} from "src/app/components/auth/store";

const connector = connect(
  (state) => {
    return {};
  },
  {resetTimelineStatus, resetTimelineData, logout},
);

const _NewLogout = ({logout, resetTimelineStatus, resetTimelineData}) => {
  const history = useHistory();

  useEffect(() => {
    const portal = Global.GetPortal();

    resetTimelineData();
    resetTimelineStatus();

    portal.logout();
    localStorage.setItem(userConstants.LS_SESSION_INFO, null);
    localStorage.setItem("localStorageRecentSearch", null);
    logout();
    resetTimelineData();
    resetTimelineStatus();

    history.replace(AppConsts.URL_LOGIN);
  }, []);

  return null;
};

export const NewLogout = connector(_NewLogout);
