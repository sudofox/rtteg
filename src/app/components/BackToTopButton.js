import React, {Fragment} from "react";
import classnames from "classnames";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import smoothscroll from "smoothscroll-polyfill";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

import {ReactComponent as BackToTopIcon} from "src/assets/icons/icon_back_to_top.svg";

// kick off the polyfill!
smoothscroll.polyfill();
const useStyles = makeStyles((theme) =>
  createStyles({
    iconButton: {
      position: "fixed",
      bottom: theme.spacing(8),
      right: "50%",
      [theme.breakpoints.up("lg")]: {
        transform: "translateX(680px)",
      },
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
      cursor: "pointer",
      opacity: 0.5,
      transition: "opacity 0.3s ease-in-out",
      zIndex: 98,
      "&:hover": {
        opacity: 1,
      },
    },
    active: {
      opacity: 1,
    },
  }),
);

const THRESHOLD_NUM = 1 * window.innerHeight;

export const BackToTopButton = ({className, ...rest}) => {
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window || undefined,
    disableHysteresis: true,
    threshold: THRESHOLD_NUM,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fragment>
      {trigger && (
        <div
          className={classnames(classes.iconButton, className)}
          onClick={handleClick}
        >
          <BackToTopIcon />
        </div>
      )}
    </Fragment>
  );
};
