'use strict';

function debounce(cb) {
  const DEBOUNCE_INTERVAL = 500;
  let lastTimeout;

  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
}

window.debounce = {
  debounce: debounce
};
