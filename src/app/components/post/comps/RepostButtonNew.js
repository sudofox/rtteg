import {debounce, makeStyles, Menu, MenuItem} from "@material-ui/core";
import React, {useState, Fragment, useEffect} from "react";
import {useHistory} from "react-router";
import {ReactComponent as RepostIcon} from "src/assets/icons/feature/retweet.svg";
import {ReactComponent as QuoteIcon} from "src/assets/icons/feature/quote.svg";
import {t} from "src/i18n/utils";
import {STATUS_SHARED, STATUS_UNKNOWN} from "src/core/model/social/XMShare";
import AppConsts, {UIStyleConsts} from "src/app/AppConsts";
import classnames from "classnames";

import {formatLongNumber} from "src/util/NumberUtil";
import Global from "src/system/Global";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {
  addPost,
  removeRepost,
  removeSharedPost,
} from "src/app/components/timeline/store";
import {connect} from "react-redux";
import {ActivityLogProps} from "src/core/model/ModelConsts";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& .icon": {
      position: "relative",
      "& svg": {
        color: theme.palette.primary.light,
      },
      "& .tooltiptext": {
        position: "absolute",
        padding: "6px",
        background: theme.palette.background.gray,
        borderRadius: "2px",
        fontSize: "11px",
        color: theme.palette.text.disabled,
        visibility: "hidden",
        lineHeight: "8px",
        zIndex: 1,
        top: "100%",
        left: "50%",
        transform: "translate(-50%, 2px)",
        whiteSpace: "nowrap",
        "&.top": {
          transform: "translate(-50%, -52px)",
        },
      },
    },
    "& .count": {
      color: theme.palette.text.lightGray,
      fontWeight: 400,
      fontSize: 13,
      "&.active": {
        color: theme.palette.text.link,
      },
      [theme.breakpoints.only("xs")]: {
        fontSize: 11,
      },
    },
    "&:hover": {
      "& .icon": {
        borderRadius: "100%",
        backgroundColor: "#EDF7FF",
        "& svg": {
          color: theme.palette.text.link,
        },
        "& .tooltiptext": {
          visibility: "visible",
        },
      },
      "& .count": {
        color: theme.palette.text.link,
      },
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      stroke: theme.palette.text.gray,
    },
    "100%": {
      stroke: theme.palette.primary.main,
    },
  },
  menuPanel: {
    marginLeft: "-178px",
    marginTop: "-26px",
    width: "218px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    border: `1px solid ${theme.palette.grey.A800}`,
    boxShadow: "0px 0px 11px rgba(86, 103, 121, 0.19)",
    "& a": {
      display: "flex",
      height: "50px",
      lineHeight: "20px",
      padding: "15px 0",
      color: theme.palette.text.primary,
      fontSize: "14px",
      fontWeight: 400,
      "& svg": {
        margin: "0 11px 0 14px",
        verticalAlign: "top",
        stroke: "#083E90",
      },
      "&:hover": {
        backgroundColor: "#F9F9F9",
      },
    },
  },
  menu: {
    "& .MuiPaper-root": {
      minWidth: theme.spacing(22.5),
      maxWidth: theme.spacing(31.25),
      borderRadius: 8,
      boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.08)",
    },
    "& ul": {
      padding: 0,
    },

    "& .MuiListItem-button": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.grey.A300,
      },
    },
    "& svg": {
      color: theme.palette.grey.A700,
      margin: theme.spacing(0, 1.875, 0, 1.25),
    },
  },
  menuItem: {
    padding: theme.spacing(1),
  },
  menuInner: {
    display: "flex",
    alignItems: "center",
    height: 33,
    width: "100%",
    lineHeight: "18px",
    color: "#000",
    fontSize: 15,
    fontWeight: 400,
  },
  repostIcon: {
    width: 16.7,
    height: 16.7,
    "&.active": {
      color: `${theme.palette.text.link} !important`,
    },
  },
}));

const connector = connect(
  (state) => {
    return {
      loggedInUserId: state.auth.session?.userinfo?._id,
    };
  },
  {addPost, removeRepost, removeSharedPost},
);

export const RepostButton = connector(_RepostButton);

