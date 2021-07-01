/**
 * Represent an error record that can be passed
 * between servers and clients.
 *
 * @see ErrorCodes
 */

import XObject from './XObject';
import { ModelType } from './ModelConsts';
import { USER_BAD_TOKEN, HTTP_CLIENT_ERROR, USER_INVALID } from '../ErrorConsts';
import Util from '../Util';


export const PROP_ECODE = 'code';
export const PROP_EMSG = 'emsg';
export const PROP_ARGS = 'args';

const _CLSNAME = 'XError';

/**
 * Model representation of an error, which can be
 * serialized and sent over network.
 */
class XError extends XObject {
  constructor(clsname = _CLSNAME, params = null) {
    super(clsname, params);
    this.class = XError;

    this._setTypeID();
    // let data = this[XObject.MAIN_DATA];
    // data[PROP_ECODE] = errCode;
    // data[PROP_EMSG] = errMsg;
    // data[PROP_ARGS] = null;
    // this.setStackTrace();
  }

  /**
   * Set a stack trace. If null, one will
   * be created at this point of entry.
   *
   * @param {*} stack
   *
   * @see ~getStackTracek
   */
  setStackTrace(stack = null) {
    if (stack == null) {
      stack = new Error().stack;
    }
    this.stackTrace = stack;
  }

  /**
   * Return a saved stack trace.
   *
   * @param {*} defaultVal
   */
  getStackTrace(defaultVal = null) {
    return this.stackTrace ? this.stackTrace : defaultVal;
  }

  setContent(code, msg, ...args) {
    const data = this.getData(true);
    data[PROP_ECODE] = code;
    this.setMessage(msg, ...args);
  }

  setMessage(msg, ...args) {
    const data = this.getData(true);
    data[PROP_EMSG] = String(msg);
    data[PROP_ARGS] = args;
  }

  /**
   *
   * @param {string} defaultVal in case no code
   * @return {string} error code
   */
  getCode(defaultVal = 'Error') {
    const data = this.getData(false);
    const code = data ? data[PROP_ECODE] : null;
    return code || defaultVal;
  }
  /**
   *
   * @param {string} code
   * @return {boolean} true if matching code
   * @see ~isNot
   */
  is(code) {
    return this.getCode() === code;
  }

  isBadTokenError() {
    return this.getCode() === USER_BAD_TOKEN;
  }

  invalidUser() {
    return this.getCode() === USER_INVALID;
  }

  /**
   *
   * @param {string} code
   * @return {boolean} true if code doesn't match
   * @see ~is
   */
  isNot(code) {
    return this.getCode() !== code;
  }

  /**
   * @return {string} message if any
   */
  getMessage() {
    const data = this.getData(false);
    return data ? data[PROP_EMSG] : null;
  }

  getFormattedMessage() {
    const code = this.getCode();
    const emsg = this.getMessage();
    if (emsg) {
      return `${code}: ${emsg}`;
    }
    return `(code=${this.getCode()})`;
  }

  getReadableMessage() {
    // let code = this.getCode();
    const emsg = this.getMessage();
    if (emsg) {
      return emsg;
    }
    return `(code=${this.getCode()})`;
  }


  toConsole() {
    this.error(`Error(${this.getCode()})`, this.getMessage());
  }
  toString() {
    return `[${this.getClassname()}]: ${this.getFormattedMessage()}`;
  }

  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * Check if the given type is an instance of XError
   * @param {*} obj
   */
  static IsInstance(obj) {
    return obj instanceof XError;
  }

  static GetTypeID() {
    return ModelType.XERROR;
  }

  static FromJSON(errRec) {
    const ecode = errRec[PROP_ECODE];
    const errObj = new XError(ecode);
    if (PROP_EMSG in errRec) { errObj.setMessage(errRec[PROP_EMSG], errRec[PROP_ARGS]); }
    return errObj;
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
      if (edata) { errObj = XError.Wrap(edata); } else { errObj = XError.New(status, statusText); }
    } else {
      errObj = XError.New(status, statusText);
    }
    return errObj;
  }

  /**
   * Convert content from standard Error object to XError
   *
   * @param {Error} errorObj if it's XError, will just return that
   * @return {XError}
   *
   * @see ~GetCode if you only care about getting the error code (not the msg)
   */
  static FromError(errorObj) {
    if (XError.IsInstance(errorObj)) { return errorObj; }

    const code = (errorObj.getCode) ? errorObj.getCode() : 'Unknown';
    const msg = (errorObj.getMessage) ? errorObj.getMessage() : String(errorObj);
    const eobj = new XError();
    eobj.setContent(code, msg);
    return eobj;
  }

  /**
   * Convert content of Error type to XError
   *
   * @deprecated - see FromError
   *
   * @param {Error} errorObj if it's XError, will just return that
   * @return {XError}
   *
   * @see ~GetCode if you only care about getting the error code (not the msg)
   */
  static FromRequestError(errorObj) {
    return this.FromError(errorObj);
  }

  /**
   *
   * @param {string} code
   * @param {string} msg
   * @param {boolean} setTrace true to include a stack from this call
   */
  static New(code, msg, setTrace = false) {
    const eobj = new XError();
    eobj.setContent(code, msg);
    if (setTrace) { eobj.setStackTrace(); }
    return eobj;
  }

  /**
   * Attempt to retrieve error code from the given error object
   *
   * @param {XError?} errorObj XError or another error type
   */
  static GetCode(errorObj) {
    let ecode;
    if (XError.IsInstance(errorObj)) {
      ecode = errorObj.getCode();
    } else if (errorObj.getCode) {
      ecode = errorObj.getCode();
    } else {
      ecode = 'Unknown';
    }
    return ecode;
  }

  /**
   * Determine if the given error object that:
   * 1) is instance of XError, and 2) has error
   * code specified.
   *
   * @param {object} err error object to check
   * @param {string} code a code string
   * @return {boolean} true if error object has the specified code
   */
  static HasCode(xerr, code) {
    const err = XError.Unwrap(xerr);
    if (err == null) { return false; }

    // if (XError.IsInstance(xerr))
    //     return xerr.is(code);
    try {
      if (code == null) { console.trace(`${_CLSNAME}.HasCode: null code, err=${JSON.stringify(err)}`); }

      if (err && err.hasOwnProperty(PROP_ECODE)) { return err[PROP_ECODE] === code; } else if (Util.NotNull(err.getCode)) { return err.getCode() === code; }
    } catch (ee) {
      console.log(ee);
    }
    return false;
  } // HasCode

  static IsError(err) {
    const xerr = XError.Wrap(err, null);
    return XError.IsInstance(xerr);
  }

}

XError.RegisterType(XError);

export default XError;
