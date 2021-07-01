import {postConstants} from "../_constants";
import GAxios from "src/util/GAxios";

let params = {
  data: {
    acl: {
      _t: "acl",
      pub: postConstants.ACL_PERM_READ,
    },
    _t: postConstants.POST_TYPE,
    vis: postConstants.VISTYPE_PUBLIC,
  },
  aux: null,
  serial: postConstants.POST_TYPE,
};

export const postSubmit = async (data) => {
  if (!data) return;

  params = {...params, data: {...params.data, ...data}};

  params = JSON.stringify(params);

  var dataNew = new FormData();
  dataNew.append("content", params);

  const config = {
    method: "post",
    url: postConstants.SUBMIT_POST_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      enctype: "multipart/form-data",
    },
    data: dataNew,
  };

  let res = null;

  await GAxios(config, (response) => {
    if (response.data.result) {
      res = response.data.result;
    } else {
      res = null;
    }
  });

  return res;
};
