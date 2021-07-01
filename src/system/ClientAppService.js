import GA4React from "ga-4-react";
import XObject from "../core/model/XObject";
import XUserInfo from "../core/model/user/XUserInfo";
import {UserProps, XObjectProps} from "../core/model/ModelConsts";
import Session from "./Session";
import ObjectBase from "../core/ObjectBase";
import Global from "./Global";
import REST from "../core/net/REST";
import XRequest from "../core/model/net/XRequest";
import XError from "../core/model/XError";

Session.CheckIn();
XUserInfo.CheckIn();

const PROPS = "props";
export const PROP_USERINFO = "_ui";

// const FREQ_USER_STATUS_CHECK = 300000; // 5 minute interval to fetch new user info

/**
 * Applicaton client-side service base object.
 * This object is designed to encapsulate
 * non-UI level application functionality that
 * can be performed either locally, or on
 * the server side. This way, UI components
 * have clear separation of application logic.
 * <p/>
 * There should be one instance of this running
 * in the virtual machine, on the browser. It
 * is also expected that an instance of this
 * gets launched on the server side for SSR.
 */
export class ClientAppService extends ObjectBase {
  /**
   * Represents a single instance app context/helper.
   * @constructor
   * @param props properties to copy into this object
   */
  constructor(classname, props) {
    super(classname);

    this[PROPS] = {};

    if (!props && props) Object.assign(this[PROPS], props);

    this.classname = classname;
    this._iid = "R" + Math.random();
    this.reactGA = null; // specially denote needing initialization
    // this._iid = "R" + Date.now();
  }

  applyConfig(props) {}

  /**
   * @retrn {string}
   */
  getInstanceId() {
    return this._iid;
  }

  getClassname() {
    return this.classname;
  }

  /**
   * @return {Portal}
   */
  getPortal() {
    if (this.portal == null) {
      this.portal = Global.GetPortal();
    }
    return this.portal;
  }

  /**
   *
   * @param {Portal} portal
   */
  setPortal(portal) {
    this.portal = portal;
  }

  /**
   *
   * @param {ObjectManager} om
   */
  setObjectManager(om) {
    this.om = om;
  }

  /**
   * @return {ObjectManager}
   */
  getObjectManager() {
    return this.om;
  }

  /**
   *
   * @param {} nm
   */
  setNetworkManager(nm) {
    this.nm = nm;
  }

  /**
   * @return {NetworkManager}
   */
  getNetworkManager() {
    return this.nm;
  }
  // ---------------------- Property I/O ------------------------------

  /**
   * Return stored props
   *
   * @return {{}}
   */
  getProps() {
    return this[PROPS];
  }

  /**
   * Set a property value, which may dispatch any watchers
   *
   * @param {string} label
   * @param {*} value
   * @return {*} previous value
   */
  set(label, value) {
    let props = this[PROPS];
    let prev = props[label];
    if (prev === value) return null;
    props[label] = value;
    this._dispatchHandlers(label, prev, value);
    return prev;
  }

  /**
   *
   * @param {string} label
   * @param {*} defaultVal
   * @return {*} previously set value
   */
  get(label, defaultVal = null) {
    let props = this.getProps();
    let val = props[label];
    return val ? val : defaultVal;
  }

  // --------------------------- Session I/O ----------------------------------

  /**
   * @return {Session}
   */
  getSession() {
    return this.portal.getSession();
  }

  /**
   *
   * @param {string} name
   * @param {*} value
   * @return {*} previous value
   */
  setSessionVar(name, value) {
    return this.getSession().set(name, value);
  }

  /**
   *
   * @param {string} name
   * @param {*} defaultVal
   * @return {*}
   */
  getSessionVar(name, defaultVal) {
    return this.getSession().get(name, defaultVal);
  }

  // ------------------------- Store / Watching User Information ------------------------------

