
import XObject from '../XObject';

import { UserProps, USERID_GUEST, USERID_ROBOT, TOKEN_GUEST, TOKEN_ROBOT, USERID_ADMIN_BYPASS } from '../ModelConsts';


const _CLSNAME = 'XUserCred'; // match class name

/**
 * Transient data structure to hold user credentials for
 * access. The credentials are specified in a header
 * entry 'x-app-auth: user: {userId}; token: {string}'
 */
class XUserCred extends XObject {
  static get PROP_USERID() { return 'user'; }   // legacy
  static get PROP_TOKEN() { return 'token'; }

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XUserCred;
  }

  /**
     * Initialize content as a new object.
     */
  initNew() {

  }

  /**
     * Retrieve user token stored here. It is generated from
     * the backend.
     *
     * @param {string} defaultVal
     * @return {string}
     */
  getAccessToken(defaultVal) {
    const data = this.getData(false);
    return data ? XUserCred.GetAccessToken(data, defaultVal) : defaultVal;
  }

  /**
     * Store generated token generated else where
     *
     * @param {string} token
     */
  setAccessToken(token) {
    return XUserCred.SetAccessToken(this.getData(true), token);
  }

  /**
     * UserId is set from server side extracting content from
     * XMUser and other related objects. It is actually the _id
     * field (primary key).
     *
     * @param {string} defaultVal
     * @return {string}
     */
  getUserId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserCred.GetUserId(data, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} username
     */
  setUserId(username) {
    return XUserCred.SetUserId(this.getData(true), username);
  }

  toAuthHeader(defaultVal = null) {
    const userId = this.getUserId();
    const token = this.getAccessToken();
    if ((userId == null) && (token == null)) {
      return defaultVal;
    }
    const authData = { };
    if (userId != null) {
      authData[XUserCred.PROP_USERID] = userId;
    }
    if (token != null) {
      authData[XUserCred.PROP_TOKEN] = token;
    }

    return JSON.stringify(authData);
  }

  isGuest() {
    const userId = this.getUserId();
    return userId ? XUserCred.IsGuest(userId) : false;
  }

  isRobot() {
    const userId = this.getUserId();
    return userId ? XUserCred.IsRobot(userId) : false;
  }

  isAuthenticatedUser() {
    const userId = this.getUserId();
    return userId ? XUserCred.IsAuthenticatedUser(userId) : false;
  }


  // *************************************************************
  //
  // Class/static methods. This should also include any
  // methods that can be used as helper for generic
  // JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************


  /**
     * @return {string}
     */
  static GetName() {
    return _CLSNAME;
  }

  /**
     * @return {string}
     */
  static GetTypeID() {
    return 'ucred';
  }

  /**
     * Create new instance with essnetial data
     *
     * @param {string} token access token
     * @param {string=} username username/id
     * @return {XUserCred}
     */
  static Create(token, username) {
    const userCred = new XUserCred();
    userCred.setAccessToken(token);
    userCred.setUserId(username);
    return userCred;
  }

  /**
   * Create an user info record aggregated from difference
   * sources but mainly XMUser. It is suitable to give to
   * client for rendering.
   *
   * @param {XUserInfo} xUserInfo user data, which can be json also
   *
   * @return {XUserCred}
   */
  static CreateFromUserInfo(xUserInfo) {
    const userCred = new XUserCred();
    const username = xUserInfo.getUsername();
    const token = xUserInfo.getUserToken();
    userCred.setUserId(username);
    userCred.setAccessToken(token);

    return userCred;
  } // CreateFrom

  /**
   * @return {XUserCred}
   */
  static CreateGuest() {
    return XUserCred.Create(TOKEN_GUEST, USERID_GUEST);
  }

  /**
   * @return {XUserCred}
   */
  static CreateRobot() {
    return XUserCred.Create(TOKEN_ROBOT, USERID_ROBOT);
  }

  /**
   * For backend direct functions, create an internal one
   * that represents internal or binded call
   *
   * @return {XUserCred}
   */
  static CreateBackend(userId) {
    return XUserCred.Create('none', `backend/${userId}`);
  }

  /**
     * Parse auth header string and put in an instance of XUserCred
     *
     * @param {string} strcred  string cred in format of "user={username}; token={token}"
     * @param {XUserCred=} credObj optional wrapper object to put parsed value in. Null will create new
     * @return {XUserCred} passed in object or newly created with prased values
     */
  static CreateFromAuthHeader(strcred) {
    try {
      const data = JSON.parse(strcred);
      return XUserCred.Wrap(data, XUserCred);
    } catch (err) {
      console.log(err);
      return null;
    }
  } // CreateFromAuthHeader

  static SetAccessToken(jsonRec, token) {
    if (token != null) {
      return XUserCred.SetObjectField(jsonRec, XUserCred.PROP_TOKEN, token);
    }
  }
  static GetAccessToken(jsonRec, defaultVal = null) {
    return XUserCred.GetObjectField(jsonRec, XUserCred.PROP_TOKEN, defaultVal);
  }

  static SetUserId(jsonRec, userId) {
    if (userId != null) {
      return XUserCred.SetObjectField(jsonRec, XUserCred.PROP_USERID, userId);
    }
  }
  static GetUserId(jsonRec, defaultVal = null) {
    return XUserCred.GetObjectField(jsonRec, XUserCred.PROP_USERID, defaultVal);
  }

  static IsGuest(userId) {
    return userId === UserProps.USERID_GUEST;
  }

  static IsRobot(userId) {
    return userId === UserProps.USERID_ROBOT;
  }

  static IsAuthenticatedUser(userId) {
    return (userId !== UserProps.USERID_ROBOT) && (userId !== UserProps.USERID_GUEST);
  }

} // class XUserCred

XUserCred.RegisterType(XUserCred);

export default XUserCred;
