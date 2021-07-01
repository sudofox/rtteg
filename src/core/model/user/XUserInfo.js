import { UserProps, ModelType, SocialProps, ModelFolder, UserStatsProps } from '../ModelConsts';
import XUserCred from './XUserCred';
import XUserObject from './XUserObject';
import Util from '../../Util';
import XUserStats from './XUserStats';

const _CLSNAME = 'XUserInfo'; // match class name

const _StatsFields = [
  UserStatsProps.LIKES_POST, UserStatsProps.LIKES_COMMENT,
  UserStatsProps.SHARES_POST, UserStatsProps.SHARES_COMMENT,
  UserStatsProps.WATCHES_POST, UserStatsProps.WATCHES_COMMENT,
  UserStatsProps.FOLLOWS, UserStatsProps.FOLLOWED
];

// export { UserProps, TOKEN_GUEST, TOKEN_ROBOT } from "../ModelConsts";

/**
 * Model a data structure that holds SOME
 * user info. It's expected to be used to
 * pass between front-end and back-end and
 * different logic. It's NOT the same as XMUser;
 * it holds subset but can also hold other
 * information such as statistics or
 * event information.
 */
class XUserInfo extends XUserObject {
  // constants to share with consumer of this class
  // constants to share with consumer of this class
  static get APP_ROLES() { return UserProps.APPUSER_ROLES; }
  static get ROLE_ROOT() { return UserProps.ROLE_ROOT; }
  static get ROLE_ADMIN() { return UserProps.ROLE_ADMIN; }
  static get ROLE_SYSADM() { return UserProps.ROLE_SYSADM; }

  static get FEATURE_PREVIEW() { return UserProps.FEATURE_PREVIEW; }

