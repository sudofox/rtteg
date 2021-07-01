import GAxios from "src/util/GAxios";
import {userConstants} from "../_constants";

export const checkEmail = async (email) => {
  if (!email) return;

  const config = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/s/email/exists?email=${email}`,
  };

  let res = false;

  await GAxios(config, (response) => {
    if (response.data.result) {
      res = true;
    } else {
      res = false;
    }
  });

  return res;
};
