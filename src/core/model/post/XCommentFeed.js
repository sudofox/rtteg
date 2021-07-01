import XMList from '../XMList';
import { ModelType, MessageProps, XObjectProps } from '../ModelConsts';
import Util from '../../Util';
import XObject from '../XObject';
import XMComment from '../social/XMComment';
import XVarData from '../activity/XVarData';
import XCommentInfo from '../social/XCommentInfo';
import XMCommentStats from '../social/XMCommentStats';

const _CLSNAME = 'XCommentFeed';

/**
 * Container holding a list of XMComment objects and
 * carry additional states.
 */

export class XCommentFeed extends XMList {
  static get VARDATA() { return MessageProps.VARDATA; }
  static get SORTBY() { return MessageProps.SORTBY; }

  static get SORT_NEWEST() { return MessageProps.SORT_NEWEST; }
  static get SORT_OLDEST() { return MessageProps.SORT_OLDEST; }
  static get SORT_HOTEST() { return MessageProps.SORT_HOTEST; }
  static get SORT_LIKED() { return MessageProps.SORT_LIKED; }

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XCommentFeed;
  }

  /**
     * Track the variable data map that helps
     * fill the template in the alert messages.
     *
     * @param {XVarData} varData
     */
  setVarData(varData) {
    const json = XVarData.Unwrap(varData);
    this.set(XCommentFeed.VARDATA, json);
  }

  /**
     * Get the variable data map with wrapper.
     *
     * @deprecated - see getVarData
     *
     * @param {*} defaultVal
     * @return {{}}
     */
  getXVarData(defaultVal = null) {
    const jsonObj = this.get(XCommentFeed.VARDATA, null);
    return (jsonObj == null) ? defaultVal : XVarData.Wrap(jsonObj);
  }

  /**
     * Get the variable data map with optional wrapper.
     *
     * @param {boolean} wrap true to wrap with XVarData
     * @param {*} defaultVal
     * @return {XVarData}
     */
  getVarData(wrap, defaultVal = null) {
    const jsonObj = this.get(XCommentFeed.VARDATA, null);
    if (jsonObj == null) { return defaultVal; }
    return wrap ? XVarData.Wrap(jsonObj) : jsonObj;
  }

  /**
     * Append content from another XPostFeed object to this.
     *
     * @param {XCommentFeed} xCommentFeed
     * @param {boolean} clone true to add a cloned version. This is important
     * if you need to have a pointer back to this as the parent via setParent()
     * and not lose integrity of the iput object
     * @return {boolean} true if there are content to add, false if nothing added
     */
  addFromCommentFeed(xCommentFeed, clone = false) {
    const items = xCommentFeed.getList(false);
    if (!items || items.length === 0) { return false; }
    this.addComments(items);

    const varData = xCommentFeed.get(XCommentFeed.VARDATA, null);
    if (varData) {
      const thisVarData = this.get(XCommentFeed.VARDATA, {});
      this.set(XCommentFeed.VARDATA, { ...thisVarData, ...varData });
    }
    return true;
  }

  /**
     * Add one or more comment objects items
     *
     * @param {XMComment[]} commentObjs
     */
  addComments(commentObjs) {
    return this.addXItems(commentObjs);
  }

  /**
     * Return array of post item instances, with
     * option to track this container object as parent
     * and therefore can access the aux_data.
     *
     * @param {boolean} trackAuxData true to track
     * parent (this container)
     * @param {*} defaultVal if no content
     * @return {XMComments[]} item objects with
     * transient tracking to AuxData
     */
  getXComments(trackAuxData = false, defaultVal = null) {
    /** @type {XMComment[]} itemList */
    const itemList = this.getWrappedList(false);
    if (itemList == null) { return defaultVal; }
    if (trackAuxData === false) { return itemList; }

    const count = itemList.length;
    for (let i = 0; i < count; i++) {
      const xitem = itemList[i];
      xitem.setTParent(this);
    }
    return itemList;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {{string, XMComment}}
   */
  getXCommentsMap(defaultVal = null) {
    const resultMap = this.getKeyedList(false, XMComment.PROP_ID);
    return resultMap || defaultVal;
  }

  /**
     * Return the IDs of all the posts that are referenced
     * by all XMComment elements.
     *
     * @param {boolean} unique true to remove duplicates
     *
     * @return {string[]} list of post IDs
     */
  getCommentIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const postIds = [];
    for (let i = 0; i < count; i++) {
      const jsonCommentObj = jsonList[i];
      const postId = XMComment.GetId(jsonCommentObj);
      if (postId) { postIds.push(postId); }
    }
    return (unique === true) ? Util.UniqueArray(postIds) : postIds;
  }

  /**
     * Return the IDs of all the comments
     *
     * @param {boolean} unique true to remove duplicates
     *
     * @return {string[]} list of post IDs
     */
  getPosterIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const userIds = [];

    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const userId = XMComment.GetOwnerId(jsonPostItem);
      if (userId) { userIds.push(userId); }
    }
    return (unique === true) ? Util.UniqueArray(userIds) : userIds;
  }

  /**
     * Return the IDs of all the comment stats (XMCommentStats) that
     * are referenced by all comment elements.
     *
     * @param {boolean} unique true to remove duplicates
     *
     * @return {string[]} list of post IDs
     */
  getCommentStatsIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const statIds = [];
    for (let i = 0; i < count; i++) {
      const jsonInfo = jsonList[i];

      const statId = XCommentInfo.GetCommentStatsId(jsonInfo);
      if (statId) { statIds.push(statId); }
    }
    return (unique === true) ? Util.UniqueArray(statIds) : statIds;
  }

  /**
     * Sort content by updated timestamp
     *
     * @param {boolean=} store true to update wrapped list; false
     * to only return the sorted list
     * @param {boolean=} ascending default is true
     * @param {string=} fieldName default is UPDATED_DATE
     * @return {Array} sorted list
     *
     */
  sortContentByTime(store = false, mostRecent = true, fieldName = null) {
    if (fieldName == null) { fieldName = XObjectProps.UPDATED_DATE; }
    const list = this.getList();
    Util.SortUniqueObjectsByLabel(list, fieldName);
    if (mostRecent === false) { list.reverse(); }
    return list;
  }

  /**
   * Return piggybacked XCommentStats objects if they were included
   * in the original server fetch.
   *
   * @param {*} defaultVal
   * @return {{string,XMCommentStats}}
   */
  getXCommentStatsMap(defaultVal = null) {
    return this.getAuxDataField(ModelType.COMMENT_STATS, defaultVal);
  }

  /**
   *
   * @param {string} commentId
   * @param {*} defaultVal
   * @return {XMCommentStat}
   */
  getXCommentStats(commentId, defaultVal = null) {
    const allStats = this.getXCommentStatsMap(null);
    const statsObj = allStats ? allStats[commentId] : null;
    return Util.NotNull(statsObj) ? XMCommentStats.WrapXObject(statsObj, XMCommentStats) : defaultVal;
  }

  /**
   * Return piggybacked XUserInfo objects if they were included
   * in the original server fetch
   *
   * @param {*} defaultVal
   * @return {{string:XUserInfo}}
   */
  getXUserInfoMap(defaultVal = null) {
    return this.getAuxDataField(ModelType.USER_INFO, defaultVal);
  }

  /**
   *
   * @param {string} userId
   * @param {*} defaultVal
   * @return {XUserInfo}
   */
  getXUserInfo(userId, defaultVal = null) {
    const userMap = this.getXUserInfoMap(null);
    const infoObj = userMap ? userMap[userId] : null;
    return Util.NotNull(infoObj) ? infoObj : defaultVal;
  }

  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return ModelType.COMMENT_FEED;
  }

  /**
     * Create new alert list container for serialization.
     *
     * @param {string} id optiona for identification purpose
     * @return {XUserAlerts}
     */
  static Create(id) {
    const list = new XCommentFeed();
    list.initNew();
    if (id) { list._setId(id); }

    return list;
  } // Create
} // class XCommentFeed

XCommentFeed.RegisterType(XCommentFeed);

export default XCommentFeed;
