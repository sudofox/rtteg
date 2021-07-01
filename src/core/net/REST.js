import axios from 'axios';

import API from '../API';
import XError from '../model/XError';
import { HTTP_CLIENT_ERROR, HTTP_CLIENT_AUTH, HTTP_CLIENT_NOTFOUND, HTTP_TOO_MANY_REQUESTS } from '../ErrorConsts';
import EC from '../ErrorCodes';

import XRequest from '../model/net/XRequest';
import XResponse from '../model/net/XResponse';
import XObject from '../model/XObject';
import Util from '../Util';
import {
  CONTENT_TYPE_FORMDATA,
  CONTENT_TYPE_JSON,
  PROP_CONTENT,
  PROP_CONTENT_TYPE,
  PROP_HEADERS,
  PROP_ACCEPT,
  PROP_ENCODE_TYPE,
} from '../model/net/XHttpBase';
import GAxios from "src/util/GAxios";

const _CLSNAME = 'REST';

/**
 * Base class for RESTful API processing. This class
 * holds utility functions and does not track states
 * so therefore no instances.
 */
export class REST extends API {


  // ---------------------- RECEIVER SERVICES --------------------------

  /**
   * Retrieve the query portion of the URL from GET, or body
   * content of POST. This is NOT the req.params which returns
   * the inline URL value (eg., /user/:id), but rather the
   * query portion (e.g., "validate" in /user/:id?validate=true).
   *
   * NOTE: Somehow the query param value has an extra double quotes.
   * We'll remove it before returning the value
   *
   * @param {*} req
   * @param {string=} label query parameter label to retrieve value (e.g., ?label=value)
   * @return {*} if label is given, return the query parameter. If
   * not, then return map of query label/value pairs in GET or body of POST
   */
  static GetParams(req, label = null, defaultVal = null) {
    let content;
    if (req.method === 'POST' || req.method === 'PUT') {
      if (Util.NotNull(req.body.content)) { content = req.body.content; } else { content = req.body; }
    } else if (req.method === 'GET') { content = req.query; } else { content = req.query; }

    let value = (Util.NotNull(label)) ? content[label] : content;

    if (Util.IsString(value)) { value = Util.StripWrapper(value, '"', '"'); }

    return (value == null) ? defaultVal : value;
  }


  /**
   * Craft an HTTP Error Response
   *
   * @param {} res
   * @param {XError} errObj Either instance of XError or a string
   * @param {{}} optional data to pass back
   */
  static RespondAuthError(res, errObj, result = null) {
    if ((typeof errObj) === 'string') {
      errObj = EC.API_ERROR(errObj);
    }
    const eResponse = XResponse.CreateXError(errObj);
    res.status(HTTP_CLIENT_AUTH).json(eResponse);
  }

  /**
   * Craft an HTTP Error Response
   *
   * @param {} res
   * @param {XError} errObj Either instance of XError or a string
   * @param {{}} optional data to pass back
   */
  static RespondError(res, errObj, result = null) {
    if ((typeof errObj) === 'string') {
      errObj = EC.API_ERROR(errObj);
    } else if (errObj instanceof Error) {
      errObj = EC.SYS_ERROR(errObj.message);
    }
    const xerror = XError.Wrap(errObj);
    const eResponse = XResponse.CreateXError(xerror);
    res.status(HTTP_CLIENT_ERROR).json(eResponse);
  }

  /**
   * Respond OK with result
   * @param {*} res
   * @param {{}} data data to return, null by default
   * @param {number=} status code (default = 200)
   */
  static RespondOK(res, data = null, code = 200) {
    // if (!data instanceof XResponse) {
    const xResponse = data ? XResponse.CreateOK(data) : null;
    // }
    const responseObj = xResponse ? XObject.Unwrap(xResponse) : {};
    return res.status(code).json(responseObj);
  }

  /**
   * Respond OK with encrypted result
   *
   * @param {*} res
   * @param {{}} data data to pass back but encrypted
   * @param {number} code
   */
  static RespondOK_Encrypted(res, data = null, code = 200) {
    data = data ? Util.EncryptJSON(data) : null;
    return REST.RespondOK(res, data, code);
  }

  /**
   * Return response as HTML
   *
   * @param {*} res response object
   * @param {string} html data to return, null by default
   * @param {number=} status code (default = 200)
   */
  static ReturnHTML(res, html, code = 200) {
    if (html == null) {
      html = `Error ${code}`;
    }
    return res.status(code).send(html);
  }

