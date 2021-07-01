import i18next from "i18next";
import Cookies from "js-cookie";
import {SupportedLanguageList} from "../../app/AppMessages";
// import {DEFAULT_LANG} from "../index";
import Util from "../../core/Util";

const DEFAULT_LANG = "en";

const ONE_YEAR = 365;
const CATCH_I18N_T = "getter-i18n-t";

export function setLang(nextLang, callBack) {
  Cookies.set("lang", nextLang, {expires: ONE_YEAR});
  i18next.changeLanguage(nextLang);
  callBack && callBack();
}

export function getLang() {
  const curLang = Cookies.get("lang");

  const isWhitelistedLang =
    curLang &&
    Util.GetObjectFromArrayByValue(SupportedLanguageList, "code", curLang);

  const lang = isWhitelistedLang ? curLang : DEFAULT_LANG;

  return lang;
}

export function cacheI18nT(t) {
  window[CATCH_I18N_T] = t;
}

export function t(key, opt) {
  const t = window[CATCH_I18N_T];
  return t ? t(key, opt) : null;
}
