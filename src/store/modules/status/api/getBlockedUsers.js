export const getBlockedUsers = async ({api, userId, max}) => {
  if (!userId) {
    return;
  }

  try {
    const res = await api.getBlockedUsers(userId, max);

    return res.data?.list;
  } catch (err) {
    return null;
  }
};
