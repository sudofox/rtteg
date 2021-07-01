/**
 * The NetworkManager is responsible for the communications
 * to backend servers, which can be remote or can be
 * local.
 *
 */

import ObjectBase from './ObjectBase';
// import XMObject from "./model/XMObject";
import API from './API';
import REST from './net/REST';
import EC, { ErrorCodes } from '../core/ErrorCodes';
import XError from '../core/model/XError';
import XRequest from './model/net/XRequest';
import Util from './Util';
// import Axios from "axios";

const instances = {};


class NetworkManager extends ObjectBase {
  constructor(label = 'default', clsname = 'NetworkManager') {
    super(clsname);
    this.class = NetworkManager;
    this.label = label;
    this.cred = {};
  }

  applyConfig(props) {
    this.apiHost = props.apiHost ? props.apiHost : 'http://localhost:5001';

    if (Util.NotNull(props.isClient)) { this.isClient = props.isClient; }
    if (Util.NotNull(props.isServer)) { this.isServer = props.isServer; }

    if (this.apiHost == null) { this.isClient = false; }

    // this.log("appConfig", "API Server host URL: " + this.apiHost);
  }

  setUserCredFunction(f) {
    this.getUserCred = f;
  }

  /**
   * Return pre-tracked user credential if any. This will
   * be different implementation for client and server side.
   *
   * @return {XUserCred}
   */
  // getUserCred() {
  //     return this.Global ? this.Global.GetUserCred() : null;
  // }

  getApiHost() {
    if (this.apiHost == null) {
      // this.error("getApiHost", "Not ApiHost configured. WRONG INSTANCE!!!");
      this.apiHost = 'http://localhost:5001';
    }
    return this.apiHost;
  }

  getLabel() {
    return this.label;
  }

  /**
   * Return whether this instance is running in pure
   * client mode (request over network), or is running
   * in the same VM as local StorageManager.
   *
   * NOTE: this code should go somewhere else,
   * perhaps a "System" global object so its
   * accessible by all.
   */
  isServerRole() {
    if (this.isServer) { return this.isServer; }

    return false;
  }

  isClientRole() {
    return this.isClient;
  }

  async getResource(id, type, params = {}, callback) {
    const _m = 'gres';
    // this.log("getResource", "type:" + type + ", ids: ", idArray);
    this.assertNotNull(type, _m, 'null type resp');
    if (id == null) { return callback ? callback('No res ID', null) : null; }

    const prefix = this.getApiHost();
    const api_prefix = `${prefix}/api`;
    let url = `${api_prefix}/${type}/${id}`;

    const userCred = this.getUserCred ? this.getUserCred() : null;
    const xRequest = XRequest.CreateNew(null, userCred);

    // let nm = this;

    // append IDs of resources to retrieve
    const qargs = params ? { ...params } : {};
    const argStr = Object.keys(qargs).map(
      label => `${label}=${JSON.stringify(qargs[label])}`).join('&');
    url += `?${argStr}`;

    // nm.log(_m, "API Call: ", url);

    const promise = REST.XRequestGET(url, xRequest);
    promise.then((response) => {
      // this.log(_m, "cross-fetch resp", response);
      // allow one level confusion
      let data = (response.data ? response.data : response) || null;
      let xerr = null;
      if (data == null) {
        this.error(_m, 'Null resp from: ', url);
        data = {};
        data[API.MAIN_DATA] = null;
      } else if (ErrorCodes.IsError(data)) {
        xerr = ErrorCodes.GetXError(data);
        data = null;
      }
      return callback ? callback(xerr, data) : data;
    })
      .catch((error) => {
        this.error(_m, error);
        let errObj;
        if (error.response) { errObj = XError.FromHttpResponse(error.response); } else { errObj = EC.SYS_NETERR(error); }
        return callback ? callback(errObj, null) : null;
      });
  } // getResources

  // getResource_Axios(id, type, params={}, callback) {
  //     let _m = "gres_axios";
  //     // this.log("getResource", "type:" + type + ", ids: ", idArray);
  //     this.assertNotNull(type, _m, "null res t");
  //     if (id == null )
  //         return callback ? callback("No resource ID", null) : null;

  //     let prefix = this.getApiHost();
  //     let api_prefix = prefix + "/api";
  //     let url = api_prefix + "/" + type + "/" + id;

  //     let nm = this;

  //     // append IDs of resources to retrieve
  //     let qargs = params ? {...params} : {};
  //     let argStr = Object.keys(qargs).map(
  //         label => label + '=' + JSON.stringify(qargs[label])).join('&');
  //     url += "?" + argStr;

  //     nm.log(_m, "API Call: ", url);
  //     Axios.get(url, null)
  //         .then(function(response) {
  //             // nm.log(_m, "Axios returned with response", response);
  //             let data = response ? response.data: null;
  //             if (data == null) {
  //                 nm.error(_m, "Null resp: ", url);
  //                 data = {};
  //                 data[API.MAIN_DATA] = null;
  //             }
  //             return callback ? callback(null, data) : data;
  //         })
  //         .catch(function(error) {
  //             nm.error(_m, "Error from call: ", error);
  //             let errObj;
  //             if (error.response)
  //                 errObj = XError.FromHttpResponse(error.response);
  //             else
  //                 errObj = EC.SYS_NETERR(error);
  //             return callback ? callback(errObj,null) : null;
  //         });
  // } // getResources

  // getResource_useResources(id, type, params, callback) {
  //     // let nm = this;
  //     return this.getResources([id], type, params, function(err, resList) {
  //         if (err)
  //             callback(err, null);
  //         else {
  //             let result;
  //             if (resList && Array.isArray(resList) && resList.length > 0)
  //                 result = resList[0];
  //             else
  //                 result = null;
  //             callback(null, result);
  //         }
  //     });
  // }

  // getResources(idArray, type, params={}, callback) {
  //     let _m = "gres";
  //     // this.log("getResources", "type:" + type + ", ids: ", idArray);
  //     this.assertNotNull(type, _m, "null type");
  //     if (idArray == null || idArray.length == 0)
  //         return callback ? callback(null, null) : null;

  //     let prefix = this.getApiHost();
  //     let api_prefix = prefix + "/api";
  //     let url = api_prefix + "/" + type;

  //     let nm = this;

  //     // append IDs of resources to retrieve
  //     let qargs = params ? {...params} : {};
  //     qargs["ids"] = idArray.toString();
  //     let argStr = Object.keys(qargs).map(label => label + '=' + qargs[label]).join('&');
  //     url += "?" + argStr;

  //     // nm.log(_m, "API Call: ", url);
  //     Axios.get(url, null)
  //         .catch(function(error) {
  //             nm.error(_m, "Error from call: ", error);
  //             return callback ? callback(error,null) : null;
  //         })
  //         .then(function(response) {
  //             // nm.log(_m, "Axios returned with response", response);
  //             let data = response ? response.data: null;
  //             if (data == null) {
  //                 nm.error(_m, "Null resp from: ", url);
  //                 data = [];
  //             }
  //             return callback ? callback(null, data) : data;
  //         });
  // } // getResources


  // *************************************************************
  //
  // Class methods. Any methods that can be used as helper
  // for generic JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************

  static GetInstance(label = 'default', create = true) {
    if (instances.hasOwnProperty('label')) { return instances[label]; }
    if (!create) { return null; }

    // console.log("NetworkManager.GetInstance: Creating new instance with label: " + label);
    const newInstance = new NetworkManager(label);
    instances[label] = newInstance;
    return newInstance;
  }

}

export default NetworkManager;
