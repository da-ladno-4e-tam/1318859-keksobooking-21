'use strict';

(function () {

  window.data = {
    PIN_FIELD_MIN_Y: 130,
    PIN_FIELD_HEIGHT: 500,
    TYPES: ['bungalow', 'flat', 'house', 'palace'],
    adverts: [],
    domAdverts: [],
    map: document.querySelector('.map'),

    getDomAdverts: function () {

      window.backend.xhr.response.forEach(function (item, i) {
        window.data.domAdverts.push(window.data.map.children[i + 1]);
      });

      return window.data.domAdverts;
    }
  }
  ;
})();
