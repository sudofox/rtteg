
import Util, { MemoryUtil } from './Util';

const PROP_WATCH = '_watch';

/**
 * Utility functions to support models and
 * other shared logic.
 *
 *
 */

const _CLSNAME = 'ObjectBase';

export class ObjectBase {
  constructor(clsname = _CLSNAME) {
    this.class = ObjectBase;
    this.classname = clsname;
  }

  /**
   * Called by subclass Create(), CreateNew()
   * or variant and propate to each super class.
   */
  initNew() {
    // to nothing at this level
  }

  /**
   *
   * @return {ObjectBase}
   */
  getClass() {
    return this.class;
  }

  /**
   *
   * @return {string}
   */
  getClassname() {
    return this.classname;
  }

  _setClassname(clsname) {
    this.classname = clsname;
  }

  // --------------------- Getter/Setter for properties ---------------


  // ----------------------- Change Monitoring ------------------------


  /**
   * Watch property within this object. If you want
   * to watch a property for an XObject, use
   * watchXProperty().
   *
   *
   * @param {string} label
   * @param {function} handler
   * @return {boolean=} true if successfully added
   *
   * @see ~unwatchProperty
   */
  watchProperty(label, handler) {
    const watchers = this._getWatchers(true);
    if (watchers[label] == null) { watchers[label] = []; }
    if (!watchers[label].includes(handler)) {
      watchers[label].push(handler);
      return true;
    }
    return false;
  }

  /**
   * Remove a registered handler from watch list.
   *
   * @param {string} label
   * @param {object} handler
   * @return {boolean} entry and associated object/function removed
   */
  unwatchProperty(label, handler) {
    const watchers = this._getWatchers(false);
    if (watchers == null) { return; }
    const watcherArray = watchers[label];
    if (watcherArray && watcherArray.includes(handler)) {
      const idx = watcherArray.indexOf(handler);
      if (idx > -1) { watcherArray.splice(idx, 1); }
      return true;
    }
    return false;
  }


  /**
   *
   * @param {string} label
   * @return {boolean} true watcher entry deleted
   */
  unwatchAll(label) {
    const watchers = this._getWatchers(false);
    if (watchers == null) { return; }
    if (watchers[label] !== undefined) {
      delete watchers[label];
      return true;
    }
    return false;
  }

  /**
   * Return all watchers. This is internal
   *
   * @param {boolean} create
   * @return {{}} property names are keys, and values are
   * array of handlers
   */
  _getWatchers(create = true) {
    if ((this[PROP_WATCH] == null) && (create === true)) { this[PROP_WATCH] = {}; }
    return this[PROP_WATCH];
  }

  /**
   * Call handlers of the subscribed. Right now should be called
   * by setObjectField. Calls are done serially and in the order
   * of registration (array).
   *
   * @param {string} tell handler the property name
   * @param {string} oldValue previous value before the value change
   * @param {string} newValue new value set
   * @return {number} number of handlers called.
   */
  _dispatchHandlers(propname, oldValue, newValue) {
    const watchers = this._getWatchers(false);
    if (watchers == null) { return 0; }

    const handlers = watchers[propname];
    const thisObj = this;
    // let _m = `_dispatchHandler(${propname}): oldValue: ${oldValue}, newValue: ${newValue}`;
    // this.log(_m, "DISPATCHING...");
    let dispatchedCount = 0;
    if (Array.isArray(handlers)) {
      handlers.forEach((f) => {
        // this.log(_m, "Calling handler: ", f);
        dispatchedCount++;
        f(thisObj, propname, oldValue, newValue);
      });
    }
    // this.log(_m, `dispatched ${dispatchedCount} calls...`);
    return dispatchedCount;
  } // _dispatchHandler


  // ----------------------- Logging Services -------------------------

  /**
   * Wrapper to console.group([label]). When
   * we do our own logging, should follow this
   * grouping style as well.
   *
   * @param {string} label
   *
   * @see ~logGroupEnd
   */
  logGroupBegin(label) {
    // todo: logger
    // console.group(label);
  }

  /**
   * Wrapper to console.groupEnd();
   *
   * @see ~logGroupBegin
   */
  logGroupEnd() {
    // todo: logger
    // console.groupEnd();
  }

