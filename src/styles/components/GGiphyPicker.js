import React, {useState, useRef, useEffect} from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import {t, getLang} from "src/i18n/utils";
import {GiphyFetch} from "@giphy/js-fetch-api";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {ReactComponent as IconCancel} from "src/assets/icons/basic/close.svg";
import {Waypoint} from "react-waypoint";
import Switch from "@material-ui/core/Switch";
import icon_back from "src/assets/icons/basic/back_arrow.svg";

const GYPHY_PICKER_WIDTH = 600;
const GYPHY_PICKER_WIDTH_SM = 500;
const GYPHY_PICKER_WIDTH_XS = "100%";
const GYPHY_LIMIT = 10;
const GYPHY_API_KEY = "LRyMo9N2BYwQgVwiz49OIrLSmBbb7zsO";
const GYPHY_CATEGORY_NAME = "emotions";

const giphyFetch = new GiphyFetch(GYPHY_API_KEY);

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogContainer: {
      "& .MuiDialog-paperWidthSm.MuiDialog-paperScrollBody": {
        maxWidth: "calc(100% - 40px)",
        margin: 20,
      },
    },
    root: {
      width: GYPHY_PICKER_WIDTH,
      [theme.breakpoints.only("sm")]: {
        width: GYPHY_PICKER_WIDTH_SM,
      },
      [theme.breakpoints.only("xs")]: {
        width: GYPHY_PICKER_WIDTH_XS,
      },
    },
    header: {
      borderBottom: `1px solid ${theme.input.borderColor}`,
      padding: theme.spacing(1.25, 2),
      display: "flex",
      alignItems: "center",
      "& .icon.cancel": {
        width: 26,
        height: 26,
        background: theme.palette.grey.A300,
        opacity: 0.7,
        borderRadius: "50%",
        marginRight: theme.spacing(2),
        "& > svg": {
          stroke: "#000",
        },
        [theme.breakpoints.only("xs")]: {
          marginRight: theme.spacing(1),
          width: 24,
          height: 24,
          flex: "0 0 24px",
        },
        [theme.breakpoints.up("sm")]: {
          margin: theme.spacing(0, 4.5, 0, 1),
        },
      },
    },
    searchInput: {
      // overwrite default input styles
      '&:not([type="checkbox"]):not([type="radio"])': {
        flex: 1,
        fontWeight: "400",
        border: `1px solid ${theme.palette.primary.main} !important`,
        fontSize: 16,
        minHeight: "33px !important",
        borderRadius: "33px !important",
        [theme.breakpoints.only("xs")]: {
          fontSize: 12,
          padding: "0 12px",
        },
      },
    },
    giphyGridContainer: {
      height: 500,
      overflowY: "auto",
      overflowX: "hidden",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    gifphyImageWrapper: {
      display: "flex",
      justifyContent: "center",
      background: theme.palette.background.black,
      width: `calc((100% - 5px)/2)`,
      height: 150,
      marginBottom: 5,
      position: "relative",
      cursor: "pointer",
      [theme.breakpoints.only("xs")]: {
        height: 100,
      },
    },
    giphyImage: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    emotionName: {
      position: "absolute",
      bottom: 5,
      left: 10,
      color: theme.palette.background.default,
      fontSize: 18,
      textTransform: "capitalize",
      fontWeight: "bold",
    },
    autoplayToggleContainer: {
      height: 46,
      padding: theme.spacing(0, 0, 0, 2),
      fontSize: 16,
      color: theme.palette.text.secondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      '& input[type="checkbox"]': {
        position: "absolute",
      },
      [theme.breakpoints.only("xs")]: {
        padding: theme.spacing(0, 0, 0, 1),
        fontSize: 12,
        flexDirection: "column",
      },
    },
    backBtn: {
      // TODO: Copied from GBackTitle. Create GBackButton component when we refactor.
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(4),
      cursor: "pointer",
      "& img": {
        verticalAlign: "middle",
        borderRadius: "50%",
        padding: "3px",
        "-webkit-transition": "background-color 300ms ease",
        "-moz-transition": "background-color 300ms ease",
        "-ms-transition": "background-color 300ms ease",
        "-o-transition": "background-color 300ms ease",
        transition: "background-color 300ms ease",
        backgroundColor: "transparent",

        // Fix width & height due to jittering effect
        width: 30,
        height: 30,
      },
      "&:hover img": {
        backgroundColor: "#F2F9FF",
      },
    },
    noResult: {
      flex: 1,
      marginTop: 36,
      "& > p": {
        fontSize: 16,
        lineHeight: "22px",
        textAlign: "center",
        letterSpacing: "0.01em",
        marginBottom: 3,
        "&.title": {
          fontWeight: 800,
          fontSize: 18,
          lineHeight: "21px",
          letterSpacing: "-0.014em",
        },
      },
    },
  }),
);

