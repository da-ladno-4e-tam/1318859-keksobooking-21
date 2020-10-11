'use strict';

(function () {
  const KEY_ENTER = 'Enter';
  const KEY_ESCAPE = 'Escape';
  const MOUSE_BUTTON_LEFT = 1;
  window.adForm = document.querySelector('.ad-form');
  window.similarListElement = window.map.querySelector('.map__pins');
  window.mainPin = window.map.querySelector('.map__pin--main');
  const mapFilters = window.map.querySelector('.map__filters');
  const adFormFieldsets = window.adForm.querySelectorAll('fieldset');
  window.addressInput = window.adForm.querySelector('#address');
  window.noActiveMainPinX = Math.round(window.mainPin.offsetLeft + window.mainPin.offsetWidth / 2);
  window.noActiveMainPinY = Math.round(window.mainPin.offsetTop + window.mainPin.offsetHeight / 2);
  const filterSelects = mapFilters.querySelectorAll('select');
  const filterFieldsets = mapFilters.querySelectorAll('fieldset');

  window.main = {
    setOnPinEvents: function (advertsArray) {
      for (let i = 0; i < advertsArray.length; i++) {
        window.similarListElement.children[i].addEventListener('click', window.main.setOnPinClick(advertsArray[i]), false);
        window.similarListElement.children[i].addEventListener('keydown', window.main.setOnPinEnterPress(advertsArray[i]), false);
      }
    },

    setOnPopupEvents: function (advertsArray) {
      for (let i = 0; i < advertsArray.length; i++) {
        advertsArray[i].querySelector('.popup__close').addEventListener('click', window.main.setOnPopupCloseClick(advertsArray[i]), false);
        advertsArray[i].querySelector('.popup__close').addEventListener('keydown', window.main.setOnPopupCloseEnterPress(advertsArray[i]), false);
      }
    },

    activateMap: function () {
      window.map.classList.remove('map--faded');
      window.adForm.classList.remove('ad-form--disabled');
      window.utils.disableElementsInArray(filterSelects, false);
      window.utils.disableElementsInArray(filterFieldsets, false);
      window.utils.disableElementsInArray(adFormFieldsets, false);
      window.utils.getContent(window.pin.renderPin, window.data.adverts, window.similarListElement, 0);
      window.utils.getContent(window.card.renderPopup, window.data.adverts, window.map, 1);
      window.data.getDomAdverts();
      window.main.setOnPinEvents(window.domAdverts);
      window.main.setOnPopupEvents(window.domAdverts);
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
        window.mainPin.removeEventListener('keydown', window.main.onMainPinClick);
      }
    },

    hideAllAdverts: function () {
      for (let j = 0; j < window.data.adverts.length; j++) {
        window.map.children[j + 1].classList.add('hidden');
      }
    }
  };

  window.addEventListener('load', function () {
    window.utils.disableElementsInArray(filterSelects, true);
    window.utils.disableElementsInArray(filterFieldsets, true);
    window.utils.disableElementsInArray(adFormFieldsets, true);
    window.addressInput.setAttribute('value', `${window.noActiveMainPinX}, ${window.noActiveMainPinY}`);
    window.addressInput.setAttribute('readonly', `true`);
  });

  window.mainPin.addEventListener('mousedown', window.main.onMainPinClick);
  window.mainPin.addEventListener('keydown', window.main.onMainPinClick);
})();
