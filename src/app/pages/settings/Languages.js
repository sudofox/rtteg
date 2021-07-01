import React, {useEffect, useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import {t, setLang, getLang} from "../../../i18n/utils";
import {GButton} from "../../../styles/components/GButton";
import clsx from "clsx";
import {ReactComponent as Check} from "../../../assets/icons/check.svg";
import {toast} from "react-toastify";
import {NotifMessage} from "../../components/notifications/NotifMessage";
import {ReactComponent as BackArrowIcon} from "src/assets/icons/basic/back_arrow.svg";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import AppConsts from "../../AppConsts";
import Global from "src/system/Global";
import {connect} from "react-redux";
import GAxios from "src/util/GAxios";
import {setSessionUserLanguage} from "src/app/components/auth/store";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(4),
    },
    tabTitle: {
      margin: theme.spacing(0, 4),
      paddingTop: theme.spacing(3.75),
      paddingBottom: theme.spacing(3.75),
      fontSize: 28,
      fontWeight: 600,
      lineHeight: "33px",
      color: theme.palette.text.primary,
      textTransform: "capitalize",
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        // tablet or mobile
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        borderBottom: `1px solid ${theme.palette.grey.A200}`,
        marginTop: 0,
        height: 58,
        lineHeight: "58px",
        fontSize: 18,
        "& > svg": {
          // back arrow icon
          marginRight: theme.spacing(2),
          verticalAlign: "top",
          cursor: "pointer",
          borderRadius: "50%",
          padding: 1,
          width: 26,
          height: 26,
          "&:hover": {
            backgroundColor: "#F2F9FF",
          },
        },
      },
    },
    description: {
      fontSize: 15,
      lineHeight: "130%",
      color: theme.palette.text.lightGray,
    },
    actions: {
      maxWidth: theme.spacing(61),
    },
    btn: {
      maxWidth: theme.spacing(25),
      height: theme.spacing(6),
      margin: theme.spacing(3.75, 0, 5, 0),
      borderRadius: 24,
      // boxShadow: "none",
      // textTransform: "capitalize",
      // "&:hover": {
      //   boxShadow: "none",
      // },
      // "& .MuiButton-label": {
      //   marginTop: 0,
      // },
    },
    mobileBtn: {
      width: "auto",
      marginLeft: "auto",
      height: theme.spacing(3.5),
      borderRadius: 24,
      fontWeight: 700,
      "& span": {
        fontSize: "13px !important",
      },
    },
    options: {
      marginTop: theme.spacing(3.75),
    },
    option: {
      margin: theme.spacing(0, 0, 2.5, 0),
      "& .MuiTypography-body1": {
        fontSize: 16,
        lineHeight: "130%",
        color: theme.palette.text.primary,
      },
      "&:last-child": {
        marginBottom: 0,
      },
    },
    radio: {
      padding: theme.spacing(0, 1.5, 0, 0),
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    icon: {
      width: theme.spacing(2.375),
      height: theme.spacing(2.375),
      borderRadius: "50%",
      boxShadow: "none",
      backgroundColor: "transparent",
      backgroundImage: "none",
      border: `1px solid ${theme.radio.borderColor}`,
      "$root.Mui-focusVisible &": {
        backgroundColor: "red",
      },
      "input:hover ~ &": {
        backgroundColor: "transparent",
      },
    },
    checkedIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundImage: "none",
      "input:hover ~ &": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    check: {
      width: theme.spacing(1.125),
      height: "auto",
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      session: state.auth.session,
    };
  },
  {setSessionUserLanguage},
);

export const Languages = connector(_Languages);
function _Languages({setPageSeo, session, setSessionUserLanguage}) {
  const api = Global.GetPortal().getAppService();
  const classes = useStyles();
  const allLangs = api.getSupportedLanguageList();
  const [value, setValue] = useState(getLang());
  const [prevLang, setprevLang] = useState(getLang());
  const [changed, setChanged] = useState(false);
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const history = useHistory();

  const handleChange = (event) => {
    const lang = event.target.value;
    setValue(lang);

    if (lang !== prevLang) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (session && session.authenticated && changed) {
      const userId = session.userinfo._id;
      const data = JSON.stringify({
        content: {
          nickname: session.userinfo.nickname,
          lang: value,
        },
      });
      const config = {
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/settings/account?prop={}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      const successCallback = (response) => {
        // success
        setSessionUserLanguage(value);
        setLang(value, () => {
          setChanged(!changed);
          toast.dismiss();
          toast(
            <NotifMessage
              message={t("getter_fe.settings.common.languageSaved")}
            />,
            {
              type: toast.TYPE.SUCCESS,
              autoClose: 2000,
              onClose: () => {
                window.location.reload();
              },
            },
          );
        });
      };
      const errorCallback = (error) => {
        console.error("Oops! Cannot change to the language you desired.");
      };
      await GAxios(config, successCallback, errorCallback);
    }
  };

  useEffect(() => {
    setPageSeo(t("getter_fe.settings.common.interfaceLanguages"));
    const _lastSiteLang = localStorage.getItem(
      AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG,
    );
    if (_lastSiteLang) {
      setValue(_lastSiteLang);
    }
  }, []);

  return (
    <>
      <Typography variant="h1" className={classes.tabTitle}>
        {isTabletOrMobile && (
          <BackArrowIcon
            onClick={() =>
              history.push(`/settings/${AppConsts.URL_SETTINGS_MOBILE_INDEX}`)
            }
          />
        )}
        {t("getter_fe.settings.common.interfaceLanguages")}
        {isMobile && (
          <GButton
            type="submit"
            variant="outlined"
            className={classes.mobileBtn}
            onClick={(e) => handleSubmit(e)}
          >
            {t("getter_fe.profile.common.save")}
          </GButton>
        )}
      </Typography>
      <div className={classes.wrapper}>
        <Typography variant="body2" className={classes.description}>
          {t("getter_fe.settings.common.languagesDescription")}
        </Typography>

        <div className={classes.options}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="languages"
              name="languages"
              value={value}
              onChange={handleChange}
            >
              {allLangs &&
                allLangs.map((lang, idx) => {
                  return (
                    <FormControlLabel
                      key={idx}
                      value={lang.code}
                      control={
                        <Radio
                          className={classes.radio}
                          disableRipple
                          color="default"
                          checkedIcon={
                            <div
                              className={clsx(
                                classes.icon,
                                classes.checkedIcon,
                              )}
                            >
                              <Check className={classes.check} />
                            </div>
                          }
                          icon={<span className={classes.icon} />}
                        />
                      }
                      className={classes.option}
                      label={`${lang.name} - ${lang.nativeName}`}
                    />
                  );
                })}
            </RadioGroup>
          </FormControl>
        </div>
        {!isMobile && (
          <div className={classes.actions}>
            <GButton
              type="submit"
              variant="outlined"
              className={classes.btn}
              onClick={(e) => handleSubmit(e)}
            >
              {t("getter_fe.settings.common.saveChanges")}
            </GButton>
          </div>
        )}
      </div>
    </>
  );
}
