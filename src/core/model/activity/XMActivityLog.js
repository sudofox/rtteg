import {
  ModelType,
  ModelFolder,
  MessageProps,
  ActivityLogProps,
} from '../ModelConsts';
import Util from '../../Util';
import XMSocialIndexable from '../social/XMSocialIndexable';
import XObject from '../XObject';

const _CLSNAME = 'XMActivityLog'; // match class name

// const STATUS_OK = "ok";
// const STATUS_ERROR = "error";

/**
 * Model a log entry storing a single activity,
 * or a sub-activity. Depends on the activity, the
 * fields can be quite different. Thus json style
 * document is very much preferred. But there are
 * some core fields that we define:
 *
 * FIELD_INITIATOR: initiator of the action (user or system)
 * FIELD_ACTION: action verb
 * FIELD_SRC_TYPE: source side data type
 * FIELD_SRC_ID: source side record ID
 * FIELD_TGT_TYPE: target side data type
 * FIELD_TGT_ID: target side record ID
 * POST_ID: convenient access to post in question
 * ORIG_POST_ID: track the original post if post_id is a repost type
 */
class XMActivityLog extends XMSocialIndexable {
  // Constants access
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMActivityLog;
  }

  /**
   * Initialize content as a new object.
   */
  initNew() {
    super.initNew();
    this._setNew();
    this.setCreatedTS();
  }

  /**
   * Tell StorageManager don't create an updated timestamp.
   *
   * @return {boolean} false
   */
  mustHaveUpdatedTS() {
    return false;
  }


  /**
   * Return the ID of this log record, and if isn't
   * assigned yet, derive it if possible and set
   * in the record
   *
   * @deprecated - replaced by a sequential ID generator
   *
   * @param {*} derive
   *
   * @see ~ActivityLogger._AssignID (backend)
   */
  getDerivedID(defaultVal = null) {
    let id = super.getId();
    if (id == null) {
      const data = this.getData(false);
      if (data == null) {
        return defaultVal;
      }
      id = XMActivityLog.DeriveID(data);
      if (id) {
        this._setId(id);
      }
    }
    return id;
  }

  /**
   * Derive unique ID based on action, user, and
   * creation timestamp, and set it as ID if it's
   * not already.
   *
   * @param {string} action action verb override
   * @param {string} userId username override
   * @param {number} ts timestamp override
   * @return {string} derived ID that is set
   */
  setDerivedID(action = null, userId = null, ts = null) {
    const id = XMActivityLog.DeriveID(this.getData(true), action, userId, ts);
    if (id) {
      const curId = this.getId();
      if (id !== curId) {
        this._setId(id);
      }
    }
    return id;
  } // setDerivedID

  /**
   * Determine the content type of the activity record. There are two types,
   * one for source actor, and one for target entity. Usually one is a user
   * type, and the other is an object. We'll return the object type in these
   * cases. Will return ModelTYPE.USER if user is on both ends.
   *
   * @param {*} defaultVal in case there is no content type (shouldn't happen)
   * @return {string} one of ModelType.*, which can be POST, USER, etc.
   *
   */
  getContentType(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetContentType(data, defaultVal) : defaultVal;
  }

  /**
   * Set the associated post ID to avoid guessing on whether
   * a post is source or target object
   *
   * @param {string} action
   *
   * @see ActivityLogger
   */
  setPostId(action) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetPostID(data, action) : null;
  }

  /**
   *
   * @param {*} defaultVal
   */
  getPostId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetPostID(data, defaultVal) : defaultVal;
  }

  /**
   * Set the associated post ID to avoid guessing on whether
   * a post is source or target object
   *
   * @param {string} action
   *
   * @see ActivityLogger
   */
  setPostOwnerId(action) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetPostOwnerID(data, action) : null;
  }

  /**
   *
   * @param {*} defaultVal
   */
  getPostOwnerId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetPostOwnerID(data, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   */
  getOriginalOwnerId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetOriginalPostOwnerId(data, defaultVal) : defaultVal;
  }

  /**
   * Set the associated post ID to avoid guessing on whether
   * a post is source or target object
   *
   * @param {string} action
   *
   * @see ActivityLogger
   */
  setOriginalPostOwnerId(action) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetOriginalPostOwnerID(data, action) : null;
  }

  /**
   * Set the associated post ID to avoid guessing on whether
   * a post is source or target object
   *
   * @param {string} postId
   *
   * @see ActivityLogger
   */
  setOriginalPostId(postId) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetOriginalPostID(data, postId) : null;
  }

  /**
   *
   * @param {*} defaultVal
   */
  getOriginalPostId(defaultVal = null) {
    const data = this.getData(false);
    return data
      ? XMActivityLog.GetOriginalPostID(data, defaultVal)
      : defaultVal;
  }

  /**
   * Set the action verb. Note the action is not
   * validated here in the model. It is defined
   * and used in ActivityLogger.
   *
   * @param {string} action
   *
   * @see ActivityLogger
   */
  setAction(action) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetAction(data, action) : null;
  }

  /**
   * Retrieve the action string.
   *
   * @param {*} defaultVal
   */
  getAction(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetAction(data, defaultVal) : defaultVal;
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
    return data ? XMActivityLog.GetActioner(data, defaultVal) : defaultVal;
  }

  /**
   * Set the initiator of this log entry.
   *
   * @param {string} initiator a string value
   */
  setInitiator(initiator) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetInitiator(data, initiator) : null;
  }

  setInitiatorLvl(lvl) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetInitiatorLvl(data, lvl) : null;
  }

  /**
   * Retrieve the initiator string.
   *
   * @param {*} defaultVal
   */
  getInitiator(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetInitiator(data, defaultVal) : defaultVal;
  }

  getInitiatorLvl(defaultVal = 0) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetInitiatorLvl(data, defaultVal) : defaultVal;
  }

  /**
   * Set the hostname that carried out user's action
   *
   * @param {string} hostname a string value. if it's an url,
   * standard http:// and https:// will be stripped.
   * @return {string} previous set value
   */
  setUserHost(hostname) {
    const data = this.getData(true);
    return data ? XMActivityLog.SetUserHost(data, hostname) : null;
  }

  /**
   * Retrieve the user's action hostname
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getUserHost(defaultVal) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetUserHost(data, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {string} ecode
   */
  setErrorCode(ecode) {
    if (ecode) { this.set(ActivityLogProps.API_ECODE, ecode); }
  }

  /**
   *
   * @param {string} serviceName
   */
  setServiceName(serviceName) {
    return this.set(ActivityLogProps.SVC_NAME, serviceName);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getServiceName(defaultVal = null) {
    return this.get(ActivityLogProps.SVC_NAME, defaultVal);
  }

  /**
   *
   * @param {string} hasMedia
   */
  setHasMedia(hasMedia) {
    return this.set(ActivityLogProps.HAS_MEDIA, hasMedia);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getHasMedia(defaultVal = null) {
    return this.get(ActivityLogProps.HAS_MEDIA, defaultVal);
  }

  /**
   * Set the backend API entry point information
   *
   * @param {string} apiType one of API_TYPE_USER, API_TYPE_SYS, API_TYPE_API
   * @param {string} hostname user's hostname
   * @param {string} apiName offical name of the API
   * @param {string} spec API details (endpoint, parameters, etc)
   * @param {number} duration runtime in milliseconds
   * @param {string} ecode error code, if any
   */
  setAPIStatus(apiType, hostname, apiName, spec, duration, ecode) {
    // if (apiName == null) {
    //   console.trace('Missing API name');
    //   apiName = 'unkonwn';
    // }
    // if (apiType == null) {
    //   apiType = 'unknown';
    // }
    if (hostname) {
      this.setUserHost(hostname);
    }
    if (Util.NotNull(apiType)) {
      this.set(ActivityLogProps.API_TYPE, apiType);
    }
    if (Util.NotNull(apiName)) {
      this.set(ActivityLogProps.API_NAME, apiName);
    }
    if (Util.NotNull(spec)) {
      this.set(ActivityLogProps.API_SPEC, spec);
    }
    if (Util.NotNull(duration)) {
      this.set(ActivityLogProps.API_TIME, duration);
    }
    if (Util.NotNull(ecode)) {
      this.setErrorCode(ecode);
    }
    return true;
  }

  getAPI_Name(defaultVal = null) {
    return this.get(ActivityLogProps.API_NAME, defaultVal);
  }

  getAPI_Type(defaultVal = null) {
    return this.get(ActivityLogProps.API_TYPE, defaultVal);
  }

  getAPI_Spec(defaultVal = null) {
    return this.get(ActivityLogProps.API_SPEC, defaultVal);
  }

  getAPI_Runtime(defaultVal = null) {
    return this.get(ActivityLogProps.API_TIME, defaultVal);
  }

  getAPI_ECode(defaultVal = null) {
    return this.get(ActivityLogProps.API_ECODE, defaultVal);
  }

  /**
   * Set the backend service entry point information
   *
   * @param {string} svcName
   * @param {*} defaultVal
   */
  setServiceStatus(svcName, duration = -1, rc = 0) {
    this.set(MessageProps.SVC_NAME, svcName);
    if (duration) {
      this.set(MessageProps.SVC_TIME);
    }
    if (rc) {
      this.set(MessageProps.SVC_ECODE);
    }
  }

  /**
   * Set the source side object type and ID.
   *
   * @param {string} srcType object (model) type, e.g., "rl"
   * @param {string} srcId
   * @param {string} ownerId userId who owns this source object
   *
   * @see ~getSourceId
   * @see ~getSourceType
   */
  setSourceObject(srcType, srcId, ownerId, srcObject = null) {
    return XMActivityLog.SetSourceObject(
      this.getData(true),
      srcType,
      srcId,
      ownerId,
      srcObject
    );
  }

  /**
   * Get the source side object's ID
   *
   * @param {*} defaultVal
   * @return {string} object identifier or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   */
  getSourceId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetSourceId(data, defaultVal) : defaultVal;
  }

  /**
   * Get the source side object's type
   * @param {*} defaultVal
   * @return {string} object type or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   */
  getSourceType(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetSourceType(data, defaultVal) : defaultVal;
  }

  getSourceObject(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetSourceObject(data, defaultVal) : defaultVal;
  }

  /**
   * Get the source side object's owner ID
   *
   * @param {*} defaultVal
   * @return {string} object identifier or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   */
  getSourceOwnerId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetSourceOwnerId(data, defaultVal) : defaultVal;
  }

  /**
   * Determine if the source side of the action is a user (with userId).
   *
   * @param {{}} jsonObj
   * @return {boolean} true if source type is ModelType.USER
   */
  sourceIsUser() {
    const data = this.getData(false);
    return data ? XMActivityLog.SourceIsUser(data) : false;
  }

  /**
   * Set the source side object type and ID.
   *
   * @param {string} targetType object (model) type, e.g., "rl"
   * @param {string} targetId
   * @param {string} ownerId user that owns this target object
   *
   * @see ~getSourceId
   * @see ~getSourceType
   */
  setTargetObject(targetType, targetId, ownerId, targetObject = null) {
    return XMActivityLog.SetTargetObject(
      this.getData(true),
      targetType,
      targetId,
      ownerId,
      targetObject
    );
  }

  /**
   * Get the source side object's ID
   *
   * @param {*} defaultVal
   * @return {string} object identifier or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   */
  getTargetId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetTargetId(data, defaultVal) : defaultVal;
  }

  /**
   * Get the source side object's type
   *
   * @param {*} defaultVal
   * @return {string} object type or defaultVal
   *
   * @see ~setTargetObject
   * @see ~getTargetId
   */
  getTargetType(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetTargetType(data, defaultVal) : defaultVal;
  }

  getTargetObject(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetTargetObject(data, defaultVal) : defaultVal;
  }

  /**
   * Get the source side object's owner ID
   *
   * @param {*} defaultVal
   * @return {string} object identifier or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   * @see ~getTargetId
   * @see ~getTargetType
   */
  getTargetOwnerId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetTargetOwnerId(data, defaultVal) : defaultVal;
  }

  /**
   * Determine if the target side of the action is a user (with userId).
   *
   * @param {{}} jsonObj
   * @return {boolean} true if target type is ModelType.USER
   */
  targetIsUser() {
    const data = this.getData(false);
    return data ? XMActivityLog.TargetIsUser(data) : false;
  }

  /**
   * Set the reposted side object type and ID.
   *
   * @param {string[]} repostedIds
   * @param {string[]} repostedOwnerIds user that owns this reposted object
   *
   * @see ~getSourceId
   * @see ~getSourceType
   */
  setRepostedObject(repostedIds, repostedOwnerIds) {
    return XMActivityLog.SetRepostedObject(
      this.getData(true),
      repostedIds,
      repostedOwnerIds
    );
  }

  /**
   * Get the source side object's ID
   *
   * @param {*} defaultVal
   * @return {string} object identifier or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   */
  getRepostedId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetRepostedId(data, defaultVal) : defaultVal;
  }

  /**
   * Get the source side object's type
   *
   * @param {*} defaultVal
   * @return {string} object type or defaultVal
   *
   * @see ~setTargetObject
   * @see ~getTargetId
   */
  getRepostedType(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetRepostedType(data, defaultVal) : defaultVal;
  }

  /**
   * Get the source side object's owner ID
   *
   * @param {*} defaultVal
   * @return {string} object identifier or defaultVal
   *
   * @see ~setSourceObject
   * @see ~getSourceId
   * @see ~getTargetId
   * @see ~getTargetType
   */
  getRepostedOwnerId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetRepostedOwnerId(data, defaultVal) : defaultVal;
  }

  /**
   * Set the source side object type and ID.
   *
   * @param {string} logId parent log's ID
   *
   * @see ~getParentLogId
   */
  setParentLogId(logId) {
    return XMActivityLog.SetParentLogId(this.getData(true), logId);
  }

  /**
   * Get parent's log ID, if any
   *
   * @param {*} defaultVal
   *
   * @see ~setParentLogId
   */
  getParentLogId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetParentLogId(data, defaultVal) : defaultVal;
  }

  /**
   * Set the ID of the log that is the inverse action of this log action
   *
   * @param {string} logId parent log's ID
   *
   * @see ~getInverseLogId
   */
  setInverseLogId(logId) {
    return XMActivityLog.SetInverseLogId(this.getData(true), logId);
  }

  /**
   * Get ID of the log that is the inverse action of this log action, if any
   *
   * @param {*} defaultVal
   *
   * @see ~setInverseLogId
   */
  getInverseLogId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMActivityLog.GetInverseLogId(data, defaultVal) : defaultVal;
  }

  /**
   * Generate a variable map using property labels defined
   * in ModelConst.MessageProp and refer to values stored in
   * this instance.
   *
   * @param {boolean} includeNull true to include all existing
   * fields in the object, null valued or not. Fields that don't
   * exist but can be included will not be.
   * @return {{}} variable map
   */
  getVarMap(includeNull = false, addBracket = false, defaultVal = null) {
    const data = this.getData(false);
    return data
      ? XMActivityLog.GetVarMap(data, includeNull, addBracket, defaultVal)
      : null;
  }

  /**
   * Derive signature for this activity log that focus more
   * on the actual event (xxx action yyy) rather than timestamp
   * or unique activity log id.
   *
   * @param {*} includeType
   */
  getSignature(includeType = false, defaultVal = null) {
    const data = this.getData(false);
    const sig = data ? XMActivityLog.GetSignature(data, includeType) : null;
    return sig || defaultVal;
  }

  /**
   * Return all common (message) properties from the activity log content.
   *
   * @return {{}} values associated with labels defined in MessageProps.PROPS_COMMON
   */
  getEssentialProps() {
    return this.toJSON(MessageProps.PROPS_COMMON, null);
  }

  /**
   * Return all properties from the activity log content that are
   * pre-identified to go into cache
   *
   * @return {{}} values associated with labels defined in MessageProps.PROPS_CACHE
   */
  getCachedProps() {
    return this.toJSON(MessageProps.PROPS_CACHED, null);
  }

  /**
   * Return the object Id. This depends on whether the
   * source is the user performing an action against
   * the target which is the object, or the other way
   * around.
   *
   * NOTE: Getter right now supports one object and that
   * is the post object. So the return value is most likely
   * the Id of the Post object in question
   *
   * @param {string=} type if specified, must match this type
   *
   * @return {string} object Id (likley Post Id)
   *
   * @see ~getPostId()
   */
  getObjectId(type = null, defaultVal = null) {
    let objectId;
    let objectType;
    if (this.targetIsUser()) {
      // no post I think...
      if (this.sourceIsUser()) {
        // this.log(_m, "src/tgt are users. dump activity log: ", activityLog);
        // skip - no object
      }
      objectId = this.getSourceId();
      objectType = this.getSourceType();
    } else {
      // hardcode for now...
      objectId = this.getTargetId();
      objectType = this.getTargetType();
    }
    if (objectId == null) {
      return defaultVal;
    }

    if (type == null) {
      return objectId;
    }

    return type === objectType ? objectId : defaultVal;
  } // getObjectId

  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * Return the default folder/table/collection name used
   * for storing stats
   */
  static GetFolderName() {
    return ModelFolder.ACTIVITY_LOG;
  }

  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return ModelType.ACTIVITY_LOG;
  }

  /**
   * Wrap JSON data that represents XMList
   */
  static Wrap(jsonRec, clsType = XMActivityLog) {
    return XMActivityLog.WrapXMObject(jsonRec, clsType);
  }

  /**
   * Derive a log record ID that with the format:
   * {action}_{userId}_{ISODate}
   *
   * @param {{}} jsonRec
   * @param {string} action action verb override
   * @param {string} userId username override
   * @param {number} ts timestamp override
   * @return {string} ID string. Null if action or initiator fields not specified.
   *
   * @see XMActivityLog~setDerivedID
   */
  static DeriveID(jsonRec, action = null, userId = null, ts = null) {
    action = action || XMActivityLog.GetAction(jsonRec, null);
    userId = userId || XMActivityLog.GetActioner(jsonRec, null);
    if (!action || !userId) {
      return null;
    }

    const createdTS = ts || XMActivityLog.GetCreatedTS(jsonRec, Date.now());

    // let dateStr = new Date(createdTS).toISOString();
    const idStr = `${userId}_${action}_${createdTS}`;
    return idStr;
  } // DeriveID

  /**
   * Create a new log for a user action.
   *
   * @param {string} userId user performed the action, and is also as the initiator. So
   * if the initiator is different then the user, make a separate call to setInitiatorId()
   * @param {number} userLvl
   * @param {string} action
   * @param {string=} targetType object type on the target side of the action
   * @param {string=} targetId object ID on the target side of the action
   * @param {string=} targetOwnerId object's owner ID, if any
   * @param {number=} initTS initiation timestamp. If null then use current time
   * @param {string[]=} repostIds reposted object's ID, if any
   * @param {string[]=} reposterIds reposted object's owner ID, if any
   * @param {string=} postId object ID on the post side of the action
   * @param {string=} postOwnerId object's owner ID, if any
   * @param {string=} originalPostId object ID on the original post side of the action
   * @param {string=} originalPostOwnerId object's owner ID, if any
   *
   * @return {XMActivityLog} new instance wrapper with initTS/action field set
   */
  static NewUserAction(
    userId,
    action,
    targetType = null,
    targetId = null,
    targetOwnerId = null,
    initTS = null,
    repostIds = null,
    reposterIds = null,
    postId = null,
    postOwnerId = null,
    originalPostId = null,
    originalPostOwnerId = null
  ) {
    const log = new XMActivityLog();
    log.initNew();
    log.setCreatedTS(initTS);
    log.setInitiator(userId);
    log.setSourceObject(ModelType.USER, userId);
    log.setAction(action);

    if (targetType || targetId) {
      log.setTargetObject(targetType, targetId, targetOwnerId);
    }

    if (!Util.IsNull(repostIds) || !Util.IsNull(reposterIds)) {
      log.setRepostedObject(repostIds, reposterIds);
    }

    if (postId) {
      log.setPostId(postId);
      log.setPostOwnerId(postOwnerId);
    }

    if (originalPostId) {
      log.setOriginalPostId(originalPostId);
      log.setOriginalPostOwnerId(originalPostOwnerId);
    }

    return log;
  }

  static NewUserActionFromMap(
    data = {}
  ) {
    const initiatorId = data[MessageProps.INITIATOR_ID];
    const initiatorLvl = data[MessageProps.INITIATOR_LVL] || 0;
    const srcId = data[MessageProps.SRC_ID];
    const action = data[MessageProps.ACTION];
    const targetType = data[MessageProps.TGT_TYPE];
    const targetId = data[MessageProps.TGT_ID];
    const targetOwnerId = data[MessageProps.TGT_OWNER_ID];
    const initTS = data[MessageProps.CREATED_DATE];
    const repostIds = data[MessageProps.RPS_IDS];
    const reposterIds = data[MessageProps.RPS_OWNER_IDS];
    const postId = data[MessageProps.POST_ID];
    const postOwnerId = data[MessageProps.OWNERID];
    const originalPostId = data[MessageProps.ORIG_POST_ID];
    const originalPostOwnerId = data[MessageProps.ORIG_POST_OWNER_ID];
    const hasMedia = data[MessageProps.HAS_MEDIA];
    const targetObject = data[MessageProps.TGT_OBJECT];

    const log = new XMActivityLog();
    log.initNew();
    log.setCreatedTS(initTS);
    log.setInitiator(initiatorId || srcId);
    log.setInitiatorLvl(initiatorLvl);
    log.setSourceObject(ModelType.USER, srcId || initiatorId);
    log.setAction(action);

    if (targetType || targetId || targetObject) {
      log.setTargetObject(targetType, targetId, targetOwnerId, targetObject);
    }

    if (!Util.IsNull(repostIds) || !Util.IsNull(reposterIds)) {
      log.setRepostedObject(repostIds, reposterIds);
    }

    if (postId) {
      log.setPostId(postId);
      log.setPostOwnerId(postOwnerId);
      log.setHasMedia(hasMedia);
    }

    if (originalPostId) {
      log.setOriginalPostId(originalPostId);
      log.setOriginalPostOwnerId(originalPostOwnerId);
    }

    return log;
  }

  /**
   * Create a new log for an API request. This creates the log record. Use
   * setAPIStatus() to set API endpoint name and execution status
   *
   * @param {string} userId user performed the action, and is also as the initiator
   * @param {string} action
   * @param {string=} targetType object type on the target side of the action
   * @param {string=} targetId object ID on the target side of the action
   * @param {string=} targetOwnerId object's owner ID, if any
   * @param {number=} initTS initiation timestamp. If null then use current time
   *
   * @return {XMActivityLog} new instance wrapper with initTS/action field set
   *
   * @see ~setAPIStatus()
   */
  static NewAPIRequest(
    userId,
    action,
    targetType = null,
    targetId = null,
    targetOwnerId = null,
    initTS = null
  ) {
    const log = new XMActivityLog();
    log.initNew();
    log.setCreatedTS(initTS);
    log.setInitiator(userId);
    log.setSourceObject(ModelType.USER, userId);
    log.setAction(action);

    if (targetType || targetId) {
      log.setTargetObject(targetType, targetId, targetOwnerId);
    }

    return log;
  }

  /**
   * Create a new log for an object-on-object action as oppose to from user
   *
   * @param {string} initiatorId user set as the initiator. If null, then assume it's system
   * @param {number} initiatorLvl
   * @param {string} srcType object type for the source side of the action
   * @param {string} srcId object ID for the source side of the action
   * @param {string} srcOwnerId object's owner
   * @param {string} action verb
   * @param {string=} targetType object type on the target side of the action
   * @param {string=} targetId object ID on the target side of the action
   * @param {string=} targetOwnerId object's owner ID, if any
   * @param {number=} initTS initiation timestamp. If null then use current time
   * @param {string[]=} repostIds object's owner ID, if any
   * @param {string[]=} reposterIds object's owner ID, if any
   * @param {string=} postId object ID on the post side of the action
   * @param {string=} postOwnerId object's owner ID, if any
   * @param {string=} originalPostId object ID on the original post side of the action
   * @param {string=} originalPostOwnerId object's owner ID, if any
   *
   * @return {XMActivityLog} new instance wrapper with initTS/action field set
   */
  static NewObjectAction(
    initiatorId,
    srcType,
    srcId,
    srcOwnerId = null,
    action,
    targetType = null,
    targetId = null,
    targetOwnerId = null,
    initTS = null,
    repostIds = null,
    reposterIds = null,
    postId = null,
    postOwnerId = null,
    originalPostId = null,
    originalPostOwnerId = null
  ) {
    const log = new XMActivityLog();
    log.initNew();
    log.setCreatedTS(initTS);
    if (initiatorId == null) {
      initiatorId = '_sys_';
    }
    log.setInitiator(initiatorId);
    log.setSourceObject(srcType, srcId, srcOwnerId);
    log.setAction(action);

    if (targetType || targetId) {
      log.setTargetObject(targetType, targetId, targetOwnerId);
    }

    if (!Util.IsNull(repostIds) || !Util.IsNull(reposterIds)) {
      log.setRepostedObject(repostIds, reposterIds);
    }

    if (postId) {
      log.setPostId(postId);
      log.setPostOwnerId(postOwnerId);
    }

    if (originalPostId) {
      log.setOriginalPostId(originalPostId);
      log.setOriginalPostOwnerId(originalPostOwnerId);
    }

    return log;
  }

  static NewObjectActionFromMap(
    data = {}
  ) {
    let initiatorId = data[MessageProps.INITIATOR_ID];
    const initiatorLvl = data[MessageProps.INITIATOR_LVL] || 0;
    const srcType = data[MessageProps.SRC_TYPE];
    const srcId = data[MessageProps.SRC_ID];
    const srcOwnerId = data[MessageProps.SRC_OWNER_ID];
    const action = data[MessageProps.ACTION];
    const targetType = data[MessageProps.TGT_TYPE];
    const targetId = data[MessageProps.TGT_ID];
    const targetOwnerId = data[MessageProps.TGT_OWNER_ID];
    const initTS = data[MessageProps.CREATED_DATE];
    const repostIds = data[MessageProps.RPS_IDS];
    const reposterIds = data[MessageProps.RPS_OWNER_IDS];
    const postId = data[MessageProps.POST_ID];
    const postOwnerId = data[MessageProps.OWNERID];
    const originalPostId = data[MessageProps.ORIG_POST_ID];
    const originalPostOwnerId = data[MessageProps.ORIG_POST_OWNER_ID];
    const hasMedia = data[MessageProps.HAS_MEDIA];

    const log = new XMActivityLog();
    log.initNew();
    log.setCreatedTS(initTS);
    if (initiatorId == null) {
      initiatorId = '_sys_';
    }
    log.setInitiator(initiatorId);
    log.setInitiatorLvl(initiatorLvl);
    log.setSourceObject(srcType, srcId, srcOwnerId);
    log.setAction(action);

    if (targetType || targetId) {
      log.setTargetObject(targetType, targetId, targetOwnerId);
    }

    if (!Util.IsNull(repostIds) || !Util.IsNull(reposterIds)) {
      log.setRepostedObject(repostIds, reposterIds);
    }

    if (postId) {
      log.setPostId(postId);
      log.setPostOwnerId(postOwnerId);
      log.setHasMedia(hasMedia);
    }

    if (originalPostId) {
      log.setOriginalPostId(originalPostId);
      log.setOriginalPostOwnerId(originalPostOwnerId);
    }

    return log;
  }

  /**
   * Set the action verb for the given log record
   *
   * @param {{}} jsonObj
   * @param {*} action
   */
  static SetAction(jsonObj, action) {
    return XMActivityLog.SetObjectField(jsonObj, MessageProps.ACTION, action);
  }

  /**
   * Get the action logged in the given (json) log entry.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetAction(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.ACTION,
      defaultVal
    );
  }

  /**
   * Set the ID of the post if this activity log is associate with one
   *
   * @param {{}} jsonObj
   * @param {string} postId
   */
  static SetPostID(jsonObj, postId) {
    return XMActivityLog.SetObjectField(jsonObj, MessageProps.POST_ID, postId);
  }

  /**
   * Get the associated post ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetPostID(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.POST_ID,
      defaultVal
    );
  }

  /**
   * Set the ID of the post if this activity log is associate with one
   *
   * @param {{}} jsonObj
   * @param {string} postId
   */
  static SetPostOwnerID(jsonObj, postId) {
    return XMActivityLog.SetObjectField(jsonObj, MessageProps.OWNERID, postId);
  }

  /**
   * Get the associated post ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetPostOwnerID(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.OWNERID,
      defaultVal
    );
  }

  /**
   * Set the ID of the post if this activity log is associate with one
   *
   * @param {{}} jsonObj
   * @param {string} postId
   */
  static SetOriginalPostOwnerID(jsonObj, commentId) {
    return XMActivityLog.SetObjectField(jsonObj, MessageProps.ORIG_POST_OWNER_ID, commentId);
  }

  /**
   * Get the associated post ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetOriginalPostOwnerId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.ORIG_POST_OWNER_ID,
      defaultVal
    );
  }

  /**
   * Set the ID of the original post Id
   *
   * @param {{}} jsonObj
   * @param {string} postId
   */
  static SetOriginalPostID(jsonObj, postId) {
    return XMActivityLog.SetObjectField(
      jsonObj,
      MessageProps.ORIG_POST_ID,
      postId
    );
  }

  /**
   * Get the original post's ID if the activity is related to the shared post
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetOriginalPostID(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.ORIG_POST_ID,
      defaultVal
    );
  }

  static GetOriginalPostOwnerID(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.ORIG_POST_OWNER_ID,
      defaultVal
    );
  }

  /**
   * Get the shared posts' IDs if the activity is related to the shared post
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetSharedPostIDs(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      XMSocialIndexable.PROP_REPOSTID_TRACE,
      defaultVal
    );
  }

  static GetSharedPosterIDs(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      XMSocialIndexable.PROP_REPOSTER_TRACE,
      defaultVal
    );
  }

  /**
   * Determine the content type of the activity record. There are two types,
   * one for source actor, and one for target entity. Usually one is a user
   * type, and the other is an object. We'll return the object type in these
   * cases. Will return ModelTYPE.USER if user is on both ends.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} one of ModelType.*, which can be POST or COMMENT for now.
   */
  static GetContentType(jsonObj, defaultVal = null) {
    const stype = XMActivityLog.GetSourceType(jsonObj, null);
    if (stype && stype !== ModelType.USER) {
      return stype;
    }

    const ttype = XMActivityLog.GetTargetType(jsonObj, null);
    if (ttype && ttype !== ModelType.USER) {
      return ttype;
    }

    // Both source / target are user..
    return ModelType.USER;
  } // GetContentType

  /**
   * Determine if the main subject of the activity is a post.
   *
   * @param {{}} jsonObj
   * @return {boolean} true if either source type or target type is POST
   */
  static IsPost(jsonObj) {
    return XMActivityLog.GetContentType(jsonObj, null) === ModelType.POST;
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
    let userId =
      XMActivityLog.GetSourceType(jsonRec) === ModelType.USER
        ? XMActivityLog.GetSourceId(jsonRec, null)
        : null;
    if (userId == null) {
      userId = XMActivityLog.GetInitiator(jsonRec, null);
    }
    return userId || defaultVal;
  }

  /**
   * Set the action verb for the given log record
   *
   * @param {{}} jsonObj
   * @param {*} action
   */
  static SetInitiator(jsonObj, action) {
    return XMActivityLog.SetObjectField(
      jsonObj,
      MessageProps.INITIATOR_ID,
      action
    );
  }

  static SetInitiatorLvl(jsonObj, action) {
    return XMActivityLog.SetObjectField(
      jsonObj,
      MessageProps.INITIATOR_LVL,
      action
    );
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
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.INITIATOR_ID,
      defaultVal
    );
  }

  /**
   * Get the comment initiator ID of this log. Note comment initiator is different than
   * actioner.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~GetActioner
   */
  static GetCommentInitiator(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.TGT_OWNER_ID,
      defaultVal
    );
  }

  static GetInitiatorLvl(jsonObj, defaultVal = 0) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.INITIATOR_LVL,
      defaultVal
    );
  }

  /**
   * Set the host that carry out user action
   *
   * @param {{}} jsonObj
   * @param {string} hostExpr a string value. if it's an url,
   * standard http:// and https:// will be stripped.
   * @return {boolean} true if host string set.
   */
  static SetUserHost(jsonObj, hostExpr) {
    if (!hostExpr) {
      return false;
    }
    hostExpr = Util.StripHttpFromURL(hostExpr);
    return XMActivityLog.SetObjectField(
      jsonObj,
      MessageProps.USER_HOST,
      hostExpr
    );
  }

  /**
   * Get the user's host device
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~GetActioner
   */
  static GetUserHost(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.USER_HOST,
      defaultVal
    );
  }

  /**
   * Set the source side's object type and ID of the action
   *
   * @param {{}} jsonObj
   * @param {string} srcType is this user or post or ?
   * @param {srcId} srcId unique ID
   * @param {srcOwnerId} srcOwnerId userId that owns the object
   * @param {*} action
   */
  static SetSourceObject(jsonObj, srcType, srcId, srcOwnerId = null, srcObject = null) {
    XMActivityLog.AssertArrayNoNulls(
      [jsonObj, srcType, srcId],
      'SetSourceObject'
    );
    XMActivityLog.SetObjectField(jsonObj, MessageProps.SRC_TYPE, srcType);
    XMActivityLog.SetObjectField(jsonObj, MessageProps.SRC_ID, srcId);
    if (srcOwnerId) {
      XMActivityLog.SetObjectField(
        jsonObj,
        MessageProps.SRC_OWNER_ID,
        srcOwnerId
      );
    }
    if (srcObject) {
      XMActivityLog.SetObjectField(
        jsonObj,
        MessageProps.SRC_OBJECT,
        srcObject
      );
    }
  }

  static SetParentLogId(jsonObj, logId) {
    XMActivityLog.SetObjectField(jsonObj, MessageProps.PARENT_LOG_ID, logId);
  }

  /**
   * Get the parent log's ID, if any
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   */
  static GetParentLogId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.PARENT_LOG_ID,
      defaultVal
    );
  }

  /**
   * Set the log ID with the inverse action/relationship
   *
   * @param {{}} jsonObj
   * @param {string} logId recipricating log's ID
   */
  static SetInverseLogId(jsonObj, logId) {
    XMActivityLog.SetObjectField(jsonObj, MessageProps.INVERSE_LOG_ID, logId);
  }

  /**
   * Get the inverse log's ID, if any
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   */
  static GetInverseLogId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.INVERSE_LOG_ID,
      defaultVal
    );
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
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.SRC_ID,
      defaultVal
    );
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
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.SRC_TYPE,
      defaultVal
    );
  }

  static GetSourceObject(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.SRC_OBJECT,
      defaultVal
    );
  }

  /**
   * Get the source side object's ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetSourceObject
   * @see ~GetSourceType
   * @see ~GetSourceId
   */
  static GetSourceOwnerId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.SRC_OWNER_ID,
      defaultVal
    );
  }

  /**
   * Determine if the source side of the action is a user (with userId).
   *
   * @param {{}} jsonObj
   * @return {boolean} true if target type is ModelType.USER
   */
  static SourceIsUser(jsonObj) {
    const srcType = XMActivityLog.GetSourceType(jsonObj, null);
    return srcType ? srcType === ModelType.USER : false;
  }

  /**
   * Set the source side's object type and ID of the action
   *
   * @param {{}} jsonObj
   * @param {string} targetType is this user or post or ?
   * @param {srcId} targetId unique ID
   * @param {srcOwnerId} targetOwnerId userId that owns the object
   * @param {*} action
   */
  static SetTargetObject(jsonObj, targetType, targetId, targetOwnerId = null, targetObject = null) {
    // XMActivityLog.AssertArrayNoNulls([jsonObj, targetType, targetId], _CLSNAME, "SetTargetObject");
    if (targetType) {
      XMActivityLog.SetObjectField(jsonObj, MessageProps.TGT_TYPE, targetType);
    }
    if (targetId) {
      XMActivityLog.SetObjectField(jsonObj, MessageProps.TGT_ID, targetId);
    }
    if (targetOwnerId) {
      XMActivityLog.SetObjectField(
        jsonObj,
        MessageProps.TGT_OWNER_ID,
        targetOwnerId
      );
    }
    if (targetObject) {
      XMActivityLog.SetObjectField(
        jsonObj,
        MessageProps.TGT_OBJECT,
        targetObject
      );
    }
  }

  /**
   * Get the target side object's ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetTargetObject
   * @see ~GetTargetType
   * @see ~GetTargetOwnerId
   */
  static GetTargetId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.TGT_ID,
      defaultVal
    );
  }

  /**
   * Get the target side object's type
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetTargetObject
   * @see ~GetTargetId
   * @see ~GetTargetOwnerId
   */
  static GetTargetType(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.TGT_TYPE,
      defaultVal
    );
  }

  static GetTargetObject(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.TGT_OBJECT,
      defaultVal
    );
  }

  /**
   * Get the target side object's owner ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetTargetObject
   * @see ~GetTargetType
   * @see ~GetTargetId
   */
  static GetTargetOwnerId(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.TGT_OWNER_ID,
      defaultVal
    );
  }

  /**
   * Determine if the target side of the action is a user (with userId).
   *
   * @param {{}} jsonObj
   * @return {boolean} true if target type is ModelType.USER
   */
  static TargetIsUser(jsonObj) {
    const targetType = XMActivityLog.GetTargetType(jsonObj, null);
    return targetType ? targetType === ModelType.USER : false;
  }

  /**
   * Set the source side's object type and ID of the action
   *
   * @param {{}} jsonObj
   * @param {string[]} repostedIds unique ID
   * @param {string[]} repostedOwnerIds userId that owns the object
   * @param {*} action
   */
  static SetRepostedObject(jsonObj, repostedIds, repostedOwnerIds = null) {
    // XMActivityLog.AssertArrayNoNulls([jsonObj, targetType, targetId], _CLSNAME, "SetTargetObject");
    XMActivityLog.SetObjectField(jsonObj, MessageProps.RPS_IDS, repostedIds);
    if (repostedOwnerIds) {
      XMActivityLog.SetObjectField(
        jsonObj,
        XMSocialIndexable.PROP_REPOSTER_TRACE,
        repostedOwnerIds
      );
    }
  }

  /**
   * Get the target side object's ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetTargetObject
   * @see ~GetTargetType
   * @see ~GetTargetOwnerId
   */
  static GetRepostedIds(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.RPS_IDS,
      defaultVal
    );
  }

  /**
   * Get the target side object's type
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetTargetObject
   * @see ~GetTargetId
   * @see ~GetTargetOwnerId
   */
  static GetRepostedType(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.RPS_TYPE,
      defaultVal
    );
  }

  /**
   * Get the target side object's owner ID
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetTargetObject
   * @see ~GetTargetType
   * @see ~GetTargetId
   */
  static GetRepostedOwnerIds(jsonObj, defaultVal = null) {
    return XMActivityLog.GetObjectField(
      jsonObj,
      MessageProps.RPS_OWNER_IDS,
      defaultVal
    );
  }

  /**
   * Construct a variable map from the content of the given activity log
   *
   * @param {{}} jsonObj
   * @param {boolean} includeNull if true then fields that exist but with null
   * values will be included.
   * @return {{}} map of property label/value but only those having a value
   */
  static GetVarMap(
    jsonObj,
    includeNull = false,
    addBracket = false,
    defaultVal = null
  ) {
    if (!XMActivityLog.AssertNotNull(jsonObj, 'GetVarMap')) {
      return defaultVal;
    }

    const varMap = {};
    const fields = MessageProps.PROPS_ACTIVITY;
    fields.forEach((field) => {
      const val = XMActivityLog.GetObjectField(jsonObj, field, null);
      if (val || includeNull) {
        if (addBracket) {
          varMap[field] = `\${${val}}`;
        } else {
          varMap[field] = val;
        }
      }
    });
    return varMap;
  } // GetVarMap

  /**
   *
   * @param {{}} jsonObj
   * @param {boolean} includeType true if add source and target
   * data types to the string
   */
  static GetSignature(jsonObj, includeType = false) {
    jsonObj = XMActivityLog.Unwrap(jsonObj);
    const srcId = XMActivityLog.GetSourceId(jsonObj);
    const srcType = XMActivityLog.GetSourceType(jsonObj);
    const targetId = XMActivityLog.GetTargetId(jsonObj);
    const targetType = XMActivityLog.GetTargetType(jsonObj);
    const action = XMActivityLog.GetAction(jsonObj);

    const frags = [];
    if (includeType && srcType) {
      frags.push(srcType);
    }
    frags.push(srcId);
    frags.push(action);
    if (includeType && targetType) {
      frags.push(targetType);
    }
    frags.push(targetId);

    const sig = frags.join('_');
    return sig;
  } // GetSignature

  /**
   * Given a full XMActivityLog json object, extract only
   * those that are considered user information, suitable
   * for crafting user notifications, etc.
   *
   * @param {{}} jsonObj null if empty object passed in
   * @param {[]} extraFields other fields to also include in the result object
   * @param {*} defaultVal in case json obj passed in is null
   * @return {{}} subset data
   */
  static GetActivityInfo(jsonObj, extraFields, defaultVal = null) {
    if (!XMActivityLog.AssertNotNull(jsonObj, 'GetActivityInfo')) {
      return defaultVal;
    }

    const includeNull = false;

    jsonObj = XMActivityLog.Unwrap(jsonObj);

    const varMap = {};
    const fields = MessageProps.PROPS_ACTIVITY;
    fields.forEach((field) => {
      const val = XMActivityLog.GetObjectField(jsonObj, field, null);
      if (val || includeNull === true) {
        varMap[field] = val;
      }
    });
    return varMap;
  }
} // class XMActivityLog

XMActivityLog.RegisterType(XMActivityLog);

export default XMActivityLog;
