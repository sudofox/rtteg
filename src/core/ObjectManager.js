/**
 * The ObjectManager manages caching and retrieval
 * of data model.
 *
 */

import ObjectBase from './ObjectBase';
import XMObject from './model/XMObject';
import XMCache from './XMCache';

import XUserInfo from './model/user/XUserInfo';
import Util from './Util';

const instances = {};

class ObjectManager extends ObjectBase {
  constructor(label = 'default', clsname = 'ObjectManager') {
    super(clsname);
    this.class = ObjectManager;
    this.label = label;
    this.cache = new XMCache();
  }

  applyConfig(props) {
    if (Util.NotNull(props.isClient)) { this.isClient = props.isClient; }
    if (Util.NotNull(props.isServer)) { this.isServer = props.isServer; }
  }

  getLabel() {
    return this.label;
  }

  /**
   *
   * @param {NetworkManager} nm
   */
  setNetworkManager(nm) {
    this.nm = nm;
  }

  /**
   * @return {NetworkManager}
   */
  getNetworkManager() {
    return this.nm;
  }

  /**
   * Return whether this instance is running in pure
   * client mode (request over network), or is running
   * in the same VM as local StorageManager.
   *
   * NOTE: this code should go somewhere else,
   * perhaps a "System" global object so its
   * accessible by all.
   *
   * @return {boolean}
   */
  isServerRole() {
    if (this.isServer) { return this.isServer; }

    return true;
  }

  /**
   * @return {boolean}
   */
  isClientRole() {
    return (this.isClient) ? this.isClient : true;  // "true" default for now
  }

  /**
   * @return {boolean}
   */
  canStoreLocal() {
    // For now, only server can store
    return this.isServerRole();
  }

  /**
   * @return {XMCache}
   */
  _getCache() {
    return this.cache;
  }

  /**
   * Track a new XMObject instance.
   *
   * @param {XMObject} xmObject instance to be considered new when writing out
   * @param {string} ownerId owner of the object, if it's not already set inside the xmObject instance
   * @param {number} ttl
   * @param {function} refetchFunc does this make sense for new object?
   *
   * @return true if tracked. False if not (exists or no ownerId)
   */
  trackNew(xmObject, ownerId = null, ttl = -1, reFetchFunc = null) {
    let _id = xmObject.getId();
    if (_id == null) {
      // all objects need an id
      let userId = xmObject.getOwnerId();
      if (userId == null) { userId = ownerId; }
      const type = xmObject.getType();
      this.assertNotNull(userId, 'trackNew');
      this.assertNotNull(type, 'trackNew');

      _id = XMObject.DeriveID(type, userId);
      xmObject._setId(_id);
    }
    return this._getCache().trackNew(xmObject, ttl, reFetchFunc);
  } // trackNew

  /**
   * Track an XMObject instance that exists already somewhere
   *
   * @param {xmObject}
   * @param {number} ttl
   * @param {function} refetchFunc
   */
  trackExisting(xmObject, ttl = -1, reFetchFunc = null) {
    return this._getCache().trackExisting(xmObject, ttl, reFetchFunc);
  }

  /**
   * Track a list of XMObjectinstances as existing (STATUS_NONE)
   *
   * @param {XMObject[]} xmobjects
   * @param {number} ttl
   * @param {function} reFetchFunc
   */
  trackExistingObjects(xmObjects, ttl = -1, reFetchFunc = null) {
    const _m = 'trackExistingObjects';
    this.assertNotNull(xmObjects, _m);
    this.assert(Array.isArray(xmObjects), _m);
    const cache = this._getCache();
    xmObjects.forEach((xmObject) => {
      cache.trackExisting(xmObject, ttl, reFetchFunc);
    });
  }

  commit(flush = true) {

  }

  rollback() {

  }

  /**
   * Retrieve a user info instance.
   *
   * @param id unique user ID
   * @param params arguments to API and also filters
   */
  // getUserInfo(userId, params = null, remote = true, callback) {
  //   return this.get(userId, params, remote, XUserInfo, callback);
  // }

