import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

import {cacheI18nT} from "src/i18n/utils";
import {Link} from "react-router-dom";
import AppConsts from "src/app/AppConsts";
import {ReactComponent as RightArrowIcon} from "src/assets/icons/basic/forward_arrow.svg";
import {GBackTitle} from "src/styles/components/GBackTitle";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      width: "100%",
      borderLeft: "1px solid #E8E9EA",
    },
    link: {
      paddingLeft: theme.spacing(2),
      display: "block",
      textTransform: "capitalize",
      height: 51,
      lineHeight: "51px",
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.text.main,
      fontSize: 17,
      fontWeight: "500",
      overflow: "hidden",
      "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
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
  }),
);

export const HelpCenterMobileIndex = () => {
  const classes = useStyles();
  const history = useHistory();
  const {t} = useTranslation();

  useEffect(() => {
    cacheI18nT(t);
  }, []);

  return (
    <div className={classes.wrapper}>
      <GBackTitle
        title={t("getter_fe.menu.common.helpCenter")}
        handleClick={() => history.push("/account")}
      />
      <Link
        to={`${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_REGISTRATION}`}
        className={classes.link}
      >
        {t("getter_fe.helpCenter.common.registration")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_POST_REPOST_REPLY}`}
        className={classes.link}
      >
        {t("getter_fe.helpCenter.common.postRepostReply")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_SHARE}`}
        className={classes.link}
      >
        {t("getter_fe.helpCenter.common.share")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_CONTACTUS}`}
        className={`${classes.link} no-border`}
      >
        {t("getter_fe.helpCenter.common.contactUs")}
        <RightArrowIcon className="right-arrow" />
      </Link>
    </div>
  );
};
