import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Waypoint} from "react-waypoint";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {setTimelineId} from "src/store/modules/timeline";
import {t} from "src/i18n/utils";
import {PostFeedItem} from "src/app/components/post/comps/PostFeedItem";
import {GLoader} from "src/styles/components/GLoader";
import Global from "src/system/Global";
import {GBackTitle} from "src/styles/components/GBackTitle";

const LOAD_MORE_CUTOFF_SIZE = 10;
const MAX_BATCH_SIZE = 20;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
    },
    noResultContainer: {
      display: "flex",
      flexDirection: "column",
      marginTop: "48px",
      alignItems: "center",
      "& h2": {
        maxWidth: 598,
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
  }),
);

export const HashtagSearchFeed = ({phrase}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {postTimeline} = useSelector((state) => state.timeline);
  const [offset, setOffset] = useState(0);
  const [feed, setFeed] = useState([]);
  const [enableLoad, setEnableLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = Global.GetPortal().getAppService();

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 600,
    height: `calc(100vh - 552px)`, // handle if the screen height is small
  };

  useEffect(() => {
    setEnableLoad(true);
    setFeed([]);
    if (phrase !== escape("#") && phrase !== escape("@")) {
      setLoading(true);
      api.getSearchByPhrase(phrase, 0, MAX_BATCH_SIZE, (err, searchFeed) => {
        if (err == null && searchFeed) {
          const newFeed = searchFeed.getXPostItems(true);
          setFeed(newFeed);
        }
        setEnableLoad(false);
        setOffset(MAX_BATCH_SIZE);
        setLoading(false);
      });
    } else {
      setEnableLoad(false);
    }
  }, [phrase]);

  const loadMore = () => {
    if (enableLoad) {
      setLoading(true);
      api.getSearchByPhrase(
        phrase,
        offset,
        MAX_BATCH_SIZE,
        (err, searchFeed) => {
          if (err == null && searchFeed) {
            const newFeed = searchFeed.getXPostItems(true);
            setFeed([...feed, ...newFeed]);
          }
          setOffset(offset + MAX_BATCH_SIZE);
          setLoading(false);
        },
      );
    } else {
      setEnableLoad(true);
      setLoading(false);
    }
  };
  return (
    <div className={classes.root}>
      {feed?.length === 0 ? (
        loading ? (
          <GLoader wrapperStyle={wrapperStyle} />
        ) : (
          <div className={classes.noResultContainer}>
            <h2>
              {t("getter_fe.searchPage.noResult.label")}{" "}
              {decodeURIComponent(phrase)}
            </h2>
            <span>{t("getter_fe.searchPage.noResult.comment")}</span>
          </div>
        )
      ) : (
        <GBackTitle
          hideBackLink
          title={`Search Results for ${decodeURIComponent(phrase)}`}
        />
      )}
      {feed.map((item, index) => {
        const sharedPost = item.getSharedPost();
        return (
          <div key={item.getPosterId() + item.getTargetId()}>
            <PostFeedItem
              setTimelineId={(value) =>
                dispatch(
                  setTimelineId({
                    field: "postTimeline",
                    data: value,
                  }),
                )
              }
              timelineId={postTimeline.timelineId}
              item={item}
              scene="timeline"
              userId={item.getTargetId()}
              sharedObj={sharedPost}
              postId={item.getPostId()}
            />
            {index === feed.length - LOAD_MORE_CUTOFF_SIZE ? (
              <Waypoint
                scrollableAncestor={window}
                fireOnRapidScroll={false}
                onEnter={loadMore}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
