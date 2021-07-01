import GAxios from "src/util/GAxios";

export const deletePinPost = async (data) => {
  if (!data) return;

  const {userId, postId} = data;

  try {
    const config = {
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/post/${postId}/unpin`,
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
        if (err.response.status === 400) {
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