function _RepostButton({
  isPostDetail,
  repostStatus,
  count,
  objId,
  item,
  setRepostCount,
  loading,
  loggedIn,
  tooltip,
  updateRepostStatus,
  hideDropdown,
  skin,
  removeRepost,
  removeSharedPost,
  removePostFromProfile,
  loggedInUserId,
  handlePopup,
}) {
  /**
   * TODO: fix delete comment in Timeline and User feed
   */
  const classes = useStyles();
  const history = useHistory();

  const api = Global.GetPortal().getAppService();

  const [anchorEl, setAnchorEl] = useState(null);
  // const [repostOpen, setRepostOpen] = useState(false);
  useDetectScroll(Boolean(anchorEl), () => setAnchorEl(null));
  const authRedirect = useAuthRedirect();

  const isDisabled =
    loading || repostStatus === STATUS_UNKNOWN || !repostStatus;

  const isActive = repostStatus === STATUS_SHARED;

  const getPostAction = () => {
    if (item.type === "comment") {
      return ActivityLogProps.SHARES_COMMENT;
    }

    if (
      item.type === "post" ||
      item.action === ActivityLogProps.POST_PUBLISHEDBY
    ) {
      return ActivityLogProps.USER_PUB_POST;
    }

    if (!item.type && !item.action && !item.pub_pst) {
      return ActivityLogProps.USER_PUB_POST;
    }

    return item.pub_pst;
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    !loggedIn && authRedirect();

    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let repostProcess = (err, result) => {
    if (err) {
      updateRepostStatus("n");
      setRepostCount(count);

      if (err.data?.emsg?.includes("status code 429")) {
        toast(
          <NotifMessage message={t("getter_fe.common.errorTips.err429")} />,
          {
            position: toast.POSITION.TOP_CENTER,
            type: AppConsts.NOTIF_MESSAGE_ERROR,
          },
        );
      } else if (err.data.emsg?.includes("limit")) {
        toast.info(
          <NotifMessage message={t("getter_fe.post.errors.maxLimit")} />,
          {
            type: toast.TYPE.ERROR,
          },
        );
      } else {
        toast.info(
          <NotifMessage message={t("getter_fe.post.errors.submitPost")} />,
          {
            type: toast.TYPE.ERROR,
          },
        );
      }
      return;
    }
    toast.info(
      <NotifMessage
        message={
          <div className="notifmesage-with-link">
            <span>{t("getter_fe.post.tips.getter_was_repost")}</span>
          </div>
        }
      />,
      {
        type: toast.TYPE.SUCCESS,
      },
    );
  };

  const handleUndoRepost = () => {
    if (!item || !objId || !isActive) {
      return;
    }

    const postItemAction = getPostAction() || item.action;

    handleClose();
    updateRepostStatus("n");
    count > 0 && setRepostCount(count - 1);

    if (
      postItemAction === ActivityLogProps.USER_PUB_POST ||
      postItemAction === ActivityLogProps.SHARES_POST ||
      postItemAction === ActivityLogProps.POST_PUBLISHEDBY ||
      postItemAction === ActivityLogProps.SHARES_COMMENT
    ) {
      api.userUnshares(
        objId,
        postItemAction === ActivityLogProps.USER_PUB_POST ||
          postItemAction === ActivityLogProps.SHARES_POST ||
          postItemAction === ActivityLogProps.POST_PUBLISHEDBY
          ? "p"
          : "c",
        (err) => {
          if (err) {
            updateRepostStatus("y");
            setRepostCount(count);

            toast.info(
              <NotifMessage message={t("getter_fe.common.errorOccured")} />,
              {
                type: toast.TYPE.ERROR,
              },
            );
            return;
          }

          if (
            item?.uid === loggedInUserId &&
            (postItemAction === ActivityLogProps.USER_PUB_POST ||
              postItemAction === ActivityLogProps.SHARES_POST ||
              postItemAction === ActivityLogProps.SHARES_COMMENT)
          ) {
            removePostFromProfile && removePostFromProfile(objId);

            removeRepost(objId);
            removeSharedPost(objId);
          }
        },
      );
    }
  };

  const handleRepost = () => {
    if (!objId) {
      return;
    }

    handleClose();
    updateRepostStatus("y");
    count = isNaN(count) ? 0 : count;
    !isActive && setRepostCount(count + 1);

    const postItemAction = getPostAction();

    postItemAction === ActivityLogProps.USER_PUB_POST ||
    postItemAction === ActivityLogProps.SHARES_POST ||
    postItemAction === ActivityLogProps.POST_PUBLISHEDBY
      ? api.userSharesPost(objId, "", repostProcess)
      : api.userSharesComment(objId, repostProcess);
  };

  return (
    <Fragment>
      <div
        disabled={isDisabled}
        className={classnames(
          classes.root,
          "repost-button",
          UIStyleConsts.POST_FEED_ITEM_BUTTON,
          {active: isActive},
          `icon-${skin}`,
        )}
        onClick={(e) => handleClick(e)}
      >
        <div className="icon">
          <RepostIcon
            className={classnames(classes.repostIcon, isActive && "active")}
          />
          <span className={`tooltiptext ${tooltip}`}>
            {t("getter_fe.post.button.repost")}
          </span>
        </div>
        <div className="text">
          {!isPostDetail && (
            <div className={classnames("count", isActive && "active")}>
              <span>{formatLongNumber(count || 0)}</span>
            </div>
          )}
        </div>
      </div>
      {loggedIn && (
        <Fragment>
          <Menu
            id="repost-menu"
            anchorEl={anchorEl}
            disableScrollLock
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={classes.menu}
          >
            <MenuItem
              className={classes.menuItem}
              onClick={isActive ? handleUndoRepost : handleRepost}
            >
              <div className={classes.menuInner}>
                <RepostIcon className={classes.repostIcon} />
                <span>
                  {isActive
                    ? t("getter_fe.post.button.undoRepost")
                    : t("getter_fe.post.button.repost")}
                </span>
              </div>
            </MenuItem>
            <MenuItem className={classes.menuItem}>
              <div
                className={classes.menuInner}
                onClick={() => {
                  handleClose();
                  handlePopup();
                }}
              >
                <QuoteIcon className={classes.quoteIcon} />
                <span>{t("getter_fe.post.button.quotePost")}</span>
              </div>
            </MenuItem>
          </Menu>
          {/* <RepostComposer
            item={item}
            isPopup={true}
            open={repostOpen}
            postId={objId}
            shst={repostStatus}
            propOnSubmit={(isQuoted) => {
              !isQuoted && updateRepostStatus("y");
              !isActive && setRepostCount(count + 1);
            }}
            hideDropdown={hideDropdown}
            closeRepostMenu={() => {
              setRepostOpen(false);
            }}
            alreadyReposted={isActive}
          /> */}
        </Fragment>
      )}
    </Fragment>
  );
}

const useDetectScroll = (isOpen, callback) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const _setHasScrolled = debounce(() => setHasScrolled(true), 100);
    if (isOpen) {
      window.addEventListener("scroll", _setHasScrolled);
    }
    return () => window.removeEventListener("scroll", _setHasScrolled);
  }, [isOpen]);

  if (hasScrolled) {
    callback();
    setHasScrolled(false);
  }

  return hasScrolled;
};
