
import ObjectBase from '../ObjectBase';
import ModelType, { XObjectProps } from './ModelConsts';
import Util from '../Util';

import Base64 from '../util/Base64';

const _CLSNAME = 'XObject'; // match class name

const PROP_TRANSIENT_PARENT = '_tp';

/**
 * Base class for all object models
 * used in any tier of the server
 *
 * WARNING This class is not implemented for embedding
 * at the moment, since the "data" property can't
 * be pointed to a JSON sub-record without some
 * unintended consequences.
 */
class XObject extends ObjectBase {
  // Property, Constants, and access selectors
  static get PROP_ID() { return XObjectProps.ID; }
  static get PROP_TYPE() { return XObjectProps.TYPE; }
  static get PROP_PARENT() { return XObjectProps.PARENT; }
  static get PROP_TITLE() { return XObjectProps.TITLE; }
  static get PROP_TITLE_FORMAT() { return XObjectProps.TITLE_FORMAT; }
  static get PROP_DERIVED_TITLE() { return XObjectProps.DERIVED_TITLE; }
  static get PROP_ORIG_TITLE() { return XObjectProps.ORIG_TITLE; }
  static get PROP_ORIG_LANG() { return XObjectProps.ORIG_LANG; }
  static get PROP_SUBTITLE() { return XObjectProps.SUBTITLE; }
  static get PROP_VERTITLE() { return XObjectProps.VERTITLE; }
  static get PROP_DESC() { return XObjectProps.DESC; }
  static get PROP_ICON_URL() { return XObjectProps.ICON_URL; }
  static get PROP_WWW_URL() { return XObjectProps.WWW_URL; }
  static get PROP_TEXT_URL() { return XObjectProps.TEXT_URL; }
  static get PROP_VIDEO_URL() { return XObjectProps.VIDEO_URL; }
  static get PROP_AUDIO_URL() { return XObjectProps.AUDIO_URL; }
  static get PROP_IMAGE_URL() { return XObjectProps.IMAGE_URL; }
  static get PROP_BGIMAGE_URL() { return XObjectProps.BGIMAGE_URL; }
  static get PROP_VIDEO_DURATION() { return XObjectProps.VIDEO_DURATION; }
  static get PROP_VIDEO_WIDTH() { return XObjectProps.VIDEO_WIDTH; }
  static get PROP_VIDEO_HEIGHT() { return XObjectProps.VIDEO_HEIGHT; }

  static get MAIN_DATA() { return XObjectProps.MAIN_DATA; }
  static get AUX_DATA() { return XObjectProps.AUX_DATA; }
  static get AUX_CATMAP() { return XObjectProps.AUX_TAGMAP; }
  static get AUX_TAGMAP() { return XObjectProps.AUX_TAGMAP; }

  static get SNAP_DATA() { return XObjectProps.SNAP_DATA; }
  static get SNAP_DATE() { return XObjectProps.SNAP_DATE; }
  static get VISIBILITY() { return XObjectProps.VISIBILITY; }
  static get PROP_CREATED_DATE() { return XObjectProps.CREATED_DATE; }
  static get PROP_UPDATED_DATE() { return XObjectProps.UPDATED_DATE; }
  static get PROP_PUBLISHED_DATE() { return XObjectProps.PUBLISHED_DATE; }
  static get PROP_EXPIRATION_DATE() { return XObjectProps.EXPIRATION_DATE; }
  static get PROP_DATA_SOURCE() { return XObjectProps.DATA_SOURCE; }

  static get VISTYPE_PUBLIC() { return XObjectProps.VISTYPE_PUBLIC; }
  static get VISTYPE_GROUP() { return XObjectProps.VISTYPE_GROUP; }
  static get VISTYPE_PRIVATE() { return XObjectProps.VISTYPE_PRIVATE; }

  constructor(clsname = _CLSNAME, props = null) {
    super(clsname);
    this.class = XObject;

    // This can get replaced when an external
    // json object is set with setData()
    this.data = props || {};
  }

  /**
   * Called to initialize as new instance. This should be implemented
   * by each subclass that support this and then call up via
   * super.initNew();
   */
  initNew() {
    super.initNew();
    this._setTypeID();
  }

  _setId(idVal) {
    return this.getClass().SetId(this.getData(true), idVal);
  }

  _clearId() {
    const data = this.getData(false);
    return data ? this.getClass().ClearId(data) : null;
  }

  /**
   * Return the identifier of this object.
   *
   * @param {*} defaultVal
   * @return {string} string identifer
   */
  getId(defaultVal = null) {
    return this.getClass().GetId(this.getData(), defaultVal);
  }

  /**
   * Internal function to set the "type" property in the wrapped
   * JSON object. This is normally called with initNew()
   */
  _setTypeID(type = null) {
    const _m = '_setTypeID';
    if (type == null) {
      type = this.getClass().GetTypeID();
      if (type == null) {
        const cname = this.getClassname();
        this.error(_m, `Cannot determine type. Class ${cname}'s GetTypeID() returns null! Class constructor: `, this.getClass());
        console.trace('stack dump');
        return false;
      }
    }

    const data = this.getData(true);
    if (data[XObject.PROP_TYPE] == null) { // can inherit
      data[XObject.PROP_TYPE] = type;
      return true;
    }

    if (type && data[XObject.PROP_TYPE] !== type) {
      // this.warn(_m, "Overriding instance type: ",
      //     data[XObject.PROP_TYPE], " with type: '" + type + "'");
      data[XObject.PROP_TYPE] = type;
      return true;
    }
  } // _setTypeID

  /**
   * Return the type ID that is stored in this object.
   *
   * @return {string} type string stored in PROP_TYPE
   */
  getType() {
    const data = this.getData(false);
    let type = data ? data[XObject.PROP_TYPE] : null;
    if (type == null) {
      type = this.getClass().GetTypeID();
      this.warn('getType', `obj does not have type field. Returning: ${type} for data: `, JSON.stringify(data));
      // this.warn("getType", "Returning static method GetTypeID's value:", type);
    }
    return type;
  }

  /**
   * (Transiently) Track an object is this object's "parent".
   *
   * NOTE: This is a TRANSIENT TRACKING, so it will
   * not be serialized and show up on the other side
   * of the network, or stored. There is setXParent
   * that tracks managed parent object's ID
   *
   * @param {*} obj
   * @return {*} previously set parent, if any
   *
   * @see ~getTParent
   * @see ~setXParent
   */
  setTParent(obj) {
    const prevP = this[PROP_TRANSIENT_PARENT];
    this[PROP_TRANSIENT_PARENT] = obj;
    if (Util.NotNull(prevP)) { this.warn('_setTP', 'Override'); }
    return prevP;
  }

  /**
   * Return a parent object that was explicitly tracked
   * in the same memory space.
   *
   * NOTE: If you set the parent and then transmit this
   * object over network or store/fetch, the tracking will
   * be lost!  There is getXParent that returns managed
   * parent object Id.
   *
   * @param {*} defaultVal
   * @return {*} object tracked with setParent()
   *
   * @see ~setTParent
   * @see ~getXParent
   */
  getTParent(defaultVal = null) {
    return this[PROP_TRANSIENT_PARENT] ? this[PROP_TRANSIENT_PARENT] : defaultVal;
  }

  /**
   * Set direct title value into this instance. There are
   * other methods that derive/proxy titles among set of
   * related objects.
   *
   * @param {string} title
   */
  setTitle(title) {
    return this.set(XObject.PROP_TITLE, title);
  }

  /**
   * Return title property.
   *
   * @param {*} defaultVal
   */
  getTitle(defaultVal = null) {
    return this.get(XObject.PROP_TITLE, defaultVal);
  }

  /**
   * Set title format string
   *
   * @param {string} titleFormat
   */
  setTitleFormat(titleFormat) {
    this.set(XObject.PROP_TITLE_FORMAT, titleFormat);
  }

  /**
   * Return title format string
   *
   * @param {*} defaultVal
   * @return {string} title format previously set
   */
  getTitleFormat(defaultVal = null) {
    return this.get(XObject.PROP_TITLE_FORMAT, defaultVal);
  }

  /**
   * Set derived title value into this instance.
   *
   * @param {string} title
   */
  setDerivedTitle(title) {
    this.set(XObject.PROP_DERIVED_TITLE, title);
  }

  /**
   * Return stored derive title or dynamically formatted
   * if there is a title format stored.
   *
   * @param {*} defaultVal
   * @return {string} title stored in derived property or
   * derived immediately.
   */
  getDerivedTitle(defaultVal = null) {
    let ttl = this.get(XObject.PROP_DERIVED_TITLE, null);
    if (Util.NotNull(ttl)) { return ttl; }

    const ttlf = this.getTitleFormat(null);
    if (Util.NotNull(ttlf)) { ttl = this.getEmbedded(ttlf); }
    return (Util.NotNull(ttl)) ? ttl : defaultVal;
  }

  /**
   * Set original title value into this instance. This
   * is used if title is different than the original,
   * which does imply also a different language
   * than English since we are English first website.
   *
   * @param {string} title
   */
  setOriginalTitle(title, lang) {
    this.set(XObject.PROP_ORIG_TITLE, title);
    if (lang) { this.set(XObject.PROP_ORIG_LANG, lang); }
  }

  /**
   * Set subtitle value into this instance. Subtitle
   * is like a "tagline", and typically a one-liner.
   *
   * @param {string} subtitle
   */
  setSubTitle(subtitle) {
    return this.set(XObject.PROP_SUBTITLE, subtitle);
  }

  /**
   * Return subtitle property.
   *
   * @param {*} defaultVal
   * @return {string} subtitle 1-liner string
   */
  getSubTitle(defaultVal = null) {
    return this.get(XObject.PROP_SUBTITLE, defaultVal);
  }

  /**
   * Return original title property.
   *
   * @param {*} defaultVal
   */
  getOriginalTitle(defaultVal = null) {
    return this.get(XObject.PROP_ORIG_TITLE, defaultVal);
  }

  /**
   * Return original title language
   *
   * @param {*} defaultVal
   */
  getOriginalTitleLang(defaultVal = null) {
    return this.get(XObject.PROP_ORIG_TITLE_LANG, defaultVal);
  }

  /**
   * @param {string} desc
   */
  setDescription(desc) {
    return this.set(XObject.PROP_DESC, desc);
  }

  /**
   * @param {*} defaultVal
   * @return {string}
   */
  getDescription(defaultVal = null) {
    return this.get(XObject.PROP_DESC, defaultVal);
  }

  /**
   * @param {string} url
   */
  setIconUrl(url) {
    return this.set(XObject.PROP_ICON_URL, url);
  }

  /**
   * @param {*} defaultVal
   * @return {string} url
   */
  getIconUrl(defaultVal = null) {
    return this.get(XObject.PROP_ICON_URL, defaultVal);
  }

  /**
   * Set the data source identifier. Data source is only
   * tracked if it's from third party that need to be
   * acknowledged.
   *
   * @param {string} srcId should be fully qualified, unless it's
   * within default domain.
   */
  setDataSource(srcId) {
    return this.set(XObject.PROP_DATA_SOURCE, srcId);
  }

  /**
   * Get data source Id, which should be acronym
   * of the origin where the data came from
   *
   * @param {*} defaultVal
   * @return {string} authorative web page url
   */
  getDataSource(defaultVal = null) {
    return this.get(XObject.PROP_DATA_SOURCE, defaultVal);
  }

  /**
   * Set the definitive home page's URL.
   *
   * @param {string} url should be fully qualified, unless it's
   * within default domain.
   */
  setWWWUrl(url) {
    return this.set(XObject.PROP_WWW_URL, url);
  }

  /**
   * Get main web page URL
   *
   * @param {*} defaultVal
   * @return {string} authorative web page url
   */
  getWWWUrl(defaultVal = null) {
    return this.get(XObject.PROP_WWW_URL, defaultVal);
  }

  /**
   * Set "the" text page link for the content that this instance
   * represents.
   *
   * @param {string} url should be fully qualified, unless it's
   * within default domain.
   */
  setTextUrl(url) {
    return this.set(XObject.PROP_TEXT_URL, url);
  }

  /**
   * Get main text URL. This is probably useless given most
   * are web page these days...
   *
   * @param {*} defaultVal
   * @return {string} authorative web page url
   */
  getTextUrl(defaultVal = null) {
    return this.get(XObject.PROP_TEXT_URL, defaultVal);
  }

  /**
   * Set "the" video page link for the content that this instance
   * represents.
   *
   * @param {string} url should be fully qualified, unless it's
   * within default domain.
   */
  setVideoUrl(url) {
    return this.set(XObject.PROP_VIDEO_URL, url);
  }

