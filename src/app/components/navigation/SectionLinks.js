import React, {useState, useEffect} from "react";
import clsx from "clsx";
import {Link, useLocation} from "react-router-dom";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {t, setLang, getLang} from "../../../i18n/utils";
import {connect} from "react-redux";
import {
  resetTimelineStatus,
  resetTimelineData,
} from "src/app/components/timeline/store";

import {ReactComponent as IconHome} from "src/assets/icons/nav/home.svg";
import {ReactComponent as IconHomeActivated} from "src/assets/icons/nav/home_activated.svg";
import {ReactComponent as IconSearch} from "src/assets/icons/nav/search.svg";
import {ReactComponent as IconSearchActivated} from "src/assets/icons/nav/search_activated.svg";
import {ReactComponent as IconProfile} from "src/assets/icons/nav/profile.svg";
import {ReactComponent as IconProfileActivated} from "src/assets/icons/nav/profile_activated.svg";
import {ReactComponent as IconSettings} from "src/assets/icons/nav/settings.svg";
import {ReactComponent as IconSettingsActived} from "src/assets/icons/nav/settings_activated.svg";
import {ReactComponent as IconHelpCenter} from "src/assets/icons/nav/help_center.svg";
import {ReactComponent as IconHelpCenterActivated} from "src/assets/icons/nav/help_center_activated.svg";
import {ReactComponent as IconDownload} from "src/assets/icons/nav/download.svg";
import {ReactComponent as IconDownloadActivated} from "src/assets/icons/nav/download_activated.svg";
import {ReactComponent as IconLanguage} from "src/assets/icons/ico-language.svg";
import {ReactComponent as IconLanguageActivated} from "src/assets/icons/ico-language-activated.svg";

import {LanguageDialog} from "../../LanguageDialog";
import {DownloadDialog} from "src/app/components/DownloadDialog";
import AppConsts from "../../AppConsts";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) =>
  createStyles({
    navigateMenu: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      [theme.breakpoints.down("md")]: {
        alignItems: "center",
      },
      "& .navigate-menu-item": {
        display: "inline-flex",
        alignItems: "center",
        margin: "0px 0px 7px 0px",
        cursor: "pointer",
        fontSize: 19,
        fontWeight: 700,
        color: theme.palette.text.lightGray,
        position: "relative",
        padding: "16px 22px",
        [theme.breakpoints.down("md")]: {
          justifyContent: "center",
        },
        "& .hover-background": {
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: -1,
          opacity: 0,
          borderRadius: "100px",
          backgroundColor: "#f3f3f3",
          transition: "opacity 0.15s",
          [theme.breakpoints.down("md")]: {
            borderRadius: "50%",
            width: 50,
            height: 50,
            top: "50%",
            left: "50%",
            right: "auto",
            transform: "translate(-50%, -50%)",
          },
        },
        "&:hover": {
          "& .hover-background": {
            opacity: 1,
          },
        },
        "&.zh,&.tw": {
          letterSpacing: "0.05em",
        },
        "&.active": {
          color: theme.palette.buttonDanger.main,
        },
      },
    },
    iconContainer: {
      position: "relative",
      marginRight: 18,
      width: 24,
      [theme.breakpoints.down("md")]: {
        marginRight: 0,
      },
      "& svg": {
        display: "block",
      },
    },
    // inactiveIcon: {
    //   stroke: theme.palette.text.secondary,
    //   [theme.breakpoints.down("md")]: {
    //     "&:hover": {
    //       "& circle": {
    //         fill: theme.palette.grey.A200,
    //       },
    //     },
    //   },
    // },
    divider: {
      width: "100%",
      maxWidth: 196,
      height: 1,
      margin: "9px 0 16px 0",
      background: theme.palette.line.grey_2,
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      authenticated: state.auth?.session?.authenticated,
    };
  },
  {resetTimelineStatus, resetTimelineData},
);

export const SectionLinks = connector(_SectionLinks);