  /**
   * Send response with data. The standard label for the property
   * "result" will be inserted. XError can be past
   * in which proper HTTP status will be set.
   *
   * @param {*} res HTTP response object
   * @param {{}}} data data to return. Can be XObject
   * data including XError, which then an error will
   * @param {number=} rc return code within JSON object (default=0)
   * @param {number=} code http return status code (default=200)
   */
  static RespondResult(res, data = null, rc = 0, code = 200) {
    if (XError.IsInstance(data)) { return REST.RespondError(res, data); }
    const xResponse = XResponse.CreateWithRC(data, rc);
    const responseObj = XObject.Unwrap(xResponse);
    return res.status(code).json(responseObj);
  }

  // ----------------- RETURN WITH SPECIFIC ERROR --------------------

  static Respond404(res) {
    res.status(HTTP_CLIENT_NOTFOUND).end();
  }

  static Respond429(res) {
    const xerror = XError.Wrap(EC.USER_OVER_LIMIT('User meter limit exceeded'));
    const eResponse = XResponse.CreateXError(xerror);
    res.status(HTTP_TOO_MANY_REQUESTS).json(eResponse);
  }

  static Respond500(res) {
    res.status(500).end();
  }

  // ------------------ HTTP METHODS-BASED COMMUNICATIONS ----------------------

  /**
   * Make a GET request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {*} jsonData did you know GET can carry payload too in body?
   * @param {function} callback optional to async/await.
   * @callback
   * @return {object} http response.data()
   *
   * @see ~requestPUT
   * @see ~requestPOST
   * @see ~requestDELETE
   */
  static async XRequestGET(url, xRequest, callback = null) {
    return REST.XRequestMethod('get', url, xRequest, false, callback);
  }

  /**
   * Make a PUT request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {*} jsonData content
   * @param {function} callback optional to async/await.
   * @callback
   * @return {object} http response.data()
   *
   * @see ~requestGET
   * @see ~requestPOST
   * @see ~requestDELETE
   *
   */
  static async XRequestPUT(url, xRequest, callback = null) {
    return REST.XRequestMethod('put', url, xRequest, false, callback);
  }

  /**
   * Make a POST request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {{}} jsonData data to send
   *
   * @see ~requestGET
   * @see ~requestPUT
   * @see ~requestDELETE
   */
  static async XRequestPOST(url, xRequest, callback = null) {
    return REST.XRequestMethod('post', url, xRequest, false, callback);
  }

  /**
   * Make a POST request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {{}} jsonData data to send
   * @param {function} callback
   *
   * @see ~requestGET
   * @see ~requestPUT
   * @see ~request{POST}
   */
  static async XRequestDELETE(url, xRequest, callback = null) {
    return REST.XRequestMethod('delete', url, xRequest, false, callback);
  }


  // -------------- HTTP METHODS-BASED COMMUNICATIONS (EXTERNAL) ----------------------

  /**
   * Make a GET request to non-app server outside of the domain
   *
   * @param {string} url
   * @param {*} jsonData did you know GET can carry payload too in body?
   * @param {function} callback optional to async/await.
   * @callback
   * @return {object} http response.data()
   *
   * @see ~requestPUT
   * @see ~requestPOST
   * @see ~requestDELETE
   */
  static async XRequestExternalGET(url, xRequest, callback = null) {
    return REST.XRequestMethod('get', url, xRequest, true, callback);
  }

  /**
   * Make a PUT request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {*} jsonData content
   * @param {function} callback optional to async/await.
   * @callback
   * @return {object} http response.data()
   *
   * @see ~requestGET
   * @see ~requestPOST
   * @see ~requestDELETE
   *
   */
  static async XRequestExternalPUT(url, xRequest, callback = null) {
    return REST.XRequestMethod('put', url, xRequest, true, callback);
  }

  /**
   * Make a POST request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {{}} jsonData data to send
   *
   * @see ~requestGET
   * @see ~requestPUT
   * @see ~requestDELETE
   */
  static async XRequestExternalPOST(url, xRequest, callback = null) {
    return REST.XRequestMethod('post', url, xRequest, true, callback);
  }

  /**
   * Make a POST request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * @param {string} url
   * @param {{}} jsonData data to send
   * @param {function} callback
   *
   * @see ~requestGET
   * @see ~requestPUT
   * @see ~request{POST}
   */
  static async XRequestExternalDELETE(url, xRequest, callback = null) {
    return REST.XRequestMethod('delete', url, xRequest, true, callback);
  }


