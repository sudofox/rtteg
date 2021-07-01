import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    menuItemContainer: {
      display: "flex",
      alignItems: "center",
      height: 50,
      color: theme.palette.secondary.main,
      paddingLeft: 20,
      "&:hover": {
        backgroundColor: theme.palette.grey.A300,
      },
      transition: "all 100ms ease-in",

      "&:first-child": {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
      },

      "&:last-child": {
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
      },

      "& .icon": {
        marginRight: "18px",
        "--icon-padding-multiplier": "none",
        "&:hover": {
          backgroundColor: "transparent", // overwrite css variable --icon-hover-background-color
        },
      },

      "& > .wrapper": {
        display: "flex",
        "& .icon": {
          "& svg": {
            fontSize: 20,
            width: "1em",
            height: "1em",
          },
        },
      },

      "& .separator": {
        padding: 0,
        borderBottom: theme.notchedOutline.border,
      },
    },
    menuItemName: {
      lineHeight: "19.95px",
      color: theme.palette.text.main,
      fontSize: 15,
      fontWeight: 400,
    },
  }),
);

/**
 *
 *
 * @param {string} userId username to follow/unfollow
 * @param {string} compName component name (optional)
 */

const NewMenuItem = ({
  className,
  doClick,
  icon,
  overrideContentComp,
  role,
  text,
  url,
}) => {
  const classes = useStyles();
  const isSeparator = role === "separator";

  const contentComp = overrideContentComp ? (
    <div className="wrapper">{overrideContentComp}</div>
  ) : (
    <div className="wrapper">
      <div className="icon">{React.isValidElement(icon) ? icon : null}</div>
      <div className={classes.menuItemName}>{text}</div>
    </div>
  );

  return (
    <div
      className={`${classes.menuItemContainer} ${
        isSeparator ? "separator" : className
      }`}
      onClick={(e) => doClick(e, url)}
    >
      {isSeparator ? null : contentComp}
    </div>
  );
};

export default NewMenuItem;
