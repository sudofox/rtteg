import {useHistory} from "react-router-dom";
import AppConsts from "src/app/AppConsts";

export const useRedirectAfterLogin = () => {
  const history = useHistory();

  return () => {
    const pathname = localStorage.getItem(
      AppConsts.LOCAL_STORAGE_REDIRECT_AFTER_LOGIN,
    );
    if (pathname) {
      localStorage.setItem(AppConsts.LOCAL_STORAGE_REDIRECT_AFTER_LOGIN, "");
      history.push(pathname);
    } else {
      history.push("/");
    }
  };
};
