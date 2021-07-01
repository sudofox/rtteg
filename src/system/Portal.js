// "Helper" class for all of frontend / ui for portal app

// import React from 'react';
import ReactDOM from "react-dom";
import JSON5 from "json5";

import ObjectBase from "../core/ObjectBase";
import Global from "./Global";
import Session from "./Session";
import {Error} from "./Error";
import XUserCred from "../core/model/user/XUserCred";

import {createBrowserHistory, createMemoryHistory} from "history";
import XUserInfo from "../core/model/user/XUserInfo";
import Util from "../core/Util";
import {FeatureConsts} from "../core/model/ModelConsts";
import {getLang} from "../i18n/utils";

import {COOKIE_SESSION, COOKIE_DOMAIN} from "../EnvConfig";
import {APP_WEB_DOMAIN} from "../app/AppConsts";

const getURL = function (host, path) {
  if (host) return host + path;
  else return "http://localhost:8080" + path;
};

const _CLSNAME = "Portal";

const PROP_APPSVC = "appContext";
const PROP_APPCOM = "appPanel";

/**
 * Class to represent the website. It has services focus
 * on access to the website (e.g., login/logout), while
 * the app-specific objects like GetterService focus
 * on Getter-specific below-UI services.
 */
class Portal extends ObjectBase {
  /**
   * Represents a single instance.
   * @constructor
   * @param props outside (configuration) properties to use
   */
  constructor(clsname = _CLSNAME) {
    super(clsname);
    this.class = Portal;
    this.classname = clsname;

    // set to true only after applyConfig
    this.intialized = false;

    this.created = Date.now();
    this.session = new Session("fr" + this.created);
    // console.log(
    //   "********** NEW PORTAL INSTANCE (" + this.created + ") **********"
    // );

    this._isProduction = null;
    this._isDevelopment = null;

    this.nm = {}; // registry for NetworkManager instances
    this.om = {}; // register for ObjectManager instances
  }

  isInitialized() {
    return this.initialized;
  }

  /**
   * Check if currently running on server. If so,
   * this means it's being run during SSR.
   */
  isServer() {
    return Global.IsServer();
  }

  /**
   * Are we running inside a web browser right now?
   * This is indicated by checking if "windows" and
   * "document" global variables exist.
   */
  // isBrowser() {
  //   return Global.IsBrowser();
  // }

  isProduction() {
    if (this._isProduction == null) {
      this._isProduction =
        Global.IsProductionBuild() && this.isProductionHost();
    }
    return this._isProduction;
  }

  isDevelopment() {
    if (this._isDevelopment == null) {
      this._isDevelopment =
        Global.IsDevelopmentBuild() || this.isDevelopmentHost();
    }
    return this._isDevelopment;
  }

  isHttpsEnabled() {
    return this.httpsEnabled;
  }

  /**
   * Is this component part of the Single Page Application?
   */
  // isSPA() {
  //   return Global.IsSPA();
  // }

  isLocalhost() {
    return this.serverHost === "localhost";
  }

  isDevelopmentHost() {
    return this.serverHost.indexOf("dev") !== -1;
  }

  isProductionHost() {
    return (
      this.serverHost.indexOf(APP_WEB_DOMAIN) !== -1 &&
      !this.isDevelopmentHost()
    );
  }

  getFacebookAppID() {
    return Global.GetFacebookAppID();
  }

  /**
   * Return Google Analytics ID. Note, this will return
   * different value depends on host/production build.
   *
   * @return {string} ID if setup, null if not setup for the env.
   */
  getGoogleAnalyticsID() {
    if (this.isProductionHost()) return "UA-152597428-1";
    else if (this.isDevelopmentHost()) return "UA-152597428-2";
    else if (this.isLocalhost()) return "UA-152597428-3";

    return null;
  }

  /**
   * @return {string}
   */
  getGoogleAPIKey() {
    // return '00a8689437ec2ca6c291cc67cbf070d1abc478ab';
    // return "AIzaSyB-KGc8lUuPkHGUmkgfDjeypM5EFr5DliQ";
    return "";
  }

  // special set during configuration where regular port is set to 80 and there
  // is a second port for SSL
  _setServerPortSSL(port) {
    this.serverPortSSL = port;
  }

