import React from "react";
import {makeStyles} from "@material-ui/core";
import {ReactComponent as LikeIcon} from "src/assets/icons/feature/like.svg";
import classnames from "classnames";
import {t} from "../../../i18n/utils";
import {formatLongNumber} from "src/util/NumberUtil";
import Global from "src/system/Global";
import {useAuthRedirect} from "src/util/useAuthRedirect";
import {toast} from "react-toastify";
import {NotifMessage} from "../../components/notifications/NotifMessage";

const STATUS_LIKE = "y";
const STATUS_UNKNOWN = "u";

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
    "& .text": {
      marginLeft: 4,
    },
    "& .count": {
      color: theme.palette.text.lightGray,
      fontWeight: 400,
      fontSize: 13,
      "&.active": {
        color: theme.palette.error.light,
      },
      [theme.breakpoints.only("xs")]: {
        fontSize: 11,
      },
    },
    "&:hover": {
      "& .icon": {
        borderRadius: "100%",
        backgroundColor: "#DD18180F",
        "& svg": {
          color: theme.palette.error.light,
        },
        "& .tooltiptext": {
          visibility: "visible",
        },
      },
      "& .count": {
        color: theme.palette.error.light,
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
      stroke: theme.palette.error.light,
    },
  },
  likeIcon: {
    "&.active": {
      color: `${theme.palette.error.light} !important`,
    },
  },
}));

export const LikeButton = ({
  isPostDetail,
  likeStatus,
  count,
  objId,
  loading,
  loggedIn,
  tooltip,
  isComment,
  hideDropdown,
  setLikedCount,
  updateLikeStatus,
  updateCommentLikeStatus,
  skin,
}) => {
  const classes = useStyles();
  const authRedirect = useAuthRedirect();

  const isDisabled = loading || likeStatus === STATUS_UNKNOWN || !likeStatus;
  const isActive = likeStatus === STATUS_LIKE;

  const api = Global.GetPortal().getAppService();

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) {
      return;
    }

    if (!loggedIn) {
      authRedirect();
      return;
    }

    if (hideDropdown) {
      hideDropdown();
    }

    if (isActive) {
      // handle unlike
      setLikedCount(parseInt(count) - 1);

      try {
        if (isComment) {
          if (typeof updateCommentLikeStatus === "function") {
            updateCommentLikeStatus("n");
          } else {
            updateLikeStatus("n");
          }

          await api.userUnlikesComment(objId, null);
        } else {
          updateLikeStatus("n");
          await api.userUnlikesPost(objId, null);
        }
      } catch (err) {
        setLikedCount(parseInt(count) + 1);
        updateLikeStatus("y");
        console.log(err);
        if (err && err.data?.emsg?.includes("status code 429")) {
          toast(
            <NotifMessage message={t("getter_fe.common.errorTips.err429")} />,
            {
              position: toast.POSITION.TOP_CENTER,
              type: AppConsts.NOTIF_MESSAGE_ERROR,
            },
          );
        }
      }
    } else {
      // handle like
      count = isNaN(count) ? 0 : count;
      setLikedCount(parseInt(count) + 1);

      try {
        if (isComment) {
          if (typeof updateCommentLikeStatus === "function") {
            updateCommentLikeStatus("y");
          } else {
            updateLikeStatus("y");
          }
          await api.userLikesComment(objId, null);
        } else {
          updateLikeStatus("y");
          await api.userLikesPost(objId, null);
        }
      } catch (err) {
        count = isNaN(count) ? 0 : count;
        setLikedCount(parseInt(count) - 1);
        updateLikeStatus("n");
        console.log(err);
        if (err && err.data?.emsg?.includes("status code 429")) {
          toast(
            <NotifMessage message={t("getter_fe.common.errorTips.err429")} />,
            {
              position: toast.POSITION.TOP_CENTER,
              type: AppConsts.NOTIF_MESSAGE_ERROR,
            },
          );
        }
      }
    }
  };

  return (
    <div
      onClick={onClick}
      disabled={isDisabled}
      className={classnames(classes.root, `icon-${skin}`)}
    >
      <div className={classnames("icon btn-like", {"is-liked": isActive})}>
        <LikeIcon
          className={classnames(classes.likeIcon, {active: isActive})}
        />
        <span className={`tooltiptext ${tooltip}`}>
          {t("getter_fe.post.button.like")}
        </span>
      </div>
      <div className="text">
        {!isPostDetail && (
          <div
            className={classnames(
              "count btn-like",
              isActive && "active is-liked",
            )}
          >
            <span>{formatLongNumber(count || 0)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
