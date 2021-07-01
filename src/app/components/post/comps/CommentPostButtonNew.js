import {makeStyles} from "@material-ui/core";
import {ReactComponent as CommentIcon} from "src/assets/icons/feature/comment.svg";
import {UIStyleConsts} from "src/app/AppConsts";
import classnames from "classnames";
import {formatLongNumber} from "src/util/NumberUtil";
import {t} from "src/i18n/utils";
import {useAuthRedirect} from "src/util/useAuthRedirect";
import Global from "src/system/Global";

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
      fontSize: "13px",
      [theme.breakpoints.only("xs")]: {
        fontSize: "11px",
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
  commentIcon: {
    "&.active": {
      color: `${theme.palette.text.link} !important`,
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      stroke: theme.palette.text.secondary,
    },
    "100%": {
      stroke: theme.palette.primary.main,
    },
  },
}));

export const CommentPostButton = ({
  isPostDetail,
  count,
  tooltip,
  loggedIn,
  skin,
  handlePopup,
}) => {
  const classes = useStyles();
  const authRedirect = useAuthRedirect();
  loggedIn = !!Global.GetPortal().getAppService().getUserId();

  return (
    <div
      onClick={(e) => {
        if (!loggedIn) {
          e.stopPropagation();
          authRedirect();
        } else if (handlePopup) {
          handlePopup();
        }
      }}
      className={classnames(
        "comment-post-button",
        UIStyleConsts.POST_FEED_ITEM_BUTTON,
        classes.root,
        `icon-${skin}`,
      )}
    >
      <div className="icon">
        <CommentIcon className={classes.commentIcon} />
        <span className={`tooltiptext ${tooltip}`}>
          {t("getter_fe.post.button.reply")}
        </span>
      </div>

      <div className="text">
        {!isPostDetail && (
          <div className="count">{formatLongNumber(count || 0)}</div>
        )}
      </div>
    </div>
  );
};