export const GGiphyPicker = ({validateBeforeClick, onSelect, children}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const selectEl = useRef(null);
  const scrollableEl = useRef(null);
  const [gifs, setGifs] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [reachEnd, setReachEnd] = useState(false);
  const [autoPlayChecked, setAutoPlayChecked] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  useEffect(() => {
    isOpen &&
      load(0).then((result) => {
        setReachEnd(false);
        setEmotions(result.emotionData ? result.emotionData : []);
        setGifs(result.data);
        setOffset(GYPHY_LIMIT);
      });
  }, [searchText, isOpen]);

  const loadMore = () => {
    load(offset).then((result) => {
      if (!result.data || result.data.length === 0) {
        setReachEnd(true);
      } else {
        setGifs([...gifs, ...result.data]);
        result.emotionData && setEmotions([...emotions, ...result.emotionData]);
      }
      setOffset(offset + GYPHY_LIMIT);
    });
  };

  const load = (offset) => {
    let currentLang = getLang();

    switch (currentLang) {
      case "zh":
        currentLang = "zh-CN";
        break;
      case "tw":
        currentLang = "zh-TW";
        break;
    }

    if (!searchText || /^\s+$/.test(searchText)) {
      return giphyFetch
        .subcategories(GYPHY_CATEGORY_NAME, {
          lang: currentLang,
          offset: offset,
          limit: GYPHY_LIMIT,
        })
        .then((result) => {
          return {
            data: result.data.map((category) => category.gif),
            emotionData: result.data.map((category) => category.name),
          };
        });
    } else {
      return giphyFetch.search(searchText, {
        lang: currentLang,
        offset: offset,
        limit: GYPHY_LIMIT,
      });
    }
  };

  const handleClick = (gif, emotion) => {
    if (searchText) {
      onSelect(gif);
      handleClose();
    } else {
      setSearchText(emotion);
      scrollableEl.current.scrollTo(0, 0);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    scrollableEl.current.scrollTo(0, 0);
    if (!e.target.value) {
      setEmotions([]);
    }
  };

  const handleClose = () => {
    setSearchText("");
    setGifs([]);
    setEmotions([]);
    setOffset(0);
    setReachEnd(false);
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={() => {
          if (validateBeforeClick()) {
            setIsOpen(true);
          }
        }}
      >
        {children}
      </div>
      <div
      // ref={selectEl}
      >
        <Dialog
          open={isOpen}
          onClose={handleClose}
          scroll="body"
          onClick={(e) => e.stopPropagation()}
          className={classes.dialogContainer}
          // container={() => (selectEl ? selectEl.current : null)}
        >
          <div className={classes.root}>
            <div className={classes.header}>
              {searchText ? (
                <div
                  className={classes.backBtn}
                  onClick={() => setSearchText("")}
                >
                  <img src={icon_back} alt="back" />
                </div>
              ) : (
                <span className="icon cancel" onClick={handleClose}>
                  <IconCancel />
                </span>
              )}
              <input
                className={classes.searchInput}
                placeholder={t("getter_fe.post.placeholder.search_giphy")}
                value={searchText}
                onChange={handleSearchChange}
              />
              <div className={classes.autoplayToggleContainer}>
                <span>
                  {isMobile
                    ? t("getter_fe.giphy.autoPlay")
                    : t("getter_fe.giphy.autoPlayGifs")}
                </span>
                <Switch
                  checked={autoPlayChecked}
                  onClick={() => setAutoPlayChecked(!autoPlayChecked)} // onChange event is not working
                  color="primary"
                />
              </div>
            </div>
            {/* {searchText && (
              <div className={classes.autoplayToggleContainer}>
                <span>{t("getter_fe.giphy.autoPlayGifs")}</span>
                <Switch
                  checked={autoPlayChecked}
                  onClick={() => setAutoPlayChecked(!autoPlayChecked)} // onChange event is not working
                  color="primary"
                />
              </div>
            )} */}
            <div className={classes.giphyGridContainer} ref={scrollableEl}>
              {!gifs.length && searchText && (
                <div className={classes.noResult}>
                  <p className="title">{t("getter_fe.giphy.noResult")}</p>
                  <p>{t("getter_fe.giphy.noResultDesc")}</p>
                </div>
              )}
              {gifs.map((gif, idx) => (
                <div className={classes.gifphyImageWrapper}>
                  <img
                    src={
                      autoPlayChecked
                        ? gif.images.fixed_height.url
                        : gif.images.fixed_height_still.url
                    }
                    className={classes.giphyImage}
                    onClick={() => handleClick(gif, emotions[idx])}
                  />
                  {!searchText && (
                    <span className={classes.emotionName}>{emotions[idx]}</span>
                  )}
                  {idx > 0 && idx === gifs.length - 1 && !reachEnd && (
                    <Waypoint fireOnRapidScroll={false} onEnter={loadMore} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};