  /**
   * Get URL to the main video
   *
   * @param {*} defaultVal
   * @return {string} authorative video url
   */
  getVideoUrl(defaultVal = null) {
    return this.get(XObject.PROP_VIDEO_URL, defaultVal);
  }

  /**
   * Set duration of the video
   *
   * @param {number} seconds
   * within default domain.
   */
  setVideoDuration(seconds) {
    return this.set(XObject.PROP_VIDEO_DURATION, seconds);
  }

  /**
   * Get the duration of the main video
   *
   * @param {*} defaultVal
   * @return {string} duration
   */
  getVideoDuration(defaultVal = null) {
    return this.get(XObject.PROP_VIDEO_DURATION, defaultVal);
  }


  /**
   * Set video width.
   *
   * @param {number} width
   */
  setVideoWidth(width) {
    return this.set(XObject.PROP_VIDEO_WIDTH, width);
  }

  /**
   * Return the video width
   *
   * @param {*} defaultVal
   * @return {number} width
   */
  getVideoWidth(defaultVal = null) {
    return this.get(XObject.PROP_VIDEO_WIDTH, defaultVal);
  }

  /**
   * Set video height.
   *
   * @param {number} height
   */
  setVideoHeight(height) {
    return this.set(XObject.PROP_VIDEO_HEIGHT, height);
  }

  /**
   * Return the video height
   *
   * @param {*} defaultVal
   * @return {number} height
   */
  getVideoHeight(defaultVal = null) {
    return this.get(XObject.PROP_VIDEO_HEIGHT, defaultVal);
  }


  /**
   * Set "the" audio page link for the content that this instance
   * represents.
   *
   * @param {string} url should be fully qualified, unless it's
   * within default domain.
   */
  setAudioUrl(url) {
    return this.set(XObject.PROP_AUDIO_URL, url);
  }

  /**
   * Get URL to the main audio
   *
   * @param {*} defaultVal
   * @return {string} authorative video url
   */
  getAudioUrl(defaultVal = null) {
    return this.get(XObject.PROP_AUDIO_URL, defaultVal);
  }

  /**
   * Set "the" image page link for the content that this instance
   * represents.
   *
   * @param {string} url should be fully qualified, unless it's
   * within default domain.
   */
  setImageUrl(url) {
    return this.set(XObjectProps.IMAGE_URL, url);
  }

  /**
   * Get URL to the main image. The URL maybe derived
   * based on size requested.
   *
   * @param {*} defaultVal
   * @return {string} authorative video url
   */
  getImageUrl(defaultVal = null) {
    return this.get(XObjectProps.IMAGE_URL, defaultVal);
  }

  /**
   * Set an image url as background (or static) image link.
   * This should not be an animated GIF.
   *
   * @param {string} url
   */
  setBackgroundImageUrl(url) {
    return this.set(XObjectProps.BGIMAGE_URL, url);
  }

  /**
   * @param {*} defaultVal
   * @return {string} url
   */
  getBackgroundImageUrl(defaultVal = null) {
    return this.get(XObjectProps.BGIMAGE_URL, defaultVal);
  }

  /**
   * Set color code for background, if make sense for
   * a subclass instance
   *
   * @param {string} colorCode
   * @return {string} previous set value
   */
  setBackgroundColor(colorCode) {
    return this.set(XObjectProps.BGCOLOR, colorCode);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string} set value, if any
   */
  getBackgroundColor(defaultVal = null) {
    return this.get(XObjectProps.BGCOLOR, defaultVal);
  }

  /**
   * Set color code for foreground, if make sense for
   * a subclass instance
   *
   * @param {string} colorCode
   * @return {string} previous set value
   */
  setForegroundColor(colorCode) {
    return this.set(XObjectProps.FGCOLOR, colorCode);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string} set value, if any
   */
  getForegroundColor(defaultVal = null) {
    return this.get(XObjectProps.FGCOLOR, defaultVal);
  }

  //
  // This section has the getter/setter for embedded objects and their fields
  //

  /**
   * Return value of a property that is directly on this
   * class instance, NOT in the wrapped data (PROP_MAIN)
   *
   * @param {string} label property name
   * @param {boolean} create if doesn't exist, create if true
   * @return {object=}
   *
   * @see ~getXObject
   * @see ~setObject
   */
  getObject(label, create = false) {
    let objData = this[label];
    if ((objData == null) && create) {
      objData = {};
      this[label] = objData;
    }
    return this[label];
  }

  /**
   * Return wrapped value of a property that is directly on this
   * class instance, not inside wrapped data (PROP_MAIN)
   *
   * @param {string} label
   * @param {*} defaultVal
   * @return {XObject} wrapped value if has PROP_TYPE (_t)
   */
  getXObject(label, defaultVal = null) {
    const jsonObj = this.getObject(label, false);
    return jsonObj ? XObject.Wrap(jsonObj) : defaultVal;
  }

  /**
   * Set the value of a direct property that is of an object type.
   * If it's an XObject, it will be unwrapped.
   *
   * @param {string} label
   * @param {{}} jsonObj
   * @return {{}} previous set json object
   *
   * @see ~getObject
   */
  setObject(label, jsonObj) {
    // complete replacement
    jsonObj = XObject.Unwrap(jsonObj);
    let prevObj = null;
    if (this[label] !== jsonObj) {
      prevObj = this[label];
      this[label] = jsonObj;
      this.setDirty();
    }
    return prevObj;
  }

  /**
   * Used for property watching subscription. Watching properties
   * under MAIN_DATA require pre-pending and this helps with that.
   *
   * @param {string} topLabel
   * @param {string} field
   * @return {string}
   */
  getXPropertyPath(topLabel, field) {
    if (topLabel == null) { topLabel = XObject.MAIN_DATA; }
    return `${topLabel}.${field}`;
  }

  /**
   * Setting a field (property) of an immediate embedded object/json
   * inside this instance.
   *
   * NOTE: value will only be replaced if it's not identicial using  !==
   *
   * @param {string} label property name of the embedded object
   * @param {string} field property name of the field inside the embedded object
   * @param {*} value
   * @return {*} old value
   *
   * @see ~setXObjectField
   * @see XObject#SetObjectField
   * @see ~importObjectFields
   */
  setObjectField(label, field, value) {
    // this.log("setObjectField", `label=${label}, field=${field}, value=${value}`);
    const oldValue = this.getClass().SetObjectField(this.getObject(label, true), field, value);
    if (oldValue !== value) {
      this.setDirty();
      const propname = this.getXPropertyPath(label, field);
      this._dispatchHandlers(propname, oldValue, value);
    }
    return oldValue;
  } // setObjectField

  /**
   * Setting a field (property) of an immediate embedded XObject instance
   * inside this instance. The actual stored data is the json data stored in
   * the XObject instance.
   *
   * @param {string} label property name of the embedded object
   * @param {string} field property name of the field inside the embedded object
   * @param {XObject} xobj wrapped instance for which it's json data is to be embedded
   *
   * @see ~setObjectField
   * @see ~setX
   */
  setXObjectField(label, field, xobj) {
    const oldValue = this.getClass().SetXObjectField(this.getObject(label, true), field, xobj);

    // Can't really compare...
    if (oldValue !== xobj) {
      this.setDirty();
      const propname = this.getXPropertyPath(label, field);
      this._dispatchHandlers(propname, oldValue, xobj);
    }
    return oldValue;
  }

  /**
   * Import multiple values into this object's content
   *
   * @param {{}} props
   * @param {boolean} override true to override existing
   */
  importObjectFields(props, override = false) {
    const data = this.getData(true);
    const replacedData = this.getClass().ImportObjectFields(data, props, override);
    if (replacedData && replacedData.keys && replacedData.keys.length > 0) { this.setDirty(); }
    return replacedData;
  }

  /**
   * Return an embedded object (json)'s value at the given field.
   *
   * @param {string} label
   * @param {string} field
   * @param {*} defaultVal
   * @return {{}} json object
   *
   * @see ~getXObjectField
   * @see ~clearObjectField
   * @see ~hasObjectField
   */
  getObjectField(label, field, defaultVal = null) {
    const obj = this.getObject(label, false);
    if (obj == null) { return defaultVal; }
    return this.getClass().GetObjectField(obj, field, defaultVal);
  } // getObjectField

  /**
   * Return an embedded object (json)'s value at the given field,
   * but wrap first as XObject instance before returning.
   *
   * @param {string} label
   * @param {string} field
   * @param {*} defaultVal
   * @return {XObject} wrapped instance or defaultVal
   */
  getXObjectField(label, field, defaultVal = null) {
    const obj = this.getObject(label, false);
    if (obj == null) { return defaultVal; }
    return this.getClass().GetXObjectField(obj, field, defaultVal);
  } // getObjectField

  /**
   * Check if a field inside a json property exists
   *
   * @param {string} label key to json property
   * @param {string} field property label to find inside the json property
   * @param {boolean} existOK if true, check stops at property exists.
   * if false, then the value associated with propety will be checked for not null or undefined
   * @return {boolean} true if field (property/key) exists within the given object,
   * unless existOK is set to false for which the actual value is checked.
   *
   * @see ~has
   */
  hasObjectField(label, field, existOK = true) {
    const obj = this.getObject(label, false);
    if (obj == null) { return false; }
    return this.getClass().HasObjectField(obj, field, existOK);
  } // hasObjectField

  /**
   * Clear the value of a field of an immediate embedded object/json
   * inside this instance.
   *
   * @param {string} label property label of the contained object
   * @param {string} field field within the contained object
   */
  clearObjectField(label, field) {
    const obj = this.getObject(label, false);
    if (obj == null) { return false; }
    const cleared = this.getClass().ClearObjectField(obj, field);
    if (cleared) {
      this.setDirty();
      const propname = this.getXPropertyPath(label, field);
      this._dispatchHandlers(propname, null, null);
    }
    return cleared;
  } // clearObjectField

  /**
   * Given an object with properties, extract a subset
   * using the inclusion and exclusion field name list.
   *
   * @param {*} inFields array of property names to include
   * @param {*} excFields array of property names to exclude.
   * If property name is found in both include and exclude list,
   * the exclusion will win.
   * @return {{}} new json object with subset of properties
   */
  getObjectFields(inFields = null, exFields = null) {
    const data = this.getData(false);
    return data ? XObject.GetObjectFields(data, inFields, exFields) : [];
  }

  /**
   * Setting a field (property) of an immediate embedded object/json
   * with a converted base64 value
   *
   * NOTE: value will only be replaced if it's not identicial using  !==
   *
   * @param {string} label property name of the embedded object
   * @param {string} field property name of the field inside the embedded object
   * @param {*} value
   * @return {*} old value
   *
   * @see XObject#SetObjectField
   * @see ~importObjectFields
   */
  setBase64Field(label, field, value) {
    const oldValue = XObject.SetBase64Field(this.getObject(label, true), field, value);
    if (oldValue !== value) { this.setDirty(); }
    return oldValue;
  }

  /**
   * Return an embedded object (json)'s value decoded using base64 algorithm
   *
   * @param {string} label
   * @param {string} field
   * @param {*} defaultVal
   */
  getBase64Field(label, field, defaultVal = null) {
    const obj = this.getObject(label, false);
    if (obj == null) { return defaultVal; }
    return XObject.GetBase64Field(obj, field, defaultVal);
  }

  /**
   * Setting a field (property) of an immediate embedded object/json
   * proceeded with an encryption
   *
   * NOTE: value will only be replaced if it's not identicial using  !==
   *
   * @param {string} label property name of the embedded object
   * @param {string} field property name of the field inside the embedded object
   * @param {*} value
   * @return {*} old value
   *
   * @see XObject#GetObjectField
   * @see ~importObjectFields
   */
  setEncryptedField(label, field, value) {
    const oldValue = XObject.SetEncryptedField(this.getObject(label, true), field, value);
    if (oldValue !== value) { this.setDirty(); }
    return oldValue;
  }

  /**
   * Return an embedded object (json)'s encrypted value decrypted
   *
   * @param {string} label
   * @param {string} field
   * @param {*} defaultVal
   * @return {*} decrypted
   */
  getEncryptedField(label, field, defaultVal = null) {
    const obj = this.getObject(label, false);
    if (obj == null) { return defaultVal; }
    return XObject.GetEncryptedField(obj, field, defaultVal);
  }

  /**
   * Track a object designated as the parent container of this.
   * This is transient tracking and won't be saved.
   *
   * @param {XObject} xobj designated parent object to track
   * as direct property of this instance in memory (not persistent)
   *
   * @see ~setXParent
   */
  setTransientXParent(xobj) {
    this.xp = xobj;
  }

