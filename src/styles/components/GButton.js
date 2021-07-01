import React from "react";
import classnames from "classnames";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      borderRadius: 16,
      padding: theme.spacing(0.75, 2),
      boxShadow: "none",
      wordBreak: "normal",

      // for general outlined button
      "&.MuiButton-outlined": {
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        "&:not(:disabled)": {
          "&:hover": {
            background: "none",
            color: theme.palette.primary.dark,
            border: `1px solid ${theme.palette.primary.dark}`,
          },
        },
      },

      // for general contained button
      "&.MuiButton-contained": {
        "&:not(:disabled)": {
          background: theme.palette.primary.main,

          "&:hover": {
            background: theme.palette.primary.dark,
          },
        },
      },

      // for red contained button
      "&.MuiButton-contained.danger": {
        "&:not(:disabled)": {
          background: theme.palette.error.light,

          "&:hover": {
            background: theme.palette.error.dark,
          },
        },
      },

      // for red outlined button
      "&.MuiButton-outlined.danger": {
        "&:not(:disabled)": {
          background: "none",
          border: `1px solid ${theme.palette.error.light}`,
          color: theme.palette.error.light,

          "&:hover": {
            background: "none",
            border: `1px solid ${theme.palette.error.dark}`,
            color: theme.palette.error.dark,
          },
        },
      },

      "&:hover": {
        boxShadow: "none",
      },

      "& .MuiButton-label": {
        fontSize: 16,
        lineHeight: "20px",
        textTransform: "capitalize",
      },
      "&:disabled": {
        background: theme.palette.background.button.grey.default,
        color: theme.palette.text.disabled,
      },
      "&.loading": {
        background: theme.palette.primary.main,
        color: theme.palette.text.disabled,
        opacity: 0.6,
      },
      "&.bold": {
        fontWeight: "bold",
      },
    },
  }),
);

export const GButton = ({className, children, loading, isBold, ...rest}) => {
  const classes = useStyles();

  return (
    <Button
      className={classnames(
        classes.root,
        className,
        loading ? "loading" : null,
        isBold ? "bold" : null,
      )}
      color="primary"
      variant="contained"
      fullWidth
      disableRipple={true}
      {...rest}
    >
      {loading ? "loading..." : children}
    </Button>
  );
};
