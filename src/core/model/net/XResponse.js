/**
 * Represent a response object.
 *
 * @see XRequest
 */
import XObject from '../XObject';
import XError from '../XError';
import ErrorCodes from '../../ErrorCodes';
import XHttpBase from './XHttpBase';
import Util from '../../Util';
// import { ECANCELED } from 'constants';

const _CLSNAME = 'XResponse';

export const PROP_RESULT = 'result';
export const PROP_RC = 'rc';
export const PROP_ERROR = 'error';

export const HTTP_CLIENT_ERROR = 499;

export const RC_OK = 'OK';
export const RC_ERROR = 'ERR';

/**
 * Wrapper for results, which can contain more data when just payload.
 * Some we can add include a return code (not necessarily error),
 * request ID, session token/info, other security data/key, etc.
 */
export class XResponse extends XHttpBase {
  constructor(clsname = _CLSNAME, params = null) {
    super(clsname, params);
    this.class = XResponse;

    this._setTypeID();
    const data = this.getData(true);
    data[PROP_RC] = RC_OK;
  }

  /**
   * Retrieve value of a field either from the main content
   * or FormData if multipart/form-data content type.
   *
   * @param {string} field
   * @param {*} defaultVal
   * @return {*}  value for the field
   */
  get(field, defaultVal) {
    let result;
    if (this.hasFormData()) {
      const formData = this.getFormData();
      result = formData.get(field);
    } else {
      result = this.getObjectField(field, null);
    }
    return result || defaultVal;
  }

  /**
   * Return the "return code" that was set in this response object.
   *
   * @return {string} default to RC_OK
   */
  getCode() {
    const data = this.getData(false);
    return data ? data[PROP_RC] : RC_OK;
  }

  /**
   * Report whether the response indicate no error (RC_OK)
   *
   * @return {string}
   * @see ~getCode
   */
  isOK() {
    return this.getCode() === RC_OK;
  }

  /**
   * Set the result inside the response object
   *
   * @param {*} result any json value
   * @param {number} rc return code. Default to PROP_RC
   *
   * @see ~getResult
   */
  setResult(result, rc = RC_OK) {
    const data = this.getData(true);
    return XResponse.SetResult(data, result, rc);
  }

  /**
   * Get the results stored in this response object
   *
   * @param {*} defaultVal value to return if no result
   * @see ~setResult
   */
  getResult(defaultVal = null) {
    const data = this.getData(false);
    const result = XResponse.GetResult(data, null);
    return Util.NotNull(result) ? result : defaultVal;
  }

  /**
   * Set the result inside the response object
   *
   * @param {*} result any json value
   * @param {number} rc return code. Default to PROP_RC
   *
   * @see ~getResult
   */
  setError(errorData, rc = RC_ERROR) {
    const data = this.getData(true);
    errorData = XObject.Unwrap(errorData); // in case
    return XResponse.SetError(data, errorData, rc);
  }

  /**
   * Get the results stored in this response object
   *
   * @param {*} defaultVal value to return if no result
   * @see ~setResult
   */
  getError(defaultVal = null) {
    return XResponse.GetError(this, defaultVal);
  }

  hasError() {
    return XResponse.HasError(this);
  }

  toConsole() {
    this.error(`Error(${this.getCode()})`, this.getMessage());
  }
  toString() {
    return `[${this.getClassname()}]: ${this.getFormattedMessage()}`;
  }

  // *************************************************************
  //
  // Class methods.
  //
  // *************************************************************

  /**
   * Check if the given type is an instance of XError
   * @param {*} obj
   */
  static IsInstance(obj) {
    return obj instanceof XResponse;
  }

  static GetTypeID() {
    return 'xresp';
  }

  /**
   * Construct an error object from the HTTP response object. It
   * should contain "status", "statusText", and "data" which server
   * side transmit the XError content
   *
   * @param {object} httpResponse
   */
  static FromHttpResponse(httpResponse) {
    const edata = httpResponse.data;
    const status = httpResponse.status;
    const statusText = httpResponse.statusText;
    let errObj = null;
    if (status === HTTP_CLIENT_ERROR) {
      if (edata) {
        errObj = XResponse.Wrap(edata);
      } else {
        errObj = XResponse.New(status, statusText);
      }
    } else {
      errObj = XResponse.New(status, statusText);
    }
    return errObj;
  }

