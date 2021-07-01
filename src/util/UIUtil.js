import React from "react";
import emojiRegex from "emoji-regex";
import {
  HASHTAG_SPECIAL_SYMBOL_REG,
  SPECIAL_SYMBOL,
} from "src/styles/components/GMentionsInput";
const NON_SPECIAL_SYMBOL_REG = `[^${SPECIAL_SYMBOL.join("|")}]`;

const UrlMatchPattern = new RegExp(
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/,
  "gi",
); // fragment locator

/**
 * Utilities to support Web frontend only
 */
export class UIUtil {
  /**
   * Give a text composed by user, this utility will wrap
   * around @hashtags, user @mentions, and url with <a href>
   * so that they are clickable.
   * @param {GetterService} api
   * @param {string} text
   * @return {*[]} array of components and text
   */
  static WrapLinksToText(api, text) {
    const cleanText = text;
    let t = cleanText;

    if (!t) {
      return "";
    }

    t = t
      .replace(UrlMatchPattern, `<a href="$&" external="true">$&</a>`)
      .replace(
        new RegExp(
          `(\\s|${HASHTAG_SPECIAL_SYMBOL_REG}|^)(#${NON_SPECIAL_SYMBOL_REG}{1,100})`,
          "g",
        ),
        (hashtag) => {
          const data = hashtag.split("#");
          let url = api?.getUrlHashtagPage(data[1]);
          return `${data[0]}<a href="${url}" value="#${data[1]}">#${data[1]}</a>`;
        },
      )
      .replace(
        new RegExp(`(\\s|^)(@${NON_SPECIAL_SYMBOL_REG}+)`, "g"),
        (mention) => {
          let url = api?.getUrlUsertagPage(mention.slice(1));
          return `<a href="${url}" value="${mention}">${mention}</a>`;
        },
      );

    return t;
  } // WrapLinksToTexts

  /**
   * Replace all white space with &nbsp; if
   * the input is a string type
   *
   * @param {*} str any type, but onl process
   * if its a string type
   */
  static AdjustHTMLEdgeSpace(str) {
    if (typeof str === "string") {
      if (str.startsWith(" ")) str = <span>&nbsp;{str.trim()}</span>;
    }
    return str;
  }

  /**
   * this utility will wrap
   * around emoji
   * @param {string} text
   * @return {*[]} array of components and text
   */
  static WrapEmojiToText(text = "") {
    return (
      text
        // .replace(/'/g, "&#39;")
        // .replace(/(\/[a-z]+>)([^<>]+)(<)/g, "$1<emoji value='$2'>$2</emoji>$3")
        // .replace(/^([^<>]+)/g, "<emoji value='$1'>$1</emoji>")
        // .replace(/([^<>]+)$/g, "<emoji value='$1'>$1</emoji>")
        .replace(
          new RegExp(`(${emojiRegex().source})`, "g"),
          "<emoji value='$1'>$1</emoji>",
        )
    );
  }

  static shortenLinkText(content) {
    const charactersAllowedAfterHostname = 15;

    const shortenElementURL = (element) => {
      const {props} = element;

      const a = document.createElement("a");
      a.setAttribute("href", props.href);

      let [preDomainName, afterDomainName] = props.children.split(a.hostname);

      if (!afterDomainName) {
        return props.children;
      }

      afterDomainName = afterDomainName.substring(1);

      if (afterDomainName.length <= charactersAllowedAfterHostname) {
        return props.children;
      }

      return (
        preDomainName +
        a.hostname +
        "/" +
        afterDomainName.slice(0, charactersAllowedAfterHostname) +
        "..."
      );
    };

    if (Array.isArray(content)) {
      content.forEach((element, idx) => {
        if (element.type === "a") {
          const children = shortenElementURL(element);

          if (!children) {
            return;
          }

          content[idx] = {
            ...element,
            props: {
              ...element.props,
              children,
            },
          };
        }
      });
    } else if (typeof content === "object" && content?.type === "a") {
      const children = shortenElementURL(content);
      if (!children) {
        return;
      }

      content = {
        ...content,
        props: {
          ...content.props,
          children,
        },
      };
    }

    return content;
  }
}

export default UIUtil;
