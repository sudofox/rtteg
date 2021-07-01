import XObject from './model/XObject';
import XMCOD from './XMCOD';

const _CLSNAME = 'XMCache';

/**
 * Cache type default, which is most of the
 * tracked objects.
 */
const TYPE_ALL = 'all';

/**
 * Cache storing XMObject instances and can be looked
 * up by their type/id. Each object has a descriptor
 * that track its state in the memory.
 *
 * NOTE: This is not current used in the backend Getter
 * project. Frontend was using this for caching in early
 * development, but since backed off (because data gets stale fast
 * and not worth checking for staleness)
 *
 * Also, it's possible that frontend team may ultimately use
 * other methods to track objects / data.
 */
class XMCache extends XObject {
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMCache;
    this.codList = {};
  }

  /**
   *
   * @param {XMObject} xmObject
   * @param {string} status
   */
  track(xmObject, status = XMCOD.STATUS_NONE, ttl = -1, reFetchFunc = null) {
    const _m = 'trk';
    this.assertNotNull(xmObject, _m);
    if (xmObject.isCached()) {
      // this.log("track", "object already tracked. ", xmObject);
      return false;
    }

    const id = xmObject.getId();
    // this.assertNotNull(_m, "ID cannot be null for: ", xmObject);
    const type = TYPE_ALL;
    const typeCache = this.getTypeCache(type, true);

    /** @type {XMCOD} cod **/
    let cod = typeCache[id];
    if (cod) {
      // we will overwrite
      // this.log(_m, "COD(" + type + ")[" + id + "] exist!");
      const existingObj = cod.getObject();
      if (existingObj) {
        cod.untrackObject();
        // this.log(_m, " Discarding cached instance id=" + id);
      }
      cod.trackObject(xmObject, status, ttl, reFetchFunc);
    } else {
      cod = new XMCOD(this, xmObject, status, ttl, reFetchFunc);
      typeCache[id] = cod;
    }
    xmObject._setCOD(cod);
    return true;
  }
  /**
   * Track a new XMObject instance. The requirement is it must
   * have an unique ID already stored and retrievable via getId().
   * StorageManager.trackNew() has this logic.
   *
   * @param {XMObject} xmObject instance with "_id" already derived
   * @see ObjectManager#trackNew()
   */
  trackNew(xmObject, ttl = -1, reFetchFunc = null) {
    // this.assertNotNull(xmObject.getId(), "trackNew", "object has no assigned Id: ", xmObject);
    return this.track(xmObject, XMCOD.STATUS_NEW, ttl, reFetchFunc);
  }

  /**
   * Track an instance of XMObject that is to be given the STATUS_NONE,
   * or "clean". This means object exists somewhere and is just being
   * cached.
   *
   * @param {XMObject} xmObject
   */
  trackExisting(xmObject, ttl = -1, reFetchFunc = null) {
    // this.assertNotNull(xmObject.getId(), "trackExisting", "object has no assigned Id: ", xmObject);
    return this.track(xmObject, XMCOD.STATUS_NONE, ttl, reFetchFunc);
  }

  /**
   * Untrack an object
   * @param {string} id
   * @param {*} type
   * @return {boolean} true if untracked, false if not
   */
  untrack(id, type = TYPE_ALL) {
    const tc = this.getTypeCache(type, false);
    if (tc == null) {
      // this.error("untrack", "type: " + type + " id: " + id);
      return false;
    }
    if (!tc.hasOwnProperty(id)) {
      return false;
    }

    const cod = tc[id];
    const xmobj = cod.getObjectNoWait(false);
    xmobj._discardCOD();
    delete tc[id];
    return true;
  }

  /**
   *
   * @param {string} id
   * @param {*} type
   * @return {boolean}
   */
  exists(id, type = TYPE_ALL) {
    const tc = this.getTypeCache(type, false);
    if (tc == null) {
      return false;
    }
    return tc.hasOwnProperty(id);
  }

  getCOD(id, type = TYPE_ALL) {
    const tc = this.getTypeCache(type, false);
    if (tc == null) {
      return null;
    }
    return tc[id];
  }

  /**
   *
   * @param {string} id
   * @param {*} type
   * @return {XMObject}
   */
  async getObject(id, type = null, reFetch = true) {
    if (type == null) {
      type = TYPE_ALL;
    }
    if (type !== TYPE_ALL) {
      // this.error("getObject", "passed in type not TYPE_ALL: " + type);
      type = TYPE_ALL;
    }
    const cod = this.getCOD(id, type);
    let obj = null;
    if (cod) {
      obj = await cod.getObject(reFetch);
    }
    return obj;
  }

  /**
   *
   * @param {string} id
   * @param {*} type
   * @return {XMObject}
   */
  getObjectNoWait(id, type = null, reFetch = true) {
    if (type == null) {
      type = TYPE_ALL;
    }
    if (type !== TYPE_ALL) {
      // this.error("getObject", "passed in type not TYPE_ALL: " + type);
      type = TYPE_ALL;
    }
    const cod = this.getCOD(id, type);
    let obj = null;
    if (cod) {
      obj = cod.getObjectNoWiat(reFetch);
    }
    return obj;
  }

  /**
   * Return the map associated with the
   * specified object type.
   *
   * @param create true to create the map if
   * doesn't exist
   */
  getTypeCache(type = TYPE_ALL, create = false) {
    if (type == null) {
      type = TYPE_ALL;
    }
    if (!this.codList.hasOwnProperty(type) && !create) {
      // this.log("getTypeCache", "no COD for type: " + type);
      return null;
    }
    let tc = this.codList[type];
    if (tc == null && create === true) {
      tc = {};
      this.codList[type] = tc;
    }
    return tc;
  }

  getCacheCount() {
    return this.getTypeCacheCount(TYPE_ALL);
  }

  getTypeCacheCount(type) {
    const tc = this.getTypeCache(type, false);
    if (tc == null) {
      return 0;
    }
    return Object.keys(tc).length;
  }

  /**
   * Remove all trackings of a given type.
   *
   * @param type type to lookup and clear
   * @param untrack if true, track each individual objects from old cache
   * @return true if disassociated. false if not found
   */
  clearTypeCache(type, untrack = false) {
    if (type == null) {
      type = TYPE_ALL;
    }
    if (!this.hasOwnProperty(type)) {
      return false;
    }
    delete this.codList[type];

    return true;
  }

  /**
   * Clear all tracking, which means remove all tracking.
   *
   * @param {boolean} untrack if true, will go through each COD and untrack.
   * @return {{}} map of all descripters removed
   */
  clearAll(untrack = false) {
    // if (untrack === true) {
    //     this.warn("clearAll", "untrack entire COD type is not implemented");
    // }
    const oldCodList = this.codList;
    this.codList = {};
    return oldCodList;
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
   * Cache type: ALL
   */
  static get TYPE_ALL() {
    return TYPE_ALL;
  }

  /**
   * Return the default folder/table/collection name used
   * for storing ranked lists.
   */
  static GetFolderName() {
    return 'xmcache';
  }

  static GetTypeID() {
    return 'xmc';
  }
}

export default XMCache;
