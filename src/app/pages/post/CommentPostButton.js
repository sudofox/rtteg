import {makeStyles} from "@material-ui/core";
import {ReactComponent as CommentIcon} from "src/assets/icons/feature/comment.svg";
import {UIStyleConsts} from "../../AppConsts";
import classnames from "classnames";
import {formatLongNumber} from "src/util/NumberUtil";
import {t} from "../../../i18n/utils";
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
}) => {
  const classes = useStyles();
  const authRedirect = useAuthRedirect();

  return (
    <div
      onClick={() => {
        authRedirect();
      }}
      className={classnames(
        "comment-post-button",
        UIStyleConsts.POST_FEED_ITEM_BUTTON,
        classes.root,
        skin,
      )}
    >
      <div className="icon">
        <CommentIcon />
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