  logMem(method) {
    return ObjectBase.LogMem(this.getClassname(), method);
  }
  log(method, msg, ...args) {
    // todo: logger
    // console.log(`${this.getClassname()}.${method}: ${msg}`, ...args);
  }
  warn(method, msg, ...args) {
    // todo: logger
    // console.warn(`${this.getClassname()}.${method}: ${msg}`, ...args);
  }
  error(method, msg, ...args) {
    // todo: logger
    // console.error(`${this.getClassname()}.${method}: ${msg}`, ...args);
  }
  trace(method, msg, ...args) {
    // todo: logger
    // console.trace(`${this.getClassname()}.${method}: ${msg}`, ...args);
  }

  /**
   *
   * @param {*} expr
   * @param {*} method
   * @param {*} msg
   * @param  {...any} args
   * @return {boolean} true if assertion successful, false if failed
   */
  assert(expr, method, msg, ...args) {
    // should we toss exception?
    if (!expr) {
      console.trace(`${this.getClassname()}.${method}: ${msg}`, ...args);
      return false;
    }
    return true;
  }
  assertNotNull(expr, method, msg, ...args) {
    const verdict = Util.NotNull(expr);
    return this.assert(verdict, method, msg, ...args);
  }

  assertInstanceOf(obj, classObj, method, msg, ...args) {
    const verdict = obj instanceof classObj;
    return this.assert(verdict, method, msg, ...args);
  }

  assertType(value, typeStr, method, msg, ...args) {
    const verdict = (typeof value) === typeStr;
    return this.assert(verdict, method, msg, ...args);
  }

  assertBoolean(value, method, msg, ...args) {
    return this.assertType(value, 'boolean', method, msg, ...args);
  }

  assertNumber(value, method, msg, ...args) {
    return this.assertType(value, 'number', method, msg, ...args);
  }

