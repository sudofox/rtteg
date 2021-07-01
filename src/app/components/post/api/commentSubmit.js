import {postConstants} from "../_constants";
import GAxios from "src/util/GAxios";

let params = {
  data: {
    acl: {
      _t: "acl",
    },
    _t: postConstants.COMMENT_TYPE,
  },
  aux: null,
  serial: postConstants.COMMENT_TYPE,
};

export const commentSubmit = async (data) => {
  if (!data) return;

  params = {...params, data: {...params.data, ...data}};

  params = JSON.stringify(params);

  var dataNew = new FormData();
  dataNew.append("content", params);

  const config = {
    method: "post",
    url: `${process.env.REACT_APP_API_URL}/u/post/${data.pid}/comment`,
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
