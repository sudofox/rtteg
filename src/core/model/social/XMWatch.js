
import XMObject from '../XMObject';

import { ModelType, ModelFolder, SocialProps } from '../ModelConsts';

const _CLSNAME_WATCHES = 'XMWatches';
const _CLSNAME_WATCHED = 'XMWatched';


/**
 * Base class for watching and watchers. Each object
 * that user is watching / being watched need to have their
 * own class extending from here, and separate folder / collection
 * to store those relationships.
 *
 * @see ~XMWatchTag
 * @see ~XMWatchedRL
 * @see ~XMWatchRLTPL
  *
 */
class XMWatchBase extends XMObject {
  static get STATUS_WATCHED() { return SocialProps.STATUS_WATCHED; }
  static get STATUS_NOT_WATCHED() { return SocialProps.STATUS_NOT_WATCHED; }
  static get STATUS_UNKNOWN() { return SocialProps.STATUS_UNKNOWN; }
  static get PROP_WATCH() { return SocialProps.WATCH; }

  /**
     *
     * @param {string} clsname pass from subclass (mandatory)
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname, props) {
    super(clsname, props);
    this.class = XMWatchBase;
  }

  /**
     * Add an target object Id to this object to watch
     *
     * @param {string} targetId object to watch (watch type specified)
     * @return {boolean} true if added
     */
  addWatch(targetId) {
    return this.addWord(XMWatchBase.PROP_WATCH, targetId);
  }

  /**
     * Return all userIds of "watches"
     *
     * @param {*} defaultVal
     *
     * @return {[]} identifers of target objects being followed by this
     */
  getWatches(defaultVal = []) {
    const data = this.getData(false);
    return data ? XMWatchBase.GetWatches(data, defaultVal) : defaultVal;
  }

  /**
     * Return target content as objects keyed off the target ID.
     * This is a polymorphic method for all connection data models
     * including follow, watches, etc.
     *
     * @param {*} defaultVal
     * @return {{targetId: {}}}
     */
  getTargetObjectMap(defaultVal = {}) {
    const data = this.getData(false);
    return data ? XMWatchBase.GetWatchStatusMap(data, defaultVal) : defaultVal;
  }

  /**
     * Determine of this object has a watch for the given target Id
     *
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  hasWatch(targetId) {
    return this.hasWord(SocialProps.WATCH, targetId);
  }

  /**
     * Report on whether there are any watches stored in this instance.
     *
     * @return {boolean} true if there are watches
     * @see ~countWatches
     */
  hasWatches() {
    return this.countWatches() > 0;
  }

  /**
     * Report on whether the given userId is in the tracking list.
     *
     * @param {string} userId
     * @return {string} either STATUS_NOT_WATCHED, STATUS_WATCHED
     */
  getWatchStatus(targetId) {
    const data = this.getData(false);
    return data ? XMWatchBase.GetWatchStatus(data, targetId) : SocialProps.STATUS_NOT_WATCHED;
  }

  /**
     * Remove a watch entry
     *
     * @param {string} targetId target identifier to unfollow
     * @return {boolean} true if removed, false if not found
     *
     * @return {boolean} true if removed
     */
  removeWatch(targetId) {
    return this.removeWord(SocialProps.WATCH, targetId);
  }

  /**
     * Remove all targets within following following list
     *
     * @return {boolean} true if removed, false if not found
     *
     * @see #removeUser
     */
  removeAllWatches() {
    return this.removeAllWords(SocialProps.WATCH);
  }

