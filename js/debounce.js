'use strict';

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

window.debounce = {
  debounce
};
