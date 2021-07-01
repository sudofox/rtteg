import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as LoadingIcon} from "src/assets/icons/timeline/loading.svg";

const useStyles = makeStyles((theme) => ({
  loaderWrapper: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    textAlign: "center",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  loader: {
    height: 22,
    width: 22,
    animation: "$spin 1s linear infinite",
  },
}));

export const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.loaderWrapper}>
      <LoadingIcon className={classes.loader} />
    </div>
  );
};
