
import XObject from './XObject';

const _CLSNAME = 'XACL'; // match class name

const PERM_OWNER = 'own';
const PERM_USER = 'usr';
const PERM_GROUP = 'grp';
const PERM_PUBLIC = 'pub';

const WHO_TYPES = [PERM_PUBLIC, PERM_OWNER, PERM_USER, PERM_GROUP];

const PERM_NONE = 0b00000000;
const PERM_READ = 0b00000100;
const PERM_WRITE = 0b00000010;
const PERM_EXEC = 0b00000001;
const PERM_RX = PERM_READ | PERM_EXEC;
const PERM_RW = PERM_READ | PERM_WRITE;
const PERM_RWX = PERM_READ | PERM_WRITE | PERM_EXEC;

const PERM_TYPES = [
  PERM_READ, PERM_WRITE, PERM_EXEC,
  PERM_NONE,
  PERM_RW, PERM_RX, PERM_RWX,
];

// refined read actions

// refined write actions


/**
 * Access Control List definition within
 * first class data models (XMObject).
 */
class XACL extends XObject {
  // Constants
  static get PERM_USER() { return PERM_USER; }
  static get PERM_GROUP() { return PERM_GROUP; }
  static get PERM_PUBLIC() { return PERM_PUBLIC; }

  static get PERM_NONE() { return PERM_NONE; }
  static get PERM_READ() { return PERM_READ; }
  static get PERM_WRITE() { return PERM_WRITE; }
  static get PERM_EXEC() { return PERM_EXEC; }
  static get PERM_RW() { return PERM_RW; }
  static get PERM_RX() { return PERM_RX; }
  static get PERM_RWX() { return PERM_RWX; }


  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XACL;
  }

  /**
   * Initialize content as a new object.
   */
  initNew() {
    super.initNew();
  }

  /**
   * Retrieve permission list of either users, group, or public
   * or PERM_PUBLIC.
   * @param jsonRec JSON object
   * @param who either PERM_OWNER, PERM_USER, PERM_GROUP, or PERM_PUBLIC
   */
  getPermissions(who, defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(this.getData(), who, defaultPerm);
  }

  getOwnerPerm(defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(this.getData(), PERM_OWNER, defaultPerm);
  }

  getUserPerm(defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(this.getData(), PERM_USER, defaultPerm);
  }

  getGroupPerm(defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(this.getData(), PERM_GROUP, defaultPerm);
  }

  getPublicPerm(defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(this.getData(), PERM_PUBLIC, defaultPerm);
  }

  setPermission(who, perm) {
    return XACL.SetPermission(this.getData(), who, perm);
  }

  setPublicPerm(perm) {
    return XACL.SetPermission(this.getData(), PERM_PUBLIC, perm);
  }

  /**
   *
   * @param {boolean} clear
   * @return {boolean} true if executed (set or clear)
   */
  setPublicREAD(clear = false) {
    return XACL.SetPublicREAD(this.getData(), clear);
  }

  setUserPerm(perm) {
    return XACL.SetUserPerm(this.getData(), perm);
  }

  clearPermission(who, perm) {
    return XACL.ClearPermission(this.getData(), who, perm);
  }

  clearPublicPerm(perm) {
    return XACL.ClearPublicPerm(this.getData(), perm);
  }

  clearPublicREAD() {
    return XACL.ClearPublicREAD(this.getData());
  }

  clearUserPerm(perm) {
    return XACL.ClearUserPerm(this.getData(), perm);
  }

  clearGroupPerm(perm) {
    return XACL.ClearGroupPerm(this.getData(), perm);
  }


  /**
   * Check given permission against permission list of who (users,
   * group, or public) or PERM_PUBLIC.
   * *
   * @param jsonRec JSON object
   * @param who either PERM_USER, PERM_GROUP, or PERM_PUBLIC
   */
  checkPerm(who, perm) {
    return XACL.CheckPerm(this.getData(), who, perm);
  }

  checkOwnerPerm(perm) {
    return XACL.CheckPerm(this.getData(), PERM_OWNER, perm);
  }

  checkUserPerm(perm) {
    return XACL.CheckPerm(this.getData(), PERM_USER, perm);
  }

  checkGroupPerm(perm) {
    return XACL.CheckPerm(this.getData(), PERM_GROUP, perm);
  }

  checkPublicPerm(perm) {
    return XACL.CheckPerm(this.getData(), PERM_PUBLIC, perm);
  }

  checkPublicREAD() {
    return XACL.CheckPerm(this.getData(), PERM_PUBLIC, PERM_READ);
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
   * Return the default folder/table/collection name used
   * for storing stats.
   *
   * NOTE: currently this is used as an embedded object,
   * and not a first class object for persistence.
   */
  static GetFolderName() {
    return 'acl';
  }


  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return 'acl';
  }

  static CreateNew() {
    const acl = new XACL();
    acl.initNew();

    return acl;
  }

  /**
   * Wrap JSON data that represents this object
   */
  static Wrap(jsonRec, clsType = XACL) {
    return XACL.WrapXObject(jsonRec, clsType);
  }

  static IsValidWho(who) {
    return WHO_TYPES.indexOf(who) !== -1;
  }

  static IsValidPermValue(perm) {
    return PERM_TYPES.indexOf(perm) !== -1;
  }

  static AssertValidWho(who, method) {
    return XACL.Assert(WHO_TYPES.indexOf(who) !== -1, _CLSNAME, method,
      "Input ACL parameter for 'who' is not valid: ", who);
  }

  static AssertValidPermValue(perm, method, msg, ...args) {
    return XACL.Assert(PERM_TYPES.indexOf(perm) !== -1, _CLSNAME, method,
      'Permission value is not valid: ', perm);
  }

  /**
   * Retrieve permission list of either users, group, or public
   * or PERM_PUBLIC.
   * @param {{}} jsonRec JSON object
   * @param {string} who either PERM_OWNER, PERM_USER, PERM_GROUP, or PERM_PUBLIC
   */
  static GetPermissions(jsonRec, who, defaultPerm = PERM_NONE) {
    XACL.AssertValidWho(who, 'GPm');
    return jsonRec.hasOwnProperty(who) ? jsonRec[who] : defaultPerm;
  }

  static GetOwnerPerm(jsonRec, defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(jsonRec, PERM_OWNER, defaultPerm);
  }

  static GetUserPerm(jsonRec, defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(jsonRec, PERM_USER, defaultPerm);
  }

  static GetGroupPerm(jsonRec, defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(jsonRec, PERM_GROUP, defaultPerm);
  }

  static GetPublicPerm(jsonRec, defaultPerm = PERM_NONE) {
    return XACL.GetPermissions(jsonRec, PERM_PUBLIC, defaultPerm);
  }

  static IsPublicREAD(jsonRec, defaultVal = false) {
    return jsonRec ? ((XACL.GetPublicPerm() & PERM_READ) > 0) : defaultVal;
  }

  /**
   * Set permission bits.
   *
   * @param {object} jsonRec object that has permissions
   * stored as a property.
   * @param {*} who property storing the permission, which can
   * be labels stored in constants PERM_OWNER, PERM_USER, PERM_PUBLIC
   * @param {*} perm permission bits (3 bits)
   * @return {boolean} true if set, false if not set which usually
   * mean "who" is not valid or value hasn't change.
   */
  static SetPermission(jsonRec, who, perm) {
    if (!XACL.AssertValidWho(who, 'SetPermissions')) { return false; }
    if (!jsonRec.hasOwnProperty(who)) { jsonRec[who] = 0; }
    if ((jsonRec[who] & perm) !== perm) {
      jsonRec[who] |= perm;
      return true;
    }
    return false;
  }

  static SetPublicPerm(jsonRec, perm, clear = false) {
    // should check if existing permission allow setting of the new

    if (clear) { return XACL.ClearPermission(jsonRec, PERM_PUBLIC, perm); }
    return XACL.SetPermission(jsonRec, PERM_PUBLIC, perm);
  }

  static SetPublicREAD(jsonRec, clear = false) {
    return XACL.SetPublicPerm(jsonRec, PERM_READ, clear);
  }

  static SetOwnerPerm(jsonRec, perm) {
    return XACL.SetPermission(jsonRec, PERM_OWNER, perm);
  }

  static SetOwnerREAD(jsonRec) {
    return XACL.SetOwnerPerm(jsonRec, PERM_READ);
  }

  static SetUserPerm(jsonRec, perm) {
    return XACL.SetPermission(jsonRec, PERM_USER, perm);
  }

  static SetUserREAD(jsonRec) {
    return XACL.SetUserPerm(jsonRec, PERM_READ);
  }

  static SetGroupREAD(jsonRec) {
    return XACL.SetGroupPerm(jsonRec, PERM_READ);
  }

  /**
   *
   * @param {*} jsonRec
   * @param {*} who oen of PERM_OWNER, PERM_USER, PERM_PUBLIC
   * @param {*} perm
   * @return {boolean} true if successfully cleared
   */
  static ClearPermission(jsonRec, who, perm) {
    if (!XACL.AssertValidWho(who, 'ClearPermissions')) { return false; }
    if (!jsonRec.hasOwnProperty(who)) { jsonRec[who] = 0; }
    // console.log("Inverted permission: ", perm, " is: ", ~perm);
    jsonRec[who] &= ~perm;
    return true;
  }

  static ClearPublicPerm(jsonRec, perm) {
    return XACL.ClearPermission(jsonRec, PERM_PUBLIC, perm);
  }

  static ClearPublicREAD(jsonRec) {
    return XACL.ClearPermission(jsonRec, PERM_PUBLIC, PERM_READ);
  }

  static ClearOwnerPerm(jsonRec, perm) {
    return XACL.ClearPermission(jsonRec, PERM_OWNER, perm);
  }

  static ClearUserPerm(jsonRec, perm) {
    return XACL.ClearPermission(jsonRec, PERM_USER, perm);
  }

  static ClearGroupPerm(jsonRec, perm) {
    return XACL.ClearPermission(jsonRec, PERM_GROUP, perm);
  }


  /**
   * Check given permission against permission list of who (users,
   * group, or public) or PERM_PUBLIC.
   * *
   * @param {{}} jsonRec JSON object
   * @param {string} who either PERM_USER, PERM_GROUP, or PERM_PUBLIC
   * @param {string} perm permission to check. This can be PERM_NONE for undefined permission
   */
  static CheckPerm(jsonRec, who, perm) {
    const permValue = XACL.GetPermissions(jsonRec, who, PERM_NONE);
    if (permValue === perm) { return true; }    // mainly for matching zero (PERM_NONE)
    return (permValue & perm) > 0;
  }

  static CheckOwnerPerm(jsonRec, perm) {
    return XACL.CheckPerm(jsonRec, PERM_OWNER, perm);
  }

  static CheckUserPerm(jsonRec, perm) {
    return XACL.CheckPerm(jsonRec, PERM_USER, perm);
  }

  static CheckGroupPerm(jsonRec, perm) {
    return XACL.CheckPerm(jsonRec, PERM_GROUP, perm);
  }

  static CheckPublicPerm(jsonRec, perm) {
    return XACL.CheckPerm(jsonRec, PERM_PUBLIC, perm);
  }

  static CheckPublicREAD(jsonRec) {
    return XACL.CheckPerm(jsonRec, PERM_PUBLIC, PERM_READ);
  }
} // XACL

XACL.RegisterType(XACL);

export default XACL;
