import React from "react";
import {t} from "src/i18n/utils";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(6),
    },
    message: {
      padding: "50px 0",
      textAlign: "center",
      fontSize: "18px",
      lineHeight: "21px",
      color: "#000",
      marginBottom: theme.spacing(1),
    },
  }),
);

export const ClaimError = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.message}>
        {t("getter_fe.post.tips.claim_failed")}
      </div>
    </div>
  );
};
