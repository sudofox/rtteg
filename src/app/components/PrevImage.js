import React, {useState, useEffect} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {ReactComponent as ArticleIcon} from "src/assets/icons/feature/article.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    defaultImage: {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#A7B0BA",
    },
  }),
);

const PrevImage = ({url}) => {
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
      onError={(event) => event.target.classList.add("error")}
    />
  ) : (
    <div className={classes.defaultImage}>
      <ArticleIcon />
    </div>
  );
};

export default PrevImage;
