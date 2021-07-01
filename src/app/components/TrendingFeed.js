import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Waypoint} from "react-waypoint";
import {createStyles, makeStyles} from "@material-ui/core/styles";

import {GTypography} from "../../styles/components/GTypography";
import {GLoader} from "src/styles/components/GLoader";
import Global from "src/system/Global";
import {ReactComponent as SmallArrowIcon} from "src/assets/icons/basic/small_arrow.svg";

const MAX_BATCH_SIZE = 20;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(6),
    },
    feedItem: {
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
    waypoint: {
      position: "relative",
      bottom: theme.spacing(8),
    },
  }),
);

export const TrendingFeed = () => {
  const classes = useStyles();
  const [timeline, setTimeline] = useState(null);
  const [offset, setOffset] = useState(0);

  const api = Global.GetPortal().getAppService();

  const reachedEnd =
    Array.isArray(timeline) &&
    (timeline.length === 0 || timeline.length % MAX_BATCH_SIZE !== 0);

  useEffect(() => {
    const fetchSuggestedHashtags = async () => {
      try {
        const res = await api.fetchSuggestedHashtags(
          offset * MAX_BATCH_SIZE,
          MAX_BATCH_SIZE,
        );
        setTimeline([...(timeline || []), ...res.getList()]);
      } catch (err) {
        console.log(err);
        setTimeline([...(timeline || [])]);
      }
    };

    fetchSuggestedHashtags();
  }, [offset]);

  if (!timeline) {
    const headerHeight = 0; // theme.mixins.header.height;
    const othersHeight = 552; // 56px(columnHeader) - 496px(userProfileDetail)
    const wrapperStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      maxHeight: 600,
      height: `calc(100vh - ${headerHeight + othersHeight}px)`, // handle if the screen height is small
    };

    return <GLoader wrapperStyle={wrapperStyle} />;
  }

  return (
    <div className={classes.root}>
      {timeline.map((item) => {
        return (
          <Link
            key={item}
            className={classes.feedItem}
            to={`/hashtag/%23${encodeURIComponent(item)}`}
          >
            <GTypography className={classes.tagname} isBold>
              #{item}
            </GTypography>
            <div className="arrow rotate">
              <SmallArrowIcon />
            </div>
          </Link>
        );
      })}
      {reachedEnd ? null : (
        <div className={classes.waypoint}>
          <Waypoint
            scrollableAncestor={window}
            fireOnRapidScroll={false}
            onEnter={() => setOffset((oldOffset) => oldOffset + 1)}
          />
        </div>
      )}
    </div>
  );
};
