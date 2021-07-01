import React, {useState, useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Waypoint} from "react-waypoint";

import clsx from "clsx";
import {Loader} from "../pages/settings/Loader";
import axios from "axios";
import {UserLayout} from "./UserLayout";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    // height: "100%",
  },
  cardWrapper: {
    height: "100%",
  },
  footerContent: {
    display: "flex",
    alignItems: "center",
    height: theme.spacing(5.625),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.grey["A300"],
      borderRadius: "0 0 10px 10px",
    },
  },
  footerText: {
    marginLeft: theme.spacing(1.875),
    position: "relative",
    color: theme.blue.light,
    fontWeight: 600,
    fontSize: 14,
    "&.zh,&.tw": {
      fontWeight: 500,
      letterSpacing: "0.05em",
    },
    "& .underline": {
      position: "absolute",
      left: 0,
      bottom: 2,
      width: "100%",
      height: 1,
      backgroundColor: theme.blue.light,
      opacity: 0,
      transition: "opacity 300ms ease",
    },
    "&:hover .underline": {
      opacity: 1,
    },
  },
  carouselContainer: {
    width: "100%",
  },
}));

export const PopularUsersFeed = ({
  userId,
  token,
  isMaxPerpageFixed,
  sidebar = false,
  isPage,
}) => {
  const classes = useStyles();
  const maxPerPage = isMaxPerpageFixed ? 10 : 20;
  const loadCutOffSize = 10;
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [removed, setRemoved] = useState(0);
  const [totalNum, setTotalNum] = useState(0);
  const history = useHistory();

  const fetchData = async (offset) => {
    let dataArr = [];
    let removedNum = 0;
    setIsLoading(true);
    let xAuth =
      userId === null
        ? `{"user": null, "token": null}`
        : `{"user": "${userId}", "token": "${token}"}`;
    // get muted users list
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/s/usertag/suggest?offset=${offset}&max=${maxPerPage}&incl=userinfo|followings`,
        {
          headers: {
            "x-app-auth": xAuth,
          },
        },
      )
      .then((res) => {
        const data = res.data?.result?.aux?.uinf;
        const followings = res.data?.result?.aux?.fws;

        if (data) {
          for (const [_, value] of Object.entries(data)) {
            if (value?._id && followings.includes(value?._id)) {
              value.isFollowing = true;
            } else {
              value.isFollowing = false;
            }

            if (items.filter(({_id}) => value._id === _id).length) {
              // return if the id already exits in the items array
            } else {
              dataArr.push(value);
            }
          }

          removedNum = res.data?.result?.aux?.removed + removed;
          setRemoved(removedNum);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    if (dataArr.length + removedNum < maxPerPage) {
      setHasMore(false);
    }

    if (dataArr.length) {
      setTotalNum(items.length);
      setItems([...items, ...dataArr]);
    }

    setPageNumber(offset + maxPerPage);
    setIsLoading(false);
  };

  useEffect(() => {
    items.length <= 0 && fetchData(0);
  }, []);

  useEffect(() => {
    if (isMaxPerpageFixed && items.length <= 10 && hasMore && pageNumber > 0) {
      fetchData(pageNumber + 10);
    }
  }, [items, pageNumber]);

  const gotoPopularUsersList = () => {
    history.push("/popular-users");
  };

  return (
    <div className={classes.wrapper}>
      {!isLoading && items.length <= 0 && ""}

      <div className={clsx(!isLoading ? classes.cardWrapper : "", "u-card")}>
        {isMaxPerpageFixed
          ? items &&
            items.slice(0, 5).map((user, idx) => {
              const userId = user._id;
              const hasWhiteSpaceAtbeginning = /^\s/.test(userId);

              return (
                <React.Fragment key={`pul-${idx}`}>
                  {!hasWhiteSpaceAtbeginning ? (
                    <UserLayout
                      userInfo={user}
                      sidebar={sidebar}
                      isPage={isPage}
                      disableHistoryPush={true}
                    />
                  ) : null}
                </React.Fragment>
              );
            })
          : items &&
            items.map((user, idx) => {
              const userId = user._id;
              const hasWhiteSpaceAtbeginning = /^\s/.test(userId);

              return (
                <React.Fragment key={`pul-${idx}`}>
                  {!hasWhiteSpaceAtbeginning ? (
                    <UserLayout
                      userInfo={user}
                      sidebar={sidebar}
                      isPage={isPage}
                      disableHistoryPush={true}
                    />
                  ) : null}

                  {idx === totalNum && !isLoading && hasMore && (
                    <Waypoint
                      scrollableAncestor={window}
                      fireOnRapidScroll={false}
                      onEnter={() => fetchData(pageNumber)}
                    />
                  )}
                </React.Fragment>
              );
            })}
      </div>

      {isLoading && <Loader />}
    </div>
  );
};
