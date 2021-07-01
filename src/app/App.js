import {makeStyles} from "@material-ui/core";
import {useEffect} from "react";
import {useLocation} from "react-router";
import Global from "src/system/Global";
import AppConsts from "./AppConsts";
import {TimelineProvider} from "./base/TimelineContext";
import {MuiThemeProvider} from "./base/UIContext";
import {MobileBottomNavigation} from "./components/MobileBottomNavigation";
import {MuiToastContainer} from "./components/notifications/MuiToastContainer";
import {NavigateSideBar} from "./components/navigation/NavigateSideBar";
import {useTranslation} from "react-i18next";
import Routes from "./routes";
import {cacheI18nT, setLang} from "src/i18n/utils";
import {ZendeskChat} from "src/app/components/ZendeskChat";
import {Header} from "src/app/components/global/Header";
import clsx from "clsx";

const noNavBarPaths = [
  AppConsts.URL_SIGNUP,
  AppConsts.URL_LOGIN,
  AppConsts.URL_TEMPORARILY_BLOCKED,
  AppConsts.URL_FIRST_LOGIN,
  AppConsts.URL_CHANGE_PASSWORD,
  AppConsts.URL_CLAIM,
];

const noMaxWidthPaths = [
  AppConsts.URL_SIGNUP,
  AppConsts.URL_LOGIN,
  AppConsts.URL_TEMPORARILY_BLOCKED,
  AppConsts.URL_CHANGE_PASSWORD,
  AppConsts.URL_CLAIM,
];

const defaultLang = "en";

