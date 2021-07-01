import React, {useState, useEffect, useRef} from "react";
import {useMediaQuery, useTheme} from "@material-ui/core";
import {connect} from "react-redux";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import {t, getLang} from "../../i18n/utils";
import {GTypography} from "../../styles/components/GTypography";
import {UserCard} from "./UserCard";
import IconButton from "@material-ui/core/IconButton";
import {ReactComponent as ArrowLeftIcon} from "src/assets/icons/slideLeftArrow.svg";
import {ReactComponent as ArrowRightIcon} from "src/assets/icons/slideRightArrow.svg";
import GAxios from "src/util/GAxios";
import {
  setPuIsLoading,
  setPuReachEnd,
  setPuOffset,
  setPuData,
  setPuTotalCount,
  setPuRemovedCount,
} from "src/app/components/timeline/store";

const CARD_LENGTH = 8;
const CARD_WIDTH = 162;
const CARD_GAP = 10;
const SCROLL_WIDTH = 172;

const getRequestUrl = (reqUrl) => {
  if (reqUrl.path && reqUrl.query) {
    const querystring = require("querystring");
    const _query = querystring.stringify(reqUrl.query);
    return reqUrl.path + _query;
  }
  return "";
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
    width: "100%",
    marginTop: 30,
    "& .section-header": {
      padding: 0,
      height: 48,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 20,
      fontWeight: 800,
      borderBottom: theme.notchedOutline.border,
    },
    "& .slideArrow": {
      visibility: "hidden",
    },
    "&:hover": {
      "& .slideArrow": {
        visibility: "visible",
      },
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  viewMore: {
    color: theme.blue.light,
    position: "relative",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
  },
  sectionHeader: {
    width: "100%",
    marginBottom: theme.spacing(1),
    borderBottom: "unset !important",
    "&.zh,&.tw": {
      fontWeight: "600 !important",
      letterSpacing: "0.05em",
    },
  },
  sectionBody: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    minHeight: theme.spacing(28),
    maxHeight: theme.spacing(28),
    marginBottom: theme.spacing(3.75),
  },
  sectionWrapper: {
    width: "100%",
    position: "relative",
    display: "grid",
    gridTemplateColumns: `repeat(${CARD_LENGTH}, ${
      CARD_WIDTH + CARD_GAP + "px"
    })`,
    overflow: "hidden",
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  sectionCard: {
    width: CARD_WIDTH + "px",
    position: "relative",
    display: "grid",
    gridTemplateColumns: CARD_WIDTH + "px",
    gridColumnGap: CARD_GAP + "px",
    "& #hoverPopup": {
      overflow: "visible",
    },
  },
  slideLeftArrow: {
    position: "absolute",
    zIndex: 99,
    top: "calc(50% + 10px)",
    left: "-19px",
    padding: theme.spacing(1.5, 1.75),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    transform: "matrix(1, 0, 0, -1, 0, 0)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    "& svg": {
      color: theme.palette.text.disabled,
    },
  },
  slideRightArrow: {
    position: "absolute",
    zIndex: 99,
    top: "calc(50% + 10px)",
    right: "-19px",
    padding: theme.spacing(1.5, 1.75),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    transform: "matrix(1, 0, 0, -1, 0, 0)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    "& svg": {
      color: theme.palette.text.disabled,
    },
  },
  skeletonCard: {
    textAlign: "center",
    position: "relative",
    width: "100%",
    height: "auto",
    display: "block",
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2.5),
    backgroundColor: theme.palette.background.default,
    "& .skeletonAvatar": {
      margin: theme.spacing(0, "auto", 1.75),
    },
    "& .skeletonText": {
      margin: theme.spacing(0, "auto"),
    },
    "& .skeletonButton": {
      margin: theme.spacing(1.85, "auto", 0),
      borderRadius: theme.spacing(4),
    },
  },
}));