  /**
   *
   * @param {XUserInfo} userInfo
   * @param {*} rememberMe
   */
  setUserInfo(userInfo, rememberMe = true) {
    let session = this.getSession();
    session.setUserInfo(userInfo, rememberMe);
    this._dispatchHandlers(PROP_USERINFO, null, userInfo);
  }

  /**
   *
   * @param {function(this, PROP_USERINFO, string, string)} handler
   */
  watchUserInfo(handler) {
    this.watchProperty(PROP_USERINFO, handler);
  }

  /**
   *
   * @param {function} handler
   */
  unwatchUserInfo(handler) {
    this.unwatchProperty(PROP_USERINFO, handler);
  }

  /**
   * Update session/cookie with the data inside a XUserInfo
   * record. It's OK to only set the field of the value to
   * change and leave all others null or undefined.
   *
   * @param {XUserInfo} userInfo object containing fields to change
   * @param {boolean=} rememberMe true to set expiration in the future (30 days?)
   */
  updateUserInfo(userInfo, rememberMe = true) {
    let session = this.getSession();
    userInfo = XUserInfo.Unwrap(userInfo);
    session.updateUserInfo(userInfo, false, rememberMe);
    this.initUser();

    this._dispatchHandlers(PROP_USERINFO, null, userInfo);
  }

  // ------------------------ LOG / DEBUGGING SUPPORT --------------------------------

  /**
   * @return {string}
   */
  toString() {
    let prefix = "[" + this.getInstanceId() + "]:";
    return prefix + JSON.stringify(this.props);
  }

  /**
   * @return {{}}
   */
  getUserInfo() {
    return this.getSession().getUserInfo();
  }

  /**
   * @return {XUserInfo}
   */
  getXUserInfo() {
    return this.getSession().getXUserInfo();
  }

  /**
   * Derive URL based on host and path. Simple concatenation
   * for now but it's commonly called.
   *
   * @param {string} host
   * @param {string} path
   * @return {string}
   */
  getURL(host, path) {
    if (host) return host + path;
    else return "http://localhost:8080" + path;
  }

  // ---------------- USER RELATED SERVICES ------------------------

  /**
   * Return current logged in user ID, which is
   * same as username.
   *
   * @return {string} userId of logged in user.
   *
   * @see #getUsername
   */
  getUserId() {
    return this.getSession().getUserId();
  }

  /**
   * Return current logged in username
   *
   * @return {string} username of logged in user
   *
   * @see #isLoggedInUser
   */
  getUsername() {
    return this.getSession().getUsername();
  }

  getOriginalUsername(fallback = true) {
    return this.getSession().getOriginalUsername(fallback);
  }

  /**
   *
   * @param {string} alt  alternate name if there isn't any
   * @return {string}
   */
  getNickname(alt) {
    return this.getSession().getNickname(alt);
  }

  /**
   * Return current logged in user's avatar URL
   *
   * @return {string}
   */
  getAvatarUrl() {
    return this.getSession().getAvatarUrl();
  }

  getUserToken(defaultVal = null) {
    return this.getSession().getUserToken(defaultVal);
  }

  /**
   * Check if given userId/username is logged in
   *
   * @param {boolean} userId
   * @return {boolean} true if logged in
   *
   * @see ~getUsername
   * @see ~userLoggedIn
   */
  isLoggedInUser(userId) {
    return this.portal.getUserId() === userId;
  }

  /**
   * Check if an user is currently logged in.
   *
   * @return {boolean} true if there is an user logged in.
   *
   * @see ~getUsername
   * @see ~getUserId
   */
  userLoggedIn() {
    return this.portal.userLoggedIn();
  }

  deriveXObjectID(clsObj) {
    let type = null;
    if (clsObj && clsObj.GetTypeID) type = clsObj.GetTypeID();
    this.assertNotNull(
      type,
      "deriveXObjectID",
      "cannot determine class type",
      clsObj,
    );

    return XObject.DeriveID(type, this.getUserId());
  }

