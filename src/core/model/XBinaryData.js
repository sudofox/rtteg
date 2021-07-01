
import XMObject from './XMObject';
import ModelType, { ModelFolder } from './ModelConsts';

const _CLSNAME = 'XBinaryData'; // match class name

const PROP_CONTENT = 'en64';

/**
 * Model related statistics for an  XMObject
 */
class XBinaryData extends XMObject {

  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XBinaryData;
    this._setTypeID(XBinaryData.GetTypeID());
  }

  /**
     * Set base64 encoded content directly.
     *
     * @param {string} data64 base64 encoded string. Note
     * we don't check for validity.
     */
  setContent(data64) {
    return this.setBase64(PROP_CONTENT, data64);
  }

  /**
     * Return content as is, which is encoded base64.
     *
     * @param {*} defaultVal
     */
  getContent(defaultVal = null) {
    return this.getBase64(PROP_CONTENT, defaultVal);
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
     * for storing binary data. This should be overridden by
     * subclass that store the type in a collection.
     */
  static GetFolderName() {
    return ModelFolder.BINARY_DATA;
  }


  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return ModelType.BINARY;
  }

  /**
     * Create new wrapper object around
     * @param {*} data
     */
  static Create(data) {
    const obj = new XBinaryData();
    obj.setContent(data);
    return obj;
  }

  /**
     * Wrap JSON data that represents XMList
     */
  static Wrap(jsonRec, clsType = XBinaryData) {
    return XBinaryData.WrapXMObject(jsonRec, clsType);
  }

} // class XBinaryData

XBinaryData.RegisterType(XBinaryData);

export default XBinaryData;
