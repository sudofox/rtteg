/**
 * Represent a response object.
 *
 * @see XRequest
 * @see XResponse
 */

import XObject from '../XObject';

import { UserProps } from '../ModelConsts';
import Util from '../../Util';

const _CLSNAME = 'XHttpBase';

export const PROP_HEADERS = 'headers';
export const PROP_ACCEPT = 'accept';
export const PROP_CONTENT = 'content';
export const PROP_CONTENT_TYPE = 'content-type';
export const PROP_ENCODE_TYPE = 'enctype';

export const CONTENT_TYPE_JSON = 'application/json';
export const CONTENT_TYPE_FORMDATA = 'multipart/form-data';

export const HDR_USER_AGENT = 'user-agent';

/**
 * Base class for HTTP Request and Response model/wrapper
 * objects.
 */
export class XHttpBase extends XObject {
  /**
   * Constructor - Use Create() instead
   *
   * @param {string} clsname
   * @param {*} params
   * @see ~Create
   */
  constructor(clsname = _CLSNAME, params = null) {
    super(clsname, params);
    this.class = XHttpBase;

    this._setTypeID();
  }

  /**
   * Set a field/value entry into the main data json
   * if single content, or into FormData if it exists (multipart)
   *
   * @param {string} field
   * @param {*} value string or JSON for regular content, a Blob or File for formdata
   * @return {*} old Value (if not form data)
   */
  // set(field, value) {
  //     let result;
  //     if (this.hasFormData()) {
  //         let formData = this.getFormData();
  //         formData.append(field, value);
  //     }
  //     else
  //         result = this.setObjectField(XObject.MAIN_DATA, field, value);
  //     return result;
  // }

  /**
   * Retrieve value of a field either from the main content
   * or FormData if multipart/form-data content type.
   *
   * @param {string} field
   * @param {*} defaultVal
   * @return {*}  value for the field
   */
  // get(field, defaultVal) {
  //     let result;
  //     if (this.hasFormData()) {
  //         let formData = this.getFormData();
  //         result = formData.get(field);
  //     }
  //     else
  //         result = this.getObjectField(field, null);
  //     return result ? result : defaultVal;
  // }