  deriveIDWithType(type) {
    this.assertNotNull(type, "deriveID", "Can't derive an ID without type");
    return XObject.DeriveID(type, this.getUserId());
  }

  // -------------------- Logging/Analytics Tracking ---------------------------

  /**
   * Force initialization / re-initialization of ReactGA. This
   * will include reading/re-reading current user ID. If no
   * google analytics for the current environment, this will be no-op
   *
   * @return {ReactGA} return (re)initialized ReactGA
   */
  _initializeReactGA(url) {
    let gaId = process.env.REACT_APP_GA_ID;
    if (gaId) {
      let userId = this.getUserId();
      if (userId == null) userId = UserProps.USERID_GUEST;
      const ga4react = new GA4React(gaId, {userId: userId});
      ga4react.initialize().then(
        (ga4) => {
          ga4.pageview(url);
          this.ReactGA = ga4;
        },
        (err) => {
          console.error(err);
        },
      );
    }
  }

  _trackingUser(userId) {
    // let reactGA = this.getReactGA();
    // if (reactGA) {
    //   if (userId == null) userId = this.getUserId();
    //   if (userId == null) userId = UserProps.USERID_GUEST;
    //   reactGA.setUserId(userId);
    // }
  }

  /**
   * Return appropriate Google Analytics module. This is purposely
   * delayed in initialization sinc environment may not have been
   * setup yet during initial instantiation.
   *
   * @return {ReactGA=} instance to use. Null means not available based on env.
   */
  getReactGA(url) {
    if (this.reactGA === null) {
      this.reactGA = this._initializeReactGA(url);
      return null;
    }
    return this.reactGA;
  }

  async trackPageView(url, source) {
    let reactGA = this.getReactGA(url);
    if (reactGA != null) {
      reactGA.pageview(url);
    }
  }

  /**
   *
   * @param {string} label
   * @param {string=} url  not used
   */
  async trackOutboundLink(label, url) {
    // let reactGA = this.getReactGA();
    // if (reactGA != null) {
    //   reactGA.outboundLink({label: label});
    // }
    return true;
  }

  /**
   *
   * @param {string} label action label
   * @param {string=} category  optional category (default='user')
   */
  async trackEvent(label, category) {
    // let reactGA = this.getReactGA();
    // if (reactGA != null) {
    //   if (category == null) category = "user";
    //   reactGA.event({category: category, action: label});
    // }
    return true;
  }

  /**
   * Make a call to REST API that returns an instance of XBinaryData
   *
   * @param {string} url API url WITHOUT prefix to backend!
   * @param {*} callback
   */
  async fetchBinaryData(url, callback) {
    let eobj = null;
    let binaryObj = null;
    let fqUrl = this.getURL(this.urlHost, url);
    try {
      binaryObj = await this.requestGET(fqUrl);
    } catch (err) {
      console.log(err);
      eobj = err;
    }
    return callback ? callback(eobj, binaryObj) : binaryObj;
  }

  // --------------------- OBJECT CACHING -------------------------

  /**
   * Return a cached object if it exists
   *
   * @param {string} objectId key to lookup
   */
  getCachedObject(objectId, defaultVal = null) {
    let om = this.getObjectManager();
    let obj = om.getFromCacheNoWait(objectId, null, null);

    return obj ? obj : defaultVal;
  }

  /**
   * Return a cached object if it exists
   *
   * @param {string} objectId key to lookup and untrack
   * @return {boolean} true if untracked
   */
  clearCachedObject(objectId, defaultVal = null) {
    let om = this.getObjectManager();
    let result = om.untrackFromCache(objectId);

    return result;
  }

  // ------------------------- GET RESOURCES -----------------------

  _args2str(params) {
    let argstr;
    if (params) {
      argstr = Object.keys(params)
        .map((label) => label + "=" + JSON.stringify(params[label]))
        .join("&");
    }
    return argstr ? argstr : "";
  }