const connector = connect(
  (state) => {
    return {
      popularUsers: state.timelineNew.popularUsers,
    };
  },
  {
    setPuIsLoading,
    setPuReachEnd,
    setPuOffset,
    setPuData,
    setPuTotalCount,
    setPuRemovedCount,
  },
);

export const PopularUsersHorizontal = connector(_popularUsersHorizontal);
function _popularUsersHorizontal(props) {
  const {
    popularUsers,
    setPuIsLoading,
    setPuReachEnd,
    setPuOffset,
    setPuData,
    setPuTotalCount,
    setPuRemovedCount,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const GridWrapper = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const [userError, setUserError] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);
  const [usersLeft, setUsersLeft] = useState(CARD_LENGTH);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const gotoPopularUsersList = () => {
    history.push("/popular-users");
  };

  const handleSlideToLeft = () => {
    if (GridWrapper && GridWrapper.current) {
      GridWrapper.current.scrollLeft =
        (scrollIndex - 3 < 0 ? 0 : scrollIndex - 3) * SCROLL_WIDTH;
      if (scrollIndex > 0) {
        setTimeout(() => {
          setScrollIndex(scrollIndex - 3);
        }, 300);
      }
    }
  };

  const handleSlideToRight = () => {
    if (GridWrapper && GridWrapper.current) {
      if (scrollIndex < CARD_LENGTH - 3) {
        GridWrapper.current.scrollLeft = (scrollIndex + 3) * SCROLL_WIDTH;
        setTimeout(() => {
          setScrollIndex(scrollIndex + 3);
        }, 300);
      }
    }
  };

  const handleFollowCallback = (userId) => {
    // process some event after callback
    setUsersLeft(usersLeft - 1);
  };

  const fetchData = async () => {
    let dataArr = [];
    let removedNum = 0;
    const reqUrl = {
      path: process.env.REACT_APP_API_URL + "/s/usertag/suggest?",
      query: {
        offset: popularUsers.query.offset,
        max: popularUsers.query.max,
        incl: popularUsers.query.incl,
      },
    };
    const config = {
      method: "get",
      url: getRequestUrl(reqUrl),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const successCallback = (response) => {
      const data = response.data?.result?.aux?.uinf;
      const followings = response.data?.result?.aux?.fws;

      if (fetchCount >= 5) {
        setShowSkeleton(false);
        setPuIsLoading(false);
        setUserError(true);
      } else if (data) {
        setPuOffset();
        setFetchCount(fetchCount + 1);
        for (const [_, value] of Object.entries(data)) {
          if (value?._id && followings.includes(value?._id)) {
            value.isFollowing = true;
          } else {
            value.isFollowing = false;
          }

          if (popularUsers.data.filter(({_id}) => value._id === _id).length) {
            // return if the id already exits in the popularUsers.data array
          } else {
            dataArr.push(value);
          }
        }

        if (dataArr.length > 0) {
          setPuData(dataArr);
          setPuTotalCount(dataArr.length);
        }

        removedNum =
          response.data?.result?.aux?.removed + popularUsers.removedCount;
        setPuRemovedCount(removedNum);
        if (dataArr.length + removedNum < popularUsers.query.max) {
          setPuReachEnd(false);
          setShowSkeleton(false);
        } else if (
          popularUsers.totalCount > CARD_LENGTH &&
          dataArr.length === 0
        ) {
          setPuReachEnd(false);
          setShowSkeleton(false);
        }

        if (popularUsers.totalCount > 0 || dataArr.length >= CARD_LENGTH) {
          setShowSkeleton(false);
        }
        setPuIsLoading(false);
      } else {
        setShowSkeleton(false);
      }
    };
    const errorCallback = (error) => {
      console.error(error);
      setUserError(true);
      setPuIsLoading(false);
      setShowSkeleton(false);
    };
    await GAxios(config, successCallback, errorCallback);
  };

  useEffect(() => {
    if (userError || fetchCount >= 5) {
      return;
    }

    if (
      popularUsers.totalCount >= 0 &&
      popularUsers.totalCount < CARD_LENGTH &&
      !popularUsers.isLoading &&
      !popularUsers.reachEnd
    ) {
      setPuIsLoading(true);
      setShowSkeleton(true);
      fetchData();
    } else if (
      popularUsers.totalCount > CARD_LENGTH &&
      popularUsers.totalCount === popularUsers.followCount &&
      !popularUsers.isLoading &&
      !popularUsers.reachEnd
    ) {
      setPuIsLoading(true);
      setShowSkeleton(true);
      fetchData();
    } else if (
      popularUsers.totalCount > CARD_LENGTH &&
      popularUsers.totalCount > popularUsers.followCount &&
      popularUsers.data.length < CARD_LENGTH &&
      !popularUsers.isLoading &&
      !popularUsers.reachEnd
    ) {
      setPuIsLoading(true);
      setShowSkeleton(true);
      fetchData();
    }
  }, [
    popularUsers.totalCount,
    popularUsers.query.offset,
    popularUsers.isLoading,
    popularUsers.reachEnd,
  ]);

  return (
    <div className={classes.wrapper}>
      {!isMobile && usersLeft > 0 && popularUsers.data.length > 5 && (
        <React.Fragment>
          <div
            className={clsx("section-header", classes.sectionHeader, getLang())}
          >
            {t("getter_fe.common.people.suggestedForYou")}
            <GTypography
              className={clsx(classes.viewMore, getLang())}
              isBold
              variant="body2"
              onClick={gotoPopularUsersList}
            >
              {t("getter_fe.common.trends.viewMore")}
            </GTypography>
          </div>
          {popularUsers.data.length > 3 && scrollIndex > 0 && (
            <IconButton
              onClick={(evt) => {
                evt.preventDefault();
                handleSlideToLeft();
              }}
              className={clsx(classes.slideLeftArrow, "slideArrow")}
            >
              <ArrowLeftIcon />
            </IconButton>
          )}
          {popularUsers.data.length > 3 && scrollIndex < CARD_LENGTH - 3 && (
            <IconButton
              onClick={(evt) => {
                evt.preventDefault();
                handleSlideToRight();
              }}
              className={clsx(classes.slideRightArrow, "slideArrow")}
            >
              <ArrowRightIcon />
            </IconButton>
          )}
          <div className={classes.sectionBody}>
            <div className={classes.sectionWrapper} ref={GridWrapper}>
              {popularUsers.data &&
                popularUsers.data.slice(0, usersLeft).map((user, idx) => {
                  const userId = user._id;
                  const hasWhiteSpaceAtbeginning = /^\s/.test(userId);

                  return (
                    <section key={`pul-${idx}`} className={classes.sectionCard}>
                      {!hasWhiteSpaceAtbeginning ? (
                        <UserCard
                          userInfo={user}
                          isAt={true}
                          disableHistoryPush={true}
                          suggestFollow={handleFollowCallback}
                        />
                      ) : null}
                    </section>
                  );
                })}
              {showSkeleton &&
                popularUsers.data.length < 6 &&
                Array.from(
                  new Array(CARD_LENGTH - popularUsers.data.length),
                ).map((item, index) => {
                  return (
                    <section
                      key={`ske-${index}`}
                      className={classes.sectionCard}
                    >
                      <div className={classes.skeletonCard}>
                        <Skeleton
                          variant="circle"
                          className={"skeletonAvatar"}
                          width={88}
                          height={88}
                        />
                        <Skeleton
                          variant="text"
                          className={"skeletonText"}
                          width={96}
                          height={20}
                        />
                        <Skeleton
                          variant="text"
                          className={"skeletonText"}
                          width={96}
                          height={20}
                        />
                        <Skeleton
                          variant="rect"
                          className={"skeletonButton"}
                          width={122}
                          height={26}
                        />
                      </div>
                    </section>
                  );
                })}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
