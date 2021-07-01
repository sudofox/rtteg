import Global from "./system/Global";

export const COOKIE_SESSION = "cookieSession";
export const COOKIE_DOMAIN = "cookieDomain";

/**
 * Environment-based configuration that can be used
 * to intiialize various components.
 */

export const InitEnvConfig = function () {
  let cfg = {};

  let doHttps = process.env.HTTPS;
  if (process.env.REACT_APP_HTTPS_ENABLED != null)
    doHttps = process.env.REACT_APP_HTTPS_ENABLED;

  cfg["title"] = "Portal";
  cfg["apiHost"] =
    process.env.REACT_APP_API_ENV == "proxy"
      ? ""
      : process.env.REACT_APP_API_URL || "http://0.0.0.0:4999";
  cfg["urlPrefix"] = process.env.REACT_APP_FE_URL_PREFIX || "/";
  cfg[COOKIE_SESSION] = process.env.REACT_APP_COOKIE_SESSION || "local";
  cfg[COOKIE_DOMAIN] = process.env.REACT_APP_COOKIE_DOMAIN || "gettr.com";
  cfg["serverHost"] = process.env.REACT_APP_HTTP_HOST || "gettr.com";
  cfg["serverPort"] = process.env.REACT_APP_HTTP_PORT || 80;
  cfg["serverPortSSL"] = process.env.REACT_APP_HTTPS_PORT || 2443;
  cfg["serverProt"] = process.env.REACT_APP_HTTP_PROTOCOL || "http";
  cfg["httpsEnabled"] = doHttps || "false";
  cfg["appUrl"] =
    process.env.REACT_APP_URL ||
    (process.env.REACT_APP_URL == null ? "" : null);

  if (Global && Global.IsServer()) dumpConfig(cfg);
  return cfg;
};

export const dumpConfig = function (envConfig) {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  console.log("%");
  console.log("% NODE_ENV=" + process.env.NODE_ENV);
  console.log("%");
  console.log("% Configuration To Be Applied:");
  console.log("% ----------------------------");
  console.log(envConfig);
  console.log("%");
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

  console.log("\n");
  console.log("------------------ process.env ----------------");
  console.log("     REACT_APP_HTTP_HOST:", process.env.REACT_APP_HTTP_HOST);
  console.log("     REACT_APP_HTTP_PORT:", process.env.REACT_APP_HTTP_PORT);
  console.log("    REACT_APP_HTTPS_PORT:", process.env.REACT_APP_HTTPS_PORT);
  console.log(" REACT_APP_HTTPS_ENABLED:", process.env.REACT_APP_HTTPS_ENABLED);
  console.log("           REACT_APP_URL:", process.env.REACT_APP_URL);
  console.log(
    "REACT_APP_COOKIE_SESSION:",
    process.env.REACT_APP_COOKIE_SESSION,
  );
  console.log(" REACT_APP_COOKIE_DOMAIN:", process.env.REACT_APP_COOKIE_DOMAIN);
  console.log("-----------------------------------------------");
};

export default InitEnvConfig;
