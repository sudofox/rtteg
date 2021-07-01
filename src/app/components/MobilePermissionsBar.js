import {useMediaQuery, useTheme} from "@material-ui/core";
import {useState} from "react";
import {useLocation} from "react-router-dom";
import {CookieNotification} from "./CookieNotification";
import {DownloadBar} from "./DownloadBar";

export const MobilePermissionsBar = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(
    localStorage.getItem("cookieAccepted") === "true",
  );
  const [downloadCookieAccepted, setDownloadCookieAccepted] = useState(
    sessionStorage.getItem("downloadCookieAccepted") === "true",
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const location = useLocation();
  const path = location.pathname.split("/");
  const isApp = path[1].endsWith("-app");
  const isFAQPage = path[1].startsWith("helpcenter");

  return isMobile && !isApp && !isFAQPage ? (
    <>
      <DownloadBar
        cookiesAccepted={cookiesAccepted}
        downloadCookieAccepted={downloadCookieAccepted}
        setDownloadCookieAccepted={setDownloadCookieAccepted}
      />
      <CookieNotification
        cookiesAccepted={cookiesAccepted}
        setCookiesAccepted={setCookiesAccepted}
      />
    </>
  ) : null;
};
