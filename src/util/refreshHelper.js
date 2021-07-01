export const refreshHelper = (() => {
  const cacheRefreshGroup = {};
  let timer;
  return {
    setup: (viewName, refreshFunc) => {
      cacheRefreshGroup[viewName] = refreshFunc;
    },
    refresh: (viewName, data) => {
      if (cacheRefreshGroup[viewName]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          cacheRefreshGroup[viewName](true, data);
        }, 300);
      }
    },
  };
})();
