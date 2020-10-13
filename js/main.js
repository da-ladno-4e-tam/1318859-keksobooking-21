'use strict';

(function () {
  const KEY_ENTER = 'Enter';
  const KEY_ESCAPE = 'Escape';
  const MOUSE_BUTTON_LEFT = 1;
  const mapFilters = window.data.map.querySelector('.map__filters');
  const filterSelects = mapFilters.querySelectorAll('select');
  const filterFieldsets = mapFilters.querySelectorAll('fieldset');
  const adForm = document.querySelector('.ad-form');
  const adFormFieldsets = adForm.querySelectorAll('fieldset');
  const mainPin = window.data.map.querySelector('.map__pin--main');

  window.main = {

    adForm: adForm,
    adFieldsets: adFormFieldsets,
    similarListElement: window.data.map.querySelector('.map__pins'),
    mainPin: mainPin,
    addressInput: adForm.querySelector('#address'),
    noActiveMainPinX: Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2),
    noActiveMainPinY: Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2),

    setOnPinEvents: function (advertsArray) {
      for (let i = 0; i < advertsArray.length; i++) {
        window.main.similarListElement.children[i].addEventListener('click', window.main.setOnPinClick(advertsArray[i]), false);
        window.main.similarListElement.children[i].addEventListener('keydown', window.main.setOnPinEnterPress(advertsArray[i]), false);
      }
    },

    setOnPopupEvents: function (advertsArray) {
      for (let i = 0; i < advertsArray.length; i++) {
        advertsArray[i].querySelector('.popup__close').addEventListener('click', window.main.setOnPopupCloseClick(advertsArray[i]), false);
        advertsArray[i].querySelector('.popup__close').addEventListener('keydown', window.main.setOnPopupCloseEnterPress(advertsArray[i]), false);
      }
    },

    activateMap: function () {
      window.data.map.classList.remove('map--faded');
      window.main.adForm.classList.remove('ad-form--disabled');
      window.utils.disableElementsInArray(filterSelects, false);
      window.utils.disableElementsInArray(filterFieldsets, false);
      window.utils.disableElementsInArray(window.main.adFieldsets, false);
      window.utils.getContent(window.pin.renderPin, window.data.adverts, window.main.similarListElement, 0);
      window.utils.getContent(window.card.renderPopup, window.data.adverts, window.data.map, 1);
      window.data.getDomAdverts();
      window.main.setOnPinEvents(window.data.domAdverts);
      window.main.setOnPopupEvents(window.data.domAdverts);
      window.main.hideAllAdverts();
    },

    hideAdvert: function (advert) {
      advert.classList.add('hidden');
      advert.querySelector('.popup__close').removeEventListener('click', window.main.setOnPopupCloseClick(advert));
      advert.querySelector('.popup__close').removeEventListener('keydown', window.main.setOnPopupCloseEnterPress(advert));
    },

    setOnPopupCloseClick: function (advert) {
      return function () {
        window.main.hideAdvert(advert);
      };
    },

    setOnPopupCloseEnterPress: function (advert) {
      return function (evt) {
        if (evt.key === KEY_ENTER) {
          evt.preventDefault();
          window.main.hideAdvert(advert);
        }
      };
    },

    onPopupEscPress: function (evt) {
      if (evt.key === KEY_ESCAPE) {
        evt.preventDefault();
        document.removeEventListener('keydown', window.main.onPopupEscPress);
        window.main.hideAllAdverts();
      }
    },

    showAdvert: function (advert) {
      window.main.hideAllAdverts();
      advert.classList.remove('hidden');
    },

    setOnPinClick: function (advert) {
      return function () {
        window.main.showAdvert(advert);
        document.addEventListener('keydown', window.main.onPopupEscPress);
      };
    },

    setOnPinEnterPress: function (advert) {
      return function (evt) {
        if (evt.key === KEY_ENTER) {
          evt.preventDefault();
          window.main.showAdvert(advert);
        }
        document.addEventListener('keydown', window.main.onPopupEscPress);
      };
    },

    onMainPinClick: function (evt) {
      if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
        window.main.activateMap();
        window.main.mainPin.removeEventListener('keydown', window.main.onMainPinClick);
      }
    },

    hideAllAdverts: function () {
      for (let j = 0; j < window.data.adverts.length; j++) {
        window.data.map.children[j + 1].classList.add('hidden');
      }
    }
  };

  window.addEventListener('load', function () {
    window.utils.disableElementsInArray(filterSelects, true);
    window.utils.disableElementsInArray(filterFieldsets, true);
    window.utils.disableElementsInArray(window.main.adFieldsets, true);
    window.main.addressInput.setAttribute('value', `${window.main.noActiveMainPinX}, ${window.main.noActiveMainPinY}`);
    window.main.addressInput.setAttribute('readonly', `true`);
  });

  window.main.mainPin.addEventListener('mousedown', window.main.onMainPinClick);
  window.main.mainPin.addEventListener('keydown', window.main.onMainPinClick);
})();
