import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {t} from "../../../i18n/utils";
import {Link, useHistory} from "react-router-dom";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {toast} from "react-toastify";
import AppConsts from "../../AppConsts";
import {ReactComponent as RightArrowIcon} from "../../../assets/icons/ico-right-arrow.svg";
import {ReactComponent as LanguageIcon} from "../../../assets/icons/ico-settings-language.svg";
import {ReactComponent as LogoutIcon} from "../../../assets/icons/basic/log_out.svg";
import {ReactComponent as PasswordIcon} from "../../../assets/icons/feature/password.svg";
import {ReactComponent as PrivacyIcon} from "../../../assets/icons/feature/privacy.svg";
import {NotifMessage} from "../../components/notifications/NotifMessage";
import {GBackTitle} from "../../../styles/components/GBackTitle";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      width: "100%",
    },
    title: {
      marginBottom: 10,
    },
    link: {
      paddingLeft: theme.spacing(2),
      display: "block",
      textTransform: "capitalize",
      height: 51,
      lineHeight: "51px",
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.text.main,
      fontSize: 16,
      fontWeight: "bold",
      "&.no-border": {
        borderBottom: "none",
      },
      "&:hover": {
        color: theme.palette.text.main,
      },
      "& > svg.menu-icon": {
        float: "left",
        marginTop: 16,
        marginRight: 15,
        marginLeft: 5,
        verticalAlign: "top",
      },
      "& > svg.right-arrow": {
        float: "right",
        marginTop: 15,
        marginRight: 15,
        verticalAlign: "top",
      },
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
        marginLeft: 20,
        marginRight: 20,
        "& > svg.right-arrow": {
          marginRight: 0,
        },
      },
    },
    divider: {
      background: theme.input.background,
      height: 10,
      border: "none",
    },
  }),
);

export const MobileIndex = (props) => {
  const classes = useStyles();
  const {nickname} = props;
  const history = useHistory();

  const handleLogout = (e) => {
    e.preventDefault();
    GConfirmAlert({
      title: nickname,
      text: t("getter_fe.auth.common.logOutConfirm"),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.menu.common.logout"),
        type: "danger",
        callback: (close) => {
          toast.info(
            <NotifMessage message={t("getter_fe.auth.common.youLoggedOut")} />,
            {
              type: toast.TYPE.SUCCESS,
            },
          );
          setTimeout(() => {
            history.push(AppConsts.URL_LOGOUT);
          }, 1000);
          close();
        },
      },
      showCloseIcon: false,
    });

    return;
  };

  return (
    <div className={classes.wrapper}>
      <GBackTitle
        title={t("getter_fe.menu.common.settings")}
        className={classes.title}
        handleClick={() => history.push("/account")}
      />
      <Link
        to={`/settings/${AppConsts.URL_SETTINGS_INTERFACE_LANGUAGE}`}
        className={classes.link}
      >
        <LanguageIcon className="menu-icon" />
        {t("getter_fe.settings.common.interfaceLanguages")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`/settings/${AppConsts.URL_SETTINGS_CHANGE_PASSWORD}`}
        className={classes.link}
      >
        <PasswordIcon className="menu-icon" />
        {t("getter_fe.settings.common.changePassword")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`/settings/${AppConsts.URL_SETTINGS_PRIVACY}`}
        className={classes.link}
      >
        <PrivacyIcon className="menu-icon" />
        {t("getter_fe.settings.common.privacy")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={AppConsts.URL_LOGOUT}
        className={classes.link}
        onClick={(e) => handleLogout(e)}
      >
        <LogoutIcon className="menu-icon" />
        {t("getter_fe.menu.common.logout")}
        <RightArrowIcon className="right-arrow" />
      </Link>
    </div>
  );
};
