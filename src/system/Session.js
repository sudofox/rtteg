import Cookies from "js-cookie";
import ObjectBase from "../core/ObjectBase";

import XUserInfo from "../core/model/user/XUserInfo";
// import XUserStats from "../core/model/user/XUserStats";
import {UserProps} from "../core/model/ModelConsts";
import Util from "../core/Util";
import AppConsts from "../app/AppConsts";
import XUserStats from "../core/model/user/XUserStats";

const USER_INFO = "userinfo";
const USER_STATS = "userstats";

const USER_ID = "_id";
const USER_NAME = "username";
const ORIG_USER_NAME = "ousername";
const USER_NICKNAME = "nickname";
const USER_EMAIL = "email";
// const USER_JOINT_DATE = "joint_date";

const COOKIE_SESSION = "csn";
const COOKIE_DOMAIN = "cdn";

const USER_GUEST = "guest";

// This is for debugging locally only
var globalSession = null;

const _CLSNAME = "Session";

class Session extends ObjectBase {
  static get USER_ID() {
    return UserProps.ID;
  }
  static get USER_NAME() {
    return UserProps.NAME;
  }
  static get USER_NICKNAME() {
    return UserProps.NICKNAME;
  }
  static get USER_EMAIL() {
    return UserProps.EMAIL;
  }
  static get USER_TOKEN() {
    return UserProps.TOKEN;
  }

  constructor(name) {
    super(_CLSNAME);
    this.class = Session;
    this.name = name;
    this.props = {
      name: name,
    };

    if (globalSession == null) globalSession = this;
  }

  set(label, value) {
    // this.log("set", "label: ", label, " = ", value);
    let prevValue = this.props[label];
    if (prevValue === value) return;

    this.props[label] = value;
    this._dispatchHandlers(label, prevValue, value);
    return prevValue;
  }

  get(label, defVal = null) {
    let value = this.props[label];
    // this.log("get", "label: " + label, " => ", value);
    return value ? value : defVal;
  }

  /**
   * Return session name given with constructor.
   * In the future, this can be an unique identifier to
   * track multiple connected sessions.
   */
  getName() {
    return this.get("name");
  }

  /**
   * Track cookie's name for storing user data
   *
   * @param {string} name
   */
  trackCookieSessionName(name) {
    if (name) {
      this.set(COOKIE_SESSION, name);
      return true;
    }
    return false;
  }

  getCookieSessionName(defaultValue = null) {
    return this.get(COOKIE_SESSION, defaultValue);
  }

  /**
   * Set cookie's hostname into this session tracking
   * so that it can be added as the cookie domain
   * in request headers.
   *
   * @param {string} domain
   * @see ~setCookieDomain
   */
  trackCookieDomainName(domain) {
    if (domain) {
      this.set(COOKIE_DOMAIN, domain);
      return true;
    }
    return false;
  }

  getCookieDomainName(defaultValue = null) {
    return this.get(COOKIE_DOMAIN, defaultValue);
  }

  getCookieData(label, defaultVal = null) {
    let cookieName = this.getCookieSessionName();

    // TO-DO: decrypt cookie data
    let data = this.getDecryptedCookie(cookieName);
    let retVal = null;
    if (label) {
      if (data && data[label]) retVal = data[label];
    } else retVal = data;
    return retVal ? retVal : data;
  }

  /**
   *
   * @param {string} name
   * @param {{}} data
   * @param {boolean=} encrypt
   * @param {boolean=} remember
   */
  setCookie(name, data, encrypt = true, remember = true) {
    let opts = {};
    if (encrypt === true) data = Util.EncryptJSON(data);

    if (remember === true) opts["expires"] = AppConsts.COOKIE_EXPIRE_DAYS;
    return Cookies.set(name, data, opts);
  }

  /**
   *
   * @param {string} name
   * @param {{}} data
   * @param {boolean=} remember
   */
  setEncryptedCookie(name, data, remember = true) {
    return this.setCookie(name, data, true, remember);
  }

  /**
   * Set cookie's hostname into "Set-Cookie" header and
   * as the "domain" attribute. This * is needed to allow
   * subdomains or variations including
   * TLD, www, etc.
   *
   * @return {string} hostname set into cookie entry in header
   */
  setCookieDomain() {
    let domainName = this.getCookieDomainName();
    if (domainName) Cookies.set("domain", domainName);
    return domainName;
  }

  /**
   *
   * @param {string} name
   * @param {boolean=} decrypt
   */
  getCookie(name, decrypt = true) {
    let edata = Cookies.getJSON(name);
    if (decrypt === true && edata != null) {
      edata = Util.DecryptJSON(edata);
    }
    return edata;
  }

  /**
   *
   * @param {string} name
   */
  getDecryptedCookie(name) {
    return this.getCookie(name, true);
  }