  assertString(value, method, msg, ...args) {
    return this.assertType(value, 'string', method, msg, ...args);
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
   * A made-up not-so-useful function to be called by subclasses.
   * The purpose is to shut-up babel or other ES6 preprocessors
   * that complain about a class not used in real code, but maybe
   * needed for other purposes such as JSDoc.
   */
  static CheckIn() {
    return true;
  }

  /**
   * Assertion of value/expression being truthy and dump stack if truth
   * check failed.
   *
   * @param {boolean} expr boolean value to check for truth
   * @param {string} classname name of class where assertion originated
   * @param {string} method method name
   * @param {string} msg message
   * @param  {...any} args
   */
  static Assert(expr, classname, method, msg, ...args) {
    if (expr === true) { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Assertion of value/expression not being null and dump stack if assertion
   * failed.
   *
   * @param {*} expr any value to check against null
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertNotNull(expr, classname, method, msg, ...args) {
    if (Util.NotNull(expr)) { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Assertion of value/expression not being null and dump stack if assertion
   * failed.
   *
   * @param {*} values array of values to check each element to be not null
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertArrayNoNulls(values, classname, method, msg, ...args) {
    if (values == null) { return false; }
    let hasError = false;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (value == null) {
        // console.error(`${classname}.${method}: null element (@${i}) found:`, values);
        hasError = true;
      }
    }
    if (hasError) {
      // console.trace(msg || 'stack trace');
    }
    return !hasError;
  } // AssertArrayNoNulls

  /**
   * Assert if given object is an "instanceof" given class object and dump
   * stack if failed check.
   *
   * @param {*} object any value to check against class object
   * @param {class} classObj value on the right hand side of the "instanceof" operator
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertInstanceOf(object, classObj, classname, method, msg, ...args) {
    if (object == null) { return false; }
    if (object instanceof classObj) { return true; }
    return false;
  }

  /**
   * Assert if given object is an "instanceof" given class object and dump
   * stack if failed check.
   *
   * @param {*} value any value to check against type
   * @param {string} typeStr type name in string
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertType(value, typeStr, classname, method, msg, ...args) {
    if ((typeof value) === typeStr) { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Assert if given boolean expression yields false value.
   *
   * @param {*} value any value to check against type
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertBoolean(value, classname, method, msg, ...args) {
    if (value === true) { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Assert if given expression yields a number value
   *
   * @param {*} value any value to check against a number type
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertNumber(value, classname, method, msg, ...args) {
    if (typeof (value) === 'number') { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Assert if given expression yields a value that is a string type
   *
   * @param {*} value any value to check against a string type
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertString(value, classname, method, msg, ...args) {
    if (typeof (value) === 'string') { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * @return {string}
   */
  static GetName() {
    return _CLSNAME;
  }

  /**
   * Utility to get the name of the class,
   * which should either have a static method
   * "GetName", or if instance of XObject, would
   * have an attribute "classname" as needed for log.
   *
   * @param {class} ClsObj class type
   */
  static GetClassNameOf(ClsObj, defaultVal = 'Unknown') {
    let name;
    if (ClsObj.hasOwnProperty('GetName')) { name = ClsObj.GetName(); } else {
      const inst = new ClsObj();
      if (inst.hasOwnProperty('classname')) { name = inst.classname; }
    }
    return name || defaultVal;
  }

  /**
   * Return the short identifier for this type. This should
   * be overriden by subclasses.
   *
   * @return {string}
   */
  static GetTypeID() {
    return 'base';
  }

  static Log(classname, method, msg, ...args) {
    return console.log(`${classname}.${method}: ${msg}`, ...args);
  }
  static Warn(classname, method, msg, ...args) {
    return console.warn(`${classname}.${method}: ${msg}`, ...args);
  }
  static Error(classname, method, msg, ...args) {
    return console.error(`${classname}.${method}: ${msg}`, ...args);
  }
  static Trace(classname, method, msg, ...args) {
    return console.trace(`${classname}.${method}: ${msg}`, ...args);
  }

  static LogGroupBegin(label) {
    return console.group(label);
  }

  static LogGroupEnd() {
    return console.groupEnd();
  }


  /**
   * @return {string}
   */
  // static GetMemStatLine() {
  //     let memrec = process.memoryUsage();
  //     let used = memrec["heapUsed"];
  //     let total = memrec["heapTotal"];
  //     let utilpct = Math.round(used/total * 100);
  //     let usedMB = Math.round(used / 1048576);
  //     let totalMB = Math.round(total / 1048576);
  //     let rssMB = Math.round(memrec["rss"] / 1048576);
  //     let extMB = Math.round(memrec["external"] / 1048576);
  //     let msg = `Mem Util: ${utilpct}% (${usedMB}MB/${totalMB}MB)  RSS: ${rssMB}MB  Extern: ${extMB}MB`;
  //     return msg;
  // }

  static LogMem(classname, method, gcBefore = false) {
    if (gcBefore && global.gc) {
      ObjectBase.Log(classname, method, 'GC...');
      global.gc();
    }
    const msg = MemoryUtil.GetMemStatLine();
    return ObjectBase.Log(classname, method, msg);
  }

  /**
   * Globall register mapping of a type string to a class (constructor).
   * This is critical to support dynamic instantiation of proper
   * ES6 class wrapper for a given type. All register types should
   * be subclass of XObject (component), or XMObject (first class entity)
   *
   * @param {function} clsObj class object (constructor?)
   * @param {string} type name of the class. If null, then call the class object's
   * GetTypeID() static method if exists
   *
   * @see #GetClassByType
   */
  static RegisterType(clsObj, type = null) {
    const _m = `${_CLSNAME}.RegT:`;
    if (clsObj == null) {
      console.error(_m, 'Passed in null class!');
      return;
    }
    if (type == null) {
      if (clsObj.hasOwnProperty('GetTypeID')) { type = clsObj.GetTypeID(); } else {
        console.error(_m, '?GetTypeID:', clsObj);
        return;
      }
    }

    // We use a model dictionary within 'global' to track the mapping lazily
    if (global.model == null) { global.model = {}; }

    if (global.model.hasOwnProperty(type)) {
      // Shoudn't happen since we are checking for class object's own property (not inherited)
      console.trace(`${_m}: type: ${type} already registerd to class constructor: ${global.model[type]}`);
    } else {
      global.model[type] = clsObj;
      // let clsname = ObjectBase.GetClassNameOf(clsObj);
      // console.log(_m, `Class (constructor): '${clsname}' mapped to type '${type}'`);
    }
  } // RegisterType

  static DeregisterType(type) {
    if (type == null) { return console.assert(type, '?DeReg: missing type'); }
    if (global.model == null || !global.model.hasOwnProperty(type)) { return null; }
    delete global.model[type];
    return (global.model[type] == null);
  }

  /**
   * Lookup type-class map to return the class object (constructor)
   *
   * @param {string} type previously registered type
   * @return {function} class constructor
   *
   * @see #RegisterType
   * @see #DeregisterType
   * @see #Wrap
   */
  static GetClassByType(type) {
    if (type == null) { return console.assert(type, 'GetClassByType: missing type'); }
    if (global.model == null || !global.model.hasOwnProperty(type)) { return null; }
    return global.model[type];
  }

  /**
   * Wrap a JSON data structure with a ES6 class. This is implemented
   * by subclases (XObject, XMObject) and more specialized down the
   * type hierarchy. it is merely an abstract interface at this level.
   */
  static Wrap(jsonRec, clsType = null) {
    // Implemented by subclasses and used by no-op at this level.
    // console.error("ObjectBase.Wrap", "Not implemented at this level.");
  }

  // --------------------- Getter/Setter for properties ---------------


  /**
   * Set the value of the field within the given object. The field can be anything
   * from atomic value (string, number) to array or another object as long as its
   * a JSON data structure.
   * The object can be the data wrapped by an instance of XObject or subclass,
   * but it can also be an embedded json object also.
   *
   * NOTE: the value is set only if two values are not identical
   * They could be equivalent in which case we'll still update.
   *
   * @param {{}} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} value value to set. It can be json or XObject wrapper
   * @return {*} previous value, or null if value already same and not changed
   * @see ~GetObjectField
   * @see ~SetXObjectField
   */
  static SetObjectField(jsonObj, field, value) {
    if (!ObjectBase.AssertArrayNoNulls([jsonObj, field], _CLSNAME, 'SetObjFld', 'json,fld')) { return null; }
    const prev = jsonObj.hasOwnProperty(field) ? jsonObj[field] : null;
    if (prev !== value) {
      jsonObj[field] = value;
      return prev;
    }
    return null;
  } // SetObjectField


  /**
   * Import additional property values
   *
   * @param {{}} jsonObj
   * @param {{}} props
   * @param {boolean} override true to override existing value
   * @return {{}} replaced label/values
   */
  static ImportObjectFields(jsonObj, props, override = false) {
    return Util.ImportObjectFields(jsonObj, props, override);
  }

  /**
   * Retrieve the value of the field within the given object. The object can
   * be the data wrapped by an instance of XObject or subclass, but it
   * can also be an embedded json object also.
   *
   * @param {{}} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} defaultVal
   *
   * @see ~GetXObjectField
   * @see #SetObjectField
   * @see #HasObjectField
   * @see #ClearObjectField
   */
  static GetObjectField(jsonObj, field, defaultVal = null) {
    if (!ObjectBase.AssertArrayNoNulls([jsonObj, field], _CLSNAME, 'GetObjectField', 'Field name cannot be null.')) { return defaultVal; }
    const val = jsonObj[field];
    return (Util.NotNull(val)) ? val : defaultVal;
  }


  /**
   * Given an object with properties, extract a subset
   * using the inclusion and exclusion field name list.
   *
   * @param {{}} jsonObj object to extract properties from
   * @param {*} inFields array of property names to include
   * @param {*} excFields array of property names to exclude.
   * If property name is found in both include and exclude list,
   * the exclusion will win.
   * @return {{}} new json object with subset of properties
   */
  static GetObjectFields(jsonObj, inFields = null, exFields = null) {
    return Util.ExportObjectFields(jsonObj, inFields, exFields);
  } // GetObjectFields


  /**
   * Check if the given field name exists in the given json object.
   *
   * @param {{}} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field property label to find
   * @return {boolean} true if field (property/key) exists within the given object.
   * This does NOT mean value exists. The value still can be null. To truly remove
   * the entry, use ClearObjectField
   *
   * @see #GetObjectField
   * @see #SetObjectField
   * @see #ClearObjectField
   */
  static HasObjectField(jsonObj, field) {
    // simple json label check for now.
    return jsonObj.hasOwnProperty(field);
  }

  /**
   * Clear the property entry of the given object.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field property label to find and delete
   *
   * @see #GetObjectField
   * @see #SetObjectField
   * @see #HasObjectField
   */
  static ClearObjectField(jsonObj, field) {
    if (jsonObj.hasOwnProperty(field)) {
      delete jsonObj[field];
      return true;
    }
    return false;
  } // ClearObjectField

}

export default ObjectBase;