  /**
   * Set the entire header block. This will override
   * any existing block, so be careful. Use
   * setHeader() for setting individual line.
   *
   * @param {{}} headers
   * @return {true} if set, false if input is null or not object type
   *
   * @see ~setHeader()
   */
  setHeaders(headers) {
    if (headers && typeof headers === 'object') {
      super.set(PROP_HEADERS, headers);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {boolean} create
   * @return {{}=} header structure or null if doesn't exist
   */
  getHeaders(create = false) {
    let hdrs = super.get(PROP_HEADERS, null);
    if (hdrs == null && create === true) {
      hdrs = {};
      super.set(PROP_HEADERS, hdrs);
    }
    return hdrs;
  }

  /**
   * Set a header line with label and value pair.
   * If header block doesn't exist, one will be
   * created.
   *
   * @param {string} label
   * @param {string=} value
   *
   * @see ~getHeaderValue
   */
  setHeader(label, value) {
    if (Util.StringIsEmpty(label)) {
      console.trace('Empty value');
      return false;
    }
    const hdrs = this.getHeaders(true);
    hdrs[label] = value;
    return true;
  }

  /**
   *
   * @param {string} label
   * @param {*} defaultVal
   * @return {string=} avalue assigned to header or defaultVal
   */
  getHeaderValue(label, defaultVal = null) {
    const hdrs = this.getHeaders(false);
    const hval = hdrs ? hdrs[label] : null;
    return hval || defaultVal;
  }

  /**
   *
   * @param {string} typeString "application/json", "multipart/form-data", etc
   */
  setContentType(typeString) {
    return this.setHeader(PROP_CONTENT_TYPE, typeString);
  }

  /**
   * Set the main content (including XObject) inside the request/response object.
   *
   * @param {*} content any json value. DON'T Unwrap XObject if Aux Data
   * needs to be preserved!!
   *
   * @return {*} previously set value
   * @see ~getContent
   */
  setContent(content) {
    const scontent = XObject.Serialize(content);
    return this.set(PROP_CONTENT, scontent);
  }

  /**
   * Return content as is in set in the request body.
   * This mean do not Deserialize and re-construct XObjects
   * if it was serialized
   *
   * @param {*} defaultVal
   * @return {*}
   */
  getRawContent(defaultVal = null) {
    return this.get(PROP_CONTENT, defaultVal);
  }

  /**
   * Get the content stored in this request/response object,
   * and will try to see if was packed up via
   * XhttpBase.Serialize(). If you don't want this done
  //  * (should be harmeless), use getRawContent()
   *
   * @param {*} defaultVal value to return if no result
   * @return {*} any value stored, but if XObject it'll be
   * deserialized and wrapped
   *
   * @see ~getRawContent
   * @see ~setContent
   */
  getContent(defaultVal = null) {
    const scontent = this.get(PROP_CONTENT, null);
    const content = scontent ? XHttpBase.DeSerialize(scontent) : null;
    return content || defaultVal;
  }

  /**
   * Return content as an instance of XObject subclass, if there
   * is a type property that match registered type
   *
   * @param {*} defaultVal
   * @return {XObject} subclass of XObject instance if can be wrapped,
   * or json itself if cannot
   */
  getXContent(defaultVal = null) {
    const content = this.getContent(null);
    return content ? XObject.Wrap(content) : defaultVal;
  }

  /**
   *
   * @param {string} defaultVal if null, default is "application/json"
   * @return {string=}
   */
  getContentType(defaultVal = null) {
    if (defaultVal == null) {
      defaultVal = CONTENT_TYPE_JSON;
    }

    return this.getHeaderValue(PROP_CONTENT_TYPE, defaultVal);
  }

  /**
   *
   * @param {FormData} formData must not be null or else will not set
   * @param {boolean} inclHeader true to add "multipart/form-data". On client side,
   * this should not be done as it is set with "Boundary" by the underlying library
   *
   * @return {boolean} true if FormData set properly, false if not
   *
   * @see ~hasFormData()
   */
  setFormData(formData, inclHeader = false) {
    if (Util.NotNull(formData)) {
      this.setContentType(CONTENT_TYPE_FORMDATA);
      this.fd = formData;
      return true;
    }
    return false;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {FormData=}
   *
   * @see ~setFormData()
   */
  getFormData(defaultVal = null) {
    const fd = this.fd;
    return fd || defaultVal;
  }

  /**
   * CLIENT-SIDE API
   *
   * Return whether this request has form data content.
   * This is checking for actual content from client side
   * as "content-type" cannot be set by this code. It
   * can only be set during fetch to add "Boundary"
   *
   * If you want to check on server side, use @isMultiPartFormData
   *
   * @return {boolean} true if there is FormData object
   * stored using ~setFormData
   *
   * @see ~setFormData()
   * @see ~isMultiPartFormData()
   */
  hasFormData() {
    const fd = this.getFormData(null);
    return fd || false;
  }

  /**
   * Determine if the request is a multipart/form-data. The
   * determination is based on header "content-type", which
   * is valid on the server side. This WILL fail on client
   * side as the content-type string for multipart/form-data
   * must be set by library code where Boundary need to be
   * determined.
   *
   * @param {defaultVal} return this if header for content-type doesn't exist
   * @return {string} either content-type value or defaultVal
   */
  isMultiPartFormData() {
    const ct = this.getHeaderValue(PROP_CONTENT_TYPE, null);
    return ct ? ct.startsWith(CONTENT_TYPE_FORMDATA) : false;
  }

  /**
   *
   * @param {string} label key to associate values
   * @param {object} value either USVString, Blob, or File.
   * @param {string} filename filename if value is an instance of File
   */
  // setFormDataField(label, value, filename=null) {
  //     let fd = this.getFormData(true);
  //     return fd.set(label, value, filename);
  // }

  /**
   *
   * @param {string} label key to associate values
   * @param {object} value either USVString, Blob, or File.
   * @param {string} filename filename if value is an instance of File
   */
  // appendFormDataField(label, value, filename=null) {
  //     let fd = this.getFormData(true);
  //     return fd.append(label, value, filename);
  // }

  /**
   *
   * @param {string} label
   * @param {*} defaultVal
   * @return {{}[]} array of objects associated with the label
   */
  // getFormDataValues(label, defaultVal=null) {
  //     let fd = this.getFormData(false);
  //     let value = fd ? fd.get(label) : null;
  //     return value ? value : defaultVal;
  // }

  /**
   * Force override? not sure it works/necessary, but
   * use for unit testing at least
   *
   * @param {string} agentString
   * @return {string} previous value
   */
  setUserAgent(agentString) {
    return this.setHeader(HDR_USER_AGENT, agentString);
  }

  /**
   * Retrieve "user-agent" header value
   *
   * @param {*} defaultVal in case if none
   * @return {string} agent value in header
   */
  getUserAgent(defaultVal = null) {
    return this.getHeaderValue(HDR_USER_AGENT, defaultVal);
  }

  /**
   *
   * @param {string} typeString "application/json", "multipart/form-data", etc
   */
  setAccept(typeString) {
    return this.setHeader(PROP_ACCEPT, typeString);
  }

  /**
   * Retrieve value for the "accept" header
   *
   * @param {*} defaultVal in case if none
   * @return {string} accept value in header
   */
  getAccept(defaultVal = null) {
    return this.getHeaderValue(PROP_ACCEPT, defaultVal);
  }

  // *************************************************************
  //
  // Class methods.
  //
  // *************************************************************

  // static GetTypeID() {
  //     return "xhttpb";
  // }

  /**
   * Check if the given type is an instance of XhttpBase
   * @param {*} obj
   */
  static IsInstance(obj) {
    return obj instanceof XHttpBase;
  }

  /**
   * Set the user ID that is associated with the access token
   *
   * @param {{}} jsonObj
   * @param {string} typeString "application/json", "multipart/form-data", etc
   */
  static SetContentType(jsonObj, typeString) {
    return XHttpBase.SetObjectField(jsonObj, PROP_CONTENT_TYPE, typeString);
  }

  /**
   * Get the initiator ID of this log. Note initiator is different than
   * actioner.
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   *
   * @see ~SetContentType
   */
  static GetContentType(jsonObj, defaultVal = null) {
    return XHttpBase.GetObjectField(jsonObj, PROP_CONTENT_TYPE, defaultVal);
  }

  /**
   * Set result within the data portion of the object.
   *
   * @param {{}} jsonData unwraped json response data
   * @param {*} content content to include. XObject subclass will
   * be unwrapped.
   * @return {*} previous
   *  value
   */
  static SetContent(jsonData, content) {
    const scontent = XObject.Serialize(content);
    return XHttpBase.SetObjectField(jsonData, PROP_CONTENT, scontent);
  } // SetContent

  /**
   * Retrieve content (json) object inside the request object
   *
   * @param {XRequest} request this object or json data if already unwraped
   * @param {*} defaultVal
   * @return {{}} whatever data. If it's serialized XObject (XObject~Serialize)
   * then it will be deserialized (using XObject~DeSerialize)
   *
   * @see ~SetContent
   */
  static GetContent(httpMessage, defaultVal = null) {
    httpMessage = XHttpBase.Unwrap(httpMessage); // in case still XResponse
    let content = httpMessage ? httpMessage[PROP_CONTENT] : null;
    content = XHttpBase.DeSerialize(content); // if serialized (found "stype")
    return content || defaultVal;
  }
}

// XHttpBase.RegisterType(XHttpBase);

export default XHttpBase;