  /**
   * Retrieve a (transient) tracked parent object.
   *
   */
  getXParent(defaultVal = null) {
    return this.xp ? this.xp : defaultVal;
  }

  /**
   * Set the parent property to the id of the parent.
   * And track the parent object as a transient via immediate
   * property.
   *
   * NOTE 2/10/2020: setting parent ID no longer make practical sense
   * as cloning will take too much work to go through each rank item
   * and clear/replace parent Id. So for now it's only transient tracking.
   *
   * @param {XObject} xobj object to reference as parent
   * @return {XObject} previous parent if any, or null
   */
  setXParent(xobj) {
    let retval;
    if (xobj) {
      // let parentId = XObject.GetId(xobj); // in case it's only json
      // retval = this.set(XObject.PROP_PARENT, parentId);
      this.setTransientXParent(xobj);
    } else { retval = null; }
    return retval;
  }

  /**
   * Retrieve parent Id. If null as a json property,
   * then check if it is tracked as a transient.
   *
   * @param {*} defaultVal if no Id is found
   * @return {string} parent object Id or default value
   */
  getXParentId(defaultVal = null) {
    let parentId = this.get(XObject.PROP_PARENT, null);
    if (parentId == null) {
      const pobj = this.getXParent(null);
      if (Util.NotNull(pobj)) { parentId = XObject.GetId(pobj); }
    }
    return parentId || defaultVal;
  }


  // Getters and setts for the main streamable content

  /**
   * Return all property names of the first level
   * fields.
   *
   * @return {[]} array of field names
   */
  getLabels() {
    const data = this.getData(false);
    return (Util.NotNull(data)) ? Object.keys(data) : [];
  }

  /**
   * Retrieve the main data wrapped by this object
   *
   * @param {boolean} create true to create empty {} if null
   * @see #getAux()
   * @see #setData()
   * @see #cloneData()
   */
  getData(create = false) {
    if (this[XObject.MAIN_DATA] == null && create) {
      this[XObject.MAIN_DATA] = {};
      this.warn('getData', 'delayed creation of data content');
    }
    return this[XObject.MAIN_DATA];
  }

  /**
   * Replace main data wrapped by this object.
   *
   * WARNING: This will unconditionally replacing
   * existing data.
   *
   * @return {{}} previous data if any
   *
   * @see #getData
   * @see #getAux
   */
  setData(data) {
    if (this[XObject.MAIN_DATA] === data) { return; }

    const prevData = this[XObject.MAIN_DATA];
    this[XObject.MAIN_DATA] = data;
    this.setDirty();
    return prevData;
  }

  /**
   * Return a fully cloned (deep copied) version
   * of the JSON data wrapped by this object.
   *
   * @return {object} cloned data, or null if there is
   * no data wrapped by this object
   *
   * @see #getData()
   * @see XObject#CloneData()
   */
  cloneData() {
    const data = this.getData(false);
    if (data == null) { return null; }
    return XObject.CloneData(data);
  }


  /**
   * Clone an instance of this object, including the wrapper class.
   */
  cloneInstance() {
    const newObj = XObject.CloneInstance(this);

    // do some tweaking that cannot be done at static method level?

    return newObj;
  }

  // --------------------- Delta Tracking / Generation ----------------------

  /**
   * Retrieve the snapshot data stored as a transient in
   * this object (no serialization)
   *
   * @param {boolean} create true to create empty {} if null
   * @return {{}} json data
   * @see #createSnapshot()
   * @see #clearSnapshot()
   * @see #getDelta
   */
  getSnapshot(create = false, defaultVal = null) {
    if (this[XObject.SNAP_DATA] == null && create) {
      this[XObject.SNAP_DATA] = {};
    }
    return this[XObject.SNAP_DATA] ? this[XObject.SNAP_DATA] : defaultVal;
  }

  /**
   * Return snapshot data stored wrapped in XObject
   *
   * @param {boolean} create
   * @param {*} defaultVal
   */
  getXSnapshot(create = false, defaultVal = null) {
    const sdata = this.getSnapshot(create, null);

    return sdata ? XObject.Wrap(sdata) : defaultVal;
  }