  getServerHost(defaultHost = "localhost") {
    return this.serverHost ? this.serverHost : defaultHost;
  }

  getServerPort(defaultPort = 3000) {
    return this.serverPort ? this.serverPort : defaultPort;
  }
  getServerPortSSL(defaultPort = 3443) {
    return this.serverPortSSL ? this.serverPortSSL : defaultPort;
  }

  getServerProtocol(defaultProt = "http") {
    return this.serverProt ? this.serverProt : defaultProt;
  }

  getCacheDir(defaultDir = "/defCache") {
    return this.cacheDir ? this.cacheDir : defaultDir;
  }

  /**
   * Internal: set parts of server URL. This should be done
   * during #applyConfig().
   * However, it is best to call this upon entry to the server
   * and receiving the first request, or call it at the
   * top level React component (App) to ensure using the
   * right URL prefix (e.g., https, port #)
   *
   * @see #getSiteURL
   */
  _setServerURL(protocol, hostname, port, override = false) {
    const _m = `_setServerURL`;
    if (this.serverURL != null && override === false) {
      this.error(_m, "override will not happen. Current URL:", this.serverURL);
      return false;
    }
    let props = this;
    if (hostname) props.serverHost = hostname;
    if (port) props.serverPort = port;
    if (protocol) props.serverProt = protocol;
    // this.log(_m, `Registered protocol=${protocol}  host=${hostname}  port=${port}`);
    this.serverURL = null; // force re-construct in #getSiteURL
    return true;
  }

  /**
   * Return Site's URL, which can be used to give
   * to external sources.
   * NOTE: This method just returns "serverURL" variable
   * if set. If not set, the it defaults to configuration's
   * variables. But the best is for the highest level
   * component (or one with "req") to call _setSiteURL()
   * and set each component definitively.
   *
   * @see #_setSiteURL
   */
  getServerURL() {
    if (this.serverURL == null) {
      let doHttps = this.httpsEnabled ? this.httpsEnabled : false;
      let protocol = this.getServerProtocol();
      let hostname = this.getServerHost();
      let port = this.getServerPort().toString();
      let portSSL = this.getServerPortSSL().toString();

      // override if HTTPS
      if (doHttps === true) {
        protocol = "https";
        if (portSSL) port = portSSL;
      }

      if (port === "80" && !doHttps) port = "";
      else if (port === "443" && doHttps) port = "";
      if (port !== "") port = ":" + port;
      this.serverURL = protocol + "://" + hostname + port;
      // this.log("getSiteURL", `Derived URL: ${this.serverURL}`);
    }
    return this.serverURL;
  }

  /**
   * Site URL prefix is to generate link for external access through
   * portal. This is different than server URL when there is a load balancer.
   *
   * @param {string} urlString
   */
  _setSiteURL(urlString) {
    this.siteURL = urlString;
  }

  /**
   * Return the site URL that is accessible from outside, not internal
   * URL.
   */
  getSiteURL() {
    return this.siteURL ? this.siteURL : this.getServerURL();
  }

  // system services layers

  setNetworkManager(nm, label = "default") {
    this.nm[label] = nm;
  }

  getNetworkManager(label = "default") {
    return this.nm[label];
  }

  setObjectManager(om, label = "default") {
    this.om[label] = om;
  }

  getObjectManager(label = "default") {
    return this.om[label];
  }

  // Session related methods

  getSession() {
    return this.session;
  }

  setApp(panel, context) {
    this[PROP_APPCOM] = panel;
    this[PROP_APPSVC] = context;
  }

  /**
   *
   * @param {ClientAppService} serviceObj
   */
  setAppService(serviceObj) {
    this[PROP_APPSVC] = serviceObj;
    serviceObj.setPortal(this); // bi-dir reference
  }

  getAppPanel() {
    return this[PROP_APPCOM];
  }

  /** @return {Ranker} */
  getAppService() {
    return this[PROP_APPSVC];
  }

  /**
   * Return user credential object.
   *
   * @return {XUserCred}
   */
  getUserCred() {
    return XUserCred.Create(this.getUserToken(), this.getUserId());
  }

