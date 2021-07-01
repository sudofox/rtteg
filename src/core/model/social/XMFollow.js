import XMObject from '../XMObject';
import { ModelType, ModelFolder, SocialProps } from '../ModelConsts';

export const STATUS_FOLLOWING = 'y';        // accepted
export const STATUS_NOT_FOLLOWING = 'n';    // not accepted

export const STATUS_ACCEPTED = 'a';
export const STATUS_PENDING = 'p';
export const STATUS_BLOCKED = 'b';
export const STATUS_NOT_BLOCKED = 'nb';
export const STATUS_MUTED = 'm';
export const STATUS_NOT_MUTED = 'nm';
export const STATUS_UNKNOWN = 'u';
export const STATUS_NOT_FOUND = 'nf';

export const STATUS_FOLLOW = [
  STATUS_NOT_FOLLOWING,
  STATUS_FOLLOWING,
  STATUS_PENDING,
];

export const STATUS_TYPES = [
  STATUS_ACCEPTED,
  STATUS_PENDING,
  STATUS_BLOCKED,
  STATUS_MUTED
];

const _CLSNAME = 'XMFolllow';
const _CLSNAME_FOLLOWS = 'XMFollows';
const _CLSNAME_FOLLOWERS = 'XMFollowers';

/**
 * Model who a user follows in a separate managed object.
 * Base class for XMFollows and XMFollowers
 */
class XMFollowBase extends XMObject {
  static get PROP_ACCEPTED() { return SocialProps.ACCEPTED; }
  static get PROP_PENDING() { return SocialProps.PENDING; }
  static get PROP_BLOCKED() { return SocialProps.BLOCKED; }
  static get PROP_MUTED() { return SocialProps.MUTED; }

  static get STATUS_FOLLOWING() { return STATUS_FOLLOWING; }
  static get STATUS_NOT_FOLLOWING() { return STATUS_NOT_FOLLOWING; }
  static get STATUS_ACCEPTED() { return STATUS_ACCEPTED; }
  static get STATUS_PENDING() { return STATUS_PENDING; }
  static get STATUS_UNKNOWN() { return STATUS_UNKNOWN; }

  static get STATUS_UNBLOCKED() { return SocialProps.UNBLOCKED; }

  static get LIST_TYPES() {
    return [
      XMFollowBase.PROP_ACCEPTED,
      XMFollowBase.PROP_PENDING,
      XMFollowBase.PROP_BLOCKED,
      XMFollowBase.PROP_MUTED,
    ];
  }

  /**
   *
   * @param {string} clsname supply by subclasses
   * @param {*} props
   * @see #CreateNew
   */
  constructor(clsname, props) {
    super(clsname, props);
    this.class = XMFollowBase;
  }

  /**
   * Add an userId to this list tracker directly as accepted user.
   *
   * @param {string} userId what or whom to follow
   * @param {string} list type (see LIST_*). Defaults to XMFollowBase.PROP_ACCEPTED
   * @return {boolean} true if added
   */
  addUser(userId) {
    return this.addAcceptedUser(userId);
  }

  /**
   * Add an userId to this object to follow as ACCEPTED.
   * So if there
   *
   * @param {string} userId what or whom to follow
   */
  addAcceptedUser(userId) {
    const data = this.getData(true);
    return XMFollowBase.AddAcceptedUser(data, userId);
  }

  /**
   * Add an userId to this object to follow but in PENDING list.
   * If user already on accepted or blocked list, will be
   * removed there first.
   *
   * @param {string} userId what or whom to follow
   */
  addPendingUser(userId) {
    const data = this.getData(true);
    return XMFollowBase.AddPendingUser(data, userId);
  }

  /**
   * Add an userId to the blocked list, which will
   * remove from pending or accepted list if already there.
   *
   * @param {string} userId what or whom to follow
   */
  addBlockedUser(userId) {
    const data = this.getData(true);
    return XMFollowBase.AddBlockedUser(data, userId);
  }


  /**
     * Add an userId to the muted list. Unlike block user, it will
     * NOT remove from pending or accepted list if already there.
     *
     * @param {string} userId what or whom to mute
     */
  addMutedUser(userId) {
    const data = this.getData(true);
    return XMFollowBase.AddMutedUser(data, userId);
  }

  /**
     * Return list of userIds
     *
     * @param {string} listType one of LIST_* (default to XMFollowBase.PROP_ACCEPTED)
     * @param {*} defaultVal
     *
     * @see ~addUser
     * @see ~hasUser
     * @see ~getStatus
     * @see ~removeUser
     * @return {string[]} array of userIds
     */
  getUsers(listType = XMFollowBase.PROP_ACCEPTED, defaultVal = []) {
    return XMFollowBase.LIST_TYPES.includes(listType) ? this.getWords(listType, defaultVal) : defaultVal;
  }

