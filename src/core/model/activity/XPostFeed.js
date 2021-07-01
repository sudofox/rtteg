import XMList from '../XMList';
import { ModelType, MessageProps, XObjectProps } from '../ModelConsts';
import XVarData from './XVarData';
import Util from '../../Util';
import XMPostItem from './XMPostItem';
import XObject from '../XObject';

const _CLSNAME = 'XPostFeed';

/**
 * Container holding a list of XMPostItem and
 * carry additional states.
 */

export class XPostFeed extends XMList {
  static get VARDATA() { return MessageProps.VARDATA; }
  static get SORTBY() { return MessageProps.SORTBY; }

  static get SORT_NEWEST() { return MessageProps.SORT_NEWEST; }
  static get SORT_OLDEST() { return MessageProps.SORT_OLDEST; }
  static get SORT_HOTEST() { return MessageProps.SORT_HOTEST; }
  static get SORT_LIKED() { return MessageProps.SORT_LIKED; }
  static get SORT_FOLLOWED() { return MessageProps.SORT_FOLLOWED; }

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XPostFeed;
  }

  /**
   * Track the variable data map that helps
   * fill the template in the alert messages.
   *
   * @param {XVarData} varData
   */
  setVarData(varData) {
    const json = XVarData.Unwrap(varData);
    this.set(XPostFeed.VARDATA, json);
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
    const jsonObj = this.get(XPostFeed.VARDATA, null);
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
    const jsonObj = this.get(XPostFeed.VARDATA, null);
    if (jsonObj == null) { return defaultVal; }
    return wrap ? XVarData.Wrap(jsonObj) : jsonObj;
  }

  /**
   * Append content from another XPostFeed object to this.
   *
   * @param {XPostFeed} xPostFeed
   * @param {boolean} clone true to add a cloned version. This is important
   * if you need to have a pointer back to this as the parent via setParent()
   * and not lose integrity of the iput object
   * @return {boolean} true if there are content to add, false if nothing added
   */
  addFromPostFeed(xPostFeed, clone = false) {
    const items = xPostFeed.getList(false);
    if (!items || items.length === 0) { return false; }
    this.addXPostItems(items);

    const varData = xPostFeed.get(XPostFeed.VARDATA, null);
    if (varData) {
      const thisVarData = this.get(XPostFeed.VARDATA, {});
      this.set(XPostFeed.VARDATA, { ...thisVarData, ...varData });
    }
    return true;
  }

  /**
   *
   * @param {XPostItem} postItem
   * @return {boolean} true if added
   */
  addXPostItem(postItem) {
    return this.addXObject(postItem);
  }

  /**
   * Add a post item (wrapped in XPostItem).
   *
   * @param {XPostItem} postItems
   */
  addXPostItems(postItems) {
    return this.addXItems(postItems);
  }


  /**
   * Return array of post item instances, with
   * option to track this container object as parent
   * and therefore can access the aux_data.
   *
   * @param {boolean} trackAuxData true to track
   * parent (this container)
   * @param {*} defaultVal if no content
   * @return {XMPostItem[]} item objects with
   * transient tracking to AuxData
   */
  getXPostItems(trackAuxData = false, defaultVal = null) {
    /** @type {XMPostItem[]} itemList */
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
   * @param {number} idx
   * @return {XPostItem}
   */
  getXPostItemAt(idx, defaultVal = null) {
    return super.getXItemAt(idx, defaultVal, ModelType.POST_ITEM);
  }

  /**
   * Return the IDs of all the posts that are referenced
   * by all XPostItem elements.
   *
   * @param {boolean} unique true to remove duplicates
   *
   * @return {string[]} list of post IDs
   */
  getPostIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const postIds = [];
    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const postId = XMPostItem.GetPostID(jsonPostItem);
      if (postId) { postIds.push(postId); }
    }
    return (unique === true) ? Util.UniqueArray(postIds) : postIds;
  }

  getOriginalPostIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const origPostIds = [];
    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const postId = XMPostItem.GetOriginalPostID(jsonPostItem);
      if (postId) { origPostIds.push(postId); }
    }
    return (unique === true) ? Util.UniqueArray(origPostIds) : origPostIds;
  }

  getSharedPostIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    let origPostIds = [];
    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const postId = XMPostItem.GetSharedPostIDs(jsonPostItem);
      if (postId) { origPostIds = origPostIds.concat(postId); }
    }
    return (unique === true) ? Util.UniqueArray(origPostIds) : origPostIds;
  }

  getFullPostIds() {
    let postIds = this.getPostIds(true);
    const origPostIds = this.getOriginalPostIds(true);
    const sharedPostIds = this.getSharedPostIds(true);
    postIds = postIds.concat(origPostIds, sharedPostIds);
    return Util.UniqueArray(postIds);
  }

  /**
   * Return the IDs of all the posts that are referenced
   * by all XPostItem elements.
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
      const userId1 = XMPostItem.GetPosterId(jsonPostItem);
      const userId2 = XMPostItem.GetPostOwnerId(jsonPostItem);
      if (userId1) { userIds.push(userId1); }
      if (userId2 && userId2 !== userId1) { userIds.push(userId2); }
    }
    return (unique === true) ? Util.UniqueArray(userIds) : userIds;
  }

  getOriginalPosterIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const origPosterIds = [];
    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const userId = XMPostItem.GetOriginalPostOwnerID(jsonPostItem);
      if (userId) { origPosterIds.push(userId); }
    }
    return (unique === true) ? Util.UniqueArray(origPosterIds) : origPosterIds;
  }

  getSharedPosterIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    let origPosterIds = [];
    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const userId = XMPostItem.GetSharedPosterIDs(jsonPostItem);
      if (userId) { origPosterIds = origPosterIds.concat(userId); }
    }
    return (unique === true) ? Util.UniqueArray(origPosterIds) : origPosterIds;
  }

  getFullPosterIds() {
    let userIds = this.getPosterIds(true);
    const origPostOwnerIds = this.getOriginalPosterIds(true); // load upfront - assuming we are including something
    const sharedPostOwnerIds = this.getSharedPosterIds(true); // load upfront - assuming we are including something
    userIds = userIds.concat(origPostOwnerIds, sharedPostOwnerIds);
    return Util.UniqueArray(userIds);
  }

  /**
   * Return the IDs of all the post stats (XPostStats) that are referenced
   * by all XPostItem elements. This is NOT that straight forward
   * as just use the post Ids, because many posts are SHARED of a
   * shared for original post. But only the original post's stats is
   * used for all SHARED posts.
   *
   * @param {boolean} unique true to remove duplicates
   *
   * @return {string[]} list of post IDs
   */
  getPostStatsIds(unique = false) {
    const jsonList = this.getList(false);
    const count = jsonList ? jsonList.length : 0;
    const statIds = [];
    for (let i = 0; i < count; i++) {
      const jsonPostItem = jsonList[i];
      const statId = XMPostItem.GetPostStatsID(jsonPostItem);
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
    if (fieldName == null) { fieldName = XObjectProps.CREATED_DATE; }
    let list = this.getList();
    list = Util.SortObjectsByLabel(list, fieldName);
    if (mostRecent === true) { list.reverse(); }
    if (store) {
      this.setList(list);
    }
    return list;
  }

  /**
   * Trim the content to the desired size and offset.
   * If offset is set high into
   *
   * @param {number} max maximum size
   * @param {number=} offset default to 0
   * @return {number} new size
   */
  trim(max, offset = 0) {

    let list = this.getList();
    const curSize = list ? list.length : 0;
    if (offset > curSize || offset < 0) {
      this.setList([]);
      return curSize;
    }

    const end = offset + max;
    if (end > curSize) {
      list = list.slice(offset);
    } else {
      list = list.slice(offset, max);
    }
    // console.log(`${_CLSNAME}.trim: original size: ${curSize}, new size: ${list.length}`);
    this.setList(list);
    return list.length;
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
    return ModelType.POST_FEED;
  }

  /**
   * Create new alert list container for serialization.
   *
   * @param {string} id optional for identification purpose
   * @param {XPostItems[]} xPostItems content, if available, to set
   * @return {XPostFeed}
   */
  static Create(id, xPostItems) {
    const list = new XPostFeed();
    list.initNew(false);
    if (id) {
      list._setId(id);
    }
    if (xPostItems) {
      list.addXPostItems(xPostItems);
    }

    return list;
  } // Create
} // class XPostFeed

XPostFeed.RegisterType(XPostFeed);

export default XPostFeed;
