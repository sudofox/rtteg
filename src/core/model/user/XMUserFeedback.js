
import XMObject from '../XMObject';
import { UserProps, ModelType, ModelFolder } from '../ModelConsts';
import Util from '../../Util';

const _CLSNAME = 'XMUserFeedback'; // match class name

// export { UserProps, TOKEN_GUEST, TOKEN_ROBOT } from "../ModelConsts";

export const TOPIC_BUG = 'bug';
export const TOPIC_FEATURE = 'fea';
export const TOPIC_USABILITY = 'use';
export const TOPIC_INQUIRY = 'info';
export const TOPIC_OTHER = 'other';


/**
 * Model persistent record for a user feedback.
 *
 * The record ID should be generated and perhaps the
 * confirmation ID.
 *
 */
class XMUserFeedback extends XMObject {
  // constants to share with consumer of this class
  static get TEXT() { return 'text'; }
  static get PAGE_URL() { return 'pageUrl'; }
  static get CONFIRM_ID() { return 'cfid'; }

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMUserFeedback;
  }

  initNew(tracking = true) {
    super.initNew(tracking);
  }

  /**
     *
     * @param {string} userId
     * @return {string} previous userId if any
     */
  setUserId(userId) {
    if (Util.NotNull(userId)) { return this.set(UserProps.USERNAME, userId); }
    return null;
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string}
     */
  getUserId(defaultVal = null) {
    return this.get(UserProps.USERNAME, defaultVal);
  }

  /**
     *
     * @param {string} userId
     * @return {string} previous message set
     */
  setMessage(msg) {
    return this.set(XMUserFeedback.TEXT, msg);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string}
     */
  getConfirmId(defaultVal = null) {
    return this.get(XMUserFeedback.CONFIRM_ID, defaultVal);
  }

  /**
     *
     * @param {string} confirmId generated ID for future reference
     */
  setConfirmId(confirmId) {
    return this.set(XMUserFeedback.CONFIRM_ID, confirmId);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string} message
     */
  getMessage(defaultVal = null) {
    return this.get(XMUserFeedback.TEXT, defaultVal);
  }


  /**
     *
     * @param {string} userId
     * @return {string} previous message set
     */
  setPageUrl(url) {
    return this.set(XMUserFeedback.PAGE_URL, url);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string} message
     */
  getPageUrl(defaultVal = null) {
    return this.get(XMUserFeedback.PAGE_URL, defaultVal);
  }

  // /**
  //  *
  //  * @param {string} action label like CONFIRM_EMAIL or CONFIRM_SMS
  //  * @param {string} target value like email address or phone number
  //  * @return {boolean} true if set, false if missing input value
  //  */
  // setAction(action, target) {
  //     if ((Util.NotNull(action)) && (Util.NotNull(target))) {
  //         this.set(UserProps.CONFIRM_ACTION_TYPE, action);
  //         this.set(UserProps.CONFIRM_ACTION_TARGET, target);
  //         return true;
  //     }
  //     return false;
  // }

  /**
     * Sets one or more topic category keywords.
     *
     * @param {string[]} topics one or more topic keyboard. Can be standalone string
     *
     * @see ~setAction
     */
  setTopics(topics) {
    return this.addTags(topics);
  }

  /**
     * Return topic keywords
     *
     * @param {*} defaultVal
     * @return {string[]} array of one or more topic keywords
     */
  getTopics(defaultVal = null) {
    return this.getTags();
  }

  // /**
  //  * Sets the action type. this should be a confirmation type,
  //  * like email or sms, but perhaps can also be a pre-confirmation
  //  * action (thinking out loud).
  //  *
  //  * @param {string} action action label
  //  * @return {boolean} true if set, false if invalid input
  //  * @see ~setAction
  //  */
  // setActionTarget(action) {
  //     if (Util.NotNull(action)) {
  //         this.set(UserProps.CONFIRM_ACTION_TARGET, action);
  //         return true;
  //     }
  //     return false;
  // }

  // /**
  //  *
  //  * @param {*} defaultVal
  //  * @return {string}
  //  */
  // getActionTarget(defaultVal=null) {
  //     return this.get(UserProps.CONFIRM_ACTION_TARGET, defaultVal);
  // }

  /**
     * Set feedback as "read" by whome and optional timestamp
     *
     * @param {string} sourceId user ID or person name or  ?
     * @param {number} timeVal confirmation time, or null to use now
     * @return {boolean} true if set, false if invalid input
     */
  setReadBy(sourceId, timeVal = null) {
    const data = this.getData(true);
    return data ? XMUserFeedback.SetRead(data, sourceId, timeVal) : false;
  }

  /**
     * Return the value to the field CONFIRMED_DATE ("cfdate").
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     * @return {string} sourceId
     */
  getReadBy(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMUserFeedback.GetReadBy(data, defaultVal) : defaultVal;
  }

  /**
     * Return "read" timestamp
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     */
  getReadTS(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMUserFeedback.GetReadTS(data, defaultVal) : defaultVal;
  }

  /**
     * Return whether this feedback has been confirmed as "read"
     *
     * @param {boolean} expiredOK true to return confirmed regardless
     * of expriation. This is poisslble as we still log confirmation after
     * expiration.
     * @return {boolean} true if confirmed and valid
     */
  hasRead(expiredOK = false) {
    const confirmedTS = this.getReadTS(-1);
    if (confirmedTS === -1) { return false; }

    if (expiredOK === true) { return (confirmedTS > 0); }

    const expiry = this.getExpiration(-1);
    return expiry > confirmedTS;
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

  static GetFolderName() {
    return ModelFolder.USER_FEEDBACK;
  }

  /**
     * @return {string}
     */
  static GetTypeID() {
    return ModelType.USER_FEEDBACK;
  }

  /**
     * Create an user info record aggregated from difference
     * sources but mainly XMUser. It is suitable to give to
     * client for rendering.
     *
     * @param {string} userId user that perform the action
     * @param {string} action confirmation action type for confirmation
     * @param {string} actionTarget confirmation target. If email, then email address. If SMS, then phone number.
     * @param {string} confirmId assigned confirmation Id, if known or pre-generated. Null to generate random
     * @param {number} expiration time in SECONDS to expire. Use now + DEFAULT_CONFIRM_EXPIRATION if null
     * @param  {...any} args
     *
     * @return {XMUserFeedback=} XMObject storable instance. Null if invalid input
     */
  static CreateNew(userId, feedbackId = null) {
    const feedbackObj = new XMUserFeedback();
    feedbackObj.initNew(false);  // no tracking/COD

    if (feedbackId == null) { feedbackId = `${Util.GenRandomLong()}C`; }
    feedbackObj._setId(feedbackId);

    feedbackObj.setUserId(userId);


    return feedbackObj;
  } // Create


  /**
     * Update object with who read this feedback and timestamp
     *
     * @param {{}} jsonObj
     * @param {string} sourceId feedback read by user ID (IP address, etc)
     * @param {number=} timeVal optional time value to set or null to use current time
     */
  static SetRead(jsonObj, sourceId, timeVal = null) {
    if (sourceId == null) { return false; }

    const confirmTS = timeVal || Date.now();
    if (Util.NotNull(sourceId)) {
      jsonObj[UserProps.CONFIRM_ACTION_SOURCE] = sourceId;
      jsonObj[UserProps.CONFIRMED_DATE] = confirmTS;
    } else if (jsonObj[UserProps.CONFIRMED_DATE] == null) { jsonObj[UserProps.CONFIRMED_DATE] = confirmTS; }
    return true;
  }

  /**
     * Return the value to the field CONFIRMED_DATE ("cfdate").
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     * @return {string} sourceId
     */
  static GetReadBy(jsonObj, defaultVal = -1) {
    const ts = jsonObj ? jsonObj[UserProps.CONFIRM_ACTION_SOURCE] : null;
    return ts || defaultVal;
  }

  /**
     * Return the value to the field CONFIRMED_DATE ("cfdate").
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     */
  static GetReadTS(jsonObj, defaultVal = -1) {
    const ts = jsonObj ? jsonObj[UserProps.CONFIRMED_DATE] : null;
    return ts || defaultVal;
  }

} // class XUserConfirm

XMUserFeedback.RegisterType(XMUserFeedback);

export default XMUserFeedback;
