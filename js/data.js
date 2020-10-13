'use strict';

(function () {

  window.data = {
    NUMBER_OF_ADVERTS: 10,
    PIN_FIELD_MIN_Y: 130,
    PIN_FIELD_HEIGHT: 500,
    TYPES: ['bungalow', 'flat', 'house', 'palace'],
    adverts: [],
    domAdverts: [],
    map: document.querySelector('.map'),

    getDomAdverts: function () {
      for (let i = 0; i < window.data.NUMBER_OF_ADVERTS; i++) {
        window.data.domAdverts.push(window.data.map.children[i + 1]);
      }
      return window.data.domAdverts;
    }
  };
})();