  /**
   * Retrieve a resource object from server, but using the
   * system API (prefix /s). This tells server that the
   * request is initated by frontend logic and NOT by user.
   *
   * @param {string} id
   * @param {String} type
   * @param {{}} params
   * @param {boolean} cache
   * @param {function} callback
   */
  async getResource(id, type, params, cache = false, callback) {
    return this._getResource("s", id, type, params, cache, callback);
  }

  /**
   * @deprecated use either user_ or system_ versions
   *
   * @see ~getResource
   * @see ~user_getResource
   */
  async api_getResource(id, type, params, cache = false, callback) {
    return this._getResource("api", id, type, params, cache, callback);
  }

  /**
   * Retrieve a resource object from server, but using the
   * user API prefix (/u). This tells server to track that
   * it is initiated by a user.
   *
   * @param {string} id
   * @param {string} type
   * @param {{}} params
   * @param {boolean} cache
   * @param {function} callback
   */
  async user_getResource(id, type, params, cache = false, callback) {
    return this._getResource("u", id, type, params, cache, callback);
  }

  /**
   * Retrieve a model resource from the server. This version may
   * eventually replace the version in ObjectManager that goes
   * through cache, and NetworkManager. The API constructed looks
   * something like this:
   * <pre>
   *  /s/post/:postId
   * </pre>
   *
   * @param {string} entryType "api", "s", or "u"
   * @param {string} id object ID
   * @param {string} type object type (see ModelType)
   * @param {{}} params parameters to tag on to API url
   * @param {boolean} cache true to check cache first
   * @callback optional callback function
   * @return {XObject} should be an instance of XObject reconstructed
   * over the network
   */
  async _getResource(entryType, id, type, params, cache = false, callback) {
    const _m = `_getResource(${entryType},${id},${type}`;

    if (entryType == null) entryType = "s";
    let om = this.getObjectManager();
    let xmobject = null;
    if (cache) {
      xmobject = om.getFromCache(id);
      if (xmobject) return callback ? callback(null, xmobject) : xmobject;
    }

    let nm = this.getNetworkManager();
    let apiUrl = `${nm.getApiHost()}/${entryType}/${type}/${id}`;
    if (params) {
      apiUrl += "?" + this._args2str(params);
    }
    this.log(_m, "api: " + apiUrl);

    let err;
    try {
      xmobject = await this.requestGET(apiUrl, null, null);
      if (cache) {
        om.trackExisting(xmobject);
      }
    } catch (e) {
      err = e;
      // debugger;
      if (!callback) throw e;
    }
    return callback ? callback(err, xmobject) : xmobject;
  } // getResource

  // --------------- NETWORK COMMUNICATIONS (INTERNAL) --------------------

  /**
   * Make a GET request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {*} jsonData did you know GET can carry payload too in body?
   * @param {function} callback optional to async/await.
   * @return {object} http response.data()
   *
   * @see ~requestPOST
   * @see ~requestDELETE
   */
  async requestGET(url, jsonData = null, callback = null) {
    // const _m = "requestGET";
    let xRequest = XRequest.CreateNew(jsonData);
    xRequest.setUserId(this.getUsername());
    xRequest.setToken(this.portal.getUserToken());

    let appUrl = this.getAppUrl(null);
    if (appUrl) xRequest.setAppUrlHeader(appUrl); // optional
    // this.log(_m, "appUrl: ", appUrl);

    let result = null,
      err = null;
    try {
      let xresp = await this.requestMethod("get", url, xRequest, false, null);
      if (xresp == null) {
        // debugger;
      } else {
        // if (url.indexOf("/feed/posts") !== -1) {
        //   debugger;
        // }
        let jsonResult = xresp.getResult ? xresp.getResult() : null;
        result = jsonResult != null ? XObject.Wrap(jsonResult) : null;
        if (
          result &&
          !XObject.IsWrapped(result) &&
          typeof result === "object"
        ) {
          if (result.hasOwnProperty(XObjectProps.TYPE)) {
            let type = result[XObjectProps.TYPE];
            let id = result[XObjectProps.ID];
            // Object has type property but not wrapped. This means class not loaded
            console.error(
              `XObject Not Wrapped; class not loaded? (type=${type}, id=${id})`,
            );
          }
        }
      }
    } catch (e) {
      err = e;
      if (!callback) throw e;
    }
    return callback ? callback(err, result) : result;
  } // requestGET

