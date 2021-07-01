import React, {useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import GAxios from "src/util/GAxios";
import {t, getLang} from "src/i18n/utils";
import {GTypography} from "src/styles/components/GTypography";
import {TopicImg} from "./TopicImg";

const useStyles = makeStyles((theme) =>
  createStyles({
    sectionHeader: {
      borderBottom: `1px solid ${theme.palette.grey["A800"]}`,
      height: "48px",
      fontWeight: "800",
      lineHeight: "24px",
      padding: "0 18px",
      fontSize: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    topicContent: {
      display: "flex",
      justifyContent: "space-between",
      columnGap: 14,
      alignItems: "center",
      borderBottom: `1px solid ${theme.palette.grey["A800"]}`,
      padding: "12px 18px",
      "&:hover": {
        backgroundColor: theme.palette.grey["A300"],
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },
    firstTopic: {
      display: "flex",
      flexDirection: "column",
      rowGap: 14,
      borderBottom: `1px solid ${theme.palette.grey["A800"]}`,
      padding: "12px 18px",
      "&:hover": {
        backgroundColor: theme.palette.grey["A300"],
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },
    topicName: {
      fontWeight: "700",
      lineHeight: "19.5px",
      fontSize: "15px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    topicDesc: {
      marginLeft: "14px",
      marginRight: "15px",
      marginTop: "3px",
      fontWeight: "400",
      lineHeight: "130%",
      fontSize: "15px",
      "& .text-content": {
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
      },
    },
    textContent: {
      flexGrow: 1,
      fontWeight: 700,
      lineHeight: "19.5px",
      fontSize: "15px",
      "& .text-content": {
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
        wordBreak: "break-word",
        fontSize: 15,
        lineHeight: "130%",
      },
      "& .grey": {
        color: theme.palette.text.lightGray,
        fontWeight: 400,
      },
    },
    tagContent: {
      fontSize: 15,
      lineHeight: "130%",
      padding: "7px 15px",
      border: "1px solid #E8E9EA",
      borderRadius: 100,
      fontWeight: "normal",
      "&:hover": {
        backgroundColor: theme.palette.grey["A300"],
      },
    },
    img: {
      borderRadius: "10px",
      width: "69px",
      height: "69px",
      objectFit: "cover",
    },
    viewMore: {
      color: theme.blue.light,
      position: "relative",
      fontWeight: 500,
      cursor: "pointer",
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
    tagname: {
      fontWeight: 700,
      fontSize: 14,
      lineHeight: "133%",
    },
  }),
);

export const NewSuggestTopics = () => {
  const classes = useStyles();
  const history = useHistory();
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const config = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/s/hashtag/suggest?max=5`,
    };

    GAxios(
      config,
      (response) => {
        if (response && response.data?.result?.aux?.htinfo) {
          setTopics(response.data?.result?.aux?.htinfo);
        } else {
          setError(true);
        }
      },
      () => {
        setError(true);
      },
    );
  }, []);

  if (error) {
    return null;
  }

  return (
    <>
      <div className="suggest-topics sidebar-section">
        <div className={classes.sectionHeader}>
          {t("getter_fe.common.trends.title")}
          <GTypography
            className={clsx(classes.viewMore, getLang())}
            variant="body2"
            onClick={() => history.push("/trending")}
          >
            {t("getter_fe.common.trends.viewMore")}
          </GTypography>
        </div>
        <div className="tags-content">
          {topics &&
            Object.keys(topics).map((tagname) => (
              <Link
                to={`/hashtag/%23${encodeURIComponent(tagname)}`}
                key={"st" + tagname}
                className={classes.tagContent}
              >
                {tagname}
              </Link>
            ))}
        </div>
      </div>
      <div className="suggest-topics sidebar-section">
        <div className={classes.sectionHeader}>
          {t("getter_fe.common.trends.news")}
        </div>
        <div className="section-content">
          {topics &&
            Object.keys(topics).map((key, index) => {
              const data = topics[key];
              const trendDesc = data["description"];

              let tagname = key;

              return (
                <Link
                  to={`/search?q=${encodeURIComponent(tagname)}`}
                  key={"st" + index}
                  className={
                    index === 0 ? classes.firstTopic : classes.topicContent
                  }
                >
                  <TopicImg bigImg={index === 0} url={data["iconUrl"]} />
                  <div className={classes.textContent}>
                    <div className={classes.tagname}>#{tagname}</div>
                    <div
                      className={clsx("text-content", trendDesc ? "grey" : "")}
                    >
                      {trendDesc
                        ? trendDesc
                        : t("getter_fe.common.trends.desc", {key})}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
};
