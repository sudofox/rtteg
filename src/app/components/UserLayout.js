import React, {useState} from "react";
import {useHistory, Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {t} from "../../i18n/utils";
import HoverPopup from "../components/HoverPopup";
import {AvatarLink} from "../components/AvatarLink";
import {ReactComponent as VerificationIcon} from "../../assets/icons/feature/verification.svg";
import clsx from "clsx";
import {FollowUserButton} from "../components/FollowUserButton";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {shortNum} from "src/util/NumberUtil";
import {
  STATUS_FOLLOWING,
  STATUS_NOT_FOLLOWING,
} from "src/core/model/social/XMFollow";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  clickButton: {
    position: "absolute",
    top: "50%",
    right: 20,
    transform: "translate(0, -50%)",
  },
  card: {
    cursor: "pointer",
    display: "flex",
    margin: "15px 0",
    backgroundColor: "#FFF",
    boxShadow: "0px 0px 7px 6px rgba(0, 0, 0, 0.02)",
    borderRadius: 10,
    padding: "15px 16px",
    "&:hover": {
      backgroundColor: ({sidebar}) =>
        sidebar ? theme.palette.grey["A300"] : theme.palette.background.dark,
    },
  },
  userInfoContainer: {
    paddingRight: 4,
    maxWidth: "calc(100% - 100px)",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "calc(100% - 77px)",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(6.25),
    height: theme.spacing(6.25),
    marginLeft: theme.spacing(2.125),
    marginRight: theme.spacing(1.25),
    cursor: "pointer",
  },
  userAvatarContainer: {
    display: "flex",
  },
  number: {
    display: "flex",
    alignItems: "center",
    "& > div": {
      maxWidth: "100%",
    },
  },
  displayName: {
    marginBottom: 2,
    fontSize: 15,
    lineHeight: "19.09px",
    fontWeight: 600,
    color: theme.palette.text.main,
    letterSpacing: "0.01em",
    // textTransform: "capitalize",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: (props) => (props.sidebar ? "inline-block" : "inline-block"),
    maxWidth: (props) => (props.sidebar ? 119 : 360),
    [theme.breakpoints.down("md")]: {
      maxWidth: (props) => (props.sidebar ? 90 : 360),
    },
    "& svg": {
      marginTop: -2,
      verticalAlign: "middle",
    },
  },
  userIdWrapper: {
    display: "grid",
    marginTop: theme.spacing(0.375),
  },
  userId: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "17px",
    color: theme.palette.secondary.light,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
    maxWidth: (props) => (props.sidebar ? 119 : 400),
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
      maxWidth: (props) => (props.sidebar ? 50 : 400),
    },
  },
  icon: {
    width: theme.spacing(1.875),
    margin: theme.spacing(0, 0, 0, 0.5),
    borderRadius: "100%",
  },
  btn: {
    height: theme.spacing(4),
    minHeight: theme.spacing(4),
    minWidth: 90,
    textTransform: "capitalize",
    padding: theme.spacing(1),
    "& .MuiButton-label": {
      fontSize: 16,
      fontWeight: "bold",
    },
  },
  numberPage: {
    fontWeight: "normal",
    fontSize: 15,
    lineHeight: "15px",
    color: theme.palette.secondary.light,
  },
}));

export const UserLayout = ({
  userInfo,
  sidebar,
  isPage,
  isProfile,
  suggestFollow = null,
  disableHistoryPush,
}) => {
  const classes = useStyles({sidebar});

  const [followStatus, setFollowStatus] = useState(userInfo.isFollowing);

  const getUserStatus = (status) => {
    setFollowStatus(status);
  };

  const getTotalFollowers = () => {
    let flg = userInfo.flg ? userInfo.flg : 0;
    let twitter = userInfo.twt_flg ? userInfo.twt_flg : 0;
    return shortNum(flg * 1 + twitter * 1);
  };

  return (
    <>
      {userInfo && (
        <div className={classes.container}>
          <Link className={classes.card} to={`/user/${userInfo._id}`}>
            <div className={classes.left}>
              <HoverPopup
                userId={userInfo._id}
                userInfoTemp={userInfo}
                getUserStatus={getUserStatus}
              >
                <div key="popup-handler" className="user-avatar">
                  <AvatarLink
                    avatarUrl={userInfo.ico}
                    styleClasses={classes.avatar}
                    userId={userInfo._id}
                    username={userInfo.nickname}
                    disableHistoryPush={disableHistoryPush}
                  />
                </div>
              </HoverPopup>
            </div>
            <div className={classes.right}>
              <div className={classes.userInfoContainer}>
                <div className={classes.displayNameWrapper}>
                  <HoverPopup
                    userId={userInfo._id}
                    userInfoTemp={userInfo}
                    getUserStatus={getUserStatus}
                    leftAligned={true}
                  >
                    <div
                      key="popup-handler"
                      className={clsx(
                        classes.userAvatarContainer,
                        "user-avatar",
                      )}
                    >
                      <span className={classes.displayName}>
                        <GTwemoji text={userInfo.nickname || userInfo._id} />
                        {userInfo.infl && (
                          <VerificationIcon className={classes.icon} />
                        )}
                      </span>
                    </div>
                  </HoverPopup>
                </div>
                <div className={classes.numberWrapper}>
                  <span
                    className={clsx(
                      classes.number,
                      isPage ? classes.numberPage : "",
                    )}
                  >
                    {isProfile
                      ? `@${userInfo.ousername || userInfo.username}`
                      : `${getTotalFollowers()} ${t(
                          "getter_fe.profile.common.followers",
                        )}`}
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <div className={classes.clickButton}>
            <FollowUserButton
              userId={userInfo._id}
              username={
                userInfo.nickname || userInfo.ousername || userInfo.username
              }
              suggestFollow={() => suggestFollow && suggestFollow(userInfo._id)}
            />
          </div>
        </div>
      )}
    </>
  );
};
