
import XObject from './XObject';
import XACL from './XACL';
import XMCOD from '../XMCOD';
import TagUtil from '../util/TagUtil';

import ModelType, { XMObjectProps } from './ModelConsts';
import Util, { TimeUtil } from '../Util';

export const STATUS_NONE = 0;     // "clean" of any status
export const STATUS_NEW = 1;
export const STATUS_DIRTY = 2;

export const HDR_LAST_MODIFIED = 'updated';

export const PROP_FOLLOWING = 'following';
export const PROP_FOLLOWER = 'follower';

/**
 * Auxillary data label - mapping to filtered category data
 */

// export const OWNER_NICKNAME = "owner_nickname";

const _CLSNAME = 'XMObject'; // match class name
/**
 * eXtensible and managed object, which mean
 * it'll container ownership and storage information
 * for that user, and its content/data is JSON-based
 *
 * By virtue, this object is a "first class" entity,
 * meaning it is not contained but rather have its
 * own unique ID that can be used for retrieval.
 */
export default class XMObject extends XObject {

  // Property, Constants, and access selectors
  static get PROP_OWNERID() { return XMObjectProps.OWNERID; }
  static get PROP_ACL() { return XMObjectProps.ACL; }

  static get PROP_VTITLE() { return XMObjectProps.VERSION_TITLE; }
  static get PROP_VPREV() { return XMObjectProps.VERSION_PREV; }
  static get PROP_VNEXT() { return XMObjectProps.VERSION_NEXT; }
  static get PROP_VSTATUS() { return XMObjectProps.VERSION_STATUS; }

