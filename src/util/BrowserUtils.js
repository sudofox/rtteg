const TOP_POPUP_INDEX = "top_popup_index";

export const APP = "app";
export function whereIAM() {
  const url = window.location.href;
  const ua = navigator.userAgent;
  const result = (`${url}+${ua}`.match(/whereiam=([a-z]+)/) || [])[1];
  return result;
}
export function isInApp() {
  return whereIAM() === APP;
}

export function breakpoints(width) {
  return window.matchMedia(`(max-width: ${width}px)`).matches;
}

export function getTopIndex() {
  let topIndex = localStorage.getItem(TOP_POPUP_INDEX);
  topIndex = /^[0-9]+$/.test(topIndex) ? Number(topIndex) + 1 : 999;
  localStorage.setItem(TOP_POPUP_INDEX, Number(topIndex));
  return topIndex;
}
export function reduceTopIndex() {
  let topIndex = localStorage.getItem(TOP_POPUP_INDEX);
  topIndex = /^[0-9]+$/.test(topIndex) ? Number(topIndex) - 1 : 999;
  localStorage.setItem(TOP_POPUP_INDEX, Number(topIndex));
  return topIndex;
}
