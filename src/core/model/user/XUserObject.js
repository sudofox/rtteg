
import XObject from '../XObject';
import { DISABLED_FEATURES, ENABLED_FEATURES, FEATURE_AUTO_FOLLOW, LanguageCodes, UserProps } from '../ModelConsts';
import XMObject from '../XMObject';
import Util from '../../Util';
import TagUtil from '../../util/TagUtil';

const _CLSNAME = 'UserHelper';

/**
 * Abstract Base class for XMUser and XUserInfo, since they
 * share a lot of the methods and properties.
 *
 * This was formerly UserHelper, grouping of utility functions
 * on both objects.
 *
 */
class XUserObject extends XMObject {
  // constants to share with consumer of this class
  // constants to share with consumer of this class
  static get APP_ROLES() { return UserProps.APPUSER_ROLES; }
  static get ROLE_ROOT() { return UserProps.ROLE_ROOT; }
  static get ROLE_ADMIN() { return UserProps.ROLE_ADMIN; }
  static get ROLE_SYSADM() { return UserProps.ROLE_SYSADM; }
  static get ROLE_MODERATOR() { return UserProps.ROLE_MODERATOR; }

  static get FEATURE_PREVIEW() { return UserProps.FEATURE_PREVIEW; }

  constructor(clsname = _CLSNAME, props = null) {
    super(clsname, props);
    this.class = XUserObject; // override by subclass
  }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   *
   * @param {string} defaultVal
   * @return {string}
   */
  getUserId(defaultVal) { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   *
   * @param {string} userId
   */
  setUserId(userId) { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   *
   * @param {string} defaultVal
   * @return {string}
   */
  getUsername(defaultVal = null) { }

  /**
   * Return original username, which is stored during signup to
   * ensure the intended case.
   *
   * @param {*} defaultVal
   * @return {string}
   */
  setOriginalUsername(username) {
    const data = this.getData(true);
    const previousValue =  XUserObject.SetOriginalUsername(data, username);
    if (previousValue !== username) {
      this.setDirty();
    }
    return previousValue;
  }


  /**
   * Return original username, which is stored during signup to
   * ensure the intended case.
   *
   * @param {boolean} fallback true to use username if there is no value
   * @return {string}
   */
  getOriginalUsername(fallback = true, defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserObject.GetOriginalUsername(data, fallback, defaultVal) : defaultVal;
  }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   *
   * @param {string} username
   */
  setUsername(username) { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   *
   * @param {string} defaultVal
   * @return {string}
   */
  getEmail(defaultVal) { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   *
   * @param {string} username
   */
  setEmail(email) { }

  /**
   * Set user's BIO. This is a convenient "semantically"
   * consistent method to a description attached to an
   * XObject.
   *
   * @param {string} langCode language code (see LanguageCodes.*)
   * @return {string} previous value
   */
  setBIO(text) {
    return this.setDescription(text);
  }

  /**
   * Return user's BIO (description)
   *
   * @param {string} defaultVal
   * @return {string} stored language preference, or default value
   * if none
   */
  getBIO(defaultVal = null) {
    return this.getDescription(defaultVal);
  }


  /**
   * Set the language preference that will be stored
   * in database.
   *
   * @param {string} langCode language code (see LanguageCodes.*)
   * @return {string} previous value
   */
  setLanguagePref(langCode) {
    return this.set(UserProps.LANGUAGE, langCode);
  }

  /**
   * Return the language preference stored in database for
   * this user.
   *
   * @param {string} defaultVal
   * @return {string} stored language preference, or default value
   * if none
   */
  getLanguagePref(defaultVal = LanguageCodes.DEFAULT) {
    return this.get(UserProps.LANGUAGE, defaultVal);
  }

  /**
   * Check if the given language is compatible with the language
   * preference of this user object. Being compatible is more
   * cultural, for example, Chinese would be either simplified
   * or traditional Chinese writing.
   *
   * @param {string} lang see LanguageCodes.*
   * @return {boolean}
   */
  isCompatibleLanguage(lang) {
    const data = this.getData(false);
    return data ? XUserObject.IsCompatibleLanguage(data, lang) : false;
    // if (lang == null) { lang = LanguageCodes.DEFAULT; }
    // const langPref = this.getLanguagePref();
    // if (langPref === lang) { return true; }

    // return (Util.IsChinese(langPref) && Util.IsChinese(lang));
  }


  /**
   * Set a list of topic Ids that the user is interested.
   *
   * NOTE: This should not be used directly. There is
   * XInterestSettings as transient object to get/set
   * topics in UserService on the backend
   *
   * @param {string} topicIds language code (see LanguageCodes.*)
   * @return {string} previous value
   *
   * @see XInterestSettings
   */
  setTopics(topicIds) {
    return this.set(UserProps.PREF_TOPICS, topicIds);
  }

  /**
   * Return the interested topics
   *
   * @param {string} defaultVal
   * @return {string[]} topicId array
   *
   * @see XInterestSettings
   */
  getTopics(defaultVal = null) {
    return this.get(UserProps.PREF_TOPICS, defaultVal);
  }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   * Return all roles added to this user
   *
   * @param {*} defaultVal
   */
  getRoles(defaultVal = null) { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   * Get role definition for a given role
   *
   * @param {string} roleId
   * @param {*} defaultVal
   * @return {{}} properties for the role, if it exists
   *
   * @see #addRole
   * @see #removeRole
   * @see #hasRole
   */
  getRole(roleId, defaultVal = null) { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   * Determine if a role is defined.
   *
   * @param {string} roleId one of ROLE_*
   * @return {boolean} true if role is defined regardless of stored properties
   *
   * @see #addRole
   * @see #getRole
   * @see #removeRole
   */
  hasRole(roleId) { }

  /**
   * @return {boolean}
   */
  hasGodRole() { }


  /**
   * [ABSTRACT: Implemented by Subclasses]
   * Determine if this user has sys admin role
   *
   * @return {boolean} true if the record indicate admin,
   * or root priv
   */
  hasAdminRole() { }

  /**
   * [ABSTRACT: Implemented by Subclasses]
   * Determine if this user has sys admin role
   *
   * @return {boolean} true if the record indicate sys admin,
   * or root priv
   */
  hasSysAdminRole() { }

  /**
   * Determine if the user is an influencer, and return its level.
   *
   * @return {number} between INFLUENCER_LEVEL_MIN(1) and INFLUENCER_LEVEL_MAX(9).
   * 0 means not influencer
   */
  isInfluencer(defaultVal = 0) {
    const data = this.getData(false);
    return data ? XUserObject.IsInfluencer(data, defaultVal) : defaultVal;
  }


  /**
   * Report on whether this user is the top level influencer
   * with highest level INFLUENCER_LEVEL_MAX.
   *
   * @return {boolean} true if at max level
   */
  isSuperInfluencer() {
    return this.isInfluencer() === UserProps.INFLUENCER_LEVEL_MAX;
  }

  /**
   * @param {*} jsonRec
   * @return {number} role level
   */
  getInfluencerLevel() {
    const jsonRec = this.getData(false);
    const influencerRole = this.getRole(UserProps.ROLE_INFLUENCER);
    const level = influencerRole ? influencerRole[UserProps.PROP_INFLUENCER_LEVEL] : jsonRec[UserProps.ROLE_INFLUENCER];
    return (level == null) ? 0 : Util.toNumber(level);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string[]}
   */
  getEnabledFeatures(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserObject.GetEnabledAppFeatureList(data, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string[]}
   */
  getDisabledFeatures(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserObject.GetEnabledAppFeatureList(data, defaultVal) : defaultVal;
  }

  /**
   * Determine if the given feature is on either the user's disable feature list,
   * or system-wide disable list for the user level.
   *
   * @param {string} featureId
   * @param {*} defaultVal if no object!
   * @return {boolean} true if given feature Id is on either disabled lists
   */
  isAppFeatureDisabled(featureId, defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserObject.IsAppFeatureDisabled(data, featureId) : defaultVal;
  }

  /**
   * Determine if the user has feature to have all new users automatically
   * following. This is just a convenient method.
   *
   * @return {boolean} true if the user as the auto follow feature
   */
  newUserAutoFollow() {
    return this.hasAppFeature(FEATURE_AUTO_FOLLOW, false);
  }


  // --------------------- APP FEATURE ---------------------------

  /**
   * Retrieve the all properties of a feature within the feature
   * group FEATURE_GROUP_APP.
   *
   * @param {*} featureId
   * @param {*} defaultVal
   * @return {{}} properties of the feature
   */
  getAppFeature(featureId, defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserObject.GetAppFeature(data, featureId, defaultVal) : defaultVal;
  }

  /**
   * Determine if there exist of a feature within the feature group FEATURE_GROUP_APP
   *
   * @param {string} featureId
   * @param {boolean} defaultVal default is true (assuming not explcit)
   * @return {boolean} true if the record indicate sys admin or root
   */
  hasAppFeature(featureId, defaultVal = false) {
    const data = this.getData(false);
    return data ? XUserObject.HasAppFeature(data, featureId, defaultVal) : defaultVal;
  }

  /**
   * Add a feature to the FEATURE_GROUP_APP feature group
   *
   * @param {string} featureId
   * @return {boolean} true if set, false if not
   */
  addAppFeature(featureId, propertyName = null) {
    const data = this.getData(true);
    return XUserObject.AddAppFeature(data, featureId, propertyName);
  }

  /**
   * Remove a feature from the feature group FEATURE_GROUP_APP
   *
   * @return {boolean} true if removed, false if not
   */
  removeAppFeature(featureId) {
    const data = this.getData(false);
    if (data == null) {
      return false;
    }

    return data ? XUserObject.RemoveAppFeature(data, featureId) : false;
  }

  /**
   * Add the given feature id to user's disable list.
   *
   * @param {object} jsonRec
   * @param {string} featureId
   * @return {boolean} true if added to disable list
   */
  disableAppFeature(featureId) {
    const data = this.getData(true);
    const updated = XUserObject.DisableAppFeature(data, featureId);
    if (updated) {
      this.setDirty();
    }
    return updated;
  }

  /**
   *
   * @param {string} feautureId
   * @return {boolean}
   */
  removeDisabledAppFeature(featureId) {
    const data = this.getData(true);
    const updated = XUserObject.RemoveDisabledAppFeature(data, featureId);
    if (updated) {
      this.setDirty();
    }
    return updated;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string[]}
   */
  getEnabledAppFeautureList(defaultVal = []) {
    const data = this.getData(false);
    return data ? XUserObject.GetEnabledAppFeatureList(data, defaultVal) : defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string[]}
   */
  getDisabledAppFeautureList(defaultVal = []) {
    const data = this.getData(false);
    return data ? XUserObject.GetDisabledAppFeatureList(data, defaultVal) : defaultVal;
  }

  /**
   * Get user status string
   *
   * @param {*} defaultVal
   * @return {string=} status indicator (UserProps.STATUS_)
   */
  getStatus(defaultVal = null) {
    const data = this.getData(false);
    return XUserObject.GetStatus(data, defaultVal);
  }

  /**
   * Timestamp of the status update. This may not be
   * stored in XUserInfo.
   *
   * @param {*} defaultVal
   * @return {number}
   */
  getStatusTS(defaultVal = null) {
    const data = this.getData(false);
    return data ? XUserObject.GetStatusTS(data, defaultVal) : defaultVal;
  }

  /**
   * Return whether this user has active status
   *
   * @return {boolean}
   */
  isActive() {
    const data = this.getData(false);
    return data ? XUserObject.IsActive(data) : false;
  }

  /**
   * Return whether this user has new / unverified status
   *
   * @return {boolean} true if status is new, or no status at all
   */
  isUnverified() {
    const data = this.getData(false);
    return data ? XUserObject.IsUnverified(data) : false;
  }

  /**
   * Return whether this user has suspended status
   *
   * @return {boolean}
   */
  isSuspended() {
    const data = this.getData(false);
    return data ? XUserObject.IsSuspended(data) : false;
  }


  // -------------------------- PIN POSTS ------------------------------

  /**
   * Add a post as pinned. Because it is an array, this will
   * append to the end of the list
   *
   * @param {string} postId
   *
   * @see ~removePinnedPost
   * @see ~getPinnedPosts
   * @return {boolean} true if added, false if not which can be due to already exist
   */
  addPinnedPost(postId) {
    return XUserObject.AddPinnedPost(this.getData(true), postId);
  } // addPinnedPost

  /**
   * Set list of postIds as pinned
   *
   * @param {[]} postIds if non-null, will replace everything, INCLUDING empty array
   * @return {boolean} true if set, false if array is empty or content is same.
   */
  setPinnedPosts(postIds) {
    return XUserObject.SetPinnedPosts(this.getData(true), postIds);
  }

  /**
   * Return list of postIds for pinned posts
   *
   * @param {*} defaultVal
   */
  getPinnedPosts(defaultVal = []) {
    const data = this.getData(false);
    return data ? XUserObject.GetPinnedPosts(data, defaultVal) : defaultVal;
  }

  /**
   * Remove a pinned post
   *
   * @param {string} postId post to remove from pinned list
   * @return {boolean} true if removed
   *
   * @see #addPinnedPost
   * @see #getPinnedPosts
   */
  removePinnedPost(postId) {
    const data = this.getData(false);
    return data ? XUserObject.RemovePinnedPost(data, postId) : null;
  }

  /**
   * Report on whether a given postId is found in the pinned post list
   *
   * @param {string} postId post to check in pinned list
   * strip any expressions
   * @return {boolean} true if exists
   */
  hasPinnedPost(postId) {
    const data = this.getData(false);
    return data ? XUserObject.HasPinnedPost(data, postId) : false;
  }

  /**
   * Count number of posts pinned
   *
   * @return {number}
   */
  getPinnedPostCount(jsonObj) {
    const data = this.getData(false);
    return data ? XUserObject.GetPinnedPostCount(data) : 0;
  } // getPinnedPostCount

  /**
   * Return the position of the specified post in pinned list
   *
   * @param {string} nameCheck tagname to check.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  indexOfPinnedPost(postId) {
    const data = this.getData(false);
    return data ? XUserObject.IndexOfPinnedPost(data, postId) : -1;
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************


  /**
   * Get user status
   *
   * @param {{}} jsonRec
   * @param {*} defaultVal in case no status. This can be UserProps.STATUS_UNVERIFIED
   */
  static GetStatus(jsonRec, defaultVal = null) {
    return XUserObject.GetObjectField(jsonRec, UserProps.STATUS, defaultVal);
  }


  /**
   * Get user status
   *
   * @param {{}} jsonRec
   * @param {*} defaultVal
   */
  static GetStatusTS(jsonRec, defaultVal = null) {
    return XUserObject.GetObjectField(jsonRec, UserProps.STATUS_TS, defaultVal);
  }

  /**
   * Answers whether the given user record has a status field that says "active"
   *
   * @param {*} jsonRec
   * @return {boolean} true if status is STATUS_ACTIVE
   */
  static IsActive(jsonRec) {
    const status = XUserObject.GetStatus(jsonRec, UserProps.STATUS);
    return status ? (status === UserProps.STATUS_ACTIVE) : false;
  }

  /**
   * Answers whether the given user record has a status field that says "new"
   *
   * @param {*} jsonRec
   * @return {boolean} true if status is STATUS_NEW. If there is no status,
   * then that's equivalent of new status
   */
  static IsUnverified(jsonRec) {
    const status = XUserObject.GetStatus(jsonRec, UserProps.STATUS);
    return status ? (status === UserProps.STATUS_UNVERIFIED) : true;
  }

  /**
   * Answers whether the given user record has a status field that says "suspended"
   *
   * @param {*} jsonRec
   * @return {boolean} true if status is STATUS_SUSPENDED
   */
  static IsSuspended(jsonRec) {
    const status = XUserObject.GetStatus(jsonRec, UserProps.STATUS);
    return status ? (status === UserProps.STATUS_SUSPENDED) : false;
  }


  /**
   *
   * @param {object} jsonRec
   * @param {*} defaultVal
   * @return {string} stored language code, or LanguageCodes.DEFAULT (en)
   */
  static GetLanguagePref(jsonRec, defaultVal = LanguageCodes.DEFAULT) {
    return XUserObject.GetObjectField(jsonRec, UserProps.LANGUAGE, defaultVal);
  }

  /**
   * Check if the given language is compatible with the language
   * preference of this user object. Being compatible is more
   * cultural, for example, Chinese would be either simplified
   * or traditional Chinese writing.
   *
   * @param {object} jsonRec
   * @param {string} lang see LanguageCodes.* null return automatic true
   * @return {boolean}
   */
  static IsCompatibleLanguage(jsonRec, lang) {
    if (Util.StringIsEmpty(lang)) {
      return true;
    }
    const langPref = XUserObject.GetLanguagePref(jsonRec);
    if (langPref === lang) { return true; }

    return (Util.IsChinese(langPref) && Util.IsChinese(lang));
  }


  // ----------------------- USER ROLES -----------------------------

  /**
     * Set roles object. Do not use this directly. Use
     * AddRole and RemoveRole.
     *
     * @param {{}} jsonRec
     * @param {{}} roles an object with roles as property
     *
     * @see ~AddRole
     * @see ~RemoveRole
     * @see ~GetRole
     */
  static SetRoles(jsonRec, roles) {
    return XObject.SetObjectField(jsonRec, UserProps.APPUSER_ROLES, roles);
  }

  /**
     * Add a role to the auth record
     *
     * @param {object} jsonRec
     * @param {string} roleId one of AUTH_ROLE_*
     * @param {object} properties optional property details. This
     * can be individually added later
     * @return {boolean} true if added, false if not for various reasons
     *
     * @see #GetRole
     * @see #RemoveRole
     */
  static AddRole(jsonRec, roleId, properties = null) {
    const _m = `${_CLSNAME}.AddRole`;
    if (roleId == null) {
      console.error(_m, 'Adding null role is not allowed.');
      return false;
    }
    let roles = XUserObject.GetRoles(jsonRec, null);
    let roleAdded = false;
    if (roles == null) {
      roles = {};
      XUserObject.SetRoles(jsonRec, roles);
    }
    if (!roles.hasOwnProperty(roleId)) {
      roles[roleId] = {};
      roleAdded = true;
    }
    if (Util.NotNull(properties)) {
      roles[roleId] = { ...roles[roleId], ...properties };
      roleAdded = true;
    }
    return roleAdded;
  }

  /**
     *
     * @param {{}} jsonRec
     * @param {*} defaultVal
     */
  static GetRoles(jsonRec, defaultVal = null) {
    return XObject.GetObjectField(jsonRec, UserProps.APPUSER_ROLES, defaultVal);
  }

  /**
   * Return the desired role sub-object within the roles object
   * within the given authInfo json data.
   *
   * @param {{}} jsonRec XAuthInfo json data
   * @param {string} role one of AUTH_ROLE_*
   * @return {object} properties stored for the given role.
   * If no properties, empty object should be returned. Null
   * or defaultVal imply not found.
   * @see #AddRole
   * @see #RemoveRole
   */
  static GetRole(jsonRec, role, defaultVal = null) {
    const roles = XUserObject.GetRoles(jsonRec);
    if (roles == null) { return defaultVal; }
    const roleObj = roles[role];
    return (Util.NotNull(roleObj)) ? roleObj : defaultVal;
  } // GetRole

  /**
   * Return the desired role sub-object within the roles object
   * within the given authInfo json data.
   *
   * @param {{}} jsonRec XAuthInfo json data
   * @param {string} role one of AUTH_ROLE_*
   * @return {boolean} true if removed, false if not found
   *
   * @see #AddRole
   * @see #RemoveRole
   */
  static RemoveRole(jsonRec, role) {
    const roles = XUserObject.GetRoles(jsonRec);
    if (roles == null) { return false; }
    const roleObj = roles[role];
    if (roleObj == null) { return false; }   // not found
    delete roles[role];
    return true;
  } // RemoveRole

  static SetAdminRole(jsonRec) {
    return XUserObject.AddRole(jsonRec, UserProps.ROLE_ADMIN);
  }

  static SetSysAdminRole(jsonRec) {
    return XUserObject.AddRole(jsonRec, UserProps.ROLE_SYSADM);
  }

  static SetModeratorRole(jsonRec) {
    return XUserObject.AddRole(jsonRec, UserProps.ROLE_MODERATOR);
  }

  /**
   * Determine if the authinfo has the given role
   *
   * @param {object} jsonRec XAuthInfo json data
   * @param {string} role one of AUTH_ROLE_*
   * @return {boolean} true if the record indicate the given role,
   * or if AUTH_ROLE_ROOT is present.
   */
  static HasRole(jsonRec, role) {
    const roles = XUserObject.GetRoles(jsonRec);
    if (roles == null) { return false; }
    let exists = roles.hasOwnProperty(role);
    if (!exists) { exists = roles.hasOwnProperty(UserProps.ROLE_ROOT); }
    return exists;
  }
  /**
   * Retrieve property value of a given role if any
   *
   * @param {object} jsonRec XAuthInfo json data
   * @param {string} role one of ROLE_*
   * @param {string} label property label to look
   * @return {object} value associated with label, or defaultVal
   */
  static GetRoleProperty(jsonRec, role, label, defaultVal = null) {
    const roles = XUserObject.GetRoles(jsonRec);
    if (roles == null) { return false; }
    const roleDef = roles[role];
    if (roleDef == null) { return defaultVal; }
    const rolePropValue = roleDef[label];
    return rolePropValue || defaultVal;
  } // GetRoleProperty

  /**
   * Determine if the user has sys admin role
   *
   * @param {{}} json object for user
   * @return {boolean} true if the record indicate sys admin,
   * or root priv
   */
  static HasAdminRole(jsonRec) {
    return XUserObject.HasRole(jsonRec, UserProps.ROLE_ADMIN);
  }

  /**
   * Determine if the authinfo has sys admin role
   *
   * @param {object} jsonRec XAuthInfo json data
   * @return {boolean} true if the record indicate sys admin,
   * or root priv
   */
  static HasSysAdminRole(jsonRec) {
    return XUserObject.HasRole(jsonRec, UserProps.ROLE_SYSADM);
  }


  /**
   * Determine if the user is an influencer, and return its level.
   *
   * @param {{}} jsonRec unwrapped json for XMUser
   * @return {number} between INFLUENCER_LEVEL_MIN(1) and INFLUENCER_LEVEL_MAX.
   * 0 means influencer role not found
   */
  static IsInfluencer(jsonRec, defaultVal = 0) {
    const level = jsonRec[UserProps.ROLE_INFLUENCER];
    if (!level || level === -1) { return defaultVal; }
    return Util.toNumber(level, defaultVal) || defaultVal;
  }

  // ----------------- FEATURE BUILDING BLOCK FUNCTIONS ----------------

  /**
   *
   * @param {object} jsonRec
   * @param {string} username
   * @return {string} previously set value
   */
  static SetOriginalUsername(jsonRec, username) {
    return XUserObject.SetObjectField(jsonRec, UserProps.ORIG_USERNAME, username);
  }

  /**
   *
   * @param {object} jsonRec
   * @param {boolean} fallback true to use 'username' if no value
   * @param {*} defaultVal
   * @return {string}
   */
  static GetOriginalUsername(jsonRec, fallback, defaultVal = null) {
    let value = XUserObject.GetObjectField(jsonRec, UserProps.ORIG_USERNAME, null);
    if ((value == null) && fallback === true) {
      value = XUserObject.GetObjectField(jsonRec, UserProps.USERNAME, null);
    }
    return (value == null) ? defaultVal : value;
  }

  /**
   * Set features into the app category. Do not use this directly. Use
   * AddFeature and RemoveFeature.
   *
   * @param {{}} jsonRec
   * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USERS
   * @param {{}} features an object with feature name/value as properties
   *
   * @see ~AddFeature
   * @see ~RemoveFeature
   * @see ~GetFEature
   */
  static SetFeatures(jsonRec, featureGroup, features) {
    return XObject.SetObjectField(jsonRec, featureGroup, features);
  }

  /**
     * Add a feature to the auth record. This will be ignored
     * if already exist
     *
     * @param {object} jsonRec
     * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USER
     * @param {string} featureId one of FEATURE_*
     * @param {object} properties optional property details.
     * @return {boolean} true if added, false if not including already
     * exists
     *
     * @see #GetFeature
     * @see #RemoveFeature
     */
  static AddFeature(jsonRec, featureGroup, featureId, properties = null) {
    const _m = `${_CLSNAME}.AddFeature(${featureGroup},${featureId})`;
    if (featureId == null) {
      console.error(_m, 'null fea is not allowed.');
      return false;
    }
    let features = XUserObject.GetFeatures(jsonRec, featureGroup, null);
    let featureAdded = false;
    if (features == null) {
      features = {};
      XUserObject.SetFeatures(jsonRec, featureGroup, features);
    }
    if (!features.hasOwnProperty(featureId)) {
      features[featureId] = properties || {};
      featureAdded = true;
    }
    return featureAdded;
  }

  /**
     * Return all features keys/values stored within given object.
     *
     * @param {{}} jsonRec
     * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USERS
     * @param {} defaultVal
     * @return {{}} map of features keyed by featureId
     */
  static GetFeatures(jsonRec, featureGroup, defaultVal = null) {
    return XObject.GetObjectField(jsonRec, featureGroup, defaultVal);
  }

  /**
     * Return the desired features object within the feature group
     * within the given authInfo json data.
     *
     * @param {{}} jsonRec XAuthInfo json data
     * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USERS
     * @param {string} featureId one of FEATURE_*
     * @return {object} properties stored for the given role.
     * If no properties, empty object should be returned. Null
     * or defaultVal imply not found.
     * @see #AddRole
     * @see #RemoveRole
     */
  static GetFeature(jsonRec, featureGroup, featureId, defaultVal = null) {
    const features = XUserObject.GetFeatures(jsonRec, featureGroup);
    if (features == null) { return defaultVal; }
    const featureObj = features[featureId];
    return (Util.NotNull(featureObj)) ? featureObj : defaultVal;
  } // GetFeature

  /**
   * Retrieve property value of a given feature if any
   *
   * @param {object} jsonRec XAuthInfo json data
   * @param {string} featureId one of AUTH
   * @param {string} label property label to look
   * @return {object} value associated with label, or defaultVal
   */
  static GetFeatureProperty(jsonRec, featureGroup, featureId, label, defaultVal = null) {
    const features = XUserObject.GetFeatures(jsonRec, featureGroup);
    if (features == null) { return false; }
    const featureDef = features[featureId];
    if (featureDef == null) { return defaultVal; }
    const propValue = featureDef[label];
    return propValue || defaultVal;
  } // GetFeatureProperty

  /**
     * Remove feature definition given the feature label
     *
     * @param {{}} jsonRec XAuthInfo json data
     * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USERS
     * @param {string} featureId label of feature. One of FEATURE_*
     * @return {boolean} true if removed, false if not found
     *
     * @see #AddFeature
     * @see #HasFeature
     */
  static RemoveFeature(jsonRec, featureGroup, featureId) {
    const features = XUserObject.GetFeatures(jsonRec, featureGroup);
    if (features == null) { return false; }
    const featureObj = features[featureId];
    if (featureObj == null) { return false; }   // not found
    delete features[featureId];
    return true;
  } // RemoveFeature

  /**
     * Determine if the authinfo has the given feature
     *
     * @param {object} jsonRec XAuthInfo json data
     * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USER
     * @param {string} featureId one of FEATURE_
     * @return {boolean} true if the record has feature as key
     */
  static HasFeature(jsonRec, featureGroup, featureId) {
    const features = XUserObject.GetFeatures(jsonRec, featureGroup);
    return features ? features.hasOwnProperty(featureId) : false;
  }

  /**
     * Determine if there is a property associated with a feature
     *
     * @param {object} jsonRec XAuthInfo json data
     * @param {string} featureGroup one of FEATURE_GROUP_APP, FEATURE_GOUP_USERS
     * @param {string} featureId one of FEATURE_
     * @param {string} propertyName name of the property
     * @return {boolean} true if the record has feature as key
     */
  static HasFeatureProperty(jsonRec, featureGroup, featureId, propertyName) {
    const features = XUserObject.GetFeatures(jsonRec, featureGroup, null);
    // JSC 9/14/2020: not tested
    const feature = features ? features[featureId] : null;
    return feature ? feature.hasOwnProperty(propertyName) : false;
  }

  // ---------------- APPLICATTION LEVEL FEATURES -------------------------

  /**
     *
     * @param {string} featureId
     * @param {{}} properties
     */
  static AddAppFeature(jsonRec, featureId, properties = null) {
    return XUserObject.AddFeature(jsonRec, UserProps.FEATURE_GROUP_APP, featureId, properties);
  }

  /**
   * Return all features within the feature group FEATURE_GROUP_APP
   *
   * @param {*} jsonRec
   * @param {*} defaultVal
   * @return {*[]} feature array objects
   */
  static GetAppFeatures(jsonRec, defaultVal) {
    return XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP, defaultVal);
  }

  /**
     *
     * @param {{}} jsonRec
     * @param {string} featureId
     * @param {*} defaultVal
     * @return {{}} social feature record
     */
  static GetAppFeature(jsonRec, featureId, defaultVal) {
    return XUserObject.GetFeature(jsonRec, UserProps.FEATURE_GROUP_APP, featureId, defaultVal);
  }

  /**
     *
     * @param {{}} jsonRec
     * @return {boolean} true if existed and removed. False if
     * does not exist
     */
  static RemoveAppFeature(jsonRec, featureId) {
    return XUserObject.RemoveFeature(jsonRec, UserProps.FEATURE_GROUP_APP, featureId);
  }

  /**
   * Add the given feature id to user's disable list.
   *
   * NOTE: This function does not check if the feature is already on the
   * system-wide disabled list. It only cares about adding to user's own
   * disabled list explicitly.
   *
   * @param {object} jsonRec
   * @param {string} featureId
   * @return {boolean} true if added to disable list, or already on disabled list
   */
  static DisableAppFeature(jsonRec, featureId) {
    let disabledList = XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP_DISABLED);
    if (disabledList && disabledList.includes(featureId)) {
      return true;
    }
    if (disabledList == null) {
      disabledList = [];
    }
    disabledList.push(featureId);
    XUserObject.SetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP_DISABLED, disabledList);
    return true;
  }

  /**
   * Remove a previously disabled feature. this can only remove
   * from user's disable list, NOT the general preset disable list.
   *
   * @param {object} jsonRec
   * @param {string} featureId
   * @return {boolean} true if removed to disable list
   */
  static RemoveDisabledAppFeature(jsonRec, featureId) {
    const disabledList = XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP_DISABLED);
    const featureIdx = disabledList ? disabledList.indexOf(featureId) : -1;
    if (featureIdx < 0) {
      return false;
    }
    disabledList.splice(featureIdx, 1);
    // XUserObject.SetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP_DISABLED, disabledList);
    return true;
  }


  /**
     *
     * @param {{}} jsonRec
     * @param {string} featureId
     * @param {boolean} defaultVal return this if no explicit inclusion
     * @return {boolean}
     */
  static HasAppFeature(jsonRec, featureId, defaultVal = false) {
    const inFeatureList = XUserObject.HasFeature(jsonRec, UserProps.FEATURE_GROUP_APP, featureId);
    // console.log('!!!!! HasAppFeature: inFeatureList: ', inFeatureList);
    if (inFeatureList) { return true; }

    if (XUserObject.IsAppFeatureDisabled(jsonRec, featureId)) {
      // console.log('!!!!! HasAppFeature: isdisabled!');
      return false;
    }
    // if user has this feature, then the only override if
    const presetList = XUserObject.GetEnabledAppFeatureList(jsonRec, []);
    // console.log('>>>>  preset list:', presetList);
    let verdict = presetList.includes(featureId);

    // if user has the feature disabled, then it overrides
    if (defaultVal === true) {
      if (XUserObject.IsAppFeatureDisabled(jsonRec, featureId)) {
        verdict = false;
      }
    }

    // console.log('>>>>  preset list:', presetList, ' includes featureId: ', verdict);
    return (verdict === true) ? verdict : defaultVal;
  }

  /**
   * Determine if the given feature is explicitly disabled, either
   * on general disabled list for the user level, or explicitly
   * for this user.
   *
   * NOTE: This does not check if the feature is actually not available
   * for this user or based on user level (e.g. FEATURE_AUTO_FOLLOW).
   * So use HasAppFeature() to do determine if user can perform
   * a feature.
   *
   * @param {object} jsonRec
   * @param {string} featureId
   *
   * @see ~HasAppFeature
   */
  static IsAppFeatureDisabled(jsonRec, featureId) {
    // Check the explicit disabled feature list first as it overrides all answers
    const xDisabled = XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP_DISABLED);
    if (xDisabled && xDisabled.includes(featureId)) {
      return true;
    }
    // before checking on system-wide list, if the feature is explicitly on
    // added list, then that takes precendence
    const enabledFeatureMap = XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP);
    if (enabledFeatureMap && enabledFeatureMap[featureId] != null) {
      return false;
    }

    // Finally, check the system-wide disable list for the user's level
    const userLevel = XUserObject.IsInfluencer(jsonRec);
    const syslist = DISABLED_FEATURES[userLevel];
    if (syslist == null) {
      return false;
    }
    return syslist.includes(featureId);
  }


  /**
   * Return system-wide feature list for a speicifc user level
   *
   * @param {number} userLevel 0 = regular user, 1 - 5 influencers
   * @return {string[]} feature labels
   */
  static GetSystemEnabledFeatureList(userLevel, defaultVal = []) {
    const list = ENABLED_FEATURES[userLevel];
    return list || defaultVal;
  }

  /**
   * Return system-wide DISABLED feature list
   *
   * @param {number} userLevel 0 = regular user, 1 - 5 influencers
   * @param {*} defaultVal feature labels
   */
  static GetSystemDisabledFeatureList(userLevel, defaultVal = []) {
    const list = DISABLED_FEATURES[userLevel];
    return list || defaultVal;
  }

  /**
   *
   * @param {objec} jsonRec
   * @param {*} defaultVal
   * @return {string[]}
   */
  static GetEnabledAppFeatureList(jsonRec, defaultVal = []) {

    const userLevel = XUserObject.IsInfluencer(jsonRec);
    const sysFeatures = ENABLED_FEATURES[userLevel];

    const appFeatures = XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP);
    const mergedList = Util.MergeStrings(sysFeatures, appFeatures);

    return mergedList || defaultVal;
  }

