import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import uuid from "react-uuid";
import {format} from "react-string-format";
import Util from "src/core/Util";
import AppConsts from "src/app/AppConsts";
import {t} from "src/i18n/utils";
import {AvatarLink} from "./AvatarLink";
import classnames from "classnames";
import {ReactComponent as IconVerification} from "src/assets/icons/feature/verification.svg";
import {ReactComponent as IconCancel} from "src/assets/icons/ico-circlefull close.svg";
import {ReactComponent as IconSearch} from "src/assets/icons/basic/search.svg";
import {GTwemoji} from "src/styles/components/GTwemoji";
import Highlighter from "react-highlight-words";
import Global from "src/system/Global";
import {debounce} from "lodash";
import {ReactComponent as SmallArrowIcon} from "src/assets/icons/basic/small_arrow.svg";
import {ReactComponent as BackIcon} from "src/assets/icons/basic/back_arrow.svg";
import {setGlobalSearchInputFocused} from "src/app/components/auth/store";

const withBackBtnPaths = [AppConsts.URL_SEARCH_RESULT, AppConsts.URL_HASHTAG];

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: "9px 0px 9px",
      display: "flex",
    },
    backBtn: {
      marginRight: theme.spacing(4),
      marginLeft: theme.spacing(2.625),
      cursor: "pointer",
      lineHeight: 0,
      display: "flex",
      alignItems: "center",
    },
    searchBoxWrapper: {
      width: "100%",
      position: "relative",
    },
    searchBox: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
      backgroundColor: theme.palette.grey.A300,
      borderRadius: 42,
      height: 42,
      border: "1px solid transparent",
      "& .search-icon": {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1.5),
        fontSize: 0,
        cursor: "pointer",
        "& svg": {
          "& path": {
            stroke: theme.palette.text.secondary,
          },
          "& circle": {
            stroke: theme.palette.text.secondary,
          },
        },
      },

      "& input#searchInput": {
        width: "calc(100% - 45px)",
        fontSize: "15px !important",
        paddingRight: theme.spacing(0) + " !important",
        backgroundColor: "transparent",
        fontWeight: theme.typography.fontWeightRegular,
        borderRadius: "42px !important",
        minHeight: 42,
        padding: "0 1px",
        "&::placeholder": {
          fontWeight: theme.typography.fontWeightRegular,
          color: theme.palette.text.secondary,
        },

        "&:focus": {
          color: theme.palette.text.primary,
          "&::placeholder": {
            color: theme.palette.text.secondary,
          },
        },
      },

      "& .cancel-icon": {
        paddingLeft: theme.spacing(1.75),
        paddingRight: theme.spacing(1.75),
        transform: "translateY(12px)",
        height: "100%",
        marginLeft: "auto",
        cursor: "pointer",
        fontSize: 1,

        "& svg": {
          "& path": {
            stroke: "#FFF",
          },

          "& circle": {
            fill: theme.palette.grey.A700,
          },
        },
      },

      [theme.breakpoints.only("xs")]: {
        //height: 32,
        //background: "#F2F4F7",
        "& .search-icon": {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          cursor: "pointer",
          "& svg": {
            "& path": {
              stroke: "#A7B0BA !important", // put into theme?
            },
          },
        },
        "& input": {
          fontSize: 14,
          color: "#A7B0BA",
          fontWeight: 400,
          "&::placeholder": {
            color: "#A7B0BA !important",
            fontWeight: 400,
          },
        },
        "&:focus-within": {
          //backgroundColor: "#F2F4F7",
        },
      },
      "&.focus": {
        borderColor: theme.palette.primary.main,
        backgroundColor: "#fcfcfc",
        overflow: "hidden",
        "& .search-icon svg path": {
          stroke: `${theme.palette.primary.main} !important`,
        },
        "& .search-icon svg circle": {
          stroke: `${theme.palette.primary.main} !important`,
        },
      },
    },

    searchResult: {
      position: "absolute",
      width: "100%",
      maxHeight: theme.spacing(64),
      border: theme.notchedOutline.border,
      backgroundColor: theme.palette.background.default,
      marginTop: theme.spacing(0.5),
      boxShadow: "0px 0px 11px rgba(86, 103, 121, 0.19)", // put into theme?
      borderRadius: 5,
      minHeight: 52,
      zIndex: 3,
      overflowY: "auto",
      top: 42,
      left: 0,
      right: 0,

      [theme.breakpoints.down("sm")]: {
        position: "absolute",
        width: "100%",
        border: theme.notchedOutline.border,
        backgroundColor: theme.palette.background.default,
        marginTop: theme.spacing(0.5),
        boxShadow: "0px 0px 11px rgba(86, 103, 121, 0.19)", // put into theme?
        borderRadius: theme.shape.borderRadius,
        minHeight: 58,
        zIndex: 3,
      },

      [theme.breakpoints.only("xs")]: {
        position: "absolute",
        left: 0,
        right: 0,
        //bottom: 0,
        boxShadow: "none",
        width: "100%",
        //height: "calc(100vh - 54px)",
        //border: "none",
        borderLeft: "none",
        borderRight: "none",
        overflowY: "auto",
        borderRadius: "none",
      },

      "& .result-list-item": {
        position: "relative",
        display: "flex",
        alignItems: "center",
        paddingLeft: 18,
        minHeight: 50,

        "& > div": {
          maxWidth: "calc(100% - 20px)",
        },

        "&:not(:last-child)": {
          borderBottom: theme.notchedOutline.border,
        },

        "&.selected": {
          backgroundColor: theme.input.background,
          cursor: "pointer",
        },

        "& .header": {
          display: "flex",
          flex: 1,
          alignItems: "center",
          height: 50,

          "& .label": {
            fontSize: 18,
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.text.secondary,
            // maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },

          "& .action-link": {
            marginLeft: "auto",
            color: theme.palette.text.link,
            fontWeight: theme.typography.fontWeightSemiBold,
            cursor: "pointer",
          },
        },

        "& .hashtag": {
          display: "flex",
          alignItems: "center",

          "& .name": {
            fontSize: 15,
            fontWeight: 400,
            ...theme.mixins.ellipsis,
          },

          "& .keyword": {
            backgroundColor: "transparent",
            fontWeight: 700,
          },

          "& .count": {
            marginLeft: "auto",
            color: theme.palette.text.secondary,
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: 12,
          },
        },

        "& .user": {
          display: "flex",
          alignItems: "center",
          height: 64,
          maxWidth: "100%",

          "& .main-info": {
            display: "flex",
            minWidth: 0,
            alignItems: "center",
            "& .user-avatar": {
              width: 42,
              height: 42,
              border: `1px solid ${theme.palette.grey.A800}`,
              // ...theme.mixins.avatar,
            },

            "& .user-info": {
              paddingLeft: theme.spacing(1.25),
              paddingRight: theme.spacing(0.5),
              minWidth: 0,
              "& .nickname-wrapper": {
                display: "flex",
                alignItems: "center",
                "& .nickname": {
                  fontSize: 15,
                  fontWeight: theme.typography.fontWeightBold,
                  lineHeight: "18px",
                  paddingRight: theme.spacing(0.5),
                  ...theme.mixins.ellipsis,
                },
              },
              "& .icon": {
                width: 16,
                height: 16,
              },
              "& .username": {
                display: "flex",
                marginTop: theme.spacing(0.25),
                fontSize: 15,
                lineHeight: "15px",
                color: theme.palette.text.gray,
              },
            },

            // "& .additional-info": {
            //   display: "flex",
            //   alignItems: "center",
            //   paddingLeft: theme.spacing(0.5),
            //   paddingRight: theme.spacing(0.5),
            //   fontSize: 16,
            //   fontWeight: theme.typography.fontWeightRegular,
            //   color: theme.palette.text.secondary,
            //   "& .username": {},

            //   "& .time-since": {
            //     display: "flex",
            //     alignItems: "center",
            //     "&:before": {
            //       position: "relative",
            //       top: theme.spacing(0.125),
            //       display: "block",
            //       content: '""',
            //       height: 2,
            //       width: 2,
            //       backgroundColor: theme.palette.primary.light,
            //       borderRadius: "50%",
            //       marginRight: theme.spacing(1),
            //       marginLeft: theme.spacing(1),
            //     },
            //   },
            // },
          },
        },

        "& .phrase": {
          display: "flex",
          alignItems: "center",
          fontSize: 16,
          fontWeight: theme.typography.fontWeightBold,
          height: "100%",
          width: "100%",

          "& .name": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },

        "& .footer": {
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          fontWeight: 500,
          color: theme.palette.text.link,
          flex: 1,
          justifyContent: "center",
        },

        // "& .remove-search": {
        //   position: "relative",
        //   display: "flex",
        //   alignItems: "center",
        //   marginLeft: "auto",
        //   cursor: "pointer",
        //   padding: theme.spacing(1.125),
        //   left: theme.spacing(1.125),
        //   height: "100%",

        //   "&:hover": {},

        //   "& svg": {
        //     width: 22,
        //     height: 22,
        //   },
        // },

        "& .arrow": {
          position: "relative",
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          cursor: "pointer",
          height: "100%",
          marginRight: 18,
          "&.rotate": {
            transform: "rotate(225deg)",
          },
          "&:hover svg path": {
            fill: theme.palette.text.link,
          },
        },

        "&.withDivider": {
          marginBottom: 11,
          borderBottom: `1px solid ${theme.palette.grey.A200}`,
          "&::after": {
            content: "' '",
            position: "absolute",
            left: 0,
            bottom: -12,
            width: "100%",
            minHeight: 10,
            backgroundColor: "#FDFDFD",
            borderBottom: `1px solid ${theme.palette.grey.A200}`,
          },
        },
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {};
  },
  {setGlobalSearchInputFocused},
);

export const PostSearchBoxNew = connector(_PostSearchBoxNew);

function _PostSearchBoxNew({setGlobalSearchInputFocused}) {
  const classes = useStyles();
  const history = useHistory();
  const {pathname} = useLocation();

  const api = Global.GetPortal().getAppService();

  const postSearchBoxRef = useRef(null);
  const inputRef = useRef(null);
  const inputChangeTimes = useRef(null);

  const [inputPhrase, setInputPhrase] = useState(null);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE_RECENT_SEARCH);
  const [showResult, setShowResult] = useState(false);
  const [selectedListItemIndex, setSelectedListItemIndex] = useState(undefined);
  const [resultListItems, setResultListItems] = useState(undefined);
  const [listItemSelectableIndexes, setListItemSelectableLIndexes] = useState(
    undefined,
  );
  const [inputFocused, setInputFocused] = useState(false);

  const [submitting, _setSubmitting] = useState(false);
  const submittingRef = useRef(submitting);
  const setSubmitting = (value) => {
    submittingRef.current = value;
    _setSubmitting(value);
  };

  const SEARCH_MODE_NORMAL_SEARCH = 1;
  const SEARCH_MODE_RECENT_SEARCH = 2;
  const MAX_LIST_ITEMS = 5;

  let searchTimeout;

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    // document.addEventListener("keydown", handleKeyDown, false); // Not sure why this needs.

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

  const setSearch = async (_inputPhrase) => {
    if (submittingRef.current) {
      setSubmitting(false);
      return;
    }
    let searchMode =
      Util.StringIsEmpty(_inputPhrase) || /^\s+$/.test(_inputPhrase)
        ? SEARCH_MODE_RECENT_SEARCH
        : SEARCH_MODE_NORMAL_SEARCH;

    inputChangeTimes.current++;
    let currentTimes = inputChangeTimes.current;
    // mark every search request by currentTimes

    let resultListItems = await getResultListItems(_inputPhrase, searchMode);

    // when request finish if currentTimes smaller than inputChangeTimes.current
    // mean this search request respon was behind other search request
    // so ignore it
    if (currentTimes < inputChangeTimes.current) return;
    let listItemSelectableIndexes = resultListItems
      .filter((resultListItem) => {
        return resultListItem.clickHandler;
      })
      .map((resultListItem) => {
        return resultListItem.index;
      });

    setShowResult(resultListItems.length > 0);
    setResultListItems(resultListItems);
    setSearchMode(searchMode);
    setListItemSelectableLIndexes(listItemSelectableIndexes);
  };

  const handleInputFocus = (_inputPhrase) => {
    inputChangeTimes.current = 0;
    setInputFocused(true);
    setGlobalSearchInputFocused(true);
    setSearch(_inputPhrase);
  };

  const handleInputBlur = () => {
    inputChangeTimes.current = 0;
    setInputFocused(false);
    setGlobalSearchInputFocused(false);
  };

  const handleInputChange = debounce((_inputPhrase) => {
    if (_inputPhrase === "#" || _inputPhrase === "@") return;

    setInputPhrase(_inputPhrase);
    // setResultListItems(null); // keep the resultListItems until it's overwritten.
    setSelectedListItemIndex(null);
    setSearch(_inputPhrase);
  }, 300);

  const handleClickOutside = (e) => {
    if (postSearchBoxRef && !postSearchBoxRef.current.contains(e.target)) {
      clearTimeout(searchTimeout);
      setShowResult(false);
    }
  };

  // No need to debounce this function as it's only checking Enter, Up, Down and ESC.
  const handleKeyDown = /*debounce(*/ (e) => {
    // only handle keys when result is showing
    if (inputFocused) {
      // Enter: if a list item is selected, trigger that list item's click handler,
      // otherwise trigger a normal input submit
      if (e.keyCode === 13) {
        e.preventDefault();

        if (selectedListItemIndex != null) {
          let selectedResultListItem = resultListItems.find(
            (item) => item.index === selectedListItemIndex,
          );
          selectedResultListItem?.clickHandler();
          notifyInputDone();
          return;
        }

        if (!inputPhrase) return;

        if (inputPhrase[0] === "@") {
          const formattedPhrase = inputPhrase.slice(1);
          setRecentSearchListItem({isPhrase: true, phrase: inputPhrase});

          history.push(`/user/${formattedPhrase}`);
          notifyInputDone();
          return;
        } else if (inputPhrase[0] === "#") {
          setRecentSearchListItem({isPhrase: true, phrase: inputPhrase});

          history.push(`/hashtag/%23${inputPhrase.slice(1)}`);
          notifyInputDone();
          return;
        }

        if (/^\s+$/.test(inputPhrase)) {
          clearInput();
        } else {
          notifyInputDone();
        }
      }

      // ESC
      if (e.keyCode === 27) {
        e.preventDefault();
        inputRef.current.blur();
        clearTimeout(searchTimeout);

        setShowResult(false);

        if (/^\s+$/.test(inputPhrase)) {
          clearInput();
        }
      }

      // UP OR DOWN
      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();

        if (resultListItems && resultListItems.length > 0) {
          // get an array of seletable indexes that represent the list items that have click handlers
          // we will only be able to navigate through list items that have clickHandlers
          let selectableListItemIndexes = listItemSelectableIndexes;

          let currentArrayIndex =
            selectedListItemIndex != null
              ? selectableListItemIndexes.findIndex(
                  (e) => e === selectedListItemIndex,
                )
              : null;
          let arrayMaxIndex = selectableListItemIndexes.length - 1;

          // Up
          if (e.keyCode === 38) {
            if (currentArrayIndex != null)
              currentArrayIndex =
                currentArrayIndex > 0 ? currentArrayIndex - 1 : arrayMaxIndex;
            else currentArrayIndex = arrayMaxIndex;
          }

          // Down
          if (e.keyCode === 40) {
            if (currentArrayIndex !== null)
              currentArrayIndex =
                currentArrayIndex < arrayMaxIndex ? currentArrayIndex + 1 : 0;
            else currentArrayIndex = 0;
          }

          setSelectedListItemIndex(
            selectableListItemIndexes[currentArrayIndex],
          );
        }
      }
    }
  }; //, 300);

  const clearInput = () => {
    inputRef.current.value = "";
    handleInputChange("");
    inputRef.current.focus();
  };

  const goToSearchResult = (_inputPhrase) => {
    setShowResult(false);

    if (!Util.StringIsEmpty(_inputPhrase)) {
      let url = api.getUrlSearchResults(_inputPhrase);

      // save inputPhrase as listItem in rencet search
      setRecentSearchListItem({isPhrase: true, phrase: _inputPhrase});

      // go to search page
      history.push(url);
    }
  };

  const notifyInputDone = (_inputPhrase) => {
    clearTimeout(searchTimeout);
    goToSearchResult(_inputPhrase || inputPhrase);
  };

  const clickSearchIcon = () => {
    if (selectedListItemIndex != null) {
      let selectedResultListItem = resultListItems.find(
        (e) => e.index === selectedListItemIndex,
      );
      selectedResultListItem?.clickHandler();
    } else if (/^\s+$/.test(inputPhrase)) {
      clearInput();
    } else {
      notifyInputDone();
    }
  };

  const removeAllRecentSearchListItems = () => {
    localStorage.setItem(AppConsts.LOCAL_STORAGE_RECENT_SEARCH, null);

    setShowResult(false);
    setResultListItems(null);
  };

  const getResultFooterComp = (resultListItem, searchMode) => {
    let comp = null;

    if (searchMode === SEARCH_MODE_NORMAL_SEARCH) {
      comp = <div className="footer">{resultListItem.viewAllText}</div>;
    }

    return comp;
  };

  const getResultListItems = async (_inputPhrase, searchMode) => {
    let resultListItems = [];

    let searchListItems = await getSearchListItems(_inputPhrase, searchMode);

    let isRecentSearch = searchMode === SEARCH_MODE_RECENT_SEARCH;

    let isNormalSearch = searchMode === SEARCH_MODE_NORMAL_SEARCH;

    const isResultEmpty = !searchListItems || searchListItems.length === 0;

    // headerListItem
    if (isRecentSearch && !isResultEmpty) {
      resultListItems.push(getHeaderListItem(_inputPhrase, searchMode));
    }

    // searchListItems: hashtags and users
    if (searchListItems && searchListItems.length > 0) {
      resultListItems = resultListItems.concat(searchListItems);
    }

    // footerListItem
    if (isNormalSearch && !isResultEmpty) {
      resultListItems.push(getFooterListItem(_inputPhrase));
    }

    // attach index to each listItem: mainly for tracking which item is selected/hovered using up/down key
    resultListItems = resultListItems.map((resultListItem, index) => {
      resultListItem.index = index;
      return resultListItem;
    });

    return resultListItems;
  };

  const getSearchListItems = async (_inputPhrase, searchMode) => {
    let resultListItems = [];

    if (searchMode === SEARCH_MODE_RECENT_SEARCH) {
      resultListItems = getRecentSearchListItems();
    }

    if (searchMode === SEARCH_MODE_NORMAL_SEARCH) {
      resultListItems = await getNormalSearchListItems(_inputPhrase);
    }

    // attach clickHandler to each listItem so that up/down/enter keys can easily trigger
    if (resultListItems?.length) {
      resultListItems = resultListItems.map((resultListItem) => {
        if (resultListItem.isHashtag) {
          resultListItem.clickHandler = (e) => {
            setShowResult(false);

            setRecentSearchListItem(resultListItem);

            let hashtagUrl = `/hashtag/${encodeURIComponent(
              resultListItem.name,
            )}`;

            history.push(hashtagUrl);
            inputRef.current.value = resultListItem.name;
            setInputPhrase(resultListItem.name);
          };
        }

        if (resultListItem.isUser) {
          resultListItem.clickHandler = (e) => {
            setShowResult(false);

            setRecentSearchListItem(resultListItem);

            let userProfileUrl = `/user/${resultListItem.username}`;
            history.push(userProfileUrl);
            inputRef.current.value = resultListItem.username;
            setInputPhrase(resultListItem.username);
          };
        }

        if (resultListItem.isPhrase) {
          resultListItem.clickHandler = (e) => {
            goToSearchResult(resultListItem.phrase);
            inputRef.current.value = resultListItem.phrase;
            setInputPhrase(resultListItem.phrase);
          };
        }

        return resultListItem;
      });
    }

    return resultListItems;
  };

  const getRecentSearchListItems = () => {
    let recentSearchListItems = JSON.parse(
      localStorage.getItem(AppConsts.LOCAL_STORAGE_RECENT_SEARCH),
    );

    if (!Array.isArray(recentSearchListItems)) {
      recentSearchListItems = [];
    }

    // for now only return recent search that are phrases
    recentSearchListItems = recentSearchListItems.filter((e) => {
      if (e.isUser) {
        e.phrase = e.username;
        e.isUser = false;
        e.isPhrase = true;
      }
      if (e.isHashtag) {
        e.isPhrase = true;
        e.isHashtag = false;
        e.phrase = e.name.replace(/^#*/, "");
      }
      return true;
    });

    return recentSearchListItems;
  };

  const getNormalSearchListItems = async (_inputPhrase) => {
    try {
      const resultMap = await api.fetchSearchChoices(
        _inputPhrase,
        MAX_LIST_ITEMS,
        0,
      );

      const list = resultMap?.data?.list;
      const uinf = resultMap?.aux?.uinf;

      if (list && list.length > 0) {
        const hashtagList = list
          .filter((item) => item.startsWith("#"))
          .map((item) => {
            return {isHashtag: true, name: item};
          });
        const userList = list
          .filter(
            (item) => item.startsWith("@") && uinf && uinf[item.substring(1)],
          )
          .map((item) => {
            const userInfo = uinf[item.substring(1)];
            return {
              isUser: true,
              isVerified: userInfo.infl,
              nickname: userInfo.nickname,
              ousername: userInfo.ousername,
              username: userInfo.username,
              avatar: userInfo.ico,
            };
          });
        if (hashtagList.length > 0) {
          hashtagList[hashtagList.length - 1].isLast = true;
        }
        if (userList.length > 0) {
          userList[userList.length - 1].isLast = true;
        }
        return [...hashtagList, ...userList];
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getHeaderListItem = (_inputPhrase, searchMode) => {
    let resultListItem = {
      isHeader: true,
      inputPhrase: _inputPhrase,
    };

    if (searchMode === SEARCH_MODE_RECENT_SEARCH) {
      resultListItem.labelText = t("getter_fe.common.search.recentSearches");
      resultListItem.actionLinkText = t(
        "getter_fe.common.search.clearAllRecentSearches",
      );
    }

    // if (searchMode === SEARCH_MODE_NORMAL_SEARCH) {
    //   resultListItem.labelText = format(
    //     '{0} "{1}"',
    //     t("getter_fe.common.search.searchFor"),
    //     _inputPhrase,
    //   );
    //   resultListItem.actionLinkText = t("getter_fe.common.search.viewResults");
    //   resultListItem.clickHandler = (e) => {
    //     notifyInputDone(_inputPhrase);
    //   };
    // }

    return resultListItem;
  };

  const getFooterListItem = (_inputPhrase) => {
    let resultListItem = {
      isFooter: true,
      inputPhrase: _inputPhrase,
      viewAllText: t("getter_fe.common.search.viewAllSearchResults"),
      clickHandler: () => {
        notifyInputDone(_inputPhrase);
      },
    };

    return resultListItem;
  };

  const setRecentSearchListItem = (resultListItem) => {
    let recentSearchListItems = JSON.parse(
      localStorage.getItem(AppConsts.LOCAL_STORAGE_RECENT_SEARCH),
    );

    if (recentSearchListItems == null) recentSearchListItems = [];

    let recentSearchListItem;

    if (resultListItem.isHashtag) {
      recentSearchListItem = recentSearchListItems.find(
        (e) => e.isHashtag && e.name === resultListItem.name,
      );
    } else if (resultListItem.isUser) {
      recentSearchListItem = recentSearchListItems.find(
        (e) => e.isUser && e.username === resultListItem.username,
      );
    } else if (resultListItem.isPhrase) {
      recentSearchListItem = recentSearchListItems.find(
        (e) => e.isPhrase && e.phrase === resultListItem.phrase,
      );
    }

    // if recentSearchListItem doesn't exist already, push as new
    if (recentSearchListItem == null) {
      recentSearchListItem = resultListItem;
      recentSearchListItem.isLast = false;
      recentSearchListItem.recentSearchItemUuid = uuid();
      recentSearchListItem.date = new Date().toISOString();
      recentSearchListItems.push(recentSearchListItem);
    } // if recentSearchListItem exists already, update the date so it can show on top
    else {
      recentSearchListItem.date = new Date().toISOString();
    }

    // sort the results by date
    recentSearchListItems.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
    });

    // limit the max number
    recentSearchListItems = recentSearchListItems.slice(0, MAX_LIST_ITEMS);

    localStorage.setItem(
      AppConsts.LOCAL_STORAGE_RECENT_SEARCH,
      JSON.stringify(recentSearchListItems),
    );
  };

  // const removeRecentSearchListItem = (recentSearchItemUuid) => {
  //   let recentSearchListItems = JSON.parse(
  //     localStorage.getItem(AppConsts.LOCAL_STORAGE_RECENT_SEARCH),
  //   );

  //   if (recentSearchListItems == null) recentSearchListItems = [];

  //   recentSearchListItems = recentSearchListItems.filter((e) => {
  //     return e.recentSearchItemUuid !== recentSearchItemUuid;
  //   });

  //   localStorage.setItem(
  //     AppConsts.LOCAL_STORAGE_RECENT_SEARCH,
  //     JSON.stringify(recentSearchListItems),
  //   );

  //   setResultListItems(
  //     resultListItems.filter((e) => {
  //       return e.recentSearchItemUuid !== recentSearchItemUuid;
  //     }),
  //   );
  // };

  const getSearchBoxComp = () => {
    let comp = null;

    let cancelIcon = inputPhrase ? (
      <div className="cancel-icon" onClick={() => clearInput()}>
        <IconCancel />
      </div>
    ) : null;

    let searchIcon = (
      <div className="search-icon" onClick={() => clickSearchIcon()}>
        <IconSearch />
      </div>
    );

    comp = (
      <div className={classes.searchBoxWrapper}>
        <form
          className={clsx(classes.searchBox, inputFocused && "focus")}
          onSubmit={(e) => {
            setSubmitting(true);
            e.preventDefault();
            e.stopPropagation();
            notifyInputDone();
          }}
        >
          {searchIcon}
          <input
            id="searchInput"
            ref={inputRef}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t("getter_fe.common.search.placeholder")}
            autoComplete="off"
            onFocus={(e) => handleInputFocus(e.target.value)}
            onBlur={handleInputBlur}
            type="text"
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
          />
          {cancelIcon}
        </form>
        {getSearchResultComp()}
      </div>
    );

    return comp;
  };

  const getResultHeaderComp = (resultListItem) => {
    let comp = null;

    let labelComp = <div className="label">{resultListItem.labelText}</div>;

    let clearAllComp = resultListItem.actionLinkText ? (
      <div
        onClick={() => removeAllRecentSearchListItems()}
        className="action-link"
      >
        {resultListItem.actionLinkText}
      </div>
    ) : null;

    comp = (
      <div className="header">
        {labelComp}
        {clearAllComp}
      </div>
    );

    return comp;
  };

  const getResultListItemsComp = (resultListItems, searchMode) => {
    return resultListItems.map((resultListItem) => {
      let contentComp;

      if (resultListItem.isHeader) {
        contentComp = getResultHeaderComp(resultListItem);
      }

      if (resultListItem.isHashtag) {
        contentComp = getHashtagListItemComp(resultListItem);
      }

      if (resultListItem.isUser) {
        contentComp = getUserListItemComp(resultListItem);
      }

      // this only applies to recent search mode
      if (resultListItem.isPhrase) {
        contentComp = getPhraseListItemComp(resultListItem);
      }

      if (resultListItem.isFooter) {
        contentComp = getResultFooterComp(resultListItem, searchMode);
      }

      let clickHandler = resultListItem.clickHandler || null;
      let selectable = clickHandler !== null;
      let mouseEnterHandler = selectable
        ? () => {
            setSelectedListItemIndex(resultListItem.index);
          }
        : null;

      // let removeSearchComp = null;

      // if (
      //   searchMode === SEARCH_MODE_RECENT_SEARCH &&
      //   (resultListItem.isHashtag || resultListItem.isUser || resultListItem.isPhrase)
      // ) {
      //   removeSearchComp = (
      //     <div
      //       onClick={(e) => {
      //         removeRecentSearchListItem(resultListItem.recentSearchItemUuid);
      //         e.stopPropagation();
      //       }}
      //       className="remove-search"
      //     >
      //       <IconCancel />
      //     </div>
      //   );
      // }

      let arrowIconComp = null;
      if (
        searchMode === SEARCH_MODE_RECENT_SEARCH &&
        (resultListItem.isHashtag ||
          resultListItem.isUser ||
          resultListItem.isPhrase)
      ) {
        arrowIconComp = (
          <div className="arrow">
            <SmallArrowIcon />
          </div>
        );
      } else if (
        searchMode === SEARCH_MODE_NORMAL_SEARCH &&
        resultListItem.isHashtag
      ) {
        arrowIconComp = (
          <div className="arrow rotate">
            <SmallArrowIcon />
          </div>
        );
      }

      return (
        <div
          key={resultListItem.index}
          onClick={clickHandler}
          onMouseEnter={mouseEnterHandler}
          className={classnames(
            "result-list-item",
            // {"select-option": selectable},
            {
              selected:
                selectable && selectedListItemIndex === resultListItem.index,
            },
            resultListItem.isLast && "withDivider",
          )}
        >
          {contentComp}

          {/* {removeSearchComp} */}

          {arrowIconComp}
        </div>
      );
    });
  };

  const getEmptyResultListItemsComp = () => {
    return (
      <div className="result-list-item">
        <div className="header">
          <div className="label">
            {"Try searching for people, hashtags, or keywords"}
          </div>
        </div>
      </div>
    );
  };

  const getUserListItemComp = (resultListItem) => {
    let comp = null;
    const username = resultListItem.ousername
      ? resultListItem.ousername
      : resultListItem.username;

    comp = (
      <div className="user">
        <div className="main-info">
          <AvatarLink
            avatarUrl={resultListItem.avatar}
            styleClasses="user-avatar"
            userId={resultListItem.username}
            username={username}
          />
          <div className="user-info">
            <div className="nickname-wrapper">
              <div className="nickname">
                <GTwemoji text={`${resultListItem.nickname || username}`} />
              </div>
              {resultListItem.isVerified && (
                <IconVerification className="icon" />
              )}
            </div>
            <div className="username">@{username}</div>
          </div>

          {/* <div className="additional-info">
            <div className="time-since">{resultListItem.timeSince}</div>
          </div> */}
        </div>
      </div>
    );

    return comp;
  };

  const getHashtagListItemComp = (resultListItem) => {
    const hashName = resultListItem.name;

    let comp = (
      <div className="hashtag">
        <div className="name">
          <Highlighter
            highlightClassName="keyword"
            searchWords={[inputPhrase, "#"]}
            autoEscape={true}
            textToHighlight={hashName}
          />
        </div>
      </div>
    );

    return comp;
  };

  const getPhraseListItemComp = (resultListItem) => {
    let comp = (
      <div className="phrase">
        <div className="name">{resultListItem.phrase}</div>
      </div>
    );

    return comp;
  };

  const getSearchResultComp = () => {
    let comp = null;

    if (showResult) {
      let wrapperComp = null;

      if (resultListItems && resultListItems.length > 0) {
        wrapperComp = (
          <div>{getResultListItemsComp(resultListItems, searchMode)}</div>
        );
      }

      comp = <div className={classes.searchResult}>{wrapperComp}</div>;
    } else if (inputFocused && !inputPhrase) {
      comp = (
        <div className={classes.searchResult}>
          <div>{getEmptyResultListItemsComp()}</div>
        </div>
      );
    }

    return comp;
  };

  const onBackBtnClick = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.push(`/`);
    }
  };

  let comp = (
    <div ref={postSearchBoxRef} className={classes.root}>
      {withBackBtnPaths.some((path) =>
        pathname.toLowerCase().startsWith(path),
      ) && (
        <div className={clsx(classes.backBtn)} onClick={onBackBtnClick}>
          <BackIcon />
        </div>
      )}
      {getSearchBoxComp()}
    </div>
  );

  return comp;
}
