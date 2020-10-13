'use strict';

(function () {
  const NUMBER_OF_ADVERTS = 8;
  const TITLES = ['Заголовок1', 'Заголовок2', 'Заголовок3', 'Заголовок4', 'Заголовок5', 'Заголовок6', 'Заголовок7', 'Заголовок8'];
  const PRICES = [1000, 2000, 3000, 4000, 5000];
  const ROOMS = [1, 2, 3, 100];
  const GUESTS = [1, 2, 3];
  const CHECKIN_TIME = ['12:00', '13:00', '14:00'];
  const CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
  const FEATURES_LIST = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
  const DESCRIPTIONS = ['Описание1', 'Описание2', 'Описание3', 'Описание4', 'Описание5', 'Описание6', 'Описание7', 'Описание8'];
  const PHOTOS_LIST = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];


  window.data = {
    PIN_FIELD_MIN_Y: 130,
    PIN_FIELD_HEIGHT: 500,
    TYPES: ['bungalow', 'flat', 'house', 'palace'],
    adverts: [],
    domAdverts: [],
    map: document.querySelector('.map'),

    getAdvertsList: function () {
      for (let i = 0; i < NUMBER_OF_ADVERTS; i++) {
        const x = Math.floor(Math.random() * window.main.similarListElement.offsetWidth);
        const y = Math.floor(Math.random() * window.data.PIN_FIELD_HEIGHT) + window.data.PIN_FIELD_MIN_Y;
        const advert = {
          author: {
            avatar: `img/avatars/user0${i + 1}.png`
          },
          offer: {
            title: TITLES[i],
            address: `${x}, ${y}`,
            price: window.utils.getRandomElement(PRICES),
            type: window.utils.getRandomElement(window.data.TYPES),
            rooms: window.utils.getRandomElement(ROOMS),
            guests: window.utils.getRandomElement(GUESTS),
            checkin: window.utils.getRandomElement(CHECKIN_TIME),
            checkout: window.utils.getRandomElement(CHECKOUT_TIME),
            features: window.utils.getRandomSortedList(FEATURES_LIST),
            description: DESCRIPTIONS[i],
            photos: window.utils.getRandomSortedList(PHOTOS_LIST)
          },
          location: {
            x: x,
            y: y
          }
        };

        window.data.adverts.push(advert);
      }
      return window.data.adverts;
    },

    getDomAdverts: function () {
      for (let i = 0; i < window.data.adverts.length; i++) {
        window.data.domAdverts.push(window.data.map.children[i + 1]);
      }
      return window.data.domAdverts;
    }
  };
})();
