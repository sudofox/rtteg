import React from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from "prop-types";
import {GTwemoji} from "src/styles/components/GTwemoji";
import parse from "html-react-parser";
import clsx from "clsx";
import Global from "../../system/Global";
import AppConsts from "src/app/AppConsts";
// import UIUtil from "src/util/UIUtil";
import emojiRegex from "emoji-regex";
import ReactDOM from "react-dom";
import {renderToString} from "react-dom/server";
const TEXT_LENGTH_LIMIT = AppConsts.COMPOSER_MAX_TEXT_LENGTH;
export const HASHTAG_SPECIAL_SYMBOL = [
  "!",
  '"',
  "#",
  "$",
  "%",
  "&",
  "'",
  "(",
  ")",
  "+",
  ",",
  "-",
  ".",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "\\[",
  "\\]",
  "^",
  "_",
  "`",
  "{",
  "|",
  "}",
  "~",
];
export const SPECIAL_SYMBOL = [
  "\\s",
  "&",
  "'",
  "!",
  '"',
  "#",
  "$",
  "%",
  "(",
  ")",
  "*",
  "+",
  ",",
  "\\",
  ".",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "\\[",
  "\\]",
  "^",
  "`",
  "{",
  "|",
  "}",
  "~",
  "\\-",
  "\u3002",
  "\uff1f",
  "\uff01",
  "\uff0c",
  "\u3001",
  "\uff1b",
  "\uff1a",
  "\u201c",
  "\u201d",
  "\u2018",
  "\u2019",
  "\uff08",
  "\uff09",
  "\u300a",
  "\u300b",
  "\u3008",
  "\u3009",
  "\u3010",
  "\u3011",
  "\u300e",
  "\u300f",
  "\u300c",
  "\u300d",
  "\ufe43",
  "\ufe44",
  "\u3014",
  "\u3015",
  "\u2026",
  "\u2014",
  "\uff5e",
  "\ufe4f",
  "\uffe5",
];
const SPECIAL_SYMBOL_REG = `[${SPECIAL_SYMBOL.slice(1).join("|")}]`;
const NON_SPECIAL_SYMBOL_REG = `[^${SPECIAL_SYMBOL.join("|")}]`;
export const HASHTAG_SPECIAL_SYMBOL_REG = `[${HASHTAG_SPECIAL_SYMBOL.join(
  "",
)}]`;
export const LINK_PATTERN_STRING = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/; // fragment locator

const useStyles = (theme) => ({
  root: {
    position: "relative",
    // marginLeft: theme.spacing(0.5),
  },
  divTextArea: {
    position: "relative",
    zIndex: 1,
    "-webkit-user-select": "text",
    "user-select": "text",
    border: "none",
    outline: "none",
    overflow: "auto",
    resize: "none",
    width: "100%",
    color: theme.palette.text.primary,
    whiteSpace: "pre-wrap",
    fontSize: 18,
    textAlign: "left",
    minHeight: "30px",
    wordBreak: "break-word",
    fontFamily: [
      "-apple-system",
      "SF Pro Text",
      '"Segoe UI"',
      "Roboto",
      "PingFang SC",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeight: 400,
    lineHeight: "26px",
    "& .highlight, & .highlight-link": {
      zIndex: 20,
      color: theme.blue.main,
      fontWeight: "normal",
    },
    "& .is-exceed-content": {
      backgroundColor: "#fbc7c7",
    },
    "& img": {
      margin: "0 1px !important",
    },
    // "& hideemoji": {
    //   overflow: "hidden",
    //   display: "inline-block",
    //   width: "0.1px",
    //   height: "0.1px",
    //   verticalAlign: "top",
    //   opacity: 0,
    // },
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
    },
  },
  suggest: {
    position: "absolute",
    border: theme.notchedOutline.border,
    display: "none",
    minWidth: "200px",
    maxWidth: 366,
    backgroundColor: theme.palette.background.default,
    zIndex: 10,
    borderRadius: "5px",
    boxShadow: "",
    margin: "24px 0 0",
    boxShadow: "0px 3px 5px #00000023",
    maxHeight: theme.spacing(56.5),
    overflowY: "auto",
    [theme.breakpoints.only("xs")]: {
      maxHeight: theme.spacing(40),
      overflowY: "scroll",
    },
    "& div": {
      padding: "14px 16px",
      cursor: "pointer",
      "& .suggest-text": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
      },
      "&:hover": {
        backgroundColor: theme.palette.grey.A300,
      },
    },
  },
  placeholder: {
    color: theme.palette.text.placeholderSecondary,
    position: "absolute",
    top: 0,
    left: 0,
    fontSize: 18,
    zIndex: 1,
  },
  secondPlaceholder: {
    top: 14,
    left: 18,
  },
});

