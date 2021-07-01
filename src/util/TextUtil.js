import AppConsts from "../app/AppConsts";
import {SPECIAL_SYMBOL} from "src/styles/components/GMentionsInput";
import {t} from "src/i18n/utils";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";

const SPECIAL_SYMBOL_REG = `[${SPECIAL_SYMBOL.slice(1).join("|")}]`;
const NON_SPECIAL_SYMBOL_REG = `[^${SPECIAL_SYMBOL.join("|")}]`;

export const descriptionFormat = (text) => {
  return text.length > AppConsts.DESCRIPTION_MAX_CHARACT
    ? `${text.substring(0, AppConsts.DESCRIPTION_MAX_CHARACT)}...`
    : text;
};

export const youtubeFormat = (url) => {
  const regex = new RegExp(
    /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
  );
  return regex.test(url);
};

export const twitterFormat = (url) => {
  const regex = new RegExp(/^(https?\:\/\/)?(www\.)?(twitter\.com)\/.+$/);

  return regex.test(url);
};

export const getYoutubeVideoID = (url) => {
  const regex = new RegExp(
    /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w-_]+)/,
  );
  return url.match(regex);
};

export const filterReg = (text) => {
  return text.replace(
    new RegExp(
      `^(\\s|^)([@#]${NON_SPECIAL_SYMBOL_REG}+)(${SPECIAL_SYMBOL_REG}+).*$`,
      "g",
    ),
    "$1$2",
  );
};

export const emailBlacklistReg = new RegExp(
  "^(?:" +
    [
      "qq.com",
      "163.com",
      "126.com",
      "yeah.net",
      "aliyun.com",
      "foxmail.com",
      "wo.com.cn",
      "wo.cn",
      "139.com",
      "cmtietong.com",
      "sina.com",
      "vip.sina.com",
      "sina.cn",
      "sohu.com",
      "vip.sohu.com",
      "sohu.net",
      "189.cn",
      "21cn.com",
      "hainan.com",
      "hainan.net",
      "sunmail.cn",
      "163.net",
      "tom.com",
      "vip.tom.com",
    ]
      .map((t) => t.replace(".", "\\."))
      .map((t) => "(?!.+@" + t + "$)")
      .join(",")
      .replace(/,/g, "") +
    ")",
);

export const handleSameText = (text, key) => {
  if (sessionStorage.getItem(key) === text) {
    toast.info(
      <NotifMessage message={t("getter_fe.post.text.samePostText")} />,
      {
        type: toast.TYPE.ERROR,
      },
    );

    return true;
  }
  sessionStorage.setItem(key, text);
};

export const handleClearSameText = (key) => {
  sessionStorage.removeItem(key);
};