const useStyles = makeStyles((theme) => ({
  main: {
    width: "100%",
    backgroundColor: (props) =>
      props.path.includes("/settings") ? "#ffffff" : "#f5f5f5",
  },
  root: {
    position: "relative",
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1237,
    padding: "0 0px",
    minHeight: `calc(100vh - 61px)`, // 100vh - theme.mixins.header.height,
    color: theme.palette.text.primary,
    // "@media only screen and (max-width: 767px)": {
    //   /* Set input font size to pervent iOS auto zoom-in on input focus */
    //   "input[type='color'], input[type='date'], input[type='datetime'], input[type='datetime-local'], input[type='email'], input[type='month'], input[type='number'], input[type='password'], input[type='search'], input[type='tel'], input[type='text'], input[type='time'], input[type='url'], input[type='week'], select:focus, textarea": {
    //     fontSize: 16,
    //   },
    // },
    "& img.error": {
      display: "inline-block",
      transform: "scale(1)",
      content: "''",
      color: "transparent",
      overflow: "hidden",
      "&:before": {
        content: "''",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        background:
          "#EEEFF3 url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUgNi4yNUgyNVYxMi41ODg2QzI1Ljg4MjcgMTIuNzE0OSAyNi43MjI5IDEyLjk3MjggMjcuNSAxMy4zNDJWNC45OTEyNUMyNy41IDQuMzA2MjUgMjYuOTQ1IDMuNzUgMjYuMjYgMy43NUgzLjc0QzMuNDExNzMgMy43NTI2MiAzLjA5NzY2IDMuODg0MjcgMi44NjU2NCA0LjExNjUyQzIuNjMzNjMgNC4zNDg3NyAyLjUwMjI5IDQuNjYyOTcgMi41IDQuOTkxMjVWMjUuMDA4OEMyLjUgMjUuMzM3NyAyLjYzMDYgMjUuNjUzMyAyLjg2MzExIDI1Ljg4NkMzLjA5NTYyIDI2LjExODcgMy40MTEwMiAyNi4yNDk3IDMuNzQgMjYuMjVIMTYuNTY4M0MxNS41Nzk3IDI0LjgzMjcgMTUgMjMuMTA5MSAxNSAyMS4yNUMxNSAxNy44Njg0IDE2LjkxODEgMTQuOTM1IDE5LjcyNTcgMTMuNDc4MkwxOC4zODI1IDEyLjEzMjVDMTguMTQ4MSAxMS44OTgyIDE3LjgzMDIgMTEuNzY2NSAxNy40OTg3IDExLjc2NjVDMTcuMTY3MyAxMS43NjY1IDE2Ljg0OTQgMTEuODk4MiAxNi42MTUgMTIuMTMyNUw1IDIzLjc1VjYuMjVaTTguMjMyMjMgMTMuMDE3OEM4LjcwMTA3IDEzLjQ4NjYgOS4zMzY5NiAxMy43NSAxMCAxMy43NUMxMC42NjMgMTMuNzUgMTEuMjk4OSAxMy40ODY2IDExLjc2NzggMTMuMDE3OEMxMi4yMzY2IDEyLjU0ODkgMTIuNSAxMS45MTMgMTIuNSAxMS4yNUMxMi41IDEwLjU4NyAxMi4yMzY2IDkuOTUxMDcgMTEuNzY3OCA5LjQ4MjIzQzExLjI5ODkgOS4wMTMzOSAxMC42NjMgOC43NSAxMCA4Ljc1QzkuMzM2OTYgOC43NSA4LjcwMTA3IDkuMDEzMzkgOC4yMzIyMyA5LjQ4MjIzQzcuNzYzMzkgOS45NTEwNyA3LjUgMTAuNTg3IDcuNSAxMS4yNUM3LjUgMTEuOTEzIDcuNzYzMzkgMTIuNTQ4OSA4LjIzMjIzIDEzLjAxNzhaIiBmaWxsPSIjQkRCRENDIi8+DQogICAgPHBhdGggZD0iTTIzLjc1IDI3LjVDMjAuMjk4MSAyNy41IDE3LjUgMjQuNzAxOSAxNy41IDIxLjI1QzE3LjUgMTcuNzk4MSAyMC4yOTgxIDE1IDIzLjc1IDE1QzI3LjIwMTkgMTUgMzAgMTcuNzk4MSAzMCAyMS4yNUMzMCAyNC43MDE5IDI3LjIwMTkgMjcuNSAyMy43NSAyNy41WiIgZmlsbD0iI0JEQkRDQyIvPg0KICAgIDxwYXRoIGQ9Ik0yMy43NSAyMy4xMjVDMjMuNDA0OCAyMy4xMjUgMjMuMTI1IDIzLjQwNDggMjMuMTI1IDIzLjc1QzIzLjEyNSAyNC4wOTUyIDIzLjQwNDggMjQuMzc1IDIzLjc1IDI0LjM3NUMyNC4wOTUyIDI0LjM3NSAyNC4zNzUgMjQuMDk1MiAyNC4zNzUgMjMuNzVDMjQuMzc1IDIzLjQwNDggMjQuMDk1MiAyMy4xMjUgMjMuNzUgMjMuMTI1Wk0yMy43NSAxOC4xMjVDMjMuNDA0OCAxOC4xMjUgMjMuMTI1IDE4LjQwNDggMjMuMTI1IDE4Ljc1VjIxLjI1QzIzLjEyNSAyMS41OTUyIDIzLjQwNDggMjEuODc1IDIzLjc1IDIxLjg3NUMyNC4wOTUyIDIxLjg3NSAyNC4zNzUgMjEuNTk1MiAyNC4zNzUgMjEuMjVWMTguNzVDMjQuMzc1IDE4LjQwNDggMjQuMDk1MiAxOC4xMjUgMjMuNzUgMTguMTI1WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K) no-repeat center / 30% 30%",
      },
    },
  },
  rootPT: {
    paddingTop: 61, // theme.mixins.header.height,
  },
  appMain: {
    display: "flex",
    justifyContent: "flex-start",
    position: "relative",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  appContent: {
    position: "relative",
    flexGrow: 2,
    // [theme.breakpoints.only("md")]: {
    "@media (min-width: 1002px) and (max-width: 1365px)": {
      width: 860,
    },
    // [theme.breakpoints.only("sm")]: {
    "@media (min-width: 601px) and (max-width: 1001px)": {
      maxWidth: "100%",
      width: 600,
    },
    // [theme.breakpoints.only("xs")]: {
    "@media (max-width: 600px)": {
      width: "100%",
    },
  },
  noMaxWidth: {
    maxWidth: "none",
  },
}));

export const App = () => {
  const path = window.location.pathname;
  const classes = useStyles({path});
  const {pathname} = useLocation();
  const doNavBar = !noNavBarPaths.includes(pathname);
  const doMaxWidth = !noMaxWidthPaths.includes(pathname);
  const appContext = Global.GetPortal().getAppService();

  const userId = appContext.getUserId();

  const {t} = useTranslation();
  cacheI18nT(t);

  useEffect(() => {
    const firstTimeVisit = !localStorage.getItem(
      AppConsts.LOCAL_STORAGE_FIRST_TIME_VISIT,
    );
    const langInLocalStorage = localStorage.getItem(
      AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG,
    );
    const browserLang = window.navigator.language;

    if (firstTimeVisit || !browserLang.includes(langInLocalStorage)) {
      localStorage.setItem(AppConsts.LOCAL_STORAGE_FIRST_TIME_VISIT, false);

      const allLangs = appContext.getSupportedLanguageList();
      const lastLangCode = localStorage.getItem(
        AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG,
      );

      if (lastLangCode) {
        if (appContext.setLanguagePref(lastLangCode)) {
          setLang(lastLangCode);
        }
      } else {
        allLangs.forEach(({code}, idx) => {
          console.log(browserLang.includes(code));
          if (browserLang.includes(code)) {
            if (appContext.setLanguagePref(code)) {
              setLang(code);
            }
            localStorage.setItem(
              AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG,
              code,
            );
            return;
          }

          if (
            !browserLang.includes(code) &&
            idx === allLangs.length - 1 &&
            browserLang.includes(langInLocalStorage)
          ) {
            localStorage.setItem(
              AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG,
              defaultLang,
            );
            if (appContext.setLanguagePref(defaultLang)) {
              setLang(defaultLang);
            }
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <MuiThemeProvider>
      <TimelineProvider>
        {doNavBar && <Header />}
        <div className={classes.main}>
          <div
            className={clsx(
              classes.root,
              !doMaxWidth && classes.noMaxWidth,
              doNavBar && classes.rootPT,
            )}
          >
            <div className={classes.appMain}>
              {doNavBar && (
                <NavigateSideBar appContext={appContext} userId={userId} />
              )}
              <div className={`${classes.appContent} app-content`}>
                <Routes />
                <MobileBottomNavigation userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </TimelineProvider>
      <MuiToastContainer />
      <ZendeskChat />
    </MuiThemeProvider>
  );
};
