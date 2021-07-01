import {makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {AvatarLink} from "src/app/components/AvatarLink";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {t} from "../../../i18n/utils";
import {shortNum} from "src/util/NumberUtil";
import {Link} from "react-router-dom";
import AppConsts from "../../AppConsts";
import {ReactComponent as VerificationIcon} from "../../../assets/icons/feature/verification.svg";
import {ReactComponent as RightArrowIcon} from "../../../assets/icons/ico-right-arrow.svg";
import {ReactComponent as ProfileIcon} from "../../../assets/icons/ico-account-profile.svg";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ico-account-settings.svg";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ico-account-help.svg";
import {useEffect, useState} from "react";
import Global from "src/system/Global";

const useStyles = makeStyles((theme) => ({
  accountInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    height: 68,
    width: 68,
    border: "2px solid #fff",
    borderRadius: "50%",
    marginTop: 20,
    marginBottom: 13,
  },
  nickname: {
    maxWidth: "calc(100% - 10px)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: 600,
    fontSize: 28,
    lineHeight: "130%",
    letterSpacing: "0.3px",
    color: theme.palette.text.main,
    marginBottom: 6,
    padding: "0 20px",
  },
  icon: {
    width: theme.spacing(1.875),
    margin: theme.spacing(0, 0, 0, 0.5),
    height: "auto",
  },
  username: {
    height: 23,
    fontSize: 18,
    lineHeight: "130%",
    letterSpacing: "-0.4px",
    color: theme.palette.text.gray,
    marginBottom: 30,
  },
  followInfo: {
    display: "flex",
    width: "100%",
    marginBottom: theme.spacing(4),
    "& > div": {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      "&:not(:last-child):after": {
        content: "''",
        position: "absolute",
        right: -1,
        top: "5%",
        width: 1,
        height: "90%",
        backgroundColor: theme.palette.grey.A200,
      },
    },
    "& span.value": {
      fontSize: 17,
      letterSpacing: "-0.4px",
      fontWeight: "bold",
      color: theme.palette.text.main,
      height: 20,
      lineHeight: "20px",
      marginBottom: 6,
    },
    "& span.desc": {
      fontSize: 14,
      letterSpacing: "-0.2px",
      color: theme.palette.text.gray,
      height: 18,
      lineHeight: "130%",
    },
  },
  divider: {
    background: theme.input.background,
    height: 10,
    border: "none",
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
}));

export const AccountPage = ({userInfo, userId}) => {
  const classes = useStyles();
  const history = useHistory();
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);

  const api = Global.GetPortal().getAppService();

  useEffect(() => {
    const getFollowingAndFollowersCount = async () => {
      // need to hit api for proper following and followers count for some reason
      const res = await api.fetchUserInfo(userId);

      setFollowingCount(res.getFollowsCount(0));
      let flg = res?.data?.flg ? res?.data?.flg : 0;
      let twitter = res?.data?.twt_flg ? res?.data?.twt_flg : 0;
      setFollowerCount(flg * 1 + twitter * 1);
    };

    getFollowingAndFollowersCount();
  }, []);

  const profileName = userInfo.getNickname(true);
  const profileUserId = userInfo.getUsername();
  const profileUsername = userInfo.getOriginalUsername();
  const avatarUrl = userInfo.getIconUrl();
  const isInfluencer = userInfo.isInfluencer && userInfo.isInfluencer();

  return (
    <div>
      <div className={classes.accountInfo}>
        <AvatarLink
          avatarUrl={avatarUrl}
          styleClasses={classes.avatar}
          userId={profileUserId}
          username={profileName}
        />
        <p className={classes.nickname}>
          <GTwemoji text={profileName} />
          {isInfluencer > 0 && <VerificationIcon className={classes.icon} />}
        </p>
        <p className={classes.username}>{`@${profileUsername}`}</p>
        <div className={classes.followInfo}>
          <div onClick={() => history.push(`/user/${profileUserId}/following`)}>
            <span className="value">{shortNum(followingCount)}</span>
            <span className="desc">
              {t("getter_fe.profile.common.following")}
            </span>
          </div>
          <div onClick={() => history.push(`/user/${profileUserId}/followers`)}>
            <span className="value">{shortNum(followerCount)}</span>
            <span className="desc">
              {t("getter_fe.profile.common.followers")}
            </span>
          </div>
        </div>
      </div>
      <hr className={classes.divider} />
      <Link to={`/user/${profileUserId}`} className={classes.link}>
        <ProfileIcon className="menu-icon" />
        {t("getter_fe.menu.common.profile")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`/settings/${AppConsts.URL_SETTINGS_MOBILE_INDEX}`}
        className={classes.link}
      >
        <SettingsIcon className="menu-icon" />
        {t("getter_fe.menu.common.settings")}
        <RightArrowIcon className="right-arrow" />
      </Link>
      <Link
        to={`${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_MOBILE_INDEX}`}
        className={classes.link}
      >
        <HelpIcon className="menu-icon" />
        {t("getter_fe.menu.common.helpCenter")}
        <RightArrowIcon className="right-arrow" />
      </Link>
    </div>
  );
};
