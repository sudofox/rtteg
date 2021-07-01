// Stubbing data - should be deprecated
import GetterService from "../GetterService";

import ObjectManager from "../core/ObjectManager";
import NetworkManager from "../core/NetworkManager";

import Portal from "./Portal";
import ImageUtil from "../core/util/ImageUtil";

const FACEBOOK_APP_ID = "1916745291707563";
// const FACEBOOK_APP_SECRET = "437bf89789927406aa9f66d782cb94a8";

/**
 *
 * @param {object} appConfig
 * @return {Portal}
 */
const initPortal = function(appConfig) {
  // console.log("INITIALIZING Portal for the first time...");

  let nm = NetworkManager.GetInstance();
  nm.applyConfig(appConfig);

  let appService = new GetterService();
  appService.applyConfig(appConfig);
  appService.setNetworkManager(nm);

  let om = ObjectManager.GetInstance("default");
  om.applyConfig(appConfig);
  om.setNetworkManager(nm);
  appService.setObjectManager(om);

  let p = new Portal();

  p.setNetworkManager(nm);
  p.setObjectManager(om);
  p.setAppService(appService);
  p.applyConfig(appConfig);

  nm.setUserCredFunction(p.getUserCredFunction());

  return p;
};

/**
 * Global abstracts system characteristics
 *
 */
export class Global {
  /**
   * Are we running inside a web browser right now?
   * This is indicated by checking if "windows" and
   * "document" global variables exist.
   */
  static IsBrowser() {
    let hasWindow =
      typeof window !== "undefined" &&
      window.document != null &&
      window.document.createElement != null;
    return hasWindow;
  }

  static IsProductionBuild() {
    return process.env.NODE_ENV === "production";
  }

  static IsDevelopmentBuild() {
    return process.env.NODE_ENV === "development";
  }

  /**
   * Is this component part of the Single Page Application?
   *
   * @return {boolean}
   */
  static IsSPA() {
    return false; // for now
  }

  /**
   *
   * @return {string}
   */
  static GetSiteURL() {
    return Global.Portal.getSiteURL();
  }

  /**
   * Check if currently running on server. If so,
   * this means it's being run during SSR.
   *
   * @return {boolean}
   */
  static IsServer() {
    return !Global.IsBrowser();
  }

  /**
   * Return {Portal}
   */
  static GetPortal() {
    return Global.Portal ? Global.Portal : Portal.GetInstance();
  }

  /**
   * Convenient method to support both client and server side (for now)
   *
   * @return {XUserCred}
   */
  static GetUserCred() {
    return Global.Portal().getUserCred();
  }

  /**
   *
   * @return {GetterService}
   */
  static GetAppContext() {
    return Global.Portal.getAppContext();
  }

  static GetHistory() {
    return Global.History;
  }

  static GetFacebookAppID() {
    return FACEBOOK_APP_ID;
  }

  static GetAppLogoURL() {
    return "/logos/fr_logo_200.png";
  }

  static GetCachedURL(subpath) {
    return subpath ? `${ImageUtil.CACHE_PATH}/${subpath}` : ImageUtil.CACHE_PATH;
  }

  static GetThumbnailURL(filename) {
    let subpath = filename ? `${ImageUtil.THUMBNAIL_DIR}/${filename}` : filename;
    return Global.GetCachedURL(subpath);
  }

  /**
   * CALL THIS FIRST UPON BOOT UP!!!
   */
  static Initialize(appConfig) {
    if (Global._appliedConfig == null) {
      Global._appliedConfig = true;
      if (appConfig == null) {
        console.error(
          "NO APP CONFIG Passed in to Global.Initialize(). TERMINATING!!!!!"
        );
        process.exit(1);
      }
      Global.Portal = initPortal(appConfig);
    } else console.error("Global.Initialize: Already DONE!!!");
    return Global.Portal;
  }

  static Error(code, msg) {}
}

export default Global;
