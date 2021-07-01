/**
 * Represent an error record that can be passed
 * between servers and clients.
 *
 * WORK-IN-PROGRESS
 */

import XError from './model/XError';

// TODO: Need to define numeric code and map to messages

import {
  EMAIL_EXISTS,
  HTTP_CLIENT_ERROR,
  HTTP_CLIENT_AUTH,
  RES_NOTFOUND,
  RES_NOACCESS,
  SYS_DB_CONN,
  SYS_DB_REQ,
  SYS_NOTIMPL,
  SYS_BAD_ARGS,
  SYS_BAD_DATA,
  SYS_INIT,
  SYS_NETERR,
  SYS_ERR,
  RES_ERROR,
  TAG_NOTFOUND,
  API_OK,
  API_BAD_PARAMS,
  API_NO_OP,
  API_BAD_DATA,
  API_ERROR,
  INVALID_ACTION,
  USER_BAD_REQUEST,
  USER_BAD_AUTH,
  USER_EXISTS,
  USER_BAD_TOKEN,
  USER_NOT_ALLOWED,
  USER_INVALID,
  USER_OVER_LIMIT,
  USER_NOTFOUND,
  USER_BAD_INPUT,
  USER_BAD_USERNAME,
  USER_BAD_DEVICEID,
  USER_BAD_DIGEST,
  USER_BAD_VCODE,
  PASS_BAD_PWD,
  SVC_ERROR
} from './ErrorConsts';

// convenient shorthand for static getters
const E =  (code, msg = null, ...args) => {
  const eobj = new XError();
  eobj.setContent(code, msg, ...args);
  return eobj;
};

export class ErrorCodes {
  static get HTTP_CLIENT_ERROR() { return HTTP_CLIENT_ERROR; }
  static get HTTP_CLIENT_AUTH() { return HTTP_CLIENT_AUTH; }

  /**
   * Check if the given error object has the interested code.
   *
   * @param {XError=} err should be instance of XError, but can be a string code
   * @param {String} code  string code to check.
   */
  static Is(err, code) {
    return XError.HasCode(err, code);
  }

  static IsError(err) {
    return XError.IsError(err);
  }

  /**
   * Attempt to determine if the given error object is an XError
   * object, or if not an XError, then try to represent the error
   * with an XError object
   *
   * @param {object} err
   * @param {*} defaultVal
   * @returns {XError}
   */
  static GetXError(err, defaultVal = null) {
    if (err == null) { return defaultVal; }

    let xerr = null;
    if (err instanceof Error) {
      const msg = Error.message;
      const code = SYS_ERR;
      xerr = XError.New(code, msg);
    } else {
      xerr = XError.Wrap(err);
      if (xerr == null) { xerr = XError.FromJSON(err); }
    }
    return xerr;
  } // GetXError

  /**
   * Force error into a message if possible
   *
   * @param {*} err XError object, json equiv, or just string
   */
  static GetMessage(err, defaultVal = 'Unknown') {
    if (err == null) { return defaultVal; }

    if (err instanceof Error) { return err.message; }

    const xerr = XError.Wrap(err);
    return (xerr) ? xerr.getFormattedMessage() : String(err);
  } // GetMessage

  /**
   * Force error into a message if possible
   *
   * @param {*} err XError object, json equiv, or just string
   */
  static GetReadableMessage(err, defaultVal = 'Unknown') {
    if (err == null) { return defaultVal; }

    if (err instanceof Error) { return err.message; }

    const xerr = XError.Wrap(err);
    return (xerr) ? xerr.getReadableMessage() : String(err);
  } // GetReadableMessage

  static SYS_DB_CONN(msg, ...args) { return E(SYS_DB_CONN, msg, ...args); }
  static SYS_DB_REQ(msg, ...args) { return E(SYS_DB_REQ, msg, ...args); }
  static SYS_NOTIMPL(msg, ...args) { return E(SYS_NOTIMPL, msg, ...args); }
  static SYS_BAD_ARGS(msg, ...args) { return E(SYS_BAD_ARGS, msg, ...args); }
  static SYS_BAD_DATA(msg, ...args) { return E(SYS_BAD_DATA, msg, ...args); }
  static SYS_INIT(msg, ...args) { return E(SYS_INIT, msg, ...args); }
  static SYS_NETERR(msg, ...args) { return E(SYS_NETERR, msg, ...args); }
  static SYS_ERROR(msg, ...args) { return E(SYS_ERR, msg, ...args); }

  static RES_NOTFOUND(msg, ...args) { return E(RES_NOTFOUND, msg, ...args); }
  static RES_NOACCESS(msg, ...args) { return E(RES_NOACCESS, msg, ...args); }
  static RES_ERROR(msg, ...args) { return E(RES_ERROR, msg, ...args); }
  static TAG_NOTFOUND(msg, ...args) { return E(TAG_NOTFOUND, msg, ...args); }
  static API_OK(msg, ...args) { return E(API_OK, msg, ...args); }
  static API_NO_OP(msg, ...args) { return E(API_NO_OP, msg, ...args); }
  static API_BAD_PARAMS(msg, ...args) { return E(API_BAD_PARAMS, msg, ...args); }
  static API_BAD_DATA(msg, ...args) { return E(API_BAD_DATA, msg, ...args); }
  static API_ERROR(msg, ...args) { return E(API_ERROR, msg, ...args); }

  static INVALID_ACTION(msg, ...args) { return E(INVALID_ACTION, msg, ...args); }
  static EMAIL_EXISTS(msg, ...args) { return E(EMAIL_EXISTS, msg, ...args); }
  static USER_BAD_INPUT(msg, ...args) { return E(USER_BAD_INPUT, msg, ...args); }
  static USER_BAD_TOKEN(msg, ...args) { return E(USER_BAD_TOKEN, msg, ...args); }
  static USER_BAD_REQUEST(msg, ...args) { return E(USER_BAD_REQUEST, msg, ...args); }
  static USER_BAD_AUTH(msg, ...args) { return E(USER_BAD_AUTH, msg, ...args); }
  static USER_EXISTS(msg, ...args) { return E(USER_EXISTS, msg, ...args); }
  static USER_NOTFOUND(msg, ...args) { return E(USER_NOTFOUND, msg, ...args); }
  static USER_NOT_ALLOWED(msg, ...args) { return E(USER_NOT_ALLOWED, msg, ...args); }
  static USER_INVALID(msg, ...args) { return E(USER_INVALID, msg, ...args); }
  static USER_SUSPENDED(userId) { return E(USER_INVALID, 'Account Suspended', userId); }
  static USER_OVER_LIMIT(msg, ...args) { return E(USER_OVER_LIMIT, msg, ...args); }
  static USER_BAD_USERNAME(msg, ...args) { return E(USER_BAD_USERNAME, msg, ...args); }
  static USER_BAD_DEVICEID(msg, ...args) { return E(USER_BAD_DEVICEID, msg, ...args); }
  static USER_BAD_DIGEST(msg, ...args) { return E(USER_BAD_DIGEST, msg, ...args); }
  static USER_BAD_VCODE(msg, ...args) { return E(USER_BAD_VCODE, msg, ...args); }

  static PASS_BAD_PWD(msg, ...args) { return E(PASS_BAD_PWD, msg, ...args); }

  // For kafka
  static CONSUMER_SERVICE_ERROR(msg, ...args) { return E(SVC_ERROR, msg, ...args); }

}

export default ErrorCodes;
