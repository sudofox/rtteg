import React, {useEffect, useState} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Waypoint} from "react-waypoint";
import {uniq} from "lodash";
import {makeStyles, Tabs, Tab} from "@material-ui/core";
import Global from "src/system/Global";
import {FollowUserButton} from "../../components/FollowUserButton";
import {TabPanel} from "../../components/TabPanel";
import {AvatarLink} from "../../components/AvatarLink";
import {t} from "../../../i18n/utils";
import {GLoader} from "src/styles/components/GLoader";
import {GTypography} from "src/styles/components/GTypography";
import {FeedItem} from "src/app/components/post/comps/FeedItem";
import HoverPopup from "src/app/components/HoverPopup";
import {changeFollowingStatus} from "src/store/modules/status";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {ReactComponent as SmallArrowIcon} from "src/assets/icons/basic/small_arrow.svg";
import {connect} from "react-redux";
import GAxios from "src/util/GAxios";
import {parsePostFeed, parseUser} from "src/util/FeedUtils";

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxHeight: 600,
  height: `calc(100vh - 50px)`, // handle if the screen height is small
};

const useStyles = makeStyles((theme) => ({
  searchBoxWrapper: {
    padding: "0 23px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > div": {
      padding: "10px 0 9px",
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 20,
      "&.with-query": {
        display: "none",
      },
    },
  },
  backBtn: {
    marginRight: 20,
    cursor: "pointer",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  columnHeaderTitle: {
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  mobileColumnHeaderTitle: {
    display: "none",
    [theme.breakpoints.only("xs")]: {
      display: "block",
      textAlign: "center",
      paddingRight: 40,
      flex: 1,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  },
  tabs: {
    borderBottom: `2px solid ${theme.palette.line.grey_2}`,
    marginBottom: theme.spacing(1),
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#CC0000",
    },
  },

  tab: {
    color: "#505050",
    textTransform: "capitalize",
    fontSize: 18,
    lineHeight: "21px",
    letterSpacing: "-0.02em",
    opacity: 1,
    fontWeight: "bold",
    minWidth: "auto",
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

  columnHeader: {
    position: "sticky",
    display: "flex",
    alignItems: "center",
    top: "0",
    backgroundColor: "white",
    height: "56px",
    flexShrink: 0,
    fontSize: "19px",
    borderBottom: theme.notchedOutline.border,
    padding: "0px 15px",
    fontWeight: "bold",
  },

  headerContent: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(2),
  },

  headerIcon: {
    cursor: "pointer",
  },

  headerSubtitle: {
    fontSize: 16,
    color: theme.palette.background.gray,
  },

  menu: {
    display: "flex",
    height: 42,
    borderBottom: theme.notchedOutline.border,
  },

  menuItem: {
    display: "flex",
    width: "50%",
    textAlign: "center",
    fontWeight: theme.typography.fontWeightSemiBold,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.light,

    "&.active": {
      color: theme.palette.primary.main,
      borderBottomWidth: 2,
      borderBottomStyle: "solid",
      borderBottomColor: theme.palette.primary.main,
    },

    "&:not(.active)": {
      cursor: "pointer",
    },
  },

  resultTop: {
    backgroundColor: theme.palette.background.dark,
    "& .top-users, .top-hashtags, .top-news": {
      marginBottom: theme.spacing(1),
      "& .header": {
        display: "flex",
        alignItems: "center",
        padding: "19px 18px 0",
        marginBottom: 19,
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: "-0.005em",
        fontWeight: theme.typography.fontWeightBolder,
        // "& .view-all": {
        //   marginLeft: "auto",
        //   fontWeight: 600,
        //   cursor: "pointer",
        //   color: theme.palette.primary.main,
        //   "&.zh,&.tw": {
        //     fontWeight: 500,
        //     letterSpacing: "0.05em",
        //   },
        // },
      },
      "& .load-more": {
        // how many pixels from the bottom it should load more
        position: "absolute",
        bottom: 1500,
      },
    },
  },

  userListItem: {
    display: "flex",
    flexDirection: "row",
    margin: "15px 0",
    backgroundColor: "#FFF",
    boxShadow: "0px 0px 7px 6px rgba(0, 0, 0, 0.02)",
    borderRadius: 10,
    padding: "15px 16px",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: ({sidebar}) =>
        sidebar ? theme.palette.grey["A300"] : theme.palette.background.dark,
    },

    "& > .user-avatar": {
      width: 52,
      height: 52,
      border: `1px solid ${theme.palette.grey.A800}`,
    },

    "& .user-main": {
      display: "flex",
      alignItems: "center",
      //flexDirection: "column",
      width: "calc(100% - 68px)",
      marginLeft: 16,

      "& .user-info": {
        display: "flex",
        flexDirection: "row",
        width: "100%",

        "& .user-names": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          "& .nickname": {
            alignItems: "center",
            fontSize: 16,
            fontWeight: theme.typography.fontWeightBold,

            "& .user-avatar": {
              lineHeight: "24px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },

          "& .username": {
            color: theme.palette.text.secondary,
            fontSize: 15,
            fontWeight: theme.typography.fontWeightRegular,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",

            "&:before": {
              content: '"@"',
            },
          },
        },

        "& .action-button": {
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          //align-self: center,
        },
      },

      "& .description": {
        fontSize: 16,
        lineHeight: "22.4px",
        //paddingTop: 5,
        wordBreak: "break-word",
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
  },

  icon: {
    width: theme.spacing(1.875),
    margin: theme.spacing(0, 0, 0, 0.5),
    borderRadius: "100%",
  },

  hashtagListItem: {
    margin: "15px 0",
    padding: "15px 18px",
    background: "#FFF",
    borderRadius: 10,
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: `1px solid #FFF`,
    "&:hover": {
      background: "#EEEFF3",
      border: `1px solid #DFE1EA`,
    },
    "& .arrow": {
      position: "relative",
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      cursor: "pointer",
      height: "100%",
      "&.rotate": {
        transform: "rotate(225deg)",
      },
      "&:hover svg path": {
        fill: theme.palette.text.link,
      },
    },
  },
  tagname: {
    fontSize: 15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noResultContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "48px",
    alignItems: "center",
    "& h2": {
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center",
      padding: "0 16px",
      wordBreak: "break-word",
      fontWeight: 800,
      fontSize: 18,
      lineHeight: "21px",
      color: theme.palette.text.main,
      marginBottom: 10,
    },
    "& span": {
      fontSize: 16,
      lineHeight: "140%",
      color: theme.palette.text.secondary,
    },
  },

  resultUser: {
    marginBottom: theme.spacing(9.375),
    "& .load-more": {
      // how many pixels from the bottom it should load more
      position: "absolute",
      bottom: 500,
    },
  },
  resultHashtags: {
    "& .load-more": {
      // how many pixels from the bottom it should load more
      position: "absolute",
      bottom: 500,
    },
  },
}));

const [TAB_TOP, TAB_USERS, TAB_HASHTAGS] = [0, 1, 2];
const HASHTAGS_MAX = 20;
const USERS_MAX = 20;
const LOAD_MORE_CUTOFF_SIZE = 10;

const TOP_USERS_AND_HASHTAGS_MAX = 3;
const TOP_POSTS_MAX = 20;

const getTab = (query) => {
  if (!query) {
    return 0;
  }

  const firstChar = query[0];
  switch (firstChar) {
    case "@":
      return 1;
    case "#":
      return 2;
    default:
      return 0;
  }
};

const formatQuery = (query) => {
  if (!query) {
    return null;
  }

  if (query.startsWith("#") || query.startsWith("@")) {
    query = query.substring(1);
  }

  return query.toLowerCase();
};

const connector = connect((state) => {
  return {
    loggedinUserId: state.auth?.session?.userinfo?._id,
  };
});

export const NewSearchResult = connector(_NewSearchResult);

function _NewSearchResult({query, searchString, tab, loggedinUserId}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(getTab(query));
  const [loading, setLoading] = useState(false);
  const [userListItems, setUserListItems] = useState([]);
  const [userOffset, setUserOffset] = useState(0);
  const [hashtagListItems, setHashtagListItems] = useState([]);
  const [hashtagOffset, setHashtagOffset] = useState(0);
  const [postData, setPostData] = useState([]);
  const [userData, setUserData] = useState({});
  const [postOffset, setPostOffset] = useState(0);
  const [updater, setUpdater] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [moreHashtags, setMoreHashtags] = useState(true);
  const [moreUsers, setMoreUsers] = useState(true);
  const [morePosts, setMorePosts] = useState(true);
  const location = useLocation();

  const api = Global.GetPortal().getAppService();
  const phrase = formatQuery(query);

  const fetchUserListItems = async (fetchMore) => {
    if (!userListItems.length) {
      setLoading(true);
    } else if (!fetchMore) {
      return;
    }

    if (query) {
      let res;
      try {
        res = await api.searchUserResult(phrase, userOffset, USERS_MAX);
      } catch (err) {
        console.log(err);
        return;
      }

      const data = res && res.aux?.uinf;
      if (!data) {
        return;
      }

      setUserListItems([
        ...userListItems,
        ...Object.keys(data).map((key) => {
          const item = data[key];
          if (!item) return;
          return {
            nickname: item.nickname || item.ousername || item.username,
            username: item.ousername || item.username,
            avatar: item.ico,
            infl: item.infl,
          };
        }),
      ]);
      if (res.aux?.fws && Array.isArray(res.aux?.fws)) {
        res.aux?.fws.map((item) => {
          dispatch(
            changeFollowingStatus({
              userId: item,
              status: true,
            }),
          );
        });
      }
      setMoreUsers(Object.keys(data).length === USERS_MAX);
      // const hashtags = Object.keys(data).filter((item) => {
      //   return item.startsWith("#") === true;
      // });

      // setHashtagListItems(hashtags);
    } else {
      const res = await api.fetchSuggestedUsertags(0, USERS_MAX);
      const data = res.aux?.uinf;
      if (!data) {
        return;
      }
      setUserListItems(
        Object.keys(data).map((key) => {
          const item = data[key];
          return {
            nickname: item.nickname || item.ousername || item.username,
            username: item.ousername || item.username,
            avatar: item.ico,
            infl: item.infl,
          };
        }),
      );
      if (res.aux?.fws && Array.isArray(res.aux?.fws)) {
        res.aux?.fws.map((item) => {
          dispatch(
            changeFollowingStatus({
              userId: item,
              status: true,
            }),
          );
        });
      }
      setMoreUsers(Object.keys(data).length === USERS_MAX);
      // setHashtagListItems(data.map((item) => `#${item}`));
      // fetchHashtagListItems();
    }

    setUserOffset(userOffset + USERS_MAX);
  };

  const fetchHashtagListItems = async (fetchMore) => {
    if (!userListItems.length) {
      setLoading(true);
    } else if (!fetchMore) {
      setMoreHashtags(false);
      return;
    }

    if (query) {
      let res;
      try {
        res = await api.fetchSearchResultChoices(
          "#",
          phrase,
          hashtagOffset,
          HASHTAGS_MAX,
        );
      } catch (err) {
        console.log(err);
        setMoreHashtags(false);
        return;
      }

      const data = res.data.cats;
      if (!data) {
        setMoreHashtags(false);
        return;
      }
      setHashtagListItems(uniq([...hashtagListItems, ...Object.keys(data)]));
      setMoreHashtags(Object.keys(data).length === HASHTAGS_MAX);
    } else {
      const res = await api.fetchSuggestedHashtags(0, HASHTAGS_MAX);

      const data = res.data.list;
      if (!data) {
        setMoreHashtags(false);
        return;
      }

      setHashtagListItems(data.map((item) => `#${item}`));
      setMoreHashtags(data.length === HASHTAGS_MAX);
    }

    setHashtagOffset(HASHTAGS_MAX);
  };

  const getTopSearchResult = (phrase, offset, max, callback) => {
    const config = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/u/posts/srch/phrase`,
      data: {
        content: {
          q: phrase,
          offset,
          max,
        },
      },
    };
    GAxios(config, callback);
  };

  const fetchPostListItems = () => {
    if (postData.length > 0) {
      setLoading(true);
    }

    setErrorMsg("");

    if (query) {
      getTopSearchResult(phrase, 0, TOP_POSTS_MAX, (res) => {
        if (res?.data?.result?.data?.emsg) {
          setErrorMsg(res?.data?.result?.data?.emsg || "");
        }
        if (
          res?.data?.rc === "OK" &&
          res?.data?.result?.data?.list &&
          res?.data?.result?.aux
        ) {
          const list = res.data.result.data.list;
          const aux = res.data.result.aux;
          if (list && aux) {
            const nbrRemoved = aux.removed ? aux.removed : 0;
            const posts = parsePostFeed(list, aux) || [];
            setPostData(posts);
            setUserData(parseUser(aux) || {});
            setMorePosts(posts.length + nbrRemoved + 1 > TOP_POSTS_MAX);
          }
        }
      });
    }
    setPostOffset(TOP_POSTS_MAX);
  };

  useEffect(() => {
    const clearState = () => {
      setUserListItems([]);
      setHashtagListItems([]);
      setPostData([]);
      setUserData({});
      setUserOffset(0);
      setHashtagOffset(0);
      setPostOffset(0);
    };

    clearState();

    setTabValue(parseInt(tab) || getTab(query));
    setUpdater(query);
  }, [searchString]);

  useEffect(() => {
    if (updater !== "") {
      (async () => {
        switch (tabValue) {
          case TAB_USERS:
            await fetchUserListItems();
            break;
          case TAB_HASHTAGS:
            await fetchHashtagListItems();
            break;
          default:
            await fetchUserListItems();
            await fetchHashtagListItems();
            fetchPostListItems();
            break;
        }
        setLoading(false);
      })();
    }
  }, [tabValue, updater]);

  const fetchMorePostListItems = () => {
    getTopSearchResult(phrase, postOffset, TOP_POSTS_MAX, (res) => {
      if (
        res?.data?.rc === "OK" &&
        res?.data?.result?.data?.list &&
        res?.data?.result?.aux
      ) {
        const list = res.data.result.data.list;
        const aux = res.data.result.aux;
        if (list && aux) {
          const nbrRemoved = aux.removed ? aux.removed : 0;
          const newPosts = parsePostFeed(list, aux) || [];
          const newUsers = parseUser(aux) || {};
          setPostData([...postData, ...newPosts]);
          setUserData({...userData, ...newUsers});
          setMorePosts(postData.length + nbrRemoved + 1 > TOP_POSTS_MAX);
          setPostOffset((offset) => offset + TOP_POSTS_MAX);
        }
      }
    });
  };

  let hashtagBody = <GLoader wrapperStyle={wrapperStyle} />;
  let userBody = <GLoader wrapperStyle={wrapperStyle} />;
  let postBody = <GLoader wrapperStyle={wrapperStyle} />;

  if (!loading) {
    hashtagBody = (
      <div className={classes.resultHashtags}>
        {hashtagListItems.map(
          (hashtagListItem, index) =>
            hashtagListItem.startsWith("#") && (
              <Link
                key={hashtagListItem + index}
                className={classes.hashtagListItem}
                to={`/hashtag/${encodeURIComponent(hashtagListItem)}`}
              >
                <GTypography className={classes.tagname} isBold>
                  {hashtagListItem}
                </GTypography>
                <div className="arrow rotate">
                  <SmallArrowIcon />
                </div>
              </Link>
            ),
        )}
        {moreHashtags ? (
          <div className="load-more">
            <Waypoint
              scrollableAncestor={window}
              fireOnRapidScroll
              onEnter={() => fetchHashtagListItems(true)}
            />
          </div>
        ) : null}
        {query && !hashtagListItems.length ? (
          <div className={classes.noResultContainer}>
            <h2>
              {t("getter_fe.searchPage.noResult.label")} #{phrase}
            </h2>
            <span>{t("getter_fe.searchPage.noResult.comment")}</span>
          </div>
        ) : null}
      </div>
    );

    userBody = (
      <div className={classes.resultUser}>
        {userListItems.map(
          (userListItem, index) =>
            !!userListItem && (
              <div
                key={index}
                className={classes.userListItem}
                onClick={() => history.push(`/user/${userListItem.username}`)}
              >
                <HoverPopup
                  userId={userListItem.username}
                  userInfoTemp={userListItem}
                >
                  <div key="popup-handler" className="user-avatar">
                    <AvatarLink
                      className={classes.avatar}
                      avatarUrl={userListItem.avatar}
                      styleClasses="user-avatar"
                      userId={userListItem.username}
                      username={userListItem.nickname}
                    />
                  </div>
                </HoverPopup>
                <div className="user-main">
                  <div className="user-info">
                    <div className="user-names">
                      <div className="nickname">
                        <HoverPopup
                          userId={userListItem.username}
                          userInfoTemp={userListItem}
                        >
                          <div key="popup-handler" className="user-avatar">
                            {userListItem.nickname}
                          </div>
                          {/* The API doesn't return infl info. */}
                          {userListItem.infl && (
                            <VerificationIcon className={classes.icon} />
                          )}
                        </HoverPopup>
                      </div>
                      <div className="username">{userListItem.username}</div>
                    </div>
                    <div className="action-button">
                      <FollowUserButton
                        userId={userListItem.username}
                        username={userListItem.nickname}
                      />
                    </div>
                  </div>
                </div>
                {moreUsers &&
                index === userListItems.length - LOAD_MORE_CUTOFF_SIZE ? (
                  <div className="load-more">
                    <Waypoint
                      scrollableAncestor={window}
                      fireOnRapidScroll
                      onEnter={() => fetchUserListItems(true)}
                    />
                  </div>
                ) : null}
              </div>
            ),
        )}

        {query && !userListItems.length ? (
          <div className={classes.noResultContainer}>
            <h2>
              {t("getter_fe.searchPage.noResult.label")} @{phrase}
            </h2>
            <span>{t("getter_fe.searchPage.noResult.comment")}</span>
          </div>
        ) : null}
      </div>
    );

    const isEmpty =
      !userListItems.length && !hashtagListItems.length && !postData.length;

    postBody = (
      <div className={classes.resultTop}>
        {isEmpty ? (
          <div className={classes.noResultContainer}>
            <h2>
              {t("getter_fe.searchPage.noResult.label")} {query}
            </h2>
            <span>{t("getter_fe.searchPage.noResult.comment")}</span>
          </div>
        ) : (
          <>
            {userListItems.length ? (
              <div className="top-users" onClick={() => setTabValue(TAB_USERS)}>
                <div className="header">
                  {t("getter_fe.searchPage.common.people")}
                  {/* <GTypography
                    className={clsx(getLang(), "text-link", "view-all")}
                    variant="body2"
                  >
                    {t("getter_fe.searchPage.common.viewAll")}
                  </GTypography> */}
                </div>

                {userListItems.slice(0, TOP_USERS_AND_HASHTAGS_MAX).map(
                  (userListItem, index) =>
                    !!userListItem && (
                      <div
                        key={index}
                        className={classes.userListItem}
                        onClick={() =>
                          history.push(`/user/${userListItem.username}`)
                        }
                      >
                        <HoverPopup
                          userId={userListItem.username}
                          userInfoTemp={userListItem}
                        >
                          <div key="popup-handler" className="user-avatar">
                            <AvatarLink
                              className={classes.avatar}
                              avatarUrl={userListItem.avatar}
                              styleClasses="user-avatar"
                              userId={userListItem.username}
                              username={userListItem.nickname}
                            />
                          </div>
                        </HoverPopup>
                        <div className="user-main">
                          <div className="user-info">
                            <div className="user-names">
                              <div className="nickname">
                                <HoverPopup
                                  userId={userListItem.username}
                                  userInfoTemp={userListItem}
                                >
                                  <div
                                    key="popup-handler"
                                    className="user-avatar"
                                  >
                                    {userListItem.nickname}
                                  </div>
                                </HoverPopup>
                              </div>
                              <div className="username">
                                {userListItem.username}
                              </div>
                            </div>
                            <div className="action-button">
                              <FollowUserButton
                                userId={userListItem.username}
                                username={userListItem.nickname}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                )}
              </div>
            ) : null}

            {hashtagListItems.length ? (
              <div
                className="top-hashtags"
                onClick={() => setTabValue(TAB_HASHTAGS)}
              >
                <div className="header">
                  {t("getter_fe.searchPage.common.hashtags")}
                  {/* <GTypography
                    className={clsx(getLang(), "text-link", "view-all")}
                    variant="body2"
                  >
                    {t("getter_fe.searchPage.common.viewAll")}
                  </GTypography> */}
                </div>

                {hashtagListItems.slice(0, TOP_USERS_AND_HASHTAGS_MAX).map(
                  (hashtagListItem, index) =>
                    hashtagListItem.startsWith("#") && (
                      <Link
                        key={hashtagListItem + index}
                        className={classes.hashtagListItem}
                        to={`/hashtag/${encodeURIComponent(hashtagListItem)}`}
                      >
                        <GTypography className={classes.tagname} isBold>
                          {hashtagListItem}
                        </GTypography>
                        <div className="arrow rotate">
                          <SmallArrowIcon />
                        </div>
                      </Link>
                    ),
                )}
              </div>
            ) : null}

            {postData.length > 0 && (
              <div className="top-news">
                <div className="header">{"Posts"}</div>
                {postData.map((item) => {
                  const {uid, id, originUser, embedPost, embedUser} = item;
                  const user = uid ? userData[uid] : null;
                  const originalUser = originUser ? userData[originUser] : null;
                  const embededUser = embedUser ? userData[embedUser] : null;
                  return (
                    <FeedItem
                      key={id + uid}
                      scene="search"
                      item={item}
                      user={user}
                      originalUser={originalUser}
                      embededPost={embedPost}
                      embededUser={embededUser}
                      loggedinUserId={loggedinUserId}
                      hideMore
                    />
                  );
                })}
                {morePosts ? (
                  <div className="load-more">
                    <Waypoint
                      scrollableAncestor={window}
                      onEnter={() => fetchMorePostListItems()}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* <div className={clsx(classes.searchBoxWrapper, query && "with-query")}>
        <IconBack
          className={classes.backBtn}
          onClick={() => {
            history.goBack();
          }}
        />
        <PostSearchBoxNew />
      </div>
      {query && (
        <ColumnHeader history={history}>
          <div className={classes.mobileColumnHeaderTitle}>{query}</div>
          <div className={classes.columnHeaderTitle}>
            {t("getter_fe.searchPage.common.searchResults")}
          </div>
        </ColumnHeader>
      )} */}

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => {
          e.preventDefault();
          setTabValue(newValue);
          const params = !window.location.search
            ? ""
            : window.location.search.substring(1).replace(/&?tab=[^&]+/, "");
          const newLocation = `${location.pathname}?${params}&tab=${newValue}`;

          history.push(newLocation);
        }}
        className={classes.tabs}
      >
        <Tab
          label={t("getter_fe.searchPage.common.top")}
          {...a11yProps(0)}
          className={classes.tab}
          disableRipple={true}
        />
        <Tab
          label={t("getter_fe.searchPage.common.people")}
          {...a11yProps(1)}
          className={classes.tab}
          disableRipple={true}
        />
        <Tab
          label={t("getter_fe.searchPage.common.hashtags")}
          {...a11yProps(2)}
          className={classes.tab}
          disableRipple={true}
        />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {postBody}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {userBody}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {hashtagBody}
      </TabPanel>
    </>
  );
}
