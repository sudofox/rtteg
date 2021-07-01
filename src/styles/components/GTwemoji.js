import {getEmojiDataFromNative, Emoji} from "emoji-mart";
import clsx from "clsx";
import data from "emoji-mart/data/all.json";
import emojiRegex from "emoji-regex";
import parse from "html-react-parser";
import {makeStyles} from "@material-ui/core/styles";
import twemoji from "twemoji";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
    "&.large": {
      lineHeight: "29px",
    },
    "& .emoji-mart-emoji": {
      padding: "0 2px",
      verticalAlign: "top",
      "& span": {
        verticalAlign: "middle",
        "& b": {
          clipPath: "circle(0% at 50% 50%)",
          whiteSpace: "nowrap",
        },
      },
    },
  },
}));

const renderEmoji = (html, {size = 20, ...rest}) => {
  const classes = useStyles();
  const srcReg = /<[\s\S]*?src="([^\s]+)".*/;
  let content = parse(html, {
    replace: (domNode) => {
      if (domNode.name === "emoji") {
        const emojiData = getEmojiDataFromNative(
          domNode.attribs.value,
          "twitter",
          data,
        );
        if (emojiData) {
          return (
            <div className={clsx(classes.root, size === 24 ? "large" : "")}>
              <Emoji emoji={emojiData} set="twitter" size={size} {...rest}>
                <b style={{fontSize: `${size}px`, lineHeight: `${size}px`}}>
                  {domNode.attribs.value}
                </b>
              </Emoji>
            </div>
          );
        } else {
          return (
            <div className={clsx(classes.root, size === 24 ? "large" : "")}>
              <span aria-label={domNode.attribs.value} class="emoji-mart-emoji">
                <span
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    display: "inline-block",
                    backgroundImage: `url('${
                      twemoji.parse(domNode.attribs.value).match(srcReg)[1]
                    }')`,
                    backgroundSize: "contain",
                  }}
                >
                  <b style={{fontSize: `${size}px`, lineHeight: `${size}px`}}>
                    {domNode.attribs.value}
                  </b>
                </span>
              </span>
            </div>
          );
        }
      }
    },
  });
  return content;
};

export const GTwemoji = ({text, size = 20, ...rest}) => {
  if (!text) {
    return null;
  }

  let html = text.replace(
    new RegExp(`(${emojiRegex().source})`, "g"),
    '<emoji value="$1">$1</emoji>',
  );
  return renderEmoji(html, {size, ...rest});
};
