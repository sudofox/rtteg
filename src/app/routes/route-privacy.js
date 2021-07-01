import React, {useState} from "react";
import ReactMarkdown from "react-markdown/with-html";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {GLoader} from "src/styles/components/GLoader";
import AppConsts from "src/app/AppConsts";
import {NewUIPage} from "src/app/base/NewUIPage";
import privacyMdPath from "src/assets/md/privacy.md";

const useStyles = makeStyles((theme) =>
  createStyles({
    privacyContainer: {
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
      "& ul": {
        marginLeft: 20,
      },
    },
  }),
);

export const Privacy = () => {
  const classes = useStyles();
  const [text, setText] = useState(null);
  const objTitle = "Privacy Policy";
  const fullDesc = `${AppConsts.APP_WEB_NAME} - Privacy Policy`;
  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 600,
    height: "50vh",
  };

  fetch(privacyMdPath)
    .then((response) => response.text())
    .then((text) => setText(text));

  return (
    <NewUIPage title={objTitle} description={fullDesc}>
      {text ? (
        <ReactMarkdown
          className={classes.privacyContainer}
          source={text}
          escapeHtml={false}
        />
      ) : (
        <GLoader wrapperStyle={wrapperStyle} />
      )}
    </NewUIPage>
  );
};
