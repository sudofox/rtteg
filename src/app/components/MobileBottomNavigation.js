import React, {useState, useEffect} from "react";
import clsx from "clsx";
import {
  makeStyles,
  useMediaQuery,
  createStyles,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import {useHistory, useLocation} from "react-router-dom";

import {ReactComponent as IconHome} from "src/assets/icons/nav/home.svg";
import {ReactComponent as IconHomeActivated} from "src/assets/icons/nav/home_activated_mobile.svg";
import {ReactComponent as IconSearch} from "src/assets/icons/nav/search.svg";
import {ReactComponent as IconSearchActivated} from "src/assets/icons/nav/search_activated_mobile.svg";
import {ReactComponent as IconProfile} from "src/assets/icons/nav/profile.svg";
import {ReactComponent as IconProfileActivated} from "src/assets/icons/nav/profile_activated_mobile.svg";

import {t} from "src/i18n/utils";

import AppConsts from "src/app/AppConsts";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "fixed",
      height: 60,
      bottom: 0,
      width: "100%",
      borderTop: `0.5px solid ${theme.palette.grey.A200}`,
      "& .MuiBottomNavigationAction-label": {
        fontSize: 11,
        "& .Mui-selected": {
          fontSize: 11,
        },
      },
      "& .MuiBottomNavigationAction-root": {
        padding: "12px 12px 8px",
      },
    },
  }),
);

export const MobileBottomNavigation = ({userId}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const history = useHistory();
  const {pathname} = useLocation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only("xs"));
  const authRedirect = useAuthRedirect();

  const currentPathname = window.location.pathname;
  const currentQueryStr = window.location.search;

  const isSearchPage = () => {
    return (
      currentPathname.includes("/search?q=") ||
      currentPathname.includes("/search") ||
      currentPathname.includes("/hashtag/")
    );
  };

  const hideNavigation = () => {
    return (
      currentPathname.includes("/terms-app") ||
      currentPathname.includes("/privacy-app") ||
      currentPathname.includes("/cookie-policy-app") ||
      currentPathname.includes("/login") ||
      currentPathname.includes("/signup") ||
      currentPathname.includes("/claim")
    );
  };

  useEffect(() => {
    const location = currentPathname;

    if (
      location === `/user/${userId}` ||
      location === "/account" ||
      location.includes(`/user/${userId}`)
    ) {
      setValue(2);
    } else if (isSearchPage()) {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [currentPathname]);

  if (currentPathname.includes(AppConsts.URL_HELP_CENTER_MOBILE_APP))
    return null;

  return (
    matches &&
    !hideNavigation() && (
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          if (value === 0 && newValue === 0 && pathname === "/") {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
            return;
          }
          setValue(newValue);
          switch (newValue) {
            case 0:
              history.push("/");
              break;
            case 1:
              if (currentPathname.includes("/search")) {
                if (currentQueryStr.includes("tab=2")) {
                  history.push("/search?&tab=0");
                }
              } else {
                history.push("/search?&tab=0");
              }
              break;
            case 2:
              if (!userId) {
                authRedirect(AppConsts.URL_LOGIN, "/account");
              } else {
                history.push(`/account`);
              }
              break;
            default:
              history.push("/");
              break;
          }
        }}
        showLabels
        className={clsx(classes.root, "mobile-nav")}
      >
        <BottomNavigationAction
          label={t("getter_fe.menu.common.home")}
          icon={value === 0 ? <IconHomeActivated /> : <IconHome />}
        />
        <BottomNavigationAction
          label={t("getter_fe.menu.common.search")}
          icon={value === 1 ? <IconSearchActivated /> : <IconSearch />}
        ></BottomNavigationAction>
        <BottomNavigationAction
          label={t("getter_fe.menu.common.account")}
          icon={value === 2 ? <IconProfileActivated /> : <IconProfile />}
        />
      </BottomNavigation>
    )
  );
};
