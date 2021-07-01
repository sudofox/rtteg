import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import {FollowUserButton} from "../../components/FollowUserButton";
import {AvatarLink} from "../../components/AvatarLink";
import {ReactComponent as VerificationIcon} from "../../../assets/icons/feature/verification.svg";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {t} from "src/i18n/utils";
import {shortNum} from "src/util/NumberUtil";
import clsx from "clsx";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 290,
    background: theme.palette.background.default,
    borderRadius: "10px",
    border: `1px solid ${theme.palette.grey.A800}`,
    boxShadow: "0px 0px 11px rgba(86, 103, 121, 0.19)",
    padding: theme.spacing(2.5),
    fontSize: "16px",
    fontWeight: 400,
    whiteSpace: "normal",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "100%",
    cursor: "pointer",
  },
  nickname: {
    color: theme.palette.text.primary,
    fontWeight: "bold",
    cursor: "pointer",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  secondaryText: {
    color: theme.palette.text.gray,
  },
  follow: {
    marginTop: "16px",
    paddingBottom: "4px",
  },
  followText: {
    color: theme.palette.text.primary,
    fontWeight: "bold",
    marginRight: "5px",
    fontSize: "14px",
    cursor: "pointer",
  },
  icon: {
    width: 16,
    height: 16,
    margin: theme.spacing(0, 0, 0, 0.5),
    borderRadius: "100%",
    paddingTop: theme.spacing(0.25),
  },
  description: {
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
    lineHeight: "19.5px",
    fontSize: 15,
  },
  followingName: {
    cursor: "pointer",
    letterSpacing: "0.01em",
    fontWeight: "500",
  },
  followersName: {
    cursor: "pointer",
    letterSpacing: "0.01em",
    fontWeight: "500",
  },
  followAndFollowingContainer: {
    borderBottom: `1px solid transparent`,
    fontSize: 14,
    "&:hover": {
      borderBottom: `1px solid ${theme.palette.text.primary}`,
    },
  },
}));

const UserProfilePopup = ({userId, userInfo, getUserStatus = null}) => {
  const classes = useStyles();
  const history = useHistory();

  if (userInfo === null) return null;
  const getTotalFollowers = () => {
    let flg = userInfo.data?.flg ? userInfo.data?.flg : 0;
    let twitter = userInfo.data?.twt_flg ? userInfo.data?.twt_flg : 0;
    return shortNum(flg * 1 + twitter * 1);
  };

  const gotoFollowers = (e) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/user/${userId}/followers`);
  };

  const gotoFollowing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/user/${userId}/following`);
  };

  return (
    <div
      className={classes.root}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <AvatarLink
          avatarUrl={userInfo.getAvatarUrl()}
          styleClasses={classes.avatar}
          userId={userId}
          username={userInfo.getNickname()}
        />
        <div>
          <FollowUserButton
            userId={userId}
            compName={userId + "flwg"}
            getUserStatus={getUserStatus}
            username={
              userInfo.data.nickname ||
              userInfo.data.ousername ||
              userInfo.data.username
            }
            isPopup={true}
            scene="public-user-view"
          />
        </div>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <span className={classes.nickname}>
            <GTwemoji text={userInfo.getNickname()} />
          </span>
          {userInfo.isInfluencer && userInfo.isInfluencer() > 0 && (
            <VerificationIcon className={classes.icon} />
          )}
        </Box>
        <Box display="flex" className={classes.secondaryText}>
          @{userInfo.data.ousername || userInfo.data.username}
        </Box>
      </Box>

      {/* @TODO find out why empty values are the string "null" on user object */}
      {userInfo.getDescription() && userInfo.getDescription() !== "null" ? (
        <Box mt={2} className={classes.description}>
          <GTwemoji text={userInfo.getDescription()} size={18} />
        </Box>
      ) : null}

      <Box className={classes.follow} display="flex">
        <Box mr={2} className={classes.followAndFollowingContainer}>
          <span
            className={classes.followText}
            onClick={(e) => gotoFollowing(e)}
          >
            {shortNum(userInfo.getFollowsCount() || 0)}
          </span>
          <span
            className={clsx(classes.secondaryText, classes.followingName)}
            onClick={(e) => gotoFollowing(e)}
          >
            {t("getter_fe.profile.common.following")}
          </span>
        </Box>

        <Box className={classes.followAndFollowingContainer}>
          <span
            className={classes.followText}
            onClick={(e) => gotoFollowers(e)}
          >
            {getTotalFollowers()}
          </span>
          <span
            className={clsx(classes.secondaryText, classes.followersName)}
            onClick={(e) => gotoFollowers(e)}
          >
            {t("getter_fe.profile.common.followers")}
          </span>
        </Box>
      </Box>
    </div>
  );
};

export default UserProfilePopup;
