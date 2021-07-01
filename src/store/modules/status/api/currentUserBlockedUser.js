import GAxios from "src/util/GAxios";

export const currentUserBlockedUser = async ({userId, targetId}) => {
  if (!userId || !targetId) {
    return null;
  }

  const config = {
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/u/user/${userId}/blocks/${targetId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = null;
  await GAxios(config, ({data}) => {
    res = data?.result;
  });

  return [res !== "nb" && res !== "n", targetId];
};
