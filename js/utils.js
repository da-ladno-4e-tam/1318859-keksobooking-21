'use strict';

function getContent(render, arr, parent, child) {
  const fragment = document.createDocumentFragment();

  arr.forEach(function (item) {
    fragment.appendChild(render(item));
  });
  parent.insertBefore(fragment, parent.children[child]);
}

function disableElementsInArray(arr, flag) {
  arr.forEach(function (item) {
    if (flag) {
      item.setAttribute(`disabled`, `disabled`);
    } else {
      item.removeAttribute(`disabled`);
    }
  });
}

function debounce(cb) {
  const DEBOUNCE_INTERVAL = 500;
  let lastTimeout;
  return function (...parameters) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
}

window.utils = {
  getContent,
  disableElementsInArray,
  debounce
};