  /**
   * Make a HTTP request. Other higher-level service functions
   * should use this for shared wrapping and request/response
   * logic.
   *
   * If the content type set in XRequest is multipart/form-data, then
   * the content will be copied to a FormData instance.
   *
   * @param {string} method "get", "post", "delete", "update"
   * @param {XRequest} xRequest created request object
   * @param {boolean=} thirdParty to indicate external website, default is false
   * and "same-origin" will be set in header "credentials"
   * @param {function} callback optional to async/await.
   * @return {object} http response.data()
   *
   * @see ~requestPOST
   * @see ~requestDELETE
   */
  static async XRequestMethod(method, url, xRequest, thirdParty = false, callback = null) {
    const _m = `${_CLSNAME}.XReqMethod(${method})`;

    const jsonHeaders = xRequest.getHeaders();


    // let content = (method === "get") ? null : JSON.stringify(jsonContent);
    let content;
    const headerLines = { ...jsonHeaders };
    if (xRequest.hasFormData()) {
      delete headerLines[PROP_CONTENT_TYPE]; //  = CONTENT_TYPE_FORMDATA;
      headerLines[PROP_ENCODE_TYPE] = CONTENT_TYPE_FORMDATA;
      const fd = xRequest.getFormData();
      const rawContent = xRequest.getRawContent();
      const stringContent = typeof (rawContent) === 'object' ? JSON.stringify(rawContent) : String(rawContent);
      fd.set(PROP_CONTENT, stringContent);
      content = fd;
    } else {
      headerLines[PROP_ACCEPT] = CONTENT_TYPE_JSON;
      headerLines[PROP_CONTENT_TYPE] = CONTENT_TYPE_JSON;

      let jsonContent = xRequest.getContent();
      // let jsonContent = {...xRequest.getContent()};

      if (!jsonContent) {
        jsonContent = {};
      }

      if (jsonContent[PROP_HEADERS]) { delete jsonContent[PROP_HEADERS]; }

      if (method !== 'get') {
        content = JSON.stringify({ [PROP_CONTENT]: jsonContent });
      }
    }

    // console.log("JSON.stringify({ [PROP_CONTENT]: {...xRequest.getContent()} }): \n" + JSON.stringify({ [PROP_CONTENT]: {...xRequest.getContent()} }) + "\n");
    // console.log("JSON.stringify({ [PROP_CONTENT]: xRequest.getContent() }): \n" + JSON.stringify({ [PROP_CONTENT]: xRequest.getContent() }) + "\n");
    // console.log("xRequest.toJSONString() \n: " + xRequest.toJSONString() + "\n");
    // console.log("\n\n");

    const userCred = xRequest ? xRequest.getUserCred() : null;
    // if (content) { console.log(`${_m}: Request: ${url}: Payload data:`, content); }

    if (userCred) {
      const authLine = userCred.toAuthHeader(null);
      if (!Util.StringIsEmpty(authLine)) {
        headerLines[XRequest.HDR_APP_AUTH] = authLine;
      }
    }

    const appUrl = xRequest ? xRequest.getAppUrlHeader(null) : null;
    if (appUrl && (headerLines[XRequest.HDR_APP_URL] == null)) {
      headerLines[XRequest.HDR_APP_URL] = appUrl;
    }

    const opts = {
      method,
      headers: headerLines,
      body: content,
    };

    if (!thirdParty) { opts['credentials'] = 'same-origin'; }

    const p = new Promise(async (resolve, reject) => {
      let xrespObj;
      let xerror;
      try {
        const sendJson = opts.body && opts.body.constructor === String;
        const data = opts.method !== 'get' ? opts.body.constructor === FormData ? { data: opts.body } : sendJson ? { data: JSON.parse(opts.body) } : {} : {};
        const response = await axios({ ...opts, url, ...data });

        if (response.status === 401) {
          //only handle the response.
          GAxios(null, null, null, response);
        }
        // Do NOT trap 400 level errors - pass it back
        if (response.status >= 500) {
          console.error(`${_m}: HTTP Resp: `, JSON.stringify(response));
          throw XError.New(EC.SYS_NETERR, `SERVER/NET ERROR: ${response.status})`);
        }
        xrespObj= XResponse.Wrap(response.data);
      } catch (e) {
        // console.error(`${_m}: ${url} returned error`, e);

        const msg = String(e);
        if (XError.IsInstance(e)) {
          xerror = e;
        } else {
          xerror = XError.New(EC.SYS_NETERR, msg);
        }
        console.error(url, xerror);
        // GAxios(null, null, null, xerror);//It's the backend error
      } finally {
        if (callback) callback(xerror, xrespObj);
        if (xerror) { reject(xerror); } else { resolve(xrespObj); }
      }
    });
    return p;
  } // XRequestMethod

} // class

export default REST;