  /**
   * Return all following users of this object
   *
   * @param {*} defaultVal
   *
   * @return {string[]} array of userIds that are accepted
   */
  getAcceptedUsers(defaultVal = []) {
    const data = this.getData(false);
    return data ? XMFollowBase.GetAcceptedUsers(data, defaultVal) : defaultVal;
  }

  /**
   * Return all following users of this object that are in the pending list
   *
   * @param {*} defaultVal
   *
   * @return {string[]} array of userIds that are accepted
   */
  getPendingUsers(defaultVal = []) {
    const data = this.getData(false);
    return data ? XMFollowBase.GetPendingUsers(data, defaultVal) : defaultVal;
  }

  /**
     * Return all users of this object that are in the blocked list
     *
     * @param {*} defaultVal
     *
     * @return {string[]} array of userIds that are accepted
     */
  getBlockedUsers(defaultVal = []) {
    const data = this.getData(false);
    return data ? XMFollowBase.GetBlockedUsers(data, defaultVal) : defaultVal;
  }

  /**
     * Return all users of this object that are in the muted list
     *
     * @param {*} defaultVal
     *
     * @return {string[]} array of userIds that are accepted
     */
  getMutedUsers(defaultVal = []) {
    const data = this.getData(false);
    return data ? XMFollowBase.GetMutedUsers(data, defaultVal) : defaultVal;
  }

  /**
   * Create a user status map with userID as key and status as value
   *
   * @param {{}} defaultVal
   * @return {{userId: {string}}}
   */
  getUserStatusMap(defaultVal = {}) {
    const data = this.getData(false);
    return data ? XMFollowBase.GetUserStatusMap(data, defaultVal) : defaultVal;
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
    return this.getUserStatusMap(defaultVal);
  }


  /**
   * Determine if the specified user ID follows (default in accepted status)
   *
   * @param {string} userId
   * @param {string} list type (see LIST_*). Defaults to XMFollowBase.PROP_ACCEPTED
   * @return {boolean} true if user exists
   *
   * @see ~addUser
   * @see ~getUser
   * @see ~hasAcceptedUser
   */
  hasUser(userId, list = XMFollowBase.PROP_ACCEPTED) {
    return XMFollowBase.LIST_TYPES.includes(list) ? this.hasWord(list, userId) : false;
  }

  /**
   * Determine if user exists in tracking and which list is the user in
   *
   * @param {string} userId
   * @return {string} list that user is found, which should be one of LIST_* or
   * null if none.
   */
  hasUserIn(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.HasUserIn(data, userId) : null;
  }