function adaptTextToHtml(text) {
  const cursorIndex = text.indexOf("ⒼcursorⒼ");
  const textLengthLimit = new RegExp(emojiRegex().source).test(
    text.slice(TEXT_LENGTH_LIMIT - 1, TEXT_LENGTH_LIMIT + 1),
  )
    ? TEXT_LENGTH_LIMIT - 1
    : TEXT_LENGTH_LIMIT;
  let [effectivePart, exceedPart] = (text || "")
    .replace("ⒼcursorⒼ", "")
    .match(new RegExp(`(^[\\s\\S]{0,${textLengthLimit}})([\\s\\S]*)$`))
    .slice(1);
  if (cursorIndex <= textLengthLimit) {
    effectivePart =
      effectivePart.slice(0, cursorIndex) +
      "ⒼcursorⒼ" +
      effectivePart.slice(cursorIndex);
  } else {
    exceedPart =
      exceedPart.slice(0, cursorIndex - textLengthLimit) +
      "ⒼcursorⒼ" +
      exceedPart.slice(cursorIndex - textLengthLimit);
  }
  let result =
    commonTransform(effectivePart) +
    (exceedPart
      ? `<span class="is-exceed-content">${commonTransform(
          exceedPart,
          true,
        )}</span>`
      : "");
  return result;
}

function commonTransform(text, isExceed = false) {
  let result = text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/“/g, "&ldquo;")
    .replace(/”/g, "&rdquo;")
    .replace(/‘/g, "&lsquo;")
    .replace(/’/g, "&rsquo;")
    .replace(/®/g, "&reg;")
    .replace(/©/g, "&copy;")
    .replace(/•/g, "&bull;")
    .replace(/…/g, "&hellip;")
    .replace(/™/g, "&trade;")
    .replace(/‚/g, "&sbquo;")
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/ⒼcursorⒼ/, "<cursor></cursor>")
    .replace(
      new RegExp(`(${emojiRegex().source})`, "g"),
      '<emoji value="$1"></emoji>',
    );

  return !isExceed
    ? result
        .replace(
          new RegExp(LINK_PATTERN_STRING, "ig"),
          '<b class="highlight-link">$&</b>',
        )
        .replace(
          new RegExp(`(\\s|^)(@${NON_SPECIAL_SYMBOL_REG}+)`, "g"),
          '$1<b class="highlight">$2</b>',
        )
        .replace(
          new RegExp(
            `(\\s|${HASHTAG_SPECIAL_SYMBOL_REG}|^)(#${NON_SPECIAL_SYMBOL_REG}{1,100})`,
            "g",
          ),
          '$1<b class="highlight">$2</b>',
        )
    : result;
}

function fetchData(keywords, callback, fetchService) {
  if (!keywords) return;
  let appService = Global.GetPortal().getAppService();
  appService[fetchService](keywords, 20, 1, (err, resultMap) => {
    if (err) {
      console.log(err);
    } else {
      const result = [];
      resultMap?.data?.list?.map((key) => {
        const _key = key.slice(1);
        result.push({display: _key, id: _key});
      });
      callback(result);
    }
  });
}

const renderHtml = (html) => {
  let content = parse(html, {
    replace: (domNode) => {
      if (domNode.name === "emoji") {
        return <GTwemoji text={domNode.attribs.value} />;
      }
    },
  });
  const htmlString = renderToString(content);
  // .replace(
  //   /(<span [^>]+>[^<]+<\/span>)<hideemoji [^>]+>[^<]+<\/hideemoji>/g,
  //   "$1",
  // );
  return htmlString;
};

