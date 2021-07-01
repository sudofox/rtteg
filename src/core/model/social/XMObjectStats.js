
import XObject from '../XObject';

import { UserProps, StatsProps } from '../ModelConsts';
import Util from '../../Util';

const _CLSNAME = 'XMObjectStats'; // match class name


/**
 * Container for statistics retrieved from server (cache)
 * and used in clients.
 */
class XMObjectStats extends XObject {

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMObjectStats;

    // Set by subclass, not at this level
    // this._setTypeID();
  }

  /**
     * Initialize content as a new object.
     */
  initNew() {
    super.initNew();
  }

  /**
     * UserId is set from server side extracting content from
     * XMUser and other related objects. It is actually the _id
     * field (primary key).
     *
     * @param {string} defaultVal
     * @return {string}
     */
  getUserId(defaultVal) {
    const data = this.getData(false);
    return data ? XMObjectStats.GetUserId(data, defaultVal) : defaultVal;
  }

  /**
     *
     * @param {string} nickname
     */
  setNickname(nickname) {
    return XMObjectStats.SetNickname(this.getData(true), nickname);
  }

  /**
     *
     * @param {string} useUsername
     * @param {*} defaultVal
     * @return {string}
     */
  getNickname(useUsername = true, defaultVal = null) {
    const data = this.getData(false);
    return XMObjectStats.GetNickname(data, useUsername, defaultVal);
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  static GetTypeID() {
    return 'objstats_base';
  }

  static GetName() {
    return _CLSNAME;
  }

  /**
   * Create an stat info object and import stats
   * from props. This is a template class and should
   * be overridden by subclass
   *
   * @param {string} objId
   * @return {XMObjectStats}
   */
  static CreateNew(objId, props) {
    const statObj = new XMObjectStats();
    statObj._setId(objId);
    if (props) { statObj.importObjectFields(props); }

    return statObj;
  } // CreateNew

  static SetUserId(jsonRec, userId) {
    return XMObjectStats.SetId(jsonRec, userId);
  }

  static GetUserId(jsonRec, defaultVal = null) {
    return XMObjectStats.GetId(jsonRec, defaultVal);
  }

  static SetUsername(jsonRec, username) {
    return XMObjectStats.SetObjectField(jsonRec, UserProps.USERNAME, username);
  }

  static GetUsername(jsonRec, useMail = true, defaultVal = null) {
    let username = XMObjectStats.GetObjectField(jsonRec, UserProps.USERNAME, null);
    if (username == null) { username = XMObjectStats.GetUserId(jsonRec, null); }
    if ((username == null) && (useMail === true)) {
      username = XMObjectStats.GetEmail(jsonRec, null);
    }
    return username || defaultVal;
  }


} // class XMObjectStats

XMObjectStats.RegisterType(XMObjectStats);

export default XMObjectStats;