  getUserCredFunction() {
    return this.getUserCred.bind(this);
  }

  /**
   * Dont' use this to determine if user is logged in.
   * Use 'userLoggedIn()'
   *
   * @return {string}
   *
   * @see ~userLoggedIn
   */
  getUserId() {
    return this.session.getUserId();
  }

  /** @return {string} */
  getUsername() {
    return this.session.getUsername();
  }

  /**
   * Return stored user token
   */
  getUserToken() {
    return this.session.getUserToken();
  }

  getAvatarUrl() {
    return this.session.getAvatarUrl();
  }

  /**
   * Return user's "nickname", which is portal's screen name
   * @param {boolean} useUsername true to use username if nick name is null
   * @return {string}
   */
  getNickname(useUsername = true) {
    let name = this.session.getNickname();
    if (name == null && useUsername === true) name = this.getUsername();
    if (!name) name = "GUEST";
    return name;
  }

  /** @return {string} */
  getCookieName(defaultVal = null) {
    return this.session.getCookieSessionName(defaultVal);
  }

  /** @return {string} */
  getWebsiteUrl() {
    return this.getSiteURL();
  }

  /**
   * Set user's information in session. This
   * is likely the first time the user is
   * set to session.
   *
   * @param {XUserInfo} userInfo
   * @param {boolean=} rememberMe
   *
   * @see #updateUserInfo
   */
  _setUserInfo(userInfo, rememberMe = true) {
    this.assertNotNull(userInfo, "_sui");
    this.getAppService().setUserInfo(userInfo, rememberMe);
  }

  /**
   * Update user's information in session. This
   * is likely updating some stats for the logged
   * in user
   *
   * @param {XMUserInfo} userInfo
   *
   * @see #_setUserInfo
   */
  updateUserInfo(userInfo) {
    this.assertNotNull(userInfo, "uui");
    this.getAppService().updateUserInfo(userInfo);
  }

  /**
   * Update user's stats in session.
   *
   * @param {XMUserStats} userStats
   *
   * @see #_setUserInfo
   */
  updateUserStats(userStats) {
    this.assertNotNull(userStats, "uus");
    this.session.updateUserStats(userStats);
  }

  _clearUserInfo() {
    // Clear user info and replace it with Guest
    this.session.resetUserInfo();
  }

  getUserInfo(label, defaultVal = null) {
    return this.session.getUserInfo(label, defaultVal);
  }

  userIsGod() {
    return this.session.userIsGod();
  }

  userHasAdminRole() {
    return this.session.userHasAdminRole();
  }

  userHasSysAdminRole() {
    return this.session.userHasSysAdminRole();
  }

  userHasModeratorRole() {
    return this.session.userHasModeratorRole();
  }

  /**
   * Answers whether the user can preview features.
   *
   * @return {boolean} true if user has given
   * the privledge to preview
   */
  userHasPreviewFeatures() {
    return this.session.userHasPreviewFeatures();
  }

  /**
   * Initialize Browser History.
   *
   * @param url optional root path
   * @param override true to override existing, false to skip
   * @return null if not created (existing), otherwise new instance is returned
   * @see #getBrowserHistory
   */
  initBrowserHistory(url = "/", override = false) {
    let history = this.session.get("browserHistory");
    if (history && override === false) return null;

    if (this.isServer())
      history = createMemoryHistory({
        initialEntries: [url], // for now...
      });
    else history = createBrowserHistory();
    this.session.set("browserHistory", history);

    return history;
  }

  setBrowserHistory(history) {
    this.session.set("browserHistory", history);
  }

  getBrowserHistory() {
    let history = this.session.get("browserHistory");
    return history ? history : this.initBrowserHistory();
  }

  /**
   * Refresh App with given playList, or if null go to server and
   * fetch latest.
   * @param (array) list of players to use by App, null to get from server
   */
  refreshApp() {
    let routes = this.getAppService().getRoutes(this.getBrowserHistory());
    ReactDOM.render(routes, document.getElementById("root"));
  }

