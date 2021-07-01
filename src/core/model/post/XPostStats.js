import Util from '../../Util';
import { ModelFolder, ModelType, StatsProps } from '../ModelConsts';
import XMObjectStats from '../social/XMObjectStats';

const _CLSNAME = 'XPostStats';

/**
 * Model a data structure that holds stats for a Post.
 * Some methods are in the parent class.
 */
class XPostStats extends XMObjectStats {
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XPostStats;

    this._setTypeID();
  }

  /**
   *
   * @param {number} count
   */
  setCommentCount(count) {
    return XPostStats.SetCommentCount(this, count);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getCommentCount(defaultVal = null) {
    return XPostStats.GetCommentCount(this, defaultVal);
  }

  /**
   *
   * @param {number} likeCount
   */
  setLikesPostCount(likeCount) {
    return XPostStats.SetLikesPostCount(this, likeCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getLikesPostCount(defaultVal = null) {
    return XPostStats.GetLikesPostCount(this, defaultVal);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getLikePostExtraStatus(defaultVal = null) {
    return XPostStats.GetLikePostExtraStatus(this, defaultVal);
  }

  /**
   *
   * @param {number} likeCount
   */
  setLikePostExtraStatus(likeCount) {
    return XPostStats.SetLikePostExtraStatus(this, likeCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getLikedPostCount(defaultVal = null) {
    return XPostStats.GetLikedPostCount(this, defaultVal);
  }

  /**
   *
   * @param {number} likeCount
   */
  setLikedPostCount(likeCount) {
    return XPostStats.SetLikedPostCount(this, likeCount);
  }

  /**
   *
   * @param {number} likeCount
   */
  setSharedPostCount(likeCount) {
    return XPostStats.SetSharedPostCount(this, likeCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getSharedPostCount(defaultVal = null) {
    return XPostStats.GetSharedPostCount(this, defaultVal);
  }

  /**
   *
   * @param {number} watchCount
   */
  setWatchedPostCount(watchCount) {
    return XPostStats.SetWatchedPostCount(this, watchCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getWatchedPostCount(defaultVal = null) {
    return XPostStats.GetWatchedPostCount(this, defaultVal);
  }


  /**
   * Deprecated - use object specific versions in subclasses
   *
   * @param {number} viewCount
   */
  setViewPostCount(viewCount) {
    return XPostStats.SetViewPostCount(this, viewCount);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} count
   */
  getViewPostCount(defaultVal = null) {
    return XPostStats.GetViewPostCount(this, defaultVal);
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
    return ModelFolder.POST_STATS;
  }

  /** @return {string} */
  static GetTypeID() {
    return ModelType.POST_STATS;
  }

  /**
   * Create an user info record aggregated from difference
   * sources but mainly Post. It is suitable to give to
   * client for rendering.
   *
   * @param {string} objectId ID assigned for this stat object
   * @return {XPostStats}
   */
  static CreateNew(objectId, props) {
    const statObj = new XPostStats();
    if (objectId) { statObj._setId(objectId); }
    if (props) {
      statObj.importObjectFields(props);
    }

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
   * Set content of the user "like status" stat
   *
   * @param {number} value new "like status" numeric value
   */
  static SetLikePostExtraStatus(jsonObj, value) {
    return XMObjectStats.SetXObjectField(jsonObj, StatsProps.LIKE_POST_EXTRA_STATUS, value);
  }

  /**
   * Set content of the user "like status" stat
   *
   * @param {number} value new "like status" numeric value
   */
  static GetLikePostExtraStatus(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(jsonObj, StatsProps.LIKE_POST_EXTRA_STATUS, defaultVal);
    return value || defaultVal;
  }

  /**
   * Set content of the user "likes" stat
   *
   * @param {number} value new "likes" numeric value
   */
  static SetLikesPostCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(jsonObj, StatsProps.LIKES_POST, value);
  }

  /**
   * Retrieve user "likes" post count
   *
   * @param {*} defaultVal value to return if no such field
   * @return {number} count value or defaultVal
   */
  static GetLikesPostCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(jsonObj, StatsProps.LIKES_POST, defaultVal);
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set content of the post "liked" by stat
   *
   * @param {number} value new liked count
   */
  static SetLikedPostCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(
      jsonObj,
      StatsProps.LIKEDBY_POST,
      value
    );
  }

  /**
   * Retrieve post "liked" by count
   *
   * @param {*} defaultVal value to return if no such field
   * @return {number} count value or defaultVal
   */
  static GetLikedPostCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(
      jsonObj,
      StatsProps.LIKEDBY_POST,
      null
    );
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set shared stat value
   *
   * @param {number} value new count value
   */
  static SetSharedPostCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(
      jsonObj,
      StatsProps.POST_SHAREDBY,
      value
    );
  }

  /**
   * Retrieve shared stat value
   *
   * @param {*} defaultVal value to return if no such field (value not set)
   * @return {number} count value or defaultVal
   */
  static GetSharedPostCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(
      jsonObj,
      StatsProps.POST_SHAREDBY,
      null
    );
    return Util.toNumber(value, defaultVal);
  }

  /**
   * Set content of the watched post stat
   *
   * @param {number} value new liked count
   */
  static SetWatchedPostCount(jsonObj, value) {
    return XMObjectStats.SetXObjectField(
      jsonObj,
      StatsProps.WATCHED_POST,
      value
    );
  }

  /**
   * Retrieve watched post stat value
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetWatchedPostCount(jsonObj, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(
      jsonObj,
      StatsProps.WATCHED_POST,
      null
    );
    return Util.toNumber(value, defaultVal);
  }


  /**
   * Set cview count into this state object
   *
   * @param {number} value new view count
   */
  static SetViewPostCount(userStats, value) {
    return XMObjectStats.SetXObjectField(userStats, StatsProps.VIEWS_FULL_POST, value);
  }

  /**
   * Retrieve the once-set post view object
   *
   * @param {*} defaultVal
   * @return {number}
   */
  static GetViewPostCount(userStats, defaultVal = null) {
    const value = XMObjectStats.GetXObjectField(userStats, StatsProps.VIEWS_FULL_POST, defaultVal);
    return Util.toNumber(value, defaultVal);
  }


} // class XPostStats

XPostStats.RegisterType(XPostStats);

export default XPostStats;