  /**
   *
   * @param {object} jsonRec
   * @param {*} defaultVal
   * @return {string[]}
   */
  static GetDisabledAppFeatureList(jsonRec, defaultVal = []) {
    const userLevel = XUserObject.IsInfluencer(jsonRec);
    const sysFeatures = DISABLED_FEATURES[userLevel];

    const appFeatures = XUserObject.GetFeatures(jsonRec, UserProps.FEATURE_GROUP_APP_DISABLED);
    const mergedList = Util.MergeStrings(sysFeatures, appFeatures);

    return mergedList || defaultVal;
  }

  // -------------------------- PIN POSTS ------------------------------

  /**
   * Add a post as pinned. Because it is an array, this will
   * append to the end of the list
   *
   * @param {object} jsonObj
   * @param {string} tagName or can be a array of tagnames
   *
   * @see ~RemovePinnedPost
   * @see ~GetPinnedPosts
   * @return {boolean} true if added
   */
  static AddPinnedPost(jsonObj, postId) {
    return XUserObject.AddWord(jsonObj, XUserObject.PROP_PINPOSTS, postId, true);
    // return XUserObject._AddTag(jsonObj, XUserObject.PROP_PINPOSTS, postId);
  } // AddPinnedPost

  /**
   * Set list of postIds as pinned
   *
   * @param {object} jsonObj
   * @param {[]} postIds if non-null, will replace everything, INCLUDING empty array
   * @return {string[]} previous array of pin posts being replaced
   */
  static SetPinnedPosts(jsonObj, postIds) {
    return XUserObject.SetWords(jsonObj, XUserObject.PROP_PINPOSTS, postIds);
    // return XUserObject._SetTags(jsonObj, XUserObject.PROP_PINPOSTS, postIds);
  }

