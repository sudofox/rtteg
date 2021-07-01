import React from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "relative",
    minHeight: `calc(100vh - ${theme.mixins.header.height}px)`,
    flexWrap: "nowrap",
    paddingTop: 15,
    [theme.breakpoints.only("xs")]: {
      paddingTop: 0,
    },
  },
  item: {
    position: "relative",
  },
  primaryColumn: {
    "& .backTitle": {
      paddingBottom: 15,
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "600px",
      maxWidth: "600px",
    },
    [theme.breakpoints.down("md")]: {
      flexShrink: 1,
    },
    [theme.breakpoints.up("lg")]: {
      flexShrink: 0,
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "600px",
      width: "100%",
    },
    [theme.breakpoints.only("xs")]: {
      maxWidth: "100%",
    },
  },
  secondaryColumn: {
    // height: `calc(100vh - ${theme.mixins.header.height + 15}px)`,
    // position: "-webkit-sticky",
    // position: "sticky",
    // top: theme.mixins.header.height + 15,

    overflow: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      flexShrink: 0,
    },
  },
}));

export const HomeMainContainer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const getComponent = (key) => {
    return props.children.filter((comp) => {
      return comp.key === key;
    });
  };

  return (
    <Grid container className={clsx(classes.root, "primary")}>
      <Grid
        item
        xs={12}
        md={8}
        lg={7}
        className={clsx(classes.primaryColumn, classes.item)}
      >
        {getComponent("primary")}
      </Grid>
      {matches && (
        <Grid
          item
          md={4}
          lg={5}
          className={clsx(classes.secondaryColumn, classes.item)}
        >
          {getComponent("secondary")}
        </Grid>
      )}
    </Grid>
  );
};
