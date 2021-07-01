/**
 * References:
 * - https://react.i18next.com/guides/quick-start#configure-i-18-next
 * - https://react.i18next.com/latest/using-with-hooks#configure-i-18-next
 * - https://react.i18next.com/latest/i18next-instance
 */
import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import {getLang} from "./utils";
import translationEN from "../assets/locales/en_us/translation.json";
import translationZH from "../assets/locales/zh/translation.json";
import translationTW from "../assets/locales/tw/translation.json";
import translationES from "../assets/locales/es/translation.json";
import translationJA from "../assets/locales/ja/translation.json";
import translationKO from "../assets/locales/ko/translation.json";
import translationFR from "../assets/locales/fr/translation.json";

export const DEFAULT_LANG = "en_us";

const resources = {
  en_us: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  ja: {
    translation: translationJA,
  },
  ko: {
    translation: translationKO,
  },
  fr: {
    translation: translationFR,
  },
  zh: {
    translation: translationZH,
  },
  tw: {
    translation: translationTW,
  },
};

i18next
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    resources: resources,
    lng: getLang(),
    fallbackLng: DEFAULT_LANG,
    react: {
      useSuspense: false,
    },
    parseMissingKeyHandler: (key) => {
      // return empty space if missing keys or loading translation
      if (key.includes("getter.") || key.includes("getter_fe.")) {
        return "\u00A0";
      } else {
        return key;
      }
    },
  });

export {i18next};
