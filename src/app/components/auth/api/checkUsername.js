import GAxios from "src/util/GAxios";
import {userConstants} from "../_constants";

export const checkUsername = async (username) => {
  if (!username) return;

  const config = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/s/user/${username}/exist`,
  };

  let res = null;

  await GAxios(config, (response) => {
    if (response.data.result) {
      res = response.data.result;
    } else {
      console.error(response);
      res = null;
    }
  });

  return res;
};
