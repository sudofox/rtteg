import React, {useState, Fragment} from "react";
import {createStyles, makeStyles, Popover, Tooltip} from "@material-ui/core";
import {t} from "src/i18n/utils";
import {Picker} from "emoji-mart";
import {ReactComponent as IconSmile} from "src/assets/icons/feature/mood.svg";
import "emoji-mart/css/emoji-mart.css";
import {ReactComponent as Close} from "src/assets/icons/icon_circlefull_close20.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "auto",
      [theme.breakpoints.only("xs")]: {
        zIndex: "10000",
        width: "100%",
      },
      "& .emoji-mart": {
        textAlign: "left",
        border: "none",
        [theme.breakpoints.only("xs")]: {
          width: "100% !important",
        },
        "& .emoji-mart-category": {
          display: "block",
          "& .emoji-mart-category-label": {
            color: "#aaa",
            fontSize: "14px",
          },
        },
        "& .emoji-mart-scroll": {
          [theme.breakpoints.only("xs")]: {
            height: "160px",
          },
        },
      },
    },
    iconContainer: {
      padding: theme.spacing(1),
      paddingBottom: 0,
    },
    emojiContainer: {
      width: 30,
      height: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        borderRadius: "100%",
        backgroundColor: "#EDF7FF",
      },
    },
    closeIcon: {
      fill: theme.palette.grey[200],
      cursor: "pointer",
    },
    iconText: {
      marginLeft: 5,
      width: "max-content",
    },
    smileIcon: {
      "& path": {
        fill: theme.blue.light,
      },
    },
  }),
);

export const GEmojiPicker = ({onSelect, onClose, children}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClose && onClose();
  };

  const handelSelect = (emoji) => {
    const selected = {
      emoji: emoji.native,
    };
    onSelect(null, selected);
  };

  return (
    <Fragment>
      <div className="tool" onClick={handleClick}>
        <Tooltip title={t("getter_fe.post.button.emoji")} aria-label="emoji">
          <span className="icon">
            <span className={classes.emojiContainer}>
              <IconSmile className={classes.smileIcon} />
            </span>
            <span className={classes.iconText}>
              {t("getter_fe.post.button.emoji")}
            </span>
          </span>
        </Tooltip>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className={classes.root}
      >
        <div
          onClick={() => setAnchorEl(null)}
          className={classes.iconContainer}
        >
          <Close className={classes.closeIcon} />
        </div>
        <Picker
          set="twitter"
          showPreview={false}
          showSkinTones={false}
          autoFocus={false}
          sheetSize={32}
          onSelect={handelSelect}
          i18n={{
            search: t("getter_fe.menu.common.search"),
            categories: {
              people: t("getter_fe.post.emoji.smileys_people"),
              nature: t("getter_fe.post.emoji.animals_nature"),
              foods: t("getter_fe.post.emoji.food_drink"),
              places: t("getter_fe.post.emoji.travel_places"),
              activity: t("getter_fe.post.emoji.activities"),
              objects: t("getter_fe.post.emoji.objects"),
              symbols: t("getter_fe.post.emoji.symbols"),
              flags: t("getter_fe.post.emoji.flags"),
              recent: t("getter_fe.post.emoji.recently_used"),
            },
          }}
        />
      </Popover>
    </Fragment>
  );
};