  /**
     * Return number of targets that this object is following
     *
     * @return {number}
     * @see ~hasWatches
     */
  countWatches() {
    return this.countWords(SocialProps.WATCH);
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
     * Convenient method to check if the given object
     * is an instance of this class (XMUser)
     */
  static IsInstance(obj) {
    return obj instanceof XMWatchBase;
  }

  /**
     * Add a watch
     *
     * @param {{}} jsonObj
     * @param {string} targetId to watch
     */
  static AddWatch(jsonObj, targetId) {
    return XMObject.AddWord(jsonObj, SocialProps.WATCH, targetId);
  }

  /**
     * Set a given list of targetIds as "watch"
     *
     * @param {{}} jsonObj
     * @param {string[]} array of words or userIds
     * @return {string[]} previous set of follows that this is replacing
     */
  static SetWatches(jsonObj, targetIds) {
    return XMObject.SetWords(jsonObj, SocialProps.WATCH, targetIds);
  }

  /**
     * Return all watches of this object
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     *
     * @return {[]} identifers of users being followed by this
     */
  static GetWatches(jsonObj, defaultVal = []) {
    return XMObject.GetWords(jsonObj, SocialProps.WATCH, defaultVal);
  }

  /**
     * Create a watch status map with objectId as key and status as value
     *
     * @param {{}} jsonObj data/unwrapped portion of XMFollowBase subclass instance
     * @param {{}} defaultVal
     * @return {{objectId: {string}}}
     */
  static GetWatchStatusMap(jsonObj, defaultVal = {}) {
    if (jsonObj == null) { return defaultVal; }

    const statusMap = {};

    const accepted = XMWatchBase.GetWatches(jsonObj, []);
    accepted.forEach((objectId) => { statusMap[objectId] = SocialProps.STATUS_WATCHED; });

    return statusMap;
  }

  /**
     * Determine of this object has a watch from the given userId
     *
     * @param {{}} jsonObj this object
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  static HasWatch(jsonObj, userId) {
    return XMObject.HasWord(jsonObj, SocialProps.WATCH, userId);
  }

  /**
     * Return status after checking if the target user ID is in the list.
     *
     * @param {{}} jsonObj
     * @param {*} targetId targetId to check
     * @return {string} one of STATUS_*
     */
  static GetWatchStatus(jsonObj, targetId) {
    const verdict = XMWatchBase.HasWatch(jsonObj, targetId);
    if (verdict === true) { return SocialProps.STATUS_WATCHED; }

    return SocialProps.STATUS_NOT_WATCHED;
  }

  /**
     * Remove a watch
     *
     * @param {{}} jsonObj
     * @param {string} targetId target identifier to unfollow
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemoveWatch(jsonObj, targetId) {
    return XMObject.RemoveWord(jsonObj, SocialProps.WATCH, targetId);
  }

  /**
     * Remove all targets within following following list
     *
     * @param {{}} jsonObj
     * @return {boolean} true if removed, false if not found
     *
     * @see #RemoveFollowing
     */
  static RemoveAllWatches(jsonObj) {
    return XMObject.RemoveAllWords(jsonObj, SocialProps.WATCH);
  }

  /**
     * Return number of targets that this object is following
     * @param {{}} jsonObj
     * @return {number}
     */
  static CountWatches(jsonObj) {
    return XMObject.CountWords(jsonObj, SocialProps.WATCH);
  }
} // class XMWatch

/**
 * Model who a user watchs in a separate managed object.
 * The unique ID will be the same with the user ID, but
 * data stored in separate space, using different folder
 * name.
 */
export class XMWatches extends XMWatchBase {
  /**
     *
     * @param {string} clsname
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname = _CLSNAME_WATCHES, props) {
    super(clsname, props);
    this.class = XMWatches;
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
     * Convenient method to check if the given object
     * is an instance of this class (XMUser)
     */
  static IsInstance(obj) {
    return obj instanceof XMWatches;
  }

  /**
     * Return the default folder/table/collection name used
     * for storing stats
     */
  static GetFolderName() {
    return ModelFolder.WATCHES_OBJECT;
  }

  static GetName() {
    return _CLSNAME_WATCHES;
  }

  static GetTypeID() {
    return ModelType.WATCHES_OBJECT;
  }

  /**
     * Create a new instance
     *
     * @param {string} userId User ID, which is also the ID of this object
     * @param {string} title category title, optional
     * @param {string} desc optional
     */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMWatches();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }

} // class XMWatches

/**
 * Model who a user watched in a separate managed object.
 * The unique ID will be the same with the user ID, but
 * data stored in separate space, using different folder
 * name.
 */
export class XMWatched extends XMWatchBase {

  /**
     *
     * @param {string} clsname
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname = _CLSNAME_WATCHED, props) {
    super(clsname, props);
    this.class = XMWatched;
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
     * Convenient method to check if the given object
     * is an instance of this class (XMWatchedRL)
     */
  static IsInstance(obj) {
    return obj instanceof XMWatched;
  }

  /**
     * Return the default folder/table/collection name used
     * for storing stats
     */
  static GetFolderName() {
    return ModelFolder.NONE;
  }

  static GetName() {
    return _CLSNAME_WATCHED;
  }

  static GetTypeID() {
    return ModelType.WATCHED_OBJECT;
  }

  /**
     * Create a new instance
     *
     * @param {string} userId User ID, which is also the ID of this object
     * @param {string} desc optional
     */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMWatched();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }
} // class XMWatched

// Subclasses will register
// XMWatches.RegisterType(XMWatches);
// XMWatched.RegisterType(XMWatched);

export default XMWatchBase;