  /**
   * Set/Update portal properties from the given config object
   *
   * @param {{}} props object to pick properties from
   */
  applyConfig(props) {
    this.apiHost = props.apiHost ? props.apiHost : "http://127.0.0.1:999";
    this.apiGetUserList = getURL(this.apiHost, "/api/users");
    this.apiUserCRUD = getURL(this.apiHost, "/api/user");
    this.apiUserLogin = getURL(this.apiHost, "/s/auth_up");
    this.apiUserSignup = getURL(this.apiHost, "/u/signup");
    this.apiUserLogout = getURL(this.apiHost, "/s/logout");
    this.apiUserProfileCRUD = getURL(this.apiHost, "/api/uprofile");

    this.cacheDir = props.cacheDir ? props.cacheDir : "";
    this.title = props.title ? props.title : "No Name App";

    this.httpsEnabled = props.httpsEnabled
      ? JSON5.parse(props.httpsEnabled)
      : false;

    this._setServerURL(
      props.serverProt,
      props.serverHost,
      props.serverPort,
      true,
    );

    if (props.appUrl) this._setSiteURL(props.appUrl);

    this._setServerPortSSL(props.serverPortSSL);

    let cookieName = props[COOKIE_SESSION];
    let cookieDomain = props[COOKIE_DOMAIN];
    if (cookieName && this.session)
      this.session.trackCookieSessionName(cookieName);
    if (cookieDomain && this.session)
      this.session.trackCookieDomainName(cookieDomain);
    else this.error("applyConfig", "No session object so can't set cookie");

    this.initialized = true;
    // this.log("applyConfig", "Portal INITIALIZED");
  }
  apiUserRUD(userId) {
    return this.apiUserCRUD + "/" + userId;
  }

  apiCall(method, url, data, resultsHandler, errorHandler) {
    var err = {};
    // var portal = this;
    let processResponse = function (response) {
      // portal.log("apiCall", "dump response:");
      // portal.log("apiCall", response);
      var ok = response.ok;
      // var status = response.status;
      if (!ok) {
        err[response] = response;
        throw err;
      }

      return response.json();
    };

    let p1 = fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let p2 = p1
      .then((response) => processResponse(response))
      .catch(url, errorHandler);
    p2.then((result) => resultsHandler(result)).catch(url, errorHandler);
  }
  apiGetCall(url, data, resultsHandler, errorHandler) {
    return this.apiCall("get", url, data, resultsHandler, errorHandler);
  }
  apiPostCall(url, data, resultsHandler, errorHandler) {
    return this.apiCall("post", url, data, resultsHandler, errorHandler);
  }

  /**
   * Explicitly logout user (clearing userInfo in session)
   */
  _logoutUser() {
    // trace/journal user logout?
    // this.log("_setLoggedOutUser", "Logout User request received.");
    this.session.clearUserInfo();
    this.getAppService().resetUser();
  }

  userLoggedIn() {
    return this.session.userLoggedIn();
  }

  /**
   * Legacy
   */
  isAuthenticated() {
    return this.session.userLoggedIn();
  }

