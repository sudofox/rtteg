import GAxios from "src/util/GAxios";

export const addPinPost = async (data) => {
  if (!data) return;

  const {userId, postId} = data;

  try {
    const config = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/post/${postId}/pin`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    let res;

    await GAxios(
      config,
      (response) => {
        res = response.data.result;
      },
      (err) => {
        if (
          err.response.status === 400 &&
          err.response.data.error.code !== "E_RES_NOTFOUND"
        ) {
          if (err.response.data.error.emsg) {
            res = err.response.data.error.emsg;
          }
        } else {
          res = null;
        }
      },
    );

    return res;
  } catch (error) {
    console.error("the error :: ", error);
    return null;
  }
};
