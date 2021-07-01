import _remove from "lodash/remove";
export const exclusiveEvent = (() => {
  let tempGuid;
  let cacheEventsGroup = [];

  function _bindPrevAll() {
    const prevOne = cacheEventsGroup[cacheEventsGroup.length - 1 || 0];
    if (!prevOne) return;
    for (let eventName in prevOne) {
      if (eventName === "guid") continue;
      document.body.addEventListener(eventName, prevOne[eventName]);
    }
  }

  function _unbindPrevAll() {
    const prevOne = cacheEventsGroup[cacheEventsGroup.length - 1 || 0];
    if (!prevOne) return;
    for (let eventName in prevOne) {
      if (eventName === "guid") continue;
      document.body.removeEventListener(eventName, prevOne[eventName]);
    }
  }

  function bind(eventName, fn, guid) {
    if (guid !== tempGuid) {
      _unbindPrevAll(guid);
      cacheEventsGroup.push({
        guid,
        [eventName]: fn,
      });
      tempGuid = guid;
    } else {
      cacheEventsGroup[cacheEventsGroup.length - 1][eventName] = fn;
    }
    document.body.addEventListener(eventName, fn);
  }

  function unbindAll(guid) {
    const keyOne = _remove(cacheEventsGroup, (item) => item.guid === guid)[0];
    for (let eventName in keyOne) {
      if (eventName === "guid") continue;
      document.body.removeEventListener(eventName, keyOne[eventName]);
    }
    _bindPrevAll();
  }

  function checkIfBound(guid) {
    const keyOne = _remove(cacheEventsGroup, (item) => item.guid === guid)[0];
    for (let eventName in keyOne) {
      if (eventName === "guid") continue;
      document.body.removeEventListener(eventName, keyOne[eventName]);
    }
  }

  return {
    bind,
    unbindAll,
  };
})();

const eventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  emit(event, data) {
    document.dispatchEvent(new CustomEvent(event, {detail: data}));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