  /**
   * Determine if the specified user ID is the accepted list
   *
   * @param {string} userId target identifier to check if following
   * @return {boolean} true if following target, false if not found
   */
  hasAcceptedUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.HasAcceptedUser(data, userId) : false;
  }

  /**
   * Return whether there are any accepted users
   */
  hasAcceptedUsers() {
    return this.countAcceptedUsers() > 0;
  }

  /**
   * Determine if the specified user ID is in the pending list
   *
   * @param {string} userId target identifier to check if following
   * @return {boolean} true if following target, false if not found
   */
  hasPendingUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.HasPendingUser(data, userId) : false;
  }

  /**
   * Determine if the specified user is in the blocked list
   *
   * @param {string} userId target identifier to check if following
   * @return {boolean} true if following target, false if not found
   */
  hasBlockedUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.HasBlockedUser(data, userId) : false;
  }

  /**
     * Determine if the specified user is in the muted list
     *
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  hasMutedUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.HasMutedUser(data, userId) : false;
  }

  /**
     * Report on whether the given userId is in the tracking list, and
     * if so which one (of the LIST_TYPES)
     *
     * @param {string} userId
     * @return {string} either STATUS_NOT_FOLLOWING, STATUS_FOLLOWING, or STATUS_PENDING
     */
  getStatus(userId, list = null) {
    const data = this.getData(false);
    return data ? XMFollowBase.GetStatus(data, userId, list) : STATUS_NOT_FOLLOWING;
  }

  /**
   * Remove an (accepted) user within following target list
   *
   * @param {string} targetId target identifier to unfollow
   * @param {string} list one of LIST_TYPE (defaults to XMFollowBase.PROP_ACCEPTED)
   * @return {boolean} true if removed, false if not found
   *
   */
  removeUser(targetId, list = XMFollowBase.PROP_ACCEPTED) {
    return XMFollowBase.LIST_TYPES.includes(list) ? this.removeWord(list, targetId) : false;
  }

  /**
   * Remove an accepted target within following target list
   *
   * @param {string} userId user to remove from accepted list
   * @return {boolean} true if removed, false if not found
   *
   * @return {boolean} true if removed
   */
  removeAcceptedUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.RemoveAcceptedUser(data, userId) : false;
  }

  /**
   * Remove a user in the pending list
   *
   * @param {string} userId user to remove from accepted list
   * @return {boolean} true if removed, false if not found
   *
   * @return {boolean} true if removed
   */
  removePendingUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.RemovePendingUser(data, userId) : false;
  }

  /**
   * Remove userId in the blocked list
   *
   * @param {string} userId user to remove from accepted list
   * @return {boolean} true if removed, false if not found
   *
   * @return {boolean} true if removed
   */
  removeBlockedUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.RemoveBlockedUser(data, userId) : false;
  }

  /**
     * Remove userId in the muted list
     *
     * @param {string} userId user to remove from accepted list
     * @return {boolean} true if removed, false if not found
     *
     * @return {boolean} true if removed
     */
  removeMutedUser(userId) {
    const data = this.getData(false);
    return data ? XMFollowBase.RemoveMutedUser(data, userId) : false;
  }


  /**
   * Remove all targets within following following list
   *
   * @param {string=} list see LIST_TYPES for PROP_ACCEPTED, PROP_BLOCKED, PROP_PENDING
   * @return {boolean} true if removed, false if not found
   *
   * @see #removeUser
   */
  removeAllUsers(list) {
    const data = this.getData(false);
    return data ? XMFollowBase.RemoveAllUsers(data, list) : false;
  }


  /**
   * Count (accepted) following users
   *
   * @param {string} list list type defined in LIST_TYPES
   * @return {number} 0 or greator if valid list given. -1 if list type not valid
   *
   * @see ~countAcceptedUsers
   * @see ~countPendingUsers
   * @see ~countBlockedUsers
   */
  countUsers(list = XMFollowBase.PROP_ACCEPTED) {
    return XMFollowBase.LIST_TYPES.includes(list) ? this.countAcceptedUsers() : -1;
  }

  /**
   * Return number of targets that this object is following
   *
   * @return {number}
   *
   */
  countAcceptedUsers() {
    return this.countWords(XMFollowBase.PROP_ACCEPTED);
  }


  /**
   * Return number of targets that this object is following
   *
   * @return {number}
   *
   */
  countPendingUsers() {
    return this.countWords(XMFollowBase.PROP_PENDING);
  }

  /**
   * Return number of targets that this object is following
   *
   * @return {number}
   *
   */
  countBlockedUsers() {
    return this.countWords(XMFollowBase.PROP_BLOCKED);
  }

  /**
     * Return number of targets that this object is muting
     *
     * @return {number}
     *
     */
  countMutedUsers() {
    return this.countWords(XMFollowBase.PROP_MUTED);
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
    return obj instanceof XMFollowBase;
  }

  /**
   * Add a user for this object to follow. It implements the "follows"
   * relationshp. If the user is currently on blocked or pending list,
   * it will be removed from there.
   *
   * @param {{}} jsonObj
   * @param {string} userId what or whom to follow
   */
  static AddAcceptedUser(jsonObj, userId) {
    XMFollowBase.RemoveBlockedUser(jsonObj, userId);
    XMFollowBase.RemovePendingUser(jsonObj, userId);
    return XMObject.AddWord(jsonObj, XMFollowBase.PROP_ACCEPTED, userId);
  }

  /**
   * Add a user to the blocked list. If the user is on accepted or pending
   * list, it will be removed from there.
   *
   * @param {{}} jsonObj
   * @param {string} userId what or whom to follow
   */
  static AddBlockedUser(jsonObj, userId) {
    XMFollowBase.RemoveAcceptedUser(jsonObj, userId);
    XMFollowBase.RemovePendingUser(jsonObj, userId);
    return XMFollowBase.AddWord(jsonObj, XMFollowBase.PROP_BLOCKED, userId);
  }

  /**
     * Add a user to the muted list.
     *
     * @param {{}} jsonObj
     * @param {string} userId what or whom to follow
     */
  static AddMutedUser(jsonObj, userId) {
    return XMFollowBase.AddWord(jsonObj, XMFollowBase.PROP_MUTED, userId);
  }

  /**
     * Add a user for this object to follow but in PENDING status.
     * If the user is on either accepted or blocked list, it will be
     * removed.
     *
     * @param {{}} jsonObj
     * @param {string} list list type defined in LIST_TYPE
     * @param {string} userId what or whom to follow
     */
  static AddPendingUser(jsonObj, userId) {
    XMFollowBase.RemoveAcceptedUser(jsonObj, userId);
    XMFollowBase.RemoveBlockedUser(jsonObj, userId);
    return XMObject.AddWord(jsonObj, XMFollowBase.PROP_PENDING, userId);
  }


  /**
   * Add a user to the follow list. Currently we automatically
   * accept so just put in the accepted list.
   *
   * @param {{}} jsonObj
   * @param {string} list list type defined in LIST_TYPE
   * @param {*} userId
   */
  static AddUser(jsonObj, userId) {
    return XMFollowBase.AddAcceptedUser(jsonObj, userId);
  }


  /**
   * Set a given list of users that this object follows by replacing
   * existing.
   *
   * @param {{}} jsonObj
   * @param {string[]} array of words or userIds
   * @return {number} number of user accepted.
   */
  static SetAcceptedUsers(jsonObj, userIds) {
    const n = userIds ? userIds.length : 0;
    if (n > 0) {
      XMObject.SetWords(jsonObj, XMFollowBase.PROP_ACCEPTED, userIds);
    }
    return n;
  }

  /**
   * Return all followings, or "follows" targets of this object
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @return {[]} identifers of users being followed by this
   */
  static GetAcceptedUsers(jsonObj, defaultVal = []) {
    return XMObject.GetWords(jsonObj, XMFollowBase.PROP_ACCEPTED, defaultVal);
  }

  /**
     * Return all requested users but on the pending list
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     *
     * @return {[]} identifers of users being followed by this
     */
  static GetPendingUsers(jsonObj, defaultVal = []) {
    return XMObject.GetWords(jsonObj, XMFollowBase.PROP_PENDING, defaultVal);
  }

  /**
     * Return all users explicitly blocked
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     *
     * @return {[]} identifers of users being followed by this
     */
  static GetBlockedUsers(jsonObj, defaultVal = []) {
    const result = XMObject.GetWords(jsonObj, XMFollowBase.PROP_BLOCKED, defaultVal);
    return result || defaultVal;
  }

  /**
     * Return all users explicitly muted
     *
     * @param {{}} jsonObj
     * @param {*} defaultVal
     *
     * @return {[]} identifers of users being followed by this
     */
  static GetMutedUsers(jsonObj, defaultVal = []) {
    const result = XMObject.GetWords(jsonObj, XMFollowBase.PROP_MUTED, defaultVal);
    return result || defaultVal;
  }

  /**
     * Create a user status map with userID as key and status as value
     *
     * @param {{}} jsonObj data/unwrapped portion of XMFollowBase subclass instance
     * @param {{}} defaultVal
     * @return {{userId: {string}}}
     */
  static GetUserStatusMap(jsonObj, defaultVal = {}) {
    if (jsonObj == null) { return defaultVal; }

    const accepted = XMFollowBase.GetAcceptedUsers(jsonObj, []);
    const blocked = XMFollowBase.GetBlockedUsers(jsonObj, []);
    const muted = XMFollowBase.GetMutedUsers(jsonObj, []);
    const pending = XMFollowBase.GetPendingUsers(jsonObj, []);

    const statusMap = {};
    accepted.forEach((userId) => { statusMap[userId] = STATUS_FOLLOWING; });
    blocked.forEach((userId) => { statusMap[userId] = STATUS_BLOCKED; });
    muted.forEach((userId) => { statusMap[userId] = STATUS_MUTED; });
    pending.forEach((userId) => { statusMap[userId] = STATUS_PENDING; });
    return statusMap;
  } // GetAllUserStatusMap

  /**
     * Determine of this object is following the identified taget
     *
     * @param {{}} jsonObj this object
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  static HasAcceptedUser(jsonObj, userId) {
    return XMObject.HasWord(jsonObj, XMFollowBase.PROP_ACCEPTED, userId);
  }

  /**
     * Determine of this object is following the identified taget
     *
     * @param {{}} jsonObj this object
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  static HasPendingUser(jsonObj, userId) {
    return XMObject.HasWord(jsonObj, XMFollowBase.PROP_PENDING, userId);
  }

  /**
     * Determine of this object is following the identified taget
     *
     * @param {{}} jsonObj this object
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  static HasBlockedUser(jsonObj, userId) {
    return XMObject.HasWord(jsonObj, XMFollowBase.PROP_BLOCKED, userId);
  }

  /**
     * Determine of this object is muting the identified target
     *
     * @param {{}} jsonObj this object
     * @param {string} userId target identifier to check if following
     * @return {boolean} true if following target, false if not found
     */
  static HasMutedUser(jsonObj, userId) {
    return XMObject.HasWord(jsonObj, XMFollowBase.PROP_MUTED, userId);
  }

  /**
     * Check which list is the given userId in.
     *
     * @param {{}} jsonObj
     * @param {string} userId user to check
     * @return {string} one of item in array LIST_TYPE, or null if not found
     *
     * @see XMFollowBase~GetStatus
     */
  static HasUserIn(jsonObj, userId) {
    return XMFollowBase.HasWordIn(jsonObj, XMFollowBase.LIST_TYPES, userId);
  }

  /**
   * Check which list is the given userId in.
   *
   * @param {{}} jsonObj
   * @param {string} userId user to check
   * @param {string} list specify list to check
   * @return {string} one of item in array LIST_TYPE, or null if not found
   *
   * @see XMFollowBase~GetStatus
   */
  static HasUserInList(jsonObj, userId, list = null) {
    if (list && XMFollowBase.LIST_TYPES.includes(list)) {
      return XMFollowBase.HasWordIn(jsonObj, [list], userId);
    }
    return  XMFollowBase.HasWordIn(jsonObj, XMFollowBase.LIST_TYPES, userId);
  }

  /**
     * Return status after checking if the target user ID is in the list.
     *
     * @param {{}} jsonObj
     * @param {*} targetId userId to check
     * @param {string} list specify the list to check
     *
     * @param {string} list list type defined in LIST_TYPE
     * @return {string} one of STATUS_*
     */
  static GetStatus(jsonObj, userId, list = null) {
    const inList = list ? XMFollowBase.HasUserInList(jsonObj, userId, list) : XMFollowBase.HasUserIn(jsonObj, userId);
    // console.log(`GetStatus: user ${userId} is in list: ${list}`);
    let status;
    switch (inList) {
      // purposely do blocked first in case internal inconsistency exists
      case XMFollowBase.PROP_BLOCKED:
        status = STATUS_BLOCKED;
        break;
      case XMFollowBase.PROP_MUTED:
        status = STATUS_MUTED;
        break;
      case XMFollowBase.PROP_PENDING:
        status = STATUS_PENDING;
        break;
      case XMFollowBase.PROP_ACCEPTED:
        status = STATUS_FOLLOWING;
        break;
      default:
        status = STATUS_NOT_FOLLOWING;
    }
    return status;
  } // GetStatus

  /**
     * Remove a target that the object/user is following
     *
     * @param {{}} jsonObj
     * @param {string} userId target identifier to unfollow
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemoveAcceptedUser(jsonObj, userId) {
    return XMFollowBase.RemoveUser(jsonObj, userId, XMFollowBase.PROP_ACCEPTED);
  }

  /**
     * Remove a tuser from the blocked user list
     *
     * @param {{}} jsonObj
     * @param {string} userId id to remove from blocked list
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemoveBlockedUser(jsonObj, userId) {
    return XMFollowBase.RemoveUser(jsonObj, userId, XMFollowBase.PROP_BLOCKED);
  }

  /**
     * Remove a user from the muted user list
     *
     * @param {{}} jsonObj
     * @param {string} userId id to remove from blocked list
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemoveMutedUser(jsonObj, userId) {
    return XMFollowBase.RemoveUser(jsonObj, userId, XMFollowBase.PROP_MUTED);
  }

  /**
     * Remove a tuser from the blocked user list
     *
     * @param {{}} jsonObj
     * @param {string} userId id to remove from blocked list
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemovePendingUser(jsonObj, userId) {
    return XMFollowBase.RemoveUser(jsonObj, userId, XMFollowBase.PROP_PENDING);
  }

  /**
     * Remove a target that the object/user is following
     *
     * @param {{}} jsonObj
     * @param {string} targetId target identifier to unfollow
     * @param {string} list list type defined in LIST_TYPE
     * @return {boolean} true if removed, false if not found
     *
     */
  static RemoveUser(jsonObj, targetId, list = XMFollowBase.PROP_ACCEPTED) {
    return XMFollowBase.LIST_TYPES.includes(list) ? XMFollowBase.RemoveWord(jsonObj, list, targetId) : false;
  }

  /**
     * Remove all targets within following following list
     *
     * @param {{}} jsonObj
     * @param {string} list list type defined in LIST_TYPE
     * @return {boolean} true if removed, false if not found
     *
     * @see ~CountUsers
     * @see ~RemoveUsers
     */
  static RemoveAllUsers(jsonObj, list = XMFollowBase.PROP_ACCEPTED) {
    return XMFollowBase.RemoveAllWords(jsonObj, list);
  }

  /**
     * Return number of targets that this object is following
     *
     * @param {{}} jsonObj
     * @param {string} list list type defined in LIST_TYPE
     * @return {number} 0 or greater if valid list, -1 if invalid list
     */
  static CountUsers(jsonObj, list = XMFollowBase.PROP_ACCEPTED) {
    return XMFollowBase.LIST_TYPES.includes(list) ? XMObject.CountWords(jsonObj, list) : -1;
  }

  /**
     * Return number of pending targets that this object has
     *
     * @param {{}} jsonObj
     * @return {number}
     */
  static CountPendingUsers(jsonObj) {
    return XMFollowBase.CountWords(jsonObj, XMFollowBase.PROP_PENDING);
  }

  /**
     * Return number of blocked targets that this object has
     *
     * @param {{}} jsonObj
     * @return {number}
     */
  static CountBlockedUsers(jsonObj) {
    return XMFollowBase.CountWords(jsonObj, XMFollowBase.PROP_BLOCKED);
  }

  /**
     * Return number of muted targets that this object has
     *
     * @param {{}} jsonObj
     * @return {number}
     */
  static CountMutedUsers(jsonObj) {
    return XMFollowBase.CountWords(jsonObj, XMFollowBase.PROP_MUTED);
  }


} // class XMFollowBase

