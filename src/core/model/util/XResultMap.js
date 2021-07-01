import XObject from '../XObject';
// import XMList from "./XMList";
import { ModelType } from '../ModelConsts';
import XResultList from './XResultList';
import Util from '../../Util';

const _CLSNAME = 'XResultMap';

const PROP_QUERY = 'qy';
const PROP_SVCNAME = 'sn';
const PROP_ENTRYMAP = 'cats';
const PROP_SIZE = 'size';

/**
 * Container for result set generated from a query
 * of some kind. It is not necessarily a list.
 * Currently implementation is a map to track
 * all entries.
 *
 *
 */
export class XResultMap extends XObject {

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XResultMap;
    this._setTypeID();
  }

  /**
   *
   * @param {string} s original query string/phrase
   */
  setQuery(s) {
    return s ? this.set(PROP_QUERY, s) : null;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getQuery(defaultVal = null) {
    return this.get(PROP_QUERY, defaultVal);
  }

  /**
   *
   * @param {string} n
   * @return {string}
   */
  setServiceName(n) {
    return n ? this.get(PROP_SVCNAME, n) : null;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string}
   */
  getServiceName(defaultVal = null) {
    return this.get(PROP_SVCNAME, defaultVal);
  }

  /**
   *
   * @param {{}} objMap
   * @return {{}} previous map
   */
  setEntryMap(objMap) {
    const size = objMap ? Object.keys(objMap).length : 0;
    this.set(PROP_SIZE, size);  // cache size to avoid expensive op on getSize()
    return (size > 0) ? this.set(PROP_ENTRYMAP, objMap) : null;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {{}}
   */
  getEntryMap(defaultVal = null) {
    return this.get(PROP_ENTRYMAP, defaultVal);
  }

  /**
   * Return result entries in an array format.
   * NOTE: give the result is stored as a map,
   * this has an O(n) performance to extract the
   * array.
   *
   * @param {*} defaultVal
   * @return {*[]} array of items
   */
  getList(defaultVal = null) {
    const entryMap = this.getEntryMap(null);
    return entryMap ? Object.values(entryMap) : null;
  }

  /**
   * Return the XResultList equivalent of this Map.
   *
   * @param {string} keyField if not null, then the key
   * value will be inserted into the item (json) as a
   * field and use this as the property label.
   * @param {string} sort enable sorting of KEY. Null means none,
   * 'a' for ascending, 'd' for descending.
   */
  asXResultList(keyField = null, sort = null) {
    const id = this.getId();
    const serviceName = this.getServiceName();
    const query = this.getQuery();
    const resultList = XResultList.Create(id, serviceName, query);

    let itemList;
    if (keyField == null) { itemList = this.getList(); } else {
      itemList = [];
      const entryMap = this.getEntryMap(null);
      const keys = entryMap ? Object.keys(entryMap) : null;
      if (sort) {
        keys.sort();
        if (sort === 'd') { keys.reverse(); }
      }
      const count = keys ? keys.length : 0;
      let key;
      let value;
      for (let i = 0; i < count; i++) {
        key = keys[i];
        // if (!key) { }   // may have some nulls
        value = entryMap[key];
        if (value == null) { continue; }
        value[keyField] = key;
        itemList.push(value);
      }
    }
    resultList.setList(itemList);
    return resultList;
  } // asXResultList

  getEntryKeys(defaultVal = null) {
    const entryMap = this.getEntryMap(null);
    return entryMap ? Object.keys(entryMap) : defaultVal;
  }

  getEntryValues(defaultVal = null) {
    const entryMap = this.getEntryMap(null);
    return entryMap ? Object.values(entryMap) : defaultVal;
  }

  /**
   * Return a value associated with the given key/id
   *
   * @param {string} key
   * @param {*} defaultVal
   * @return {*} value associated with the given key
   */
  getEntryValue(key, defaultVal = null) {
    const entryMap = this.getEntryMap(null);
    const value = entryMap ? entryMap[key] : null;
    return value || defaultVal;
  }

  hasEntry(key) {
    const entryMap = this.getEntryMap(null);
    return entryMap ? Util.NotNull(entryMap[key]) : false;
  }

  /**
   *
   * @param {string} key
   * @return {boolean} true if removed, false if not found
   */
  removeEntry(key) {
    const entryMap = this.getEntryMap(null);
    if (entryMap && entryMap.hasOwnProperty(key)) {
      delete entryMap[key];
      return true;
    }
    return false;
  }

  /**
   * Return the size of entries in the previously
   * set EntryMap. The setEntryMap should've set the
   * size already, but if not this method will lazy-derive
   * if necessary.
   *
   * @param {*} defaultVal
   * @return {number} number of entries, or defaultVal
   */
  getEntryCount(defaultVal = 0) {
    let size = this.getNumber(PROP_SIZE, null);
    if (size == null) {
      const entryMap = this.getEntryMap(null);
      size = entryMap ? Object.keys(entryMap).length : 0;
      this.set(PROP_SIZE, size);
    }
    return size;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} number of entries, or defaultVal
   */
  size() {
    return this.getEntryCount(0);
  }


  // *************************************************************
  //
  // Class/static methods. This should also include any
  // methods that can be used as helper for generic
  // JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************
  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return ModelType.XRESULT_MAP;
  }

  /**
   * Create new alert list container for serialization.
   *
   * @param {string} id optional for identification purpose
   * @param {string} query original query string for reference
   * @return {XResultMap}
   */
  static Create(id = null, service = null, query = null) {
    const list = new XResultMap();
    list.initNew();
    if (id) { list._setId(id); }

    if (service) { list.setServiceName(service); }

    if (query) { list.setQuery(query); }

    return list;
  } // Create
}

XResultMap.RegisterType(XResultMap);

export default XResultMap;