  /**
   * Retrieve an object with (type, id). It will
   * lookup built-in cache, and then optionally
   * retrieve from remote.
   *
   * @param id object identifier, unique at least within the type
   * @param params parameters which is arguments and/or filters
   * @param remote if true, will go fetch from remote server if not in cache
   * @param clsObj ES6 class object, which is really the contructor function. It
   * is used to create a new wrapper with the matching type for the json data.
   */
  get(id, params = null, remote = true, clsObj = null, callback) {
    const _m = 'get';
    this.assertNotNull(id, _m);
    this.assertNotNull(clsObj, _m, 'Class object must not be null');
    this.assertNotNull(clsObj.GetTypeID, _m);

    const om = this;
    const processResult = (err, data) => {
      let xmobj = null;
      if (err) {
        om.error(_m, `Get Request (id=${id} has error:`, err);
      } else if (Util.NotNull(data)) {
        // om.log(_m, "Returned data for id=" + id + ":", data);
        xmobj = XMObject.Wrap(data, clsObj);
        // Need to wrap with proper XMObject subclass...
        om.trackExisting(xmobj);
      }
      if (callback) { callback(err, xmobj); } else { return xmobj; }
    }; // get

    // let type = clsObj.GetTypeID();
    const obj = this.getFromCacheNoWait(id);
    if (obj == null && remote) {
      const type = clsObj ? XMObject.GetTypeFromClass(clsObj) : null;
      this.getFromRemote(id, type, params, processResult);
    } else {
      // this.log(_m, "Object type:" + type + ",id=" + id + " found in cache.");
      if (callback) { return callback(null, obj); }
      return obj;
    }
  } // get

  /**
   * Retrieve an object directly with StorageManager, and
   * skip fetch from another server tier. Cache can optionally be used.
   *
   * @param id object identifier, unique at least within the type
   * @param cache if true, will check cache first before requesting from SM
   * @param clsObj ES6 class object, which is really the contructor function. It
   * is used to create a new wrapper with the matching type for the json data.
   */
  getDirect(id, cache = true, clsObj = XMObject, callback) {
    const _m = 'get';
    this.assertNotNull(id, _m);
    this.assertNotNull(clsObj, _m, 'Class object must not be null');
    this.assertNotNull(clsObj.GetTypeID, _m);

    const om = this;
    const processResult = (err, data) => {
      let xmobj = null;
      if (err) { om.error(_m, `Get Request (id=${id} has error:`, err); } else if (Util.NotNull(data)) {
        // om.log(_m, "Returned data for id=" + id + ":", data);
        xmobj = XMObject.Wrap(data, clsObj);
        // Need to wrap with proper XMObject subclass...
        om.trackExisting(xmobj);
      }
      if (callback) { callback(err, xmobj); } else { return xmobj; }
    }; // get

    // let type = clsObj.GetTypeID();
    const obj = this.getFromCacheNoWait(id);
    if (obj == null) {
      const type = clsObj ? XMObject.GetTypeFromClass(clsObj) : null;
      this.getFromSM(id, type, processResult);
    } else {
      // this.log(_m, "Object type:" + type + ",id=" + id + " found in cache.");
      if (callback) { return callback(null, obj); }
      return obj;
    }
  } // getDirect

  /**
   * Get a list of objects.
   *
   * @param ids array of identifiers
   * @param params API arguments or filters
   */
  groupGet(ids, type = null, params = null, remote = true, clsType = XMObject, callback) {
    const _m = 'groupGet';
    this.log(_m, 'ids: ', ids);

    // For now, no cache read
    this.assertNotNull(type, _m);
    this.assertNotNull(ids, _m);

    const om = this;
    const processResult = (err, data) => {
      let xmObjects = null;
      if (err) { om.error(_m, `Get Request (id=${ids} has error:`, err); } else if (Util.NotNull(data)) {
        // om.log(_m, "Returned data based on IDs:", data);
        xmObjects = XMObject.WrapArray(data, clsType);
        om.trackExistingObjects(xmObjects);
      }
      if (callback) { callback(err, xmObjects); } else { return xmObjects; }
    };

    const obj = null; // this.groupGetFromCache(ids, type, null);
    if (obj == null) {
      this.groupGetFromRemote(ids, type, params, processResult);
    } else {
      this.log(_m, `Object type:${type},id=${ids} all found in cache.`);
      if (callback) { return callback(null, obj); }
      return obj;
    }
  }

  /**
   *
   * @param {string} id
   * @param {string} type
   * @param {*} defaultVal
   */
  async getFromCache(id, type = null, defaultVal = null) {
    const c = this._getCache();
    const result = await c.getObject(id, type);
    return result || defaultVal;
  }