  /**
   * Return user token from the cookie
   *
   * @param {*} defaultVal
   *
   * @see ~setUserToken
   */
  _getCookieUserToken(defaultVal = null) {
    let v = this.getCookieData(Session.USER_TOKEN);
    return v ? v : defaultVal;
  }

  /**
   * Return the user token assigned after logging in.
   *
   * @param {*} defaultVal
   */
  getUserToken(defaultVal = null) {
    if (this.isGuestUser()) return XUserInfo.TOKEN_GUEST;

    return this.getUserInfo(Session.USER_TOKEN);
  }

  /**
   * Set a token associated with the user
   *
   * @param {string} token
   *
   * @see ~getCookieUserToken
   */
  setUserToken(token) {
    // let _m = "s.sutk";
    if (token == null) {
      return false;
    }
    return this.setUserInfo({[Session.USER_TOKEN]: token});
  }

  // getUser_SystemId() {
  //   return this.getUserInfo(USER_ID);
  // }
  getUserId() {
    // Currently, user ID is same as username. Use getUser_Systemid()
    return this.getUserInfo(USER_ID);
  }
  isGuestUser() {
    let username = this.getUserInfo(USER_NAME);
    return username === XUserInfo.USERNAME_GUEST;
  }
  isRobotUser() {
    let username = this.getUserInfo(USER_NAME);
    return username === XUserInfo.USERNAME_ROBOT;
  }

  /**
   * Return user's status
   *
   * @return {string} STATUS_NEW, STATUS_ACTIVE, or STATUS_SUSPENDED
   */
  getUserStatus(defaultVal = null) {
    if (defaultVal == null) defaultVal = UserProps.STATUS_UNVERIFIED;
    return this.getUserInfo(UserProps.STATUS, defaultVal);
  }

  /**
   * Update user's status
   *
   * @param {boolean} status
   * @return {boolean=} true if status changed, false if unchanged
   */
  updateUserStatus(status) {
    if (status == null) {
      console.error("setUVfd: ?");
      return false;
    }
    let curInfo = this.getUserInfo();
    let curStatus = XUserInfo.GetStatus(curInfo);
    if (curStatus === status) return false;
    XUserInfo.SetStatus(curInfo, status);
    return this.updateUserInfo(curInfo);
  }

  /**
   * Answers whether user is active.
   *
   * @return {boolean} true if active
   *
   * @see ~userIsUnverified
   * @see ~userIsSuspended
   */
  userIsActive() {
    return this.getUserStatus(null) === UserProps.STATUS_ACTIVE;
  }

  /**
   * Answers whether user is new / unverified.
   *
   * @return {boolean} true if active
   */
  userIsUnverified() {
    let status = this.getUserStatus();
    if (status === UserProps.STATUS_UNVERIFIED || status == null) return true;
    else return false;
  }

  /**
   * Answers whether user is suspended.
   *
   * @return {boolean} true if active
   *
   * @see ~userIsActive
   */
  userIsSuspended() {
    return this.getUserStatus(null) === UserProps.STATUS_SUSPENDED;
  }

  /**
   * Return username associated with this session.
   * If user is not logged in, USERNAME_GUEST is returned.
   *
   * @param {string} guestName optional guest username if no user logged in
   */
  getUsername(guestName = null) {
    let username = this.getUserInfo(USER_NAME);
    if (username == null) {
      // this.log("getUsername", "no username found!");
      username = this.getUserInfo(USER_ID);
      if (username == null)
        username = guestName ? guestName : XUserInfo.USERNAME_GUEST;
    }
    return username;
  }

  getOriginalUsername(fallback = true) {
    let username = this.getUserInfo(ORIG_USER_NAME);
    if (username == null && fallback) username = this.getUsername();
    return username;
  }

  /**
   * Return user avatar URL associated with this session.
   * If user is not logged in, USERNAME_GUEST is returned.
   *
   * @param {string} guestName optional guest username if no user logged in
   */
  getAvatarUrl(defaultVal = null) {
    let iconUrl = this.getUserInfo(UserProps.ICON_URL);
    if (iconUrl == null) {
      // this.log("getUsername", "no username found!");
      iconUrl = this.getUserInfo(UserProps.ICON_URL);
    }
    return iconUrl;
  }

  /**
   * Return the user's nickname associated with this session.
   *
   * @param {string} guestName optional guest nickname if no user logged in
   */
  getNickname(guestName = null) {
    let nickname = this.getUserInfo(USER_NICKNAME);
    if (nickname == null) {
      if (this.getUsername() === XUserInfo.USERNAME_GUEST)
        nickname = guestName ? guestName : XUserInfo.NICKNAME_GUEST;
    }
    return nickname;
  }
  getUserEmail() {
    return this.getUserInfo(USER_EMAIL);
  }

