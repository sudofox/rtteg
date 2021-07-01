import {makeStyles, Menu, MenuItem} from "@material-ui/core";
import React, {useState, Fragment} from "react";
import {ReactComponent as RepostIcon} from "src/assets/icons/feature/retweet.svg";
import {ReactComponent as QuoteIcon} from "src/assets/icons/feature/quote.svg";
import {t} from "../../../i18n/utils";
import {
  STATUS_SHARED,
  STATUS_UNKNOWN,
} from "../../../core/model/social/XMShare";
import AppConsts, {UIStyleConsts} from "../../AppConsts";
import classnames from "classnames";
import {RepostComposer} from "src/app/components/post/comps/RepostComposer";
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
        width: 20,
        height: "auto",
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
    "& .text": {
      marginLeft: 4,
    },
    "& .count": {
      color: theme.palette.text.gray,
      fontWeight: 350,
      fontSize: 13,
      "&.active": {
        color: theme.palette.primary.main,
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
          "& path": {
            fill: theme.blue.light,
          },
        },
        "& .tooltiptext": {
          visibility: "visible",
        },
      },
      "& .count": {
        color: `${theme.palette.primary.main} !important`,
      },
    },
    "&.white:hover": {
      "& .icon": {
        backgroundColor: "rgba(255,255,255,.2)",
        "& svg": {
          stroke: `#fff !important`,
        },
      },
      "& .count": {
        color: `#fff !important`,
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
      transform: "none !important",
      transition: "none !important",
    },
    "& ul": {
      padding: 0,
    },

    "& li": {
      paddingRight: theme.spacing(2.5),
    },

    "& .MuiListItem-button": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.grey.A300,
      },
    },
  },
  repostIcon: {
    "&.active": {
      color: `${theme.palette.text.link} !important`,
    },
  },
  quoteIcon: {
    "& path": {
      fill: theme.palette.text.light,
    },
  },
  menuItem: {
    padding: 0,
  },
  menuInner: {
    display: "block",
    height: "50px",
    width: "100%",
    lineHeight: "18px",
    padding: "15px 0",
    color: "#000",
    fontSize: "14px",
    fontWeight: 400,
    "& svg": {
      margin: "0 11px 0 14px",
      verticalAlign: "top",
      fill: "transparent",
    },
  },
  menuSvg: {},
}));

const connector = connect(
  (state) => {
    return {
      loggedInUserId: state.auth?.session?.userinfo?._id,
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
}) {
  /**
   * TODO: fix delete comment in Timeline and User feed
   */
  const classes = useStyles();
  const authRedirect = useAuthRedirect();

  const api = Global.GetPortal().getAppService();

  const [anchorEl, setAnchorEl] = useState(null);
  const [repostOpen, setRepostOpen] = useState(false);

  const isDisabled =
    loading || repostStatus === STATUS_UNKNOWN || !repostStatus;
  const isActive = repostStatus === STATUS_SHARED;

  const getPostAction = () => {
    const itemClassName = item.getClassname();

    if (itemClassName === "Comment") {
      return ActivityLogProps.SHARES_COMMENT;
    }

    if (itemClassName === "XMPostItem") {
      return ActivityLogProps.USER_PUB_POST;
    }

    return item.getAction();
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
      if (err.data.emsg?.includes("limit")) {
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

    const postItemAction = getPostAction();

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
            item?.data?.activity?.src_id === loggedInUserId &&
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
          skin,
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
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
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
                  setRepostOpen(true);
                }}
              >
                <QuoteIcon className={classes.quoteIcon} />
                <span>{t("getter_fe.post.button.quotePost")}</span>
              </div>
            </MenuItem>
          </Menu>
          <RepostComposer
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
          />
        </Fragment>
      )}
    </Fragment>
  );
}