  /**
   * Abstract: instantiate only one of its concrete subclasses
   *
   * @param {string} clsname
   * @param {*} props
   */
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XUserInfo;
  }

  /**
     * Initialize content as a new object.
     */
  initNew() {
    super.initNew();
  }

  /**
   * Get object's Id, which in this case, should be user's Id.
   *
   * @return {string}
   */
  getId() {
    let id = super.getId();
    if (id == null) {
      id = this.getUserId();
    }
    return id;
  }

  /**
     * Return user credential data, which for now
     * it's the user token and userId
     *
     * @return {XUserCred}
     */
  getCredential() {
    return XUserCred.CreateFromUserInfo(this);
  }

  /**
     * Retrieve user token stored here. It is generated from
     * the backend.
     *
     * @param {string} defaultVal
     * @return {string}
     */
  getUserToken(defaultVal) {
    const data = this.getData(false);
    return data ? XUserInfo.GetUserToken(data, defaultVal) : defaultVal;
  }

  /**
     * Store generated token generated else where
     *
     * @param {string} token
     */
  setUserToken(token) {
    return XUserInfo.SetUserToken(this.getData(true), token);
  }

  /**
     * UserId is set from server side extracting content from
     * XMUser and other related objects. It is actually the _id
     * field (primary key).
     *
     * @param {string} defaultVal
     * @return {string}
     */
  getUserId(defaultVal) {
    const data = this.getData(false);
    return data ? XUserInfo.GetUserId(data, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} userId
     */
  setUserId(userId) {
    return XUserInfo.SetUserId(this.getData(true), userId);
  }

  /**
     * Set user's first name
     * @param {string} fn user's first name
     */
  setFirstName(fn) {
    return XUserInfo.SetFirstName(this.getData(true), fn);
  }

  /**
     * Get user's last name
     * @param {*} defaultVal
     * @return {string}
     */
  getFirstName(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetFirstName(data, defaultVal) : defaultVal;
  }

  /**
     * Set user's last name
     * @param {string} ln user's last name
     */
  setLastName(ln) {
    return XUserInfo.SetLastName(this.getData(true), ln);
  }

  /**
     * Get user's last name
     * @param {*} defaultVal
     * @return {string}
     */
  getLastName(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetLastName(data, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} email
     */
  setEmail(email) {
    return XUserInfo.SetEmail(this.getData(true), email);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string}
     */
  getEmail(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetEmail(data, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} phoneNo
     */
  setSMS(phoneNo) {
    return XUserInfo.SetSMS(this.getData(true), phoneNo);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string[]} blocked users if exist, defaultVal otherwise
     */
  getBlockedUsers(defaultVal = null) {
    const data = this.getData(false);
    return data ? Util.Text2Array(XUserInfo.GetBlockedUsers(data, defaultVal)) : defaultVal;
  }

  /**
   *
   * @param {*} blocks
   * @param {boolean} create
   */
  setBlockedUsers(blocks, create = true) {
    if (blocks == null && create) { blocks = []; }
    if (typeof blocks === 'string') { Util.Text2Array(blocks); }
    return XUserInfo.SetBlockedUsers(this.getData(true), blocks);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string[]} muted users if exist, defaultVal otherwise
   */
  getMutedUsers(defaultVal = null) {
    const data = this.getData(false);
    return data ? Util.Text2Array(XUserInfo.GetMutedUsers(data, defaultVal)) : defaultVal;
  }

  /**
   *
   * @param {*} mutes
   * @param {boolean} create
   */
  setMutedUsers(mutes, create = true) {
    if (mutes == null && create) { mutes = []; }
    if (typeof mutes === 'string') { Util.Text2Array(mutes); }
    return XUserInfo.SetMutedUsers(this.getData(true), mutes);
  }

  /**
   * Return list of IDs for pinned posts
   *
   * @param {*} defaultVal
   * @return {string[]} postId array
   */
  getPinnedPosts(defaultVal = null) {
    const data = this.getData(false);
    return data ? Util.Text2Array(XUserInfo.GetPinnedPosts(data, defaultVal)) : defaultVal;
  }


  /**
   *
   * @param {*} mutes
   */
  setUserStats(userStats) {
    return XUserInfo.SetUserStats(this.getData(true), userStats);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string} muted users if exist, defaultVal otherwise
   */
  getUserStats(defaultVal = null) {
    const auxData = this.getData(true);
    return auxData ? XUserInfo.GetUserStats(auxData, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {XUserStts} xUserStats
   */
  fillFromUserStats(xUserStats) {
    const data = this.getData(true);
    return XUserInfo.FillFromUserStats(data, xUserStats);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string} phone number if exists, defaultVal otherwise
   */
  getSMS(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetSMS(data, defaultVal) : defaultVal;
  }

  /**
     * Answer verified contact status. This is a derived field from XMUser
     *
     * @param {*} jsonRec
     * @return {boolean} true if user has verified contact info, false otherwise
     */
  hasVerifiedContact() {
    const data = this.getData(false);
    return data ? XUserInfo.HasVerifiedContact(data) : false;
  }

  /**
   * Return all roles added to this user
   *
   * @param {*} defaultVal
   */
  getRoles(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetRoles(data, defaultVal) : defaultVal;
  }

  /**
   * Get role definition for a given role
   *
   * @param {string} roleId
   * @param {*} defaultVal
   * @return {{}} properties for the role, if it exists
   *
   * @see #addRole
   * @see #removeRole
   * @see #hasRole
   */
  getRole(roleId, defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetRole(data, roleId, defaultVal) : defaultVal;
  }

  /**
   * Determine if a role is defined.
   *
   * @param {string} roleId one of ROLE_*
   * @return {boolean} true if role is defined regardless of stored properties
   *
   * @see #addRole
   * @see #getRole
   * @see #removeRole
   */
  hasRole(roleId) {
    const data = this.getData(false);
    return data ? XUserInfo.HasRole(data, roleId) : false;
  }

  /**
   * @return {boolean}
   */
  hasGodRole() {
    const data = this.getData(false);
    return data ? XUserInfo.HasGodRole(data) : false;
  }


  /**
   * Determine if this user has sys admin role
   *
   * @return {boolean} true if the record indicate admin,
   * or root priv
   */
  hasAdminRole() {
    const data = this.getData(false);
    return data ? XUserInfo.HasAdminRole(data) : false;
  }

  /**
   * Determine if this user has sys admin role
   *
   * @return {boolean} true if the record indicate sys admin,
   * or root priv
   */
  hasSysAdminRole() {
    const data = this.getData(false);
    return data ? XUserInfo.HasSysAdminRole(data) : false;
  }

  /**
     *
     * @param {string} username
     */
  setUsername(username) {
    return XUserInfo.SetUsername(this.getData(true), username);
  }

  /**
     *
     * @param {boolean} useEmail
     * @param {*} defaultVal
     * @return {string}
     */
  getUsername(useEmail = true, defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetUsername(data, useEmail, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} nickname
     */
  setNickname(nickname) {
    return XUserInfo.SetNickname(this.getData(true), nickname);
  }

  /**
     *
     * @param {boolean} useUsername
     * @param {*} defaultVal
     * @return {string}
     */
  getNickname(useUsername = true, defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetNickname(data, useUsername, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {string} status
   */
  setStatus(status) {
    return XUserInfo.SetStatus(this.getData(true), status);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getStatus(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserInfo.GetStatus(data, defaultVal) : defaultVal;
  }

  /**
     * Return user's avatar URL. This will check
     * for explicitly stored icon url for the user,
     * and then try getting Facebook's url.
     *
     * @param {*} defaultVal
     * @return {string=}
     */
  getAvatarUrl(defaultVal = null) {
    return this.getIconUrl(defaultVal);
  }

  /**
   *
   * @param {boolean} isBlocked
   */
  setBlockFlag(isBlocked) {
    return XUserInfo.SetBlockFlag(this.getData(true), isBlocked);
  }

  /**
   *
   * @param {boolean} isMuted
   */
  setMuteFlag(isMuted) {
    return XUserInfo.SetMuteFlag(this.getData(true), isMuted);
  }

  getBlockFlag() {
    const data = this.getData(false);
    return data ? XUserInfo.GetBlockFlag(data) : false;
  }

  getMuteFlag() {
    const data = this.getData(false);
    return data ? XUserInfo.GetMuteFlag(data) : false;
  }

  // ---------------------- USER STATS DATA METHODS ---------------------------

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getLikesPostCount(defaultVal = null) {
    return this.get(UserStatsProps.LIKES_POST);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getLikesCommentCount(defaultVal = null) {
    return this.get(UserStatsProps.LIKES_COMMENT);
  }

  /**
   * @return {number} combined likes of posts + comments
   */
  getLikesCount() {
    const likesPost = this.getLikesPostCount(0);
    const likesComment = this.getLikesCommentCount(0);
    return likesPost + likesComment;
  }

  /**
   * Return repost count (posts only, no comments)
   *
   * @param {*} defaultVal
   * @return {number}
   *
   * @see ~getSharesCommentCount
   * @see ~getSharesCount
   */
  getSharesPostCount(defaultVal = null) {
    return this.get(UserStatsProps.SHARES_POST, defaultVal);
  }

  /**
   * Return repost comment count (no posts)
   *
   * @param {*} defaultVal
   * @return {number}
   *
   * @see ~getSharesCount
   */
  getSharesCommentCount(defaultVal = null) {
    return this.get(UserStatsProps.SHARES_COMMENT, defaultVal);
  }

  /**
   * Get total reposts count, which include both posts and
   * reposted comments
   *
   * @return {number}
   */
  getSharesCount() {
    const sharesPost = this.getSharesPostCount(0);
    const sharesComment = this.getSharesCommentCount(0);
    return sharesPost + sharesComment;
  }


  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getWatchesPostCount(defaultVal = null) {
    return this.get(UserStatsProps.WATCHES_POST);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getWatchesCommentCount(defaultVal = null) {
    return this.get(UserStatsProps.WATCHES_COMMENT);
  }

  /**
   * @return {number} combined likes of posts + comments
   */
  getWatchesCount() {
    const watchesPost = this.getWatchesPostCount(0);
    const watchesComment = this.getWatchesCommentCount(0);
    return watchesPost + watchesComment;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getFollowsCount(defaultVal = null) {
    return this.get(UserStatsProps.FOLLOWS, defaultVal);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getFollowersCount(defaultVal = null) {
    return this.get(UserStatsProps.FOLLOWED, defaultVal);
  }


  // --------------- AD HOC / CUSTOM / QUESTIONABLE CONTENT SUPPORT --------------------

  /**
   * @param {boolean} isFollowing
   */
  setFollowingFlag(isFollowing) {
    return XUserInfo.SetFollowingFlag(this.getData(true), isFollowing);
  }

  getFollowingFlag() {
    const data = this.getData(false);
    return data ? XUserInfo.GetFollowingFlag(data) : false;
  }

  // *************************************************************
  //
  // Class/static methods.
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
    return ModelType.USER_INFO;
  }

  static CreateNew(userId) {
    const userInfo = new XUserInfo();
    userInfo.initNew();
    if (userId) { userInfo._setId(userId); }
    return userInfo;
  }


  /**
     * Wrap JSON data that represents XUserInfo. Inject
     * type as the input json may not have the right
     * type.
     *
     * @return {XUserInfo}
     */
  static Wrap(jsonRec, clsType = XUserInfo) {
    return super.WrapXObject(jsonRec, clsType);
  }

  /**
   * Merge in predefined stats in XUserStats object.
   *
   * @param {{}} jsonRec
   * @param {XUserStats} xUserStats unwrapped json OK
   * @return {{}} same input json but with stats added
   *
   */
  static FillFromUserStats(jsonRec, xUserStats) {
    const jsonStats = XUserStats.Unwrap(xUserStats);

    Object.keys(jsonStats).forEach((key) => {
      jsonRec[key] = jsonStats[key];
    });
    return jsonRec;
  }

  static SetUserToken(jsonRec, token) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.TOKEN, token);
  }
  static GetUserToken(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, UserProps.TOKEN, defaultVal);
  }

  static SetUserId(jsonRec, userId) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.ID, userId);
  }
  static GetUserId(jsonRec, defaultVal = null) {
    // Temporary transition: until we store userId in XUserInfo too
    const username = XUserInfo.GetObjectField(jsonRec, UserProps.USERNAME, null);
    return username ? username.toLowerCase() : defaultVal;
    // return XUserInfo.GetObjectField(jsonRec, UserProps.ID, defaultVal);
  }

  static SetUsername(jsonRec, username) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.USERNAME, username);
  }

  static GetUsername(jsonRec, useMail = false, defaultVal = null) {
    let username = XUserInfo.GetObjectField(jsonRec, UserProps.USERNAME, null);
    if (username == null) { username = XUserInfo.GetUserId(jsonRec, null); }
    if ((username == null) && (useMail === true)) {
      username = XUserInfo.GetEmail(jsonRec, null);
    }
    return username || defaultVal;
  }

  static SetNickname(jsonRec, name) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.NICKNAME, name);
  }

  static GetNickname(jsonRec, useUsername = true, defaultVal = null) {
    let name = XUserInfo.GetObjectField(jsonRec, UserProps.NICKNAME, null);
    if ((name == null) && (useUsername === true)) {
      name = XUserInfo.GetUsername(jsonRec, false, null);
    }
    return name || defaultVal;
  }

  static SetFirstName(jsonRec, email) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.FIRSTNAME, email);
  }
  static GetFirstName(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, UserProps.FIRSTNAME, defaultVal);
  }

  static SetLastName(jsonRec, email) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.LASTNAME, email);
  }
  static GetLastName(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, UserProps.LASTNAME, defaultVal);
  }

  static SetEmail(jsonRec, email) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.EMAIL, email);
  }
  static GetEmail(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, UserProps.EMAIL, defaultVal);
  }

  static SetSMS(jsonRec, email) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.SMS, email);
  }
  static GetSMS(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, UserProps.SMS, defaultVal);
  }

  static SetBlockedUsers(jsonRec, blocks) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.BLOCK_LIST, blocks);
  }

  /**
   *
   * @param {*} jsonRec
   * @param {*} defaultVal
   * @returns {string[]}
   */
  static GetBlockedUsers(jsonRec, defaultVal = null) {
    const result = XUserInfo.GetObjectField(jsonRec, UserProps.BLOCK_LIST, null);
    return result ? Util.Text2Array(result) : defaultVal;
  }

  /**
   *
   * @param {*} jsonRec
   * @param {string[]} mutes
   * @returns
   */
  static SetMutedUsers(jsonRec, mutes) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.MUTE_LIST, mutes);
  }

  /**
   *
   * @param {*} jsonRec
   * @param {*} defaultVal
   * @returns {string[]}
   */
  static GetMutedUsers(jsonRec, defaultVal = null) {
    const result = XUserInfo.GetObjectField(jsonRec, UserProps.MUTE_LIST, null);
    return result ? Util.Text2Array(result) : defaultVal;
  }

  /**
   *
   * @param {*} jsonRec
   * @param {*} defaultVal
   * @returns {string[]}
   */
  static GetPinnedPosts(jsonRec, defaultVal = null) {
    const result = XUserInfo.GetObjectField(jsonRec, UserProps.PINPOSTS, null);

    // UserInfo may be constructed from cache result, so maybe a string of
    // post Ids delimited by comma
    return result ? Util.Text2Array(result) : defaultVal;
  }


  static SetUserStats(jsonRec, userStats) {
    return XUserInfo.SetObjectField(jsonRec, ModelType.USER_STATS, userStats);
  }

  static GetUserStats(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, ModelType.USER_STATS, defaultVal);
  }

  static SetBlockFlag(jsonRec, isBlocked) {
    return XUserInfo.SetObjectField(jsonRec, SocialProps.BLOCKFLAG, isBlocked);
  }

  static SetMuteFlag(jsonRec, isMuted) {
    return XUserInfo.SetObjectField(jsonRec, SocialProps.MUTEFLAG, isMuted);
  }

  static GetBlockFlag(jsonRec) {
    return XUserInfo.GetObjectField(jsonRec, SocialProps.BLOCKFLAG);
  }

  static GetMuteFlag(jsonRec) {
    return XUserInfo.GetObjectField(jsonRec, SocialProps.MUTEFLAG);
  }

  static SetFollowingFlag(jsonRec, isFollowing) {
    return XUserInfo.SetObjectField(jsonRec, SocialProps.FLWFLAG, isFollowing);
  }

  static GetFollowingFlag(jsonRec) {
    return XUserInfo.GetObjectField(jsonRec, SocialProps.FLWFLAG);
  }

  /**
   *
   * @param {{}} jsonRec
   * @param {*} defaultVal
   * @return {number}
   */
  static GetFollowsCount(jsonRec, defaultVal = null) {
    return XUserInfo.GetXObjectField(jsonRec, UserStatsProps.FOLLOWS, defaultVal);
  }

  /**
   *
   * @param {{}} jsonRec
   * @param {*} defaultVal
   * @return {number}
   */
  static GetFollowedCount(jsonRec, defaultVal = null) {
    return XUserInfo.GetXObjectField(jsonRec, UserStatsProps.FOLLOWED, defaultVal);
  }

  /**
     * Answer verified contact status. This is a derived field from XMUser
     *
     * @param {*} jsonRec
     * @return {boolean} true if user has verified contact info, false otherwise
     */
  static HasVerifiedContact(jsonRec) {
    return XUserInfo.GetObjectField(jsonRec, UserProps.VERIFIED_CONTACT, false);
  }

  /**
     *
     * @param {*} jsonRec
     * @param {*} newStatus
     */
  static SetStatus(jsonRec, newStatus) {
    return XUserInfo.SetObjectField(jsonRec, UserProps.STATUS, newStatus);
  }

  // ------------------- USER ROLES ---------------------

  static SetRoles(jsonRec, roles) {
    return XUserInfo.SetObjectField(jsonRec, XUserInfo.APP_ROLES, roles);
  }

  static GetRoles(jsonRec, defaultVal = null) {
    return XUserInfo.GetObjectField(jsonRec, XUserInfo.APP_ROLES, defaultVal);
  }

  /**
     * Return role definition for the given role type
     *
     * @param {object} jsonRec json for XUserInfo
     * @param {string} role one of ROLE_* in XAuthInfo
     * @param {*} defaultVal if role not found
     */
  static GetRole(jsonRec, role, defaultVal = null) {
    const roles = XUserInfo.GetRoles(jsonRec);
    if (roles == null) { return defaultVal; }
    const roleObj = roles[role];
    return roleObj || defaultVal;
  }

  /**
   *
   * @param {object} jsonRec
   * @param {string} role
   * @return {boolean}
   */
  static HasRole(jsonRec, role) {
    let verdict = Util.NotNull(XUserInfo.GetRole(jsonRec, role, null));
    if (verdict === false) {
      verdict = XUserInfo.HasGodRole(jsonRec);
    }
    return verdict;
  } // HasRole

  static HasGodRole(jsonRec) {
    return Util.NotNull(XUserInfo.GetRole(jsonRec, XUserInfo.ROLE_ROOT, null));
  }

  /**
   *
   * @param {object} jsonRec
   * @return {boolean}
   */
  static HasAdminRole(jsonRec) {
    return XUserInfo.HasRole(jsonRec, XUserInfo.ROLE_ADMIN);
  }

  /**
   *
   * @param {object} jsonRec
   * @return {boolean}
   */
  static HasSysAdminRole(jsonRec) {
    return XUserInfo.HasRole(jsonRec, XUserInfo.ROLE_SYSADM);
  }

  /**
   * return mongoDB collection name
   *
   * NOTE: This is not semantically correct as XMUser is
   * stored in the "user" collection.  But because of the
   * way we use XUserInfo as transient version (but contain other
   * data), some generic type-to-storage methods will need
   * this (and StorageManager type->folder mapping)
   *
   * @return {string}
   */
  GetFolderName() {
    return ModelFolder.USER;
  }

  // -------------------------------------------------------------------


} // class XUserInfo

XUserInfo.RegisterType(XUserInfo);

export default XUserInfo;
