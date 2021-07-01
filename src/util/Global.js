export const uniqueKey = (id = false) => {
  const str = id ? `${id}-` : "dfg0-";
  return str + Math.random().toString(36).substr(2, 9);
};