  /**
   * Login a user.
   *
   * Why not in GetterService? The original intention is each
   * instance of app service can represent an "app", and therefore
   * there can be multiple instances if there are multiple "apps"
   * or sub-apps. The login/logout is specific to the portal "shell".
   *
   * But this can be debated and changed if assumption is wrong.
   *
   *
   * @param userInfo record tracks different login info type,
   * including 'email', 'username', '_id', etc
   *
   * @param {XUserInfo} userInfo
   * @param {XAuthInfo} authInfo
   * @param {boolean=} rememberMe
   *
   */
  async login(userInfo, username, pwd, token, rememberMe, callback) {
    const _m = "login";

    let content;
    if (username.indexOf("@") === -1) {
      content = {
        username: username.toLowerCase(),
        pwd: pwd,
        token: token,
      };
    } else {
      content = {
        email: username.toLowerCase(),
        pwd: pwd,
        token: token,
      };
    }

    let processError = (where, error) => {
      this.error(_m, where + " reported error: ", error);
      if (callback) callback(error, null);
    };
    let processResult = (authResult) => {
      let err = null;

      // this.log(_m, "got results from server: ", JSON.stringify(authResult));
      let authenticated = authResult["token"];
      let loadedUserInfo = authResult["user"];
      // let hasToken = XUserInfo.GetUserToken(authResult, null) != null;
      if (!authenticated) {
        // this.log(_m, "Auth FAILED with userinfo:", userInfo);
        err = Error.AUTH_FAILED();
      } else {
        // this.log(_m, "Authentication SUCCEEDED for user: ", userinfo_str);

        if (userInfo) {
          let inIconUrl = XUserInfo.GetIconUrl(userInfo, null);
          let loadedIconUrl = XUserInfo.GetIconUrl(loadedUserInfo, null);
          if (
            !Util.StringIsEmpty(inIconUrl) &&
            Util.StringIsEmpty(loadedIconUrl)
          ) {
            XUserInfo.SetIconUrl(loadedUserInfo, inIconUrl);
          }
          XUserInfo.SetUserToken(loadedUserInfo, authenticated);
        }

        // Remember in session; sets cookie
        this._setUserInfo(loadedUserInfo, rememberMe);
      }
      if (callback) callback(err, loadedUserInfo);
    };

    let url = this.apiUserLogin;
    try {
      let result = await this.getAppService().requestPOST(url, content);
      // result = result ? Util.DecryptJSON(result) : null;
      return processResult(result);
    } catch (err) {
      console.log(err);
      return processError(null, err);
    }

    // this.apiPostCall(this.apiUserLogin, content, processResult, processError);
  }

  /**
   * signup a user.
   *
   * Why not in GetterService? The original intention is each
   * instance of app service can represent an "app", and therefore
   * there can be multiple instances if there are multiple "apps"
   * or sub-apps. The login/logout is specific to the portal "shell".
   *
   * But this can be debated and changed if assumption is wrong.
   *
   *
   * @param userInfo record tracks different login info type,
   * including 'email', 'username', '_id', etc
   *
   * @param {XUserInfo} userInfo
   * @param {XAuthInfo} authInfo
   * @param {boolean=} rememberMe
   *
   */
  async signup(
    userInfo,
    username,
    pwd,
    lang,
    email,
    code,
    token,
    rememberMe,
    callback,
  ) {
    const _m = "login";

    const content = {
      userinfo: {username: username, email: email, lang: lang},
      authinfo: {
        pwd: pwd,
      },
      verifycode: code,
      token: token,
    };
    let processError = (where, error) => {
      this.error(_m, where + " reported error: ", error);
      if (callback) callback(error, null);
    };
    let processResult = (authResult) => {
      let err = null;

      // this.log(_m, "got results from server: ", JSON.stringify(authResult));
      let authenticated = authResult["token"];
      let loadedUserInfo = authResult["user"];
      // let hasToken = XUserInfo.GetUserToken(authResult, null) != null;
      if (!authenticated) {
        // this.log(_m, "Auth FAILED with userinfo:", userInfo);
        err = Error.AUTH_FAILED();
      } else {
        // this.log(_m, "Authentication SUCCEEDED for user: ", userinfo_str);

        if (userInfo) {
          let inIconUrl = XUserInfo.GetIconUrl(userInfo, null);
          let loadedIconUrl = XUserInfo.GetIconUrl(loadedUserInfo, null);
          if (
            !Util.StringIsEmpty(inIconUrl) &&
            Util.StringIsEmpty(loadedIconUrl)
          ) {
            XUserInfo.SetIconUrl(loadedUserInfo, inIconUrl);
          }
          XUserInfo.SetUserToken(loadedUserInfo, authenticated);
        }

        // Remember in session; sets cookie
        this._setUserInfo(loadedUserInfo, rememberMe);
      }
      if (callback) callback(err, loadedUserInfo);
    };

    let url = this.apiUserSignup;
    try {
      let result = await this.getAppService().requestPOST(url, content);
      // result = result ? Util.DecryptJSON(result) : null;
      return processResult(result);
    } catch (err) {
      console.log(err);
      return processError(null, err);
    }

    // this.apiPostCall(this.apiUserLogin, content, processResult, processError);
  }