  /**
   * Create a new response instance with result and return code
   *
   * @param {*} result can be any json type
   * @param {string} rc return code with default RC_OK
   * @return {XResponse} new instance including the {[PROP_RESULT]:result}
   */
  static CreateWithRC(result, rc = RC_OK) {
    const res = new XResponse();
    res.setResult(result, rc);
    return res;
  }

  /**
   * Create a new response instance with result and no errors
   *
   * @param {*} result can be any json type
   * @return {XResponse} new instance including the {[PROP_RESULT]:result}
   */
  static CreateOK(result) {
    const res = new XResponse();
    res.setResult(result, RC_OK);
    return res;
  }

  /**
   * Create a new response instance represent an error
   *
   * @param {XError} errObj error object or a simple string is OK as we'll wrap it
   */
  static CreateXError(xerror, rc = RC_ERROR) {
    const res = new XResponse();
    res.setError(xerror, rc);
    return res;
  }

  /**
   * Set result within the data portion of the object.
   *
   * @param {*} objectData if XObject, then entire object will be sent including AUX_DATA
   * @param {*} resultData result value to set
   * @param {string} rc optonal return code
   */
  static SetResult(objectData, resultData, rc = RC_OK) {
    if (objectData == null) {
      return false;
    }
    objectData[PROP_RESULT] =
      Util.NotNull(resultData) ? XResponse.Serialize(resultData) : null;
    if (objectData[PROP_RC] == null) {
      objectData[PROP_RC] = rc;
    }
    return true;
  }

  /**
   * Retrieve result object inside the response object
   *
   * @param {XResponse} responseObj this object or json data if already unwraped
   * @param {*} defaultVal if result is null then use this value
   * @return {*} whatever result set
   */
  static GetResult(responseObj, defaultVal = null) {
    responseObj = XResponse.Unwrap(responseObj); // in case still XResponse
    if (responseObj == null) {
      return defaultVal;
    }
    let result = responseObj[PROP_RESULT];
    if (Util.NotNull(result)) {
      result = XResponse.DeSerialize(result);
    } // if serialized (found "stype")
    return Util.NotNull(result) ? result : defaultVal;
  }

  /**
   * Wrap and error context
   *
   * @param {*} errorObj either a string, a json XError, or XError instance itself
   */
  static WrapError(errorObj) {
    if (errorObj instanceof XError) {
      return errorObj;
    }

    if (typeof errorObj === 'string') {
      return ErrorCodes.API_ERROR(errorObj);
    }

    return XError.Wrap(errorObj); // hope it's json
  }

  /**
   *  Set error object inside the response.
   *
   * @param {{}} jsonData unwraped json response data
   * @param {*} resultData result value to set
   * @param {string} rc optonal return code
   */
  static SetError(jsonData, errorObj, rc = RC_ERROR) {
    if (jsonData == null) {
      return false;
    }
    jsonData[PROP_ERROR] = XError.Unwrap(errorObj);
    if (jsonData[PROP_RC] == null || jsonData[PROP_RC] === RC_OK) {
      jsonData[PROP_RC] = rc;
    }
    return true;
  }

  /**
   * Retrieve eror object inside the response object. Error
   * object is stored separately
   *
   * @param {XResponse} jsonData this object or json data if already unwraped
   * @param {*} defaultVal
   * @return {*} whatever result set
   */
  static GetError(jsonData, defaultVal = null) {
    const data = XResponse.GetData(jsonData);
    const result = Util.NotNull(data) ? data[PROP_ERROR] : null;
    return Util.NotNull(result) ? XError.Wrap(result) : defaultVal;
  }

  /**
   *
   * @param {{}} jsonData
   */
  static HasError(jsonData) {
    return Util.NotNull(XResponse.GetError(jsonData));
  }
}

XResponse.RegisterType(XResponse);

export default XResponse;
