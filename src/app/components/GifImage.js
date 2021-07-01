import React, {Fragment, useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxHeight: "500px !important",
  },
  image: {
    position: "relative",
    width: "100%",
    objectFit: "cover",
    cursor: "pointer",
  },
  gifBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    background: " rgba(0, 0, 0, 0.5)",
    borderRadius: 3,
    fontSize: 15,
    fontWeight: 500,
    padding: "2px 4px",
    textTransform: "uppercase",
    color: theme.palette.text.disabled,
  },
}));

const getRealHeight = (imageWidth, imageHeight, containerWidth) => {
  if (!imageWidth || !imageHeight || !containerWidth) {
    return;
  }

  return (containerWidth / imageWidth) * imageHeight;
};

export const GifImage = ({
  imageUrl,
  imageClassName,
  handleClick,
  height,
  width,
}) => {
  const classes = useStyles();
  const gifContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  useEffect(() => {
    setContainerWidth(gifContainerRef.current.getBoundingClientRect().width);
  }, []);

  return (
    <Fragment>
      <div
        ref={gifContainerRef}
        className={`${classes.root} main-image`}
        onClick={(e) => handleClick && handleClick(e)}
      >
        <img
          height={getRealHeight(width, height, containerWidth)}
          src={imageUrl}
          alt=""
          className={`${classes.image} ${imageClassName}`}
          onError={(event) => event.target.classList.add("error")}
        />
        <div className={classes.gifBadge}>gif</div>
      </div>
    </Fragment>
  );
};