/**
 * Model who a user follows in a separate managed object.
 * The unique ID will be the same with the user ID, but
 * data stored in separate space, using different folder
 * name.
 */
export class XMFollows extends XMFollowBase {

  /**
     *
     * @param {string} clsname
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname = _CLSNAME_FOLLOWS, props) {
    super(clsname, props);
    this.class = XMFollows;
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
    return obj instanceof XMFollows;
  }

  /**
     * Return the default folder/table/collection name used
     * for storing stats
     */
  static GetFolderName() {
    return ModelFolder.FOLLOWS;
  }

  static GetName() {
    return _CLSNAME_FOLLOWS;
  }

  static GetTypeID() {
    return ModelType.FOLLOWS;
  }

  /**
     * Create a new instance
     *
     * @param {string} userId User ID, which is also the ID of this object
     * @param {string} title category title, optional
     * @param {string} desc optional
     */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMFollows();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }
} // class XMFollows

/**
 * Model who a user follows in a separate managed object.
 * The unique ID will be the same with the user ID, but
 * data stored in separate space, using different folder
 * name.
 */
export class XMFollowers extends XMFollowBase {

  /**
     *
     * @param {string} clsname
     * @param {*} props
     * @see #CreateNew
     */
  constructor(clsname = _CLSNAME_FOLLOWERS, props) {
    super(clsname, props);
    this.class = XMFollowers;
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
    return obj instanceof XMFollowers;
  }