export class GMentionsInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      html: "",
      isEmpty: true,
      suggestStyle: {},
      suggestList: [],
      pos: 0,
      keywords: "",
      comStart: false,
    };
    this.insertEmojiOrText = this.insertEmojiOrText.bind(this);
    this.triggerFocus = this.triggerFocus.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    this.props.setupInsertEmoji &&
      this.props.setupInsertEmoji(this.insertEmojiOrText);
    this.props.setupTriggerFocus &&
      this.props.setupTriggerFocus(this.triggerFocus);
  }

  componentDidMount() {
    this.target = ReactDOM.findDOMNode(this).firstElementChild;
    if (this.props.autoFocus !== false) {
      this.target.focus();
    }

    this.emitChange({suggestText: this.props.value});

    this.target.addEventListener("paste", this.handlePaste);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      this.emitChange({clearAll: true});
    }
  }

  componentWillUnmount() {
    this.target.removeEventListener("paste", this.handlePaste);
  }

  handlePaste(e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    this.insertEmojiOrText(text);
  }

  triggerFocus() {
    setTimeout(() => this.setPos(), 100);
  }

  onChange(e, type) {
    this.setState({
      isEmpty: false,
    });
    if (this.state.comStart) return;
    if (this.state.text !== e?.target?.innerText) {
      const isEnter = e?.keyCode === 13;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(
        () => this.emitChange({isEnter}),
        type === "onInput" ? 128 : 64,
      );
    } else if (/<img [^alt][^>]+>/.test(e?.target?.innerHTML)) {
      e.target.innerHTML = e.target.innerHTML.replace(/<img [^alt][^>]+>/g, "");
    }
  }

  onBlur() {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        suggestStyle: {
          ...this.state.suggestStyle,
          display: "none",
        },
      });
    }, 200);
    if (!this.state.text.trim()) {
      this.setState({
        isEmpty: true,
      });
    }
    this.props.blur && this.props.blur();
  }

  onFocus() {
    this.state.suggestList.length &&
      this.setState({
        suggestStyle: {
          ...this.state.suggestStyle,
          display: "block",
        },
      });

    if (!this.props.value) {
      this.setState({
        isEmpty: true,
      });
    } else {
      this.setState({
        isEmpty: false,
      });
    }

    this.props.focus && this.props.focus();
  }

  emitChange({
    isEnter = false,
    suggestText = "",
    insertEmojiOrText = "",
    clearAll,
  }) {
    let originText =
      clearAll || this.target.innerText === "\n" ? "" : this.target.innerText;
    let pos = this.getPos();
    originText =
      isEnter && pos === 0 && /^\n\n[^\n]/.test(originText)
        ? originText.slice(1)
        : originText;
    pos =
      suggestText || insertEmojiOrText
        ? this.state.pos
        : originText.length && pos + (isEnter ? 1 : 0);
    // Text for outgoing
    let text = "";
    if (insertEmojiOrText) {
      text =
        originText.slice(0, pos) + insertEmojiOrText + originText.slice(pos);
    } else if (suggestText) {
      text =
        originText.slice(0, pos).replace(/(#|@)([^#@\s]+)$/, "$1") +
        suggestText +
        " " +
        originText.slice(pos);
    } else {
      text = originText;
    }

    text = text
      .replace(new RegExp(`(\\s|^)([@#][^Ⓖ\\s]{287})([^\\s]+)`, "g"), "$1$2 $3")
      .replace(
        new RegExp(
          `(\\s|^)(@${NON_SPECIAL_SYMBOL_REG}+)(${SPECIAL_SYMBOL_REG}+)`,
          "g",
        ),
        "$1$2 $3",
      )
      .replace(
        new RegExp(
          `(\\s|${HASHTAG_SPECIAL_SYMBOL_REG}|^)(#${NON_SPECIAL_SYMBOL_REG}{1,100})(${SPECIAL_SYMBOL_REG}+)`,
          "g",
        ),
        "$1$2 $3",
      );

    const isSafari = /Safari/.test(navigator.userAgent);
    if (isSafari && text === "\n\n") {
      text = "";
    }

    if (this.props.onChange && text !== this.state.text) {
      this.props.onChange({
        target: {
          value: text.trim(),
        },
      });
    }
    // Text for display
    let _text = "";

    if (insertEmojiOrText) {
      _text =
        originText.slice(0, pos) +
        insertEmojiOrText +
        "ⒼcursorⒼ" +
        originText.slice(pos);
      pos = pos + insertEmojiOrText.length;
    } else if (suggestText) {
      _text =
        originText.slice(0, pos).replace(/(#|@)([^#@\s]+)$/, "$1") +
        suggestText +
        " ⒼcursorⒼ" +
        originText.slice(pos);
      pos = _text.split("ⒼcursorⒼ")[0].length;
    } else if (originText) {
      let whoIsFront = "";
      if (isEnter && /\n/.test(originText.slice(pos - 2, pos - 1))) {
        whoIsFront = "enter";
      }
      _text =
        originText.slice(0, pos) +
        "ⒼcursorⒼ" +
        originText.slice(
          whoIsFront === "enter" && originText.slice(pos, pos + 1) === "\n"
            ? pos + 1
            : pos,
        );
    }
    _text = _text
      .replace(new RegExp(`(\\s|^)([@#][^Ⓖ\\s]{287})([^\\s]+)`, "g"), "$1$2 $3")
      .replace(
        new RegExp(
          `(\\s|^)(@${NON_SPECIAL_SYMBOL_REG}+)(${SPECIAL_SYMBOL_REG}+)`,
          "g",
        ),
        "$1$2 $3",
      )
      .replace(
        new RegExp(
          `(\\s|${HASHTAG_SPECIAL_SYMBOL_REG}|^)(#${NON_SPECIAL_SYMBOL_REG}{1,100})(${SPECIAL_SYMBOL_REG}+)`,
          "g",
        ),
        "$1$2 $3",
      );
    if (text !== this.state.text || pos !== this.state.pos) {
      this.setState({
        html: this.convertToHtml({text: _text}),
        text,
        pos,
      });
      this.setPos(suggestText, clearAll);
    }
  }

  getPos() {
    this.target?.focus();
    let selection = document.getSelection();
    if (!selection || !selection.anchorNode) {
      return 0;
    }
    let _range = document.getSelection()?.getRangeAt(0);
    let range = _range?.cloneRange();
    range?.selectNodeContents(this.target);
    range?.setEnd(_range.endContainer, _range.endOffset);
    return range?.toString().length;
  }

  setPos(suggestText, clearAll) {
    var range = document.createRange();
    var sel = document.getSelection();
    const sursor = this.target.getElementsByTagName("cursor")[0];
    if (!sursor) return;
    const word = (this.state.html.match(
      /<b class="highlight">([^"]+)<\/b><cursor>/,
    ) || [])[1];
    range.setStart(sursor, 0);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);

    if (clearAll) {
      this.setState({
        suggestStyle: {
          display: "none",
        },
        suggestList: [],
      });
      return;
    }

    !suggestText && this.setSuggestion(word, sursor);
  }

  setSuggestion(keywords = "", sursor) {
    this.setState({
      suggestStyle: {
        left: sursor.offsetLeft,
        top: sursor.offsetTop,
        display: "none",
      },
      keywords: keywords.length >= 2 ? keywords.slice(1) : "",
      prefix: keywords.slice(0, 1),
    });
    if (keywords && keywords.length >= 2) {
      const fetchService = /#/.test(keywords)
        ? "fetchHashtagChoices"
        : "fetchMentionChoices";

      fetchData(
        keywords.slice(1),
        (result) => {
          if (result.length) {
            this.setState({
              suggestList: result,
              suggestStyle: {
                ...this.state.suggestStyle,
                display: "block",
              },
            });
          }
        },
        fetchService,
      );
    }
  }

  insertEmojiOrText(insertEmojiOrText) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => this.emitChange({insertEmojiOrText}), 0);
  }

  selectSuggest(suggestText) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => this.emitChange({suggestText}), 0);
    this.setState({
      suggestStyle: {
        display: "none",
      },
      suggestList: [],
    });
  }

  convertToHtml({text}) {
    let contentText = adaptTextToHtml(text);
    // contentText = UIUtil.WrapEmojiToText(contentText);
    return contentText;
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <div
          className={clsx(
            classes.divTextArea,
            this.state.isEmpty && classes.emptyText,
          )}
          onCompositionStart={() => this.setState({comStart: true})}
          onCompositionEnd={(e) => {
            if (e.data) {
              setTimeout(() => {
                this.insertEmojiOrText(e.data);
                this.setState({
                  comStart: false,
                });
              }, 10);
            } else {
              this.setState({
                comStart: false,
              });
            }
          }}
          onKeyUp={(e) => this.onChange(e, "onKeyUp")}
          onInput={(e) => this.onChange(e, "onInput")}
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
          onClick={() => {
            this.setState({
              isEmpty: false,
              pos: this.getPos(),
            });
          }}
          contentEditable
          dangerouslySetInnerHTML={{__html: renderHtml(this.state.html)}}
          style={this.props.style}
        />
        <div className={classes.suggest} style={this.state.suggestStyle}>
          {this.state.suggestList.length
            ? this.state.suggestList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => this.selectSuggest(item.display)}
                >
                  <p className="suggest-text">
                    {this.state.prefix}
                    {item.display}
                  </p>
                </div>
              ))
            : null}
        </div>
        {this.state.isEmpty && (
          <div
            className={clsx(
              classes.placeholder,
              this.props.variant === "secondary" && classes.secondPlaceholder,
            )}
            onClick={() => {
              this.setState({
                isEmpty: false,
                pos: this.getPos(),
              });
            }}
          >
            {this.props.placeholder}
          </div>
        )}
      </div>
    );
  }
}

GMentionsInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  setupInsertEmoji: PropTypes.func,
  style: PropTypes.object,
  autoFocus: PropTypes.bool,
};

export default withStyles(useStyles)(GMentionsInput);
