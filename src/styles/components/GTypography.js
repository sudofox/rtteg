import React from "react";
import classnames from "classnames";
import {createStyles, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    bold: {
      fontWeight: "bold",
    },
    uppercase: {
      textTransform: "uppercase",
    },
  }),
);

export const GTypography = ({
  variant,
  className,
  children,
  isBold,
  isUppercase,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Typography
      className={classnames(
        className,
        isBold ? classes.bold : null,
        isUppercase ? classes.uppercase : null,
      )}
      variant={variant}
      {...rest}
    >
      {children}
    </Typography>
  );
};