  /**
     * Return the default folder/table/collection name used
     * for storing stats
     */
  static GetFolderName() {
    return ModelFolder.FOLLOWERS;
  }

  static GetName() {
    return _CLSNAME_FOLLOWERS;
  }

  static GetTypeID() {
    return ModelType.FOLLOWERS;
  }

  /**
     * Create a new instance
     *
     * @param {string} userId User ID, which is also the ID of this object
     * @param {string} title category title, optional
     * @param {string} desc optional
     */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMFollowers();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }
} // class XMFollowers


/**
 * Models a single user follow (bi-directional) relationship.
 * This is alternative implementation then XMFollows/XMFollowers
 * which implements 1-to-M via array of target userIds.
 *
 * PURPOSE: Given MongoDB array performance (or document
 * expansion) is not fully understood,
 *
 * @see XMFollow.CreateNew()
 */
class XMFollow extends XMObject {
  static get PROP_STATUS() { return 's'; }

  static get STATUS_FOLLOWING() { return STATUS_FOLLOWING; }
  static get STATUS_NOT_FOLLOWING() { return STATUS_NOT_FOLLOWING; }

  static get STATUS_ACCEPTED() { return STATUS_ACCEPTED; }
  static get STATUS_PENDING() { return STATUS_PENDING; }
  static get STATUS_BLOCKED() { return STATUS_BLOCKED; }
  static get STATUS_MUTED() { return STATUS_MUTED; }

