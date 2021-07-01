import React, {useState, useEffect} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      borderRadius: "4px",
      width: "52px",
      height: "52px",
      objectFit: "cover",
    },
    bigImg: {
      borderRadius: "4px",
      width: "100%",
      height: "156px",
      objectFit: "cover",
    },
  }),
);

export const TopicImg = ({bigImg, url}) => {
  const classes = useStyles();
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let img = new Image();
    img.onload = function () {
      setImgUrl(url);
    };
    img.src = url;
  }, [url]);

  return imgUrl ? (
    <img
      src={imgUrl}
      className={bigImg ? classes.bigImg : classes.img}
      onError={(event) => event.target.classList.add("error")}
    />
  ) : null;
};