  /**
   *
   * @param {string} id
   * @param {string} type
   * @param {*} defaultVal
   */
  getFromCacheNoWait(id, type = null, defaultVal = null) {
    const c = this._getCache();
    const result = c.getObjectNoWait(id, type, false);
    return result || defaultVal;
  }

  /**
   *
   * @param {string} id
   * @param {string} type
   * @param {*} defaultVal
   */
  untrackFromCache(id, type = null, defaultVal = null) {
    const c = this._getCache();
    const result = c.untrack(id);
    return result || defaultVal;
  }

  /**
   * Return requested cached resources from the given list of IDs.
   *
   * @param idArray array of ID strings to look up
   * @param type optional type
   * @param notFoundIds array bucket to add IDs not found in cache
   */
  groupGetFromCache(idArray, type = null, notFoundIds = null) {
    const c = this._getCache();

    // How to indicate those IDs that are NOT in the cache?

    const foundResources = [];
    idArray.forEach((id) => {
      const res = c.getObject(id, type);
      if (res) { foundResources.push(res); } else if (notFoundIds) { notFoundIds.push(id); }
    });
    return foundResources;
  } // groupGetFromCache

  /**
   * Get a single resource beyond cache, which can include local storage (if available)
   * or over the network.
   *
   * @param id   resource id
   * @param type resource type
   * @param callback function to handle post-retrieval processing
   */
  getFromRemote(id, type = null, params = null, callback) {
    const _m = 'getFromRemote';
    // this.log(_m, "id: " + id);
    // this.log(_m, "ClientRole: ", this.isClientRole());
    let result = null;
    if (this.isClientRole()) {
      // for now, client has no local storage
      const nm = this.getNetworkManager();
      result = nm.getResource(id, type, params, callback);
    } else {
      // access StorageManager locally?
      this.error(_m, 'No OPS');
    }
    return result;
  } // getFromRemote

  /**
   * Get a single resource beyond cache, which can include local storage (if available)
   * or over the network.
   *
   * @param id   resource id
   * @param type resource type
   * @param callback function to handle post-retrieval processing
   */
  groupGetFromRemote(idArray, type = null, params = null, callback) {
    const _m = 'groupGetFromRemote';
    this.log(_m, 'ids: ', idArray);
    // this.log("getFromRemote", "ClientRole: ", this.isClientRole());
    if (this.isClientRole()) {
      // for now, client has no local storage
      const nm = this.getNetworkManager();

      nm.getResources(idArray, type, params, callback);
    } else {
      // access StorageManager locally?
      this.error(_m, 'No OPS');
    }
  } // groupGetFromRemote

  /**
   * Get a single resource directly via StorageManager.
   *
   * @param id   resource id
   * @param type resource type
   * @param callback function to handle post-retrieval processing
   */
  getFromSM(id, type, callback) {
    const _m = 'getFromSM';
    this.log(_m, `id: ${id}`);
    let result = null;

    // for now, client has no local storage
    const sm = this.getStorageManager();
    result = sm.getResource(id, type, null, callback);

    return result;
  } // getFromSM

  /**
   * Get a group of resources directly via StorageManager.
   *
   * @param id   resource id
   * @param type resource type
   * @param callback function to handle post-retrieval processing
   */
  groupGetFromSM(idArray, type = null, callback) {
    const _m = 'groupGetFromSM';
    this.log(_m, 'ids: ', idArray);

    // for now, client has no local storage
    const sm = this.getStorageManager();
    sm.getResources(idArray, type, null, callback);
  } // groupGetFromSM

  /**
   * Discard the XMObject instance in the cache,
   * regardless of it's status
   *
   * @param {string} id
   */
  discard(id, type = null) {
    const c = this._getCache();
    return c.untrack(id, type);
  }

  resetCache() {
    const oldCache = this.cache;
    this.cache = new XMCache();

    // attempt to disassociate objects from the old cache
    oldCache.clearAll();
  }


  // *************************************************************
  //
  // Class methods.
  //
  // *************************************************************

  static GetInstance(label = 'default', create = true) {
    if (instances[label]) { return instances[label]; }
    if (!create) { return null; }

    // console.log("ObjectManager.GetInstance: Creating new instance with label: " + label);
    const newInstance = new ObjectManager(label);
    instances[label] = newInstance;
    return newInstance;
  }
}

export default ObjectManager;