  static get PROP_BLOCKED() { return SocialProps.BLOCKED; }
  static get PROP_MUTED() { return SocialProps.MUTED; }
  static get PROP_FOLLOWING_USERID() { return 'fid'; }


  /**
   *
   * @param {string} clsname supply by subclasses
   * @param {*} props
   * @see #CreateNew
   */
  constructor(clsname, props) {
    super(clsname, props);
    this.class = XMFollow;
  }

  /**
   * Used by StorageManager. Override inherited method
   * to ensure no updated timestamp is added. This saves
   * extra overhead in storage. Only creation timestamp
   * is stored.
   *
   * @return {boolean} true to enforce a updated timestamp.
   *
   * @see ~mustHaveCreatedTS()
   */
  mustHaveUpdatedTS() {
    return false;
  }

  /**
   * Use CreateNew() to create this relationship record on server side
   *
   * @param {string} userId
   *
   * @see ~CreateNew()
   */
  setFollower(userId) {
    return this.setOwnerId(userId);
  }

  /**
   * Return follower's user Id, which should be the owner's id
   * for this relationship.
   *
   * @param {*} defaultVal
   * @return {string} follower's user Id (owner Id)
   *
   * @see ~getFollowingUser()
   */
  getFollower(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMFollow.GetFollower(data, defaultVal) : defaultVal;
  }

