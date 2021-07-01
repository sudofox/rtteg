import templateMerge from 'string-template';
import templateCompile from 'string-template/compile';

import { ModelType, MessageProps, ModelFolder } from '../ModelConsts';
import SymbolExpr from '../../util/SymbolExpr';
import XMActivityLog from './XMActivityLog';
import XMSocialIndexable from '../social/XMSocialIndexable';
import XMPost from '../post/XMPost';
import XObject from '../XObject';
import XPostStats from '../post/XPostStats';
import Util from '../../Util';

const _CLSNAME = 'XMPostItem';

/**
 * In a VM, store pre-cached templates so going through
 * a lot of alerts can merge text quicker.
 */
const cachedTemplate = {};


/**
 * Represent tracking of the action that can be rendered
 * as an item in a timeline / feed stream.
 *
 * It is essentially a renderable version of XMActivityLog
 * intended for human consumption as a postin a feed stream.
 * For example "<User> liked a post" or "User reposted"
 *
 * The instances of this class are elements in a XPostFeed
 * collection object, which is to construct and transmit the search
 * result back to client.
 */
class XMPostItem extends XMSocialIndexable {
  static get VARDATA() { return MessageProps.VARDATA; }
  static get ACTION() { return MessageProps.ACTION; }
  static get VARMAP() { return MessageProps.VARMAP; }
  static get MSGTPL() { return MessageProps.MSGTPL; }
  static get COMPILED() { return MessageProps.COMPILED; }

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMPostItem;
  }

  /**
   * Initialize content as a new object.
   */
  initNew(tracking = false) {
    super.initNew(tracking);
  }

  /**
   * OVERRIDE: parent class implementation to also look in
   * the parent container for aux data (e.g., XPostFeed).
   *
   * @param {boolean} create true to create if not already
   * @return {{}} aux data in JSON, or null if non exist and
   * don't want to create
   */
  getAuxData(create = false) {
    let auxData = super.getAuxData(false);
    if (auxData) {
      return auxData;   // first priority is immediate aux data
    }
    const tp = this.getTParent();
    auxData = tp ? tp.getAuxData(false) : null;
    if (auxData == null && !create) {
      return null;
    }
    // No aux data found
    return super.getAuxData(true);
  }

  /**
   * OVERRIDE: parent class implementation so can check
   * both in this object's aux_data, as well as parent
   * container's aux_data.
   *
   * @param {string} field name of field in aux data section
   * @param {*} defaultVal
   */
  getAuxDataField(field, defaultVal = null) {
    let auxData = super.getAuxData(false);
    const data = auxData ? XMPostItem.GetObjectField(auxData, field, null) : null;
    if (Util.NotNull(data)) { return data; }    // found
    const tp = this.getTParent();
    if (tp == null) { return defaultVal; }
    auxData = tp.getAuxData(false);
    return auxData ? XMPostItem.GetObjectField(auxData, field, defaultVal) : defaultVal;
  }

  /**
   * Return variable map associated with this object, if any
   *
   * @param {boolean} wrap true to wrap as XVarData object
   * @param {*} defaultVal
   * @return {XVarData} either XVarData, json, or defaultVal
   */
  getVarData(wrap = true, defaultVal = null) {
    let jsonObj = this.get(XMPostItem.VARDATA, null);
    if (jsonObj == null) {
      const tp = this.getTParent();
      if (Util.NotNull(tp)) {
        if (typeof tp.getVarData === 'function') { jsonObj = tp.getVarData(false, null); } else { jsonObj = tp[XMPostItem.VARDATA]; }
      }
    }
    if (jsonObj == null) { return defaultVal; }
    return wrap ? XObject.Wrap(jsonObj) : jsonObj;
  }

  /**
   * Poster's ID - from explicitly set value or infer from activitylog
   *
   * @return {string} userId of poster
   */
  getPosterId() {
    let posterId = this.getCreatorId(null);
    if (posterId == null) {
      const activityLog = this.getActivityLog(null);
      posterId = activityLog ? XMActivityLog.GetInitiator(activityLog) : null;
    }
    return posterId;
  }

    /**
     * Poster's ID - from explicitly set value or infer from activitylog
     *
     * @return {string} userId of poster
     */
     getCommentPosterId() {
      let commentPosterId = this.getCreatorId(null);
      if (commentPosterId == null) {
        const activityLog = this.getActivityLog(null);
        commentPosterId = activityLog ? XMActivityLog.GetCommentInitiator(activityLog) : null;
      }
      return commentPosterId;
    }

  /**
   * Extract the ID of the post, if the activity wrapped by this
   * object indicates it is related to an XMPost object
   *
   * @return {string} postId if activity is about a Post
   */
  getPostId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetPostID(data, defaultVal) : defaultVal;
  }

  /**
   * Return the ID of the original post, if this happens to be
   * a repost of another.
   *
   * @param {*} defaultVal
   * @return {string} original post ID, or null this is the original
   *
   * @see ~isShared
   */
  getOriginalPostId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetOriginalPostID(data, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string} original poster's userId
   */
  getOriginalPosterId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetOriginalPostOwnerID(data, defaultVal) : defaultVal;
  }


  /**
   * Determine the ID of the post's stats. This is NOT necessary
   * the Post's ID, because if the post is shared of another,
   * the stats we must use is that of the original post.
   *
   * @return {string} suitable poststat's ID
   */
  getPostStatsId() {
    let id = this.getOriginalPostId(null);
    if (id == null) { id = this.getPostId(null); }
    return id;
  }

  /**
   * Return piggybacked object/data that is tracked in this
   * object's aux_data, or a (tracked/transient) parent container.
   *
   * This is the shared logic to get to the post, post stats, and user info
   * piggybacked objects.
   *
   * @param {string} objectId
   * @param {string} objectType model type (see ModelType.*)
   * @param {boolean} wrap true to wrap with XMPost instead of raw json
   * @param {*} defaultVal
   * @return {XObject} or json if no wrap
   *
   * @see ~getPost
   * @see ~getPostStats
   * @see ~getUserInfo
   */
  getAuxObject(objectId, objectType, wrap = true, defaultVal = null) {
    const postId = this.getPostId(null);
    if (postId == null) { return defaultVal; }

    const objectMap = this.getAuxDataField(objectType, null);
    const obj = objectMap ? objectMap[objectId] : null;
    if (obj == null) { return defaultVal; }
    return wrap ? XObject.Wrap(obj, objectType) : obj;
  }

  /**
   * Set an XObject (or json) to an aux object map.  This is
   * different than direct map in that the AUX_DATA json is
   * a map of object types, and under each type is object
   * instances mapped using their ID as key.
   *
   * @param {XObject} xObject
   * @param {boollean} unwrap
   * @param {*} defaultVal
   * @return {*} previous value stored
   */
  setXAuxObject(xObject, unwrap = true, defaultVal = null) {
    const objectId = xObject.getPostId(null);
    if (objectId == null) { return defaultVal; }
    const objectType = xObject.getType();

    const auxData = this.getAuxData(true);
    let objectMap = auxData[objectType];
    if (objectMap == null) {
      objectMap = {};
      auxData[objectType] = objectMap;
    }
    const prevValue = objectMap[objectId];
    objectMap[objectId] = unwrap ? XObject.Unwrap(xObject) : xObject;

    return prevValue;
  }

  /**
   * Return XMPost object that maybe piggybacked with this or
   * parent container object
   *
   * @param {boolean} wrap true to wrap with XMPost instead of raw json
   * @param {*} defaultVal
   * @return {XMPost} or json if no wrap
   */
  getPost(wrap = true, defaultVal = null) {
    const postId = this.getPostId(null);
    return postId ? this.getAuxObject(postId, ModelType.POST, wrap, defaultVal) : defaultVal;
  }

  /**
   * Return XMPost object that maybe piggybacked with this or
   * parent container object
   *
   * @param {boolean} wrap true to wrap with XMPost instead of raw json
   * @param {*} defaultVal
   * @return {XMPost} or json if no wrap
   */
  getOriginalPost(wrap = true, defaultVal = null) {
    const postId = this.getOriginalPostId(null);
    return postId ? this.getAuxObject(postId, ModelType.POST, wrap, defaultVal) : defaultVal;
  }

  /**
   * Piggyback corresponding XMPost object by placing it in the AUX_DATA field.
   * @param {XMPost} xPost
   */
  setPost(xPost) {
    return this.setAuxDataXField(xPost);
  }

  /**
   * Return XMPostStats object that maybe piggybacked with this or
   * parent container object
   *
   * @param {boolean} wrap true to wrap with XMPost instead of raw json
   * @param {boolean=} create true to create new instance, false to return null
   * @return {XPostStats} or json if no wrap, or null if no postId or data and don't create
   */
  getPostStats(wrap = true, create = true) {
    const postId = this.getPostStatsId(null);
    if (postId == null) { return null; }

    const obj = this.getAuxObject(postId, ModelType.POST_STATS, wrap, null);
    if (Util.NotNull(obj)) { return wrap ? XObject.Wrap(obj, XPostStats) : obj; }

    return (create === true) ? XPostStats.CreateNew(postId) : null;
  }

  /**
   * Return XUserInfo object that maybe piggybacked with this or
   * parent container object
   *
   * @param {boolean} wrap true to wrap with XUserInfo instead of raw json
   * @param {*} defaultVal
   * @return {XUserInfo} or json if no wrap
   */
  getUserInfo(wrap = true, defaultVal = null) {
    const userId = this.getPosterId(null);
    return userId ? this.getAuxObject(userId, ModelType.USER_INFO, wrap, defaultVal) : defaultVal;
  }

  /**
   * Return XUserInfo object that maybe piggybacked with this or
   * parent container object
   *
   * @param {boolean} wrap true to wrap with XUserInfo instead of raw json
   * @param {*} defaultVal
   * @return {XUserInfo} or json if no wrap
   */
  getOriginalPosterInfo(wrap = true, defaultVal = null) {
    const userId = this.getOriginalPosterId(null);
    return userId ? this.getAuxObject(userId, ModelType.USER_INFO, wrap, defaultVal) : defaultVal;
  }

  /**
   * Generate the message from text template filled by
   * the variables. If a variable map is provided, it'll
   * be used before use the one stored as backup. This
   * allows UI to override with values that are maked up.
   *
   * @param {{}} priorityVarMap overriding variable map.
   * @param {XVarData} variable data map that can fill actual data
   * @param {function} valueRender function(text, props) that can do
   * further rendering of a processed text fragment.
   * @param {*} defaultVal return this if text template is
   * missing.
   * @return {string} formatted text
   */
  generateMessage(priorityVarMap = null, varDataMap = null, valueRenderer = null, defaultVal = []) {
    const data = this.getData(false);
    return data
      ? XMPostItem.GenerateMessage(data, priorityVarMap, varDataMap, valueRenderer, defaultVal)
      : defaultVal;
  }

  /**
   * Generate the message fragments from text template filled by
   * the variables. If a variable map is provided, it'll
   * be used before use the one stored as backup. This
   * allows UI to override with values that are maked up.
   *
   * @param {{}} priorityVarMap overriding variable map.
   * @param {XVarData} variable data map that can fill actual data
   * @param {function} valueRender function(text, props) that can do
   * further rendering of a processed text fragment.
   * @param {*} defaultVal return this if text template is
   * missing.
   * @return {[]} array of text components
   */
  generateMessageFrags(priorityVarMap = null, varDataMap = null, valueRenderer = null, defaultVal = []) {
    const data = this.getData(false);
    return data
      ? XMPostItem.GenerateMessageFrags(data, priorityVarMap, varDataMap, valueRenderer, defaultVal)
      : defaultVal;
  }

  /**
   * Set a string template, which can be an ES6 string
   * template (using {variable}).
   *
   * @param {string} template text template
   */
  setMessageTemplate(template) {
    return XMPostItem.SetMessageTemplate(this.getData(true), template);
  }

  /**
   * Return the message text template
   *
   * @param {*} defaultVal
   */
  getMessageTemplate(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetMessageTemplate(data, defaultVal) : defaultVal;
  }

  /**
   * Return the compiled message text processor from the
   * pre-cached. If none then we compile it and also cache it.
   *
   * @param {*} defaultVal if template is not found, return this
   * @return {function} compiled template function
   */
  getCompiledTemplate(defaultVal = null) {
    const template = this.getMessageTemplate();
    if (template == null) { return defaultVal; }
    return XMPostItem.GetCompiledTemplate(template, defaultVal);
  } // getCompiledTemplate

  /**
   * Return the notification's recipient (user ID)
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} recipient's user ID
   *
   * @see ~setReceiverId
   * @see ~getSender
   */
  getReceiverId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetReceiverId(data, defaultVal) : defaultVal;
  } // getReceiver


  /**
   * Set the recipient user ID
   *
   * @param {string} userId ID of user receiving the notification
   * @return {boolean} true if values set
   *
   * @see ~setSenderId
   * @see ~getReceiverId
   */
  setReceiverId(userId) {
    const data = this.getData(true);
    return data ? XMPostItem.SetReceiverId(data, userId) : false;
  } // setReceiver


  /**
   * Set feed item type that is action caused.
   *
   * @param {string} type
   */
  setAction(type) {
    return XMPostItem.SetAction(this.getData(true), type);
  }

  /**
   * Return the feed item action type
   *
   * @param {*} defaultVal
   */
  getAction(defaultVal = null) {
    const data = this.getActivityLog();
    return data ? XMPostItem.GetAction(data, defaultVal) : defaultVal;
  }

  /**
   * Derive/return the actioner ID. Actioner is the user ID on the left
   * side of the action verb. If the actioner is not a user, then fall back
   * to the initiator.
   *
   * @param {*} defaultVal
   * @return {string} source user Id or initiator Id
   * @see ~getInitiator
   */
  getActioner(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetActioner(data, defaultVal) : defaultVal;
  }

  getTargetId(defaultVal = null) {
    const activityLog = this.getActivityLog();
    return activityLog ? XMActivityLog.GetTargetId(activityLog) : defaultVal;
  }

  /**
   * Set/override entire variable map. Any previous will be
   * gone!
   *
   * @param {{}} varMap property/values stored in this object
   */
  setVariableMap(varMap) {
    return XMPostItem.SetVariableMap(this.getData(true), varMap);
  }

  /**
   * Return entire variable map
   *
   * @param {*} defaultVal
   */
  getVariableMap(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetVariableMap(data, defaultVal) : defaultVal;
  }

  /**
   * Set a variable/value entry only. If variable map does not
   * exist, then one will be created.
   *
   * @param {string} label
   * @param {string} value
   */
  setVariable(label, value) {
    return XMPostItem.SetVariable(this.getData(true), label, value);
  }

  /**
   * Return value of the specified variable.
   * @param {string} label
   * @param {string=} defaultVal return this if no variable entry or
   * the value is null/undefined
   */
  getVariable(label, defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetVariable(data, label, defaultVal) : defaultVal;
  } // getVariable

  /**
   * Track the "essential properties" of the given
   * activity log object.
   *
   * Note this method shouldn't be used normally.
   * Should use the static method CreateFromActivity.
   *
   * @param {XMActivityLog} xActivityLog
   *
   * @see ~CreateFromActivity
   */
  _setActivityLog(xActivityLog) {
    const props = xActivityLog.getCachedProps();
    // let jsonAct = XMActivityLog.Unwrap(xActivityLog);
    if (props) { this.set(MessageProps.ACTIVITY, props); }
  }

  /**
   * Set the given props as the common/essential props
   * for the activity data
   *
   * @param {{}} props object with labels in MessageProps.PROPS_COMNMON
   *
   * @see ~CreateFromActivity
   * @see ~_setActivityLog
   */
  _setEssentialProps(props) {
    this.set(MessageProps.ACTIVITY, props);
  }

  /**
   * Remove the activity log object embedded in this notification.
   *
   * @return {{}} existing embedded activity log json
   */
  clearActivityLog() {
    const data = this.getData(false);
    return data ? this.set(MessageProps.ACTIVITY, null) : null;
  }

  /**
   * Get the (json) activity log.
   *
   * @param {*} defaultVal
   * @return {{}} activity data in json
   *
   * @see ~getXMActivityLog
   */
  getActivityLog(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMPostItem.GetActivityLog(data, defaultVal) : defaultVal;
  }

  /**
   * Return the activity content as an instance of XMActivityLog
   *
   * @param {*} defaultVal
   * @return {XMActivityLog}
   */
  getXMActivityLog(defaultVal = null) {
    const jsonObj = this.getActivityLog(null);
    return jsonObj ? XMActivityLog.Wrap(jsonObj) : defaultVal;
  }

  /**
   * Return the content (essential Activity properties) as
   * a stringified JSON.
   *
   * @param {defaultVal=} defaultVal if no activity data then return this value
   * @return {string} stringified json of essential properties
   *
   * @see MessageProps.PROPS_COMMON
   */
  getCommonPropsString(defaultVal = null) {
    const essentialProps = this.getActivityLog(null);
    return essentialProps ? JSON.stringify(essentialProps) : defaultVal;
  }

  /**
   * Return a signature string for the activity log within the news item.
   * It is used to differentiate during sorting.
   *
   * @param {boolean} includeType include "type" in the signature string.
   * This is normally off but used to make unique if same object ID is
   * used for multiple types.
   * @param {*} defaultVal
   */
  getSignature(includeType = false, defaultVal = null) {
    const activityData = this.getActivityLog(null);
    const sig = activityData ? XMActivityLog.GetSignature(activityData, includeType) : null;
    return sig || defaultVal;
  }

  /**
   * Override the updated TS, which should only used the timestamp
   * from the embedded activity log's
   *
   * @param {*} defaultVal
   * @return {number} timestamp of the embedded activity log essential props
   */
  getUpdatedTS(defaultVal = null) {
    const activityData = this.getActivityLog(null);
    let updatedTS = XMPostItem.GetUpdatedTS(activityData, null);
    if (updatedTS == null) { updatedTS = super.getUpdatedTS(null); }
    return updatedTS || defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {XMPost}
   */
  getSharedPost() {
    const activityData = this.getActivityLog(null);
    const sharedPostIds = activityData ? XMActivityLog.GetSharedPostIDs(activityData) : null;
    const post = sharedPostIds && sharedPostIds[0] ? this.getAuxObject(sharedPostIds[0], ModelType.POST, true, null) : null

    return post;
  }

  getLikedSharedPost() {
    const postObj = this.getPost();
    const sharedPostIds = postObj ? XMActivityLog.GetSharedPostIDs(postObj.data) : null;
    return sharedPostIds && sharedPostIds[0] ? this.getAuxObject(sharedPostIds[0], ModelType.POST, true, null) : null
  }

  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************


  static GetName() {
    return _CLSNAME;
  }

  static GetFolderName() {
    return ModelFolder.POST_ITEM;
  }

  static GetTypeID() {
    return ModelType.POST_ITEM;
  }

  /**
   * Wrap JSON data that represents XMPostItem ONLY.
   */
  static Wrap(jsonRec, clsType = XMPostItem) {
    return XMPostItem.WrapXObject(jsonRec, clsType);
  }

  /**
   * Derive a notification record ID that with the format:
   * {action}_{userId}_{ISODate}
   *
   * @param {{}} jsonRec notification json object filled out
   * @param {number} ts timestamp override
   * @return {string} ID string. Null if action or initiator fields not specified.
   *
   * @see XMActivityLog~setDerivedID
   */
  static DeriveID(jsonRec, msgType = null, receiverId = null, ts = null) {
    const action = XMPostItem.GetAction(jsonRec, null);
    receiverId = receiverId || XMPostItem.GetReceiver(jsonRec, null);
    if (!action || !receiverId) {
      return null;
    }

    const createdTS = ts || XMPostItem.GetCreatedTS(jsonRec, Date.now());

    const dateStr = new Date(createdTS).toISOString();
    const idStr = `${receiverId}_${dateStr}_${action}`;
    return idStr;
  } // DeriveID

  /**
   * Create an user info record aggregated from difference
   * sources but mainly XMUser. It is suitable to give to
   * client for rendering.
   *
   * @param {string} id assigned id
   * @return {XMPostItem}
   */
  static Create(id, tpl, varMap) {
    const msg = new XMPostItem();
    msg._setId(id);
    msg.setMessageTemplate(tpl);
    msg.setVariableMap(varMap);

    return msg;
  } // Create

  /**
   * Create new object from XMActivityLog object
   *
   * @param {string} receiverId receiving user ID (username)
   * @param {XMPostItem} xActivityLog
   */
  static CreateFromActivity(receiverId, xActivityLog) {
    /** @type {XMPostItem} alert */
    const postItem = new XMPostItem();
    postItem.initNew();
    postItem.setReceiverId(receiverId);
    postItem._setId(`${receiverId}_${xActivityLog.getId()}`);   // same ID as XMNotification for marking later
    // newsItem.setAction(xActivityLog.getAction());
    // newsItem.setUpdatedTS(xActivityLog.getUpdatedTS());

    // This will extract selective properties suitable for caching
    postItem._setActivityLog(xActivityLog);

    // hashtags/usertags are not essential props of activity log,
    // so store them at this level which will allow database search
    // or reference in additional cache indices.
    postItem.addHashtags(xActivityLog.getHashtags(null));
    postItem.addUsertags(xActivityLog.getUsertags(null));

    // should just copy everything from XMActivity?
    // this.Log(_CLSNAME, "CreateFromActivity", "Dump:", newsItem.toJSON());

    return postItem;
  } // CreateFromActivity

  /**
   * Create new object from essential props of activity log,
   * which is stored as feed stream in cache
   *
   * @param {string} receiverId receiver's user ID
   * @param {{}} essentialProps object containing essential property label/values
   * @return {XMPostItem}
   */
  static CreateFromEssentialProps(receiverId, essentialProps, tpl = null) {
    /** @type {XMPostItem} alert */
    const newsItem = new XMPostItem();
    newsItem.initNew(false);
    newsItem.setReceiverId(receiverId);

    // should just copy everything from XMNotification
    if (typeof essentialProps === 'string') { essentialProps = JSON.parse(essentialProps); }
    newsItem._setEssentialProps(essentialProps);

    newsItem._setId(`${receiverId}_${XMActivityLog.GetId(essentialProps)}`);
    newsItem.setAction(XMActivityLog.GetAction(essentialProps));
    newsItem.setCreatedTS(XMActivityLog.GetCreatedTS(essentialProps));

    return newsItem;
  } // CreateFromEssentialProps


  /**
   * Return the XMActivityLog json content
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetActivityLog(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, MessageProps.ACTIVITY, defaultVal);
  } // GetActivityLog

  /**
   * Extract the ID of the post, if the activity wrapped by this
   * object indicates it is related to an XMPost object
   *
   * @return {string} postId if activity is about a Post
   */
  static GetPostID(jsonObj, defaultVal = null) {
    const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
    const postId = activityLog ? XMActivityLog.GetPostID(activityLog, null) : null;
    return postId || defaultVal;
  }

  static GetPosterId(jsonObj) {
    let posterId = XMPostItem.GetCreatorId(jsonObj);
    if (posterId == null) {
      const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
      posterId = activityLog ? XMActivityLog.GetInitiator(activityLog) : null;
    }
    return posterId;
  }

  static GetPostOwnerId(jsonObj) {
    const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
    const posterId = activityLog ? XMActivityLog.GetPostOwnerID(activityLog) : null;
    return posterId;
  }

  /**
   * Extract the ID of the original post, if the activity wrapped by this
   * object indicates it is a XMPost object and it is SHARED
   *
   * @return {string} postId if activity is about a shared Post
   */
  static GetOriginalPostID(jsonObj, defaultVal = null) {
    const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
    const postId = activityLog ? XMActivityLog.GetOriginalPostID(activityLog, null) : null;
    return postId || defaultVal;
  }

  static GetOriginalPostOwnerID(jsonObj, defaultVal = null) {
    const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
    const ownerId = activityLog ? XMActivityLog.GetOriginalPostOwnerID(activityLog, null) : null;
    return ownerId || defaultVal;
  }

  /**
   * Extract the ID of the shared post, if the activity wrapped by this
   * object indicates it is a XMPost object and it is SHARED
   *
   * @return {string[]} postIds
   */
  static GetSharedPostIDs(jsonObj, defaultVal = null) {
    const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
    const postId = activityLog ? XMActivityLog.GetRepostedIds(activityLog, null) : null;
    return postId || defaultVal;
  }

  static GetSharedPosterIDs(jsonObj, defaultVal = null) {
    const activityLog = XMPostItem.GetActivityLog(jsonObj, null);
    const ownerId = activityLog ? XMActivityLog.GetRepostedOwnerIds(activityLog, null) : null;
    return ownerId || defaultVal;
  }

  /**
   * Determine the ID of the post's stats. This is NOT necessary
   * the Post's ID, because if the post is shared of another,
   * the stats we must use is that of the original post.
   *
   * @param {{}} jsonObj
   * @return {string} suitable poststat's ID
   */
  static GetPostStatsID(jsonObj, defaultVal = null) {
    let id = XMPostItem.GetOriginalPostID(jsonObj, null);
    if (id == null) { id = XMPostItem.GetPostID(jsonObj, null); }
    return id;
  }

  /**
   * Generate the message fragments from text template filled by
   * the variables. If a variable map is provided, it'll
   * be used before use the one stored as backup. This
   * allows UI to override with values that are maked up.
   *
   * @param {{}} jsonObj
   * @param {{}} priorityVarMap overriding variable map.
   * @param {XVarData} varDataMap data map - data to fill
   * @param {function} valueRenderer function to further render value
   * procesed per fragment. A perfect example is the web UI would
   * take a user nickname and wrap a component or a link around it.
   * @param {*} defaultVal return this if text template is
   * missing.
   * @return {[]} array of text or other objects (e.g., React Component)
   */
  static GenerateMessageFrags(jsonObj, priorityVarMap = null, varDataMap = null,
    valueRenderer = null, defaultVal = null) {
    const presetVarMap = XMPostItem.GetVariableMap(jsonObj, null);
    const varMap = { ...presetVarMap, ...priorityVarMap };
    // console.log("GenerateMessage: combined varMaps: ", varMap);
    let mergeableText;
    const textTpl = XMPostItem.GetMessageTemplate(jsonObj, null);
    if (textTpl == null) { return defaultVal; }
    const compiledTpl = XMPostItem.GetCompiledTemplate(textTpl, null);
    if (compiledTpl) {
      // console.log("GeneralMessage: using compiled: ", compiledTpl);
      mergeableText = compiledTpl(varMap);
    } else {
      console.warn('GeneralMessage: no compiled template. Merge directly.');
      mergeableText = templateMerge(textTpl, varMap);
    }
    let result;
    if (Util.NotNull(varDataMap)) {
      const srcFrags = SymbolExpr.ParseExprWrappers(mergeableText);
      const outFrags = [];
      srcFrags.forEach((frag) => {
        if (frag.startsWith('#')) {
          const filledText =
            varDataMap.getValueFromSymbolExpr(frag.substring(1), valueRenderer);
          outFrags.push(filledText);
        } else { outFrags.push(frag); }
      });
      result = outFrags;
    } else { result = [mergeableText]; }
    return result;
  } // GenerateMessage

  /**
   * Generate the message from text template filled by
   * the variables. If a variable map is provided, it'll
   * be used before use the one stored as backup. This
   * allows UI to override with values that are maked up.
   *
   * @param {{}} jsonObj
   * @param {{}} priorityVarMap overriding variable map.
   * @param {XVarData} varDataMap data map - data to fill
   * @param {function} valueRenderer function to further render value
   * procesed per fragment. A perfect example is the web UI would
   * take a user nickname and wrap a component or a link around it.
   * @param {*} defaultVal return this if text template is
   * missing.
   */
  static GenerateMessage(jsonObj, priorityVarMap = null, varDataMap = null,
    valueRenderer = null, defaultVal = null) {
    const result = XMPostItem.GenerateMessageFrags(jsonObj, priorityVarMap, varDataMap,
      valueRenderer, defaultVal);
    return Array.isArray(result) ? result.join('') : result;
  }

  /**
   * Set a string template, which can be an ES6 string
   * template (using {variable}).
   *
   * @param {{}} jsonObj
   * @param {string} template text template
   */
  static SetMessageTemplate(jsonObj, template) {
    return XMPostItem.SetObjectField(jsonObj, this.MSGTPL, template);
  }

  /**
   * Return the message text template
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetMessageTemplate(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, this.MSGTPL, defaultVal);
  }

  /**
   * Given a text template, lookup/generate compiled version of it.
   *
   * @param {string} template
   */
  static GetCompiledTemplate(template, defaultVal = null) {
    if (template == null) { return defaultVal; }
    let compiled = cachedTemplate[template];
    if (compiled == null) {
      compiled = cachedTemplate[template] = templateCompile(template);
    }
    return compiled;
  } // GetCompiledTemplate

  /**
   * Set the recipient user ID
   *
   * @param {{}} jsonObj
   * @param {string} recipient's user ID
   * @return {boolean} true if values set
   *
   * @see ~SetSender
   */
  static SetReceiverId(jsonObj, userId) {
    if (!XMPostItem.AssertArrayNoNulls([jsonObj, userId], 'SetReceiverId')) { return false; }
    XMPostItem.SetObjectField(jsonObj, MessageProps.RECEIVER_ID, userId);
    return true;
  } // SetReceiverId

  /**
   * Return the notification's recipient (user ID)
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} recipient's user ID
   */
  static GetReceiverId(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, MessageProps.RECEIVER_ID, defaultVal);
  } // GetReceiverId

  /**
   * Set message type
   *
   * @param {{}} jsonObj
   * @param {string} type
   */
  static SetAction(jsonObj, type) {
    return XMPostItem.SetObjectField(jsonObj, this.ACTION, type);
  }

  /**
   * Return the message type
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetAction(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, this.ACTION, defaultVal);
  }

  /**
   * Return the actioner's user ID. Actioner is the left-side
   * of action verb if it's a user. If not, then default to
   * initiator.
   *
   * @param {{}} jsonRec
   * @param {*} defaultVal
   *
   * @return {string} either source userId or initiatorId in the order of preference
   * @see ~GetInitiator
   */
  static GetActioner(jsonRec, defaultVal = null) {
    let userId = (XMPostItem.GetSourceType(jsonRec) === ModelType.USER) ? XMPostItem.GetSourceId(jsonRec, null) : null;
    if (userId == null) { userId = XMPostItem.GetInitiator(jsonRec, null); }
    return userId || defaultVal;
  }

  /**
   * Get the initiator ID of this log. Note initiator is different than
   * actioner.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~GetActioner
   */
  static GetInitiator(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, MessageProps.INITIATOR_ID, defaultVal);
  }

  /**
   * Get the source side object's ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetSourceObject
   * @see ~GetSourceType
   * @see ~GetSourceOwnerId
   */
  static GetSourceId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(jsonObj, MessageProps.SRC_ID, defaultVal);
  }

  /**
   * Get the source side object's type
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetSourceObject
   * @see ~GetSourceId
   */
  static GetSourceType(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, MessageProps.SRC_TYPE, defaultVal);
  }


  /**
   * Set/override entire variable map. Any previous will be
   * gone!
   *
   * @param {{}} jsonObj
   * @param {{}} varMap property/values stored in this object
   */
  static SetVariableMap(jsonObj, varMap) {
    return XMPostItem.SetObjectField(jsonObj, this.VARMAP, varMap);
  }

  /**
   * Return entire variable map
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetVariableMap(jsonObj, defaultVal = null) {
    return XMPostItem.GetObjectField(jsonObj, this.VARMAP, defaultVal);
  }

  /**
   * Set a variable/value entry only. If variable map does not
   * exist, then one will be created.
   *
   * @param {{}} jsonObj
   * @param {string} label
   * @param {string} value
   */
  static SetVariable(jsonObj, label, value) {
    XMPostItem.AssertNotNull(label, 'SetVariable', 'label cannot be null');
    let varMap = XMPostItem.GetVariableMap(jsonObj, this.VARMAP, null);
    if (varMap == null) {
      varMap = {};
      XMPostItem.SetVariableMap(jsonObj, varMap);
    }
    varMap[label] = value;
    return true;
  }

  /**
   * Return value of the specified variable.
   * @param {{}} jsonObj
   * @param {string} label
   * @param {string=} defaultVal return this if no variable entry or
   * the value is null/undefined
   */
  static GetVariable(jsonObj, label, defaultVal = null) {
    XMPostItem.AssertNotNull(label, 'GetVariable', 'label cannot be null');
    const varMap = XMPostItem.GetVariableMap(jsonObj, this.VARMAP, null);
    const value = varMap ? varMap[label] : null;
    return value || defaultVal;
  } // GetVariable


} // class XMPostItem

XMPostItem.RegisterType(XMPostItem);

export default XMPostItem;
