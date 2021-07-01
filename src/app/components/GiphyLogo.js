import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import giphyLogo from "src/assets/images/Poweredby_640px-White_HorizText.png";

const useStyles = makeStyles((theme) => ({
  giphyLogo: {
    display: "block",
    width: 105,
    height: 24,
    marginTop: theme.spacing(0.5),
    cursor: "pointer",
    "& > img": {
      width: 95,
      marginLeft: 4,
      verticalAlign: "text-bottom",
    },
    "&:hover": {
      backgroundColor: "#EDF7FF",
      borderRadius: 100,
    },
  },
}));

export const GiphyLogo = () => {
  const classes = useStyles();
  return (
    <a
      href="https://giphy.com"
      target="_blank"
      className={classes.giphyLogo}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <img src={giphyLogo} alt="" />
    </a>
  );
};
