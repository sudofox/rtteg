import {useHistory, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import AppConsts from "src/app/AppConsts";

export const useAuthRedirect = () => {
  const authenticated = useSelector(
    (state) => state.auth?.session?.authenticated,
  );
  const history = useHistory();
  const location = useLocation();

  return (authUrl = AppConsts.URL_LOGIN, redirectUrl) => {
    if (!authenticated) {
      const pathname = redirectUrl || location.pathname;
      localStorage.setItem(
        AppConsts.LOCAL_STORAGE_REDIRECT_AFTER_LOGIN,
        pathname,
      );
      history.push(authUrl);
    }
  };
};
