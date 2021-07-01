import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core";
import ResizeObserver from "resize-observer-polyfill";
import {
  zoomImage,
  handleMediaUrl,
  getTiledImageStyleFromMetadata,
} from "src/util/imageUtils";

const useStyles = makeStyles((theme) => ({
  rootTiledImages: {
    width: "100%",
    display: ({single}) => (single ? "block" : "grid"),
    gridTemplateColumns: "auto auto",
    gridGap: "2px",
    maxHeight: "284px",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      gridGap: "5px",
    },
    "& img": {
      width: "100%",
      height: ({imgData}) => (imgData ? "auto" : "100%"),
      objectFit: "cover",
      position: "relative",
    },
    "& .img_item": {
      width: "100%",
      height: "141px",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        height: "75px",
      },
    },
    "& .img_1_1": {
      height: 284,
    },
    "& .img_1_2, .img_2_2": {
      height: "284px",
      [theme.breakpoints.down("xs")]: {
        height: "155px !important",
      },
    },
    "& .img_1_3": {
      height: "284px",
      gridColumn: 1,
      gridRow: "1 / span 2",
      [theme.breakpoints.down("xs")]: {
        height: "155px !important",
      },
    },
  },
  extraImgsCount: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#11111199",
    fontSize: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
}));

const TiledImages = ({imageURLs, handleClick, imgData, noZoom}) => {
  const [imageContainersDimensions, setImageContainersDimensions] = useState(
    [],
  );
  const rootContainerRef = useRef(null);
  // filter out falsy URLS
  const _imageURLs = imageURLs.filter((URL) => URL);
  const classes = useStyles({single: _imageURLs.length === 1, imgData});

  useEffect(() => {
    if (!imgData) {
      return;
    }
    const imageContainers = rootContainerRef.current?.querySelectorAll(
      ".img_item",
    );
    const resizeObserver = new ResizeObserver((entries) => {
      setImageContainersDimensions(
        entries.map(({contentRect: {width, height}}) => ({
          width,
          height,
        })),
      );
    });
    setImageContainersDimensions(
      [...imageContainers].map((imageContainer) => {
        const {width, height} = imageContainer.getBoundingClientRect();
        resizeObserver.observe(imageContainer);
        return {width, height};
      }),
    );

    return () =>
      imageContainers.forEach((imageContainer) =>
        resizeObserver.unobserve(imageContainer),
      );
  }, []);

  const handleClickImage = (e, index) => {
    e.stopPropagation();
    if (handleClick) handleClick(index);
  };
  return (
    <div className={classes.rootTiledImages} ref={rootContainerRef}>
      {[0, 1, 2, 3].map(
        (index) =>
          _imageURLs.length > index && (
            <div
              key={_imageURLs[index]}
              className={`img_item img_${index + 1}_${_imageURLs.length}`}
            >
              <img
                src={handleMediaUrl(
                  process.env.REACT_APP_MEDIA_BASE,
                  noZoom
                    ? _imageURLs[index]
                    : zoomImage(_imageURLs[index], 500, 0),
                )}
                onClick={(e) => handleClickImage(e, index)}
                alt=""
                style={
                  imgData
                    ? getTiledImageStyleFromMetadata(
                        imgData[index],
                        imageContainersDimensions[index]?.width,
                        imageContainersDimensions[index]?.height,
                      )
                    : null
                }
                onError={(event) => event.target.classList.add("error")}
              />
              {index === 3 && _imageURLs.length > 4 ? (
                <div
                  className={classes.extraImgsCount}
                  onClick={(e) => handleClickImage(e, index)}
                >
                  <span>+{_imageURLs.length - 4}</span>
                </div>
              ) : null}
            </div>
          ),
      )}
    </div>
  );
};

export default TiledImages;