  /**
   * Internal function to track a snapshot. This is not for
   * general use.
   *
   * @param {{}} data json data that will be used as snapshot data
   */
  _setSnapshot(data) {
    if (Util.NotNull(data)) {
      this[XObject.SNAP_DATA] = data;
      this[XObject.SNAP_DATE] = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Create a snapshot of the current data wrapped
   * by this class.
   *
   * @param {boolean} override true to allow override existing.
   * @return {boolean} true if created, faslse if existing and
   * no override, or new (if XMObject)
   *
   * @see #getSnapshot
   * @see #clearSnapshot
   * @see #getDelta
   */
  createSnapshot(override = true) {
    const snapdata = this.getSnapshot(false);
    if (snapdata && !override) {
      return false;
    }
    const data = this.getData(false);
    const snapshot = XObject.CloneData(data);

    return this._setSnapshot(snapshot);
  } // createSnapshot

  /**
   * Restore previously snapshot data.
   *
   * @param {boolean} clearModified ture to reset modified flag.
   * @return {{}} the data this function
   * just replaced with snapshot data.
   */
  resetFromSnapshot(clearModified = false) {
    const snapdata = this.getSnapshot(false);
    if (snapdata == null) {
      return false;
    }

    const newData = XObject.CloneData(snapdata);
    const oldData = this.setData(newData);
    if (clearModified) { this.clearModified(); }
    return oldData;
  } // resetFromSnapshot

  /**
   * Reset snapshot data and timestamp
   *
   * @param {boolean} clearModified ture to reset modified flag.
   * @return {boolean} true if there is a snapshot to clear,
   * false if there was nothing to clear
   *
   * @see #getSnapshot
   * @see #createSnapshot
   * @see #getDelta
   */
  clearSnapshot(clearModified = false) {
    if (clearModified) { this.clearModified(); }

    if (this[XObject.SNAP_DATA] == null) { return false; }
    this[XObject.SNAP_DATA] = null;
    this[XObject.SNAP_DATE] = null;

    return true;
  } // cloneSnapshot

  /**
   * Report on whether a snapshot has been created
   * and tracked by this object.
   *
   * @return {boolean} true if snapshot exists
   */
  hasSnapshot() {
    const snapshot = this.getSnapshot(false, null);
    return (Util.NotNull(snapshot));
  }

  /**
   * Check if a delta can produce non-empty
   * result.
   *
   * @return {boolean} true if delta can be generated
   */
  hasDelta() {
    // First, there has to be a snapshot or we can't
    // check for differences
    const snapshot = this.getSnapshot(false, null);
    if (snapshot == null) { return false; }

    // Next, Check the updated timestamp of the snapshot
    // and the current version.
    const current = this.getData(false);
    const snapshotTS = XObject.GetUpdatedTS(snapshot, null);
    const currentTS = XObject.GetUpdatedTS(current, null);
    this.log('hasDelta', `SnapshotTS: ${snapshotTS}, currentTS: ${currentTS}`);
    return (snapshotTS === currentTS);
  } // hasDelta

  /**
   * Check value of the field against snapshot and report if changed.
   *
   * @param {string} field
   * @return {boolean} true if changed, false if no change or no snapshot
   */
  changedFromSnapshot(field) {
    const snapshotData = this.getSnapshot();
    if (snapshotData == null) { return false; }

    const curVal = this.get(field, null);
    const origVal = XObject.GetObjectField(snapshotData, field, null);
    return curVal !== origVal;
  } // changedFromSnapshot

  // ---------------- BASIC GETTER and SETTER on Fields --------------------

  /**
   * Set a field/value entry into the main data json
   *
   * @param {string} field
   * @param {*} value
   * @return {*} old Value
   */
  set(field, value) {
    return this.setObjectField(XObject.MAIN_DATA, field, value);
  }

  /**
   * Set an XObject's data as a field entry into the main data json
   *
   * @param {string} field
   * @param {*} value
   * @return {*} old Value (not wrapped)
   *
   */
  setX(field, xobj) {
    return this.setXObjectField(XObject.MAIN_DATA, field, xobj);
  }

  /**
   * Return the value of the field defined in the main dat ajson
   *
   * @param {string} field
   * @param {*} defaultVal
   * @return {*} value
   *
   * @see ~getEmbedded
   * @see ~getMultiple
   */
  get(field, defaultVal = null) {
    return this.getObjectField(XObject.MAIN_DATA, field, defaultVal);
  }

  /**
   * Retrieve the property into the json data as wrapped XObject instance.
   *
   * @param {*} field
   * @param {*} defaultVal
   * @return {XObject} wrapped json data
   */
  getX(field, defaultVal = null) {
    return this.getXObjectField(XObject.MAIN_DATA, field, defaultVal);
  }

  /**
   * Check if a property exists or has null value
   *
   * @param {string} field key to property value
   * @param {boolean} existOK if true, check stops at property exists.
   * if false, then the value associated with propety will be checked for not null or undefined
   * @return {boolean} true if field (property/key) exists within the given object,
   * unless existOK is set to false for which the actual value is checked.
   *
   */
  has(field, existOK = true) {
    return this.hasObjectField(XObject.MAIN_DATA, field, existOK);
  }

  /**
   * Get Embedded value
   *
   * Given a path separated by dot ".", navigate into embedded json
   * structures to retrieve the value associate with the path.
   *
   * @param {string} path format of "key1.key2.key3"
   * @param {*} defaultVal value to return if real value not found
   *
   * @see ~get
   * @see ~getm
   */
  getEmbedded(path, defaultVal = null) {
    const data = this.getData(false);
    if (!data) { return defaultVal; }
    const value = Util.GetEmbeddedJSONPaths(data, path);

    return value;
  }

  /**
   * Retrieve multiple values for a list of given fields
   *
   * @param {[]=} fields list of property names. If null, use all field names
   * @param {defaultVal=} default value when no value exist for the field
   * @return {[]} corresponding array for values, if no value, defaultVal
   * is used. null is returned if given field array is not an array
   *
   * @see ~getLabels()
   */
  getMultiple(fields = null, defaultVal = null) {
    if (fields == null) {
      fields = this.getLabels();
    }
    if (!Array.isArray(fields)) { return null; }
    const len = fields.length;
    let name;
    let value;
    const values = [];
    for (let i = 0; i < len; i++) {
      name = fields[i];
      value = (Util.NotNull(name)) ? this.get(name, defaultVal) : defaultVal;
      values.push(value);
    }
    return values;
  }

  /**
   * Return the field value as a boolean type.
   * @param {string} field
   * @param {boolean} defaultVal
   */
  getBoolean(field, defaultVal = false) {
    const val = this.get(field, null);
    return Util.toBoolean(val, defaultVal);
  }

  /**
   * Return a field value as a number
   *
   * @param {string} field
   * @param {*} defaultVal
   * @return {number}
   */
  getNumber(field, defaultVal = null) {
    const val = this.get(field, null);
    return val ? Util.toNumber(val, defaultVal) : defaultVal;
  }

  /**
   * Set a field/value entry into the main data json
   *
   * @param {string} field
   * @param {*} value
   * @return {*} old Value
   */
  setBase64(field, value) {
    return this.setBase64Field(XObject.MAIN_DATA, field, value);
  }

  /**
   * Return the value of the field defined in the main dat ajson
   *
   * @param {string} field
   * @param {*} defaultVal
   * @return {*} value
   */
  getBase64(field, defaultVal = null) {
    return this.getBase64Field(XObject.MAIN_DATA, field, defaultVal);
  }

  /**
   * Encrypted and set field/value entry into the main data json
   *
   * @param {string} field
   * @param {*} value
   * @return {*} old Value
   */
  setEncrypted(field, value) {
    return this.setEncryptedField(XObject.MAIN_DATA, field, value);
  }

  /**
   * Decrypte and return encrypted value of the field defined in the main data json
   *
   * @param {string} field
   * @param {*} defaultVal
   * @return {*} value
   */
  getEncrypted(field, defaultVal = null) {
    return this.getEncryptedField(XObject.MAIN_DATA, field, defaultVal);
  }

  /**
   * clear/remove a field.
   *
   * @param {string} field
   * @return {boolean} true if field removed, false if field
   * never exists
   */
  clear(field) {
    return this.clearObjectField(XObject.MAIN_DATA, field);
  }

  // Object-in-cache status (not implemented at this level)

  /**
   * Mark this object's data as modified.
   * Implementation is done by subclass
   * XMObject. At this level it's abstract and no-op
   * unless it is contained in which case we'll
   * check with parent.
   *
   * @return {boolean} true if parent object is marked as dirty,
   * or null if no parent.
   */

  setDirty() {
    // Overrriden in XMObject
    const xparent = this.getXParent(null);
    return xparent ? xparent.setDirty() : null;
  }

  /**
   * Return whether this object's data is marked as
   * dirty (or modified). Implementation is done
   * by subclass XMObject. At this level it's
   * abstract and no-op.
   *
   * @return {boolean} true if it's marked as dirty
   */
  isDirty() {
    const xparent = this.getXParent(null);
    return xparent ? xparent.isDirty() : null;
    // Overridden in XMObject
  }

  /**
   * Return whether this object's data is marked
   * either as dirty or new.
   *
   * @return {boolean} true if it's marked as new or dirty
   */
  isModified() {
    // implemented by subclass
    return this.isDirty();
  }

  clearModified() {
    return null;
  }

  /**
   * Clear dirty flag if tracking is enabled. This
   * is for subclass (XMObject-level) implementation.
   * At this level it's abstract (no-op) but we go
   * to parent if this is contained.
   *
   * @return {boolean} true if has parent and cleared.
   * Null if no-op
   */
  clearDirty() {
    // Overridden in XMObject
    const xparent = this.getXParent(null);
    return xparent ? xparent.cleardirty() : false;
  }

  // ---------------- Creation / update / publish timestaps -------------

  /**
   * Set creation date. If null timestamp is given, will
   * assume current time.
   *
   * @param {number} ts epoch time or null
   */
  setCreatedTS(ts = null) {
    return XObject.SetCreatedTS(this.getData(true), ts);
  }

  /**
   * Used by StorageManager. Indicate this class of objects
   * must have a creation timestamp. This is to be overridden
   * by subclass
   *
   * @return {boolean} true to enforce a creation timestamp.
   *
   * @see ~mustHaveUpdatedTS()
   */
  mustHaveCreatedTS() {
    return true;
  }

  /**
   * Return the created timestamp value.
   *
   * @param {*} defaultVal (-1)
   * @return {number} timestamp if exists, defaultVal if not
   *
   * @see ~getUpdatedTS
   * @see ~getTS
   */
  getCreatedTS(defaultVal) {
    const data = this.getData(false);
    return data ? XObject.GetCreatedTS(data, defaultVal) : defaultVal;
  }
  _clearCreatedTS() {
    const retVal = XObject.ClearCreatedTS(this.getData());
    if (this.isDirty() === false) { this.setDirty(); }
    return retVal;
  }

  /**
   * Set updated timestamp. While this can be called during
   * model manipulation session, the "final" update will occur
   * when writing to storage in StorageManager. So best
   * to use editedTS.
   *
   * @param {number} timeVal specific time to set, null to use current time
   *
   * @see ~setEditedTS
   * @see ~setCreatedTS
   */
  setUpdatedTS(timeVal = null) {
    if (timeVal == null) { timeVal = Date.now(); }
    const retVal = XObject.SetUpdatedTS(this.getData(), timeVal);
    if (this.isDirty() === false) {
      this.setDirty();
      const propname = this.getXPropertyPath(null, XObject.UPDATED_DATE);
      this._dispatchHandlers(propname, retVal, timeVal);
    }
    return retVal;
  } // setUpdatedTS

  /**
   * Used by StorageManager. Indicate this class of objects
   * must have an updated timestamp. This is to be overridden
   * by subclass
   *
   * @return {boolean} true to enforce a updated timestamp.
   *
   * @see ~mustHaveCreatedTS()
   */
  mustHaveUpdatedTS() {
    return true;
  }

  /**
   * Get updated timestamp value stored in json. If you want
   * to fetch created timestamp as a fallback, use getTS()
   * instead
   *
   * @param {*} defaultVal
   *
   * @see ~getTS
   */
  getUpdatedTS(defaultVal = -1) {
    const data = this.getData(false);
    return data ? XObject.GetUpdatedTS(data, defaultVal) : defaultVal;
  }

  _clearUpdatedTS() {
    const retVal = XObject.ClearUpdatedTS(this.getData());
    if (this.isDirty() === false) { this.setDirty(); }
    return retVal;
  }

  /**
   * Get either the updated timestamp, or created timestamp if
   * no updated timestamp
   *
   * @param {*} defaultVal (-1)
   * @return {number} either updatedTS or createdTS or defaultVal
   *
   * @see ~getUpdatedTS
   * @see ~getCreatedTS
   */
  getTS(defaultVal = -1) {
    const data = this.getData(false);
    return data ? XObject.GetTS(data, defaultVal) : defaultVal;
  }

  /**
   * Return whether this instance has been updated (included created)
   * within the elapsed time.
   *
   * @param {number} inSeconds number of seconds to test
   * @return {boolean} true if updated or created time are within the
   * given seconds. False if not
   */
  hasUpdatedWithin(inSeconds) {
    const data = this.getData(false);
    return data ? XObject.HasUpdatedWithin(data, inSeconds) : false;
  }

  /**
   * Set published timestamp.
   *
   * @see ~setEditedTS
   * @see ~setCreatedTS
   *
   * @see ~setPublicVisibility
   */
  setPublishedTS(timeVal = null) {
    const retVal = XObject.SetPublishedTS(this.getData(), timeVal);
    if (this.isDirty() === false) { this.setDirty(); }
    return retVal;
  } // setUpdatedTS

  /**
   * Get publsiehd timestamp value stored in json
   *
   * @param {*} defaultVal
   */
  getPublishedTS(defaultVal = -1) {
    const data = this.getData(false);
    return data ? XObject.GetPublishedTS(data, defaultVal) : defaultVal;
  }

  _clearPublishedTS() {
    const retVal = XObject.ClearPublishedTS(this.getData());
    if (this.isDirty() === false) { this.setDirty(); }
    return retVal;
  }

  /**
   * Set the timestamp to now for the last edit. Edit TS
   * is used to track the last time user edited this object.
   * This is different that last updated when imply being
   * written.
   *
   * @see ~setCreatedTS
   * @see ~setUpdatedTS
   * @see ~getEditedTS
   */
  setEditedTS() {
    const retVal = XObject.SetEditedTS(this.getData());
    if (this.isDirty() === false) { this.setDirty(); }
    return retVal;
  }
  getEditedTS(defaultVal) {
    const data = this.getData(false);
    return data ? XObject.GetEditedTS(data, defaultVal) : defaultVal;
  }
  _clearEditedTS() {
    const retVal = XObject.ClearEditedTS(this.getData());
    if (this.isDirty() === false) { this.setDirty(); }
    return retVal;
  }

  /**
   * Set time value in expiration field
   *
   * @param {number} time epoch time in SECONDS since 1970
   * @return {boolean} true if set, false if not set
   *
   * @see ~hasExpired
   * @see ~getExpiration
   * @see ~clearExpiration
   */
  setExpiration(timeVal = null) {
    const data = this.getData(true);
    return XObject.SetExpiration(data, timeVal);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {number} expiration - epoch time in SECONDS since 1970
   *
   * @see ~setExpiration
   * @see ~hasExpired
   */
  getExpiration(defaultVal = -1) {
    const data = this.getData(false);
    return data ? XObject.GetExpiration(data, defaultVal) : defaultVal;
  }

  /**
   * Remove expiration field, if exists
   *
   * @return {boolean} true if cleared, false if couldn't clear (no data or field)
   */
  clearExpiration() {
    const data = this.getData(false);
    return data ? XObject.ClearExpiration(data) : false;
  }

  /**
   * Determine if the date value in expiration field is
   * less than current time, therefore interpreted as expired.
   *
   * @param {*} defaultVal value to return if no value in this field
   * @return {boolean} true if expired, false if not, or defaultVal if no value
   */
  hasExpired(defaultVal = false) {
    const data = this.getData(false);
    return data ? XObject.HasExpired(data, defaultVal) : defaultVal;
  }

  // ---------------------- Visbility Scope ---------------------

  /**
    * Update object's visibility scope to VISTYPE_PUBLIC,
    * and also update published timestamp.
    *
    * @param {number=} ts optional time value to set or null to use current time
    * @return {string} previous scope, or null if none
    *
    * @see ~setPublishedTS
    */
  setPublicVisibility(ts = null) {
    const data = this.getData(true);
    const result = XObject.SetPublicVisibility(data, ts);
    if (this.isDirty() === false) { this.setDirty(); }
    return result;
  }

  /**
   * Clear VISTYPE_PUBLIC visibility scope. In our implementation, it's
   * simply a removal since no scope equals private anyway.
   *
   * @return {boolean} true if cleared, false if no need or can't
   */
  clearPublicVisibility() {
    const data = this.getData(false);
    if (!data) { return false; }

    const result = XObject.ClearPublicVisibility(data);
    if (this.isDirty() === false) { this.setDirty(); }
    return result;
  }

  /**
   * Set visibility scope. This is a generic method to facilitate copying
   * from one object type to another
   *
   * @param {string} scope one of VISTYPE_*
   * @return {string} previous scope, if any
   *
   * @see ~setPubliscVisibility  Better to use b/c setting timestamp also
   */
  setVisibility(scope) {
    const data = this.getData(true);
    const result = XObject.SetVisibility(data, scope);
    if (this.isDirty() === false) { this.setDirty(); }
    return result;
  } // setVisibility

  /**
   * Clear existing visibility scope flag. By clearing, the
   * default scope is private.
   *
   * @return {boolean} true if cleared. False if no need or cannot
   */
  clearVisibility() {
    const data = this.getData(false);
    if (!data) { return false; }

    const result = XObject.ClearVisibility(data);
    if (this.isDirty() === false) { this.setDirty(); }
    return result;
  }

  /**
   * Retrieve visibility status of this object. If not set, then
   * the assumption is it is private (VISTYPE_PRIVATE)
   *
   * @param {string} defaultVal default to VISTYPE_PRIVATE
   * @return {string} scope value - one of VISTYPE_*
   */
  getVisibility(defaultVal = XObjectProps.VISTYPE_PRIVATE) {
    const data = this.getData(false);
    return data ? XObject.GetVisibility(data, defaultVal) : defaultVal;
  }

  /**
   * Return whether the object has visibility scope of public (VISTYPE_PUBLIC)
   *
   * @param {*} checkACL not used at this level. Keep consistent with XMObject.
   * @return {boolean} true if object has public visibility as scope
   *
   * @see XMObject~isPublicVisible - override to check ACL as backup
   */
  isPublicVisible(checkACL, defaultVal = null) {
    const data = this.getData(false);
    return data ? XObject.IsPublicVisible(data, checkACL) : defaultVal;
  }

  /**
   * Return whether the object has group level visibility (VISTYPE_GROUP)
   *
   * @return {boolean} true if scope is at group level
   */
  isGroupVisible() {
    const data = this.getData(false);
    return data ? XObject.IsGroupVisible(data) : false;
  }

  /**
   * Return whether the object has no public or group visibility, which
   * means private.
   *
   * @return {boolean} true if scope is private or none
   */
  isPrivateVisible() {
    const data = this.getData(false);
    return data ? XObject.IsPrivateVisible(data) : false;
  }

  /**
   * Report on whether this object has been marked as deleted for
   * visibility.
   */
  isDeleted() {
    const data = this.getData(false);
    return data ? XObject.IsDeleted(data) : false;
  }


  // ----------------------- Change Monitoring ------------------------

  /**
   * Subscribe/watch a property change. The property is within
   * the data section (XObject.MAIN_DATA). If you want just
   * the immediate property on this object, use watchProperty()
   * from parent ObjectBase.
   *
   * @param {string} label property label within the JSON data which
   * mean under the top level property MAIN_DATA
   * @param {function({},string,object, object)} handler
   * @return {boolean} true if watch function registered, false if not
   *
   * @see ObjectBase.watchProperty
   * @see ~unwatchXProperty
   */
  watchXProperty(label, handler) {
    const propname = this.getXPropertyPath(XObject.MAIN_DATA, label);
    return this.watchProperty(propname, handler);
  }

  /**
   * Unsubscribe/unwatch a property change. This property is within
   * the data section (XObject.MAIN_DATA). If you want just
   * the immediate property on this object, use watchProperty()
   * from parent ObjectBase.
   *
   * @param {string} label property label within the JSON data which
   * mean under the top level property MAIN_DATA
   * @param {function} handler function to remove
   * @return {boolean} true if watch function removed, false if doesn't exist
   *
   * @see ObjectBase.watchProperty
   * @see ~watchXProperty
   */
  unwatchXProperty(label, handler) {
    const propname = this.getXPropertyPath(XObject.MAIN_DATA, label);
    return this.unwatchProperty(propname, handler);
  }


  // ---------------------- Utilities -------------------------

  /**
   * Return content of the data model in property MAIN_DATA as
   * JSON object. The output can be controlled via properties
   * to include or exclude.
   *
   * @param {string[]=} inclProps list of properties to include. Null to include all.
   * @param {string[]=} exclProps list of properties to exclude. Null to exclude none.
   * @param {*} defaultVal
   *
   * @see ~toJSONString
   * @see Util~ExportObjectFields
   */
  toJSON(inclProps = null, exclProps = null, defaultVal = null) {
    const data = this.getData(false);
    if (!data) { return defaultVal; }
    if (!inclProps && !exclProps) { return data; }
    return Util.ExportObjectFields(data, inclProps, exclProps, defaultVal);
  } // toJSON

  /**
   * Print JSON content of the "data" to string.
   *
   * @param replacer see JSON.stringify's replacer parameter
   * @param space see JSON.stringify' space parameter. Default to indent=2
   */
  toString(replacer = null, space = null) {
    const prefix = `[${this.getClassname()}]:`;
    return prefix + JSON.stringify(this, replacer, space);
  }

  /**
   * Output content data to a JSON as a string type, with options
   * to include and exclude certain properties.
   *
   * @param {string[]=} inclProps list of properties to include. Null to include all.
   * @param {string[]=} exclProps list of properties to exclude. Null to exclude none.
   * @param {*} defaultVal
   *
   * @see ~toJSONString
   * @see Util~ExportObjectFields
   */
  toJSONString(inclProps = null, exclProps = null, defaultVal = null) {
    const jsonObj = this.toJSON(inclProps, exclProps, null);
    return jsonObj ? JSON.stringify(jsonObj) : defaultVal;
  }

  /**
   * Retrieve the auxillary (json) data wrapped by this object.
   * The content of the AUX can be object type
   *
   * @see #getAux
   * @see #setData
   *
   * @see ~getAuxValue
   */
  getAuxData(create = false) {
    if (this[XObject.AUX_DATA] == null && create) {
      this[XObject.AUX_DATA] = {};
      // this.warn("getAuxData", "delayed creation of data content");
    }
    return this[XObject.AUX_DATA];
  }

  /**
   * Return the AUX data, but attempt to wrap it. This works
   * if there is a "type" value that is registered inside the
   * json object.
   *
   * @param {*} defaultVal
   */
  getWrappedAuxData(defaultVal = null) {
    const data = this.getAuxData(false);
    return data ? XObject.Wrap(data) : data;
  }
  /**
   * Replace auxillary data wrapped by this object
   *
   * @param {{}} data arbitrary data to associate with object
   * @see #getData
   * @see #getAux
   */
  setAuxData(data) {
    const json = XObject.Unwrap(data);    // just in case
    if (this[XObject.AUX_DATA] === json) { return; }

    this[XObject.AUX_DATA] = json;
  }

  /**
   * Merge given object into the existing aux data object,
   * if any.
   *
   * @param {{}} newData
   */
  addAuxData(newData) {
    let auxData = this.getAuxData(true);
    auxData = { auxData, ...newData };
    this[XObject.AUX_DATA] = auxData;
    return auxData;
  }

  /**
   * Clear AUX data
   */
  clearAuxData() {
    this[XObject.AUX_DATA] = null;
  }

  /**
   * Set a value to a field within the AUX data. This
   * instead of using setAuxData() to set entire
   * json object and not just afield.
   *
   * @param {string} field field name to set value in
   * @param {*} value if XObjec then will be unwrapped
   */
  setAuxDataField(field, value) {
    value = XObject.Unwrap(value);
    const auxData = this.getAuxData(true);
    return XObject.SetObjectField(auxData, field, value);
  }

  /**
   * Get what's stored in a field within the AUX data.
   * Note: data will not be wrapped
   *
   * @param {string} field name of field in aux data section
   * @param {*} defaultVal
   */
  getAuxDataField(field, defaultVal = null) {
    const auxData = this.getAuxData(false);
    return auxData ? XObject.GetObjectField(auxData, field, defaultVal) : defaultVal;
  }

  /**
   * Set an XObject instance to a field within the AUX data. This
   * instead of using setAuxData() to set entire json object
   * carrying a type that is a subclass of XObject
   *
   * @param {string} field field name to set value in
   * @param {XObject} xobject if XObject then will be unwrapped
   * @return {*} previous value?
   */
  setAuxDataXField(field, xobject) {
    const auxData = this.getAuxData(true);
    return XObject.SetXObjectField(auxData, field, xobject);
  }

  /**
   *
   * @param {string} field name of field in aux data section
   * @param {*} defaultVal
   * @return {XObject} wrapped data if it has a type that is subclass of XObject
   */
  getAuxDataXField(field, defaultVal = null) {
    const auxData = this.getAuxData(false);
    return auxData ? XObject.GetXObjectField(auxData, field, defaultVal) : defaultVal;
  }

  /**
   * @param {string} field
   * @return {boolean} true if cleared
   */
  clearAuxDataField(field) {
    const auxData = this.getAuxData(false);
    return auxData ? XObject.ClearObjectField(auxData, field) : false;
  }

  // --------------- CRUD FOR 1-M association to words ----------------

  /**
   * Add word (string text) to the given json object with property label
   *
   * @param {string} label property label
   * @param {string} word string text to add into the array
   * @param {boolean=} unique default is unique. set false to allow duplicates
   *
   * @return {boolean} true if added, false otherwise which includes already exist
   *
   * @see #getWords
   * @see #hasWord
   * @see #removeWord
   */

  addWord(label, word, unique = true) {
    const data = this.getData(true);
    const added = XObject.AddWord(data, label, word, unique);
    if (added) { this.setDirty(); }
    return added;
  }

  /**
   * Set words in a property holding array.
   *
   * @param {string} label property name
   * @param {string[]} wordArray
   * @return {string[]} previously set text array that is being replaced.
   */
  setWords(label, wordArray) {
    const data = this.getData(true);
    const prevValue = XObject.SetWords(data, label, wordArray);
    if (prevValue !== wordArray) { this.setDirty(); }
    return prevValue;
  }

  /**
   * Set/replace word at specific position in the array of words.
   *
   * @param {string} label property name
   * @param {number} idx > 0 Javascript allows setting element far beyond array size!
   * @param {string} word word to add
   */
  setWordAt(label, idx, word) {
    const data = this.getData(true);
    const prevValue = XObject.SetWordAt(data, label, idx, word);
    if (prevValue !== word) { this.setDirty(); }
    return prevValue;
  }

  /**
   * Return associated words of this object.
   *
   * @param {string} label property to retrieve words
   * @param {*} defaultVal
   * @return {[]} words in array or defaultVal if property not found or null
   *
   * @see #addWord
   * @see #hasWord
   * @see #removeWord
   * @see #getWordCount
   */
  getWords(label, defaultVal = []) {
    const data = this.getData(false);
    return data ? XObject.GetWords(data, label, defaultVal) : defaultVal;
  }

  /**
   * Return word at a specified position in the tracked word array
   *
   * @param {string} label property that holds the word array
   * @param {number} idx position into the array
   * @param {*} defaultVal
   */
  getWordAt(label, idx, defaultVal = null) {
    const data = this.getData(false);
    return data ? XObject.GetWordAt(data, label, idx, defaultVal) : defaultVal;
  }

  /**
   * Return position of the given word in the word list
   *
   * @param {string} label
   * @param {string} word
   * @returns {number} position of word in array list, or -1 if not found
   */
  getWordIndex(label, word) {
    const data = this.getData(false);
    return data ? XObject.GetWorldIndex(data, label, word) : -1;
  }

  /**
   * Count number of words stored for the given property label
   *
   * @param {string} label property to check number of words
   * @return {number} 0 or positive number
   *
   * @see ~getWords
   */
  getWordCount(label) {
    const data = this.getData(false);
    return data ? XObject.GetWordCount(data, label) : 0;
  }

  /**
   * Report on whether the property in question contains the given word
   *
   * @param {string} label property to check the word
   * @param {string} word
   * @return {boolean} true if exists, false otherwise
   *
   * @see ~hasWordIn
   */
  hasWord(label, word) {
    const data = this.getData(false);
    return data ? XObject.HasWord(data, label, word) : false;
  }

  /**
   * Determine if the given word is in one of the property labels given.
   * Search will stop at the first detection.
   *
   * @param {string[]} labels property names to check
   * @param {string} word  word to check (case sensitive)
   * @return {string} property label of first in list of properties to find the word, or null
   *
   * @see ~hasWord
   */
  hasWordIn(labels, word) {
    const data = this.getData(false);
    return data ? XObject.HasWordIn(data, labels, word) : null;
  } // hasWordIn

  /**
   * Remove a word given the property
   *
   * @param {{}} jsonObj
   * @param {string} label property to remove word
   * @param {string} word will be normalized before comparing
   * @return {boolean} true if removed, false if not
   *
   * @see @removeAllWords
   * @see #addWord
   * @see #getWords
   * @see #hasWord
   */
  removeWord(label, word) {
    const data = this.getData(false);
    return data ? XObject.RemoveWord(data, label, word) : false;
  }

  /**
   * Remove all words given the property
   *
   * @param {{}} jsonObj
   * @param {string} label property to remove all
   * @return {boolean} true if removed, false if not
   *
   * @see #addWord
   * @see #getWords
   * @see #removeWord
   * @see #hasWord
   */
  removeAllWords(label) {
    const data = this.getData(false);
    return data ? XObject.RemoveAllWords(data, label) : false;
  }

  /**
   * Count number of words stored in a property of the given object
   *
   * @param {string} label property to retrieve words
   * @return {number} 0 or greater
   */
  countWords(label) {
    const data = this.getData(false);
    return data ? XObject.CountWords(data, label) : 0;
  } // CountWords

  serialize() {
    return XObject.Serialize(this);
  }

  // *************************************************************
  //
  // Class methods. Any methods that can be used as helper
  // for generic JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************


  /**
   * Return name of this class. This should be defined for every
   * subclass to override.
   *
   * @return {string} name of this class.
   */
  static GetName() {
    return _CLSNAME;
  }

  /**
   * Return the short identifier for this type, and it must be
   * overriden by subclasses.
   *
   * It is used for various purposes, but importantly used
   * to identify an unwrapped json data structure and
   * re-wrap it typically after streaming over the network
   * from to/from storage.
   *
   * It is also used to register each subclass of XObject
   *
   * @return {string} type identifier
   */
  static GetTypeID() {
    return ModelType.XOBJECT;
  }

  /**
   * Convenient method to check if the given object
   * is an instance of this class (XObject)
   *
   * @param {XObject} xobj instance of XObject
   * @return {boolean}
   */
  static IsInstance(xobj) {
    return xobj instanceof XObject;
  }

  /**
   * Assert if given object is an "instanceof" XObject class and dump
   * stack if failed check.
   *
   * @param {*} object any value to check against XObject class
   * @param {string} classname name of class where assertion originated
   * @param {string} method name of function
   * @param {string} msg text message
   * @param  {...any} args
   */
  static AssertXObject(object, classname, method, msg, ...args) {
    if (XObject.IsInstance(object)) { return true; }
    console.trace(`${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Given an instance of XObject or just json record,
   * return only the json portion.
   *
   * @param {XObject} obj either an instance of XObject/subclass,
   * or json data itself.
   * @return {{}}
   *
   * @see #Wrap
   */
  static Unwrap(obj) {
    if (obj == null) { return obj; }
    return (obj instanceof XObject) ? obj.getData() : obj;
  } // Unwrap

  /**
   * Wrap the given json object with an instance of
   * XObject subclass as specified by the given
   * class type (class constructor)
   *
   * @param {{}} jsonRec
   * @param {function=} ClsType class constructor function.
   * If you are not sure, use Wrap static function to lookup
   * registry.
   * @return {XObject}
   *
   * @see #Wrap
   */
  static WrapXObject(jsonRec, ClsType = XObject) {
    // Instantitate proper class
    if (Util.IsString(ClsType)) { ClsType = XObject.GetClassByType(ClsType); }
    if (ClsType == null) {
      console.error('Class type? ', ClsType);
      return null;
    }
    const item = new ClsType();

    // Type checking: to avoid wrapping the wrong type!
    const jsonType = jsonRec[XObject.PROP_TYPE];
    const clsType = item.getType();
    if (jsonType && jsonType !== clsType) {
      const msg = `WrapXObject: type: ${jsonType} != ${clsType}`;
      console.error(msg);
      // throw new Error(msg);
    }
    if (jsonType == null) {
      jsonRec[XObject.PROP_TYPE] = clsType;
    }

    // Just in case the object is wrapped via
    // XObject.toJSON(). This is a HACK as we
    // should rely on the "type" property at the top level.
    if (jsonRec && jsonRec.hasOwnProperty(XObjectProps.MAIN_DATA)) { item.setData(jsonRec[XObjectProps.MAIN_DATA]); } else { item.setData(jsonRec); }
    return item;
  }

  /**
   * Determine if the given object is already wrapped,
   * which mean an instance of XObject
   *
   * @param {*} obj
   */
  static IsWrapped(obj) {
    return obj instanceof XObject;
  }

  /**
   * Wrap the given json data with a new instance of
   * XObject or subclass. The type should
   * be in json's PROP_TYPE property and that will be
   * used. If none exists, caller can specify backup.
   *
   * @param {{}} jsonRec data to wrap, if possible
   * @param {function=} clsType explicity class type used
   * if PROP_TYPE does not exists.
   * @return {XObject} either a wrapper class found and created,
   * or if not then the original data input is returned
   *
   * @see ObjectBase#RegisterType
   * @see ObjectBase#DeregisterType
   * @see #WrapXObject
   * @see #Unwrap
   */
  static Wrap(jsonRec, clsType = null) {
    if (jsonRec instanceof XObject) { return jsonRec; } // already wrapped

    if (typeof jsonRec !== 'object') { return jsonRec; }

    const jsonType = XObject.GetType(jsonRec);
    let clsObj = jsonType ? XObject.GetClassByType(jsonType) : null;
    if (clsObj == null) {
      clsObj = clsType;
      if (clsObj == null) {
        // production: don't dump content
        XObject.Warn(_CLSNAME, 'Wrap', 'Type?');
        return jsonRec;
      }
    }
    return XObject.WrapXObject(jsonRec, clsObj);
  }

  /**
   * Wrap the given json data assuming it's a contained json
   * of a parent object. So parent object will be tracked.
   *
   * @param {*} jsonRec
   * @param {XObject} parentObj
   * @param {*} clsType
   */
  static WrapAsChild(jsonRec, parentObj, clsType = null) {
    const xobj = XObject.Wrap(jsonRec, clsType);
    if (xobj && parentObj) { xobj.setXParent(parentObj); }
    return xobj;
  }

  /**
   * Wrap an array of json data objects
   *
   * @param {{}} jsonArray
   * @param {*} clsType
   * @return {XObject[]} array of wrapped objects
   */
  static WrapArray(jsonArray, clsType = XObject) {
    return jsonArray.map((json) => {
      const xobj = XObject.Wrap(json, clsType);
      return xobj;
    });
  }

  /**
   * Derive an unique ID based on object type, ownerID,
   * and also randomized but shortended value. The output
   * format is something like:
   *
   * <code>{type}_{ownerId}_{randomNum}</code>
   *
   * @param {string} typeId
   * @param {string=} ownerId optional owner ID to include
   * @return {string} derived ID
   */
  static DeriveID(typeId, ownerId = null) {
    const seqNum = Util.GenRandom(Date.now()).toLowerCase();
    let id;
    if (ownerId) { id = `${ownerId}_${seqNum}`; } else { id = seqNum; }
    return id;
  } // DeriveID

  /**
   * Simple utility method to create a new instance
   * and initially set an unique identifier and
   * optionally wrap a json object.
   *
   * @param {string} id
   * @param {string} type since XObject has no type,
   * this is important to specify (no guarantee it'll
   * work completely)
   * @param {{}} jsonData
   */
  static CreateNew(id = null, jsonData = null) {
    const newObj = new XObject();
    newObj.initNew();
    if (id) { newObj._setId(id); }
    if (jsonData) { newObj.setData(jsonData); }

    return newObj;
  }

  /**
   * Return the json data wrapped by the XObject instance,
   * if it is wrapped. If not, then return as-is
   *
   * @param {XObject} xobj instance of XObject or unwrapped json
   * @param {*} defaultVal default value if null
   * @return {{}} json data if wrapped, or as-is. If
   * null, return defaultVal
   */
  static GetData(xobj, defaultVal = null) {
    const jsonObj = XObject.Unwrap(xobj);
    const mainData = jsonObj;
    return mainData || defaultVal;
  } // GetData

  /**
   * Return the aux json data wrapped by the XObject instance
   *
   * @param {{}} xobj instance of XObject. This cannot be unwraped
   * @param {*} defaultVal
   * @return {{}} json aux data or null
   */
  static GetAuxData(xobj, defaultVal = null) {
    const auxData = xobj[XObjectProps.AUX_DATA];
    return auxData || defaultVal;
  }

  /**
   * Clone json data. This will also santize the
   * cloned data including removing timestamp, etc.
   *
   * @param {object} jsonObj XObject instance to
   * @return {object}
   */
  static CloneData(jsonObj) {
    return JSON.parse(JSON.stringify(jsonObj));
  }

  /**
   * Clone entire instance of XObject
   *
   * @param {XObject} xobj XObject instance to clone
   * @param {boolean} cloneData true to perform deep copy (Chrome use reference)
   * @param {boolean} cloneAux true to perform deep copy on aux data
   * @return {XObject} new instance of same type
   */
  static CloneInstance(xobj, cloneData = true, cloneAux = false) {
    // clone class info, but it's shallow copy
    const newXobj = Util.CloneInstance(xobj);

    if (cloneData) {
      // Deep clone JSON data
      const jsonData = XObject.GetData(xobj, null);
      if (jsonData) { newXobj.setData(Util.CloneObject(jsonData)); } // not efficient
    }
    if (cloneAux) {
      // Deep clone AUX data, if any
      const auxData = XObject.GetAuxData(xobj, null);
      if (auxData) { newXobj.setAuxData(Util.CloneObject(auxData)); }
    }
    return newXobj;
  } // CloneInstance


  /**
   * Set the object's unique identifier. This identifier
   * will need to be string (or convertable) and
   * will become lowercased.
   *
   * @param {{}} jsonObj
   * @param {string} id string ID
   *
   * @see #GetId
   */
  static SetId(jsonObj, id) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj == null) { return false; }
    jsonObj[XObject.PROP_ID] = String(id).toLowerCase();
  }

  static SetIconUrl(jsonObj, url) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj == null) { return false; }
    jsonObj[XObject.PROP_ICON_URL] = url;
    return true;
  }

  /**
   * Clear Id field.
   *
   * @param {{}} jsonObj
   */
  static ClearId(jsonObj) {
    const prevId = jsonObj[XObject.PROP_ID];
    delete jsonObj[XObject.PROP_ID]; // remote all together
    return prevId;
  }

  /**
   * Retreive the value of the property PROP_ID ("_id")
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetId(jsonObj, defaultVal = null) {
    return jsonObj ? XObject.Unwrap(jsonObj)[XObject.PROP_ID] : defaultVal;
  }

  /**
   * Determine the type of the object, if it is an object with
   * "type" property. If not, just return default value
   *
   * @param {*} obj data to check and determine. It must be an
   * object with property "type".
   *
   * @param {*} defaultVal value to return if given data is not
   * a valid XObject or its json, or missing "type" field.
   */
  static GetType(obj, defaultVal = null) {
    if ((obj == null) || (typeof (obj) !== 'object')) { return defaultVal; }

    if (obj instanceof XObject) { return obj.getType(); }

    const value = XObject.Unwrap(obj)[XObject.PROP_TYPE];
    return value || defaultVal;
  }

  /**
   * Parse the given ID string in the format of type_user_seqnum
   * and return the type portion.
   *
   * @param {string} idString a string identifier
   * @return {string} first part before underscore, or entire text
   *
   * @see ~GetUserFromId
   */
  static GetTypeFromId(idString) {
    const parts = idString.split('_');
    if (parts.length < 3) { return null; }
    return parts[0];
  }

  static GetTitle(jsonObj, defaultVal = null) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj == null) { return defaultVal; }
    const val = jsonObj[XObject.PROP_TITLE];
    return val || defaultVal;
  }

  static GetSubTitle(jsonObj, defaultVal = null) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj == null) { return defaultVal; }
    const val = jsonObj[XObject.PROP_SUBTITLE];
    return val || defaultVal;
  }

  static GetDescription(jsonObj, defaultVal = null) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj == null) { return defaultVal; }
    const val = jsonObj[XObject.PROP_DESC];
    return val || defaultVal;
  }

  static GetIconUrl(jsonObj, defaultVal = null) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj == null) { return defaultVal; }
    const val = jsonObj[XObject.PROP_ICON_URL];
    return val || defaultVal;
  }

  /**
   * Extract user ID from the given ID string
   * of the format "{part0}_{userid}_{part1}_..."
   *
   * @param {string} idString must have at least one underscore
   * @return {string} either text after first underscore, or null
   *
   * @see ~GetTypeFromId
   */
  static GetUserFromId(idString) {
    const parts = idString.split('_');
    if (parts.length < 3) { return null; }
    return parts[1];
  }

  // static GetObject(obj, label, defaultVal = null) {
  //     let objData = obj ? obj[label] : null;
  //     return (objData == null) ? defaultVal : objData;
  // }
  // static SetObject(obj, label, subRec) {
  //     if (obj[label]  !== subRec) {
  //         obj[label] = subRec;
  //     }
  // }

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
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} value value to set. It can be json or XObject wrapper
   * @return {*} previous value, or null if value already same and not changed
   * @see ~GetObjectField
   * @see ~SetXObjectField
   */
  static SetObjectField(jsonObj, field, value) {
    if (!XObject.AssertArrayNoNulls([jsonObj, field], _CLSNAME, 'SetObjFld', 'json,fld')) { return null; }
    jsonObj = XObject.Unwrap(jsonObj);
    value = XObject.Unwrap(value);
    const hasProp = jsonObj.hasOwnProperty(field);
    const prev = hasProp ? jsonObj[field] : null;
    if (!hasProp || (prev !== value)) {
      jsonObj[field] = value;
      return prev;
    }
    return null;
  } // SetObjectField

  /**
   * Set the object field that has an XObject wrapper
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {XObject} xmValue
   *
   * @see ~SetObjectField
   * @see ~ImportObjectFields
   */
  static SetXObjectField(jsonObj, field, xValue) {
    return XObject.SetObjectField(jsonObj, field, xValue);
  } // SetXObjectField

  /**
   * Import additional property values
   *
   * @param {{}} jsonObj
   * @param {{}} props
   * @param {boolean} override true to override existing value
   * @return {{}} replaced label/values
   */
  static ImportObjectFields(jsonObj, props, override = false) {
    props = XObject.Unwrap(props);  // just in case it's from another XObject
    return Util.ImportObjectFields(jsonObj, props, override);
  }

  /**
   * Retrieve the value of the field within the given object. The object can
   * be the data wrapped by an instance of XObject or subclass, but it
   * can also be an embedded json object also.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} defaultVal
   *
   * @see ~GetXObjectField
   * @see #SetObjectField
   * @see #HasObjectField
   * @see #ClearObjectField
   */
  static GetObjectField(jsonObj, field, defaultVal = null) {
    if (!XObject.AssertArrayNoNulls([jsonObj, field], _CLSNAME, 'GetObjectField', 'Field name cannot be null.')) { return defaultVal; }
    jsonObj = XObject.Unwrap(jsonObj);
    const val = jsonObj[field];
    return Util.NotNull(val) ? val : defaultVal;
  }

  /**
   * Retrieve value of a field and wrap it if it is a registered subclass of XObject
   *
   * @param {XObject} xobject instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} defaultVal
   * @return {*} value from the field, which if it's an instance of
   * XObject, then it will be wrapped accordingly
   */
  static GetXObjectField(xobject, field, defaultVal = null) {
    const jsonObj = XObject.Unwrap(xobject);
    let value = XObject.GetObjectField(jsonObj, field, null);
    if (Util.IsNull(value)) {
      return defaultVal;
    }

    // Because this is expected to be an XObject instance, it might
    // be serialized to keep AUX_DATA.
    value = XObject.DeSerialize(value);

    return Util.NotNull(value) ? value : defaultVal;
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
   * Given an XObject instance, extract a subset
   * using the inclusion and exclusion field name list.
   *
   * @param {{}} jsonObj object to extract properties from
   * @param {*} inFields array of property names to include
   * @param {*} excFields array of property names to exclude.
   * If property name is found in both include and exclude list,
   * the exclusion will win.
   * @return {{}} new json object with subset of properties
   */
  static GetXObjectFields(xobject, inFields = null, exFields = null) {
    const jsonObj = XObject.Unwrap(xobject);
    return Util.ExportObjectFields(jsonObj, inFields, exFields);
  }

  /**
   * Check if the given field name exists in the given json object.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field property label to find
   * @param {boolean} existOK if true, check stops at property exists.
   * if false, then the value associated with propety will be checked for not null or undefined
   * @return {boolean} true if field (property/key) exists within the given object,
   * unless existOK is set to false for which the actual value is checked.
   *
   * @see #GetObjectField
   * @see #SetObjectField
   * @see #ClearObjectField
   */
  static HasObjectField(jsonObj, field, existOK = true) {
    jsonObj = XObject.Unwrap(jsonObj);
    // simple json label check for now.
    const hasProp = jsonObj.hasOwnProperty(field);
    // console.log(`field: ${field}, exists: ${existOK}, hasProp: ${hasProp}`);
    if (!hasProp || (existOK === true)) {
      return hasProp;
    }
    // check actual value
    return Util.NotNull(jsonObj[field]);
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
   * @return {boolean} true if cleared
   */
  static ClearObjectField(jsonObj, field) {
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj.hasOwnProperty(field)) {
      delete jsonObj[field];
      return true;
    }
    return false;
  } // ClearObjectField

  // --------------------------- Base64 Fields ---------------------

  /**
   * Set the value as a base64 encoded string to the field inside the given object.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} value value to set. It can be json or XObject wrapper
   * @return {*} previous value, or null if value already same and not changed
   * @see ~GetObjectField
   * @see ~SetXObjectField
   */
  static SetBase64Field(jsonObj, field, value) {
    if (!XObject.AssertNotNull(field, _CLSNAME, 'SetBase64Field', 'Field name cannot be null.')) { return null; }
    jsonObj = XObject.Unwrap(jsonObj);
    value = XObject.Unwrap(value);
    const b64val = Base64.encode(value);
    const prev = jsonObj.hasOwnProperty(field) ? jsonObj[field] : null;
    if (prev !== b64val) {
      jsonObj[field] = b64val;
      return prev;
    }
    return null;
  } // SetObjectField

  /**
   * Retrieve the base64 encoded value of the field and decode it.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} defaultVal
   *
   * @see ~GetXObjectField
   * @see #SetObjectField
   * @see #HasObjectField
   * @see #ClearObjectField
   */
  static GetBase64Field(jsonObj, field, defaultVal = null) {
    if (!XObject.AssertArrayNoNulls([jsonObj, field], _CLSNAME, 'GetBase64Field', 'Field name cannot be null.')) { return defaultVal; }
    jsonObj = XObject.Unwrap(jsonObj);
    const b64val = jsonObj[field];
    const val = (Util.NotNull(b64val)) ? Base64.decode(b64val) : null;
    return Util.NotNull(val) ? val : defaultVal;
  }

  // ----------------------- Encrypted Fields ------------------------

  /**
   * Encrypt and the value as a string to the field inside the given object.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} value value to set. It can be json or XObject wrapper
   * @return {*} previous value, or null if value already same and not changed
   * @see ~GetObjectField
   * @see ~SetXObjectField
   */
  static SetEncryptedField(jsonObj, field, value) {
    if (!XObject.AssertNotNull(field, _CLSNAME, 'SetEncField', 'Field name cannot be null.')) { return null; }
    jsonObj = XObject.Unwrap(jsonObj);
    value = XObject.Unwrap(value);
    const encval = Util.EncryptJSON(value);
    const prev = jsonObj.hasOwnProperty(field) ? jsonObj[field] : null;
    if (prev !== encval) {
      jsonObj[field] = encval;
      return prev;
    }
    return null;
  } // SetEncryptedField

  /**
   * Retrieve the encrypted value of the field and decrypt it before returning
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} field
   * @param {*} defaultVal
   *
   * @see ~GetXObjectField
   * @see #SetEncryptedField
   * @see #HasObjectField
   * @see #ClearObjectField
   */
  static GetEncryptedField(jsonObj, field, defaultVal = null) {
    if (!XObject.AssertArrayNoNulls([jsonObj, field], _CLSNAME, 'GetEncField', 'Field name cannot be null.')) { return defaultVal; }
    jsonObj = XObject.Unwrap(jsonObj);
    const encval = jsonObj[field];
    const val = (Util.NotNull(encval)) ? Util.DecryptJSON(encval) : null;
    return Util.NotNull(val) ? val : defaultVal;
  } // GetEncryptedField


  // --------------- CRUD FOR 1-M association to words ----------------

  /**
   * Add word (string text) to the given json object with property label
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property label
   * @param {string} word string text to add into the array
   * @param {boolean=} unique default is unique. set false to allow duplicates
   *
   * @return {boolean} true if added, false otherwise which includes already exist
   */
  static AddWord(jsonObj, label, word, unique = true) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label, word], _CLSNAME, 'AddWord')) { return false; }
    jsonObj = XObject.Unwrap(jsonObj);

    if (!jsonObj.hasOwnProperty(label)) { jsonObj[label] = []; }
    if ((unique === true) && jsonObj[label].includes(word)) {
      const objectId = XObject.GetId(jsonObj);
      console.warn(`${_CLSNAME}.AddWord: in object ${objectId}'s property: '${label}' the word: ${word} already exists in list:`, jsonObj[label]);
      // console.trace('from:');
      return false;
    }
    jsonObj[label].push(word);
    return true;
  } // AddWord

  /**
   * Replace word at the given index location.
   *
   * @param {{}} jsonObj
   * @param {string} label
   * @param {number} idx array index. Javascript allows idx greater than array size!!!
   * @param {string} word word to add to array at index
   */
  static SetWordAt(jsonObj, label, idx, word) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label, idx, word], _CLSNAME, 'SetWordAt')) { return null; }
    if (idx < 0) { return null; }