  /**
   * signup a user.
   *
   * Why not in GetterService? The original intention is each
   * instance of app service can represent an "app", and therefore
   * there can be multiple instances if there are multiple "apps"
   * or sub-apps. The login/logout is specific to the portal "shell".
   *
   * But this can be debated and changed if assumption is wrong.
   *
   *
   * @param userInfo record tracks different login info type,
   * including 'email', 'username', '_id', etc
   *
   * @param {XUserInfo} userInfo
   * @param {XAuthInfo} authInfo
   * @param {boolean=} rememberMe
   *
   */
  async claimSignup(
    userInfo,
    url,
    username,
    pwd,
    lang,
    email,
    rememberMe,
    callback,
  ) {
    const _m = "login";

    const content = {
      email,
      pwd,
    };
    let processError = (where, error) => {
      this.error(_m, where + " reported error: ", error);
      if (callback) callback(error, null);
    };
    let processResult = (authResult) => {
      let err = null;

      // this.log(_m, "got results from server: ", JSON.stringify(authResult));
      let authenticated = authResult["token"];
      let loadedUserInfo = authResult["user"];
      // let hasToken = XUserInfo.GetUserToken(authResult, null) != null;
      if (!authenticated) {
        // this.log(_m, "Auth FAILED with userinfo:", userInfo);
        err = Error.AUTH_FAILED();
      } else {
        // this.log(_m, "Authentication SUCCEEDED for user: ", userinfo_str);

        if (userInfo) {
          let inIconUrl = XUserInfo.GetIconUrl(userInfo, null);
          let loadedIconUrl = XUserInfo.GetIconUrl(loadedUserInfo, null);
          if (
            !Util.StringIsEmpty(inIconUrl) &&
            Util.StringIsEmpty(loadedIconUrl)
          ) {
            XUserInfo.SetIconUrl(loadedUserInfo, inIconUrl);
          }
          XUserInfo.SetUserToken(loadedUserInfo, authenticated);
        }

        // Remember in session; sets cookie
        this._setUserInfo(loadedUserInfo, rememberMe);
      }
      if (callback) callback(err, loadedUserInfo);
    };

    try {
      let result = await this.getAppService().requestPOST(url, content);
      // debugger
      // result = result ? Util.DecryptJSON(result) : null;
      return processResult(result);
    } catch (err) {
      // debugger
      console.log(err);
      return processError(null, err);
    }

    // this.apiPostCall(this.apiUserLogin, content, processResult, processError);
  }

  /**
   * User logout. User info will be cleared from
   * session (and cookie).
   *
   * @param {string} userId
   * @callback
   */
  async logout(userId, callback) {
    if (userId == null) userId = this.getUserId();
    // this.log("logging out: ", userId);

    // clear session first in case of network problem
    this._logoutUser();

    var helper = this;
    var logoutData = {
      userId: userId,
    };
    let processError = function (where, error) {
      helper.error(where + " reported error: ", error);
      if (callback) callback(error, null);
    };
    let processResult = function (jsonResult) {
      let err = null;

      // helper.log("logout", "got results from server: ", jsonResult);
      // No matter what, clear user and cookie. Better safe than sorry
      helper._clearUserInfo();
      if (callback) callback(err, jsonResult);
    };

    this.apiPostCall(
      this.apiUserLogout,
      logoutData,
      processResult,
      processError,
    );
  }

  /**
   * TODO: Move to Ranker.js like signupUser()
   *
   * @param {*} userId
   * @param {*} changeRules
   * @param {*} callback
   */
  updateUser(userId, changeRules, callback) {
    var helper = this;
    this.log(
      "updateUser",
      "Updating with the following change actions: ",
      changeRules,
    );
    let processResult = function (jsonResult) {
      let err = null;

      helper.log("updateUser: got results from server: ", jsonResult);
      if (callback) callback(err, jsonResult);
    };
    let msgBody = {userId: userId, rules: changeRules};
    let p1 = fetch(this.apiUserRUD(userId), {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msgBody),
    });
    let p2 = p1.then((response) => response.json());
    p2.then((result) => processResult(result));
  }

  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * @return {Portal}
   */
  static CreateNew() {
    let p = new Portal();
    if (Portal.instance == null) Portal.instance = p;
    return p;
  }

  /**
   * @return {Portal}
   */
  static GetInstance() {
    return Portal.instance;
  }

  static CheckIn() {
    return true;
  }
}

export default Portal;
