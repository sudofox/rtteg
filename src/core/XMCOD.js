import { isNumber } from 'lodash';
import XObject from './model/XObject';

export const STATUS_NONE = 'C'; // "clean" of any status
export const STATUS_NEW = 'N';
export const STATUS_DIRTY = 'M'; // modified
export const STATUS_DELETED = 'D'; //

const _CLSNAME = 'XMCOD';

export class XMCODStatus {
  static get STATUS_NONE() {
    return STATUS_NONE;
  }
  static get STATUS_NEW() {
    return STATUS_NEW;
  }
  static get STATUS_DIRTY() {
    return STATUS_DIRTY;
  }
  static get STATUS_DELETED() {
    return STATUS_DELETED;
  }
}

const PROP_FETCH_FUNC = 'rfc';
const PROP_TTL = 'ttl';
const PROP_EXPIRES = 'exp';
const PROP_OBJECT = 'obj';
const PROP_STATUS = 'status';
const PROP_TYPE = 'type';
const PROP_ID = '_id';
const PROP_CACHE = 'cache';

/**
 * Cached Object Descriptor. One per XMObject instance
 * being tracked in cache.
 *
 * NOTE: XMCache and therefore this class are not used
 * in the backend right now. It was heavily used in
 * the frontend in early days of development but has
 * since backed off (data gets stale fast so best to
 * always reload).
 */
export class XMCOD extends XMCODStatus {
  constructor(cache, xmObject = null, initialStatus = STATUS_NONE, ttl = -1, refetchFunc = null) {
    super();
    this[PROP_CACHE] = cache;
    if (xmObject) {
      this.trackXObject(xmObject, initialStatus, ttl, refetchFunc);
    }
  }

  /**
   *
   * @param {object} object
   * @param {string} status
   * @param {string} ttl time to live in millis. null = no expiration. negative OK.
   * @return {Number=} expiration timestamp. null if no expiration given
   */
  trackObject(object, status = STATUS_NONE, ttl = null, refetchFunc = null) {
    this[PROP_OBJECT] = object;
    this[PROP_STATUS] = status;
    const objectId = XObject.GetId(object);
    if (objectId != null) {
      this[PROP_ID] = objectId;
    }
    let expires = null;
    if (ttl != null) {
      expires = this.setExpiration(ttl, refetchFunc);
    }
    return expires;
  }

  /**
   *
   * @param {XMObject} xmObject
   * @param {string} status
   * @return {boolean}
   */
  trackXObject(xmObject, status = STATUS_NONE, ttl = -1, refetchFunc = null) {
    this[PROP_OBJECT] = xmObject;
    this[PROP_STATUS] = status;
    this[PROP_ID] = xmObject.getId();
    this[PROP_TYPE] = xmObject.getType();
    if (ttl >= 0) {
      this.setExpiration(ttl, refetchFunc);
    }
    return true;
  }

  /** @return {string} */
  getId() {
    return this[PROP_ID];
  }

  /** @return {string} */
  getType() {
    return this[PROP_TYPE];
  }

  /**
   * Refresh Object held by this descriptor,
   * regardless of whether expiration time
   * has reached.
   *
   */
  async refreshObject() {
    const func = this[PROP_FETCH_FUNC];

    if (func == null) { return null; }

    let newObject;
    try {
      newObject = await func(this[PROP_OBJECT]);
      this[PROP_OBJECT] = newObject;
      this.resetExpiration();
    } catch (err) {
      console.log(err);
    }
    return newObject;
  }

  /**
   * ASYNC
   *
   * @param {boolean} doFetch true to reretch if expired. false to skip check
   * @return {XMObject}
   *
   * @see ~getObjectNoWait
   */
  async getObject(doFetch = true) {
    if (this.hasExpired() && doFetch) {
      // expired
      console.log(`>>>>> ${_CLSNAME}.getObject(): object expired. Fetching...`);
      try {
        const newObj = await this.refreshObject();
        this[PROP_OBJECT] = newObj;
      } catch (err) {
        console.log(err);
      }
    }
    return this[PROP_OBJECT];
  }

  /**
   *
   * @param {boolean} doFetch
   * @return {XMObject}
   *
   * @see ~getObject
   */
  getObjectNoWait(doFetch = true) {
    if (this.hasExpired() && doFetch) {
      // expired
      console.log(`${_CLSNAME}.getObject(): object expired. Fetching...`);
    }
    return this[PROP_OBJECT];
  }

