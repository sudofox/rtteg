// import templateMerge from "string-template";
// import templateCompile from "string-template/compile";

import XObject from '../XObject';
// import XMNotification from "./XMNotification";

import { ModelType, MessageProps } from '../ModelConsts';
import Util from '../../Util';
import SymbolExpr from '../../util/SymbolExpr';

const _CLSNAME = 'vardata';

export const PROP_TYPE_MAP = 'types';
export const PROP_ID_MAP = 'instances';

/**
 * In a VM, store pre-cached templates so going through
 * a lot of alerts can merge text quicker.
 */
// const cachedTemplate = {};

/**
 * A tracking and lookup variable map that is initially
 * used for holding values to various fields in
 * user notification/messaging templates.
 *
 */
class XVarData extends XObject {
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XVarData;
  }

  /**
   * Initialize content as a new object.
   */
  initNew() {
    super.initNew();
  }

  /**
   * Set/override entire variable map. Any previous will be
   * gone!
   *
   * @param {{}} varMap property/values stored in this object
   * @return {{}} previous map or null if new
   */
  setTypeMap(varMap) {
    return XVarData.SetTypeMap(this.getData(true), varMap);
  }

  /**
   * Return entire type map, which is the top level map
   *
   * @param {boolean} true to create if doesn't exist
   * @param {*} defaultVal
   * @return {{}} typeMap, created or existing
   */
  getTypeMap(create = false, defaultVal = null) {
    const data = this.getData(create);
    return data ? XVarData.GetTypeMap(data, create, defaultVal) : defaultVal;
  }

  /**
   * Set/declare the type into this data map, if it doesn't
   * exist already. A type is a container/map that will contain
   * object fields by IDs.
   *
   * @param {string} type
   * @return {boolean} true if created, false if it exists already or null type
   */
  declareType(type) {
    return XVarData.DeclareType(this.getData(true), type);
  }

  /**
   * Return array of declared types
   *
   * @param {{}} jsonObj
   * @return {number} number of types, or -1 if bad params
   */
  getTypes(defaultVal = null) {
    const data = this.getData(false);
    return data ? XVarData.GetTypes(data, defaultVal) : defaultVal;
  }

  /**
   * Return number of types declared in this map
   *
   * @return {number} number of types, or -1 if bad params
   */
  getTypeCount() {
    const data = this.getData(false);
    return data ? XVarData.GetTypeCount(data) : 0;
  }

  /**
   * Check if the type is already declared with it's ID
   *
   * @param {string} type object type (e.g, "user", "rl")
   * @return {boolean} true if id exists under type, false if not
   */
  hasType(type) {
    const data = this.getData(false);
    return data ? XVarData.HasType(data, type) : false;
  }

  /**
   * Return all instances tracked for a given object type.
   *
   * @param {string} type e.g., "user", "rl"
   * @param {boolean} create true to create bucket if doesn't exist
   * @param {*} defaultVal
   * @return {boolean} true if defined, false if already exists or null type
   *
   * @see ~getInstanceIds
   * @see ~getInstanceData
   * @see ~getInstanceCount

   */
  getInstances(type, create = false, defaultVal = null) {
    const data = this.getData(create);
    return data
      ? XVarData.GetInstances(data, type, create, defaultVal)
      : defaultVal;
  }

  /**
   * Return identifiers of all instances of a given type
   *
   * @param {string} type object type to retrieve
   * @param {*} defaultVal
   *
   * @see ~getInstances
   * @see ~getInstanceData
   * @see ~getInstanceCount
   */
  getInstanceIds(type, defaultVal = null) {
    const data = this.getData(false);
    return data ? XVarData.GetInstanceIds(data, type, defaultVal) : defaultVal;
  }

  /**
   * Return number of instances of a given type
   *
   * @param {string} type object type to do the count of its instances
   *
   * @see ~getInstances
   * @see ~getInstanceIds
   * @see ~getInstanceData
   */
  getInstanceCount(type) {
    const data = this.getData(false);
    return data ? XVarData.GetInstanceCount(data, type) : -1;
  }

  /**
   * Set/declare the objecti's ID into the map and create
   * a container if one does not exist already.
   *
   * @param {string} type object type. This is necessary since
   * an ID can be re-used across different types for correspondence.
   * @param {string} objectId object identifier to look up and
   * create a new bucket if doesn't exist
   * @return {boolean} true if created, false if it exists already
   */
  declareInstance(type, objectId) {
    return XVarData.DeclareInstance(this.getData(true), type, objectId);
  }

  /**
   * Check if the instance is already declared with it's ID
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @return {boolean} true if id exists under type, false if not
   */
  hasInstance(type, objectId) {
    const data = this.getData(false);
    return data ? XVarData.HasInstance(data, type, objectId) : false;
  }

  /**
   * Set/override object's map of the fields being tracked.
   * Any previous properties for the object will be gone!
   *
   * @param {string} type object type. This is necessary since
   * an ID can be re-used across different types for correspondence.
   * @param {string} objectId object identifier
   * @param {{}} fieldMap property/values to assign to the
   * object in the given data map
   * @return {{}} return previous property/value map, if exists
   */
  setInstanceData(type, objectId, fieldMap) {
    return XVarData.SetInstanceData(
      this.getData(true),
      type,
      objectId,
      fieldMap
    );
  }

  /**
   * Return the data of a specific object/type with option to create bucket.
   *
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {boolean} create true to create if not found
   * @param {*} defaultVal return value if null (no create)
   * @return {{}} all tracked field data for instance if exists
   */
  getInstanceData(type, objectId, create = false, defaultVal = null) {
    const data = this.getData(create);
    return data
      ? XVarData.GetInstanceData(data, type, objectId, create, defaultVal)
      : defaultVal;
  }

  /**
   * Set/override entire variable map. Any previous will be
   * gone!
   *
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {string} field property label
   * @param {string} value should be string if need to be serialized
   * @return {string} previously stored value if existed
   */
  setInstanceVariable(type, objectId, field, value) {
    return XVarData.SetInstanceVariable(
      this.getData(true),
      type,
      objectId,
      field,
      value
    );
  }

  /**
   * Retrieve an instance's variable (field value).
   *
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {string} field property label
   * @param {*} defaultVal return this value if value is null
   * @return {string=} field value or defaultVal
   */
  hasInstanceVariable(type, objectId, field) {
    const data = this.getData(false);
    return data
      ? XVarData.HasInstanceVariable(data, type, objectId, field)
      : false;
  }

  /**
   * Retrieve an instance's variable (field value).
   *
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {string} field property label
   * @param {*} defaultVal return this value if value is null
   * @return {string=} field value or defaultVal
   */
  getInstanceVariable(type, objectId, field, defaultVal = null) {
    const data = this.getData(false);
    return data
      ? XVarData.GetInstanceVariable(data, type, objectId, field, defaultVal)
      : defaultVal;
  }

  /**
   * Return number of instances of a given type
   *
   * @param {string} type instance type, e.g., "user", "rl"
   * @param {string} objectId instance ID
   * @return {number} number of fields declared, or -1 if bad param
   */
  getInstanceVariableCount(type, objectId) {
    const data = this.getData(false);
    return data ? XVarData.GetInstanceVariableCount(data, type, objectId) : 0;
  } // GetInstanceVariableCount

  /**
   * Retrieve stored value based on format of Symbol Expression.
   *
   * @param {string} symbolExpr format of '#field:{type:"<modelType>",_id:"<objId>"}'
   * @param {function} valueRenderer post processing add-on
   * @return {string} either replaced value or untouched expressions
   */
  getValueFromSymbolExpr(symbolExpr, valueRenderer = null) {
    const data = this.getData(false);
    return data
      ? XVarData.GetValueFromSymbolExpr(
        data,
        symbolExpr,
        valueRenderer,
        symbolExpr
      )
      : symbolExpr;
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
    return ModelType.VARDATA;
  }

  /**
   * Create an user info record aggregated from difference
   * sources but mainly XMUser. It is suitable to give to
   * client for rendering.
   *
   * @param {string} id assigned id, which can match another data model's id
   * @return {XVarData}
   */
  static Create(id) {
    const vd = new XVarData();
    vd.initNew();
    if (id) {
      vd._setId(id);
    }

    return vd;
  } // Create

  /**
   * Set/override entire variable map. Any previous will be
   * gone!
   *
   * @param {{}} jsonObj
   * @param {{}} varMap property/values stored in this object
   * @return {{}} previous map or null if new
   */
  static SetTypeMap(jsonObj, varMap) {
    return XVarData.SetObjectField(jsonObj, PROP_TYPE_MAP, varMap);
  }

  /**
   * Return entire type map, which is the top level map
   *
   * @param {{}} jsonObj
   * @param {boolean} true to create if doesn't exist
   * @param {*} defaultVal
   * @return {{}} typeMap, created or existing
   */
  static GetTypeMap(jsonObj, create = false, defaultVal = null) {
    let typeMap = XVarData.GetObjectField(jsonObj, PROP_TYPE_MAP, null);
    if (typeMap == null && create) {
      typeMap = {};
      XVarData.SetObjectField(jsonObj, PROP_TYPE_MAP, typeMap);
    }
    return typeMap;
  }

  /**
   * Set/declare the type into this data map, if it doesn't
   * exist already. A type is a container/map that will contain
   * object fields by IDs.
   *
   * @param {{}} jsonObj
   * @param {string} type
   * @return {boolean} true if created, false if it exists already or null
   */
  static DeclareType(jsonObj, type) {
    if (!XVarData.AssertArrayNoNulls([jsonObj, type], 'DefineType')) {
      return false;
    }
    const typeMap = XVarData.GetTypeMap(jsonObj, true);
    if (Util.NotNull(typeMap[type])) {
      return false;
    }

    typeMap[type] = {};
    return true;
  } // DeclareType

  /**
   * Return number of types declared in this map
   *
   * @param {{}} jsonObj
   * @return {string[]} array of typenames, or defaultVal if bad
   */
  static GetTypes(jsonObj, defaultVal = null) {
    if (!XVarData.AssertNotNull(jsonObj, 'GetTypes')) {
      return -1;
    }
    const typeMap = XVarData.GetTypeMap(jsonObj, false);
    return typeMap ? Object.keys(typeMap) : defaultVal;
  } // GetTypes

  /**
   * Return number of types declared in this map
   *
   * @param {{}} jsonObj
   * @return {number} number of types, or -1 if bad params
   */
  static GetTypeCount(jsonObj) {
    if (!XVarData.AssertNotNull(jsonObj, 'GetTypeCount')) {
      return -1;
    }
    const typeMap = XVarData.GetTypeMap(jsonObj, false);
    return typeMap == null ? 0 : Util.ObjectSize(typeMap);
  }

  /**
   * Check if the type is already declared with it's ID
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @return {boolean} true if id exists under type, false if not
   */
  static HasType(jsonObj, type) {
    if (!XVarData.AssertArrayNoNulls([jsonObj, type], 'HasType')) {
      return false;
    }

    return Util.NotNull(XVarData.GetInstances(jsonObj, type, false));
  }

  /**
   * Return all instances tracked for a given object type.
   *
   * @param {{}} jsonObj
   * @param {string} type e.g., "user", "rl"
   * @param {boolean} create true to create if no data
   * @param {*} defaultVal
   * @return {{}} instances in an object where the ids are keys
   */
  static GetInstances(jsonObj, type, create = false, defaultVal = null) {
    if (!XVarData.AssertArrayNoNulls([jsonObj, type], 'GetTypeInstances')) {
      return defaultVal;
    }
    const typeMap = XVarData.GetTypeMap(jsonObj, create);
    if (typeMap == null) {
      return defaultVal;
    }
    let typeBucket = typeMap[type];
    if (typeBucket == null && create) {
      typeBucket = {};
      typeMap[type] = typeBucket;
    }
    return typeBucket;
  } // GetTypeInstances

  /**
   * Return identifiers of all instances of a given type
   *
   * @param {string} type object type to retrieve
   * @param {*} defaultVal
   * @return {string[]} array of identifiers
   */
  static GetInstanceIds(jsonObj, type, defaultVal = null) {
    if (!XVarData.AssertArrayNoNulls([jsonObj, type], 'GetInstanceIds')) {
      return defaultVal;
    }
    const typeMap = XVarData.GetTypeMap(jsonObj, false);
    if (typeMap == null) {
      return 0;
    }
    const typeBucket = typeMap[type];
    return typeBucket ? Object.keys(typeBucket) : defaultVal;
  } // GetInstanceIds

  /**
   * Return number of instances of a given type
   *
   * @param {{}} jsonObj
   * @param {string} type
   */
  static GetInstanceCount(jsonObj, type) {
    if (!XVarData.AssertArrayNoNulls([jsonObj, type], 'GetInstanceCount')) {
      return -1;
    }
    const typeMap = XVarData.GetTypeMap(jsonObj, false);
    if (typeMap == null) {
      return 0;
    }
    const typeBucket = typeMap[type];
    return typeBucket ? Util.ObjectSize(typeBucket) : 0;
  } // GetInstanceCount

  /**
   * Set/declare the objecti's ID into the map and create
   * a container if one does not exist already.
   *
   * @param {{}} jsonObj
   * @param {string} type object type. This is necessary since
   * an ID can be re-used across different types for correspondence.
   * @param {string} objectId object identifier to look up and
   * create a new bucket if doesn't exist
   * @return {boolean} true if created, false if it exists already
   */
  static DeclareInstance(jsonObj, type, objectId) {
    if (
      !XVarData.AssertArrayNoNulls(
        [jsonObj, type, objectId],
        'RegisterInstanceID'
      )
    ) {
      return false;
    }
    const typeMap = XVarData.GetInstances(jsonObj, type, true);
    if (typeMap[objectId]) {
      return false;
    }
    typeMap[objectId] = {};
    return true;
  } // DeclareObject

  /**
   * Check if the instance is already declared with it's ID
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @return {boolean} true if id exists under type, false if not
   */
  static HasInstance(jsonObj, type, objectId) {
    if (
      !XVarData.AssertArrayNoNulls([jsonObj, type, objectId], 'HasInstance')
    ) {
      return false;
    }

    const instances = XVarData.GetInstances(jsonObj, type, false);
    return instances ? Util.NotNull(instances[objectId]) : false;
  } // HasInstance

  /**
   * Set/override object's map of the fields being tracked.
   * Any previous properties for the object will be gone!
   *
   * @param {{}} jsonObj
   * @param {string} type object type. This is necessary since
   * an ID can be re-used across different types for correspondence.
   * @param {string} objectId object identifier
   * @param {{}} fieldMap property/values to assign to the
   * object in the given data map
   * @return {{}} return previous property/value map, if exists
   */
  static SetInstanceData(jsonObj, type, objectId, fieldMap) {
    if (
      !XVarData.AssertArrayNoNulls([jsonObj, type, objectId], 'SetInstanceData')
    ) {
      return null;
    }
    const objectMap = XVarData.GetInstances(jsonObj, type, true);
    const previousData = objectMap[objectId];
    objectMap[objectId] = fieldMap;
    return previousData;
  } // SetInstanceData

  /**
   * Return the data of a specific object/type with option to create bucket.
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {boolean} create true to create if not found
   * @param {*} defaultVal return value if null (no create)
   * @return {{}} all tracked field data for instance if exists
   */
  static GetInstanceData(
    jsonObj,
    type,
    objectId,
    create = false,
    defaultVal = null
  ) {
    if (
      !XVarData.AssertArrayNoNulls([jsonObj, type, objectId], 'GetInstanceData')
    ) {
      return null;
    }

    const instancesMap = XVarData.GetInstances(jsonObj, type, create);
    if (instancesMap == null) {
      return defaultVal;
    }
    const instanceData = instancesMap[objectId];
    if (instanceData == null && create) {
      instanceData[objectId] = {};
    }
    return instanceData;
  } // GetInstanceData

  /**
   * Set/override entire variable map. Any previous will be
   * gone!
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {string} field property label
   * @param {string} value should be string if need to be serialized
   * @return {string} previously stored value if existed or null
   */
  static SetInstanceVariable(jsonObj, type, objectId, field, value) {
    if (
      !XVarData.AssertArrayNoNulls(
        [jsonObj, type, objectId, field],
        'SetInstanceVariable'
      )
    ) {
      return null;
    }

    const instance = XVarData.GetInstanceData(jsonObj, type, objectId, true);
    const previousValue = instance[field];
    instance[field] = value;
    return previousValue;
  } // SetInstanceVariable

  /**
   * Retrieve an instance's variable (field value).
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {string} field property label
   * @param {*} defaultVal return this value if value is null
   * @return {string=} field value or defaultVal
   */
  static HasInstanceVariable(jsonObj, type, objectId, field) {
    if (
      !XVarData.AssertArrayNoNulls(
        [jsonObj, type, objectId, field],
        'HasInstanceVariable'
      )
    ) {
      return false;
    }

    const instance = XVarData.GetInstanceData(jsonObj, type, objectId, false);
    return instance ? instance.hasOwnProperty(field) : false;
  } // HasInstanceVariable

  /**
   * Retrieve an instance's variable (field value).
   *
   * @param {{}} jsonObj
   * @param {string} type object type (e.g, "user", "rl")
   * @param {string} objectId specific instance
   * @param {string} field property label
   * @param {*} defaultVal return this value if value is null
   * @return {string=} field value or defaultVal
   */
  static GetInstanceVariable(
    jsonObj,
    type,
    objectId,
    field,
    defaultVal = null
  ) {
    if (
      !XVarData.AssertArrayNoNulls(
        [jsonObj, type, objectId, field],
        'GetInstanceVariable'
      )
    ) {
      return null;
    }

    const instance = XVarData.GetInstanceData(jsonObj, type, objectId, false);
    if (instance == null) {
      return defaultVal;
    }

    // if field is defined, the value can still be null,
    // which we need to make that distinction with defaultVal
    return instance.hasOwnProperty(field) ? instance[field] : defaultVal;
  } // GetInstanceVariable

  /**
   * Return number of instances of a given type
   *
   * @param {{}} jsonObj
   * @param {string} type instance type, e.g., "user", "rl"
   * @param {string} objectId instance ID
   * @return {number} number of fields declared, or -1 if bad param
   */
  static GetInstanceVariableCount(jsonObj, type, objectId) {
    if (
      !XVarData.AssertArrayNoNulls(
        [jsonObj, type, objectId],
        'GetInstanceVariableCount'
      )
    ) {
      return -1;
    }
    const instanceMap = XVarData.GetInstanceData(
      jsonObj,
      type,
      objectId,
      false
    );
    return instanceMap ? Util.ObjectSize(instanceMap) : 0;
  } // GetInstanceVariableCount

  /**
   * Retrieve stored value based on format of Symbol Expression,
   *
   * @param {{}} jsonObj
   * @param {string} symbolExpr format of '#field:{type:"<modelType>",_id:"<objId>"}'
   * @param {function} valueRenderer function to further render the processed value
   * @param {defaultVal} use this if variable does not exist. The instance
   * method version will set the defaultVal to symbolExpr, so effective
   * no substitution. But this class level method defaults to null
   * @return {string} either replaced value or untouched expressions
   */
  static GetValueFromSymbolExpr(
    jsonObj,
    symbolExpr,
    valueRenderer = null,
    defaultVal = null
  ) {
    const [field, props] = SymbolExpr.ParseSymbol(symbolExpr, true);
    const type = props[MessageProps.TYPE]; // "type"
    const id = props[MessageProps.ID]; // "_id"
    let value;
    if (type && id) {
      value = XVarData.GetInstanceVariable(jsonObj, type, id, field, null);
      if (
        value == null &&
        XVarData.HasInstanceVariable(jsonObj, type, id, field)
      ) {
        value = '';
      } // field exists, so assume empty string for now
      if (valueRenderer) {
        value = valueRenderer(value, props);
      }
    } else {
      value = null;
    }
    return value;
  } // GetValueFromSymbolExpr
} // class XVarData

XVarData.RegisterType(XVarData);

export default XVarData;
