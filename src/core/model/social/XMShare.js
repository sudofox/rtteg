import XMObject from '../XMObject';

import { ModelType, ModelFolder, SocialProps } from '../../../core/model/ModelConsts';

export const STATUS_SHARED = 'y';
export const STATUS_NOT_SHARED = 'n';
export const STATUS_UNKNOWN = 'u';

export const STATUS_SHARE = [STATUS_NOT_SHARED, STATUS_SHARED];

const _CLSNAME_SHARES = 'XMShares';
const _CLSNAME_SHARED = 'XMShared';


/**
 * Abstract model of sharing, covering both directions
 * of relationshp between user and object. Subclasses
 * implement shares and shared-by, as well as target/source
 * object.
 *
 */
class XMShareBase extends XMObject {
  static get STATUS_SHARED() { return STATUS_SHARED; }
  static get STATUS_NOT_SHARED() { return STATUS_NOT_SHARED; }
  static get STATUS_UNKNOWN() { return STATUS_UNKNOWN; }
  static get PROP_SHARE() { return SocialProps.SHARE; }

  /**
     * Do not instantiate at this level as an abstract
     * class.
     *
     * @param {string} clsname passed from subclass
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname, props) {
    super(clsname, props);
    this.class = XMShareBase;
  }

  /**
     * Add an target object Id to this object to like
     *
     * @param {string} targetId object to like (like type specified)
     * @return {boolean} true if added
     */
  addShare(targetId) {
    return this.addWord(XMShareBase.PROP_SHARE, targetId);
  }

  /**
     * Return all objectIds of "shares"
     *
     * @param {*} defaultVal
     *
     * @return {[]} identifers of target objects being followed by this
     */
  getShares(defaultVal = []) {
    const data = this.getData(false);
    return data ? XMShareBase.GetShares(data, defaultVal) : defaultVal;
  }

  /**
     * Determine of this object has a share for the given target Id
     *
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  hasShare(targetId) {
    return this.hasWord(SocialProps.SHARE, targetId);
  }

  /**
     * Report on whether there are any shares stored in this instance.
     *
     * @return {boolean} true if there are shares
     * @see ~countLikes
     */
  hasShares() {
    return this.countShares() > 0;
  }

  /**
     * Report on whether the given userId is in the tracking list.
     *
     * @param {string} userId
     * @return {string} either STATUS_NOT_SHARED, STATUS_SHARED
     */
  getShareStatus(targetId) {
    const data = this.getData(false);
    return data ? XMShareBase.GetShareStatus(data, targetId) : STATUS_NOT_SHARED;
  }

  /**
     * Remove a like
     *
     * @param {string} targetId target identifier to unfollow
     * @return {boolean} true if removed, false if not found
     *
     * @return {boolean} true if removed
     */
  removeShare(targetId) {
    return this.removeWord(SocialProps.SHARE, targetId);
  }

  /**
     * Remove all targets within following following list
     *
     * @return {boolean} true if removed, false if not found
     *
     * @see #removeUser
     */
  removeAllShares() {
    return this.removeAllWords(SocialProps.SHARE);
  }

  /**
     * Return number of targets that this object is following
     *
     * @return {number}
     * @see ~hasLikes
     */
  countShares() {
    return this.countWords(SocialProps.SHARE);
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
    return obj instanceof XMShareBase;
  }

  /**
     * Add a like
     *
     * @param {{}} jsonObj
     * @param {string} targetId to like
     */
  static AddShares(jsonObj, targetId) {
    return XMObject.AddWord(jsonObj, SocialProps.SHARE, targetId);
  }

  /**
     * Set a given list of targetIds as "like"
     *
     * @param {{}} jsonObj
     * @param {string[]} array of words or userIds
     * @return {string[]} previous set of follows that this is replacing
     */
  static SetShares(jsonObj, targetIds) {
    return XMObject.SetWords(jsonObj, SocialProps.SHARE, targetIds);
  }

