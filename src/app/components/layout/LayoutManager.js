import {useEffect, useCallback, useState} from "react";
import {useLocation, useHistory} from "react-router";
import Global from "src/system/Global";
import {AuthLayout} from "./AuthLayout";
import {RegularLayout} from "./RegularLayout";
import {setLang} from "src/i18n/utils";
import GA4React from "ga-4-react";
import {userConstants} from "src/app/components/auth/_constants";

const formatRoutes = (routes) => routes.map(({path}) => path.split("/")[1]);

export const LayoutManager = (props) => {
  const {pathname} = useLocation();
  const term = pathname.split("/")[1];
  const appContext = Global.GetPortal().getAppService();
  const {children, regularRoutes, authRoutes, miscRoutes} = props;
  let userinfo = JSON.parse(
    localStorage.getItem(userConstants.LS_SESSION_INFO),
  )?.userinfo;
  const [ga4react, setGa4react] = useState(null);
  const [userId, setUserId] = useState(null);

  const useQuery = () => {
    return new URLSearchParams(window.location.search);
  };

  const changeLang = () => {
    const query = useQuery();
    const langUrl = query.get("lang");

    const langsList = appContext.getSupportedLanguageList();
    const currentLang = appContext.getLanguagePref();

    if (langUrl) {
      for (let i = 0; i < langsList.length; i++) {
        const elem = langsList[i];

        if (langUrl !== currentLang && langUrl === elem.code) {
          const success = appContext.setLanguagePref(elem.code);
          success && setLang(elem.code);
        }
      }
    }
  };

  const handleGaPageView = () => {
    // google analytics
    if (ga4react) {
      ga4react.pageview(pathname);
    } else {
      const gaId = process.env.REACT_APP_GA_ID;
      if (gaId) {
        const _ga4react = userId
          ? new GA4React(gaId, {userId: userId})
          : new GA4React(gaId);
        _ga4react.initialize().then(
          (ga4) => {
            setGa4react(_ga4react);
            setTimeout(() => {
              ga4.pageview(pathname);
            }, 600);
          },
          (err) => {
            // console.error(err);
          },
        );
      } else {
        console.warn("GA ID Missing.");
      }
    }
  };

  useEffect(() => {
    if (userinfo && userinfo._id) {
      setUserId(userinfo._id);
      setGa4react(null);
      handleGaPageView();
    }
  }, [userinfo]);

  useEffect(() => {
    handleGaPageView();
  }, [pathname]);

  useEffect(() => {
    changeLang();
  }, []);

  const formattedRegularRoutes = formatRoutes(regularRoutes);
  const formattedAuthRoutes = formatRoutes(authRoutes);
  const formattedMiscRoutes = formatRoutes(miscRoutes);

  const isRegularRoute = formattedRegularRoutes.indexOf(term) >= 0;
  const isAuthRoute = formattedAuthRoutes.indexOf(term) >= 0;
  const isNotFoundRoute = !isAuthRoute && formattedMiscRoutes.indexOf(term) < 0;

  if (isRegularRoute || isNotFoundRoute) {
    return <RegularLayout>{children}</RegularLayout>;
  } else if (isAuthRoute) {
    return <AuthLayout appContext={appContext}>{children}</AuthLayout>;
  } else {
    return <>{children}</>;
  }
};
