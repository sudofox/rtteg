import React from "react";
import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import parse from "html-react-parser";
import clsx from "clsx";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {youtubeFormat} from "src/util/TextUtil";
import HoverPopup from "src/app/components/HoverPopup";

import UIUtil from "../../util/UIUtil";
import Global from "src/system/Global";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    "&.text-content img": {
      fontSize: "120%",
      verticalAlign: "text-top !important",
      margin: "0 0.15em !important",
    },
  },
  link: {
    color: theme.blue.light,
    fontWeight: 350,
    cursor: "pointer",
    "&:hover": {
      color: theme.blue.light,
      textDecoration: "underline",
    },
  },
  hide: {
    display: "none !important",
  },
  tag: {
    display: "inline-block",
  },
}));

const HighlightLink = ({text, type, previewUrl}) => {
  if (!text) {
    return "";
  }

  const api = Global.GetPortal().getAppService();

  const classes = useStyles();
  const isDetail = type === "post-detail" || type === "comment-detail";
  let contentText = UIUtil.WrapEmojiToText(text);
  contentText = UIUtil.WrapLinksToText(api, contentText);
  contentText = contentText
    .replace(/</g, "☾")
    .replace(/>/g, "☽")
    .replace(/☾a ([^☽]+)☽([^☾]+)☾\/a☽/g, "<a $1>$2</a>")
    .replace(/☾emoji ([^☽]+)☽([^☾]+)☾\/emoji☽/g, "<emoji $1>$2</emoji>")
    .replace(/☾/g, "&lt;")
    .replace(/☽/g, "&gt;");

  let content = parse(contentText, {
    replace: (domNode) => {
      let previewUrlNew = previewUrl;

      if (domNode?.attribs && youtubeFormat(domNode.attribs.href)) {
        previewUrlNew = domNode.attribs.href;
      }
      if (domNode.name === "a") {
        if (!domNode.attribs.value) {
          return (
            <a
              href={
                /https?:\/\//.test(domNode.attribs.href)
                  ? domNode.attribs.href
                  : `http://${domNode.attribs.href}`
              }
              target="_blank"
              rel="noreferrer"
              rel="noopener"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`${classes.link} ${
                !domNode.next &&
                previewUrlNew === domNode.attribs.href &&
                classes.hide
              }`}
            >
              {domNode.attribs.href}
            </a>
          );
        } else {
          return (
            <div className={classes.tag}>
              <HoverPopup userId={domNode.attribs.value?.split("@")[1]}>
                <div key="popup-handler">
                  <Link
                    to={domNode.attribs.href}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={classes.link}
                  >
                    <GTwemoji
                      text={domNode.attribs.value}
                      size={isDetail ? 24 : 20}
                    />
                  </Link>
                </div>
              </HoverPopup>
            </div>
          );
        }
      } else if (domNode.name === "emoji") {
        return (
          <GTwemoji text={domNode.attribs.value} size={isDetail ? 24 : 20} />
        );
      }
    },
  });

  return (
    <div className={clsx(classes.root, "text-content")}>
      {UIUtil.shortenLinkText(content)}
    </div>
  );
};

export default HighlightLink;
