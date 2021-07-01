import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(11.25),
  },
  title: {
    fontSize: 18,
    lineHeight: "21px",
    fontWeight: 800,
    color: theme.palette.text.primary,
    textAlign: "center",
  },
  message: {
    maxWidth: theme.spacing(65),
    marginTop: theme.spacing(1.25),
    marginRight: "auto",
    marginLeft: "auto",
    fontSize: 14,
    lineHeight: "17px",
    fontWeight: 500,
    textAlign: "center",
    color: theme.palette.text.gray,
  },
}));

export const NoDataMessage = ({title, message}) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Typography variant="h3" component="h2" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body2" className={classes.message}>
        {message}
      </Typography>
    </div>
  );
};
