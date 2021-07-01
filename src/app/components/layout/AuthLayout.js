import React, {useState, useRef, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {
  Grid,
  Divider,
  Link,
  FormHelperText,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import {useTranslation} from "react-i18next";
import {ReactComponent as LogoBig} from "src/assets/images/common/logoGettr.svg";
import AppConsts from "../../AppConsts";
import {LanguageDialog} from "../../LanguageDialog";
import {setLang} from "../../../i18n/utils";
import {userConstants} from "src/app/components/auth/_constants";
import {getLang, cacheI18nT} from "src/i18n/utils";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
  },
  contentWrapper: {
    maxWidth: "60%",
    paddingLeft: theme.spacing(5),
  },
  gridRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  footer: {
    padding: theme.spacing(3, 2.5, 1.875, 2.5),
  },
  textFooter: {
    fontSize: 12,
    lineHeight: "14.32px",
    fontWeight: 400,
    color: theme.palette.text.secondary,
    textAlign: "center",
  },
  rightLinksWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2.25),
  },
  header: {
    paddingRight: theme.spacing(3.75),
    paddingLeft: theme.spacing(3.75),
    [theme.breakpoints.down("xs")]: {
      paddingRight: theme.spacing(2.5),
      paddingLeft: theme.spacing(2.5),
    },
  },
  logo: {
    marginTop: theme.spacing(2.75),
    cursor: "pointer",
  },
  linkClick: {
    fontSize: 14,
    lineHeight: "16.71px",
    fontWeight: 400,
    color: theme.palette.text.main,
    cursor: "pointer",
    textTransform: "capitalize",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  linkExternal: {
    color: theme.palette.secondary.gray,
    fontWeight: "normal",
    textDecoration: "underline",
  },
  divider: {
    display: "inline-block",
    margin: theme.spacing(0, 2.125),
    height: theme.spacing(3),
    backgroundColor: theme.divider.color,
  },
}));

export const AuthLayout = ({appContext, children}) => {
  const classes = useStyles();
  const history = useHistory();
  const [isLangDialogOpen, setIsLangDialogOpen] = useState(false);
  const initialLangCode = getLang();
  const [currentLangCode, setCurrentLangCode] = useState(initialLangCode);
  const [oldLangCode, setOldLangCode] = useState(initialLangCode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const {t} = useTranslation();

  useEffect(() => {
    cacheI18nT(t);
  }, []);

  const handleHomePage = () => {
    history.push(AppConsts.URL_DASHBOARD);
  };

  const handleLanDialog = () => {
    if (!isLangDialogOpen) {
      setOldLangCode(currentLangCode);
    } else if (currentLangCode !== oldLangCode) {
      window.location.reload();
    }
    setIsLangDialogOpen(!isLangDialogOpen);
  };

  /**
   * TODO: remove useComponentWillMount when the routes refactored
   */

  const useComponentWillMount = (func) => {
    const willMount = useRef(true);
    if (willMount.current) {
      func();
    }
  };

  useComponentWillMount(() => {
    const userInfo = JSON.parse(
      localStorage.getItem(userConstants.LS_SESSION_INFO),
    );

    const authenticated = userInfo ? userInfo.authenticated : null;

    if (!window.location.pathname.startsWith("/claim")) {
      authenticated && history.push("/");
    }
  });

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.gridRight}>
        <Grid container className={classes.header}>
          <Grid item xs={6}>
            <LogoBig
              className={classes.logo}
              onClick={() => handleHomePage()}
            />
          </Grid>
          <Grid item xs={6} className={classes.rightLinksWrapper}>
            <Link
              href={
                isMobile
                  ? `${AppConsts.URL_HELP_CENTER_MOBILE_APP}`
                  : `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_REGISTRATION}`
              }
              className={clsx(classes.linkClick, "text-link")}
            >
              {t("getter_fe.auth.common.getHelp")}
            </Link>

            <Divider orientation="vertical" className={classes.divider} />
            <span className={classes.linkClick} onClick={handleLanDialog}>
              {t("getter_fe.menu.common.languages")}
            </span>
          </Grid>
        </Grid>
        {children}
        <Grid container className={classes.footer}>
          <Grid item xs={12}>
            <FormHelperText className={classes.textFooter}>
              {t("getter_fe.auth.common.recaptcha1")}
              <a
                className={classes.linkExternal}
                href="https://policies.google.com/privacy"
                target="_blank"
              >
                {t("getter_fe.auth.common.recaptcha2")}
              </a>
              {t("getter_fe.auth.common.recaptcha3")}
              <a
                className={classes.linkExternal}
                href="https://policies.google.com/terms"
                target="_blank"
              >
                {t("getter_fe.auth.common.recaptcha4")}
              </a>
              {t("getter_fe.auth.common.recaptcha5")}
            </FormHelperText>
          </Grid>
        </Grid>
      </Grid>
      <LanguageDialog
        isOpen={isLangDialogOpen}
        handleClose={handleLanDialog}
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
          } else {
            console.error("Oops! Cannot change to the language you desired.");
          }
        }}
      />
    </Grid>
  );
};
