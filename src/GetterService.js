import ClientAppService from "./system/ClientAppService";

// Data Models
import XError from "./core/model/XError";
import XRequest from "./core/model/net/XRequest";
import XResponse from "./core/model/net/XResponse";
import XObject from "./core/model/XObject";
import XMObject from "./core/model/XMObject";
import XResultList from "./core/model/util/XResultList";
import XResultMap from "./core/model/util/XResultMap";
import XBinaryData from "./core/model/XBinaryData";
import {
  ModelType,
  MessageProps,
  UserProps,
  LanguageCodes,
  SocialProps,
  PREFIX_COMMENT_ID,
  TOPIC_CATEGORIES,
  FEATURE_LIKE,
  FEATURE_FOLLOW_USER,
  FEATURE_REPLY_POST,
  FEATURE_REPLY_COMMENT,
  FEATURE_REPOST,
  FEATURE_SUBMIT_POST,
} from "./core/model/ModelConsts";
import {XMFollows, XMFollowers} from "./core/model/social/XMFollow";
import Util from "./core/Util";
import axios from "axios";

import XMWatchesPost from "./core/model/post/XMWatchesPost";
import XMWatchedPost from "./core/model/post/XMWatchedPost";
import XPostFeed from "./core/model/activity/XPostFeed";
import XMPost from "./core/model/post/XMPost";
import {AppMessages, SupportedLanguageList} from "./app/AppMessages";
import XUserInfo from "./core/model/user/XUserInfo";
import XCommentFeed from "./core/model/post/XCommentFeed";
import XMComment from "./core/model/social/XMComment";
import API from "./core/API";
import ErrorCodes from "./core/ErrorCodes";
import {fileToMd5} from "src/util/file";

// These are classes that we have instances but not direct type
// reference. They are good for IDE/JSDoc and these are used to eliminate
// the complaints
XError.CheckIn();
XResponse.CheckIn();
XRequest.CheckIn();
XBinaryData.CheckIn();
XResultList.CheckIn();
XResultMap.CheckIn();

XPostFeed.CheckIn();
XMPost.CheckIn();

// import numeral from 'numeral';

const _CLSNAME = "GetterService";

/**
 * Application context / helper (controller, api requestor)
 * for the web app.
 *
 * There should be one instance per app type per user. With
 * SSR configuration, there will be one instance in the browser code,
 * and one on the server side.
 */
export class GetterService extends ClientAppService {
  /**
   *
   * @constructor
   * @param {object} props outside (configuration) properties to use
   */
  constructor(props) {
    super(_CLSNAME, props);

    this.applyConfig(this.props);
  }

  applyConfig(props) {
    // const _m = "applyConfig";
    super.applyConfig(props);

    // let isBrowser = Global.IsBrowser();
    // this.log("applyConfig", "parameters: ", props);

    this.urlPrefix = props.urlPrefix ? props.urlPrefix : "/";
    this.appUrl = props.appUrl ? props.appUrl : null;
    this.appPrefix = this.appUrl ? this.appUrl + "/" : null;

    // this.trace(_m, `**** APP URL: ${this.appUrl} Is Browser: ${isBrowser} ****`);

    this.urlHost = props.apiHost ? props.apiHost : "http://255.255.255.255:999";

    this.title = props.title ? props.title : "Untitled App";

    this.urlTagInfo = this.getURL(this.urlHost, "/s/taginfo");
    this.urlActivityLog = this.getURL(this.urlHost, "/log/activity/");
    this.urlLogMessage = this.getURL(this.urlHost, "/log/msg");
  }

  /**
   * Initializer user info. This is called by Portal upon login.
   */
  initUser(userInfo) {
    // re-intialize analytics tracking
    this._trackingUser();
  }

  assertXMObject(value) {
    return this.assertType(value, XMObject);
  }

  /**
   * Reset user information. This is called by Portal upon logout.
   */
  resetUser() {
    // clear session?
  }

  /**
   * Return the application's official URL, as set in the environment
   * variable *_APP_URL. This is optional and only used for user click
   * backs.
   *
   * @param {*} defaultVal
   * @return {string=} application's url with protocol and port
   */
  getAppUrl(defaultVal = null) {
    return this.appUrl ? this.appUrl : defaultVal;
  }

  /**
   * Return the SPA's url prefix.
   */
  getUrlPrefix() {
    return this.urlPrefix;
  }

  /**
   * Prefix of this web application's URL, or a
   * complete URL if given path
   *
   * @param {string} path path to add to prefix
   * @return {string} either prefix, or complete URL if given path
   */
  getAppPrefix(path) {
    return path ? this.urlPrefix + path : this.urlPrefix;
  }

  /**
   * Prefix of this app's service URL to make API calls.
   *
   * @param {string} path path to add to prefix
   * @return {string} either prefix, or complete URL if given path
   */
  getServicePrefix(path) {
    return path ? new URL(path, this.urlHost).toString() : this.urlHost;
  }

  /**
   *
   * @param {string} phrase search phrase
   */
  getUrlSearchResults(phrase) {
    let url = this.getAppPrefix("search");
    if (!Util.StringIsEmpty(url)) url += `?q=` + encodeURIComponent(phrase);
    return url;
  }

  getUrlHashtagPage(hashtag) {
    if (hashtag[0] !== "#") {
      hashtag = "/hashtag/" + encodeURIComponent("#" + hashtag);
    } else {
      hashtag = "/hashtag/" + encodeURIComponent(hashtag);
    }
    return hashtag;
  }

  getUrlUsertagPage(userId) {
    if (userId[0] === "@") userId = userId.substring(1);
    return `/user/${userId}`;
  }

  getUrlPostPage(postId) {
    return this.getAppPrefix(`post/${postId}`);
  }

  getUrlCommentPage(commentId) {
    return this.getAppPrefix(`comment/${commentId}`);
  }

  getUrlUserProfilePage(username) {
    return this.getAppPrefix(`user/${username}`);
  }

  getUrlNotificationsAll() {
    return this.getAppPrefix(`notifications`);
  }

  getUrlNotificationsMentions() {
    return this.getAppPrefix(`notifications/mentions`);
  }

  /**
   * Explore URL: /explore or /explore/topic/:topic
   *
   * @param {string} topic topic to get results from server
   */
  getUrlExplore(topic) {
    let url = Util.StringIsEmpty(topic) ? "explore" : "explore/topic/" + topic;
    return this.getAppPrefix(url);
  }

  getUrlHome() {
    return this.getAppPrefix("");
  }

  getUrlLogin() {
    return this.getAppPrefix("login");
  }

  getUrlLogout() {
    return this.getAppPrefix("logout");
  }

  getUrlSignup() {
    return this.getAppPrefix("signup");
  }

  getUrlDashboard() {
    return this.getAppPrefix("");
  }

  getUrlWelcome() {
    return this.getAppPrefix("welcome");
  }

  getUrlNotFound() {
    return this.getAppPrefix("notfound");
  }

  // ----------------------- API URL Constructions ------------------------------

  /**
   * Construct API endpoint url for retrieving stats on an object
   *
   * @param {string} type object type. This may not match ModelType constants,
   * so best to look up the endpoint. For example, ModelType.COMMENT is "cm"
   * while the endpoint uses "comment" as in /u/comment/:commentId/...
   * @param {string[]} objectId
   * @param {boolean} inclObj true to also fetch and return the XObject instance
   * @return {string} derived URL
   */
  apiGetObjectStats(type, objectId, inclObj = false) {
    if (!objectId) {
      this.error("apiGetObjectStats", "no tagnames given");
      return;
    }

    let query = this.getURL(this.urlHost, `/s/${type}/${objectId}/stats/`);
    if (inclObj === true) query += `?${API.INCL_OBJ}=true`;

    return query;
  }

  /**
   * Construct API URL for GetUserSettings
   *
   * @param {string[]} userId in array or delimited by comma
   * @param {string[]} props field names in array or delimited by comma
   */
  apiGetUserSettings(userId, section, props = null) {
    if (!userId || !section) {
      console.error("apiGUS: ?null");
      return;
    }

    if (props != null) props = Array.isArray(props) ? props.join(",") : props;
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/settings/${section}`,
    );
    if (props) query += "?props=" + JSON.stringify(props);

    return query;
  }

  // ------------------------- LANGUAGE SUPPORT --------------------------

  getSupportedLanguageCodes() {
    return [LanguageCodes.ENGLISH, LanguageCodes.CHINESE_SIMPLIFIED];
  }

  /**
   * Return entire language list of supported languages, or just the
   * record of the desired language code
   *
   * @param {string} langCode
   * @param {string=} defaultVal optional backup language. Default will be English
   * @return {object[]} either full language map keyed off code, or the record
   * for the given code
   */
  getSupportedLanguageList(langCode = null, defaultVal = null) {
    let langList = SupportedLanguageList;
    let result;
    if (langCode) {
      result = Util.GetObjectFromArrayByValue(langList, "code", langCode);
      if (result == null) {
        if (defaultVal == null) defaultVal = LanguageCodes.ENGLISH;
        result = Util.GetObjectFromArrayByValue(langList, "code", defaultVal);
      }
    } else result = langList;
    return result;
  }

  /**
   * Return current locale (language + country)
   *
   * @param {*} defaultVal
   * @return {string} "en" for now
   */
  getLanguagePref(defaultVal = "en") {
    let lang = this.getSessionVar(UserProps.LANGUAGE, null);
    if (lang == null) {
      let xUserInfo = this.getXUserInfo();
      lang = xUserInfo ? xUserInfo.getLanguagePref(defaultVal) : defaultVal;
    }
    return lang;
  }

  /**
   *
   * @param {string} langCode language code
   * @return {boolean} true if set, false if something happened
   */
  setLanguagePref(langCode, sessionOnly = true) {
    if (langCode == null) return false;
    let prevCode = this.setSessionVar(UserProps.LANGUAGE, langCode);
    if (prevCode !== langCode) {
      let xUserInfo = new XUserInfo();
      xUserInfo.setLanguagePref(langCode);
      this.updateUserInfo(xUserInfo);
    }
    return true;
  }

  // ------------------------- NOTIFICATION -----------------------------

  /**
   * Construct API URL for user alert count (/u/user/:userId/count/alerts/:targetId)
   *
   * @param {string} userId user of the alerts (logged in currently)
   * @param {string} field field to retrieve (default is unread)
   * @return {string} fully qualified URL
   */
  apiUserAlertCount(userId, field = "unread", props = null) {
    if (!userId) {
      this.error("apiUserAlertCount", "no userId or targetId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/count/alerts/${field}`,
    );
    if (props) query += "&props=" + JSON.stringify(props);

