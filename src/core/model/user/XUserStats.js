
import XObject from '../XObject';

import ModelType, { ModelFolder, UserProps, UserStatsProps } from '../ModelConsts';
import { XMFollows } from '../social/XMFollow';

const _CLSNAME = 'XUserStats'; // match class name

/**
 * Model a data structure that holds SOME
 * user info. It's expected to be used to
 * pass between front-end and back-end and
 * different logic. It's NOT the same as XMUser;
 * it holds subset but can also hold other
 * information such as statistics or
 * event information.
 */
class XUserStats extends XObject {

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XUserStats;

    this._setTypeID();
  }

  /**
     * Initialize content as a new object.
     */
  initNew() {
    super.initNew();
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
    return data ? XUserStats.GetUserId(data, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} nickname
     */
  setNickname(nickname) {
    return XUserStats.SetNickname(this.getData(true), nickname);
  }

  /**
     *
     * @param {string} useUsername
     * @param {*} defaultVal
     * @return {string}
     */
  getNickname(useUsername = true, defaultVal = null) {
    const data = this.getData(false);
    return XUserStats.GetNickname(data, useUsername, defaultVal);
  }

  /**
     * Return an aggregate "likes" count for the user,
     * which is a tally of likes on posts and likes on
     * comment.
     *
     * @param {*} defaultVal
     * @return (number)
     */
  getLikesCount(defaultVal = 0) {
    const likesPost = this.getLikesPostCount(0);
    const likesComment = this.getLikesCommentCount(0);
    return likesPost + likesComment;
  }

  /**
     *
     * @param {number} number of post likes
     */
  setLikesPostCount(likes) {
    return XUserStats.SetLikesPostCount(this, likes);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {number} count of post likes
     */
  getLikesPostCount(defaultVal = null) {
    return XUserStats.GetLikesPostCount(this, defaultVal);
  }

  /**
     *
     * @param {number} number of comment likes
     */
  setLikesCommentCount(likes) {
    return XUserStats.SetLikesCommentCount(this, likes);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count of comment likes
   */
  getLikesCommentCount(defaultVal = null) {
    return XUserStats.GetLikesCommentCount(this, defaultVal);
  }

  /**
   *
   * @param {number} number of post watches
   */
  setWatchesPostCount(watchCount) {
    return XUserStats.SetWatchesPostCount(this, watchCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count of post watches
   */
  getWatchesPostCount(defaultVal = null) {
    return XUserStats.GetWatchesPostCount(this, defaultVal);
  }

  /**
   *
   * @param {number} number of post watches
   */
  setWatchesCommentCount(watchCount) {
    return XUserStats.SetWatchesCommentCount(this, watchCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count of post watches
   */
  getWatchesCommentCount(defaultVal = null) {
    return XUserStats.GetWatchesCommentCount(this, defaultVal);
  }

  /**
   *
   * @param {number} number of shares
   */
  setSharesPostCount(shares) {
    return XUserStats.SetSharesPostCount(this, shares);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count of (accepted) shares
   */
  getSharesPostCount(defaultVal = null) {
    return XUserStats.GetSharesPostCount(this, defaultVal);
  }

  /**
   *
   * @param {number} number of shares
   */
  setSharesCommentCount(shares) {
    return XUserStats.SetSharesCommentCount(this, shares);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count of (accepted) shares
   */
  getSharesCommentCount(defaultVal = null) {
    return XUserStats.GetSharesCommentCount(this, defaultVal);
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
   * @param {number} number of (accepted) followers
   */
  setFollowsCount(follows) {
    return XUserStats.SetFollowsCount(this, follows);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count of (accepted) followers
   */
  getFollowsCount(defaultVal = null) {
    const n = XUserStats.GetFollowsCount(this, -1);
    return n < 0 ? defaultVal : n;
  }

  /**
     *
     * @param {number} followers number of (accepted) followers
     */
  setFollowersCount(followers) {
    return XUserStats.SetFollowersCount(this, followers);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {number}
     */
  getFollowersCount(defaultVal = null) {
    const n = XUserStats.GetFollowersCount(this, -1);
    return n < 0 ? defaultVal : n;
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
    return ModelFolder.USER_STATS;
  }

  static GetTypeID() {
    return ModelType.USER_STATS;
  }

  /**
     * Wrap JSON data that represents XMList
     */
  static Wrap(jsonRec, clsType = XUserStats) {
    return XUserStats.WrapXObject(jsonRec, clsType);
  }

  /**
     * Create an user info record aggregated from difference
     * sources but mainly XMUser. It is suitable to give to
     * client for rendering.
     *
     * @param {string} userId
     * @param {} props
     * @return {XUserStats}
     */
  static CreateNew(userId, props = null) {
    const userStats = new XUserStats();
    userStats._setId(userId);
    if (props) { userStats.importObjectFields(props); }

    return userStats;
  } // CreateNew

  static SetUserId(jsonRec, userId) {
    return XUserStats.SetId(jsonRec, userId);
  }
  static GetUserId(jsonRec, defaultVal = null) {
    return XUserStats.GetId(jsonRec, defaultVal);
  }

  static SetUsername(jsonRec, username) {
    return XUserStats.SetObjectField(jsonRec, UserProps.USERNAME, username);
  }

  static GetUsername(jsonRec, useMail = true, defaultVal = null) {
    let username = XUserStats.GetObjectField(jsonRec, UserProps.USERNAME, null);
    if (username == null) { username = XUserStats.GetUserId(jsonRec, null); }
    if ((username == null) && (useMail === true)) {
      username = XUserStats.GetEmail(jsonRec, null);
    }
    return username || defaultVal;
  }

  static SetNickname(jsonRec, name) {
    return XUserStats.SetObjectField(jsonRec, UserProps.NICKNAME, name);
  }

  /**
     *
     * @param {*} jsonRec
     * @param {boolean} useUsername
     * @param {*} defaultVal
     * @return {string}
     */
  static GetNickname(jsonRec, useUsername = true, defaultVal = null) {
    let name = XUserStats.GetObjectField(jsonRec, UserProps.NICKNAME, null);
    if ((name == null) && (useUsername === true)) {
      name = XUserStats.GetUsername(jsonRec, false, null);
    }
    return name || defaultVal;
  }

  /**
     * Set likes post count
     *
     * @param {number} likes
     */
  static SetLikesPostCount(userStats, likes) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.LIKES_POST, likes);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {number}
     */
  static GetLikesPostCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.LIKES_POST, defaultVal);
  }

  /**
   *
   * @param {number} reposts
   */
  static SetSharesPostCount(userStats, reposts) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.SHARES_POST, reposts);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetSharesPostCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.SHARES_POST, defaultVal);
  }

  /**
   * Set likes post count
   *
   * @param {number} likes
   */
  static SetLikesCommentCount(userStats, likes) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.LIKES_COMMENT, likes);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetLikesCommentCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.LIKES_COMMENT, defaultVal);
  }

  /**
   *
   * @param {number} watches
   */
  static SetWatchesPostCount(userStats, watches) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.WATCHES_POST, watches);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetWatchesPostCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.WATCHES_POST, defaultVal);
  }


  /**
   *
   * @param {number} watches
   */
  static SetWatchesCommentCount(userStats, watches) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.WATCHES_COMMENT, watches);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetWatchesCommentCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.WATCHES_COMMENT, defaultVal);
  }


  /**
   *
   * @param {number} reposts
   */
  static SetSharesCommentCount(userStats, reposts) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.SHARES_COMMENT, reposts);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetSharesCommentCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.SHARES_COMMENT, defaultVal);
  }


  /**
     *
     * @param {XMFollows} follows object tracking followings, or unwrapped json OK
     */
  static SetFollowsCount(userStats, follows) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.FOLLOWS, follows);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {number}
     */
  static GetFollowsCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.FOLLOWS, defaultVal);
  }

  /**
     *
     * @param {XMFollowers} follows object tracking followings, or unwrapped json OK
     */
  static SetFollowersCount(userStats, followers) {
    return XUserStats.SetXObjectField(userStats, UserStatsProps.FOLLOWED, followers);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {number}
     */
  static GetFollowersCount(userStats, defaultVal = null) {
    return XUserStats.GetXObjectField(userStats, UserStatsProps.FOLLOWED, defaultVal);
  }


  /**
     * Update the content of XMFollows into the given XUserInfo.
     *
     * @param {XUserStats} userInfo
     * @param {XMFollows} followsObj
     *
     * @return {}
     */
  static UpdateFollows(userInfo, follows) {
    userInfo = XUserStats.Unwrap(userInfo);
    follows = XMFollows.Unwrap(follows);

    const targetIds = XUserStats.GetFollowings(follows);

    return XUserStats.SetFollowings(targetIds);
  }

} // class XUserStats

XUserStats.RegisterType(XUserStats);

export default XUserStats;