  static get PROP_TAGS() { return XMObjectProps.TAGS; }
  static get PROP_RELTAGS() { return XMObjectProps.RELTAGS; }
  static get PROP_SRCTAGS() { return XMObjectProps.SRCTAGS; }
  static get PROP_VAREXPRS() { return XMObjectProps.VAREXPRS; }


  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMObject;
    this.cod = null;        // need null instead of undefined
    if (this.mustHaveUpdatedTS()) {
      this._updatedNow(); // baseline last modified time
    }
  }

  /**
   * Init as new, which at this level it also mean
   * enabling tracking (XMCOD) with starting state
   * as STATUS_NEW
   *
   */
  initNew(tracking = true) {
    super.initNew();
    this.setCreatedTS();
    if (tracking === true) { this.enableTrackingNew(); }
  }

  /**
   * Enable tracking of status (NEW, DIRTY, etc)
   *
   * @param {string} status initial status
   */
  enableTracking(status = XMCOD.STATUS_NONE) {
    if (this.cod) { return false; }
    this.cod = new XMCOD(null, this, status);
    return true;
  }

  /**
   * Enable tracking this object as a new object
   * with STATUS_NEW
   */
  enableTrackingNew() {
    return this.enableTracking(XMCOD.STATUS_NEW);
  }

  /**
   * @return {boolean}
   */
  isTracked() {
    return Util.NotNull(this.cod);
  }

  /**
   * Return a Cached Object Descriptor (XMCOD), if this
   * instance is tracked by the cache (XMCache). If null, then
   * it's not tracked.
   *
   * @return {XMCOD}
   */
  _getCOD() {
    return this.cod;
  }

  /**
   *
   * @param {XMCOD} cod
   */
  _setCOD(cod) {
    this.cod = cod;
    return true;
  }
  _discardCOD() {
    if (this.cod) {
      this.cod = null;
      return true;
    }
    return false;
  }

  /**
   * @return {boolean}
   */
  isCached() {
    return Util.NotNull(this.cod);
  }
  _assertCached(method, msg, ...args) {
    this.assertNotNull(this.cod, method, msg, ...args);
  }

  /**
   * Set object's owner.
   *
   * @param {string} userId
   * @param {boolean} override
   */
  setOwnerId(userId, override = false) {
    const changed = this.getClass().SetOwnerId(this.getData(true), userId, override);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return owner's ID
   */
  getOwnerId(defaultVal = null) {
    return this.getClass().GetOwnerId(this.getData(), defaultVal);
  }

  /** @return {boolean} */
  hasOwner() {
    return Util.NotNull(this.getOwnerId(null));
  }

  /**
   * Set object's creator, which maybe different than owner.
   *
   * @param {string} userId
   * @param {boolean} override
   */
  setCreatorId(userId, override = false) {
    const changed = XMObject.SetCreatorId(this.getData(true), userId, override);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return creator's ID
   */
  getCreatorId(defaultVal = null) {
    return XMObject.GetCreatorId(this.getData(), defaultVal);
  }

  /** @return {boolean} */
  hasCreator() {
    return Util.NotNull(this.getCreatorId(null));
  }

  /**
   *
   * @return {string} previous Id, or null if none
   */
  clearCreatorId() {
    const data = this.getData(false);
    return data ? XMObject.ClearCreatorId(data) : null;
  }

  /**
   * Set based-on object's ID
   *
   * @param {string} sourceId
   * @param {boolean} override
   */
  setBasedOnId(sourceId, override = false) {
    const changed = this.getClass().SetBasedOnId(this.getData(true), sourceId, override);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return based-on source objectID
   *
   * @return {string}
   */
  getBasedOnId(defaultVal = null) {
    return this.getClass().GetBasedOnId(this.getData(), defaultVal);
  }

  /**
   *
   * @return {string} previous Id, or null if none
   */
  clearBasedOnId() {
    const data = this.getData(false);
    return data ? XMObject.ClearBasedOnId(data) : null;
  }


  // ---------------------- Version Support ----------------------

  /**
   * Set object's previous versio n's ID
   *
   * @param {string} prevId
   * @param {boolean} override
   */
  setPreviousVersion(prevId, override = false) {
    const changed = XMObject.SetPreviousVersion(this.getData(true), prevId, override);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return previous version's object ID, if any
   */
  getPreviousVersion(defaultVal = null) {
    const data = this.getData(false);
    return data ? XMObject.GetPreviousVersion(data, defaultVal) : defaultVal;
  }

  /**
   * @return {boolean} true if there is previous version (ID exist)
   */
  hasPreviousVersion() {
    return Util.NotNull(this.getPreviousVersion(null));
  }

  /**
   * Set object's next version's ID
   *
   * @param {string} prevId
   * @param {boolean} override
   */
  setNextVersion(prevId, override = false) {
    const changed = XMObject.SetNextVersion(this.getData(true), prevId, override);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   *
   * @return {boolean} true if there is previnextous version (ID exist)
   * @see ~isLatestVersion
   */
  hasNextVersion() {
    return Util.NotNull(this.getNextVersion(null));
  }

  /**
   * Determine if this object is a versioned object. By definition,
   * a versioned object is one that has either a reference to previous
   * version or new version
   *
   * @return {boolean}
   */
  isVersioned() {
    return this.hasPreviousVersion(false) || this.hasNextVersion(false);
  }

  /**
   * Return whether this instance is the latest version. This is true if
   * 1) there is no other versions, or 2) there is no next version.
   *
   * @return {boolean} true if there is no next version
   *
   * @see ~hasNextVersion
   */
  isLatestVersion() {
    return this.hasNextVersion();
  }

  /**
   * Return creation timestamp as a number (epoch)
   *
   * @param {*} defaultVal
   * @return {number} epoch time in milliseconds
   */
  getCreatedTS(defaultVal = -1) {
    const data = this.getData(false);
    return this.getClass().GetCreatedTS(data, defaultVal);
  }

  /**
   * Return creation timestamp as a Date object
   *
   * @param {*} defaultVal
   * @return {Date}
   */
  getCreatedDate(defaultVal = null) {
    const ts = this.getCreatedTS(-1);
    return (ts > 0) ? new Date(ts) : defaultVal;
  }

  /**
   * Return updated timestamp as a number (epoch)
   *
   * @param {*} defaultVal default value if no updated timestamp
   * @return {number} epoch time in millseconds
   */
  getUpdatedTS(defaultVal = -1) {
    const data = this.getData(false);
    let ts = this.getClass().GetUpdatedTS(data, null);
    if (ts == null) { ts = this.getClass().GetCreatedTS(data, defaultVal); }
    return ts;
  }

  /**
   * Return updated timestamp as a Date object
   *
   * @param {*} defaultVal
   * @return {Date}
   */
  getUpdatedDate(defaultVal = null) {
    const ts = this.getUpdatedTS(-1);
    return (ts > 0) ? new Date(ts) : defaultVal;
  }

  _enableACL(reset = false) {
    const data = this.getData(true);
    if (data[XMObject.PROP_ACL] == null || (reset === true)) { data[XMObject.PROP_ACL] = {}; }
    this.acl = XACL.Wrap(data[XMObject.PROP_ACL]);
  }

  /**
   * Unconditionall clear ACL content.
   */
  _clearACL() {
    this.acl = null;
    const data = this.getData(false);
    if (data && data[XMObject.PROP_ACL]) {
      data[XMObject.PROP_ACL] = {};
    }
  }

  hasACL() {
    const data = this.getData();
    return data ? (Util.NotNull(data[XMObject.PROP_ACL])) : false;
  }

  /**
   * Return the embedded XACL object.
   *
   * @param {boolean} create if doesn't exist
   * @return {XACL}
   */
  getACL(create = true) {
    if (this.acl == null) {
      const data = this.getData();
      if (Util.NotNull(data[XMObject.PROP_ACL])) { this.acl = XACL.Wrap(data[XMObject.PROP_ACL]); } else if (create) {
        this._enableACL();  // create acl object and store wrapped in this.acl
      }
    }
    return this.acl ? this.acl : null;
  }

  /**
   * Set to enable (or clear to disable) public READ access
   *
   * @param clear true to clear (disable). Default is to set (enable)
   * @return {boolean} true if set, false if not set which can mean already
   * same permission
   *
   * @see #clearPublicREAD
   * @see #checkPublicREAD
   */
  setPublicREAD(clear = false) {
    const acl = this.getACL(true);
    // this.assertNotNull(acl, "setPublicREAD", "ACL Not enabled");
    const setStatus = acl.setPublicREAD(clear);
    if (setStatus) { this.setDirty(); }
    return setStatus;
  }

  /**
   * Clear public read status
   *
   * @return {bolean} treu if cleared
   */
  clearPublicREAD() {
    return this.setPublicREAD(true);
  }

  /**
   * Return whether this resource is has public READ permission,
   * which means it can be shared publicly.
   *
   * @return {boolean} true if public READ is enabled
   * @see #setPublicREAD
   */
  checkPublicREAD() {
    const acl = this.getACL(false);
    if (acl == null) { return false; }
    return acl.checkPublicREAD();
  }

  /**
   * Return whether the object has visibility scope of public (VISTYPE_PUBLIC)
   * and use ACL as backup if not defined. This overrides parent XObject's
   * method.
   *
   * @param {boolean} checkACL if no visibility flag available, check ACL
   * for public READ flag to determine.
   * @return {boolean} true if object has public visibility as scope, or has
   * ACL public READ
   *
   */
  isPublicVisible(checkACL = true) {
    let verdict = super.isPublicVisible(checkACL, null);

    if (verdict == null && checkACL) { verdict = this.checkPublicREAD(); }

    return verdict;
  }

  /**
   * Create a JSON header containing information about
   * this instance. The data portion is not included but
   * should be added to property "data" from methods such
   * as "toJSON()"
   * This method can be overriden by subclass but should
   * call this parent method first and add to the returned
   * object.
   * @return JSON object containing relevant header info
   */
  // _headerToJSON() {
  //     let hdr = {
  //     }

  //     hdr[XMObject.PROP_TYPE] = this.getClassname();
  //     if (this.tags)
  //         hdr[XMObject.PROP_TAGS] = this.tags;
  //     hdr[HDR_LAST_MODIFIED] = this._lastUpdated;

  //     return hdr;
  // }
  // _headerFromJSON(xmObject) {
  //     if (xmObject[PROP_TYPE])
  //         this.classname = xmObject[PROP_TYPE];

  //     if (xmObject[XMObject.PROP_TAGS])
  //         this.catIds = xmObject[XMObject.PROP_TAGS];

  //     if (xmObject[HDR_LAST_MODIFIED])
  //         this._lastUpdated = xmObject[HDR_LAST_MODIFIED];
  // }
  _updatedNow() {
    if (this._cacheStatus !== STATUS_NEW) {
      this._lastUpdated = Date.now();
      this.getClass().SetUpdatedTS(this.getData(), this._lastUpdated);
    }
  }

  /**
   * Update edited/updated timestamps as well as optionally mark
   * object as dirty, if object is not new.
   *
   * @param {boolean} markDirty true to also mark object as "dirty"\
   * @return {boolean} true if new timestamp added (only if not new)
   */
  _editedNow(markDirty = false) {
    let verdict = false;
    if (this._cacheStatus !== STATUS_NEW) {
      this._lastUpdated = Date.now();
      this.getClass().SetEditedTS(this.getData(), this._lastUpdated);
      this.getClass().SetUpdatedTS(this.getData(), this._lastUpdated);
      if (markDirty) { this.setDirty(); }
      verdict = true;
    }
    return verdict;
  }

  /**
   * Set this object as a new object, which adds a
   * created timestamp. If the object is enabled for
   * tracking, then it'll be set as new too.
   *
   * @see ~isNew()
   */
  _setNew() {
    this.setCreatedTS();
    if (this.cod) {
      this.cod.setNew();
    }
    return true;
  }

  _clearStatus() {
    if (this.cod) { this.cod.clearStatus(); }
  }

  /**
   * Check on the status if the object is marked as STATUS_NEW
   *
   * @return {boolean} true if new
   *
   * @see ~_setNew()
   * @see ~isDirty()
   * @see ~isModified()
   * @see ~isClean()
   * @see ~isDeleted()
   */
  isNew() {
    return (this.cod) ? this.cod.isNew() : null;
  }

  /**
   * Create a snapshot of the current data wrapped
   * by this class. If the object has NEW status,
   * it won't create snapshot either.
   *
   * @param {boolean} override true to allow override existing.
   * @return {boolean} true if created, faslse if existing and
   * no override, or new (if XMObject)
   *
   * @see #getSnapshot
   * @see #clearSnapshot
   * @see #getDelta
   */
  createSnapshot(override = true) {
    if (this.isNew()) { return false; }

    return super.createSnapshot(override);
  } // createSnapshot


  // ------------------- Main Tag functions ---------------------

  /**
   * Add a tag to this object. A tag is a string that is
   * treated like a keyword, but may have meta definition
   * associated with it (Category)
   *
   * @param {string} tag name
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  addTag(tag) {
    const added = XMObject.AddTag(this.getData(true), tag);
    if (added) { this.setDirty(); }
    return added;
  }

  /**
   * Add multiple tags to this object.
   *
   * @param {[]} tagArray
   * @return {number} actual number of tags added
   *
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  addTags(tagArray) {
    const added = XMObject.AddTags(this.getData(true), tagArray);
    if (added > 0) { this.setDirty(); }
    return added;
  }

  /**
   * Set given tags and OVERRIDE all previous tags
   *
   * @param {[]} tagArray
   * @return {boolean} true if tags set and override previous.
   * False if input is null or array content are the same
   *
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  setTags(tagArray) {
    const changed = XMObject.SetTags(this.getData(true), tagArray);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return all tags associated with this object
   *
   * @param {*} defaultVal
   * @see #addTag
   * @see #hasTag
   * @see #countTags
   */
  getTags(defaultVal = null) {
    const data = this.getData(false);
    const result = data ? XMObject.GetTags(data, defaultVal) : defaultVal;
    return result;
  }

  /**
   * Return tags matched by given relname
   *
   * @param {[]} tags can be array or set
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  getTagsByRel(relname, defaultVal = {}) {
    const data = this.getData(false);
    return data ? XMObject.GetTagsByRel(data, relname, defaultVal) : defaultVal;
  }

  /**
   * Return all tags grouped by their rel type.
   *
   * @param {boolean} parseProps true to parse props to JSON, false to keep as string
   * @param {string} defaultRel relationship (key) name to use to group
   */
  getTagsGroupedByRel(parseProps = false, defaultVal = {}) {
    const data = this.getData(false);
    return XMObject.GetTagsGroupedByRel(data, parseProps);
  }

  /**
   * Check if the given tag name exists in the (keyword) tag list.
   *
   * NOTE: this is currently case sensitive.
   *
   * @param {string} tag
   * @param {boolean} simpleCheck true to use array indexOf. No normalizing input or
   * strip any expressions
   * @return {boolean}
   * @see #addTag
   * @see #getTags
   * @see #countTags
   */
  hasTag(tag, simpleCheck = false) {
    const data = this.getData(false);
    return data ? XMObject.HasTag(data, tag, simpleCheck) : false;
  }

  /**
   * Does this object have a tag with the given relname?
   *
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} true if found, false if not
   */
  hasTagByRel(relname = null) {
    const data = this.getData(false);
    return data ? XMObject.HasTagByRel(data, relname) : false;
  }

  /**
   * Return index position in the tag array of the first tag that matches the relname
   *
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  // indexOfTagByRel(relname=null) {
  //     let data = this.getData(false);
  //     return data ? XMObject.IndexOfTagByRel(data, relname) : -1;
  // }

  /**
   * Return index position in the tag array of the first tag that matches the relname
   *
   * @param {string} nameCheck tagname to check. It will be normalized
   *
   * @return {number} -1 if not found, positive number for array index
   */
  indexOfTagname(nameCheck) {
    const data = this.getData(false);
    return data ? XMObject.IndexOfTagname(data, nameCheck) : false;
  }

  /**
   * Remove existing tag from this object
   *
   * @return {boolean} true if removed
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   */
  removeTag(tag) {
    const content = this.getData(false);
    if (content == null) { return false; }
    const removed = XMObject.RemoveTag(content, tag);
    if (removed) { this.setDirty(); }
    return removed;
  }  // removeTag

  /**
   * Report number of tags associated with this object via
   * the PROP_TAGS.
   *
   * @return {number}
   */
  countTags() {
    const content = this.getData(false);
    if (content == null) { return false; }
    return XMObject.CountTags(content);
  }

  // ------------------- Variable Expression functions -----------------------
  /**
   * Add a variable expression string
   *
   * @param {string} varExpr in form of var:{props}
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  addVarExpr(varExpr) {
    const added = XMObject.AddVarExpr(this.getData(true), varExpr);
    if (added) { this.setDirty(); }
    return added;
  }

  /**
   * Add multiple tags to this object.
   *
   * @param {[]} varExprs
   * @return {number} actual number of expr strings added
   *
   */
  addVarExprs(varExprs) {
    const added = XMObject.AddVarExprs(this.getData(true), varExprs);
    if (added > 0) { this.setDirty(); }
    return added;
  }

  /**
   * Set given array of variable expression string
   *
   * @param {string[]} varExprs array of variable expression strings
   * @return {boolean} true if tags set and override previous.
   * False if input is null or array content are the same

   */
  setVarExprs(varExprs) {
    const changed = XMObject.SetVarExprs(this.getData(true), varExprs);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return all variable expression strings
   *
   * @param {*} defaultVal
   */
  getVarExprs(defaultVal = null) {
    const data = this.getData(false);
    const result = data ? XMObject.GetVarExprs(data, defaultVal) : defaultVal;
    return result;
  }

  /**
   * Check if the given tag name exists in the (keyword) tag list.
   *
   * NOTE: this is currently case sensitive.
   *
   * @param {string} varname variable name
   * @return {string} variable expression string if found
   */
  getVarExpr(varname, defaultVal = null) {
    const data = this.getData(false);
    return data ? XMObject.GetVarExpr(data, varname, defaultVal) : defaultVal;
  }

  /**
   * Check if the given tag name exists in the (keyword) tag list.
   *
   * NOTE: this is currently case sensitive.
   *
   * @param {string} varname variable name
   * @return {boolean} true if found
   */
  hasVarExpr(varname) {
    const data = this.getData(false);
    return data ? XMObject.HasVarExpr(data, varname) : false;
  }

  /**
   * Remove existing tag from this object
   *
   * @return {boolean} true if removed
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   */
  removeVarExpr(varname) {
    const data = this.getData(false);
    if (data == null) { return false; }
    const removed = XMObject.RemoveVarExpr(data, varname);
    if (removed) { this.setDirty(); }
    return removed;
  }  // removeTag

  /**
   * Report number of tags associated with this object via
   * the PROP_TAGS.
   *
   * @return {number}
   */
  countVarExprs() {
    const data = this.getData(false);
    if (data == null) { return false; }
    return XMObject.CountVarExprs(data);
  }

  // ---------------- Relationship Tag functions -------------------

  /**
   * Add a relationship ag to this object. A tag is a string that is
   * treated like a keyword, but may have meta definition
   * associated with it (Category)
   *
   * @param {string} tag name
   * @param {string} relname relationship group to add to. If
   * null, then will extract from the inline props
   * @see #getRelTags
   * @see #hasrelTag
   * @see #removerelTag
   */
  addRelTag(tag, relname = null) {
    const added = XMObject.AddRelTag(this.getData(true), tag, relname);
    if (added) { this.setDirty(); }
    return added;
  }

  /**
   * Add multiple rel tags to this object.
   *
   * @param {[]} tagArray
   * @param {string} relname relationship group to add to. If
   * null, then will extract from the inline props
   * @return {number} actual number of tags added
   *
   * @see #addRelTag
   * @see #getRelTags
   * @see #hasRelTag
   * @see #removeRelTag
   */
  addRelTags(tagArray, relname = null) {
    const added = XMObject.AddRelTags(this.getData(true), tagArray, relname);
    if (added > 0) { this.setDirty(); }
    return added;
  }

  /**
   * Set given rel tags and OVERRIDE all previous tags
   *
   * @param {[]} tagArray
   * @param {string} relname relationship group
   * @return {boolean} true if tags set and override previous.
   * False if input is null or array content are the same
   *
   * @see #addRelTag
   * @see #getRelTags
   * @see #hasRelTag
   * @see #removeRelTag
   */
  setRelTags(tagArray, relname) {
    const changed = XMObject.SetRelTags(this.getData(true), tagArray, relname);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return the requested tagname from the specified rel label. While this
   * sounds stupid, the stored tagname may have inline properties that
   * the requester doesn't have.
   *
   * @param {string} relname relationship label
   * @param {string} tagname tagname. If there is inline property, that will be stripped
   * before comparing.
   *
   * @param {*} defaultVal
   * @see #addRelTag
   * @see #hasRelTag
   * @see #countRelTags
   */
  getRelTag(tagname, relname = null, defaultVal = null) {
    const data = this.getData(false);
    return data ? XMObject.GetRelTag(data, tagname, relname, defaultVal) : defaultVal;
  }

  /**
   * Return all rel tags associated with this object
   *
   * @param {string} relname relationship label
   * @param {*} defaultVal
   * @see ~getRelTag
   * @see #addRelTag
   * @see #hasRelTag
   * @see #countRelTags
   */
  getRelTags(relname, defaultVal = null) {
    const data = this.getData(false);
    return (Util.NotNull(data)) ? XMObject.GetRelTags(data, relname, defaultVal) : defaultVal;
  }

  /**
   * Count number of tags under the relationship label
   *
   * @param {string} relname
   * @return {number} number of tags.
   */
  getRelTagCount(relname) {
    const data = this.getData(false);
    return data ? XMObject.GetRelTagCount(data, relname) : 0;
  }


  /**
   * Check if the given source tag name exists in the (keyword) tag list.
   *
   * NOTE: this is currently case sensitive.
   *
   * @param {string} tagname
   * @return {boolean}
   * @see #addRelTag
   * @see #getRelTags
   * @see #countRelTags
   */
  hasRelTag(tagname, relname = null) {
    const data = this.getData(false);
    return data ? XMObject.HasRelTag(data, tagname, relname) : false;
  }

  /**
   * Return the map containing the rel tag groups
   *
   * @param {*} defaultVal
   */
  getRelTagMap(defaultVal = null) {
    const data = this.getData(false);
    return (Util.NotNull(data)) ? XMObject.GetRelTagMap(data, defaultVal) : defaultVal;
  }

  /**
   * Retrieve a rel tag map. If one doesn't exist, create one inside this
   * object (and mark the object dirty).
   *
   */
  modifyRelTagMap() {
    const data = this.getData(true);
    let relMap = XMObject.GetRelTagMap(data, null);
    if (relMap == null) {
      relMap = {};
      const verdict = XMObject.SetRelTagMap(data, relMap);
      if (verdict === true) { this.setDirty(); }
    }
    return relMap;
  } // modifyRelTagMap

  /**
   * Set the entire rel tag map into this object.
   *
   * @param {{}} relMap
   * @return {boolean} false to indicate null input. true if set
   */
  setRelTagMap(relMap) {
    if (relMap == null) { return null; }
    const verdict = XMObject.SetRelTagMap(this.getData(true), relMap);
    if (verdict === true) { this.setDirty(); }
    return verdict;
  }  // setRelTagMap

  /**
   * Does this object have a rel tag with the given value for "rel" prop?
   *
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} true if found, false if not
   */
  // hasRelTagByRel(relname=null) {
  //     let data = this.getData(false);
  //     return data ? XMObject.HasRelTagByRel(data, relname) : false;
  // }

  /**
   * Return index position in the src tag array of the first tag that matches the relname
   *
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  // indexOfRelTagByRel(relname=null) {
  //     let data = this.getData(false);
  //     return data ? XMObject.IndexOfRelTagByRel(data, relname) : -1;
  // }

  /**
   * Return index position in the src tag array of the first tag that matches the relname
   *
   * @param {string} nameCheck tagname to check. It will be normalized
   *
   * @return {number} -1 if not found, positive number for array index
   */
  indexOfRelTagname(nameCheck) {
    const data = this.getData(false);
    return data ? XMObject.IndexOfRelTagname(data, nameCheck) : false;
  }

  /**
   * Remove existing rel tag from this object
   *
   * @param {string} tag
   * @param {relname} relname
   * @return {boolean} true if removed
   * @see #addRelTag
   * @see #getRelTags
   * @see #hasRelTag
   */
  removeRelTag(tag, relname) {
    const content = this.getData(false);
    if (content == null) { return false; }
    const removed = XMObject.RemoveRelTag(content, tag, relname);
    if (removed) { this.setDirty(); }
    return removed;
  }  // removeRelTag

  /**
   * Report number of tags associated with this object via
   * the PROP_SRCTAGS.
   *
   * @return {number}
   */
  countRelTags() {
    const content = this.getData(false);
    if (content == null) { return false; }
    return XMObject.CountRelTags(content);
  }


  // --------------- Tag info map in AuxData -------------------

  /**
   * Return tag map auxillary data, if loaded into this object
   *
   * @param {*} defaultVal
   */
  getTagMap(defaultVal = null) {
    const auxData = this.getAuxData(false);
    const tagMap = auxData ? auxData[XObject.AUX_TAGMAP] : null;
    return tagMap || defaultVal;
  }

  /**
   * Track the given tag map (catmap).
   *
   * @param {{}} tagMap
   * @return {{}} previously tracked tagMap if any
   */
  setTagMap(tagMap) {
    const auxData = this.getAuxData(true);
    const prevMap = auxData[XObject.AUX_TAGMAP];
    auxData[XObject.AUX_TAGMAP] = tagMap;
    return prevMap;
  }

  // ------------------- Source Tag functions ---------------------

  /**
   * Add a source ag to this object. A tag is a string that is
   * treated like a keyword, but may have meta definition
   * associated with it (Category)
   *
   * @param {string} tag name
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  addSourceTag(tag) {
    const added = XMObject.AddSourceTag(this.getData(true), tag);
    if (added) { this.setDirty(); }
    return added;
  }

  /**
   * Add multiple source tags to this object.
   *
   * @param {[]} tagArray
   * @return {number} actual number of tags added
   *
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  addSourceTags(tagArray) {
    const added = XMObject.AddSourceTags(this.getData(true), tagArray);
    if (added > 0) { this.setDirty(); }
    return added;
  }

  /**
   * Set given source tags and OVERRIDE all previous tags
   *
   * @param {[]} tagArray
   * @return {boolean} true if tags set and override previous.
   * False if input is null or array content are the same
   *
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   * @see #removeTag
   */
  setSourceTags(tagArray) {
    const changed = XMObject.SetSourceTags(this.getData(true), tagArray);
    if (changed) { this.setDirty(); }
    return changed;
  }

  /**
   * Return all source tags associated with this object
   *
   * @param {*} defaultVal
   * @see #addTag
   * @see #hasTag
   * @see #countTags
   */
  getSourceTags(defaultVal = null) {
    const data = this.getData(false);
    const result = data ? XMObject.GetSourceTags(data, defaultVal) : defaultVal;
    return result;
  }

  /**
   * Return source tags matched by given relname
   *
   * @param {[]} tags can be array or set
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  getSourceTagsByRel(relname, defaultVal = {}) {
    const data = this.getData(false);
    return data ? XMObject.GetSourceTagsByRel(data, relname, defaultVal) : defaultVal;
  }

  /**
   * Return all source tags grouped by their rel type.
   *
   * @param {boolean} parseProps true to parse props to JSON, false to keep as string
   * @param {string} defaultRel relationship (key) name to use to group
   */
  getSourceTagsGroupedByRel(parseProps = false, defaultVal = {}) {
    const data = this.getData(false);
    return XMObject.GetSourceTagsGroupedByRel(data, parseProps);
  }

  /**
   * Check if the given source tag name exists in the (keyword) tag list.
   *
   * NOTE: this is currently case sensitive.
   *
   * @return {boolean}
   * @see #addTag
   * @see #getTags
   * @see #countTags
   */
  hasSourceTag(tag) {
    const data = this.getData(false);
    return data ? XMObject.HasSourceTag(data, tag) : false;
  }

  /**
   * Does this object have a source tag with the given relname?
   *
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} true if found, false if not
   */
  hasSourceTagByRel(relname = null) {
    const data = this.getData(false);
    return data ? XMObject.HasSourceTagByRel(data, relname) : false;
  }

  /**
   * Return index position in the src tag array of the first tag that matches the relname
   *
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  indexOfSourceTagByRel(relname = null) {
    const data = this.getData(false);
    return data ? XMObject.IndexOfSourceTagByRel(data, relname) : -1;
  }

  /**
   * Return index position in the src tag array of the first tag that matches the relname
   *
   * @param {string} nameCheck tagname to check. It will be normalized
   *
   * @return {number} -1 if not found, positive number for array index
   */
  indexOfSourceTagname(nameCheck) {
    const data = this.getData(false);
    return data ? XMObject.IndexOfSourceTagname(data, nameCheck) : false;
  }

  /**
   * Remove existing source tag from this object
   *
   * @return {boolean} true if removed
   * @see #addTag
   * @see #getTags
   * @see #hasTag
   */
  removeSourceTag(tag) {
    const content = this.getData(false);
    if (content == null) { return false; }
    const removed = XMObject.RemoveSourceTag(content, tag);
    if (removed) { this.setDirty(); }
    return removed;
  }  // removeSourceTag

  /**
   * Report number of tags associated with this object via
   * the PROP_SRCTAGS.
   *
   * @return {number}
   */
  countSourceTags() {
    const content = this.getData(false);
    if (content == null) { return false; }
    return XMObject.CountSourceTags(content);
  }

  // **************************** Version Support ************************************


  /**
   * Get previous version's object ID, if it exists.
   *
   * @param {*} defaultVal if no value exists, then return this
   * @return {string} previous version's object ID
   *
   * @see ~setNextVersion
   * @see ~getPreviousVersion
   */
  getNextVersion(defaultVal = null) {
    return XMObject.GetNextVersion(this.getData(false), defaultVal);
  }

  /**
   * Create a new version of the given object. The new version will
   * have newly generated unique ID, using now as CREATED_DATE, and clear
   * all other timestamps. It's VERSION_PREVIOUS property will point
   * back to the given object. The given object's VERSION_NEXT will also
   * point to the newly created object.
   *
   * @param {boolean} restoreSnapshot if ture, will check if the
   * given object has a snapshot and will restore it before setting it's
   * VERSION_NEXT property to point to the newly created object
   * @param {boolean} cloneAux if there us AUX_DATA, then also copy that
   * if this value is true (default)
   *
   * @return {XMObject} new cloned instance with new ID, createTS, and
   * points back to given object as previous version. Existing input
   * object is also modified (and snapshot restored if desired)
   */
  createNewVersion(restoreSnapshot = true, cloneAux = true) {
    return XMObject.CreateNewVersion(this, restoreSnapshot, cloneAux);
  }

  // **************************** Change Tracking ************************************

  /**
   * Mark this object as dirty if it's been tracked.
   * If object is already dirty or new, then it will
   * not be marked.
   *
   * @return {boolean}
   *
   * @see #enableTracking
   * @see #isDirty
   * @see #clearDirty
   *
   */
  setDirty() {
    if (this.cod) {
      const result = this.cod.setDirty();
      // this._editedNow();
      return result;
    }
    return false;
  }

  /**
   * Add/update the edited timestamp. This timestamp is meant to
   * be to track real "human" edits. Any other changes will
   * cause updatedTS to change.
   *
   * @param {boolean} markDirty true to mark object as dirty
   * @return {boolean} true if actually modifiy the timestamp. False
   * if no modification is done for any reason
   */
  setEdited(markDirty = false) {
    return this._editedNow(markDirty);
  }

  /**
   * Clear dirty or new flag, if set
   *
   * @return {boolean} true if cleared
   *
   * @see #enableTracking
   * @see #isDirty
   * @see #setDirty
   * @return {boolean} true if cleared from dirty or new status
   */
  clearDirty() {
    if (this.cod) {
      return this.cod.clearDirty();
    }
    return false;
  }

  /**
   * Check if this object has been marked dirty.
   *
   * @return {boolean} true if marked dirty
   *
   * @see #enableTracking
   * @see #setDirty
   * @see #clearDirty
   * @see #isClean
   */
  isDirty() {
    return (this.cod) ? this.cod.isDirty() : null;
  }

  /**
   * Check if the object is either dirty or new.
   *
   * @return {boolean} true if status is either
   * STATUS_DIRTY or STATUS_NEW
   *
   * @see ~isNew()
   * @see ~isDirty()
   */
  isModified() {
    return (this.cod) ? this.cod.isModified() : null;
  }

  clearModified() {
    return (this.cod) ? this.cod.clearModified() : false;
  }

  /**
   * Check if the object is "clean", meaning it's not
   * new or marked as dirty or deleted.
   *
   * @return {boolean} true if clean status
   *
   * @see ~isNew()
   * @see ~isDirty()
   * @see ~isModified()
   */
  isClean() {
    return (this.cod) ? this.cod.isClean() : null;
  }

  /**
   * Set the object as deleted
   *
   * @return {true} if marked successfully
   *
   * @see #isDeleted
   */
  setDeleted() {
    if (this.cod) {
      const result = this.cod.setDeleted();
      this._updatedNow();
      return result;
    }
    return false;
  }

  /**
   * Check if the object is marked for deletion.
   *
   * @return {true} if marked as deleted
   *
   * @see #setDeleted
   */
  isDeleted() {
    return (this.cod) ? this.cod.isDeleted() : null;
  }

  /**
   * Return a fully qualified title, which for now
   * consists of title itself and append a version
   * title if exists.
   *
   * @param {boolean=} useTS true to render timestamp of
   * published time and then updated time as version.
   * @param {*} defaultVal
   * @return {string} title with version label or timestamp
   */
  getFQTitle(useTS = true, defaultVal = null) {
    const ttl = this.getTitle(null);
    if (ttl == null) { return defaultVal; }
    const vttl = this.getVersionTitle(useTS, null);
    return vttl ? `${ttl} - ${vttl}` : ttl;
  }

  /**
   * Return/derive the version title
   *
   * @param {boolean=} useTS true to render timestamp of
   * published time and then updated time as version.
   * @param {*} defaultVal
   * @return {string} version title string
   */
  deriveVersionTitle(useTS = true, defaultVal = null) {
    let text = this.getVersionTitle(null);
    if (text == null) {
      let ts = this.getPublishedTS();
      if (ts == null) { ts = this.getUpdatedTS(); }
      if (ts) { text = TimeUtil.Ts2MMDDYYYY(ts); }
    }
    return text || defaultVal;
  }

  /**
   * Return the version title as is
   *
   * @param {*} defaultVal
   *
   * @see ~deriveVersionTitle
   */
  getVersionTitle(defaultVal = null) {
    return this.get(XMObject.PROP_VTITLE, defaultVal);
  }

  /**
   * Report on if the version title has changed against the
   * snapshot.
   *
   * @return {boolean} true if version title is different from
   * the snapshot. False if not or there is no snapshot.
   *
   * @see XObject~changedFromSnapshot
   */
  versionTitleChanged() {
    return this.changedFromSnapshot(XMObject.PROP_VTITLE);
  }

  setVersionTitle(vtitle) {
    this.set(XMObject.PROP_VTITLE, vtitle);
  }


  // toJSON() {
  //     let jsonObj = this._headerToJSON();
  //     jsonObj["data"] = this.getData();
  //     return jsonObj;
  // }

  // fromJSON(jsonObj) {
  //     this._headerFromJSON(jsonObj);
  //     if (jsonObj.data)
  //         this.data = jsonObj.data;
  // }

  /**
   * Return the assigned folder name associated with this instance's
   * class.
   * @return {string} folder name
   */
  getFolderName() {
    return this.getClass().GetFolderName();
  }


  // *************************************************************
  //
  // Class methods. Any methods that can be used as helper
  // for generic JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************

  /**
   * Return the default folder/table/collection name used
   * for storage. This must be overriden by subclasses.
   */
  static GetFolderName() {
    return ModelType.XMOBJECT;
  }

  /**
   * Convenient method to check if the given object
   * is an instance of this class (XMObject)
   */
  static IsInstance(obj) {
    return obj instanceof XMObject;
  }

  /**
   * Self type identification - needed for registration.
   * Each of the subclass need to define this in order
   * to support reconstruction of the same class
   * after serialization.
   */
  static GetTypeID() {
    return ModelType.XMOBJECT;
  }

  /**
   * Assert if given object is an "instanceof" XMObject class and dump
   * stack if failed check.
   *
   * @param {*} object any value to check against XMObject class
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertXMObject(object, classname, method, msg, ...args) {
    if (XMObject.IsInstance(object)) { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  static WrapXMObject(jsonRec, ClsType = XMObject) {
    const item = new ClsType();
    // Just in case the object is wrapped via
    // XMObject.toJSON(). This is a HACK as we
    // should rely on the "type" property at the top level.
    if (jsonRec && jsonRec.hasOwnProperty(XMObject.MAIN_DATA)) { item.setData(jsonRec.data); } else { item.setData(jsonRec); }
    return item;
  }

  /**
   * Simple utility method to create a new instance
   * and initially set an unique identifier and
   * optionally wrap a json object.
   *
   * @param {string} id
   * @param {string} type since XObject has no type,
   * this is important to specify (no guarantee it'll
   * work completely)
   * @param {{}} jsonData
   * @return {XMObject}
   */
  static CreateNew(id, jsonData = null) {
    const newObj = new XMObject();
    newObj.initNew();
    if (id) { newObj._setId(id); }
    if (jsonData) { newObj.setData(jsonData); }

    return newObj;
  }


  static GetBackgroundImageUrl(jsonObj, defaultVal = null) {
    const val = jsonObj[XMObject.PROP_BGIMAGE_URL];
    return val || defaultVal;
  }

  /**
   * Return the version title from the json object
   *
   * @param {*} defaultVal
   *
   */
  static GetVersionTitle(jsonObj, defaultVal = null) {
    return XMObject.GetObjectField(jsonObj, [XMObject.PROP_VTITLE], defaultVal);
  }


  /**
   * Return the type string for the given class instance.
   *
   * @param {XMClass} clsObj
   */
  static GetTypeFromClass(clsObj) {
    if (clsObj.GetTypeID) { return clsObj.GetTypeID(); }

    console.log(`${_CLSNAME}.GetTypeFromClass:`, clsObj);
    const inst = clsObj();
    if (inst.getType) { return inst.getType(); }

    return '_UNK_';
  }

  /**
   * Set/change owner Id of the given object
   *
   * @param {{}} jsonObj
   * @param {string} userId
   * @param {boolean} override
   */
  static SetOwnerId(jsonObj, userId, override = false) {
    const _m = `${_CLSNAME}.SetOwnerId(${userId})`;
    jsonObj = XMObject.Unwrap(jsonObj);
    const existingId = jsonObj[XMObjectProps.OWNERID];
    if (!Util.StringIsEmpty(existingId)) {
      if (existingId !== userId) {
        if (override !== true) {
          console.error(`${_m}: already has an owner ID: ${existingId}`);
          return false;
        }
        // override falls through
      } else {
        // console.warn(`${_m}: Setting same owner ID again: ${userId}`);
        return false;
      }
    }
    jsonObj[XMObjectProps.OWNERID] = userId;
    return true;
  } // SetOwnerId

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} owner Id
   */
  static GetOwnerId(jsonObj, defaultVal = null) {
    if (jsonObj === null) { return defaultVal; }
    const ownerId = jsonObj[XMObjectProps.OWNERID];
    return ownerId || defaultVal;
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} previous owner Id
   */
  static ClearOwnerId(jsonObj, defaultVal = null) {
    const prevId = jsonObj[XMObjectProps.OWNERID];
    jsonObj = XMObject.Unwrap(jsonObj);
    jsonObj[XMObjectProps.OWNERID] = null;    // null instead of delete
    return prevId;
  }

  /**
   * Set/change creator Id of the given object
   *
   * @param {{}} jsonObj
   * @param {string} userId
   * @param {boolean} override
   */
  static SetCreatorId(jsonObj, userId, override = false) {
    const _m = `${_CLSNAME}.SetCreatorId(${userId})`;
    jsonObj = XMObject.Unwrap(jsonObj);
    const existingId = jsonObj[XMObjectProps.CREATORID];
    if (!Util.StringIsEmpty(existingId)) {
      if (existingId !== userId) {
        if (override !== true) {
          console.error(`${_m}: already has a creator ID: ${existingId}`);
          return false;
        }
        // override falls through
      } else {
        // console.log(`${_m}: Setting same creator ID again: ${userId}`);
        return false;
      }
    }
    jsonObj[XMObjectProps.CREATORID] = userId;
    return true;
  } // SetCreatorId

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} owner Id
   */
  static GetCreatorId(jsonObj, defaultVal = null) {
    if (jsonObj == null) { return defaultVal; }
    const ownerId = jsonObj[XMObjectProps.CREATORID];
    return ownerId || defaultVal;
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} previous creator Id
   */
  static ClearCreatorId(jsonObj) {
    const prevId = jsonObj[XMObjectProps.CREATORID];
    jsonObj = XMObject.Unwrap(jsonObj);
    XMObject.ClearObjectField(jsonObj, XMObjectProps.CREATORID);
    return prevId;
  }

  /**
   * Set/change based-on source ID
   *
   * @param {{}} jsonObj
   * @param {string} sourceId
   * @param {boolean} override
   */
  static SetBasedOnId(jsonObj, sourceId, override = false) {
    // const _m = `${_CLSNAME}.SetBasedOnId(${sourceId})`;
    jsonObj = XMObject.Unwrap(jsonObj);
    // let existingId = jsonObj[XMObjectProps.CREATORID];
    jsonObj[XMObjectProps.BASED_ON] = sourceId;
    return true;
  } // SetBasedOnId

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} source object's ID
   */
  static GetBasedOnId(jsonObj, defaultVal = null) {
    if (jsonObj == null) { return defaultVal; }
    const ownerId = jsonObj[XMObjectProps.BASED_ON];
    return ownerId || defaultVal;
  }


  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string} previous source ID
   */
  static ClearBasedOnId(jsonObj) {
    const prevId = jsonObj[XMObjectProps.BASED_ON];
    jsonObj = XMObject.Unwrap(jsonObj);
    jsonObj[XMObjectProps.BASED_ON] = null;    // null instead of delete
    return prevId;
  }


  /**
   * Set/change ID of the previous object version
   *
   * @param {{}} jsonObj
   * @param {string} objectId ID of the previous version
   * @param {boolean} override true to override existing value
   * @return {boolean} true if set
   *
   * @see ~GetPreviousVersion
   */
  static SetPreviousVersion(jsonObj, objectId, override = false) {
    const _m = `${_CLSNAME}.SetPreviousVersion`;
    const prevId = jsonObj[XMObjectProps.VERSION_PREV];
    if (!Util.StringIsEmpty(prevId)) {
      if (prevId !== objectId) {
        if (override !== true) {
          console.error(`${_m}: already has previous version: ${prevId}`);
          return false;
        }
        // override falls through
      } else {
        console.warn(`${_m}: Setting same version ID again: ${objectId}`);
        return false;
      }
    }
    jsonObj[XMObjectProps.VERSION_PREV] = objectId;
    return true;
  } // SetPreviousVersion

  /**
   * Get previous version's object ID, if it exists.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal if no value exists, then return this
   * @return {string} previous version's object ID
   *
   * @see ~SetPreviousVersion
   */
  static GetPreviousVersion(jsonObj, defaultVal = null) {
    if (jsonObj == null) { return defaultVal; }
    const prevId = jsonObj[XMObjectProps.VERSION_PREV];
    return prevId || defaultVal;
  }

  /**
   * Set/change ID of the next version of this object
   *
   * @param {{}} jsonObj
   * @param {string} objectId ID of the next version
   * @param {boolean} override true to override existing value
   * @return {boolean} true if set
   *
   * @see ~GetNextVersion
   */
  static SetNextVersion(jsonObj, objectId, override = false) {
    const _m = `${_CLSNAME}.SetNextVersion`;
    const nextId = jsonObj[XMObjectProps.VERSION_NEXT];
    if (Util.StringIsEmpty(nextId)) {
      if (nextId !== objectId) {
        if (override !== true) {
          console.error(`${_m}: already has next version: ${nextId}`);
          return false;
        }
        // override falls through
      } else {
        console.warn(`${_m}: Setting same version ID again: ${objectId}`);
        return false;
      }
    }
    jsonObj[XMObjectProps.VERSION_NEXT] = objectId;
    return true;
  } // SetNextVersion

  /**
   * Get next version's object ID, if it exists.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal if no value exists, then return this
   * @return {string} previous version's object ID
   *
   * @see ~SetNextVersion
   */
  static GetNextVersion(jsonObj, defaultVal = null) {
    if (jsonObj == null) { return defaultVal; }
    const nextId = jsonObj[XMObjectProps.VERSION_NEXT];
    return nextId || defaultVal;
  }

  /**
   * Create a new version of the given object. The new version will
   * have newly generated unique ID, using now as CREATED_DATE, and clear
   * all other timestamps. It's VERSION_PREVIOUS property will point
   * back to the given object. The given object's VERSION_NEXT will also
   * point to the newly created object.
   *
   * @param {XMObject} xobj source object to create a successor version
   * @param {boolean} restoreSnapshot if ture, will check if the
   * given object has a snapshot and will restore it before setting it's
   * VERSION_NEXT property to point to the newly created object
   * @param {boolean} cloneAux if there us AUX_DATA, then also copy that
   * if this value is true (default)
   *
   * @return {XMObject} new cloned instance with new ID, createTS, and
   * points back to given object as previous version. Existing input
   * object is also modified (and snapshot restored if desired)
   */
  static CreateNewVersion(xobj, restoreSnapshot = true, cloneAux = true) {
    /** @type {XMObject} newXobj */
    const newXobj = XMObject.CloneInstance(xobj, true, cloneAux);

    const nowTS = Date.now();
    const ownerId = xobj.getOwnerId();
    const objType = xobj.getType();
    const newId = XMObject.DeriveID(objType, ownerId);
    newXobj._setId(newId);
    newXobj.setCreatedTS(nowTS);
    newXobj.clear(XMObjectProps.UPDATED_DATE);
    newXobj.clear(XMObjectProps.EDITED_DATE);
    newXobj.clear(XMObjectProps.PUBLISHED_DATE);
    newXobj.clear(XMObjectProps.DELETED_DATE);
    newXobj.clear(XMObjectProps.VERSION_NEXT);
    newXobj.setPreviousVersion(xobj.getId(), true);

    // Before setting VERSION_NEXT of the given object, see if
    // caller wants to restore from snapshot if one is there.
    if (restoreSnapshot && xobj.hasSnapshot()) { xobj.resetFromSnapshot(true); }

    xobj.setNextVersion(newId, true);
    return newXobj;
  } // CreateNewVersion

  /**
   * Clone instance of XMObject, assign new ID and new owner
   *
   * @param {XMObject} xobj managed object to clone
   * @param {string} newObjId ID for the new instance
   * @param {string} newOwnerId override ownership
   * @param {boolean} trackNew if true, will discard COD and
   * create new entry
   * @return {XMObject} new instance
   */
  static CloneForUser(xobj, newObjId, newOwnerId, trackNew = true) {
    const newObj = XMObject.CloneInstance(xobj);
    if (newObjId) { newObj._setId(newObjId); }
    if (newOwnerId) { newObj.setOwnerId(newOwnerId); }
    newObj._discardCOD();
    if (trackNew) { newObj.enableTrackingNew(); }
    return newObj;
  }

  // ---------------------------- Main Tags -------------------------------

  /**
   * Add tag name(s) to the given json version
   * of the object
   *
   * @param {object} jsonObj
   * @param {string} tagName or can be a array of tagnames
   */
  static AddTag(jsonObj, tagName) {
    return XMObject._AddTag(jsonObj, XMObject.PROP_TAGS, tagName);
  } // AddTag

  /**
   * Add array of tagnames to the given XMObject instance's data
   *
   * @param {object} jsonObj
   * @param {[]} tagArray
   * @return {number} number of tags actually added
   */
  static AddTags(jsonObj, tagArray) {
    return XMObject._AddTags(jsonObj, XMObject.PROP_TAGS, tagArray);
  } // AddTags

  /**
   * Set array of tagnames to the given XMObject instance's data.
   * Be ware that this overrides entire existing array of tags
   *
   * @param {object} jsonObj
   * @param {[]} tagArray if non-null, will repalce everyting, INCLUDING empty array
   * @return {boolean} true if set, false if array is empty or content is same.
   */
  static SetTags(jsonObj, tagArray) {
    return XMObject._SetTags(jsonObj, XMObject.PROP_TAGS, tagArray);
  }

  /**
   * Return associated tags of this object.
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   */
  static GetTags(jsonObj, defaultVal = []) {
    return XMObject._GetTags(jsonObj, XMObject.PROP_TAGS, defaultVal);
  }

  /**
   * Return tags matched by given relname
   *
   * @param {object} jsonObj
   * @param {string} relname relationship name. If this is null, then all tags with TAG_PROP_REL
   * property are returned.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static GetTagsByRel(jsonObj, relname = null, defaultVal = {}) {
    return XMObject._GetTagsByRel(jsonObj, XMObject.PROP_TAGS, relname, defaultVal);
  }

  /**
   * Return all tags grouped by their rel type.
   *
   * @param {Array} tags can be array or set
   * @param {boolean} parseProps true to parse props to JSON, false to keep as string
   * @param {string} defaultRel relationship (key) name to use to group
   */
  static GetTagsGroupedByRel(jsonObj, parseProps = false, defaultVal = {}) {
    return XMObject._GetTagsGroupedByRel(jsonObj, XMObject.PROP_TAGS, parseProps, defaultVal);
  }

  /**
   * Report on whether a given name is found in the main tag property
   *
   * @param {object} jsonObj
   * @param {string} tagname can have inline expression which will be stripped before
   * comparing
   * @param {boolean} simpleCheck true to use array indexOf. No normalizing input or
   * strip any expressions
   * @return {boolean} true if exists
   */
  static HasTag(jsonObj, tagname, simpleCheck = false) {
    jsonObj = XMObject.Unwrap(jsonObj);
    // console.log(`${_CLSNAME}.HasTag(${tagname})`, "json object:", jsonObj);
    return (Util.NotNull(jsonObj)) ? TagUtil.HasTag(jsonObj[XMObject.PROP_TAGS], tagname, simpleCheck) : false;
  }

  /**
   * Does this object has a tag with the given relname?
   *
   * @param {object} jsonObj
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} true if exists
   */
  static HasTagByRel(jsonObj, relname = null) {
    return XMObject._HasTagByRel(jsonObj, XMObject.PROP_TAGS, relname);
  }

  /**
   * Does this object has a tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfTagByRel(jsonObj, relname = null) {
    return XMObject._IndexOfTagByRel(jsonObj, XMObject.PROP_TAGS, relname);
  }

  /**
   * Does this object has a tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} nameCheck tagname to check.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfTagname(jsonObj, nameCheck) {
    return XMObject._IndexOfTagname(jsonObj, XMObject.PROP_TAGS, nameCheck);
  }

  /**
   * Remove a tag given the tagname
   *
   * @param {{}} jsonObj
   * @param {string} tagname will be normalized before comparin
   * @return {boolean}
   *
   * @see #AddTag
   * @see #GetTags
   */
  static RemoveTag(jsonObj, tagname) {
    return XMObject._RemoveTag(jsonObj, XMObject.PROP_TAGS, tagname);
  }

  /**
   * Count number of tags associated with the given object
   *
   * @param {{}} jsonObj
   * @return {number}
   */
  static CountTags(jsonObj) {
    return XMObject._CountTags(jsonObj, XMObject.PROP_TAGS);
  } // CountTags

  // ------------------------- Relationship Tags -------------------------------

  /**
   * Add relationship tag name(s) to the given json version
   * of the object
   *
   * @param {object} jsonObj
   * @param {string} tagname or can be a array of tagnames
   * @param {string} relname relationship name, or "rel" value within
   * inline props of the tagname. We will extract it if it is inline.
   * @return {boolean} true if added, false if not
   *
   */
  static AddRelTag(jsonObj, tagname, relname = null) {
    if (relname == null) {
      relname = TagUtil.GetPropertyValue(tagname, 'rel');
    }
    if ((relname == null) || (tagname == null)) {
      console.warn('ART: bad args');
      return false;
    }
    let relMap = this.GetObjectField(jsonObj, XMObject.PROP_RELTAGS, null);
    if (relMap == null) {
      relMap = {};
      this.SetObjectField(jsonObj, XMObject.PROP_RELTAGS, relMap);
    }
    // just in case - the tagname inside should not have the rel name
    const cleanedTag = TagUtil.RemoveProperty(tagname, XMObject.PROP_RELTAGS, relname);

    return XMObject._AddTag(relMap, relname, cleanedTag);
  } // AddRelTag

  /**
   * Add array of relationship tagnames to the given XMObject instance's data
   *
   * @param {object} jsonObj
   * @param {[]} tagArray
   * @param {string=} relname add to the subroup with this name
   * @return {number} number of tags actually added
   */
  static AddRelTags(jsonObj, tagArray, relname = null) {
    if (Array.isArray(tagArray)) {
      let i;
      const size = tagArray ? tagArray.length : 0;
      let added = 0;
      for (i = 0; i < size; i++) {
        if (this.AddRelTag(jsonObj, tagArray[i], relname) === true) { added++; }
      }
      return added;
    }
    return tagArray ? XMObject.AddRelTag(jsonObj, tagArray, relname) : 0;
  } // AddRelTags

  /**
   * Set array of relationship tagnames to the given XMObject instance's data.
   * Be ware that this overrides entire existing array of tags
   *
   * @param {object} jsonObj
   * @param {[]} tagArray if non-null, will repalce everyting, INCLUDING empty array
   * @param {string} relname relationship group to add to. If null, then will extract
   * from each tagname. If none, then those will not be added.
   * @return {boolean} true if set, false if array is empty or content is same.
   */
  static SetRelTags(jsonObj, tagArray, relname) {
    if ((relname == null) || (tagArray == null)) {
      console.warn('SRT: no data');
      return false;
    }
    if (!Array.isArray(tagArray)) { tagArray = [tagArray]; }
    const relMap = XMObject.GetRelTagMap(jsonObj, null);
    relMap[relname] = tagArray;
    return true;
  }

  /**
   * Return the requested tagname as stored in the relationship container.
   * The version in the container may have inline properties.
   *
   * @param {object} jsonObj
   * @param {string} relname relationshp label within the relationship map
   * @param {string} tagname tagname to match. if it has inline props too,
   * they will be ignored (not matched)
   * @param {*} defaultVal
   */
  static GetRelTag(jsonObj, tagname, relname, defaultVal = null) {
    const tagnames = this.GetRelTags(jsonObj, relname, null);

    return (Util.NotNull(tagnames)) ? TagUtil.GetTag(tagnames, tagname, defaultVal) : defaultVal;
  }

  /**
   * Return associated container tags of this object.
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   * @return {string[]}
   */
  static GetRelTags(jsonObj, relname, defaultVal = []) {
    const relMap = XMObject.GetRelTagMap(jsonObj, null);
    if (relMap == null) { return defaultVal; }

    let tags = relMap[relname];
    if ((Util.NotNull(tags)) && !Array.isArray(tags)) { tags = [tags]; }
    return (Util.NotNull(tags)) ? tags : defaultVal;
  }

  /**
   * Return associated container tags of this object.
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   * @return {string[]}
   */
  static GetAllRelTags(jsonObj, tagnameOnly = true, defaultVal = []) {
    const relMap = XMObject.GetRelTagMap(jsonObj, null);
    if (relMap == null) { return defaultVal; }

    let result = null;
    let reltags;
    for (const relname in relMap) {
      reltags = relMap[relname];
      if (!Array.isArray(reltags)) { reltags = [reltags]; }
      if (tagnameOnly) { reltags = TagUtil.StripTagsProps(reltags); }
      result = (result == null) ? reltags : result.concat(reltags);
    }
    result = Util.UniqueArray(result);  // efficient?

    return result;
  }

  /**
   * Count number of tags under the relationship label
   *
   * @param {{}} jsonObj
   * @param {string} relname relationshp label within the relationship map

   * @return {number}
   */
  static GetRelTagCount(jsonObj, relname) {
    const tagnames = this.GetRelTags(jsonObj, relname, null);

    return (Util.NotNull(tagnames)) ? tagnames.length : 0;
  }

  /**
   * Return associated container tags of this object.
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   */
  static HasRelTag(jsonObj, tagname, relname = null) {
    const relMap = XMObject.GetRelTagMap(jsonObj, null);
    // console.error(`HasRelTag(${tagname},${relname}): relMap is:`, relMap);
    if (relMap == null) { return false; }
    return XMObject._HasTag(relMap, relname, tagname);
  }


  /**
   * Return associated container tags of this object.
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   * @return {{}} map with each relationship name as a property and tags as array
   */
  static GetRelTagMap(jsonObj, defaultVal = null) {
    return XMObject.GetObjectField(jsonObj, XMObject.PROP_RELTAGS, defaultVal);
  }

  /**
   * Set the entire rel tag map into this object.
   *
   * @param {{}} jsonObj json object to set rel map into
   * @param {{}} relMap rel map to set
   * @return {boolean} false to indicate null input. true if set
   */
  static SetRelTagMap(jsonObj, relMap) {
    if (!this.AssertNotNull(relMap, _CLSNAME, 'SRTM', 'null')) { return null; }
    XMObject.SetObjectField(jsonObj, XMObject.PROP_RELTAGS, relMap);
    return true;
  }

  /**
   * Return container tags matched by given relname
   *
   * @param {object} jsonObj
   * @param {string} relname relationship name. If this is null, then all tags with TAG_PROP_REL
   * property are returned.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  // static GetRelTagsByRel(jsonObj, relname=null, defaultVal={}) {
  //     return XMObject._GetTagsByRel(jsonObj, XMObject.PROP_RELTAGS, relname, defaultVal);
  // }

  /**
   * Does this object has a relationship tag with the given relname?
   *
   * @param {object} jsonObj
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} true if exists
   */
  // static HasRelTagByRel(jsonObj, relname=null) {
  //     return XMObject._HasTagByRel(jsonObj, XMObject.PROP_RELTAGS, relname);
  // }

  /**
   * Does this object has a relationship tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfRelTagByRel(jsonObj, relname = null) {
    return XMObject._IndexOfTagByRel(jsonObj, XMObject.PROP_RELTAGS, relname);
  }

  /**
   * Does this object has a relationship tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} nameCheck tagname to check.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfRelTagname(jsonObj, nameCheck) {
    return XMObject._IndexOfTagname(jsonObj, XMObject.PROP_RELTAGS, nameCheck);
  }

  /**
   * Remove a relationship tag given the tagname
   *
   * @param {{}} jsonObj
   * @param {string} tagname will be normalized before comparing
   * @param {string=} relname relationship label. if null, then
   * it needs to be an inline prop to the given tagname
   * @return {string} removed tagname which may have inline props.
   * Null if not found
   *
   * @see #AddTag
   * @see #GetTags
   */
  static RemoveRelTag(jsonObj, tagname, relname = null) {
    if (relname == null) {
      relname = TagUtil.GetPropertyValue(tagname, 'rel');
    }
    if (relname == null) {
      console.warn(`RemoveRelTag: relname ${relname} not found within tagname: ${tagname}`);
      return false;
    }
    const relMap = this.GetRelTagMap(jsonObj, null);
    const tagList = (Util.NotNull(relMap)) ? relMap[relname] : null;
    return (Util.NotNull(tagList)) ? TagUtil.RemoveTag(tagList, tagname) : null;
  }

  /**
   * Count number of tags associated with a relationship label.
   *
   * @param {{}} jsonObj
   * @return {number}
   */
  static CountRelTags(jsonObj, relname) {
    const tagList = this.GetRelTags(jsonObj, relname, null);
    return (Util.NotNull(tagList)) ? tagList.length : 0;
  }


  // ---------------------------- Source Tags -------------------------------

  /**
   * Add source tag name(s) to the given json version
   * of the object
   *
   * @param {object} jsonObj
   * @param {string} tagName or can be a array of tagnames
   */
  static AddSourceTag(jsonObj, tagName) {
    return XMObject.AddRelTag(jsonObj, tagName, XMObject.PROP_SRCTAGS);
  } // AddTag

  /**
   * Add array of source tagnames to the given XMObject instance's data
   *
   * @param {object} jsonObj
   * @param {[]} tagArray
   * @return {number} number of tags actually added
   */
  static AddSourceTags(jsonObj, tagArray) {
    return XMObject.AddRelTags(jsonObj, tagArray, XMObject.PROP_SRCTAGS);
  } // AddTags

  /**
   * Set array of source tagnames to the given XMObject instance's data.
   * Be ware that this overrides entire existing array of tags
   *
   * @param {object} jsonObj
   * @param {[]} tagArray if non-null, will repalce everyting, INCLUDING empty array
   * @return {boolean} true if set, false if array is empty or content is same.
   */
  static SetSourceTags(jsonObj, tagArray) {
    return XMObject.SetRelTags(jsonObj, tagArray, XMObject.PROP_SRCTAGS);
  }

  /**
   * Return associated source tags of this object.
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   */
  static GetSourceTags(jsonObj, defaultVal = []) {
    return XMObject.GetRelTags(jsonObj, XMObject.PROP_SRCTAGS, defaultVal);
  }

  /**
   * Return source tags matched by given relname
   *
   * @param {object} jsonObj
   * @param {string} relname relationship name. If this is null, then all tags with TAG_PROP_REL
   * property are returned.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static GetSourceTagsByRel(jsonObj, relname = null, defaultVal = {}) {
    return XMObject._GetTagsByRel(jsonObj, XMObject.PROP_SRCTAGS, relname, defaultVal);
  }

  /**
   * Return all source tags grouped by their rel type.
   *
   * @param {Array} tags can be array or set
   * @param {boolean} parseProps true to parse props to JSON, false to keep as string
   * @param {string} defaultRel relationship (key) name to use to group
   */
  static GetSourceTagsGroupedByRel(jsonObj, parseProps = false, defaultVal = {}) {
    return XMObject._GetTagsGroupedByRel(jsonObj, XMObject.PROP_SRCTAGS, parseProps, defaultVal);
  }

  /**
   * Report on whether a given name is found in the main tag property
   *
   * @param {object} jsonObj
   * @param {string} tagname
   * @return {boolean} true if exists
   */
  static HasSourceTag(jsonObj, tagname) {
    return XMObject.HasRelTag(jsonObj, tagname, XMObject.PROP_SRCTAGS);
  }

  /**
   * Does this object has a source tag with the given relname?
   *
   * @param {object} jsonObj
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} true if exists
   */
  static HasSourceTagByRel(jsonObj, relname = null) {
    return XMObject._HasTagByRel(jsonObj, XMObject.PROP_SRCTAGS, relname);
  }

  /**
   * Does this object has a source tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfSourceTagByRel(jsonObj, relname = null) {
    return XMObject._IndexOfTagByRel(jsonObj, XMObject.PROP_SRCTAGS, relname);
  }

  /**
   * Does this object has a source tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} nameCheck tagname to check.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfSourceTagname(jsonObj, nameCheck) {
    return XMObject._IndexOfTagname(jsonObj, XMObject.PROP_SRCTAGS, nameCheck);
  }

  /**
   * Remove a source tag given the tagname
   *
   * @param {{}} jsonObj
   * @param {string} tagname will be normalized before comparin
   * @return {boolean}
   *
   * @see #AddTag
   * @see #GetTags
   */
  static RemoveSourceTag(jsonObj, tagname) {
    return XMObject.RemoveRelTag(jsonObj, tagname, XMObject.PROP_SRCTAGS);
  }

  /**
   * Count number of tags associated with the given object
   *
   * @param {{}} jsonObj
   * @return {number} number of tagnames under the PROP_SRCTAGS label
   */
  static CountSourceTags(jsonObj) {
    return XMObject.CountRelTags(jsonObj, XMObject.PROP_SRCTAGS);
  }

  // ------------------- Variable Expression Tags -------------------------------

  /**
   * Add variable expression string to the given json version
   * of the object
   *
   * @param {object} jsonObj
   * @param {string} expr or can be a array of tagnames
   */
  static AddVarExpr(jsonObj, expr) {
    return XMObject._AddTag(jsonObj, XMObjectProps.VAREXPRS, expr);
  }

  /**
   * Add list of variable expression strings
   *
   * @param {object} jsonObj
   * @param {[]} exprArray
   * @return {number} number of expression strings actually added
   */
  static AddVarExprs(jsonObj, exprArray) {
    return XMObject._AddTags(jsonObj, XMObjectProps.VAREXPRS, exprArray);
  }

  /**
   * Set array of RLTPL tagnames to the given XMObject instance's data.
   * Be ware that this overrides entire existing array of tags
   *
   * @param {object} jsonObj
   * @param {[]} exprArray if non-null, will repalce everyting, INCLUDING empty array
   * @return {boolean} true if set, false if array is empty or content is same.
   */
  static SetVarExprs(jsonObj, exprArray) {
    return XMObject._SetTags(jsonObj, XMObjectProps.VAREXPRS, exprArray);
  }

  /**
   * Return associated variable expression strings
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   */
  static GetVarExprs(jsonObj, defaultVal = []) {
    return XMObject._GetTags(jsonObj, XMObjectProps.VAREXPRS, defaultVal);
  }

  /**
   * Retrieve full variable expression string given the variable name only
   *
   * @param {object} jsonObj
   * @param {string} varname variable name (no properties)
   * @return {string} variable expression string if found
   */
  static GetVarExpr(jsonObj, varname, defaultVal = null) {
    jsonObj = XMObject.Unwrap(jsonObj);
    // console.log(`${_CLSNAME}.GetVarExpr(${varname})`, "json object:", jsonObj);
    return (Util.NotNull(jsonObj)) ? TagUtil.GetTag(jsonObj[XMObjectProps.VAREXPRS], varname, defaultVal) : defaultVal;
  }

  /**
   * Report on whether a given name is found in the RLTPL tag property
   *
   * @param {object} jsonObj
   * @param {string} varname variable name (no properties)
   * @return {boolean} true if exists
   */
  static HasVarExpr(jsonObj, varname) {
    jsonObj = XMObject.Unwrap(jsonObj);
    // console.log(`${_CLSNAME}.HasVarExpr(${varname})`, "json object:", jsonObj);
    return (Util.NotNull(jsonObj)) ? TagUtil.HasTag(jsonObj[XMObjectProps.VAREXPRS], varname) : false;
  }

  /**
   * Remove a varialbe expression string with the variable name
   *
   * @param {{}} jsonObj
   * @param {string} varname will be normalized before comparin
   * @return {boolean}
   *
   */
  static RemoveVarExpr(jsonObj, varname) {
    return XMObject._RemoveTag(jsonObj, XMObjectProps.VAREXPRS, varname);
  }

  /**
   * Count number of variable expression strings
   *
   * @param {{}} jsonObj
   * @return {number}
   */
  static CountVarExprs(jsonObj) {
    return XMObject._CountTags(jsonObj, XMObjectProps.VAREXPRS);
  }

  // ----------------- Tags: Reusable building blocks ---------------------

  /**
   * Add tag name(s) to the target tag property in json version
   * of the object
   *
   * @param {object} jsonObj
   * @param {string} key property label holding the tags
   * @param {string} tagName or can be a array of tagnames
   *
   * @see ~_AddTags
   */
  static _AddTag(jsonObj, key, tagName) {
    const _m = `${_CLSNAME}._AddTag(${key})`;
    if (!jsonObj || !tagName) {
      console.error(`${_m}: Null Tag/Obj`);
      console.trace();
      return false;
    }
    if (Array.isArray(tagName)) { return XMObject._AddTags(jsonObj, key, tagName); }

    tagName = TagUtil.NormalizeTag(tagName);
    if (!jsonObj.hasOwnProperty(key)) { jsonObj[key] = []; }
    if (jsonObj[key].includes(tagName)) {
      // console.log(`${_m}: ${tagName} already exists`);
      return false;
    }

    jsonObj[key].push(tagName);
    return true;
  } // AddTag

  /**
   * Add array of tagnames to the target tag property of the
   * given XMObject instance's data
   *
   * @param {object} jsonObj
   * @param {string} key property label holding the tags
   * @param {[]} tagArray actually list of tags. If it's not array,
   * then assume adding just one.
   * @return {number} number of tags actually added
   *
   * @see ~_AddTag
   */
  static _AddTags(jsonObj, key, tagArray) {
    const _m = `${_CLSNAME}.AddTags(${key})`;

    if (!Array.isArray(tagArray)) { return XMObject._AddTag(jsonObj, key, tagArray); }

    if (!jsonObj) {
      console.trace(`${_m}: Null Obj`);
      return false;
    }

    const size = tagArray ? tagArray.length : 0;
    if (size === 0) { return false; }

    if (!jsonObj.hasOwnProperty(key)) { jsonObj[key] = []; }
    let tag;
    let added = 0;
    for (let i = 0; i < size; i++) {
      tag = tagArray[i];
      if (tag == null) {
        // console.log(`${_m}: to object: `, jsonObj);
        console.error(`${_m}: Cannot add a NULL Tag at i (${i}). tagArray:`, tagArray);
      }
      tag = TagUtil.NormalizeTag(tag);
      if (jsonObj[key].includes(tag)) {
        // dont' add
        // console.warn(`${_m}: tag name: ${tag} already exists`);
      } else {
        jsonObj[key].push(tag);
        added++;
      }
    } // for
    return added;
  } // AddTags

  /**
   * Set array of tagnames to the given XMObject instance's data.
   * Be ware that this overrides entire existing array of tags
   *
   * @param {object} jsonObj
   * @param {string} key property label holding the tags
   * @param {[]} tagArray if non-null, will repalce everyting, INCLUDING empty array
   * @return {boolean} true if set, false if array is empty or content is same.
   */
  static _SetTags(jsonObj, key, tagArray) {
    if (tagArray == null || !Array.isArray(tagArray)) { return false; }
    // let size = tagArray.length;

    // clear all tags in existing array
    const existingTags = jsonObj[key];
    if (Util.CompareArrays(existingTags, tagArray)) { return false; }   // same list!
    jsonObj[key] = tagArray;
    return true;
  } // _SetTags

  /**
   * Return associated tags of this object.
   *
   * @param {object} jsonObj a container with a property
   * that match key and values are tagnames
   * @param {string} key property label holding the tags
   * @param {*} defaultVal
   *
   * @see #GetTagsByRel
   */
  static _GetTags(jsonObj, key, defaultVal = []) {
    const tags = jsonObj[key];
    return (tags == null) ? defaultVal : tags;
  } // _GetTags

  /**
   * Return tags matched by given relname within a specified relationship container.
   *
   * @param {object} jsonObj should be a top level object
   * @param {string} key property holding the relationship container. default to rtag
   * @param {string} relname relationship name. If this is null, then all tags with TAG_PROP_REL
   * property are returned.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static _GetTagsByRel(jsonObj, key = null, relname = null, defaultVal = {}) {
    if (key == null) { key = XMObject.PROP_RELTAGS; }
    const relProp = jsonObj[key];
    if (relProp == null) { return defaultVal; }

    const relContainer = this.GetRelTagMap(relProp, null);
    const tagArray = (Util.NotNull(relContainer)) ? relContainer[relname] : null;
    return (Util.NotNull(tagArray)) ? tagArray : defaultVal;
  } //

  /**
   * Return all tags grouped by their rel type.
   *
   * @param {Array} tags can be array or set
   * @param {string} key property label holding the tags
   * @param {boolean} parseProps true to parse props to JSON, false to keep as string
   * @param {string} defaultRel relationship (key) name to use to group
   */
  static _GetTagsGroupedByRel(jsonObj, key, parseProps = false, defaultVal = {}) {
    const tags = jsonObj[key];
    if (tags == null) { return defaultVal; }

    return TagUtil.GroupTagsByRel(tags, parseProps);
  }

  /**
   * Determine if the given object has a tagname using the given property
   * label.
   *
   * @param {object} jsonObj can be main object or a rel container
   * @param {string} key property label holding the tags
   * @param {string} tagname tag to check. Can include props
   * @param {boolean} simpleCheck true to use array indexOf. No normalizing input or
   * strip any expressions
   * @return {boolean}
   */
  static _HasTag(jsonObj, key, tagname, simpleCheck = false) {
    // console.log(`_HasTag: checking for tag ${tagname} from list: `, jsonObj[key]);
    const tagList = jsonObj ? jsonObj[key] : null;
    return tagList ? TagUtil.HasTag(tagList, tagname, simpleCheck) : false;
  } // _HasTag

  /**
   * Does this object has a tag with the given relname?
   *
   * @param {object} jsonObj
   * @param {string} key property label holding the tags
   * @param {string} relname relationship (key) name to use to group, e.g. "isa".
   *
   * @return {boolean} -true if exists
   */
  static _HasTagByRel(jsonObj, key, relname = null) {
    const relContainer = this.GetRelTagMap(jsonObj, null);
    if (relContainer == null) { return false; }

    const tags = jsonObj[key];
    if (tags == null) { return false; }
    return TagUtil.HasTagByRel(tags, relname);
  }

  /**
   * Does this object has a tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} key property label holding the tags
   * @param {string} relname relationship (key) name to use to group, e.g. "isa"
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static _IndexOfTagByRel(jsonObj, key, relname = null) {
    const tags = jsonObj[key];
    if (tags == null) { return -1; }
    return TagUtil.IndexOfTagByProp(tags, relname);
  }

  /**
   * Does this object has a tag with the given relname?
   *
   * @param {{}} jsonObj
   * @param {string} key property label holding the tags
   * @param {string} nameCheck tagname to check.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static _IndexOfTagname(jsonObj, key, nameCheck) {
    const tags = jsonObj[key];
    if (tags == null) { return -1; }
    return TagUtil.IndexOfTagname(tags, nameCheck);
  }

  /**
   * Remove a tag given the tagname
   *
   * @param {{}} jsonObj
   * @param {string} key property label holding the tags
   * @param {string} tagname will be normalized before comparin
   * @return {{}} removed tagname which may have inline expression
   * preserved. null if not found.
   *
   * @see #_AddTag
   * @see #_GetTags
   */
  static _RemoveTag(jsonObj, key, tagname) {
    return TagUtil.RemoveTag(jsonObj[key], tagname);
  } // _RemoveTag

  /**
   * Count number of tags associated with the given object
   *
   * @param {{}} jsonObj
   * @return {number}
   */
  static _CountTags(jsonObj, key) {
    const tags = jsonObj[key];
    if (tags == null) { return 0; }
    return tags.length;
  } // _CountTags

  // -------------------- Follows and Following -----------------------

  /**
   * Add an object for this object to follow. It implements the "follows"
   * relationshp.
   *
   * @param {{}} jsonObj
   * @param {string} targetId what or whom to follow
   */
  static AddFollowing(jsonObj, targetId) {
    return XMObject.AddWord(jsonObj, XMObjectProps.FOLLOWING, targetId);
  }


  /**
   * Set a given list of users that this object follows by replacing
   * existing.
   *
   * @param {{}} jsonObj
   * @param {string[]} array of words or userIds
   * @return {string[]} previous set of follows that this is replacing
   */
  static SetFollowings(jsonObj, userIds) {
    return XMObject.SetWords(jsonObj, XMObjectProps.FOLLOWING, userIds);
  }

  /**
   * Return all followings, or "follows" targets of this object
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @return {[]} identifers of target objects being followed by this
   */
  static GetFollowings(jsonObj, defaultVal = []) {
    return XMObject.GetWords(jsonObj, XMObjectProps.FOLLOWING, defaultVal);
  }

  /**
   * Determine of this object is following the identified taget
   *
   * @param {{}} jsonObj this object
   * @param {string} targetId target identifier to check if following
   * @return {boolean} true if following target, false if not found
   */
  static IsFollowing(jsonObj, targetId) {
    return XMObject.HasWord(jsonObj, XMObjectProps.FOLLOWING, targetId);
  }

  /**
   * Remove a target that the object/user is following
   *
   * @param {{}} jsonObj
   * @param {string} targetId target identifier to unfollow
   * @return {boolean} true if removed, false if not found
   *
   * @see #AddFollowing
   * @see #GetFollowing
   * @see #IsFollowing
   * @see #RemoveAllFollowings
   * @see #CountFollowings
   */
  static RemoveFollowing(jsonObj, targetId) {
    return XMObject.RemoveWord(jsonObj, XMObjectProps.FOLLOWING, targetId);
  }

  /**
   * Remove all targets within following following list
   *
   * @param {{}} jsonObj
   * @return {boolean} true if removed, false if not found
   *
   * @see #RemoveFollowing
   */
  static RemoveAllFollowings(jsonObj) {
    return XMObject.RemoveAllWords(jsonObj, XMObjectProps.FOLLOWING);
  }

  /**
   * Return number of targets that this object is following
   * @param {{}} jsonObj
   * @return {number}
   */
  static CountFollowings(jsonObj) {
    return XMObject.CountWords(jsonObj, XMObjectProps.FOLLOWING);
  }

  /**
   * Add an object that is following this object
   *
   * @param {{}} jsonObj
   * @param {string} follower what or whom to follow
   */
  static AddFollower(jsonObj, follower) {
    return XMObject.AddWord(jsonObj, XMObjectProps.PROP_FOLLOWER, follower);
  }

  /**
   * Set a given list of users that follow this object by replacing
   * existing.
   *
   * @param {{}} jsonObj
   * @param {string[]} array of words or userIds that folow this object
   * @return {string[]} previous set of followers that this is replacing
   */
  static SetFollowers(jsonObj, userIds) {
    return XMObject.SetWords(jsonObj, XMObjectProps.PROP_FOLLOWER, userIds);
  }

  /**
   * Return all followers of this object
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @return {[]} identifers of follower objects
   */
  static GetFollowers(jsonObj, defaultVal = []) {
    return XMObject.GetWords(jsonObj, XMObjectProps.PROP_FOLLOWER, defaultVal);
  }

  /**
   * Determine of this object is following the identified taget
   *
   * @param {{}} jsonObj this object
   * @param {string} targetId to check
   * @return {boolean} true if followed by the given user
   */
  static IsFollowedBy(jsonObj, targetId) {
    return XMObject.HasWord(jsonObj, XMObjectProps.PROP_FOLLOWER, targetId);
  }

  /**
   * Remove a target within following target list
   *
   * @param {{}} jsonObj
   * @param {string} followerId target identifier to unfollow
   * @return {boolean} true if removed, false if not found
   *
   * @see #AddFollowing
   * @see #GetFollowing
   * @see #IsFollowing
   * @see #RemoveAllFollowings
   * @see #CountFollowings
   */
  static RemoveFollower(jsonObj, followerId) {
    return XMObject.RemoveWord(jsonObj, XMObjectProps.PROP_FOLLOWER, followerId);
  }

  /**
   * Remove all targets within following following list
   *
   * @param {{}} jsonObj
   * @return {boolean} true if removed, false if not found
   *
   * @see #RemoveFollowers
   */
  static RemoveAllFollowers(jsonObj) {
    return XMObject.RemoveAllWords(jsonObj, XMObjectProps.PROP_FOLLOWER);
  }

  /**
   * Return number of follwers that this object has
   *
   * @param {{}} jsonObj
   * @return {number}
   */
  static CountFollowers(jsonObj) {
    return XMObject.CountWords(jsonObj, XMObjectProps.PROP_FOLLOWER);
  }
}
