import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {UserLayout} from "src/app/components/UserLayout";
import {makeStyles} from "@material-ui/core/styles";
import {Waypoint} from "react-waypoint";
import {t} from "../../../../i18n/utils";
import {shortNum} from "src/util/NumberUtil";
import {Loader} from "../../settings/Loader";
import {useHistory} from "react-router-dom";
import {NoDataMessage} from "../../settings/NoDataMessage";
import {changeFollowingStatus} from "src/store/modules/status";
import GAxios from "src/util/GAxios";
import {Tab, Tabs} from "@material-ui/core";
import {TabPanel} from "src/app/components/TabPanel";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: "100%",
  },
  twitterFollower: {
    width: "100%",
    padding: "10px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F2F9FF",
    margin: "15px 0",
    "& span": {
      padding: "0px",
      fontSize: "13px",
      lineHeight: "130%",
      color: "#5C7192",
    },
  },
  tabs: {
    position: "sticky",
    top: 60,
    backgroundColor: "#f7f8f9",
    zIndex: 2,
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#CC0000",
    },
  },
  tab: {
    textTransform: "capitalize",
    fontSize: 18,
    lineHeight: "21px",
    letterSpacing: "-0.02em",
    opacity: 1,
    fontWeight: "bold",
    minWidth: "auto",
    "&:hover": {
      "& .MuiTab-wrapper": {
        opacity: 1,
        color: "#CC0000",
      },
    },
    "&.Mui-selected": {
      color: "#CC0000",
    },
    "& .MuiTab-wrapper": {
      opacity: 0.5,
      color: theme.palette.text.gray,
    },
    "&.Mui-selected .MuiTab-wrapper": {
      opacity: 1,
      color: "#CC0000",
    },
  },
}));

const FOLLOWING = "FOLLOWING";
const maxPerPage = 10;

export const FollowFeed = ({userId, currentUserId, twtFlg, content}) => {
  const classes = useStyles();
  const history = useHistory();

  const tabValue = content === FOLLOWING ? 0 : 1;

  const handleRedirect = (newValue) => {
    newValue === 0
      ? history.replace(`/user/${userId}/following`)
      : history.replace(`/user/${userId}/followers`);
  };

  const getTWTFollowers = () => {
    let twitter = twtFlg || 0;
    return shortNum(twitter * 1);
  };

  return (
    <div className={classes.wrapper}>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => {
          e.preventDefault();
          handleRedirect(newValue);
        }}
        className={classes.tabs}
      >
        <Tab
          label={t("getter_fe.profile.common.following")}
          className={classes.tab}
          disableRipple={true}
        />
        <Tab
          label={t("getter_fe.profile.common.followers")}
          className={classes.tab}
          disableRipple={true}
        />
      </Tabs>

      <TabPanel value={tabValue} index={1}>
        <Feed content={content} currentUserId={currentUserId} userId={userId} />
      </TabPanel>
      <TabPanel value={tabValue} index={0}>
        {getTWTFollowers() !== 0 && (
          <div className={classes.twitterFollower}>
            <span>
              {t("getter_fe.profile.common.twitterFollowers", {
                userId,
                number: getTWTFollowers(),
              })}
            </span>
          </div>
        )}
        <Feed content={content} currentUserId={currentUserId} userId={userId} />
      </TabPanel>
    </div>
  );
};

const Feed = ({content, currentUserId, userId}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [items, setItems] = useState(null);
  const dispatch = useDispatch();

  const type = content === FOLLOWING ? "followings" : "followers";
  const offset = pageNumber * maxPerPage;
  const reachedEnd = offset > items?.length;

  useEffect(() => {
    const fetchFollowers = () => {
      const config = {
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/${type}/?offset=${offset}&max=${maxPerPage}&incl=userstats|userinfo|followings`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      GAxios(
        config,
        (res) => {
          setItems([
            ...(items ? items : []),
            ...(res?.data?.result?.data?.list.map(
              (userId) => res.data.result.aux?.uinf[userId],
            ) ?? []),
          ]);

          res.data?.result?.aux?.fws?.forEach((userId) =>
            dispatch(
              changeFollowingStatus({
                userId,
                status: true,
              }),
            ),
          );
        },
        (err) => console.log(err),
      );
    };

    fetchFollowers();
  }, [pageNumber, type, userId]);

  return (
    <>
      {items?.length === 0 &&
        (currentUserId === userId ? (
          <NoDataMessage
            title={
              content === FOLLOWING
                ? t("getter_fe.profile.common.noFollowingTitle")
                : t("getter_fe.profile.common.noFollowersTitle")
            }
            message={
              content === FOLLOWING
                ? t("getter_fe.profile.common.noFollowingDescription")
                : t("getter_fe.profile.common.noFollowersDescription")
            }
          />
        ) : (
          <NoDataMessage
            title={
              content === FOLLOWING
                ? t("getter_fe.profile.common.otherUserNoFollowingTitle")
                : t("getter_fe.profile.common.otherUserNoFollowersTitle")
            }
            message={
              content === FOLLOWING
                ? t("getter_fe.profile.common.otherUserNoFollowingDescription")
                : t("getter_fe.profile.common.otherUserNoFollowersDescription")
            }
          />
        ))}
      {items ? (
        <>
          {items.map((user) => (
            <UserLayout userInfo={user} isPage isProfile />
          ))}
          {reachedEnd ? null : (
            <div style={{position: "relative", bottom: 64}}>
              <Waypoint
                scrollableAncestor={window}
                fireOnRapidScroll={false}
                onEnter={() =>
                  setPageNumber((oldPageNumber) => oldPageNumber + 1)
                }
              />
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default FollowFeed;