    return query;
  } // apiUserAlertCount

  /**
   * Construct API URL for user alerts (/uuser/:userId/alerts
   *
   * @param {string} userId user for alerts (logged in currently)
   * @param {string} field field to retrieve (default is unread)
   * @param {number} max maximum number of alerts to retrieve
   * @return {string} fully qualified URL
   */
  apiUserAlerts(userId, field = "", max = 20, props = null) {
    if (!userId) {
      this.error("apiUserAlert", "no userId or targetId given");
      return false;
    }

    if (props == null) props = {};
    props[API.BATCH_SIZE] = max;

    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/alerts/${field}`);
    if (props) query += "?props=" + JSON.stringify(props);

    return query;
  } // apiUserAlerts

  /**
   * Construct API URL for user alerts status (/u/user/:userId/alerts/status/)
   *
   * @param {string} userId alerts for user (logged in currently)
   * @param {string[]} alertIds array if Ids to check/get. Note this
   * is mostly likely in the body using POST
   * @return {string} fully qualified URL
   */
  apiUserAlertsStatus(userId, alertIds = null) {
    if (!userId) {
      return false;
    }
    let idString = alertIds ? alertIds.join(",") : null;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/alerts/status/`);
    if (idString) query += "?ids=" + idString;

    return query;
  } // apiUserAlertsStats

  /**
   * Construct API URL for confirmation by Id
   *
   * @param {string} confirmId alerts for user (logged in currently)
   * @param {string} sourceId array if Ids to check/get. Note this
   * is mostly likely in the body using POST
   * @return {string} fully qualified URL
   */
  apiConfirmById(confirmId, sourceId) {
    if (!confirmId) {
      this.error("apiCBI");
      return false;
    }
    let query = this.getURL(this.urlHost, `/s/confirm/${confirmId}`);
    if (sourceId) query = `${query}/src/${sourceId}`;

    return query;
  } // apiConfirmById

  // ---------------------------- FEED -----------------------------------

  /**
   * Add parameters to given URL related to batch fetching.
   *
   * @param {string} url
   * @param {number} offset if null then set to zero
   * @param {number} max maximum to return in this batch size
   * @param {number} startTime point in time as starting point for fetch in either direction
   * @param {string} direction fetch direction. Either API.DIRECTION_FORWARD or API.DIRECTION_BACKWARD
   * @param {string=} starter default to '?' and assume no other params already (dumb, I know)
   */
  appendFetchParams(
    url,
    offset,
    max,
    startTime,
    direction,
    starter,
    isComment = false,
  ) {
    if (offset == null) offset = 0;

    if (starter == null) starter = "?";
    url += `?${API.OFFSET}=${offset}`;
    if (max) url += `&${API.BATCH_SIZE}=${max}`;
    if (startTime) url += `&${API.START_TS}=${startTime}`;
    if (direction) url += `&${API.DIRECTION}=${direction}`;
    url += `&incl=posts|stats|userinfo|shared|liked`;
    return url;
  }

  // ------------------------ FOLLOW API URL -----------------------------

  /**
   * Construct API URL for user follows (/u/:userId/follows/:targetId)
   *
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiAddFollows(userId, targetId, props = null) {
    if (!targetId) {
      this.error("apiAddFollows", "no userId or targetId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/follows/${targetId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // addFollows

  /**
   * Construct API URL for user follows (/u/:userId/follows/:targetId)
   *
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUserFollowStatus(userId, targetId, props = null) {
    if (!targetId || !userId) {
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/follows/${targetId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiGetUserFollowStatus

  /**
   * Construct API URL for user followers (/u/:userId/follows/:targetId)
   *
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUserFollowerStatus(userId, followerId, props = null) {
    if (!userId && !followerId) {
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${followerId}/follows/${userId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiGetUserFollowStatus

  /**
   * Construct API URL for retrieving follows (/u/:userId/follows/)
   *
   * @param {string} userId ID of users follows currently logged in
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetFollows(userId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/followings/`);
    if (props) query += "&props=" + props;

    return query;
  } // getFollows

  /**
   * Construct API URL for retrieving follows (/u/:userId/followers/)
   *
   * @param {string} userId ID to retrieve followers for
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetFollowers(userId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/followers/`);
    if (props) query += "&props=" + props;

    return query;
  } // getFollows

  /**
   * Construct API URL for user follows (/u/:userId/follows/:targetId)
   *
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   *
   * @see #apiAddFollows
   * @see #apiGetFollows
   * @see #apiRemoveFollows
   */
  apiRemoveFollows(userId, targetId, props = null) {
    if (!targetId) {
      this.error("apiRemoveFollows", "no userId or targetId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/unfollows/${targetId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiRemoveFollows

  /**
   * Construct API URL for user follows (/u/:userId/blocks/:targetId)
   *
   * @param {string} userId ID to block follower user (logged in currently)
   * @param {string} followerId follower to block
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiBlockFollower(userId, followerId, props = null) {
    if (!followerId) {
      this.error("apiBlockFollower", "no userId or followerId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/blocks/${followerId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiBlockFollower

  /**
   * Construct API URL for user follows (/u/:userId/unblocks/:targetId)
   *
   * @param {string} userId ID to block follower user (logged in currently)
   * @param {string} followerId follower to block
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUnblockFollower(userId, followerId, props = null) {
    if (!followerId) {
      this.error("apiUnblockFollower", "no userId or followerId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/unblocks/${followerId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiUnblockFollower

  /**
   * Construct API URL to mute (/u/:userId/mutes/:targetId)
   *
   * @param {string} userId ID to mute user (logged in currently)
   * @param {string} followerId user to mute
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiMuteFollower(userId, followerId, props = null) {
    if (!followerId) {
      this.error("apiMuteFollower", "no userId or followerId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/mutes/${followerId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiMuteFollower

  /**
   * Construct API URL to unmute (/u/:userId/unmutes/:targetId)
   *
   * @param {string} userId ID to unmute user (logged in currently)
   * @param {string} followerId user to unmute
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUnmuteFollower(userId, followerId, props = null) {
    if (!followerId) {
      this.error("apiUnmuteFollower", "no userId or followerId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/unmutes/${followerId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiUnmuteFollower

  // ------------------------ LIKE OBJECT API URL -----------------------------

  /**
   * Construct API URL for user like (/u/user/:userId/likes/{type}/:objectId)
   *
   *
   * @param {string} userId
   * @param {string} type object type (see ModelType)
   * @param {string} objectId
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiAddLikeObject(userId, type, objectId, props = null) {
    if (!objectId) {
      this.error("apiAddLikeObj", "no userId or objectId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/likes/${type}/${objectId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiAddLikeObject

  /**
   * Construct API URL for user likes (/u/user/:userId/likes/{type}/:objectId)
   *e
   * @param {string} userId ID of liking user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUserLikeObjectStatus(userId, type, objectId, props = null) {
    if (!objectId || !userId) {
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/likes/${type}/${objectId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiGetUserLikeObjectStatus

  /**
   * Construct API URL for retrieving follows (/u/:userId/likes/rl)
   *
   * @param {string} userId ID of users follows currently logged in
   * @param {string} type object type (see ModelType)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetLikesObject(userId, type, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/likes/${type}/`);
    if (props) query += "&props=" + props;

    return query;
  } // apiGetLikesObject

  /**
   * Construct API URL for retrieving follows (/u/:type/:objectId/liked/)
   *
   * @param {string} type object type (see ModelType)
   * @param {string} objectId ID to retrieve likes for
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetLikedObject(type, objectId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/${type}/${objectId}/liked/`);
    if (props) query += "&props=" + props;

    return query;
  } // apiGetLikedPost

  /**
   * Construct API URL for user follows (/u/:userId/unlike/:type/:objectId)
   *
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   *
   * @see #apiAddLikesRL
   * @see #apiGetLikesRL
   */
  apiRemoveLikeObject(userId, type, objectId, props = null) {
    if (!objectId) {
      this.error("apiRmLikeObject", "no userId or objectId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/unlike/${type}/${objectId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiRemoveLikeObject

  // ------------------------ LIKE POST API URL -----------------------------

  /**
   * Construct API URL for user follows (/u/user/:userId/likes/rl/:postId)
   *
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiAddLikePost(userId, postId, props = null) {
    return this.apiAddLikeObject(userId, ModelType.POST, postId, props);
    // if (!postId) {
    //   this.error("apiAddLikePost", "no userId or postId given");
    //   return false;
    // }
    // props = Array.isArray(props) ? props.join(",") : props;

    // let query = this.getURL( this.urlHost, `/u/user/${userId}/likes/post/${postId}`);
    // if (props) query += "&props=" + props;

    // return query;
  } // apiAddLikePost

  /**
   * Construct API URL for user likes (/u/user/:userId/likes/post/:postId)
   *
   * @param {string} userId ID of liking user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUserLikePostStatus(userId, postId, props = null) {
    if (!postId || !userId) {
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/likes/post/${postId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiGetUserLikePostStatus

  /**
   * Construct API URL for retrieving follows (/u/:userId/likes/post)
   *
   * @param {string} userId ID of users follows currently logged in
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetLikesPost(userId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/likes/post/`);
    if (props) query += "&props=" + props;

    return query;
  } // apiGetLikesPost

  /**
   * Construct API URL for retrieving follows (/u/:userId/followers/)
   *
   * @param {string} postId ID to retrieve post
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetLikedPost(postId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/post/${postId}/liked/`);
    if (props) query += "&props=" + props;

    return query;
  } // apiGetLikedRL

  /**
   * Construct API URL for user follows (/u/:userId/unlike/rl/:postId)
   *
   * @param {string} userId ID doing the like removal
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   *
   * @see #apiAddLikesPost
   * @see #apiGetLikesPost
   */
  apiRemoveLikePost(userId, postId, props = null) {
    if (!postId) {
      this.error("apiRemoveLikePost", "no userId or post given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/unlike/post/${postId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiRemoveLikePost

  // ------------------------- SHARE API -------------------------------

  /**
   * Construct API URL for user shares (/u/user/:userId/likes/:type/:objectId)
   *
   * @param {string} userId ID of sharing user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUserShareObjectStatus(userId, type, objectId, props = null) {
    if (!objectId || !userId) {
      return false;
    }
    if (type == null) {
      this.error("apiGetUserShareStatus", "null type");
      this.trace();
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/shares/${type}/${objectId}`, // deprecated - remove in 2021
      // `/u/user/${userId}/shares/${type}/${objectId}`,  // use this in 2021
    );
    if (props) query += "&props=" + props;

    return query;
  } // apiGetUserShareObjectStatus

  /**
   *
   * @param {XMObject} xmObject
   *
   * @return {boolean}
   */
  userCanShare(xmObject) {
    // let userId = this.getUserId();

    if (xmObject.hasACL() === false) return true;

    return true;
  }

  // ------------------------- USER SHARE SERVICES ------------------------------

  /**
   * Submit sharing of a post. "Sharing" in this csae is basically
   * a "repost" without any added content. This mean it is
   * literally a share. Standard POST is used.
   *
   * For reposting with user's own content, use userRepost()
   *
   * @param {string} postId post to share by logged in user
   * @param {string} text additional text from reposter
   *
   * @return {string} updated share status "y" or "n"
   *
   * @see ~SubmitRepost
   */
  async userSharesPost(postId, text, callback) {
    const _m = "userSharesPost";

    let loggedInUserId = this.getUserId();
    let shareStatus;
    let error = null;
    try {
      let getUrl = this.getURL(
        this.urlHost,
        `/u/user/${loggedInUserId}/shares/post/${postId}`,
      );
      let content = {
        text: text,
      };
      shareStatus = await this.requestPOST(getUrl, content);
    } catch (e) {
      this.error(_m, e);
      error = e;
      shareStatus = null;
    }

    return callback ? callback(error, shareStatus) : shareStatus;
  } // userSharesPost

  /**
   * remove shares.
   *
   *
   * @param {string} postId  postItem id
   *
   * @return {string} updated share status "y" or "n"
   *
   * @see ~SubmitRepost
   */
  async userUnshares(postId, action, callback) {
    const _m = "userUnsharesPost";

    let loggedInUserId = this.getUserId();
    let unshareStatus;
    let error = null;
    try {
      let getUrl = this.getURL(
        this.urlHost,
        `/u/user/${loggedInUserId}/shares/${
          action === "p" ? "post" : "comment"
        }/${postId}`,
      );
      unshareStatus = await this.requestDELETE(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      unshareStatus = null;
    }

    return callback ? callback(error, unshareStatus) : unshareStatus;
  } // userUnshares

  /**
   * Submit sharing of a comment. "Sharing" in this csae is basically
   * a "repost" without any added content. This mean it is
   * literally a share. Standard POST is used.
   *
   * For reposting with user's own content, use submitRepost()
   *
   * @param {string} commentId post to share by logged in user
   * @param {string} text additional text from reposter
   *
   * @return {string} updated share status "y" or "n"
   *
   * @see ~SubmitRepost
   */
  async userSharesComment(commentId, callback) {
    const _m = "userSharesComment";

    let loggedInUserId = this.getUserId();
    let shareStatus;
    let error = null;
    try {
      let getUrl = this.getURL(
        this.urlHost,
        `/u/user/${loggedInUserId}/shares/comment/${commentId}`,
      );
      let content = null;
      shareStatus = await this.requestPOST(getUrl, content);
    } catch (e) {
      this.error(_m, e);
      error = e;
      shareStatus = null;
    }

    return callback ? callback(error, shareStatus) : shareStatus;
  } // userSharesComment

  /**
   * Retrieve answer to whether the logged in user is sharing post
   *
   * @param {string[]} postId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {string} "y" or "no"
   */
  async userSharePostStatus(postId, props = null, callback) {
    const _m = "userSharePostStatus";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!postId || !userId) {
      return "no";
    }
    try {
      let url = this.apiUserShareObjectStatus(userId, "post", postId, props);
      statusValue = await this.requestGET(url, null);
    } catch (e) {
      this.error(_m, "server returned error:", e);
      error = e;
      statusValue = null;
    }
    return callback ? callback(error, statusValue) : statusValue;
  } // userSharePostStatus

  /**
   * Retrieve answer to whether the logged in user is sharing post
   *
   * @param {string[]} commentId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {string} "y" or "no"
   */
  async userShareCommentStatus(commentId, props = null, callback) {
    const _m = "userShareCommentStatus";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!commentId || !userId) {
      return "no";
    }
    try {
      let url = this.apiUserShareObjectStatus(
        userId,
        "comment",
        commentId,
        props,
      );
      statusValue = await this.requestGET(url, null);
    } catch (e) {
      this.error(_m, "server returned error:", e);
      error = e;
      statusValue = null;
    }
    return callback ? callback(error, statusValue) : statusValue;
  } // userShareCommentStatus

  // ------------------------ WATCH OBJECT API URLs -----------------------------

  /**
   * Construct API URL for user watching an object. The URL for this
   * API should be (POST): /u/user/:userId/watch/{type}/:objId
   *
   * @param {string} type object's type name (tag, rl, etc)
   * @param {string} userId ID of following user (logged in currently)
   * @param {string} objectId ID of object to watch
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiAddWatchObject(type, userId, objectId, props = null) {
    if (!objectId && !objectId) {
      this.error("apiAddWatchObj", "no userId or objId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/watch/${type}/${objectId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  }

  /**
   * Construct API URL for status of the object the user may be watching. The
   * URL for this API should be (GET): /u/user/:userId/watch/{type}/:objId
   *
   * @param {string} type object's type name (tag, rl, etc)
   * @param {string} userId ID of the user
   * @param {string} objectId ID of the object watched
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiUserWatchObjectStatus(type, userId, objectId, props = null) {
    if (!objectId || !type || !userId) {
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/watch/${type}/${objectId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  }

  /**
   * Construct API URL for retrieving follows (/u/:userId/watch/rl)
   *
   * @param {string} userId ID of users follows currently logged in
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetWatchesObject(type, userId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/user/${userId}/watch/${type}/`);
    if (props) query += "&props=" + props;

    return query;
  }

  /**
   * Construct API URL for retrieving watchers (/u/:type/:objectId/watched/)
   *
   * @param {string} type object's type name (tag, rl, etc)
   * @param {string} objectId ID to retrieve followers for
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   */
  apiGetObjectWatchers(type, objectId, props = null) {
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(this.urlHost, `/u/${type}/${objectId}/watched/`);
    if (props) query += "&props=" + props;

    return query;
  }

  /**
   * Construct API URL for user follows (/u/:userId/unlike/:type/:objectId)
   *
   * @param {string} type object's type name (tag, rl, etc)
   * @param {string} userId ID of following user (logged in currently)
   * @param {string[]} props field names in array or delimited by comma
   * @return {string} fully qualified URL
   *
   */
  apiRemoveWatchObject(type, userId, objectId, props = null) {
    if (!objectId) {
      this.error("apiRmWatchObject", "no userId or objectId given");
      return false;
    }
    props = Array.isArray(props) ? props.join(",") : props;

    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/unwatch/${type}/${objectId}`,
    );
    if (props) query += "&props=" + props;

    return query;
  }

  // -------------------------- Privilege Check ---------------------------

  userIsGod() {
    return this.portal.userIsGod();
  }

  /**
   * @return {boolean}
   */
  userHasAdminRole() {
    return this.portal.userHasAdminRole();
  }

  /**
   * @return {boolean}
   */
  userHasSysAdminRole() {
    return this.portal.userHasSysAdminRole();
  }

  userHasModeratorRole() {
    return this.portal.userHasModeratorRole();
  }

  /**
   * Not Used
   *
   * @return {boolean}
   */
  userHasPreviewFeatures() {
    return this.portal.userHasPreviewFeatures();
  }

  /**
   * @deprecated
   *
   * @return {boolean}
   */
  userHasSocialFeatures() {
    return true;
  }

  /**
   * @return {boolean}
   */
  userHasFeature(featureId) {
    return this.getSession().userHasFeature(featureId);
  }

  /**
   * @return {boolean}
   */
  userHasFeatureDisabled(featureId) {
    return this.getSession().userHasFeatureDisabled(featureId);
  }

  /**
   * @return {boolean}
   */
  userCanFollow() {
    return this.userHasFeature(FEATURE_FOLLOW_USER);
  }

  /**
   * @return {boolean}
   */
  userCanPost() {
    return this.userHasFeature(FEATURE_SUBMIT_POST);
  }

  /**
   * @return {boolean}
   */
  userCanRepost() {
    return this.userHasFeature(FEATURE_REPOST);
  }

  /**
   * @return {boolean}
   */
  userCanReplyPost() {
    return this.userHasFeature(FEATURE_REPLY_POST);
  }

  /**
   * @return {boolean}
   */
  userCanReplyComment() {
    return this.userHasFeature(FEATURE_REPLY_COMMENT);
  }

  /**
   * @return {boolean}
   */
  userCanLike() {
    return this.userHasFeature(FEATURE_LIKE);
  }

  /**
   * Determine if the given resource can be edited
   * by current logged in user.
   *
   * @param {XMObject} instance of XMObject subclass
   *
   * @return {boolean}
   */
  canEditResource(xmObject) {
    let isOwner = this.userIsOwner(xmObject);
    if (isOwner) return true;

    if (this.userHasModeratorRole()) return true;

    // ACL check - Future/TBD

    return false;
  } // canEditResource

  canShareResource(xmObject) {
    return true;
  }

  canDeleteResource(xmObject) {
    return this.canEditResource(xmObject);
  }

  canSubmitPost() {
    return this.userHasFeature(FEATURE_SUBMIT_POST);
  }

  // --------------------------------------------------------------------------

  /**
   * Determine if the given object's owner is the
   * logged in user.
   *
   * @param {XMObject} xmObject
   *
   * @return {booleaan}
   */
  userIsOwner(xmObject) {
    let loggedInUserId = this.getUserId();
    if (loggedInUserId == null) return false;

    let objectOwnerId = xmObject.getOwnerId();

    // simple check for now
    return loggedInUserId === objectOwnerId;
  } // userIsOwner

  trackContainer(container) {
    this.appContainer = container;
  }

  async refreshContainer() {
    if (this.appContainer) this.appContainer.refreshView(true);
  }

  /**
   * Retrieve stats on an object
   *
   * @param {string} type object type
   * @param {string[]} objectId
   * @param {boolean} inclObj also return the XObject for which the stats are for
   *
   * @return {XObjectStat, [XObject, XObjectStat]}
   */
  async fetchObjectStats(type, objectId, inclObj = false, callback) {
    const _m = "fetchObjectStatus";

    let result;
    let error = null;
    try {
      let apiUrl = this.apiGetObjectStats(type, objectId, inclObj);
      result = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }
    return callback ? callback(error, result) : result;
  } // fetchObjectStats

  // ----------------------- USER NEWS FEED --------------------------------

  /**
   * Fetch user timline using /u/user/:userId/timeline. Timeline includes
   * all user followings posts.
   *
   * @param {string} userId which user to retrieve posts for?
   * @param {number} offset offset into start position of the expected query
   * @param {number} size batch size
   * @param {number} startTS timestamp where the posts streaming should start
   * @callback (err, PostList)
   * @return {PostList}
   */
  async fetchUserTimeline(
    userId,
    offset = null,
    size = null,
    startTS,
    direction,
    callback,
  ) {
    let _m = `getUserTimeline(${userId})`;
    this.log(_m, `Fetching: offset=${offset}, max=${size}`);
    let err = null;
    let feedList;
    try {
      let url = this.getURL(this.urlHost, `/u/user/${userId}/timeline`);
      url = this.appendFetchParams(url, offset, size, startTS, direction);
      let result = await this.requestGET(url, null);
      feedList = XPostFeed.Wrap(result);
    } catch (e) {
      this.log(_m, e);
      if (callback == null) throw e;
    }

    return callback ? callback(err, feedList) : feedList;
  } // fetchUserTimeline

  async fetchUserPostsFeed(userId, offset, size, startTS, direction, callback) {
    return this.fetchUserTimeline(
      userId,
      offset,
      size,
      startTS,
      direction,
      callback,
    );
  }

  /**
   * Fetch user posts /u/user/:userId/posts. This
   * must be called on behalf of the user request (therefore /u).
   *
   * @param {string} userId which user to retrieve posts for?
   * @param {number} offset offset into start position of the expected query
   * @param {number} size batch size
   * @param {number} startTS timestamp where the posts streaming should start
   * @callback (err, PostList)
   * @return {PostList}
   */
  async fetchUserPosts(
    userId,
    offset = null,
    size = null,
    startTS,
    direction,
    callback,
    options = null,
    medias = null,
  ) {
    let _m = `getUserPosts(${userId})`;
    this.log(_m, `Fetching: offset=${offset}, max=${size}`);
    let err = null;
    let feedList;
    try {
      let url = this.getURL(this.urlHost, `/u/user/${userId}/posts`);
      url = this.appendFetchParams(
        url,
        offset,
        size,
        startTS,
        direction,
        null,
        options === "c" || options === "l" ? true : false,
      );
      let result = await this.requestGET(
        url +
          (medias ? "&fp=f_um" : "&fp=f_u") +
          (options ? options : medias ? "" : "o"),
        null,
      );
      feedList = XPostFeed.Wrap(result);
    } catch (e) {
      this.log(_m, e);
      if (callback == null) throw e;
    }

    return callback ? callback(err, feedList) : feedList;
  } // fetchUserPostFeed

  async getSearchByPhrase(phrase, offset, max, callback) {
    let _m = `getSearchByPhrase(${phrase})`;
    let err = null;
    let feedList;

    try {
      let encodedPhrase = "#" + phrase.slice(3);
      let url = this.getURL(this.urlHost, `/u/posts/srch/phrase`);
      let result = await this.requestPOST(url, {
        q: encodedPhrase,
        offset,
        max,
      });
      feedList = XPostFeed.Wrap(result);
    } catch (e) {
      this.log(_m, e);
      if (callback === null) throw e;
    }
    return callback ? callback(err, feedList) : feedList;
  }

  async getTopSearchResult(phrase, offset, max, callback) {
    let _m = `getSearchByPhrase(${phrase})`;

    let feedList;
    let err;

    try {
      let url = this.getURL(this.urlHost, `/u/posts/srch/phrase`);
      let result = await this.requestPOST(url, {
        q: phrase,
        offset,
        max,
      });

      feedList = XPostFeed.Wrap(result);
    } catch (e) {
      err = e;
      this.log(_m, e);
      if (callback === null) throw e;
    }
    return callback ? callback(feedList || err) : feedList || err;
  }

  /**
   * Execute search of posts by phrase and return a batch of posts using the
   * feed format.
   *
   * @param {string} phrase a string that user typed
   * @param {number} offset offset into start position of the expected query
   * @param {number} size batch size
   * @param {number} startTS timestamp where the posts streaming should start
   * @param {function} callback
   * @return {XPostFeed} collection of XPostItems, which wrap
   */
  async getSearchPostsFeed(
    phrase,
    offset = null,
    size = null,
    startTS,
    direction,
    callback,
  ) {
    let _m = "";
    // this.log(_m, `Fetching for userId: ${userId}`);
    let err = null;
    let url = this.getURL(this.urlHost, `/u/posts/srch/phrase`); // @depcrecated
    // let url = this.getURL(this.urlHost, `/u/posts/srch/phrase`); // to use with 12/3/2020 checkin but need to be pushed to cloud

    url = this.appendFetchParams(url, offset, size, startTS, direction);
    let params = {
      q: phrase,
    };
    let feedList;
    try {
      let result = await this.requestPOST(url, params);
      feedList = XPostFeed.Wrap(result);
    } catch (e) {
      this.log(_m, e);
      throw e;
    }

    return callback ? callback(err, feedList) : feedList;
  } // getSearchPostsFeed

  /**
   * Return a feed of posts that system identify as trendy / news. This
   * is more suitable as a home page.
   *
   * @param {string} topics
   * @param {number} offset
   * @param {number} size
   * @callback
   * @return {XPostFeed}
   */
  async getTrendsPostsFeed(
    topics,
    offset = null,
    size = null,
    startTs,
    lang,
    callback = null,
  ) {
    if (!lang) lang = "en";
    const _m = "gTPF";
    let err;
    let url = this.getURL(this.urlHost, `/u/posts/trends`);
    url = this.appendFetchParams(url, offset, size, startTs);
    if (lang) url += `&${API.FILTER_LANGUAGE_PREF}=${lang}`;
    let params = topics
      ? {
          [API.FILTER_LANGUAGE_PREF]: topics,
          [API.FILTER_TOPICS]: lang,
        }
      : null;
    let feedList;
    try {
      let result = await this.requestGET(url, params);
      feedList = XPostFeed.Wrap(result);
    } catch (e) {
      this.log(_m, e);
      err = e;
      if (!callback) throw e;
    }
    return callback ? callback(err, feedList) : feedList;
  }

  /**
   * Fetch post with post stats and userinfo as piggybacked data
   * in aux fields.
   *
   * @param {string} commentId
   * @callback
   * @return {XMPost} comment object with aux data
   * keyed by ModelType.COMMENT_STATS and ModelType.USERINFO
   */
  fetchPostWithStats_UserInfo(commentId, callback) {
    let inclOptions = API.INCL_POSTSTATS + "|" + API.INCL_USERINFO;
    return this.fetchPost(commentId, inclOptions, false, callback);
  }

  /**
   * Fetch a post object
   *
   * @param {string} postId ID for post
   * @param {string} inclOptions API.INCL_POSTSTATS|API.INCL_USERINFO
   * @param {boolean} cache true to ask ObjectManager to track it
   * @return {XMPost}
   * @callback {XError, XMPost}
   *
   * @see ~fetchPostWithStatsAndUser
   */
  fetchPost(postId, inclOptions = null, cache = false, callback) {
    let _m = `fetchPost(${postId})`;
    let p = new Promise((resolve, reject) => {
      let processResults = (err, postObj) => {
        if (err) {
          this.error(_m, `Error post ${postId}`);
          console.error(err);
          return callback ? callback(err, null) : reject(err);
        }
        if (callback) callback(null, postObj);
        resolve(postObj);
      };
      let params = inclOptions ? {[API.PARAM_INCL]: inclOptions} : null;
      this.user_getResource(
        postId,
        ModelType.POST,
        params,
        cache,
        processResults,
      );
    });

    return p;
  }

  /**
   * Retrieve stats for a post
   *
   * @param {string[]} postId
   * @param {boolean} inclObj include XMPost object in the return result
   *
   * @return {XPostStat | [XMPost,XPostStat]} either single object, or two objects
   */
  async fetchPostStats(postId, inclObj = false, callback) {
    const _m = "fetchPostStats";

    let result;
    let error = null;

    try {
      let apiUrl = this.apiGetObjectStats(ModelType.POST, postId, inclObj);
      result = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }
    return callback ? callback(error, result) : result;
  }

  // ----------------------------- COMMENTS ------------------------------

  /**
   * Fetch comments of a post, or as replies of a comment.  Currently
   * we determine which by the prefix of the Id
   *
   * @param {string} parentId either postId or a commentId.
   * @param {number} offset offset into start position of the expected query
   * @param {number} size batch size
   * @param {number} startTS timestamp where the posts streaming should start
   * @callback (err, XCommentFeed)
   * @return {XCommentFeed}
   */
  async fetchComments(
    parentId,
    offset = null,
    size = null,
    startTS,
    direction,
    callback,
  ) {
    let isComment = parentId.startsWith(PREFIX_COMMENT_ID) ? true : false;
    let _m = `fetchComments(${isComment ? "comment" : "post"}:${parentId})`;
    this.log(_m, `Fetching: offset=${offset}, max=${size}`);
    let err = null;

    let endpoint = isComment
      ? `/u/comment/${parentId}/comments`
      : `/u/post/${parentId}/comments`;

    let feedList;
    try {
      let url = this.getURL(this.urlHost, endpoint);
      url = this.appendFetchParams(
        url,
        offset,
        size,
        startTS,
        direction,
        null,
        true,
      );
      let result = await this.requestGET(url, null);
      feedList = XCommentFeed.Wrap(result); // should already been wrapped...
    } catch (e) {
      this.log(_m, e);
      if (callback == null) throw e;
    }

    return callback ? callback(err, feedList) : feedList;
  } // fetchComments

  /**
   * Fetch a comment object with piggybacked comment stats,
   * user info, associated post object, and its post stats
   *
   * @param {string} commentId
   * @callback
   *
   * @return {XMComment} comment object with aux object
   * keyed by ModelType.COMMENT_STATS and ModelType.USERINFO,
   * ModelType.POST, and ModelType.POST_STATS
   */
  fetchCommentWithStats_UserInfo_Post(commentId, callback) {
    // API.STATS will be honored by all objects, but in this case we don't
    // want UserInfo to come back with UserStats
    let inclOptions = `${API.INCL_COMMENTSTATS}|${API.INCL_USERINFO}|${API.INCL_POSTS}|${API.INCL_POSTSTATS}`;
    return this.fetchComment(commentId, inclOptions, false, callback);
  }

  /**
   * Fetch a comment object with piggybacked comment stats and userinfo
   *
   * @param {string} commentId
   * @callback
   *
   * @return {XMComment} comment object with aux object
   * keyed by ModelType.COMMENT_STATS and ModelType.USERINFO
   */
  fetchCommentWithStats_UserInfo(commentId, callback) {
    let inclOptions = API.INCL_COMMENTSTATS + "|" + API.INCL_USERINFO;
    return this.fetchComment(commentId, inclOptions, false, callback);
  }

  /**
   * Fetch a comment object from server
   *
   * @param {string} commentId ID for post
   * @param {string} inclOptions INCL_COMMENTSTATS|INCL_USERINFO
   * @param {boolean} cache true to ask ObjectManager to track it
   * @return {XMComment}
   * @callback {XError, XMComment}
   *
   * @see ~fetchComment
   */
  fetchComment(commentId, inclOptions, cache = false, callback) {
    let _m = `fetchComment(${commentId})`;
    let p = new Promise((resolve, reject) => {
      let processResults = (err, commentObj) => {
        if (err) {
          this.error(_m, `Error comment ${commentId}`);
          console.error(err);
          return callback ? callback(err, null) : reject(err);
        }
        if (callback) callback(null, commentObj);
        resolve(commentObj);
      };
      let params = inclOptions ? {[API.PARAM_INCL]: inclOptions} : null;
      this.user_getResource(
        commentId,
        "comment",
        params,
        cache,
        processResults,
      );
    });

    return p;
  }

  /**
   * Retrieve comment stats object from server
   *
   * @param {string[]} commentId
   * @param {boolean} inclObj include XMPost object in the return result
   *
   * @return {XMCommentStat | [XMComment,XMCommentStats]} either single object, or two objects
   */
  async fetchCommentStats(commentId, inclObj = false, callback) {
    const _m = "fetchCommentStats";

    let result;
    let error = null;

    try {
      let apiUrl = this.apiGetObjectStats("comment", commentId, inclObj);
      result = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }
    return callback ? callback(error, result) : result;
  }

  // --------------------------- USER SERVICES -----------------------------

  /**
   * Check whether a user exists.
   *
   * NOTE: currently, it does not return user status, which includes suspended/inactive.
   * So it's mainly used for use during sign-up
   *
   * @param {string[]} userId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {object} map with tagname is key, and requested props: {title: <text>} as default
   */
  async checkUserExists(userId, callback) {
    const _m = "chkUID";
    let verdict = null;
    let error = null;
    try {
      let checkUserUrl = this.getURL(this.urlHost, `/u/user/${userId}/exists`);
      verdict = await this.requestGET(checkUserUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
    }
    return callback ? callback(error, verdict) : verdict;
  } // checkUserExists

  /**
   * Check whether an email exists.
   *

   * @param {string[]} email
   *
   * @return {object} map with tagname is key, and requested props: {title: <text>} as default
   */
  async checkEmailExists(email, callback) {
    const _m = "chkEm";
    let verdict = false;
    let error = null;
    if (Util.EmailIsValid(email)) {
      try {
        const encoded = encodeURIComponent(email);
        let checkUserUrl = this.getURL(
          this.urlHost,
          `/s/email/exists?email=${email}`,
        );
        verdict = await this.requestGET(checkUserUrl, null);
      } catch (e) {
        this.error(_m, e);
        error = e;
      }
    } else {
      error = new XError.New(ErrorCodes.USER_BAD_INPUT, "Invalid Email");
    }

    return callback ? callback(error, verdict) : verdict;
  } // checkEmailExists

  /**
   * Get user's status with the system
   *
   * @param {string[]} userId
   *
   * @return {string} user status (see UserProps.STATUS)
   */
  async getUserStatus(userId, callback) {
    const _m = "getUserStatus";
    let verdict = null;
    let error = null;
    try {
      let checkUserUrl = this.getURL(this.urlHost, `/s/user/${userId}/status`);
      // debugger;
      verdict = await this.requestGET(checkUserUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
    }
    return callback ? callback(error, verdict) : verdict;
  } // checkUserStatus

  /**
   * Retrieve nickname from userID. This convenient
   * method assumes user object is already in cache.
   *
   * @param {string} userId user ID to lookup
   */
  getUserNickname(userId, defaultVal = null) {
    let om = this.getObjectManager();
    let usrObj = om.getFromCache(userId, null, null);

    return usrObj ? usrObj.getNickname() : defaultVal;
  }

  async updateUserProfile(objId, data, userId) {
    let _m = "updateUserProfile";
    let token = this.portal.getUserToken();
    let error = null;
    let result = null;
    try {
      let formData = new FormData();

      for (let key in data) {
        if (key === "username") {
          formData.append("nickname", data.username);
        } else if (key === "bio") {
          formData.append("dsc", data.bio);
        } else if (data[key] === "ico") {
          formData.append(key, data[key]);
        } else if (data[key] === "bgimg") {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
      let postUrl = this.getURL(this.urlHost, `/u/user/${userId}/profile`);

      let xAuth =
        userId === null
          ? `{"user": null, "token": null}`
          : `{"user": "${userId}", "token": "${token}"}`;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-app-auth": xAuth,
        },
      };
      result = await axios({
        url: postUrl,
        method: "post",
        data: formData,
        ...config,
      });
    } catch (e) {
      this.error(_m, e);
      error = e;
    }
    return result;
  }

  /**
   * Fetch a user info record from server
   *
   * @param {string} userId use user ID
   * @param params any arguments or filters
   * @callback
   * @return {XUserInfo}
   */
  async fetchUserInfo(userId, params, callback) {
    let _m = "fetchUserInfo";
    let p = new Promise((resolve, reject) => {
      let processResults = (err, userInfo) => {
        // this.log(_m, "user info retrieved:", userInfo);
        if (err) {
          this.error(_m, err);
          if (callback) callback(err, null);
          reject(err);
        } else {
          if (callback) callback(null, userInfo);
          resolve(userInfo);
        }
      }; // processResults
      this.getResource(
        userId,
        ModelType.USER_INFO,
        null,
        false,
        processResults,
      );
    });

    return p;
  } // fetchuserInfo

  /**
   * Force refresh of user info by reading from server and
   * then update session/cookie
   *
   * @param {function} callback in case not using promise
   */
  async refreshUserInfo(callback) {
    let userInfo;
    let errObj;
    try {
      let userId = this.getUserId();
      userInfo = await this.fetchUserInfo(userId);
      if (userInfo) {
        // this.log("refreshUserInfo", "info", userInfo);
        this.updateUserInfo(userInfo);
      }
    } catch (err) {
      if (callback == null) throw err;
    }
    return callback ? callback(errObj, userInfo) : userInfo;
  } // refreshUserInfo

  /**
   * Invalidate a settings group and force re-retrieve.
   *
   * @param {string} section one of UserProps.SETTINGS_*
   * @param {{}} params pass to server
   * @param {function} callback in case not using promise
   */
  async invalidateSettings(section, params, callback) {
    // for now, we only allow refreshing the profile section
    if (UserProps.SETTINGS_PROFILE !== section) return;

    return this.refreshUserInfo(callback);
  } // invalidateSettings

  /**
   * Fetch a user settings record from server
   *
   * @param {string} userId use user ID
   * @param {string} section one of UserProps.SETTINGS_*
   * @param {{}} params any arguments or filters
   * @return {XUserInfo} subclass of it which is basically specific
   * settings like XAccountSettings, XProfileSettings, etc.
   */
  async fetchUserSettings(userId, section, params, callback) {
    const _m = "fetchUserSettings";
    let settingsObj;
    let error = null;
    try {
      let getSettingsUrl = this.apiGetUserSettings(userId, section, params);
      settingsObj = await this.requestGET(getSettingsUrl, null);
      settingsObj = XMObject.Wrap(settingsObj);
    } catch (e) {
      this.error(_m, "server returned error:", e);
      error = e;
      settingsObj = null;
    }
    return callback ? callback(error, settingsObj) : settingsObj;
  } // fetchUserSettings

  /**Update a user settings (delta) record to server
   *
   * @param {string} userId use user ID
   * @param {string} section settings type defined in UserProps.SETTINGS_*
   * @param {XDeepDiff} settingsChanges changes to update
   * @param {{}} params any arguments or filters
   * @return {XUserInfo} updated settings object of types like
   * XAccountSettings, XProfileSettings, etc.
   */
  async updateUserSettings(userId, section, settingsChanges, params, callback) {
    const _m = "uUrSt";
    let settingsObj;
    let settingsData = XMObject.Unwrap(settingsChanges);
    let encryptedData = Util.EncryptJSON(settingsData);
    let error = null;
    try {
      let updateSettingsUrl = this.apiGetUserSettings(userId, section, params);
      settingsObj = await this.requestPOST(updateSettingsUrl, encryptedData);
      settingsObj = XMObject.Wrap(settingsObj);
    } catch (e) {
      this.error(_m, e);
      error = e;
      settingsObj = null;
    }

    // If settings is profile, then we need to update user info
    if (this.isLoggedInUser(userId)) this.invalidateSettings(section);

    return callback ? callback(error, settingsObj) : settingsObj;
  } // updateUserSettings

  /**
   * Initiate an user stat update from server, which will
   * update in session variables.
   *
   * @param {{}} props control what stats to update
   *
   * @callback
   */
  async updateUserStats(props, callback) {
    let userId = this.getUserId();
    let statsObj = await this.fetchUserStats(userId, props);
    // Update session
    if (statsObj) {
      this.getSession().updateUserStats(statsObj);
    }
  }

  /**
   * Retrieve latest in stats of (current) user and update
   * the profile
   *
   * @param {string[]} userId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {object} map with tagname is key, and requested props: {title: <text>} as default
   */
  async fetchUserStats(userId, props = null, callback) {
    const _m = "fetchUserStats";
    let statsObj;
    let error = null;
    try {
      let url = this.getURL(this.urlHost, `/s/user/${userId}/stats/`);
      if (props) {
        // props = Array.isArray(props) ? props.join(",") : props;
        url += "?props=" + JSON.stringify(props);
      }
      statsObj = await this.requestGET(url, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      statsObj = null;
    }
    return callback ? callback(error, statsObj) : statsObj;
  } // fetchUserStats

  /**
   * Retrieve tag stats
   *
   * @param {string[]} tagId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {object} map with tagname is key, and requested props: {title: <text>} as default
   */
  async fetchTagStats(tagId, props = null, callback) {
    const _m = "fetchTagStats";

    let statsObj;
    let error = null;
    try {
      let apiUrl = this.apiGetCategoryStats(tagId, props);
      statsObj = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      statsObj = null;
    }
    return callback ? callback(error, statsObj) : statsObj;
  } // fetchTagStats

  // ----------------------- TOPIC CATEGORIES -----------------------------

  /**
   * Submit update of interested topic categories for a user
   *
   * @param {string[]} topicIds array of topic category identifiers as
   * specified in ModelConst.CATEGORY_*. If one, still submit as a string
   *
   *
   * @return {string[]} all user interested topics
   */
  async submitTopics(topicIds, callback) {
    const _m = "setTopics";
    let error = null;
    let userTopics = null;
    try {
      const userId = this.getUserId();
      let submitTopicsUrl = this.getURL(
        this.urlHost,
        `/s/user/${userId}/topics`,
      );
      let data = {
        [API.PARAM_CATEGORIES]: API.CreateOptions(topicIds),
      };
      userTopics = await this.requestPOST(submitTopicsUrl, data);
    } catch (e) {
      this.error(_m, e);
      error = e;
    }
    return callback ? callback(error, userTopics) : userTopics;
  } // submitTopics

  /**
   * Return all available topic (IDs). The Ids should be mappable
   * to translations.
   *
   * @return {string[]} topicIds array of topic category identifiers as
   * specified in ModelConst.CATEGORY_*. If one, still submit as a string
   *
   * @return {string[]} all user interested topics
   */
  async fetchAvailableTopics(callback) {
    const _m = "gTopics";
    let error = null;

    // We have these topic Ids in constants, so no need to
    // make a call to server for now.
    let topicIds = TOPIC_CATEGORIES;
    // try {
    //   const userId = this.getUserId();
    //   let getTopicsUrl = this.getURL(this.urlHost, `/s/topics`);
    //   topicIds = await this.requestGET(getTopicsUrl);
    // } catch (e) {
    //   this.error(_m, e);
    //   error = e;
    // }
    return callback ? callback(error, topicIds) : topicIds;
  } // fetchAvailableTopics

  // --------------------- ALERT SERVICE ----------------------

  /**
   * Get alert count
   *
   * @param {string} userId user to get count, or null for logged in user
   * @param {{}} props future
   * @param {*} defaultVal if no value is retrieved.
   *
   * @return {number} count
   */
  async fetchAlertCount(
    userId = null,
    props = null,
    defaultVal = -1,
    callback,
  ) {
    const _m = "fetchAlertCount";

    let loggedInUserId = userId ? userId : this.getUserId();
    let alertCount;
    let field = "unread";
    let error = null;
    try {
      let getUrl = this.apiUserAlertCount(loggedInUserId, field, props);
      let result = await this.requestGET(getUrl);
      if (result) alertCount = result[field];
    } catch (e) {
      this.error(_m, e);
      error = e;
      alertCount = defaultVal;
    }

    return callback ? callback(error, alertCount) : alertCount;
  } // fetchAlertCount

  /**
   * Fetch User alerts
   * @param {string} userId
   * @param {*} props
   * @param {*} defaultVal
   * @callback
   * @return {XMUserAlerts} wrapper to XUserAlert instances and XVarData
   */
  async fetchAlerts(userId = null, props = null, defaultVal = null, callback) {
    const _m = "fetchAlerts";

    let loggedInUserId = userId ? userId : this.getUserId();

    /** @type {XMUserAlert} */
    let retval;
    let field = "";
    let max = 20;
    let error = null;
    try {
      let getUrl = this.apiUserAlerts(loggedInUserId, field, max, props);
      retval = await this.requestGET(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      retval = defaultVal;
    }

    return callback ? callback(error, retval) : retval;
  } // fetchAlerts

  /**
   * Get alert count
   *
   * @param {string} userId user to get count, or null for logged in user
   * @param {{}} props future
   * @param {*} defaultVal if no value is retrieved.
   *
   * @return {number} count
   */
  async markAlertsRead(alertIds, props = null, callback) {
    const _m = "markAlertsRead";

    let loggedInUserId = this.getUserId();
    let returnVal;
    if (props == null) props = {};

    // for now...
    props[API.ALERT_IDS] = alertIds;
    props[API.READ_TS] = Date.now();
    props[API.READ_MEDIUM] = MessageProps.MEDIUM_APP;
    let error = null;
    try {
      let getUrl = this.apiUserAlertsStatus(loggedInUserId, null, null);
      returnVal = await this.requestPOST(getUrl, props);
    } catch (e) {
      this.error(_m, e);
      error = e;
      returnVal = null;
    }

    return callback ? callback(error, returnVal) : returnVal;
  } // fetchAlertCount

  // --------------------- FOLLOWS SERVICE ----------------------

  /**
   * Add a "userId follows :anotherUserId"
   *
   * @param {string} targetUserId user to follow
   *
   * @return {XUserInfo} upated user info with new follow
   */
  async userFollows(targetUserId, props = null, callback) {
    const _m = "userFollows";

    let loggedInUserId = this.getUserId();
    let followStatus;
    let error = null;
    try {
      let getUrl = this.apiAddFollows(loggedInUserId, targetUserId, props);
      followStatus = await this.requestPOST(getUrl);
    } catch (e) {
      // response object in here is not an xResObj
      this.error(_m, e);
      error = e;
      followStatus = null;
    }
    return callback ? callback(error, followStatus) : followStatus;
  } // userFollows

  /**
   * Retrieve answer to whether the logged in user is following
   * a given user.
   *
   * @param {string[]} userId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {object} map with tagname is key, and requested props: {title: <text>} as default
   */
  async userFollowStatus(targetUserId, props = null, callback) {
    const _m = "userFollowStatus";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!targetUserId || !userId) {
      return false;
    }
    try {
      let getUserStatsUrl = this.apiUserFollowStatus(
        userId,
        targetUserId,
        props,
      );
      statusValue = await this.requestGET(getUserStatsUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      statusValue = SocialProps.STATUS_UNKNOWN;
    }
    return callback ? callback(error, statusValue) : statusValue;
  } // userFollowStatus

  /**
   * Retrieve answer to whether the logged in user is following
   * a given user (or pending or blocked).
   *
   * @param {string[]} followerId userId for the follower of logged in user
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return {string} status PROP_ACCEPTED, PROP_PENDING, PROP_BLOCKED or null
   */
  async userFollowerStatus(followerId, props = null, callback) {
    const _m = "userFollowerStatus";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!followerId || !userId) {
      return null;
    }
    try {
      let getUserStatsUrl = this.apiUserFollowerStatus(
        userId,
        followerId,
        props,
      );
      statusValue = await this.requestGET(getUserStatsUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      statusValue = null;
    }
    return callback ? callback(error, statusValue) : statusValue;
  } // userFollowStatus

  /**
   * Add a "userId unfollows :anotherUserId"
   *
   * @param {string} targetUserId user to unfollow
   *
   * @return {XUserInfo} updated user info with follow removed
   */
  async userUnfollows(targetUserId, props = null, callback) {
    const _m = "userUnfollows";

    let loggedInUserId = this.getUserId();
    let followStatus;
    let error = null;
    try {
      let getUrl = this.apiRemoveFollows(loggedInUserId, targetUserId, props);
      followStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      followStatus = null;
    }

    return callback ? callback(error, followStatus) : followStatus;
  } // userUnfollows

  /**
   * Request blocking of a user from logged in user
   *
   * @param {string} targetUserId user to block
   *
   * @return {XUserInfo} updted user info with follow removed
   */
  async userBlocksFollower(targetUserId, props = null, callback) {
    const _m = "userBlocksFollower";

    let loggedInUserId = this.getUserId();
    let followStatus;
    let error = null;
    try {
      let getUrl = this.apiBlockFollower(loggedInUserId, targetUserId, props);
      followStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      followStatus = null;
    }

    return callback ? callback(error, followStatus) : followStatus;
  } // userBlocksUser

  /**
   * Request unblocking of a user from logged in user
   *
   * @param {string} targetUserId user to block
   *
   * @return {XUserInfo} updted user info with follow removed
   */
  async userUnblocksFollower(targetUserId, props = null, callback) {
    const _m = "userUnblocksFollower";

    let loggedInUserId = this.getUserId();
    let followStatus;
    let error = null;
    try {
      let getUrl = this.apiUnblockFollower(loggedInUserId, targetUserId, props);
      followStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      followStatus = null;
    }

    return callback ? callback(error, followStatus) : followStatus;
  } // userBlocksUser

  /**
   * Request mute a user for logged in user
   *
   * @param {string} targetUserId user to mute
   *
   * @return {XUserInfo} updted user info with follow removed
   */
  async userMutesFollower(targetUserId, props = null, callback) {
    const _m = "userMutesFollower";

    let loggedInUserId = this.getUserId();
    let followStatus;
    let error = null;
    try {
      let getUrl = this.apiMuteFollower(loggedInUserId, targetUserId, props);
      followStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      followStatus = null;
    }

    return callback ? callback(error, followStatus) : followStatus;
  } // userMutesUser

  /**
   * Request unmute a user for logged in user
   *
   * @param {string} targetUserId user to mute
   *
   * @return {XUserInfo} updted user info with follow removed
   */
  async userUnmutesFollower(targetUserId, props = null, callback) {
    const _m = "userUnmutesFollower";

    let loggedInUserId = this.getUserId();
    let followStatus;
    let error = null;
    try {
      let getUrl = this.apiUnmuteFollower(loggedInUserId, targetUserId, props);
      followStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      followStatus = null;
    }

    return callback ? callback(error, followStatus) : followStatus;
  } // userUnmutesUser

  /**
   * Fetch a user follows instance, which contains user IDs
   * that this user is following.
   *
   * @param {string} userId poll configuration ID
   * @param {{}} params API.INCL_REFOBJS, API.INCL_STATS
   * @callback
   *
   * @see ~fetchUserFollowsInclRefs
   */
  async fetchUserFollows(userId, params, callback) {
    let _m = `fetchUserFollows(${userId})`;
    let loggedInUserId = userId ? userId : this.getUserId();
    let followObj;
    let error = null;
    try {
      let getUrl = this.apiGetFollows(loggedInUserId, params);
      followObj = await this.requestGET(getUrl);
      followObj = XMFollows.Wrap(followObj);
    } catch (e) {
      this.error(_m, e);
      error = e;
      followObj = null;
    }

    return callback ? callback(error, followObj) : followObj;
  } // fetchUserFollows

  /**
   *
   * @param {string} userId
   * @param {{}} params
   * @param {boolean} cache true to ask ObjectManager to track it
   * @callback
   */
  fetchUserFollowsInclRefs(userId, params, cache = false, callback) {
    if (params == null) params = {};

    // The content is not evaluated at the server; only that
    // this parameter is passed (as of 3/2019)
    params[API.INCL_REFOBJS] = {
      [XObject.PROP_TAGS]: {
        [XObject.PROP_TITLE]: "en_us",
      },
    };

    return this.fetchUserFollows(userId, params, cache, callback);
  }

  /**
   * Fetch a user follows instance, which contains user IDs
   * that this user is following.
   *
   * @param {string} userId poll configuration ID
   * @param {{}} params API.INCL_REFOBJS, API.INCL_STATS
   * @callback
   */
  async fetchUserFollowers(userId, params, callback) {
    let _m = `fUF(${userId})`;
    let loggedInUserId = userId ? userId : this.getUserId();
    let followerObj;
    let error = null;
    try {
      let getUrl = this.apiGetFollowers(loggedInUserId, params);
      followerObj = await this.requestGET(getUrl);
      followerObj = XMFollowers.Wrap(followerObj);
    } catch (e) {
      this.error(_m, "server returned error:", e);
      error = e;
      followerObj = null;
    }

    return callback ? callback(error, followerObj) : followerObj;
  } // fetchUserFollowers

  /**
   *
   * @param {string} userId
   * @param {{}} params
   * @param {boolean} cache true to ask ObjectManager to track it
   * @callback
   */
  fetchUserFollowersInclRefs(userId, params, cache = false, callback) {
    if (params == null) params = {};

    // The content is not evaluated at the server; only that
    // this parameter is passed (as of 3/2019)
    params[API.INCL_REFOBJS] = {
      [XObject.PROP_TAGS]: {
        [XObject.PROP_TITLE]: "en_us",
      },
    };

    return this.fetchUserFollowers(userId, params, cache, callback);
  }

  // ------------------- WATCHES/WATCHED POSTS -----------------

  /**
   * Fetch all tags that a user is watching
   *
   * @param {string} userId
   * @param {{}} params API.INCL_REFOBJS, API.INCL_STATS
   * @callback
   * @return {XMWatchesPost}
   */
  async fetchWatchesPost(userId, params, callback) {
    let _m = `fetchWatchesPost(${userId})`;
    let loggedInUserId = userId ? userId : this.getUserId();
    let xWatches;
    let error = null;
    try {
      let getUrl = this.apiGetWatchesObject(
        ModelType.POST,
        loggedInUserId,
        params,
      );
      xWatches = await this.requestGET(getUrl);
      xWatches = XMWatchesPost.Wrap(xWatches);
    } catch (e) {
      this.error(_m, e);
      error = e;
      xWatches = null;
    }
    return callback ? callback(error, xWatches) : xWatches;
  }

  /**
   * Fetch a user follows instance, which contains user IDs
   * that this user is following.
   *
   * @param {string} postId poll configuration ID
   * @param {{}} params API.INCL_REFOBJS, API.INCL_STATS
   * @callback
   */
  async fetchPostWatchers(postId, params, callback) {
    let _m = `fetchPostWatchers(${postId})`;
    let loggedInUserId = postId ? postId : this.getUserId();
    let xWatchers;
    let error = null;
    try {
      let getUrl = this.apiGetObjectWatchers(
        ModelType.POST,
        loggedInUserId,
        params,
      );
      xWatchers = await this.requestGET(getUrl);

      xWatchers = XMWatchedPost.Wrap(xWatchers);
    } catch (e) {
      this.error(_m, e);
      error = e;
      xWatchers = null;
    }
    return callback ? callback(error, xWatchers) : xWatchers;
  }

  // --------------------- LIKES POST SERVICE ----------------------

  /**
   * Add a "userId likes :postId"
   *
   * @param {string} postId user to follow
   *
   * @return {string} updated like status "y" or "n"
   */
  async userLikesPost(postId, props = null, callback) {
    const _m = "userLikesPost";

    let loggedInUserId = this.getUserId();
    let likeStatus;
    let error = null;
    try {
      let getUrl = this.apiAddLikeObject(
        loggedInUserId,
        ModelType.POST,
        postId,
        props,
      );
      likeStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      likeStatus = null;
    }

    return callback ? callback(error, likeStatus) : likeStatus;
  } // userLikesPost

  /**
   * Request to unlike a post
   *
   * @param {string} postId user to unfollow
   *
   * @return {XUserInfo} upated user info with follow removed
   */
  async userUnlikesPost(postId, props = null, callback) {
    const _m = "userUnlikesPost";

    let loggedInUserId = this.getUserId();
    let likeStatus;
    let error = null;
    try {
      let getUrl = this.apiRemoveLikeObject(
        loggedInUserId,
        ModelType.POST,
        postId,
        props,
      );
      likeStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      likeStatus = null;
    }

    return callback ? callback(error, likeStatus) : likeStatus;
  } // userUnlikesPost

  /**
   * Retrieve answer to whether the logged in user has liked
   * the given post.
   *
   * @param {string[]} postId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return "y" or "no"
   */
  async userLikePostStatus(postId, props = null, callback) {
    const _m = "fULPS";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!postId || !userId) {
      return "no";
    }
    try {
      let url = this.apiUserLikeObjectStatus(
        userId,
        ModelType.POST,
        postId,
        props,
      );
      statusValue = await this.requestGET(url, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      statusValue = null;
    }
    return callback ? callback(error, statusValue) : statusValue;
  } // userLikePostStatus

  // --------------------- LIKES COMMENT SERVICE ----------------------

  /**
   * Add a "userId likes :commentId"
   *
   * @param {string} commentId user to follow
   *
   * @return {string} updated like status "y" or "n"
   */
  async userLikesComment(commentId, props = null, callback) {
    const _m = "userLikesPost";

    let loggedInUserId = this.getUserId();
    let likeStatus;
    let error = null;
    try {
      let getUrl = this.apiAddLikeObject(
        loggedInUserId,
        "comment",
        commentId,
        props,
      );
      likeStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      likeStatus = null;
    }

    return callback ? callback(error, likeStatus) : likeStatus;
  } // userLikesPost

  /**
   * Request to unlike a post
   *
   * @param {string} commentId user to unfollow
   *
   * @return {XUserInfo} upated user info with follow removed
   */
  async userUnlikesComment(commentId, props = null, callback) {
    const _m = "fUUCS";

    let loggedInUserId = this.getUserId();
    let likeStatus;
    let error = null;
    try {
      let getUrl = this.apiRemoveLikeObject(
        loggedInUserId,
        "comment",
        commentId,
        props,
      );
      likeStatus = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      likeStatus = null;
    }

    return callback ? callback(error, likeStatus) : likeStatus;
  } // userUnlikesComment

  /**
   * Retrieve answer to whether the logged in user has liked
   * the given post.
   *
   * @param {string[]} commentId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return "y" or "no"
   */
  async userLikeCommentStatus(commentId, props = null, callback) {
    const _m = "fULCS";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!commentId || !userId) {
      return "no";
    }
    try {
      let url = this.apiUserLikeObjectStatus(
        userId,
        "comment",
        commentId,
        props,
      );
      statusValue = await this.requestGET(url, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
      statusValue = null;
    }
    return callback ? callback(error, statusValue) : statusValue;
  } // userLikeCommentStatus

  // --------------------- WATCH OBJECT SERVICE ----------------------

  /**
   * Add a "userId watches :objectId"
   *
   * @param {string} objectId object to watch
   *
   * @return {string} updated like status "y" or "n"
   */
  async userWatchesObject(type, objectId, props = null, callback) {
    const _m = "userWatchesObject";

    let loggedInUserId = this.getUserId();
    let watchStatus;
    let error = null;
    try {
      let url = this.apiAddWatchObject(type, loggedInUserId, objectId, props);
      watchStatus = await this.requestPOST(url);
    } catch (e) {
      this.error(_m, e);
      error = e;
      watchStatus = null;
    }

    return callback ? callback(error, watchStatus) : watchStatus;
  }

  /**
   * Request to unwatch an object
   *
   * @param {string} objectId object to unwatch
   *
   * @return {XUserInfo} upated user info with follow removed
   */
  async userUnwatchesObject(type, objectId, props = null, callback) {
    const _m = "userUnwatchesObject";

    let loggedInUserId = this.getUserId();
    let watchStatus;
    let error = null;
    try {
      let url = this.apiRemoveWatchObject(
        type,
        loggedInUserId,
        objectId,
        props,
      );
      watchStatus = await this.requestPOST(url);
    } catch (e) {
      this.error(_m, "server returned error:", e);
      error = e;
      watchStatus = null;
    }

    return callback ? callback(error, watchStatus) : watchStatus;
  }

  /**
   * Get watch status on the specified object type/id
   *
   * @param {string[]} objectId
   * @param {string[]} props properties to include (array or comma delimited string)
   * Null to include defaults which is title only.
   *
   * @return "y" or "no"
   */
  async userWatchObjectStatus(type, objectId, props = null, callback) {
    const _m = "userWatchObjectStatus";

    let statusValue = null;
    let error = null;
    let userId = this.getUserId();
    if (!objectId || !userId) {
      return "no";
    }
    try {
      let url = this.apiUserWatchObjectStatus(type, userId, objectId, props);
      statusValue = await this.requestGET(url, null);
    } catch (e) {
      this.error(_m, "server returned error:", e);
      error = e;
      statusValue = null;
    }
    return callback ? callback(error, statusValue) : statusValue;
  }

  // --------------------- (PASSWORD) CHANGE REQUEST -------------------------

  /**
   * Fetch existing XMUserRequest instance.
   *
   * @param {string} requestId
   * @callback
   */
  fetchUserRequest(requestId, cache = false, callback) {
    // let _m = `fetchUserRequest(${templateId})`;

    let processResults = (err, rlObj) => {
      if (err) {
        console.log(err);
        return callback ? callback(err, null) : null;
      }

      if (callback) callback(null, rlObj);
      else return rlObj;
    };

    this.getResource(
      requestId,
      ModelType.USER_REQUEST,
      null,
      cache,
      processResults,
    );
  } // fetchUserRequest

  /**
   * Send password change request to verified contact path (e.g., email)
   *
   * @param {XUserInfo} userInfo
   * @param {XAuthInfo} authInfo
   * @param {string} requestType either REQUEST_EMAIL or REQUEST_SMS as wish
   *
   * @return {XMUserConfirm} confirmation object
   */
  async initiatePasswordChange(userInfo, authInfo, requestType, callback) {
    const _m = "initPwdChange";

    let content = {};
    if (userInfo) content["userinfo"] = XObject.Unwrap(userInfo);
    if (authInfo) content["authinfo"] = XObject.Unwrap(authInfo);

    let encrypted = Util.EncryptJSON(content);

    let confirmObj;
    let error = null;

    // type may become an option to allow user to choose how to send request (by email or sms)
    // let type = (confirmType === UserProps.CONFIRM_SMS) ? UserProps.SMS : UserProps.EMAIL;
    try {
      let apiUrl = this.getURL(this.urlHost, `/s/request/pwdchg`);
      confirmObj = await this.requestPOST(apiUrl, encrypted);
    } catch (e) {
      this.error(_m, "server error:", e);
      error = e;
      confirmObj = null;
    }
    return callback ? callback(error, confirmObj) : confirmObj;
  }

  /**
   * Resend new confirmation based on the given (expired) confirmation.
   *
   * @param {string} requestId
   * @param {string} confirmType either CONFIRM_EMAIL or CONFIRM_SMS
   *
   * @return {XMUserConfirm} new confirmation object with different ID
   */
  async resendPasswordChangeRequest(requestId, callback) {
    const _m = "resentPwdChangeReq";

    let xRequest;
    let error = null;
    try {
      let apiUrl = this.getURL(this.urlHost, `/s/request/${requestId}/resend`);
      xRequest = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, "server error:", e);
      error = e;
      xRequest = null;
    }
    return callback ? callback(error, xRequest) : xRequest;
  }

  /**
   * Submit a password change request to server.
   * This is a pass-thru from
   * the web app URL: /chgpwd/:requestId when responding to
   * an email request to change password
   *
   * @param {string} curPassword current pasword (clear)
   * @param {string} newPassword new password (clear)
   *
   * @return {string} status PROP_ACCEPTED, PROP_PENDING, PROP_BLOCKED or null
   *
   * @see PasswordChangeRoute.submitRequest (route-changepwd.js)
   */
  async submitPasswordChange(curPassword, newPassword, callback) {
    const _m = "submitPwdChange";

    let result;
    let error = null;
    try {
      let userId = this.getUserId();
      let data = {
        [API.CURRENT_PASSWORD]: curPassword,
        [API.NEW_PASSWORD]: newPassword,
      };

      let query = this.getURL(
        this.urlHost,
        `/u/user/${userId}/pwdchg?clear=true`,
      );
      // if (sourceId) query = `${query}/src/${sourceId}`;

      result = await this.requestPOST(query, data);
    } catch (e) {
      this.error(_m, "server:", e);
      error = e;
      result = null;
    }
    return callback ? callback(error, result) : result;
  } // submitPasswordChange

  /**
   * Change password
   *
   * @param {string} curPassword current pasword (clear)
   * @param {string} newPassword new password (clear)
   *
   * @return {boolean} true to indicate success, or E_AUTH error
   *
   */
  async changePassword(curPassword, newPassword, callback) {
    const _m = "chgPwd";

    let result;
    let error = null;
    let username = this.getUsername();
    try {
      let query = this.getURL(this.urlHost, `/u/${username}/pwdchg`);

      let curpwd = Util.EncryptPwd(curPassword);
      let newpwd = Util.EncryptPwd(newPassword);

      let data = {
        [API.CURRENT_PASSWORD]: curpwd,
        [API.NEW_PASSWORD]: newpwd,
      };

      result = await this.requestPOST(query, data);
    } catch (e) {
      this.error(_m, "server:", e);
      error = e;
      result = null;
    }
    return callback ? callback(error, result) : result;
  } // changePassword

  // --------------------- CONFIRMATION / VERIFICATION STATUS -------------------------

  /**
   * Send verification email/text to user to confirm account (contact method)
   *
   * @param {string} userId
   * @param {string} confirmType either CONFIRM_EMAIL or CONFIRM_SMS
   *
   * @return {XMUserConfirm} confirmation object
   */
  async verifyContact(userId, confirmType, callback) {
    const _m = "verifyContact";

    let confirmObj;
    let error = null;
    let type =
      confirmType === UserProps.CONFIRM_SMS ? UserProps.SMS : UserProps.EMAIL;
    try {
      let apiUrl = this.getURL(
        this.urlHost,
        `/s/user/${userId}/verify/${type}`,
      );
      confirmObj = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, "server error:", e);
      error = e;
      confirmObj = null;
    }
    return callback ? callback(error, confirmObj) : confirmObj;
  }

  /**
   * Resend new confirmation based on the given (expired) confirmation.
   *
   * @param {string} userId
   * @param {string} confirmType either CONFIRM_EMAIL or CONFIRM_SMS
   *
   * @return {XMUserConfirm} new confirmation object with different ID
   */
  async resendConfirmation(confirmId, callback) {
    const _m = "resendConfirm";

    let xConfirm;
    let error = null;
    try {
      let apiUrl = this.getURL(this.urlHost, `/s/confirm/${confirmId}/resend`);
      xConfirm = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, "server error:", e);
      error = e;
      xConfirm = null;
    }
    return callback ? callback(error, xConfirm) : xConfirm;
  }

  /**
   * Send confirmation by an Id to server and get results back.
   *
   * @param {string} confirmId confirmation identifier
   * @param {string} sourceId identifier of source. If null, we'll look up IP
   *
   * @return {string} status PROP_ACCEPTED, PROP_PENDING, PROP_BLOCKED or null
   */
  async confirmById(confirmId, sourceId, callback) {
    const _m = "confirmById";

    let confirmObj;
    let error = null;
    try {
      let apiUrl = this.apiConfirmById(confirmId, sourceId);
      confirmObj = await this.requestGET(apiUrl, null);
      if (confirmObj && confirmObj.isConfirmed(false))
        this.refreshUserInfo(null);
    } catch (e) {
      this.error(_m, "server:", e);
      error = e;
      confirmObj = null;
    }
    return callback ? callback(error, confirmObj) : confirmObj;
  } // confirmById

  /**
   * Submit a User Feedback
   *
   * @param {string} requestId confirmation identifier
   * @param {string} sourceId identifier of source. If null, we'll look up IP
   *
   * @return {string} status PROP_ACCEPTED, PROP_PENDING, PROP_BLOCKED or null
   */
  async submitFeedback(xUserFeedback, callback) {
    const _m = "submitFeedback";

    let result;
    let error = null;
    try {
      let query = this.getURL(this.urlHost, `/s/submit/feedback`);

      result = await this.requestPOST(query, xUserFeedback);
    } catch (e) {
      this.error(_m, "server:", e);
      error = e;
      result = null;
    }
    return callback ? callback(error, result) : result;
  } // submitPasswordChange

  // -------------------------------

  /**
   * Check if given instance of XMObject can
   * be updated by the currently logged in user.
   *
   * @param {XMObject} xmobject
   */
  validateWrite(xmobject) {
    let loggedInUserId = this.getUserId();
    let ownerId = xmobject ? xmobject.getOwnerId() : null;
    if (ownerId == null || loggedInUserId == null) return false;

    if (ownerId !== loggedInUserId) return false;

    return true;
  } // validateWrite

  // ------------------- HASHTAG / USERTAG RELATED SERVICES ---------------------

  /**
   *
   * @param {number} max
   * @return {XResultList}
   * @callback
   */
  async fetchSuggestedHashtags(offset = null, max = null, callback) {
    if (!max) max = 20;

    let url = this.getURL(this.urlHost, "/s/hashtag/suggest");
    url += "?max=" + max;
    if (offset) url += "&offset=" + offset;
    return this.requestGET(url, null, callback);
  }

  /**
   *
   * @param {number} max maximum number of userIds to retrieve
   * @param {number} offset starting position, if different from zero
   * @return {XResultList}
   * @callback
   */
  async fetchSuggestedUsertags(offset = null, max = null, callback) {
    if (!max) max = 20;
    let url = this.getURL(this.urlHost, "/s/usertag/suggest");
    url += "?max=" + max;
    if (offset) url += "&offset=" + offset;
    url += "&incl=userinfo|followings";

    let resultList = await this.requestGET(url, null);

    if (callback) return callback(resultList);
    else return resultList;
  }

  // --------------- POST-RELATED SEARCHES / FETCHES ----------------------------

  /**
   * Fetch matching keywords delmited by spaces. hashtags and mentions will give
   * priority in results, follow by generaal results (eventually).
   *
   * @param {string} keywords delimited by space
   * @param {boolean} inclSelf include own posts?
   * @param {array} field names to include in the result (catObj for whole object)
   * @param {number} max
   * @param {number} min
   * @return {XResultMap}
   */
  async fetchSearchChoices(keywords, max = null, min = null, callback) {
    // const postProcess = function (err, resultMap) {
    //   if (err) return callback(err, null);
    //   // no filter processing
    //   callback(null, resultMap);
    // }; // postProcess

    let urlKwdTags = this.getURL(this.urlHost, "/u/posts/srch/choices");
    let result = await this.searchPostPhrase(
      urlKwdTags,
      keywords,
      false,
      false,
      max,
      min,
      //postProcess,
    );

    return result;
  } // fetchKwd2Tags

  async fetchSearchResultChoices(
    type,
    phrase,
    offset = 10,
    max = null,
    callback,
  ) {
    let url = this.getURL(this.urlHost, "/u/posts/srch/choices");

    let apiUrl = url + `?phrase=${encodeURIComponent(type)}${phrase}`;
    if (offset) apiUrl += `&offset=${offset}`;
    if (max) apiUrl += `&max=${max}`;
    if (type !== "#") apiUrl += "&incl=userinfo|followings";

    let resultList = await this.requestGET(apiUrl, null);

    if (callback) return callback(resultList);
    else return resultList;
  }

  async searchUserResult(phrase, offset, max, callback) {
    let resultList;
    try {
      let url = this.getURL(this.urlHost, `/u/users/srch/phrase`);
      resultList = await this.requestPOST(url, {
        incl: "userinfo|followings|followers",
        q: phrase,
        offset,
        max,
      });
    } catch (e) {
      console.error(e);
    }

    if (callback) {
      return callback(resultList);
    } else {
      return resultList;
    }
  }

  /**
   * Fetch matching hashtags and suggestions.
   *
   * @param {string} keywords delimited by space
   * @param {boolean} inclSelf include own posts?
   * @param {array} field names to include in the result (catObj for whole object)
   * @param {number} max
   * @param {number} min
   * @return {XResultMap}
   */
  async fetchHashtagChoices(keywords, max = null, min = null, callback) {
    const postProcess = function (err, resultMap) {
      if (err) return callback(err, null);
      // no filter processing
      callback(null, resultMap);
    }; // postProcess

    let urlKwdTags = this.getURL(this.urlHost, "/u/posts/srch/choices");
    let result = this.searchPostPhrase(
      urlKwdTags,
      "#" + keywords,
      false,
      false,
      max,
      min,
      postProcess,
    );

    return result;
  } // fetchHashtags

  /**
   * Fetch matching mentions and suggestions.
   *
   * @param {string} keywords delimited by space
   * @param {boolean} inclSelf include own posts?
   * @param {array} field names to include in the result (catObj for whole object)
   * @param {number} max
   * @param {number} min
   * @return {XResultMap}
   */
  async fetchMentionChoices(keywords, max = null, min = null, callback) {
    const postProcess = function (err, resultMap) {
      if (err) return callback(err, null);
      // no filter processing
      callback(null, resultMap);
    }; // postProcess

    let urlKwdTags = this.getURL(this.urlHost, "/u/posts/srch/choices");
    let result = this.searchPostPhrase(
      urlKwdTags,
      "@" + keywords,
      false,
      false,
      max,
      min,
      postProcess,
    );

    return result;
  } // fetchMentions

  /**
   * Fetch a list of categories by their IDs and cache them
   *
   * @param {string} url searc h API's URL to use
   * @param {string} phrase delimited by
   * @param {string} inclFields INCL_TAGINFO for now
   * @param {string} expanded true to include expanded tags
   * @param {string} max max entries
   * @param {string} min entries, which means proceed with partial search if initial
   * result is below this number
   * @param params any arguments or filters
   * @return {XResultList}
   */
  async searchPostPhrase(
    url,
    phrase,
    inclFields = null,
    expanded = null,
    max = null,
    min = null,
    callback,
  ) {
    const _m = "shP";

    let apiUrl = url + "?phrase=" + encodeURIComponent(phrase);
    if (inclFields) apiUrl += `&fields=${inclFields}`;
    if (expanded) apiUrl += `&expanded=${String(expanded)}`;
    if (max) apiUrl += `&max=${max}`;
    if (min) apiUrl += `&min=${min}`;
    apiUrl += "&incl=userinfo";
    //let response = null;
    let error = null;
    let resultList;
    // debugger;
    try {
      resultList = await this.requestGET(apiUrl, null);
    } catch (e) {
      this.error(_m, e);
      error = e;
    }
    if (callback) return callback(error, resultList);
    else return resultList;
  } // searchPostPhrase

  // ------------------------------- POST SERVICES -----------------------------------

  /**
   * Submit new post (create) to server, with specs
   * for pictures
   *
   * THIS IS WORK IN PROGRESS
   *
   * @param {XMPost} newPost
   * @param {File[]} files array of local files needed
   * to trigger upload
   * @param {{}} params TBD
   * @callback callback
   */
  async submitPost(newPost, files, params, callback) {
    const _m = "subPost";

    // let listId = newPost.getId();
    // this.log(_m, "list to create/save ", newList);
    if (newPost.getOwnerId() == null) newPost.setOwnerId(this.getUserId());
    if (!this.validateWrite(newPost)) {
      if (callback != null) callback("Unable to Submit Post, null");
      // to-do: dee proper error object
      else return false;
    }

    let formData = new FormData();
    if (!newPost.hasOwner()) newPost.setOwnerId(this.getUserId());
    // formData.append("post", newPost.toJSONString()); // moved to content
    if (files && files[0]?.m3u8) {
      newPost.setVideoUrl(files[0].m3u8);
      files[0].ori && newPost.setOriginalVideoUrl(files[0].ori);
      files[0].screen && newPost.setMainImageURL(files[0].screen);
      files[0].duration &&
        newPost.setVideoDuration(parseInt(files[0].duration));
      files[0].width && newPost.setVideoWidth(parseInt(files[0].width));
      files[0].height && newPost.setVideoHeight(parseInt(files[0].height));
    } else if (files) {
      const imageFiles = [];
      const imageMeta = [];
      for (const file of files) {
        imageFiles.push(file.ori);
        const {heads, width: wid, height: hgt} = file;
        if (heads && wid && hgt) {
          imageMeta.push({wid, hgt, meta: {heads}});
        }
      }
      if (imageMeta.length) {
        newPost.setImageMeta(imageMeta);
      }
      newPost.setImageURLs(imageFiles);
    }

    let savedPost;
    let apiError;
    try {
      let url = this.getURL(this.urlHost, "/u/post");
      savedPost = await this.requestPOST_FormData(url, newPost, formData);
    } catch (e) {
      this.error(_m, e);
      apiError = e;
    }
    if (callback) callback(apiError, savedPost);
    else return savedPost;
  } // submitPost

  /**
   * Submit a repost (create) to server, with specs
   * for pictures. Repost differs from sharing a post,
   * in that it is a real post that references another
   * post.
   *
   * THIS IS WORK IN PROGRESS
   *
   * @param {XMPost} newPost
   * @param {string} refPostId referenced post
   * @param {File[]} imageFiles array of local files needed
   * to trigger upload
   * @param {{}} params TBD
   * @callback callback
   *
   * @see ~SharesXXX
   */
  async submitRepost(newPost, files, params, callback) {
    const _m = "subRepost";

    if (newPost.getOwnerId() == null) newPost.setOwnerId(this.getUserId());
    if (!this.validateWrite(newPost)) {
      if (callback != null) callback("Unable to Submit Repost, null");
      // to-do: dee proper error object
      else return false;
    }

    let formData = new FormData();
    if (!newPost.hasOwner()) newPost.setOwnerId(this.getUserId());
    // formData.append("post", newPost.toJSONString()); // moved to content
    if (files && files[0]?.m3u8) {
      newPost.setOriginalVideoUrl(files[0]);
    } else if (files) {
      const imageFiles = [];
      for (let i in files) {
        imageFiles.push(files[i].ori);
      }
      newPost.setImageURLs(imageFiles);
    }

    let savedPost;
    let apiError;
    try {
      let url = this.getURL(this.urlHost, "/u/repost");
      savedPost = await this.requestPOST_FormData(url, newPost, formData);
    } catch (e) {
      this.error(_m, e);
      apiError = e;
    }
    if (callback) callback(apiError, savedPost);
    else return savedPost;
  } // submitRepost

  /**
   * Delete a post by the owner
   *
   * @param {string} userId use user ID
   * @param {string} section one of UserProps.SETTINGS_*
   * @param {{}} params any arguments or filters
   * @return {XUserInfo} subclass of it which is basically specific
   * settings like XAccountSettings, XProfileSettings, etc.
   */
  async deletePost(postId, callback) {
    const _m = "delPost";
    let error = null;
    let result = null;
    try {
      let url = this.getURL(this.urlHost, `/u/post/${postId}`);
      result = await this.requestDELETE(url, null);
      return callback ? callback(null, result) : result;
    } catch (e) {
      this.error(_m, e);
      if (callback) callback(error, null);
      else throw e;
    }
  } // deletePost

  // ------------------------------- POST COMMMENTS -----------------------------------

  /**
   * Submit new comment to the server. If the comment object has
   * a parent comment Id, then this comment is a reply to that
   * parent comment. if parent comment Id is null, then this
   * comment is a reply to the post.
   *
   *
   * @param {string} postId post the comment is associated with, but
   * does not have to be immediate reply! can be nested.
   * @param {XMComment} newComment
   * @param {File[]} files array of local files needed
   * to trigger upload
   * @param {{}} params TBD
   * @callback callback
   */
  async submitComment(postId, newComment, files, params, callback) {
    const _m = "subPost";

    // let listId = newPost.getId();
    // this.log(_m, "list to create/save ", newList);
    if (postId == null) postId = newComment.getPostId();
    let parentCommentId = newComment.getParentCommentId();
    let forPost = parentCommentId == null;
    if (newComment.getOwnerId() == null)
      newComment.setOwnerId(this.getUserId());
    if (!this.validateWrite(newComment)) {
      if (callback != null) callback("Unable to Submit Comment");
      // to-do: dee proper error object
      else return false;
    }

    let formData = new FormData();
    if (!newComment.hasOwner()) newComment.setOwnerId(this.getUserId());
    // formData.append("post", newPost.toJSONString()); // moved to content
    if (files && files[0]?.m3u8) {
      newComment.setVideoUrl(files[0].m3u8);
      files[0].ori && newComment.setOriginalVideoUrl(files[0].ori);
      files[0].screen && newComment.setMainImageURL(files[0].screen);
      files[0].duration &&
        newComment.setVideoDuration(parseInt(files[0].duration));
      files[0].width && newComment.setVideoWidth(parseInt(files[0].width));
      files[0].height && newComment.setVideoHeight(parseInt(files[0].height));
    } else if (files) {
      const imageFiles = [];
      for (let i in files) {
        imageFiles.push(files[i].ori);
      }
      newComment.setImageURLs(imageFiles);
    }
    // formData.append("images", files);
    let savedComment;
    let apiError;
    try {
      let endpoint = forPost
        ? `/u/post/${postId}/comment`
        : `/u/comment/${parentCommentId}/comment`;
      let url = this.getURL(this.urlHost, endpoint);
      savedComment = await this.requestPOST_FormData(url, newComment, formData);
    } catch (e) {
      this.error(_m, e);
      apiError = e;
    }
    if (callback) callback(apiError, savedComment);
    else return savedComment;
  } // submitPost

  /**
   * Delete a post comment by the comment owner
   *
   * @param {string} postId
   * @param {string} commentId
   * @param {{}} params any arguments or filters
   * @return {XUserInfo} subclass of it which is basically specific
   * settings like XAccountSettings, XProfileSettings, etc.
   */
  async deletePostComment(commentId, callback) {
    const _m = "delPost";
    let error = null;
    let result = null;
    try {
      let url = this.getURL(this.urlHost, `/u/comment/${commentId}`);
      result = await this.requestDELETE(url, null);
      return callback ? callback(null, result) : result;
    } catch (e) {
      this.error(_m, e);
      if (callback) callback(e, null);
      else throw e;
    }
  } // deletePostComment

  // -------------------------- LOG SERVICES ----------------------------

  /**
   * Send a log record to server
   *
   * @param {XMActivityLog} activityLog constructed log
   *
   * @return {boolean} should be true if no issue. Sending is async
   */
  async transmitLog(activityLog, props = null) {
    const _m = "tlog";
    try {
      let logId = activityLog.getDerivedID();
      let url = this.urlActivityLog + logId;
      await this.requestPOST(url, activityLog);
    } catch (e) {
      // probably should keep silent in the web browser
      this.warn(_m, e);
    }
    return true;
  } // transmitLog

  /**
   * Log a message on the server side. This is useful for mobile
   * debugging..for now
   *
   * @param {string=} m method name (optional)
   * @param {string} msg
   */
  async logMessageServer(m, msg) {
    const _m = "logms";
    try {
      msg = m ? m + ": " + msg : msg;
      console.log(`${_m}: ${msg}`);
      await this.requestPOST(this.urlLogMessage, {msg: msg});
    } catch (e) {
      // probably should keep silent in the web browser
      this.warn(_m, e);
    }
    return true;
  }

  // ----------------------- USER SIGN-UP / AUTH ------------------------

  /**
   * User signup
   *
   * @param {string} userInfo user to follow
   *
   * @return {XUserInfo} upated user info with new follow
   */
  async signupUser(userInfo, authInfo, callback) {
    const _m = "userFollows";
    let newUser;
    let error = null;
    try {
      let content = {
        userinfo: userInfo.getData(),
        authinfo: authInfo.getData(),
      };

      let encrypted = Util.EncryptJSON(content);

      let url = this.getURL(this.urlHost, `/s/signup`);
      newUser = await this.requestPOST(url, encrypted);
    } catch (e) {
      error = XError.FromRequestError(e);
      this.error(_m, e);

      newUser = null;
    }

    return callback ? callback(error, newUser) : newUser;
  } // signupUser

  // ----------------------- LOAD SPECIAL RESOURCES ---------------------

  /**
   * Fetch help file in MD format.
   *
   * @param {string=} helpId null to retreive latest template. Give a
   * user ID will retrieve user's confirmed version.
   * @param {string} locale language requirement. default is "en"
   * @param {*} callback
   */
  async fetchHelpFile(helpId, locale, callback) {
    if (Util.StringIsEmpty(helpId)) return "No Help??";

    if (locale == null) locale = this.getLanguagePref();
    let url = `/doc/md/help/${locale}/${helpId}`;
    return this.fetchBinaryData(url, callback);
  }

  /**
   * Fetch the About Us markdown text that is suitable to display publicly.
   * @param {string} locale language. default is "en"
   * @callback
   * @return {XBinaryData} wrapper containing marked down TOS text.
   */
  async fetchAboutUs(locale, callback) {
    if (locale == null) locale = "en";
    return this.fetchBinaryData(`/doc/md/legal/${locale}/aboutus`, callback);
  }

  /**
   * Fetch TOS for user to confirm, or what user has already confirmed.
   *
   * @param {string=} userId null to retreive latest template. Give a
   * user ID will retrieve user's confirmed version.
   * @param {*} locale
   * @param {*} callback
   */
  async fetchUserTOS(userId, locale, callback) {
    if (locale == null) locale = "en";
    let url = userId
      ? `/doc/md/legal/${locale}/tos/user/${userId}`
      : `/doc/md/legal/${locale}/tos/user`;
    return this.fetchBinaryData(url, callback);
  }

  /**
   * Fetch the TOS markdown text that is suitable to display publicly.
   * @param {string} locale language. default is "en"
   * @callback
   * @return {XBinaryData} wrapper containing marked down TOS text.
   */
  async fetchPublicTOS(locale, callback) {
    if (locale == null) locale = "en";
    return this.fetchBinaryData(`/doc/md/legal/${locale}/tos/public`, callback);
  }

  /**
   * Fetch the DMCA notice markdown text that is suitable to display publicly.
   *
   * @param {string} locale language. default is "en"
   * @callback
   * @return {XBinaryData} wrapper containing marked down TOS text.
   */
  async fetchDMCA(locale, callback) {
    if (locale == null) locale = "en";
    return this.fetchBinaryData(`/doc/md/legal/${locale}/dmca`, callback);
  }

  /**
   * Fetch the user guidelines markdown text that is suitable to display publicly.
   *
   * @param {string} locale language. default is "en"
   * @callback
   * @return {XBinaryData} wrapper containing marked down TOS text.
   */
  async fetchUserGuidelines(locale, callback) {
    if (locale == null) locale = "en";
    return this.fetchBinaryData(
      `/doc/md/legal/${locale}/user_guidelines`,
      callback,
    );
  }

  /**
   * Fetch the legal guidelines markdown text that is suitable to display publicly.
   *
   * @param {string} locale language. default is "en"
   * @callback
   * @return {XBinaryData} wrapper containing marked down TOS text.
   */
  async fetchLegalGuidelines(locale, callback) {
    if (locale == null) locale = "en";
    return this.fetchBinaryData(
      `/doc/md/legal/${locale}/legal_guidelines`,
      callback,
    );
  }

  disableTranslation(flag) {
    if (flag === true) {
      this["xlate"] = false;
      console.warn("Translation Disabled");
    }
  }

  translationDisabled() {
    return this["xlate"] === false;
  }

  async translateText(fromLang, toLang, text, callback) {
    if (this.translationDisbled()) return callback(null);

    const API_KEY = this.getPortal().getGoogleAPIKey();

    let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    url += "&q=" + encodeURI(text);
    url += `&source=${fromLang}`;
    url += `&target=${toLang}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(callback)
      .catch((error) => {
        console.log("There was an error with the translation request: ", error);
      });
  }

  /**
   *
   * @param {string} fromLang
   * @param {string} toLang
   * @param {string} text
   * @param {function(XError, *)} callback error and result
   */
  async translateText_notworking(fromLang, toLang, text, callback) {
    if (this.translationDisbled()) return callback(null);

    const API_KEY = this.getPortal().getGoogleAPIKey();

    let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    url += "&q=" + encodeURI(text);
    url += `&source=${fromLang}`;
    url += `&target=${toLang}`;
    return this.requestExternalGET(url, null, callback);
  }

  async detectLanguage(text, callback) {
    const API_KEY = this.getPortal().getGoogleAPIKey();

    let url = `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`;
    url += "&q=" + encodeURI(text);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({q: text}),
    })
      .then((res) => res.json())
      .then(callback)
      .catch((error) => {
        console.log("There was an error with the translation request: ", error);
      });
  }

  /**
   *
   * @param {string} text
   * @param {function(XError, *)} callback  error and result
   */
  async detectLanguage_notworking(text, callback) {
    // let _m = "detectLang";
    let apiKey = this.getPortal().getGoogleAPIKey();
    let url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`;
    url += "&q=" + encodeURI(text);

    let p = this.requestExternalPOST(url, null, (err, result) => {
      this._processResult(err, result, callback);
    });
    return p;
  }

  // ------------------- VERIFICATION CODE DELIVERY ---------------------

  /**
   * Request server to delivery a verification code to an email address
   *
   * @param {string} code clear text to show in an email
   * @param {string} email
   * @return {boolean} true if no errors, false if not delivered for any reason
   */
  async sendVerificationCode(code, email, callback) {
    const _m = "pre";

    let url = this.getURL(this.urlHost, "/s/pre");
    let error = null;
    let result = false;
    try {
      let content = {
        code: code,
        email: email,
      };
      result = await this.requestPOST(url, content);
    } catch (e) {
      this.error(_m, e);
      error = e;
    }

    return callback ? callback(error, result) : result;
  }

  /**
   * remove exif from image
   * @param {File} file
   */
  _removeExif(file) {
    return new Promise((resolve, reject) => {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return reject("Wrong file type");
      }
      const fileURL = URL.createObjectURL(file);
      const canvas = document.createElement("canvas");
      const canvasContext = canvas.getContext("2d");
      const image = new Image();
      image.src = fileURL;
      image.onload = (e) => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvasContext.drawImage(
          e.target,
          0,
          0,
          image.naturalWidth,
          image.naturalHeight,
        );
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(fileURL);
          blob.lastModifiedDate = new Date();
          blob.name = file.name;
          return resolve(blob);
        }, file.type);
      };
      image.onerror = () => {
        return reject("Failed to remove exif");
      };
    });
  }

  /**
   * upload file
   * @param {File} file
   * @param {Function} callback
   */
  async uploadFile(file, hasExif, callback, path = "/media/upload") {
    const fileSize = file.size;
    let md5 = null;

    if (fileSize <= 300000000) {
      // 300 MB
      try {
        md5 = await fileToMd5(file);
      } catch (error) {}
    }

    const _m = "uploadFile";
    const url = this.getURL(process.env.REACT_APP_MEDIA_UPLOAD, path);
    const formData = new FormData();
    const userInfo = this.getXUserInfo();
    const lv = userInfo.getInfluencerLevel();
    // const lv = 5;
    let result;
    let error;
    if (hasExif) {
      try {
        const blob = await this._removeExif(file);
        if (blob) {
          file = blob;
        }
      } catch (err) {
        console.log(err);
      }
    }

    formData.append("file", file, file.name);
    formData.append("user_id", userInfo.data._id);
    // formData.append("auth_token", this.portal.getUserToken());
    // try {
    //   this.requestPOST_FormData(url, null, formData, callback);
    // } catch (e) {
    //   this.error(_m, e);
    //   error = e;
    // }
    // return callback ? callback(error, result) : result;
    // const auth =
    //   "Basic " + Buffer.from("getterupload:getterupload").toString("base64");
    let config = {
      // withCredentials: true,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "multipart/form-data",
        authorization: this.portal.getUserToken(),
        userid: this.portal.getUserId(),
        filename: file.name,
        // lossless: hasExif ? 0 : 1,
        lossless: 1,
        lv,
        env: process.env.REACT_APP_GETTER_ENV,
      },
    };

    if (md5) {
      config.headers.md5 = md5;
    }
    const cancelTokenSource = axios.CancelToken.source();
    const cancelUpload = cancelTokenSource.cancel;
    let complete = false;
    let timeout = false;
    let timeoutInterval = setInterval(() => {
      if (!timeout) {
        timeout = true;
      } else if (!complete) {
        cancelUpload();
      }
    }, 20000);
    axios({
      url,
      method: "post",
      data: formData,
      ...config,
      onUploadProgress: (p) => {
        timeout = false;
        if (p.loaded == p.total) {
          complete = true;
        }
        callback(null, null, 100 * (p.loaded / p.total));
      },
      cancelToken: cancelTokenSource.token,
    })
      .then((response) => {
        result = response.data;
        if (result.ori) {
          callback(null, result);
        } else {
          error = result.error;
          callback(error);
        }
      })
      .catch((e) => {
        error = e;
        callback(error);
      })
      .finally(() => {
        clearInterval(timeoutInterval);
      });
  }

  /**
   * Construct API URL to report content(post) (/u/user/:userId/report/post/:postId/:reasonId)
   *
   * @param {string} userId
   * @param {string} postId
   * @param {string} reasonId
   * @return {string} fully qualified URL
   */
  apiReportPost(userId, postId, reasonId) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/report/post/${postId}/${reasonId}`,
    );

    return query;
  } // apiReportPost

  /**
   * Construct API URL to report user (/u/user/:userId/report/user/:targetId/:reasonId)
   *
   * @param {string} userId
   * @param {string} targetId
   * @param {string} reasonId
   * @return {string} fully qualified URL
   */
  apiReportUser(userId, targetId, reasonId) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/report/user/${targetId}/${reasonId}`,
    );

    return query;
  } // apiReportUser

  /**
   * Report content(post) by postId and reasonId
   *
   * @param {string} postId
   * @param {number} reasonId
   */
  async reportPost(postId, reasonId, callback) {
    const _m = "reportPost";
    const loggedInUserId = this.getUserId();
    const reasonIdPrefix = "rsn";
    let result;
    let error = null;
    try {
      let getUrl = this.apiReportPost(
        loggedInUserId,
        postId,
        reasonIdPrefix + reasonId,
      );
      result = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // reportPost

  /**
   * Report user by target userId and reasonId
   *
   * @param {string} targetId target userId
   * @param {number} reasonId
   */
  async reportUser(targetId, reasonId, callback) {
    const _m = "reportUser";
    const loggedInUserId = this.getUserId();
    const reasonIdPrefix = "rsn";
    let result;
    let error = null;
    try {
      let getUrl = this.apiReportUser(
        loggedInUserId,
        targetId,
        reasonIdPrefix + reasonId,
      );
      result = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // reportUser

  /**
   * Construct API URL to get muted users (/u/user/:userId/mutes/?offset=0&max=5&incl=userstats|userinfo)
   *
   * @param {string} userId
   * @param {number} max
   * @return {string} fully qualified URL
   */
  apiGetMutedUsers(userId, max) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/mutes/?offset=0&max=${max}&incl=userstats|userinfo`,
    );

    return query;
  } // apiGetMutedUsers

  /**
   * Get muted users
   *
   * @param {number} max
   * @param {(error, result) => void} callback
   */
  async getMutedUsers(max = 5, callback) {
    const _m = "getMutedUsers";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiGetMutedUsers(loggedInUserId, max);
      result = await this.requestGET(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // getMutedUsers

  /**
   * Construct API URL to get users who I follow (/u/user/:userId/followings/?offset=0&max=5&incl=userstats|userinfo)
   *
   * @param {string} userId
   * @param {number} max
   * @return {string} fully qualified URL
   */
  apiGetFollowingUsers(userId, max) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/followings/?offset=0&max=${max}&incl=userstats|userinfo`,
    );

    return query;
  } // apiGetFollowingUsers

  /**
   * Get following users
   *
   * @param {string} userId
   * @param {number} max
   * @param {(error, result) => void} callback
   */
  async getFollowingUsers(userId, max = 5, callback) {
    const _m = "getFollowingUsers";
    let result;
    let error = null;
    try {
      let getUrl = this.apiGetFollowingUsers(userId, max);
      result = await this.requestGET(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // getFollowingUsers

  /**
   * Construct API URL to get blocked users (/u/user/:userId/blockers/?offset=0&max=5&incl=userstats|userinfo)
   *
   * @param {string} userId
   * @param {number} max
   * @return {string} fully qualified URL
   */
  apiGetBlockedUsers(userId, max) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/blockers/?offset=0&max=${max}&incl=userstats|userinfo`,
    );

    return query;
  } // apiGetBlockedUsers

  /**
   * Get blocked users
   *
   * @param {string} userId
   * @param {number} max
   * @param {(error, result) => void} callback
   */
  async getBlockedUsers(userId, max = 5, callback) {
    const _m = "getBlockedUsers";
    let result;
    let error = null;
    try {
      let getUrl = this.apiGetBlockedUsers(userId, max);
      result = await this.requestGET(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // getFollowing

  /**
   * Construct API URL to mute user (/u/user/:userId/mutes/:targetId)
   *
   * @param {string} userId
   * @param {string} targetUserId
   * @return {string} fully qualified URL
   */
  apiMuteUser(userId, targetUserId) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/mutes/${targetUserId}`,
    );

    return query;
  } // apiMuteUser

  /**
   * Mute user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async muteUser(targetUserId, callback) {
    const _m = "muteUser";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiMuteUser(loggedInUserId, targetUserId);
      result = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // muteUser

  /**
   * Unmute user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async unmuteUser(targetUserId, callback) {
    const _m = "unmuteUser";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiMuteUser(loggedInUserId, targetUserId);
      result = await this.requestDELETE(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // unmuteUser

  /**
   * Construct API URL to follow user (/u/user/:userId/follows/:targetId)
   *
   * @param {string} userId
   * @param {string} targetUserId
   * @return {string} fully qualified URL
   */
  apiFollowUser(userId, targetUserId) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/follows/${targetUserId}`,
    );

    return query;
  } // apiFollowUser

  /**
   * Follow user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async followUser(targetUserId, callback) {
    const _m = "followUser";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiFollowUser(loggedInUserId, targetUserId);
      result = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // followUser

  /**
   * Unfollow user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async unfollowUser(targetUserId, callback) {
    const _m = "unfollowUser";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiFollowUser(loggedInUserId, targetUserId);
      result = await this.requestDELETE(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // unfollowUser

  /**
   * Construct API URL to block user (/u/user/:userId/blocks/:targetId)
   *
   * @param {string} userId
   * @param {string} targetUserId
   * @return {string} fully qualified URL
   */
  apiBlockUser(userId, targetUserId) {
    let query = this.getURL(
      this.urlHost,
      `/u/user/${userId}/blocks/${targetUserId}`,
    );

    return query;
  } // apiBlockUser

  /**
   * Block user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async blockUser(targetUserId, callback) {
    const _m = "blockUser";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiBlockUser(loggedInUserId, targetUserId);
      result = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // blockUser

  /**
   * Unblock user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async unblockUser(targetUserId, callback) {
    const _m = "unblockUser";
    const loggedInUserId = this.getUserId();
    let result;
    let error = null;
    try {
      let getUrl = this.apiBlockUser(loggedInUserId, targetUserId);
      result = await this.requestDELETE(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // unblockUser

  /**
   * Construct API URL to block user (/u/user/:userId/blocks/:targetId)
   *
   * @param {string} userId
   * @param {string} targetUserId
   * @return {string} fully qualified URL
   */
  apiSuspendUser(targetUserId) {
    let query = this.getURL(
      this.urlHost,
      `/admin/user/${targetUserId}/suspend`,
    );

    return query;
  } // apiSuspendUser

  /**
   * Block user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async suspendUser(targetUserId, callback) {
    const _m = "suspendUser";
    let result;
    let error = null;
    try {
      let getUrl = this.apiSuspendUser(targetUserId);
      result = await this.requestPOST(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // suspendUser

  /**
   * Unblock user
   *
   * @param {string} targetUserId
   * @param {(error, result) => void} callback
   */
  async unSuspendUser(targetUserId, callback) {
    const _m = "unSuspendUser";
    let result;
    let error = null;
    try {
      let getUrl = this.apiUnSuspendUser(targetUserId);
      result = await this.requestDELETE(getUrl);
    } catch (e) {
      this.error(_m, e);
      error = e;
      result = null;
    }

    return callback ? callback(error, result) : result;
  } // unSuspendUser
} // class

export default GetterService;
