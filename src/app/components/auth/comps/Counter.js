import React, {useState, useEffect} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {t} from "src/i18n/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    number: {
      fontSize: 12,
    },
  }),
);

export const Counter = ({time}) => {
  const classes = useStyles();
  const interval = 1000; // 1s
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTime = timeLeft - interval;

      if (newTime < 0) {
        clearTimeout(timer);
        return;
      }

      setTimeLeft(newTime);
    }, interval);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return <span className={classes.number}>{`(${timeLeft / 1000}s)`}</span>;
};