  /**
   * Make a POST request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {{}} mainContent main data that goes into body's "content" key
   *
   * @see ~requestGET
   * @see ~requestDELETE
   */
  async requestPOST(url, mainContent = null, callback = null) {
    // mainContent = XObject.Unwrap(mainContent);  // just in case

    let xRequest = XRequest.CreateNew(mainContent);

    xRequest.setUserId(this.getUsername());
    xRequest.setToken(this.portal.getUserToken());

    let appUrl = this.getAppUrl(null);
    if (appUrl) xRequest.setAppUrlHeader(appUrl); // optional
    // this.log("requestPOST", "appUrl: ", appUrl);

    let result = null,
      err = null;
    try {
      let xresp = await this.requestMethod("post", url, xRequest, false, null);
      if (xresp == null) {
        // debugger;
      } else {
        let jsonResult = xresp.getResult ? xresp.getResult() : null;
        result = jsonResult ? XObject.Wrap(jsonResult) : null;
      }
      // if (result == null) {
      //   debugger;
      // }
    } catch (e) {
      err = e;
      if (!callback) throw e;
    }
    return callback ? callback(err, result) : result;
  } // requestPOST

  /**
   * Make a POST request using multipart/form-data instead of default
   * application/json
   *
   * @param {string} url
   * @param {{}} mainContent main data that goes into body's "content" key.
   * This can be an XObject that includes AUX_DATA as it will be serialized
   * @param {FormData} formData multipart/form-data representation
   *
   * @see ~requestPOST
   */
  async requestPOST_FormData(
    url,
    mainContent,
    formData = null,
    callback = null,
  ) {
    const _m = `reqPOST_fd`;

    let xRequest = XRequest.CreateNewFormData(formData);

    xRequest.setContent(mainContent); // Don't unwrap
    xRequest.setUserId(this.getUsername());
    xRequest.setToken(this.portal.getUserToken());

    let appUrl = this.getAppUrl(null);
    if (appUrl) {
      xRequest.setAppUrlHeader(appUrl); // optional
      // this.log(_m, "appUrl: ", appUrl);
    }

    let result = null,
      err = null;
    try {
      let xresp = await this.requestMethod("post", url, xRequest, false, null);
      if (xresp == null) {
        // debugger;
      } else {
        let jsonResult = xresp.getResult ? xresp.getResult() : null;
        result = jsonResult ? XObject.Wrap(jsonResult) : null;
      }
      // if (result == null) {
      //   debugger;
      // }
    } catch (e) {
      err = e;
      if (!callback) throw e;
    }
    return callback ? callback(err, result) : result;
  } // requestPOST_FormData

  /**
   * Make a POST request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {{}} jsonData data to send (not likely)
   *
   * @see ~requestGET
   * @see ~reqiest{PST}
   */
  async requestDELETE(url, jsonData = null, callback = null) {
    let xRequest = XRequest.CreateNew(jsonData);
    xRequest.setUserId(this.getUsername());
    xRequest.setToken(this.portal.getUserToken());
    xRequest.setAppUrlHeader(this.getAppUrl(null)); // optional

    let result = null,
      err = null;
    try {
      let xresp = await this.requestMethod(
        "delete",
        url,
        xRequest,
        false,
        null,
      );
      let jsonResult = xresp.getResult();
      result = XObject.Wrap(jsonResult);
    } catch (e) {
      err = e;
      if (!callback) throw e;
    }
    return callback ? callback(err, result) : result;
  } // requestDELETE

