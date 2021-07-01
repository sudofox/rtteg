import React, {useState, useEffect, useCallback} from "react";
import {useDispatch} from "react-redux";
import {UserLayout} from "./UserLayout";
import {makeStyles} from "@material-ui/core/styles";
import {Waypoint} from "react-waypoint";
import {t} from "../../../i18n/utils";
import {Loader} from "./Loader";
import {NoDataMessage} from "./NoDataMessage";
import AppConsts from "../../AppConsts";
import axios from "axios";
import {changeMutedStatus} from "src/store/modules/status";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: "100%",
  },
  cardWrapper: {
    height: "100%",
  },
}));

export const Muted = ({userId, token}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const maxPerPage = 10;
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

  const fetchData = useCallback(async () => {
    let dataArr = [];
    setIsLoading(true);
    let xAuth =
      userId === null
        ? `{"user": null, "token": null}`
        : `{"user": "${userId}", "token": "${token}"}`;
    // get muted users list
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/u/user/${userId}/mutes/?offset=${pageNumber}&max=${maxPerPage}&incl=userstats|userinfo`,
        {
          headers: {
            "x-app-auth": xAuth,
          },
        },
      )
      .then((res) => {
        const data = res.data?.result?.aux?.uinf;

        if (data) {
          for (const [key, value] of Object.entries(data)) {
            if (value.username !== "") {
              dataArr.push(value);
              dispatch(
                changeMutedStatus({
                  userId: value.username,
                  status: true,
                }),
              );
            }
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });

    setPageNumber(pageNumber + 1);

    if (dataArr.length < maxPerPage) {
      setHasMore(false);
    }

    setItems([...items, ...dataArr]);

    setIsLoading(false);
  });

  useEffect(() => {
    items.length <= 0 && fetchData();
  }, []);

  return (
    <div className={classes.wrapper}>
      {!isLoading && items.length <= 0 && (
        <NoDataMessage
          title={t("getter_fe.settings.muted.noDataTitle")}
          message={t("getter_fe.settings.muted.noDataMessage")}
        />
      )}

      <div className={!isLoading ? classes.cardWrapper : ""}>
        {items &&
          items.map((user, idx) => {
            return (
              <UserLayout
                user={user}
                key={idx}
                type={AppConsts.USER_LIST_MUTED}
              />
            );
          })}
      </div>

      {isLoading && <Loader />}

      {!isLoading && hasMore && items.length > 0 && (
        <Waypoint
          scrollableAncestor={window}
          fireOnRapidScroll={false}
          onEnter={fetchData}
          className={classes.wayPoint}
        />
      )}
    </div>
  );
};

export default Muted;
