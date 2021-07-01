import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import classnames from "classnames";
import {t} from "src/i18n/utils";

import {GButton} from "src/styles/components/GButton";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiDrawer-paper": {
        borderRadius: "4px 4px 0 0",
      },
    },
    dropdownContent: {
      width: theme.mixins.dropdownMenu.width,
      position: "absolute",
      right: 10,
      top: -5,
      borderRadius: 6,

      "& .menu-item": {
        padding: theme.spacing(1),
        borderRadius: 0,

        "&.danger": {
          border: "1px solid white",
          color: theme.palette.error.secondary,
          transition: "all .3s ease-in-out",
          "&:hover": {
            borderRadius: theme.spacing(0.5),
            border: "1px solid red",
            backgroundColor: theme.palette.background.red,
          },
        },

        "& .wrapper": {
          display: "flex",
        },

        "& .icon": {
          marginRight: theme.spacing(1),
        },

        "& .menu-item-name": {
          lineHeight: "31px",
        },
      },
    },
    drawerContent: {
      position: "relative",
      paddingTop: theme.spacing(4.5),
      "&:before": {
        content: '""',
        position: "absolute",
        width: theme.spacing(5.25),
        height: theme.spacing(0.75),
        backgroundColor: "#EFEFEF",
        borderRadius: 6,
        top: theme.spacing(1),
        left: "50%",
        transform: "translateX(-50%)",
      },
      "& .menu-item": {
        padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
        paddingRight: theme.spacing(2),
        borderRadius: 0,
        "&.danger": {
          border: "1px solid white",
          color: theme.palette.error.secondary,
          transition: "all .3s ease-in-out",
          "&:hover": {
            borderRadius: theme.spacing(0.5),
            border: "1px solid red",
            backgroundColor: theme.palette.background.red,
          },
        },

        "& .wrapper": {
          display: "flex",
          alignItems: "center",
        },

        "& .icon": {
          width: "auto",
          "& svg": {
            width: 24,
          },
          marginRight: theme.spacing(2),
        },

        "& .menu-item-name": {
          fontSize: 17,
          lineHeight: "22px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      },
    },
    drawerCancel: {
      margin: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
      marginTop: theme.spacing(2),
    },
    drawerCancelBtn: {
      height: 50,
      borderRadius: 50,
      fontSize: 17,
      fontWeight: 700,
      "&:not(:disabled)": {
        background: `${theme.palette.grey.A200} !important`,
        color: "#000",
      },
      "&:hover": {
        background: `${theme.palette.grey.A200}!important`,
      },
    },
  }),
);

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const GMobileDrawer = ({
  className,
  open,
  toggleDrawer,
  children,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      className={classnames(classes.root, className)}
      onBackdropClick={(e) => {
        e.stopPropagation();
      }}
      {...rest}
    >
      <div className={classes.drawerContent}>{children}</div>
      <div className={classes.drawerCancel}>
        <GButton
          className={classes.drawerCancelBtn}
          onClick={(e) => {
            e.stopPropagation();
            toggleDrawer(false)();
          }}
        >
          {t("getter_fe.post.button.cancel")}
        </GButton>
      </div>
    </SwipeableDrawer>
  );
};