  /**
     * Return all shares of this object (user)
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     *
     * @return {[]} identifers of users being followed by this
     */
  static GetShares(jsonObj, defaultVal = []) {
    return XMObject.GetWords(jsonObj, SocialProps.SHARE, defaultVal);
  }

  /**
     * Determine of this object has a share from the given userId
     *
     * @param {{}} jsonObj this object
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  static HasShare(jsonObj, userId) {
    return XMObject.HasWord(jsonObj, SocialProps.SHARE, userId);
  }

  /**
     * Return status after checking if the target user ID is in the list.
     *
     * @param {{}} jsonObj
     * @param {*} targetId targetId to check
     * @return {string} one of STATUS_*
     */
  static GetShareStatus(jsonObj, targetId) {
    const verdict = XMShareBase.HasShare(jsonObj, targetId);
    if (verdict === true) { return STATUS_SHARED; }

    return STATUS_NOT_SHARED;
  }

  /**
     * Remove a share
     *
     * @param {{}} jsonObj
     * @param {string} targetId target identifier to unfollow
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemoveShare(jsonObj, targetId) {
    return XMObject.RemoveWord(jsonObj, SocialProps.SHARE, targetId);
  }

  /**
     * Remove all targets within shard list
     *
     * @param {{}} jsonObj
     * @return {boolean} true if removed, false if not found
     *
     * @see #RemoveFollowing
     */
  static RemoveAllShares(jsonObj) {
    return XMObject.RemoveAllWords(jsonObj, SocialProps.SHARE);
  }

  /**
     * Return number of targets that this object is following
     * @param {{}} jsonObj
     * @return {number}
     */
  static CountShares(jsonObj) {
    return XMObject.CountWords(jsonObj, SocialProps.SHARE);
  }

} // class XMShareBase

/**
 * Base class for user sharing an object. Subclass
 * will implement the object type
 */
export class XMShares extends XMShareBase {

  /**
     *
     * @param {string} clsname
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname = _CLSNAME_SHARES, props) {
    super(clsname, props);
    this.class = XMShares;
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
     * Convenient method to check if the given object
     * is an instance of this class (XMUser)
     */
  static IsInstance(obj) {
    return obj instanceof XMShares;
  }

  /**
     * Return the default folder/table/collection name used
     * for storing stats
     */
  static GetFolderName() {
    return ModelFolder.SHARES;  // should be none if enforce subclass
  }

  static GetName() {
    return _CLSNAME_SHARES;
  }

  static GetTypeID() {
    return ModelType.SHARES;
  }

  /**
     * Create a new instance
     *
     * @param {string} userId User ID, which is also the ID of this object
     * @param {string} title category title, optional
     * @param {string} desc optional
     */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMShares();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }

} // class XMShares

/**
 * Base class for inverse relationship of object
 * shared by.
 */
export class XMShared extends XMShareBase {

  /**
     *
     * @param {string} clsname
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname = _CLSNAME_SHARED, props) {
    super(clsname, props);
    this.class = XMShared;
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
     * Convenient method to check if the given object
     * is an instance of this class (XMUser)
     */
  static IsInstance(obj) {
    return obj instanceof XMShared;
  }

  /**
     * Return the default folder/table/collection name used
     * for storing stats
     */
  static GetFolderName() {
    return ModelFolder.SHARED;
  }

  static GetName() {
    return _CLSNAME_SHARED;
  }

  static GetTypeID() {
    return ModelType.SHARED;
  }

  /**
     * Create a new instance
     *
     * @param {string} userId User ID, which is also the ID of this object
     * @param {string} title category title, optional
     * @param {string} desc optional
     */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMShared();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }
} // class XMShared

// Can comment out if enforcing subclassing only
XMShares.RegisterType(XMShares);
XMShares.RegisterType(XMShared);

export default XMShares;
