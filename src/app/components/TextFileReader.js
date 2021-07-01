import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown/with-html";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      margin: 20,
      padding: 10,
      maxWidth: 900,
      color: theme.palette.text.primary,
      "& h2": {
        fontWeight: "bolder",
      },
      "& h5": {
        letterSpacing: 1,
      },
      "& p,li": {
        fontWeight: 400,
        lineHeight: "25px",
        letterSpacing: 1,
      },
      "& a": {
        color: theme.palette.text.primary,
        fontWeight: 400,
        textDecoration: "underline",
        "&:hover": {
          color: "#000",
        },
      },
    },
  }),
);

export const TextFileReader = ({file}) => {
  const classes = useStyles();
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (file) {
      fetch(file)
        .then((response) => response.text())
        .then((text) => setContent(text));
    }
  }, []);

  if (!content) return null;

  return (
    <ReactMarkdown
      className={classes.container}
      source={content}
      escapeHtml={false}
    />
  );
};
