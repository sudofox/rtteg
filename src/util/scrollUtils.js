export const scrollHelper = (() => {
  const MAX_INTER_COUNT = 30;
  let scrollY = 0;
  let interCount = 0;
  let inter;
  let preScrollY = 0;
  let onlyFlag;

  function setPreScrollY() {
    preScrollY = window.scrollY;
  }

  function resetPreScrollY() {
    preScrollY = 0;
  }

  function lock(offset = 61, flag) {
    const app = document.getElementsByClassName("app-content")[0];
    if (!app) return;
    const scrollWindow = app.firstElementChild;
    if (!scrollWindow) return;
    onlyFlag = flag;
    scrollY = preScrollY || window.scrollY;
    resetPreScrollY();
    scrollWindow.style.height = `calc(100vh - ${offset}px)`;
    scrollWindow.style.overflowY = "hidden";
    scrollWindow.firstElementChild.style.marginTop = `-${scrollY}px`;
  }

  function unlock(flag) {
    const app = document.getElementsByClassName("app-content")[0];
    if (!app || (flag && flag !== onlyFlag)) return;
    const scrollWindow = app.firstElementChild;
    if (!scrollWindow) return;
    scrollWindow.firstElementChild.style.marginTop = 0;
    scrollWindow.style.height = "100%";
    scrollWindow.style.overflowY = "unset";
    window.scrollTo(0, scrollY);
  }

  function rememberScrollY(key) {
    window.localStorage.setItem(key, window.scrollY);
  }

  function scrollToAndForget(key) {
    const _scrollY = Number(window.localStorage.getItem(key) || 0);
    window.localStorage.removeItem(key);
    if (_scrollY > 0) {
      inter = setInterval(() => {
        if (interCount++ > MAX_INTER_COUNT) {
          clearInterval(inter);
          interCount = 0;
        } else if (document.body.scrollHeight > _scrollY) {
          window.scrollTo(0, _scrollY);
          clearInterval(inter);
          interCount = 0;
        }
      }, 100);
    }
  }

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = {37: 1, 38: 1, 39: 1, 40: 1};

  function preventDefault(e) {
    e.preventDefault();
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  // modern Chrome requires { passive: false } when adding event
  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      }),
    );
  } catch (e) {}

  var wheelOpt = supportsPassive ? {passive: false} : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  // call this to Disable
  function disableScroll() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    // window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  // call this to Enable
  function enableScroll() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    // window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  function setElementViewableHeight(el, offsetHeight = 0) {
    if (el) {
      setTimeout(() => {
        const visualViewport = window.visualViewport;
        const viewableHeight = visualViewport?.height || window.innerHeight;
        el.style.maxHeight = viewableHeight + offsetHeight + "px";
        el.style.height = viewableHeight + offsetHeight + "px";
      }, 300);
    }
  }

  function resetElementViewableHeight(el) {
    if (el) {
      setTimeout(() => {
        el.style.maxHeight = "";
        el.style.height = "";
      }, 50);
    }
  }

  function checkHasScrollBar(contentDom = document.getElementById("root")) {
    return contentDom.offsetHeight > window.outerHeight;
  }

  return {
    lock,
    unlock,
    rememberScrollY,
    scrollToAndForget,
    setPreScrollY,
    resetPreScrollY,
    disableScroll,
    enableScroll,
    setElementViewableHeight,
    resetElementViewableHeight,
    checkHasScrollBar,
  };
})();