function _SectionLinks({children, ...rest}) {
  const classes = useStyles();
  const {authenticated, tabletMatches, pcMatches} = rest;
  return (
    <div className={classes.navigateMenu}>
      {pcMatches && <div className={classes.divider} />}
      <RenderHomeLink {...rest} />
      {tabletMatches && <RenderSearchLink {...rest} />}
      <RenderProfileLink {...rest} />
      {pcMatches && <div className={classes.divider} />}
      <RenderSettingsLink {...rest} />
      <RenderHelpCenterLink {...rest} />
      <RenderDownloadLink {...rest} />
      {/* {!authenticated && <RenderLanguageLink {...rest} />} */}
    </div>
  );
}

const ConditionalLink = ({children, condition, to, ...rest}) =>
  !!condition && to ? (
    <Link to={to} {...rest}>
      {children}
    </Link>
  ) : (
    <div {...rest}>{children}</div>
  );

export const RenderHomeLink = ({
  pcMatches,
  resetTimelineData,
  resetTimelineStatus,
}) => {
  const classes = useStyles();
  const {pathname} = useLocation();

  return (
    <Link
      className={clsx(
        "navigate-menu-item",
        (/\/dashboard|trending|popular-users/.test(pathname) ||
          pathname === "/") &&
          "active",
        getLang(),
      )}
      to="/"
      onClick={() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        setTimeout(() => {
          resetTimelineStatus();
          resetTimelineData();
        }, 200);
      }}
    >
      <div className="hover-background" />
      <div className={classes.iconContainer}>
        {/\/dashboard|trending|popular-users/.test(pathname) ||
        pathname === "/" ? (
          <IconHomeActivated />
        ) : (
          <IconHome />
        )}
      </div>
      {pcMatches && (
        <div className="text">{t("getter_fe.menu.common.home")}</div>
      )}
    </Link>
  );
};

const RenderSearchLink = ({pcMatches}) => {
  const classes = useStyles();
  const {pathname} = useLocation();
  const isSearchPage = /(\/search)|(\/hashtag\/)/.test(pathname);
  let comp = (
    <ConditionalLink
      to="/search"
      condition={!isSearchPage}
      className={clsx(
        "navigate-menu-item",
        isSearchPage && "active",
        getLang(),
      )}
    >
      <div className="hover-background" />
      <div className={classes.iconContainer}>
        {isSearchPage ? <IconSearchActivated /> : <IconSearch />}
      </div>
      {pcMatches && (
        <div className="text">{t("getter_fe.menu.common.search")}</div>
      )}
    </ConditionalLink>
  );
  return comp;
};

const RenderProfileLink = ({pcMatches, userId}) => {
  const classes = useStyles();
  const {pathname} = useLocation();
  const authRedirect = useAuthRedirect();
  const myProfileUrl = `/user/${userId}`;
  return (
    <Link
      className={clsx(
        "navigate-menu-item",
        pathname === myProfileUrl && "active",
        getLang(),
      )}
      onClick={(e) => {
        if (!userId) {
          // Redirecting to dashboard after login, because we can't know myProfileUrl before logging in.
          authRedirect(AppConsts.URL_LOGIN, AppConsts.URL_DASHBOARD);
          e.preventDefault();
        }
      }}
      to={userId ? myProfileUrl : AppConsts.URL_LOGIN}
    >
      <div className="hover-background" />
      <div className={classes.iconContainer}>
        {pathname.includes(myProfileUrl) ? (
          <IconProfileActivated />
        ) : (
          <IconProfile />
        )}
      </div>
      {pcMatches && (
        <div className="text">{t("getter_fe.menu.common.profile")}</div>
      )}
    </Link>
  );
};