  /**
   * Clear tracking of user information, including removal
   * from cookie.
   *
   * @see #resetUserInfo
   * @see #setUserInfo
   * @see #getUserInfo
   */
  clearUserInfo() {
    // let _m = "s.cui";
    if (this.props[USER_INFO]) {
      // let username = this.getUsername();
      // this.log(_m, "user '", username, "' cleared.");
      delete this.props[USER_INFO];
    }
    let cookieName = this.getCookieSessionName();
    if (cookieName) {
      Cookies.remove(cookieName);
      // this.log(_m, "cookie removed.");
    }
  }

  /**
   * Reset is different than clear user info because
   * it actually replaces with guest information.
   *
   * @see #clearUserInfo
   * @see #setUserInfo
   * @see #getUserInfo
   */
  resetUserInfo() {
    this.clearUserInfo();

    // let guestInfo = {
    //     USER_NAME: USER_GUEST,
    //     USER_NICKNAME: "Guest",
    //     USER_EMAIL: "",
    //     USER_TOKEN: null
    // }
    // this.setUserInfo(guestInfo);

    return true;
  }

  /**
   * Track user information in the session, as well
   * as set into cookie. This is used when the
   * user info CHANGED in session, usually occurs
   * during login/logout. If just user info needs
   * updating, use #updateUserInfo()
   *
   * @param {{}} userInfo
   * @param {boolean=} remember true to set expiration, false means session cookie
   * @return {boolean} true if updated
   *
   * @see #updateUserInfo
   * @see #getUserInfo
   * @see #clearUserInfo
   */
  setUserInfo(userInfo, remember = true) {
    let _m = "setUserInfo";
    if (userInfo == null) {
      this.error(_m, "UserInfo NULL! Something is wrong.");
      return false;
    }
    // if (userInfo[USER_NAME] == null) {
    //   this.error(_m, "UserInfo CORRUPTED? Maybe not?");
    //   debugger;
    //   return false;
    // }
    this.props[USER_INFO] = userInfo;

    // let username = userInfo[USER_NAME];
    let cookieName = this.getCookieSessionName();

    // TODO: Need to store a token into cookie instead.
    if (userInfo && cookieName) {
      this.setEncryptedCookie(cookieName, userInfo, remember);
      this.setCookieDomain();
      // this.log(_m, "Setting Cookie: " + cookieName, "=", userInfo);
    }
    return true;
  }

  /**
   * Update user's information. This is used to update
   * user who's currently logged in. Stats are updated
   * separately with userStats
   *
   * @param {XUserInfo} userInfo (or JSON) label/value pairs to update. This can contain only
   * the fields that need to be updated, for as long as "replace" is false.
   * @param {boolean} replace true to replace entire record, but only if given record has username.
   * The default (false) is to copy individual fields
   * @param {boolean=} remember true to set expiration and persist. False store as session
   * @return {boolean} true if updated, false if the
   * condition does not permit update
   */
  updateUserInfo(userInfo, replace = false, remember = true) {
    let _m = "s.uui";
    userInfo = XUserInfo.Unwrap(userInfo);
    if (userInfo == null) {
      this.error(_m, "UserInfo NULL! Something is wrong.");
      return false;
    }

    if (replace && userInfo[USER_NAME] == null) {
      this.error(_m, "UserInfo CORRUPTED. Not tracking.");
      return false;
    }
    let prevUsername = userInfo[USER_NAME];
    if (prevUsername && prevUsername !== userInfo[USER_NAME]) {
      this.error(_m, "Cannot update info where username is different!");
      return false;
    }

    let fieldsUpdated = 0;
    let thisUserInfo = {...this.props[USER_INFO]};
    if (replace) {
      this.props[USER_INFO] = userInfo;
    } else {
      for (let label in userInfo) {
        if (
          userInfo[label] != null &&
          thisUserInfo &&
          thisUserInfo[label] !== userInfo[label]
        ) {
          // this.log(`${_m}: updated ${label} from ${thisUserInfo[label]} to ${userProps[label]}`);
          thisUserInfo[label] = userInfo[label];
          fieldsUpdated++;
        }
      }
    }

    // console.log(_m, "Updated User Info: ", this.props[USER_INFO]);

    // let username = userInfo[USER_NAME];
    let cookieName = this.getCookieSessionName();

    // TODO: Need to store a token into cookie instead.
    let updated = false;
    if (fieldsUpdated > 0 && cookieName) {
      this.setEncryptedCookie(cookieName, thisUserInfo, remember);
      updated = true;
      // this.log(_m, "Setting Cookie: " + cookieName, "=", userInfo);
    }
    return updated;
  } // updateUserInfo