  /**
   * Add an userId to this list tracker directly as accepted user.
   *
   * @param {string} userId target user to following in this instance
   * @return {boolean} true if added
   */
  setFollowingUser(userId) {
    return XMFollow.SetFollowingUser(this.getData(true), userId);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getFollowingUser(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMFollow.GetFollowingUser(data, defaultVal) : defaultVal;
  }

  /**
   * Explicitly set the follow status. When nothing is set,
   * default is always ACCEPTED
   *
   * @param {string} status
   * @return {string} status set or null if not set
   */
  setStatus(status) {
    const data = this.getData(true);
    return data ? XMFollow.SetFollowStatus(data, status) : null;
  }

  /**
     * Report on whether the given userId is in the tracking list, and
     * if so which one (of the LIST_TYPES)
     *
     * @param {string} userId
     * @return {string} either ACCEPTED, PENDING, BLOCKED, MUTED
     * @see ~isFollowing
     */
  getStatus(userId, list = null, defaultVal = null) {
    const data = this.getData(false);
    return data ? XMFollow.GetStatus(data, defaultVal) : STATUS_NOT_FOLLOWING;
  }

  /**
   * Return whether the folower (owner of this object) is following the target
   * user. This will return false if status is either PENDING, BLOCKED, or MUTED,
   * or no following user info.
   *
   * @return {boolean} true if following (ACCEPTED or no status)
   */
  isFollowing(honorBlock = true) {
    const data = this.getData(false);
    return data ? XMFollow.IsFollowing(data, honorBlock) : false;
  }

  /**
   * Add a block property PROP_BLOCK with value STATUS_BLOCKED
   *
   * @return {string} previous value or null
   */
  setBlocked() {
    return XMFollow.SetBlocked(this.getData(true));
  }

  /**
   * Clear property/value for PROP_BLOCK if set previously
   *
   */
  unsetBlocked() {
    const data = this.getData(false);
    return data ? XMFollow.UnsetBlocked(data) : false;
  }

  /**
   * @return {boolean}
   */
  isBlocked() {
    const data = this.getData(false);
    return data ? XMFollow.IsBlocked(data) : null;
  }

  /**
   * Add a block property PROP_BLOCK with value STATUS_BLOCKED
   *
   * @return {string} previous value or null
   */
  setMuted() {
    return XMFollow.SetMuted(this.getData(true));
  }

  /**
   * Clear property/value for PROP_BLOCK if set previously
   *
   */
  unsetMuted() {
    const data = this.getData(false);
    return data ? XMFollow.UnsetMuted(data) : false;
  }

  /**
   * @return {boolean}
   */
  isMuted() {
    const data = this.getData(false);
    return data ? XMFollow.IsMuted(data) : null;
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * Direct check for instance matching this class (override parent)
   *
   * @return {boolean}
   */
  static IsInstance(obj) {
    return obj instanceof XMFollow;
  }

  /**
   * @return {string} folder name
   */
  static GetFolderName() {
    return ModelFolder.FOLLOW;
  }

  /**
   * @return {string} class name
   */
  static GetName() {
    return _CLSNAME;
  }

  /**
   * @return {string} follow type name
   */
  static GetTypeID() {
    return ModelType.FOLLOW;
  }


  /**
   * Derive object/record's _id (primary key field),
   * which is based on the two userIds
   *
   * @param {string} followerId
   * @param {string} followingId
   * @throws Exception will occur if input userIds are null
   */
  static DeriveID(followerId, followingId) {
    return `${followerId.toLowerCase()}_${followingId.toLowerCase()}`;
  }

  static CreateNew(followerId, followingId, status = null) {
    const followObj = new XMFollow();
    followObj.initNew(false);
    const _id = XMFollow.DeriveID(followerId, followingId);
    followObj._setId(_id);
    followObj.setFollower(followerId);
    followObj.setFollowingUser(followingId);

    if (status) {
      followObj.setFollowStatus(status);
    }

    return followObj;
  }

  /**
   *
   * @param {object} jsonObj
   * @param {stsring} userId
   */
  static SetFollower(jsonObj, userId) {
    return XMFollow.SetOwnerId(jsonObj, userId);
  }

  /**
   * Return the userId of the follower. This is currently
   * the object's _id
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   */
  static GetFollower(jsonObj, defaultVal = null) {
    return XMFollow.GetOwnerId(jsonObj, defaultVal);
  }


  /**
   *
   * @param {string} userId
   * @return {string} previous value
   */
  static SetFollowingUser(jsonObj, userId) {
    return XMFollow.SetObjectField(jsonObj, XMFollow.PROP_FOLLOWING_USERID, userId);
  }


  /**
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   * @return {string}
   */
  static GetFollowingUser(jsonObj, defaultVal = null) {
    return XMFollow.GetObjectField(jsonObj, XMFollow.PROP_FOLLOWING_USERID);
  }

  /**
   *
   * @param status one of STATUS_FOLLOWING, STATUS_NOT_FOLLOWING, STATUS_
   * @return {boolean} true to set successfully, false if error (bad status)
   */
  static SetFollowStatus(jsonObj, status) {
    if (STATUS_TYPES.includes(status)) {
      XMFollow.SetObjectField(jsonObj, XMFollow.PROP_STATUS, status);
      return true;
    }
    return false;
  }

  /**
   * Return follow status. Blocked and muted are treated as not following
   *
   * @param {object} jsonObj
   * @param {string} defaultVal return this if no value
   * @return {string} either ACCPTED, BLOCKED, MUTED, or PENDING
   *
   */
  static GetStatus(jsonObj, defaultVal = null) {
    return XMFollow.GetObjectField(jsonObj, XMFollow.PROP_STATUS, defaultVal);
  }

  /**
   * Return whether the user is following the following user defined in this object.
   * It can return false if 1) status is STATUS_PENDING, or 2) PROP_BLOCKED === STATUS_BLOCKED
   * if honorBlock is true.
   *
   * @param {object} jsonObj
   * @param {boolean} honorBlock true to honor block flag
   * @return {boolean} true if following (accepted status). no status value is equated to ACCEPTED
   */
  static IsFollowing(jsonObj, honorBlock = true) {
    let verdict = XMFollow.GetStatus(jsonObj, XMFollow.STATUS_ACCEPTED) === STATUS_ACCEPTED;
    if ((verdict === true) && honorBlock) {
      if (XMFollow.IsBlocked(jsonObj)) {
        verdict = false;
      }
    }
    return verdict;
  }

  /**
   * Set block property to STATUS_BLOCKED
   *
   * @param {{}} jsonObj
   */
  static SetBlocked(jsonObj) {
    return XMFollowBase.SetObjectField(jsonObj, XMFollowBase.PROP_BLOCKED, STATUS_BLOCKED);
  }

  /**
   * Clear block flag
   *
   * @param {{}} jsonObj
   */
  static UnsetBlocked(jsonObj) {
    return XMFollowBase.ClearObjectField(jsonObj, XMFollowBase.PROP_BLOCKED);
  }

  /**
   * Check if blocked property is set
   *
   * @param {object} jsonObj
   * @return {boolean} true if blocked property exists with the value STATUS_BLOCKED
   */
  static IsBlocked(jsonObj) {
    return XMFollow.GetObjectField(jsonObj, XMFollow.PROP_BLOCKED) === STATUS_BLOCKED;
  }

  /**
     * Add a user to the muted list.
     *
     * @param {{}} jsonObj
     */
  static SetMuted(jsonObj) {
    return XMFollow.SetObjectField(jsonObj, XMFollow.PROP_MUTED, STATUS_MUTED);
  }

  /**
   * Clear block flag
   *
   * @param {{}} jsonObj
   */
  static UnsetMuted(jsonObj) {
    return XMFollow.ClearObjectField(jsonObj, XMFollow.PROP_MUTED);
  }

  /**
   *
   * @param {object} jsonObj
   * @return {boolean} true if muted property exists and is set to STATUS_MUTED
   */
  static IsMuted(jsonObj) {
    return XMFollow.GetObjectField(jsonObj, XMFollow.PROP_MUTED) === STATUS_MUTED;
  }

} // class XMFollow

// To Be Deprecated
XMFollows.RegisterType(XMFollows);
XMFollowers.RegisterType(XMFollowers);

XMFollow.RegisterType(XMFollow);

export default XMFollow;
