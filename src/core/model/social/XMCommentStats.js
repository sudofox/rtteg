
import Util from '../../Util';
import { ModelFolder, ModelType, StatsProps } from '../ModelConsts';
import XMObjectStats from './XMObjectStats';

const _CLSNAME = 'CommentStats'; // match class name


/**
 * Base class for stats on a comment. Subclasses can
 * refer to stats on various types of comments
 */
class XMCommentStats extends XMObjectStats {

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMCommentStats;

    this._setTypeID();
  }


  /**
   *
   * @param {number} count
   */
  setCommentCount(count) {
    return XMCommentStats.SetCommentCount(this, count);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getCommentCount(defaultVal = null) {
    return XMCommentStats.GetCommentCount(this, defaultVal);
  }

  /**
   *
   * @param {number} likeCount
   */
  // setLikesCommentCount(likeCount) {
  //   return XMCommentStats.SetLikesCommentCount(this, likeCount);
  // }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  // getLikesCommentCount(defaultVal = null) {
  //   return XMCommentStats.GetLikesCommentCount(this, defaultVal);
  // }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getLikedCommentCount(defaultVal = null) {
    return XMCommentStats.GetLikedCommentCount(this, defaultVal);
  }

  /**
   *
   * @param {number} likeCount
   */
  setLikedCommentCount(likeCount) {
    return XMCommentStats.SetLikedCommentCount(this, likeCount);
  }


  /**
   *
   * @param {number} likeCount
   */
  setSharedCommentCount(likeCount) {
    return XMCommentStats.SetSharedCommentCount(this, likeCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getSharedCommentCount(defaultVal = null) {
    return XMCommentStats.GetSharedCommentCount(this, defaultVal);
  }

  /**
   *
   * @param {number} watchCount
   */
  setWatchedCommentCount(watchCount) {
    return XMCommentStats.SetWatchedCommentCount(this, watchCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getWatchedCommentCount(defaultVal = null) {
    return XMCommentStats.GetWatchedCommentCount(this, defaultVal);
  }


  /**
     *
     *
     * @param {number} viewCount
     */
  setViewCommentCount(viewCount) {
    return XMCommentStats.SetViewCommentCount(this, viewCount);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {number} count
     */
  getViewCommentCount(defaultVal = null) {
    return XMCommentStats.GetViewCommentCount(this, defaultVal);
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /** @return {string} */
  static GetName() {
    return _CLSNAME;
  }

  /** @return {string} */
  static GetFolderName() {
    return ModelFolder.COMMENT_STATS;
  }

  /** @return {string} */
  static GetTypeID() {
    return ModelType.COMMENT_STATS;
  }

  /**
   * Create an user info record aggregated from difference
   * sources but mainly Post. It is suitable to give to
   * client for rendering.
   *
   * @param {string} objectId assigned ID for this stat object
   * @return {XMCommentStats}
   */
  static CreateNew(objectId, props) {
    const statObj = new XMCommentStats();
    if (objectId) { statObj._setId(objectId); }
    if (props) { statObj.importObjectFields(props); }

    return statObj;
  } // CreateNew


  /**
   *
   * @param {{}} jsonObj
   * @param {number} value new "likes" numeric value
   */
  static SetCommentCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(jsonObj, StatsProps.COMMENTS, value);
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal value to return if no such field
   * @return {number} count value or defaultVal
   */
  static GetCommentCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(jsonObj, StatsProps.COMMENTS, defaultVal);
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set content of the user "likes" comment stat
   *
   * @param {number} value new "likes" numeric value
   */
  static SetLikedCommentCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(jsonObj, StatsProps.LIKEDBY_COMMENT, value);
  }

  /**
   * Retrieve user "likes" comment count
   *
   * @param {*} defaultVal value to return if no such field
   * @return {number} count value or defaultVal
   */
  static GetLikedCommentCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(jsonObj, StatsProps.LIKEDBY_COMMENT, defaultVal);
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set shared stat value
   *
   * @param {number} value new count value
   */
  static SetSharedCommentCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(jsonObj, StatsProps.COMMENT_SHAREDBY, value);
  }

  /**
   * Retrieve shared stat value
   *
   * @param {*} defaultVal value to return if no such field (value not set)
   * @return {number} count value or defaultVal
   */
  static GetSharedCommentCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(jsonObj, StatsProps.COMMENT_SHAREDBY, null);
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set content of the watched comment stat
   *
   * @param {number} value new liked count
   */
  static SetWatchedCommentCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(jsonObj, StatsProps.WATCHED_COMMENT, value);
  }

  /**
   * Retrieve watched comment stat value
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetWatchedCommentCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(jsonObj, StatsProps.WATCHED_COMMENT, null);
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set view count into this state object
   *
   * @param {number} value new view count
   */
  static SetViewCommentCount(userStats, value) {
    return XMObjectStats.SetXObjectField(userStats, StatsProps.VIEWS_FULL_COMMENT, value);
  }

  /**
   * Retrieve the once-set post view object
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetViewCommentCount(userStats, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(userStats, StatsProps.VIEWS_FULL_COMMENT, defaultVal);
    return Util.toNumber(value, defaultVal);
  }

} // class CommentStats

XMCommentStats.RegisterType(XMCommentStats);

export default XMCommentStats;
