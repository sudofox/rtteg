import { ModelType, XObjectProps } from '../ModelConsts';

import XMList from '../XMList';
import XResultMap from './XResultMap';
import Util from '../../Util';

const _CLSNAME = 'XResultList';

const PROP_QUERY = 'qy';
const PROP_SVCNAME = 'sn';
// const PROP_ENTRYMAP = "cats";
// const PROP_SIZE = "size";

/**
 * Container for result set generated from a query
 * of some kind. It is not necessarily a list.
 * Currently implementation is a map to track
 * all entries.
 *
 *
 */
export class XResultList extends XMList {

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XResultList;
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
     * Output content of this object as an regular
     * object with field value as key.
     *
     * @param {string} fieldKey field to use as the key
     * of the map entries.
     * @return {{}}  null if field key is null, or not
     * found
     */
  asResultMap(fieldKey) {
    if (fieldKey == null) { fieldKey = XObjectProps.ID; }
    const list = this.getList(false);
    const objMap = Util.MapObjectsByField(list, fieldKey);
    return objMap;
  }

  /**
     * Output a map of content in this list as a map
     * with object ID as the key.
     *
     * @return {{string,{}}
     */
  asResultIDMap() {
    return this.asResultMap(XObjectProps.ID);
  }

  /**
     * Output content of this object as an instance
     * of XResultMap.
     *
     * @param {string} fieldKey field to use as the key
     * of the map entries.
     * @return {XResultMap}  null if field key is null, or not
     * found
     */
  asXResultMap(fieldKey) {
    const objMap = this.asResultMap(fieldKey);
    if (objMap == null) { return null; }

    const xResultMap = XResultMap.Create(this.getId(), this.getServiceName(), this.getQuery());
    xResultMap.setEntryMap(objMap);
    return xResultMap;
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
    return ModelType.XRESULT_LIST;
  }

  /**
     * Create new alert list container for serialization.
     *
     * @param {string} id optional for identification purpose
     * @param {string} query original query string for reference
     * @return {XResultList}
     */
  static Create(id = null, service = null, query = null) {
    const list = new XResultList();
    list.initNew();
    if (id) { list._setId(id); }

    if (service) { list.setServiceName(service); }

    if (query) { list.setQuery(query); }

    return list;
  } // Create
}

XResultList.RegisterType(XResultList);

export default XResultList;