    let prevValue = null;
    jsonObj = XObject.Unwrap(jsonObj);
    if (!jsonObj.hasOwnProperty(label)) { jsonObj[label] = []; }
    const list = jsonObj[label];
    prevValue = list[idx];
    list[idx] = word;

    return prevValue;
  } // SetWordAt

  /**
   * Set all words using the given array
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property to retrieve words
   * @param {string[]} array of words
   * @param {*} defaultVal
   * @return {string[]} previous word array, if exists or null if never set
   */
  static SetWords(jsonObj, label, wordArray) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label], _CLSNAME, 'SetWords')) { return null; }
    jsonObj = XObject.Unwrap(jsonObj);

    const existingWords = jsonObj[label];
    jsonObj[label] = wordArray;
    return existingWords;
  } // SetWords

  /**
   * Return associated words (or value) of this object.
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property to retrieve words
   * @param {*} defaultVal
   * @return {[]} words in array or defaultVal if property not found or null
   */
  static GetWords(jsonObj, label, defaultVal = []) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label], _CLSNAME, 'GetWords')) { return defaultVal; }
    jsonObj = XObject.Unwrap(jsonObj);

    const words = jsonObj[label];
    return (words == null) ? defaultVal : words;
  } // GetWords

  /**
   *
   * @param {{}} jsonObj
   * @param {string} label
   * @return {number} 0 or postive number
   */
  static GetWordCount(jsonObj, label) {
    const words = XObject.GetWords(jsonObj, label, null);
    return words ? words.length : 0;
  }

  /**
   * Report on whether the property in question contains the given word
   *
   * @param {XObject}} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property to retrieve words
   * @param {string} word text to check
   * @return {boolean} true if exists, false otherwise
   */
  static HasWord(jsonObj, label, word) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label, word], _CLSNAME, 'HasWord')) { return false; }
    jsonObj = XObject.Unwrap(jsonObj);
    if (jsonObj[label] == null) { return false; }

    return jsonObj[label].includes(word);
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {number} idx
   * @param {string} label
   * @param {string} word
   * @param {*} defaultVal
   */
  static GetWordAt(jsonObj, label, idx, defaultVal = null) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label, idx], _CLSNAME, 'GetWord')) { return defaultVal; }

    jsonObj = XObject.Unwrap(jsonObj);
    const list = jsonObj[label];
    if ((idx < 0) || list == null) { return defaultVal; }

    return list[idx] == null ? defaultVal : list[idx];
  }


  /**
   *
   * @param {{}} jsonObj
   * @param {number} idx
   * @param {string} label
   * @param {string} word
   * @return {number} position of the word in the internal array list. -1 means not found
   */
  static GetWordIndex(jsonObj, label, word) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label, word], _CLSNAME, 'GetWordIndex')) {
      return -1;
    }

    jsonObj = XObject.Unwrap(jsonObj);
    const list = jsonObj[label];
    const idx = list ? list.indexOf(word) : -1;

    return idx;
  }


  /**
   * Report on whether the labels in question contains the given word
   *
   * @param {XObject}} jsonObj instance of XObject or already unwrapped json data
   * @param {string[]} labels array of property names to check if word exists
   * @param {string} word text to check
   * @return {string} property name for which word exists, or null if none
   */
  static HasWordIn(jsonObj, labels, word) {
    // console.log(`HasWordIn: checking labels: ${labels}, word: ${word}`);

    if (!XObject.AssertArrayNoNulls([jsonObj, labels, word], _CLSNAME, 'HasWordIn')) { return null; }
    jsonObj = XObject.Unwrap(jsonObj);
    if (!Array.isArray(labels)) { return null; }
    let label;
    let wordList;
    for (const i in labels) {
      label = labels[i];
      if (label == null) {
        continue;
      }
      wordList = jsonObj[label];
      if (wordList && Array.isArray(wordList) && wordList.includes(word)) {
        return label;
      }
    }
    return null;
  } // HasWordIn

  /**
   * Remove a word given the property
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property to retrieve words
   * @param {string} word will be normalized before comparing
   * @return {boolean} true if removed, false if not
   */
  static RemoveWord(jsonObj, label, word) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label, word], _CLSNAME, 'RemoveWord')) { return false; }
    jsonObj = XObject.Unwrap(jsonObj);
    if (word == null) { return false; }
    const words = jsonObj[label];
    if (words == null) { return false; }
    const idx = words.indexOf(word);
    if (idx === -1) { return false; }
    words.splice(idx, 1);
    return true;
  } // RemoveWord

  /**
   * Remove all words given the property
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property to remove all words
   * @return {boolean} true if removed, false if not
   */
  static RemoveAllWords(jsonObj, label) {
    if (!XObject.AssertArrayNoNulls([jsonObj, label], _CLSNAME, 'RemoveAllWords')) { return false; }
    jsonObj = XObject.Unwrap(jsonObj);
    const words = jsonObj[label];
    if (words == null) { return false; }
    delete jsonObj[label];
    return true;
  } // RemoveWord

  /**
   * Count number of words stored in a property of the given object
   *
   * @param {XObject} jsonObj instance of XObject or already unwrapped json data
   * @param {string} label property to retrieve words
   * @return {number} number of words, or zero if nothing
   */
  static CountWords(jsonObj, label) {
    jsonObj = XObject.Unwrap(jsonObj);
    const words = jsonObj[label];
    return words ? words.length : 0;
  } // CountWords

  // /**
  //  * Track a parent object within the realm
  //  * of XObject. It is transparent because it's
  //  * set directly on the object and not the "data"
  //  * property.
  //  *
  //  * @param {XObject} jsonObj object to track parent json obj
  //  * @param {{}} parentObj json representation of parent
  //  */
  // static SetXParent(jsonObj, parentObj) {
  //     jsonObj = XObject.Unwrap(jsonObj);
  //     return XObject.SetObject(jsonObj, XObject.PROP_PARENT, parentObj);
  // }
  // /**
  //  * Retrieve a transient parent object previously tracked
  //  * using SetXParent.
  //  *
  //  * @param {XObject} jsonObj object to track parent json obj
  //  * @return {{}} parent object if any
  //  */
  // static GetXParent(jsonObj, defaultVal = null) {
  //     jsonObj = XObject.Unwrap(jsonObj);
  //     return XObject.GetObject(jsonObj, XObject.PROP_PARENT, defaultVal);
  // }

  // -------------- Creation / Updated / Published Timestamps --------------

  /**
   * Set title field
   *
   * @param {{}} jsonObj
   * @param {string} value
   * @return {boolean} true if set, false if can't set
   */
  static SetTitle(jsonObj, value) {
    if (jsonObj == null) { return false; }
    jsonObj[XObjectProps.TITLE] = value;
    return true;
  }
  /**
   * Set creation date. If no date/time is given, will
   * assume current time.
   *
   * @param {{}} jsonObj
   * @param {number} date
   * @return {boolean} true if set, false if can't se
   */
  static SetCreatedTS(jsonObj, ts = null) {
    if (jsonObj == null) { return false; }
    jsonObj[XObjectProps.CREATED_DATE] = ts || Date.now();
    return true;
  }

  /**
   *
   * @param {{}} jsonObj
   * @return {boolean} true if field removed, false if field does not exist
   */
  static ClearCreatedTS(jsonObj) {
    if (jsonObj[XObjectProps.CREATED_DATE]) {
      delete jsonObj[XObjectProps.CREATED_DATE];
      return true;
    }
    return false;
  }

  /**
   * Return value in the created timestamp property.
   *
   * @param {{}} jsonObj
   * @param {number} defaultVal if none, use this value.
   */
  static GetCreatedTS(jsonObj, defaultVal = -1) {
    const ts = (jsonObj) ? jsonObj[XObjectProps.CREATED_DATE] : null;
    return ts || defaultVal;
  }

  /**
   * Update given json object's timestamp to a given value or now
   *
   * @param {{}} jsonObj
   * @param {number=} timeVal optional time value to set or null to use current time
   */
  static SetUpdatedTS(jsonObj, timeVal = null) {
    jsonObj[XObjectProps.UPDATED_DATE] = (timeVal || Date.now());
  }

  static ClearUpdatedTS(jsonObj) {
    if (jsonObj[XObjectProps.UPDATED_DATE]) { delete jsonObj[XObjectProps.UPDATED_DATE]; }
  }

  /**
   * Return the value to the field UPDATED_DATE ("udate").
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   */
  static GetUpdatedTS(jsonObj, defaultVal = -1) {
    const ts = jsonObj ? jsonObj[XObjectProps.UPDATED_DATE] : null;
    return ts || defaultVal;
  }

  /**
   * Get either the updated timestamp, or created timestamp if
   * no updated timestamp
   *
   * @param {{}} jsonObj unwrapped XObject instance (wrapped ok too)
   * @param {*} defaultVal (-1)
   * @return {number} either updatedTS or createdTS or defaultVal
   *
   * @see ~GetUpdatedTS
   * @see ~GetCreatedTS
   */
  static GetTS(jsonObj, defaultVal = -1) {
    jsonObj = XObject.Unwrap(jsonObj);  // just in case
    let ts = XObject.GetUpdatedTS(jsonObj, -1);
    if (ts === -1) {
      ts = XObject.GetCreatedTS(jsonObj, -1);
    }
    return (ts === -1) ? defaultVal : ts;
  }


  /**
   * Return whether this instance has been updated (included created)
   * within the elapsed time.
   *
   * @param {number} inSeconds number of seconds to test
   * @return {boolean} true if updated or created time are within the
   * given seconds. False if not
   */
  static HasUpdatedWithin(jsonObj, inSeconds) {
    let updatedTS = XObject.GetUpdatedTS(jsonObj, -1);
    if (updatedTS <= 0) { updatedTS = XObject.GetCreatedTS(jsonObj, -1); }
    if (updatedTS <= 0) { return false; }
    const deltaTime = (Date.now() - updatedTS);
    console.log(`HasUpdatedWithin(${inSeconds}): delta time is: ${deltaTime})`);
    return (deltaTime < (inSeconds * 1000));
  } // HasUpdatedWithin

  /**
   * Update given json object's timestamp to a given value or now
   *
   * @param {{}} jsonObj
   * @param {number=} timeVal optional time value to set or null to use current time
   */
  static SetPublishedTS(jsonObj, timeVal = null) {
    jsonObj[XObjectProps.PUBLISHED_DATE] = (timeVal || Date.now());
  }

  static ClearPublishedTS(jsonObj) {
    if (jsonObj[XObjectProps.PUBLISHED_DATE]) { delete jsonObj[XObjectProps.UPDATED_DATE]; }
  }

  static GetPublishedTS(jsonObj, defaultVal = -1) {
    return jsonObj ? jsonObj[XObjectProps.PUBLISHED_DATE] : defaultVal;
  }

  /**
   * Update given json object's expiratiion date field with given time
   * or current time.
   *
   * @param {{}} jsonObj
   * @param {number=} timeVal optional time value to set or null to use current time
   * @return {boolean} true if set, false if can't set
   */
  static SetExpiration(jsonObj, timeVal = null) {
    if (jsonObj == null) { return false; }
    jsonObj[XObjectProps.EXPIRATION_DATE] = timeVal || Date.now();
    return true;
  }

  /**
   * Remove expiration field
   *
   * @param {*} jsonObj
   * @return {boolean} true if cleared, false if field doesn't exist
   */
  static ClearExpiration(jsonObj) {
    if (jsonObj[XObjectProps.EXPIRATION_DATE]) {
      delete jsonObj[XObjectProps.EXPIRATION_DATE];
      return true;
    }
    return false;
  }

  /**
   *
   * @param {*} jsonObj
   * @param {*} defaultVal
   * @return {number} return expiration epoch time in SECONDS, or defaultVal if no value
   */
  static GetExpiration(jsonObj, defaultVal = -1) {
    const dateVal = jsonObj ? jsonObj[XObjectProps.EXPIRATION_DATE] : null;
    return dateVal || defaultVal;
  }

  /**
   * Determine if the value in the expiration field is
   * less than current time and therefore expired.
   *
   * @param {*} jsonObj
   * @param {*} defaultVal value to return if no date value
   * @return {boolean} true if date value is less than now. If no value,
   * return defaultVal
   */
  static HasExpired(jsonObj, defaultVal = false) {
    const expdate = XObject.GetExpiration(jsonObj, -1);
    if (expdate === -1) { return defaultVal; }
    return expdate <= Date.now();
  }

  /**
   * Set last edited timestamp. Edited means a specific field was
   * changed but not necessarily saved.
   *
   * @param {{}} jsonObj
   * @param {*} timeVal
   * @return {boolean} true if set, false if can't set
   */
  static SetEditedTS(jsonObj, timeVal = null) {
    if (jsonObj == null) { return false; }
    jsonObj[XObjectProps.EDITED_DATE] = (timeVal || Date.now());
    return true;
  }

  /**
   *
   * @param {{}} jsonObj
   * @return {boolean} true if cleared, false if doesn't exist
   */
  static ClearEditedTS(jsonObj) {
    if (jsonObj[XObjectProps.EDITED_DATE]) {
      delete jsonObj[XObjectProps.EDITED_DATE];
      return true;
    }
    return false;
  }

  static GetEditedTS(jsonObj, defaultVal = -1) {
    return jsonObj ? jsonObj[XObjectProps.EDITED_DATE] : defaultVal;
  }

  // ---------------- PUBLISH / SCOPE STATUS --------------------

  /**
   * Update given json object's visibility scope to VISTYPE_PUBLIC,
   * and also update published timestamp.
   *
   * @param {{}} jsonObj
   * @param {number=} ts optional time value to set or null to use current time
   * @return {string} previous value of VISTYPE_*
   */
  static SetPublicVisibility(jsonObj, ts = null) {
    const result = XObject.SetVisibility(jsonObj, XObjectProps.VISTYPE_PUBLIC);
    // XObject.SetPublishedTS(jsonObj, ts);
    return result;
  }

  /**
   * Clear VISTYPE_PUBLIC visibility scope. In our implementation, it's
   * simply a removal since no scope equals private anyway.
   *
   * @param {{}} jsonObj
   * @return {string} previous value of VISTYPE_*
   */
  static ClearPublicVisibility(jsonObj) {
    const result = XObject.ClearVisibility(jsonObj);
    XObject.ClearPublishedTS(jsonObj);
    return result;
  }

  /**
   * Set visibility scope.
   *
   * @param {{}} jsonObj
   * @param {string} scope one of VISTYPE_*
   * @return {string} previous scope, or null if none
   */
  static SetVisibility(jsonObj, scope) {
    if (!XObject.Assert(XObjectProps.VISTYPES.includes(scope))) {
      XObject.Error(_CLSNAME, 'SetVisibility', `Invalid scope: ${scope}`);
      return false;
    }
    const prev = jsonObj[XObjectProps.VISIBILITY];
    jsonObj[XObjectProps.VISIBILITY] = scope;
    return prev;
  } // SetVisibility

  /**
   * Clear existing visibility flag
   *
   * @param {{}} jsonObj
   * @return {boolean} true if cleared. False if no need or cannot
   */
  static ClearVisibility(jsonObj) {
    if (jsonObj[XObjectProps.VISIBILITY]) {
      delete jsonObj[XObjectProps.VISIBILITY];
      return true;
    }
    return false;
  } // ClearVisibility

  /**
   * Retrieve visibility status of this object. If not set, then
   * the assumption is it is private (VISTYPE_PUBLIC)
   *
   * @param {{}} jsonObj
   * @param {string} defaultVal default to VISTYPE_PUBLIC if no data
   */
  static GetVisibility(jsonObj, defaultVal = XObjectProps.VISTYPE_PUBLIC) {
    const verdict = jsonObj ? jsonObj[XObjectProps.VISIBILITY] : null;
    return verdict || defaultVal;
  }

  /**
   * Return whether the object has visibility scope of public (VISTYPE_PUBLIC)
   *
   * @param {*} defaultVal
   */
  static IsPublicVisible(jsonObj, checkACL = true) {
    const pubVis = XObject.GetVisibility(jsonObj);
    if (pubVis == null) { return true; }    // for now, no ACL means public read OK
    if (pubVis === XObjectProps.VISTYPE_PUBLIC) { return true; }
    return false;
  }

  /**
   * Return whether the object has group level visibility (VISTYPE_GROUP)
   *
   * @param {{}} json
   */
  static IsGroupVisible(jsonObj) {
    return XObject.GetVisibility(jsonObj) === XObjectProps.VISTYPE_GROUP;
  }

  /**
   * Return whether the object has no public or group visibility, which
   * means private.
   *
   * @param {{}} json
   */
  static IsPrivateVisible(jsonObj) {
    return XObject.GetVisibility(jsonObj) === XObjectProps.VISTYPE_PRIVATE;
  }

  /**
   * Return whether the object has been marked as deleted
   *
   * @param {*} defaultVal
   */
  static IsDeleted(jsonObj) {
    return XObject.GetVisibility(jsonObj) === XObjectProps.VISTYPE_DELETED;
  }


  // ------------------------- SERIALIZATION --------------------------

  /**
   * Determine if the given object was put together by the ~Serialize
   * function. The method of checking is there exist an "stype" property,
   * and data is not null.
   *
   * @param {{}} jsonObj
   */
  static IsSerializedXObject(jsonObj) {
    return ((Util.NotNull(jsonObj[XObjectProps.STYPE])) && (Util.NotNull(jsonObj[XObjectProps.MAIN_DATA])));
  }

  /**
   * Convert XObject instance to a format where we can transmit and
   * "re-assemble" on the other side. While we can just convert the
   * entire XObject property "data" to JSON, but there are many transient
   * values that can be attached, so we must only pick those that are
   * relevant. For now, that's the auxillary carrier (AUX_DATA).
   *
   * @param {XObject} xobj either XObject instance, json version of it, or any data type
   * @return {{data:{},aux:{}=},stype={string}} result structure if it's XObject variant.
   * If not, then result is same as input "data"
   *
   * @see ~DeSerialize
   */
  static Serialize(xobj) {
    const jsonObj = XObject.Unwrap(xobj);
    const xtype = XObject.GetType(jsonObj);
    if (xtype == null) { return xobj; }    // not an XObject
    const result = {};
    result[XObjectProps.MAIN_DATA] = XObject.GetData(xobj);
    result[XObjectProps.AUX_DATA] = XObject.GetAuxData(xobj);
    result[XObjectProps.STYPE] = xtype;

    return result;
  } // SerializeXObject

  /**
   * Take serialized XObject content and re-construct
   * the XObject instance with other carrier data.
   *
   * @param {{data:{},aux:{}=}, stype:{string}} serialized
   * @return {XObject} a newly constructed instance with data, or
   * same as input if not an object
   *
    * @see ~Serialize
   */
  static DeSerialize(serialized) {
    if (typeof serialized !== 'object') { return serialized; }

    const xtype = serialized[XObjectProps.STYPE];
    const mainData = serialized[XObjectProps.MAIN_DATA];
    const auxData = serialized[XObjectProps.AUX_DATA];
    if ((xtype == null) || (mainData == null)) {
      // no marking of a serialized set, but can
      // still be wrapped
      return XObject.Wrap(serialized);
    }
    const xobj = XObject.Wrap(mainData);
    if (xobj && auxData) { xobj.setAuxData(auxData); }
    return xobj;
  } // DeSerializeXObject

  // ------------------ Other utilities

  static ToJSONString(jsonObj) {
    return jsonObj ? JSON.stringify(jsonObj) : '{}';
  }


}

XObject.RegisterType(XObject);

export default XObject;
