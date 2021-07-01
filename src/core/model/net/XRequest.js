/**
 * Represent a response object.
 *
 * @see XRequest
 */
import { UAParser } from 'ua-parser-js';

import XObject from '../XObject';
import XUserCred from '../user/XUserCred';
import { UserProps, XObjectProps } from '../ModelConsts';
import Util, { TimeUtil } from '../../Util';
import XHttpBase from './XHttpBase';

const _CLSNAME = 'XRequest';

export const PROP_USER_ID = 'uid';
export const PROP_USER_TOKEN = 'token';
export const PROP_PARAMS = 'params';
export const PROP_CONTENT = 'content';
export const PROP_ENDPOINT = 'ep';
export const HDR_APP_AUTH = 'x-app-auth';
export const HDR_APP_URL = 'x-app-url';
export const HDR_APP_LANG = 'x-app-lang';


/**
 * Wrapper for results, which can contain more data when just payload.
 * Some we can add include a return code (not necessarily error),
 * request ID, session token/info, other security data/key, etc.
 */
export class XRequest extends XHttpBase {
  static get HDR_APP_AUTH() { return HDR_APP_AUTH; }
  static get HDR_APP_URL() { return HDR_APP_URL; }
  static get HDR_APP_LANG() { return HDR_APP_LANG; }
  static get PROP_CONTENT() { return PROP_CONTENT; }

  /**
   * Constructor - Use Create() instead
   *
   * @param {string} clsname
   * @param {*} params
   * @see ~Create
   */
  constructor(clsname = _CLSNAME, params = null) {
    super(clsname, params);
    this.class = XRequest;

    this._setTypeID();
  }