  /**
   * Return list of postIds for pinned posts
   *
   * @param {object} jsonObj
   * @param {*} defaultVal
   * @return {string[]}
   */
  static GetPinnedPosts(jsonObj, defaultVal = []) {
    return XUserObject.GetWords(jsonObj, XUserObject.PROP_PINPOSTS, defaultVal);
    // return XUserObject._GetTags(jsonObj, XUserObject.PROP_PINPOSTS, defaultVal);
  }

  /**
   * Remove a pinned post
   *
   * @param {{}} jsonObj
   * @param {string} postId post to remove from pinned list
   * @return {boolean} true if removed
   *
   * @see #AddPinnedPost
   * @see #GetPinnedPosts
   */
  static RemovePinnedPost(jsonObj, postId) {
    return XUserObject.RemoveWord(jsonObj, XUserObject.PROP_PINPOSTS, postId);
    // return XUserObject._RemoveTag(jsonObj, XUserObject.PROP_PINPOSTS, postId);
  }

  /**
   * Report on whether a given postId is found in the pinned post list
   *
   * @param {object} jsonObj
   * @param {string} postId post to check in pinned list
   * strip any expressions
   * @return {boolean} true if exists
   */
  static HasPinnedPost(jsonObj, postId) {
    return (Util.NotNull(jsonObj)) ? XUserObject.HasWord(jsonObj, XUserObject.PROP_PINPOSTS, postId) : false;
  }

  /**
   * Count number of posts pinned
   *
   * @param {{}} jsonObj
   * @return {number}
   */
  static GetPinnedPostCount(jsonObj) {
    return XUserObject.CountWords(jsonObj, XUserObject.PROP_PINPOSTS);
  } // CountPinnedPosts

  /**
   * Return the position of the specified post in pinned list
   *
   * @param {{}} jsonObj
   * @param {string} nameCheck tagname to check.
   *
   * @return {number} -1 if not found, positive number for array index
   */
  static IndexOfPinnedPost(jsonObj, postId) {
    return XUserObject.GetWordIndex(jsonObj, XUserObject.PROP_PINPOSTS, postId);
  }


}

export default XUserObject;