  /** @param {XMObject} xmObject */
  trackNew(xmObject, ttl, refetchFunc) {
    return this.trackObject(xmObject, STATUS_NEW, ttl, refetchFunc);
  }
  /** @param {XMObject} xmObject */
  trackLoaded(xmObject, ttl, refetchFunc) {
    return this.trackObject(xmObject, STATUS_NONE, ttl, refetchFunc);
  }

  /**
   * Untrack the XMObject instance from this COD. This
   * is mainly used when discarding object during
   * a re-read.
   */
  untrackObject() {
    if (this[PROP_OBJECT]) {
      this[PROP_OBJECT]._discardCOD();
      this[PROP_OBJECT] = null;
      this[PROP_STATUS] = STATUS_NONE;
      this[PROP_EXPIRES] = undefined;
      this[PROP_FETCH_FUNC] = undefined;
    }
  }

  /**
   * Unconditionally set the status without checking.
   * Must be done with care.
   */
  setStatus(newStatus) {
    this[PROP_STATUS] = newStatus;
    return true;
  }

  getCache() {
    return this.cache;
  }

  getStatus() {
    return this[PROP_STATUS];
  }

  setNew() {
    this.setStatus(STATUS_NEW);
    return true;
  }

  setDirty() {
    if (this[PROP_STATUS] !== STATUS_NEW) {
      this.setStatus(STATUS_DIRTY);
      return true;
    }
    return false;
  }

  clearStatus() {
    this.setStatus(STATUS_NONE);
  }

  /**
   * Clear flags related to modification, which
   * includes dirty and new status.
   *
   * @return {boolean} true if reset and status is now STATUS_NONE
   */
  clearDirty() {
    // This doesn't feel right...
    if (this[PROP_STATUS] === STATUS_DIRTY || this.status === STATUS_NEW) {
      this.setStatus(STATUS_NONE);
      return true;
    }
    return false;
  }
  clearModified() {
    return this.clearDirty();
  }
  setDeleted() {
    // What if status is NEW or DIRTY?
    return this.setStatus(STATUS_DELETED);
  }

  isNone() {
    return this.status === STATUS_NONE;
  }
  isClean() {
    return this.status === STATUS_NONE;
  }
  /**
   * @return {boolean} true if status is STATUS_NEW
   */
  isNew() {
    return this.status === STATUS_NEW;
  }
  /**
   * @return {boolean} true if status is STATUS_DIRTY
   */
  isDirty() {
    return this.status === STATUS_DIRTY;
  }
  /**
   * @return {boolean} true if status is either dirty or new
   */
  isModified() {
    return this.status === STATUS_DIRTY || this.status === STATUS_NEW;
  }

  /**
   * @return {boolean}
   */
  isDeleted() {
    return this.status === STATUS_DELETED;
  }

  /**
   *
   * @param {number} ttl milliseconds to expire from now. Negative means in the past.
   * This value will be used each time the cached value is refreshed.
   * @param {func=} refetchFunc (optional) function to trigger if "get" is called after expiration
   * @return {Number} new expiration time. Null means not set
   */
  setExpiration(ttl = null, refetchFunc = null) {
    if (ttl == null) {
      return false;
    }
    this[PROP_TTL] = ttl;
    this[PROP_EXPIRES] = Date.now() + ttl;
    if (refetchFunc != null) {
      this[PROP_FETCH_FUNC] = refetchFunc;
    }
    return this[PROP_EXPIRES];
  }

  resetExpiration() {
    const ttl = this[PROP_TTL];
    this[PROP_EXPIRES] = Date.now() + ttl;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {Number}
   */
  getExpiration(defaultVal = null) {
    return this[PROP_EXPIRES] ? this[PROP_EXPIRES] : defaultVal;
  }

  /**
   * @return {boolean} true if expired, false if not or will
   * never
   *
   * @see ~expiresIn
   */
  hasExpired() {
    const expires = this[PROP_EXPIRES];
    if (expires == null || expires < 0) {
      return false;
    }
    return expires < Date.now();
  }

  /**
   * @return {number} -1 means N/A, 0 means expired, > 0 will expire in
   * milliseconds
   *
   * @return ~hasExpired
   */
  expiresIn() {
    const expires = this[PROP_EXPIRES];
    if (expires == null || expires < 0) {
      return -1;
    }
    return (expires >= Date.now()) ? 0 : (expires - Date.now());
  }
}

export default XMCOD;
