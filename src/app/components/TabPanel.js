import React from "react";
import {Box} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    tabPanel: {
      padding: 0,
    },
  }),
);

export const TabPanel = (props) => {
  const {children, value, index, ...other} = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className={classes.tabPanel}>
          {children}
        </Box>
      )}
    </div>
  );
};