  /**
   * Store the given http request object as a transient
   * property.
   *
   * @param {object} req http request object
   */
  setRequestObject(req) {
    this.req = req;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {object} tracked transient (http) request object
   */
  getRequestObject(defaultVal = null) {
    return this.req ? this.req : defaultVal;
  }

  /**
   * Set the "official" application url, which can be
   * used for click backs, such as user identifiy confirmation.
   *
   * @param {string} appUrl user associated with the token
   * @return {boolean} true if set, false if not (empty string)
   */
  setAppUrlHeader(appUrl) {
    return this.setHeader(HDR_APP_URL, appUrl);
  }

  /**
   * Retrieve the "offical" application url. This may not be
   * provided as server might have configured a default app url.
   * It's useful if web app has different official url.
   *
   * @param {*} defaultVal
   * @return {string=} app url prefix, or defaultVal if null
   */
  getAppUrlHeader(defaultVal = null) {
    return this.getHeaderValue(HDR_APP_URL, defaultVal);
  }

  /**
   * Track user that initiated this request.
   *
   * @param {string} userId user associated with the token
   * @return {string} previous value
   */
  setUserId(userId) {
    if (userId) {
      return this.set(PROP_USER_ID, userId);
    }
  }

  /**
   * Track user that initiated this request.
   *
   * NOTE: For now, username is userId
   *
   * @deprecated
   *
   * @param {string} username user associated with the token
   * @return {string} previous value
   *
   * @see ~setUserId
   */
  setUsername(username) {
    if (username) {
      return this.setUserId(username);
    }
  }

  /**
   * Retrieve the authenticating user's ID.
   *
   * @param {*} defaultVal return this if no such property
   * @return {string}
   */
  getUserId(defaultVal = null) {
    return this.get(PROP_USER_ID, defaultVal);
  }

  /**
   * @deprecated
   *
   * @param {*} defaultVal return this if no such property
   * @return {string}
   *
   * @see ~getUserId
   */
  getUsername(defaultVal = null) {
    return this.getUserId(defaultVal);
  }

  /**
   *
   * @param {string} lang
   * @return {string} previous value
   */
  setLanguagePref(lang) {
    return this.set(HDR_APP_LANG);
  }

  /**
   *
   * @param {*} defaultVal return this if no such property
   * @return {string}
   */
  getLanguagePref(defaultVal = null) {
    return this.get(HDR_APP_LANG, defaultVal);
  }

  /**
   * Record the given user credential which will be used when
   * sending request out.
   *
   * @param {XUserCred} userCred credential for this request
   */
  setUserCred(userCred) {
    const token = userCred.getAccessToken();
    const userId = userCred.getUserId();
    if (token) { this.setToken(token); }
    if (userId) { this.setUserId(userId); }
  } // setCredential

  /**
   * Return the credentials stored in this request object.
   *
   * @param {*} defaultVal
   * @return {XUserCred} credential (userId, token) for this request
   */
  getUserCred(defaultVal = null) {
    const token = this.getToken();
    const userId = this.getUserId();
    return XUserCred.Create(token, userId);
  } // getCredential

  /**
   * Set user access token.
   *
   * @param {string} token
   * @return {string}
   *
   * @see ~getToken
   */
  setToken(token) {
    if (token) {
      return this.set(PROP_USER_TOKEN, token);
    }
  }

  /**
   * Get the results stored in this response object
   *
   * @param {*} defaultVal value to return if no result
   * @return {string} token value previously set
   *
   * @see ~setToken
   */
  getToken(defaultVal = null) {
    return this.get(PROP_USER_TOKEN, defaultVal);
  }

  /**
   * Track api endpoint
   *
   * @param {string} path
   * @return {string} previous value, if any
   */
  setEndpoint(path) {
    return this.set(PROP_ENDPOINT, path);
  }

  /**
   * Return endpoint URL previous set.
   *
   * @return {string}
   *
   */
  getEndpoint(defaultVal = null) {
    return this.get(PROP_ENDPOINT, defaultVal);
  }

  isGuest() {
    return XUserCred.IsGuest(this.getUserId());
  }

  isRobot() {
    return XUserCred.IsRobot(this.getUserId());
  }

  isAuthenticatedUser() {
    return XUserCred.IsAuthenticatedUser(this.getUserId());
  }

  toConsole() {
    this.error(`Error(${this.getCode()})`, this.getMessage());
  }

  toString() {
    const time = TimeUtil.Ts2YY_MM_DD_hh_mm_ss();
    const username = this.getUserId();
    const os = this.getOSName();
    const device = this.getDeviceName('unknown');
    const browser = this.getBrowserName('?browser');
    const ipaddr = this.getIPAddress('x.x.x.x');
    return `[${time}] XREQ(${ipaddr}:${username}): ${this.getEndpoint('/unknown')} [${os}/${device}, ${browser}]`;
  }

  // ---------------- Client Information Extraction  -------------------


  /**
   * Return instance of User Agent parser. Only
   * create once per request instance and it's
   * delayed until necessary.
   *
   * @return {UAParser}
   */
  _getUAParser() {
    if (this.uap == null) {
      const uastring = this.getUserAgent(null);
      if (uastring) { this.uap = new UAParser(uastring); }
    }
    return this.uap;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {{ua:string,browser:{},cpu:{},device:{},engine:{},os:{}}}
   */
  getUAResult(defaultVal = null) {
    const ua = this._getUAParser();
    return ua ? ua.getResult() : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {{name:string,version:string}}
   */
  getBrowserInfo(defaultVal = null) {
    const ua = this._getUAParser();
    return ua ? ua.getBrowser() : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getBrowserName(defaultVal = null) {
    const browser = this.getBrowserInfo(null);
    return browser ? `${browser.name} ${browser.version}` : defaultVal;
  }


  /**
   *
   * @param {*} defaultVal
   * @return {{name:string,version:string}}
   */
  getDeviceInfo(defaultVal = null) {
    const ua = this._getUAParser();
    return ua ? ua.getDevice() : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getDeviceName(defaultVal = null) {
    const device = this.getDeviceInfo(null);
    if (!device) { return defaultVal; }
    if (device.name == null) { return defaultVal; }
    return device.version ? `${device.name} ${device.version}` : device.name;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {{name:string,version:string}}
   */
  getEngineInfo(defaultVal = null) {
    const ua = this._getUAParser();
    return ua ? ua.getEngine() : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getEngineName(defaultVal = null) {
    const engine = this.getEngineInfo(null);
    return engine ? `${engine.name} ${engine.version}` : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {{name:string,version:string}}
   */
  getOSInfo(defaultVal = null) {
    const ua = this._getUAParser();
    return ua ? ua.getOS() : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getOSName(defaultVal = null) {
    const os = this.getOSInfo(null);
    return os ? `${os.name} ${os.version}` : defaultVal;
  }

  getIPAddress(defaultVal = null) {
    const ipaddr = this.getHeaderValue('x-forwarded-for');
    if (Util.NotNull(ipaddr)) { return ipaddr; }

    const req = this.getRequestObject();
    return req ? req.connection.remoteAddress : defaultVal;
  }


  // *************************************************************
  //
  // Class methods.
  //
  // *************************************************************

  /**
   * Check if the given type is an instance of XRequest
   * @param {*} obj
   */
  static IsInstance(obj) {
    return obj instanceof XRequest;
  }

  static GetTypeID() {
    return 'xreq';
  }

  /**
   * Create new XObject instance representing a client-side
   * XRequest to be sent.
   *
   * @param {XObject=} content json or instance of XObject
   * @param {XUserCred} userCred access token, etc.
   * @return {XRequest}
   */
  static CreateNew(content = null, userCred = null) {
    const xReq = new XRequest();
    if (content) {
      xReq.setContent(content);
    }
    if (userCred) { xReq.setUserCred(userCred); }
    return xReq;
  }

  /**
   * Create new XObject isntance representing
   * multipart/form-data HTTP request object
   *
   * @param {FormData} formData
   * @param {XUserCred} userCred
   * @param {boolean} inclHeader true to include "multipart/form-data". Should not
   * do this on client side.
   * @return {XRequest}
   */
  static CreateNewFormData(formData, userCred = null, inclHeader = false) {
    const xReq = new XRequest();
    if (formData) { xReq.setFormData(formData, inclHeader); }
    if (userCred) { xReq.setUserCred(userCred); }
    return xReq;
  }

  /**
   * Create wrapper for the HTTP request object on the server side
   * upon receiving!
   *
   * @param {object} req req.body contains XRequest stringified,
   * and req.params contain parameter values for the url path.
   *
   * @return {XRequest}
   */
  static CreateFromHttpRequest(req) {
    const params = req.params ? req.params : {};
    const headers = req.headers ? req.headers : null;
    const props = params.props ? params.props : null;

    const userCredStr = headers ? headers[HDR_APP_AUTH] : null;
    const userCred = userCredStr ? XUserCred.CreateFromAuthHeader(userCredStr) : null;
    let content = req.body ? req.body.content : null;
    let xreq;

    if (Util.IsString(content)) {
      // try parsing to JSON
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.log(`${_CLSNAME}: Tried parsing: `, content);
        console.log(e);
      }
    }

    content = XObject.DeSerialize(content);
    if (content && content[XObjectProps.TYPE] === XRequest.GetTypeID()) { xreq = XObject.Wrap(content); } else { xreq = XRequest.CreateNew(content); }

    xreq.setRequestObject(req);

    if (userCred) { xreq.setUserCred(userCred); }

    if (req.url) { xreq.setEndpoint(req.url); }

    if (headers) { xreq.setHeaders(headers); }

    if (props) { xreq.importObjectFields(props); }

    // console.log(xreq.toString());
    return xreq;
  }

  // /**
  //  * Set the user ID that is associated with the access token
  //  *
  //  * @param {{}} jsonObj
  //  * @param {*} action
  //  */
  // static SetUserId(jsonObj, username) {
  //     return XRequest.SetObjectField(jsonObj, PROP_USER_ID, username);
  // }

  /**
   * Get the initiator ID of this log. Note initiator is different than
   * actioner.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~GetActioner
   */
  static GetUserId(jsonObj, defaultVal = null) {
    return XRequest.GetObjectField(jsonObj, PROP_USER_ID, defaultVal);
  }

  // /**
  //  * Set the "official" application url, which can be
  //  * used for click backs, such as user identifiy confirmation.
  //  *
  //  * @param {{}} jsonObj
  //  * @param {string} appUrl application url
  //  * @return {boolean} true if set, false if not (e.g., empty url)
  //  */
  // static SetAppUrl(jsonObj, appUrl) {
  //     if (Util.StringIsEmpty(appUrl))
  //         return false;
  //     XRequest.SetObjectField(jsonObj, HDR_APP_URL, appUrl);
  //     return true;
  // }

  // /**
  //  * Retrieve the "offical" application url. This may not be
  //  * provided as server might have configured a default app url.
  //  * It's useful if web app has different official url.
  //  *
  //  * @param {{}} jsonObj
  //  * @param {*} defaultVal
  //  *
  //  */
  // static GetAppUrl(jsonObj, defaultVal=null) {
  //     return XRequest.GetObjectField(jsonObj, HDR_APP_URL, defaultVal);
  // }

  // /**
  //  * Set result within the data portion of the object.
  //  *
  //  * @param {{}} jsonData unwraped json response data
  //  * @param {*} resultData result value to set
  //  * @param {string} rc optonal return code
  //  */
  // static SetToken(jsonData, token) {
  //     return XRequest.SetObjectField(jsonData, PROP_USER_TOKEN, token);
  // } // SetToken

  // /**
  //  * Retrieve token value that was set
  //  *
  //  * @param {{}} jsonData
  //  * @param {*} defaultVal
  //  * @return {{}} previous value
  //  */
  // static GetToken(jsonData, defaultVal) {
  //     return XRequest.GetObjectField(jsonData, PROP_USER_TOKEN, defaultVal);
  // }

  // /**
  //  * Set the api endpoint that is associated with this request
  //  *
  //  * @param {{}} jsonObj
  //  * @param {*} action
  //  */
  // static SetEndPoint(jsonObj, username) {
  //     return XRequest.SetObjectField(jsonObj, PROP_ENDPOINT, username);
  // }

  // /**
  //  * Get the api endpoint for this request
  //  *
  //  * @param {{}} jsonObj
  //  * @param {*} defaultVal
  //  *
  //  * @see ~GetActioner
  //  */
  // static GetEndPoint(jsonObj, defaultVal=null) {
  //     return XRequest.GetObjectField(jsonObj, PROP_ENDPOINT, defaultVal);
  // }

}

XRequest.RegisterType(XRequest);

export default XRequest;
