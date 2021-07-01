import React, {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Zendesk, {ZendeskAPI} from "react-zendesk";

import {getLang} from "../../i18n/utils";

const ZENDESK_KEY = process.env.REACT_APP_ZENDESK_KEY;

const setting = {
  color: {
    theme: "#000",
  },
  launcher: {
    chatLabel: {
      "*": "Contact US",
      "en-US": "Contact US",
    },
  },
  offset: {
    mobile: {
      vertical: "60px",
    },
  },
};

export const ZendeskChat = () => {
  const currentLang = getLang();
  const location = useLocation();
  const [isZendesk, setIsZendesk] = useState(false);
  const [lang, setLang] = useState(currentLang);

  const langChange = useCallback((value) => {
    let selectedLang;

    switch (value) {
      case "ko":
        selectedLang = "ko";
        break;
      case "es":
        selectedLang = "es";
        break;
      case "ja":
        selectedLang = "ja";
        break;

      default:
        selectedLang = "en-us";
        break;
    }

    setLang(selectedLang);
    ZendeskAPI("webWidget", "setLocale", selectedLang);
  }, []);

  useEffect(() => {
    langChange(currentLang);
  }, [currentLang, langChange]);

  const onLoaded = () => {
    ZendeskAPI("webWidget", "setLocale", lang);
  };

  useEffect(() => {
    const zendeskEl = document.getElementById("launcher");

    if (location.pathname.includes("/helpcenter/")) {
      setIsZendesk(true);
      if (zendeskEl) zendeskEl.style.opacity = "1";
    } else {
      setIsZendesk(false);
      if (zendeskEl) zendeskEl.style.opacity = "0";
    }
  }, [location.pathname]);

  if (!isZendesk) return null;
  return (
    <Zendesk
      zendeskKey={ZENDESK_KEY}
      {...setting}
      onLoaded={() => onLoaded()}
    />
  );
};
