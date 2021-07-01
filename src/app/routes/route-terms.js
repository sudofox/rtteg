import React, {useState} from "react";
import ReactMarkdown from "react-markdown/with-html";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {GLoader} from "src/styles/components/GLoader";
import {NewUIPage} from "src/app/base/NewUIPage";
import AppConsts from "src/app/AppConsts";
import termsMdPath from "src/assets/md/terms.md";

const useStyles = makeStyles((theme) =>
  createStyles({
    termsContainer: {
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

export const Terms = () => {
  const classes = useStyles();
  const [text, setText] = useState(null);
  const objTitle = "Terms of use";
  const fullDesc = `${AppConsts.APP_WEB_NAME} - Terms of use`;
  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 600,
    height: "50vh",
  };

  fetch(termsMdPath)
    .then((response) => response.text())
    .then((text) => setText(text));

  return (
    <NewUIPage title={objTitle} description={fullDesc}>
      {text ? (
        <ReactMarkdown
          className={classes.termsContainer}
          source={text}
          escapeHtml={false}
        />
      ) : (
        <GLoader wrapperStyle={wrapperStyle} />
      )}
    </NewUIPage>
  );
};