  /**
   * Return entire UserInfo record, or a specific field if
   * property label is given.
   *
   * @param {string} label a field to retrieve within the userInfo object.
   * Null to return entire object
   * @param {*} defaultVal
   * @return {{}}
   *
   * @see ~getXUserInfo
   */
  getUserInfo(label = null, defaultVal = null) {
    // let _m = "getUserInfo";

    // for now, XUserInfo stores
    // if (label == USER_NAME)
    // label = USER_ID;

    let userInfo = this.props[USER_INFO];
    try {
      if (userInfo == null) {
        // ok... maybe user refreshed. Get from cookie
        userInfo = this.getDecryptedCookie(this.getCookieSessionName());
        // this.log(_m, "No userInfo in session! Retrieved from Cookie:", userInfo);
        if (userInfo) this.props[USER_INFO] = userInfo;
      }

      if (userInfo == null) return defaultVal;
      if (label == null) return userInfo;
    } catch (err) {
      console.log(err);
      this.clearUserInfo();
    }
    let value = userInfo ? userInfo[label] : null;
    return value ? value : defaultVal;
  }

  /**
   * Return UserInfo record wrapped by XUserInfo
   *
   * @return {XUserInfo}
   * @see Session~getUserInfo()
   */
  getXUserInfo() {
    let userInfo = this.getUserInfo();
    return userInfo ? XUserInfo.Wrap(userInfo) : null;
  }

  /**
   * Return entire UserInfo record, or a specific field if
   * property label is given.
   *
   * @param {string} label a field to retrieve within the userInfo object.
   * Null to return entire object
   *
   * @param {*} defaultVal
   * @return {{}}
   *
   * @see ~getXUserStats
   */
  getUserStats(defaultVal = null) {
    // let _m = "getUserStats";

    let userStats = this.props[USER_STATS];
    if (userStats == null) {
      this.warn("getUserStats", "no stats object in memory");
      return defaultVal;
    }
    // userStats = XUserStats.Wrap(userStats);
    return userStats;
  }

  /**
   * Return user stats as XUserStats type
   *
   * @param {*} defaultVal
   * @return {XUserStats}
   */
  getXUserStats(defaultVal = null) {
    let statObj = this.getUserStats(defaultVal);
    return statObj ? XUserStats.Wrap(statObj) : null;
  }

  /**
   *
   * @param {*} userStats
   */
  updateUserStats(userStats) {
    // debugger;
    this.props[USER_STATS] = userStats;
  }

  /**
   * Report whether a user is logged in in this session
   *
   * @return {boolean} treu if logged in
   */
  userLoggedIn() {
    let userInfo = this.getUserInfo();
    if (userInfo == null) return false;

    let username = XUserInfo.GetUsername(userInfo);
    if (username == null) {
      // this.warn("userLoggedIn", "username within userInfo is Null");
      return false;
    }
    if (typeof username != "string") {
      this.error("userLoggedIn", "user info is corrupted.");
      return false;
    }
    let isGuest = username === USER_GUEST;
    if (isGuest) return false;

    // check for user token
    let token = this.getUserToken();
    return token ? true : false;
  }

  userHasRole(roleType) {
    let userInfo = this.getUserInfo();
    if (userInfo == null) return false;
    let verdict = XUserInfo.HasRole(userInfo, roleType);
    return verdict;
  }

  userIsGod() {
    return this.userHasRole(XUserInfo.ROLE_ROOT);
  }

  userHasAdminRole() {
    if (this.userHasRole(XUserInfo.ROLE_ADMIN)) return true;
    return this.userIsGod();
  }

  userHasSysAdminRole() {
    if (this.userHasRole(XUserInfo.ROLE_SYSADM)) return true;
    return this.userIsGod();
  }

  userHasModeratorRole() {
    if (this.userHasRole(XUserInfo.ROLE_MODERATOR)) return true;
    return this.userHasAdminRole();
  }

  /**
   *
   * @param {string} featureId
   * @return {boolean}
   */
  userHasFeature(featureId) {
    let userInfo = this.getUserInfo();
    if (userInfo == null) return false;
    let verdict = XUserInfo.HasAppFeature(userInfo, featureId, true);

    return verdict;
  }

  /**
   *
   * @param {string} featureId
   * @return {boolean}
   */
  userHasFeatureDisabled(featureId) {
    let userInfo = this.getUserInfo();
    if (userInfo == null) return false;
    let verdict = XUserInfo.IsAppFeatureDisabled(userInfo, featureId);
    return verdict;
  }

  /**
   * @return {boolean}
   */
  userHasPreviewFeatures() {
    return this.userHasFeature(XUserInfo.FEATURE_PREVIEW);
  }

  // *************************************************************
  //
  // Class/static methods. This should also include any
  // methods that can be used as helper for generic
  // JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************

  static GetInstance() {
    return globalSession;
  }
}

export default Session;
