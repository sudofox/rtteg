export const getPinnedPost = async (data) => {
  if (!data) return;

  const {api, postId} = data;

  try {
    let res = await api.fetchPostWithStats_UserInfo(postId);

    if (res.data.nfound) {
      return null;
    }

    res = res.createXPostItem();

    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};
