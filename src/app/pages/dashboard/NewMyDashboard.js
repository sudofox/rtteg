import {BackToTopButton} from "src/app/components/BackToTopButton";
import {PostComposer} from "src/app/components/post/comps/PostComposer";
import {CookieNotification} from "src/app/components/CookieNotification";
import {AuthBar} from "src/app/components/auth/comps/AuthBar";
import {useState} from "react";
import Hidden from "@material-ui/core/Hidden";
import {useHistory} from "react-router";
import {useSelector} from "react-redux";
import {PopularUsersHorizontal} from "../../components/PopularUsersHorizontal";
import {NewUserFeed} from "src/app/components/timeline/comps/NewUserFeed";
// import {NewUserFeedOpt} from "src/app/components/timeline/comps/NewUserFeedOpt";

export const NewMyDashboard = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(
    localStorage.getItem("cookieAccepted"),
  );

  const history = useHistory();

  const {authenticated} = useSelector((state) => state.auth?.session);

  return (
    <>
      <BackToTopButton />
      {authenticated ? (
        <Hidden only="xs">
          <PostComposer history={history} scenes="notInPopup" />
        </Hidden>
      ) : null}
      <PopularUsersHorizontal />
      <NewUserFeed />
      {/* <NewUserFeedOpt /> */}
      <Hidden only="xs">
        <CookieNotification
          cookiesAccepted={cookiesAccepted}
          setCookiesAccepted={setCookiesAccepted}
        />
        {authenticated ? null : <AuthBar cookiesAccepted={cookiesAccepted} />}
      </Hidden>
    </>
  );
};