  /**
   * Incomplete - try to be a proxy / wrapper of REST.XRequestMethod()
   * @param {string} method
   * @param {string} url
   * @param {XRequest} xRequest
   * @param {boolean} thirdParty true indicate outside of proprietary servers
   * @callback
   */
  async requestMethod(
    method,
    url,
    xRequest = null,
    thirdParty = false,
    callback = null,
  ) {
    const _m = `reqMethod(${method}, ${url})`;

    let p = new Promise(async (resolve, reject) => {
      let result, error;
      try {
        // if (thirdParty) debugger;
        result = await REST.XRequestMethod(
          method,
          url,
          xRequest,
          thirdParty,
          callback,
        );
        // if (thirdParty) debugger;
        resolve(result);
      } catch (e) {
        // Error will be tossed even if callback is made
        error = e;
        // if (thirdParty) debugger;
        if (!thirdParty) {
          error = XError.FromRequestError(e);

          if (error.invalidUser()) {
            // invalid can be user is suspended or deleted but record exists
            // this.log(_m, "User is invalid; clear session info");
            this.getSession().clearUserInfo();
            // expect caller's error trap to route to login() or acquire another token
          }
        }
        reject(error);
      }
    });
    return p;
  }

  // --------------- NETWORK COMMUNICATIONS (INTERNAL) --------------------

  /**
   * Make an external GET request.
   *
   * @param {string} url
   * @param {*} jsonData did you know GET can carry payload too in body?
   * @param {function} callback optional to async/await.
   * @return {object} http response.data()
   *
   * @see ~requestExternalPOST
   */
  async requestExternalGET(url, jsonData = null, callback = null) {
    // const _m = "requestGET";
    let xRequest = XRequest.CreateNew(jsonData);
    xRequest.setUserId(this.getUsername());

    // this.log(_m, "appUrl: ", appUrl);

    let p = new Promise(async (resolve, reject) => {
      let result = null,
        err = null;
      try {
        let xresp = await this.requestMethod("get", url, xRequest, true, null);
        if (xresp == null) {
          // debugger;
        } else {
          result = xresp.getResult ? xresp.getResult() : null;
        }
      } catch (e) {
        err = e;
      }
      this._processResult(err, result, callback, reject, resolve);
    });
    return p;
  } // requestExternalGET

  /**
   * Make an external POST request.
   *
   * @param {string} url
   * @param {{}} jsonData data to send. Will unwrap if it's an XObject
   * @param {function} callback
   * @callback
   * @return {object} http response.data()
   *
   * @see ~requestExternalGET
   */
  async requestExternalPOST(url, jsonData = null, callback = null) {
    jsonData = XObject.Unwrap(jsonData); // just in case
    let xRequest = XRequest.CreateNew(jsonData);
    xRequest.setUserId(this.getUsername());

    let result = null,
      err = null;
    let p = new Promise(async (resolve, reject) => {
      try {
        let xresp = await this.requestMethod("post", url, xRequest, true, null);
        if (xresp == null) {
          // debugger;
        } else {
          result = xresp.getResult ? xresp.getResult() : null;
        }
        // if (result == null) {
        //   debugger;
        // }
      } catch (syserr) {
        // if (!syserr) debugger;
        err = syserr;
      }
      this._processResult(err, result, callback, reject, resolve);
    });
    return p;
  } // requestExternalPOST

  // ------------------------- MISCELLANEOUS --------------------------

  /**
   *
   * @param {*} err
   * @param {*} result
   * @param {Promise} p
   * @param {function} callback
   */
  _processResult(err, result, callback, reject, resolve) {
    if (callback) {
      callback(err, result);
    }
    if (err && reject) reject(err);
    else if (resolve) resolve(result);
  }
} // class

export default ClientAppService;
