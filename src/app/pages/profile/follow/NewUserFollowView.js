import {makeStyles} from "@material-ui/core";
import {useEffect, useState} from "react";
import {GBackTitle} from "src/styles/components/GBackTitle";
import Global from "src/system/Global";
import {useHistory} from "react-router-dom";
import {FollowFeed} from "./FollowFeed";

const useStyles = makeStyles((theme) => ({
  userProfileDetails: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #C4C4C4",
  },
  columnHeader: {
    position: "sticky",
    display: "flex",
    alignItems: "center",
    top: "0",
    zIndex: 100,
    backgroundColor: "white",
    height: "56px",
    flexShrink: 0,
    fontSize: "19px",
    borderBottom: "1px solid var(--border-color)",
    padding: "0px 15px",
    fontWeight: "bold",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(2),
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.palette.background.gray,
  },
  userBannerImage: {
    height: 136,
    backgroundColor: "#DEDEDE",
  },
  userProfileContent: {
    marginLeft: 20,
    marginRight: 20,
  },
  userProfile__top: {
    display: "flex",
    position: "relative",
    justifyContent: "space-between",
    height: 50,
  },
  userProfileAvatar: {
    cursor: "pointer",
    transform: "translateY(-15px)",
    "& > div": {
      borderRadius: "50%",
    },
  },
  userProfileNickname: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userProfileUsername: {
    lineHeight: "16px",
    color: "#999999",
  },
  userProfileStats: {
    marginTop: 10,
  },
  userSubtext: {
    color: "#999999",
  },
  userStatsContainer: {
    display: "flex",
    marginTop: 15,
    marginBottom: 29,
    " & div:first-child": {
      marginRight: theme.spacing(3),
    },
  },
  userStatsCount: {
    fontWeight: 700,
    color: "#333333",
    marginRight: 5,
  },
  userStatsText: {
    fontWeight: 400,
  },
  userProfileSubtitle: {
    marginTop: 15,
  },
  leftDashBoardWrapper: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  explorSideBarWrapper: {
    [theme.breakpoints.down("sm")]: {
      display: "none!important",
    },
  },
}));

export const NewUserFollowView = ({userId, content}) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState(null);
  const history = useHistory();
  const api = Global.GetPortal().getAppService();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setUserInfo(null);
      try {
        const res = await api.fetchUserInfo(userId);
        setUserInfo(res);
        return true;
      } catch (err) {
        console.log(err);
        history.push("/account-doesnt-exist");
      }
    };

    (async () => {
      await fetchUserInfo();
    })();
  }, [userId]);

  let bodyComp = null;
  if (userInfo) {
    const profileName = userInfo.getNickname(true);
    const profileOriginalUsername =
      userInfo.getOriginalUsername() || userInfo.getUsername();
    const currentUserId = api.getUserId();

    bodyComp = (
      <>
        <GBackTitle
          title={profileName}
          subTitle={`@${profileOriginalUsername}`}
          showVIcon={userInfo.data.infl}
        />
        <FollowFeed
          userId={userId}
          currentUserId={currentUserId}
          twtFlg={userInfo?.data?.twt_flg}
          content={content}
        />
      </>
    );
  }

  return <div className={classes.leftDashBoardWrapper}>{bodyComp}</div>;
};