const RenderSettingsLink = ({userId, pcMatches, tabletMatches}) => {
  const classes = useStyles();
  const {pathname} = useLocation();
  const authRedirect = useAuthRedirect();
  let to;

  if (tabletMatches) {
    to = `/settings/${AppConsts.URL_SETTINGS_MOBILE_INDEX}`;
  } else {
    to = `/settings/${AppConsts.URL_SETTINGS_CHANGE_PASSWORD}`;
  }

  return (
    <Link
      className={clsx(
        "navigate-menu-item",
        /\/settings/.test(pathname) && "active",
        getLang(),
      )}
      onClick={(e) => {
        if (!userId) {
          authRedirect(AppConsts.URL_LOGIN, to);
          e.preventDefault();
        }
      }}
      to={to}
    >
      <div className="hover-background" />
      <div className={classes.iconContainer}>
        {/\/settings/.test(pathname) ? (
          <IconSettingsActived />
        ) : (
          <IconSettings />
        )}
      </div>
      {pcMatches && (
        <div className="text">{t("getter_fe.menu.common.settings")}</div>
      )}
    </Link>
  );
};

const RenderHelpCenterLink = ({pcMatches, tabletMatches}) => {
  const classes = useStyles();
  const {pathname} = useLocation();
  return (
    <Link
      to={
        tabletMatches
          ? `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_MOBILE_INDEX}`
          : `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_REGISTRATION}`
      }
      className={clsx(
        "navigate-menu-item",
        /\/helpcenter/.test(pathname) && "active",
        getLang(),
      )}
    >
      <div className="hover-background" />
      <div className={classes.iconContainer}>
        {/\/helpcenter/.test(pathname) ? (
          <IconHelpCenterActivated />
        ) : (
          <IconHelpCenter />
        )}
      </div>
      {pcMatches && (
        <div className="text">{t("getter_fe.menu.common.helpCenter")}</div>
      )}
    </Link>
  );
};

const RenderDownloadLink = ({pcMatches, mobileMatches}) => {
  const classes = useStyles();
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  useEffect(() => {
    if (!mobileMatches) setIsDownloadDialogOpen(false);
  }, [mobileMatches]);

  return (
    <div>
      <div
        className={clsx(
          "navigate-menu-item",
          isDownloadDialogOpen && "active",
          getLang(),
        )}
        onClick={() => {
          setIsDownloadDialogOpen(true);
        }}
      >
        <div className="hover-background" />
        <div className={classes.iconContainer}>
          {isDownloadDialogOpen ? <IconDownloadActivated /> : <IconDownload />}
        </div>
        {pcMatches && (
          <div className="text">{t("getter_fe.menu.common.download")}</div>
        )}
      </div>
      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        handleClose={(e) => {
          e.stopPropagation();
          setIsDownloadDialogOpen(false);
        }}
      />
    </div>
  );
};

const RenderLanguageLink = ({pcMatches, userId, appContext}) => {
  const classes = useStyles();
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [currentLangCode, setCurrentLangCode] = useState(getLang());

  useEffect(() => {
    setCurrentLangCode(getLang());
  }, [getLang()]);

  return (
    <div>
      <ConditionalLink
        to="/settings/interface-language"
        condition={userId}
        className={clsx(
          "navigate-menu-item",
          isLanguageDialogOpen && "active",
          getLang(),
        )}
        onClick={() => {
          if (!userId) {
            setIsLanguageDialogOpen(true);
          }
        }}
      >
        <div className="hover-background" />

        <div className={classes.iconContainer}>
          {isLanguageDialogOpen ? <IconLanguageActivated /> : <IconLanguage />}
        </div>
        {pcMatches ? (
          <div className="text">
            {appContext.getSupportedLanguageList(currentLangCode).nativeName}
          </div>
        ) : null}
      </ConditionalLink>
      <LanguageDialog
        isOpen={isLanguageDialogOpen}
        handleClose={(e) => {
          e.stopPropagation();
          setIsLanguageDialogOpen(false);
        }}
        allLangs={appContext.getSupportedLanguageList()}
        currentLangCode={currentLangCode}
        selectLangCode={(langCode) => {
          const success = appContext.setLanguagePref(langCode);
          if (success) {
            localStorage.setItem(
              AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG,
              langCode,
            );
            setLang(langCode);
            setCurrentLangCode(langCode);
            window.location.reload();
          } else {
            console.error("Oops! Cannot change to the language you desired.");
          }
        }}
      />
    </div>
  );
};
