'use strict';

(function () {
  const MAIN_PIN_TIP = 22;
  const KEY_ENTER = 'Enter';
  const KEY_ESCAPE = 'Escape';
  const MOUSE_BUTTON_LEFT = 1;
  const mainPin = window.map.querySelector('.map__pin--main');
  const noActiveMainPinX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  const noActiveMainPinY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
  const activeMainPinX = noActiveMainPinX;
  const activeMainPinY = noActiveMainPinY + MAIN_PIN_TIP;
  const mapFilters = window.map.querySelector('.map__filters');
  const filterSelects = mapFilters.querySelectorAll('select');
  const filterFieldsets = mapFilters.querySelectorAll('fieldset');
  window.similarListElement = window.map.querySelector('.map__pins');
  window.adForm = document.querySelector('.ad-form');
  const adFormFieldsets = window.adForm.querySelectorAll('fieldset');
  const addressInput = window.adForm.querySelector('#address');

  window.main = {
    setOnPinEvents: function (advertsArray) {
      for (let i = 0; i < advertsArray.length; i++) {
        window.similarListElement.children[i].addEventListener('click', this.setOnPinClick(advertsArray[i]), false);
        window.similarListElement.children[i].addEventListener('keydown', this.setOnPinEnterPress(advertsArray[i]), false);
      }
    },

    setOnPopupEvents: function (advertsArray) {
      for (let i = 0; i < advertsArray.length; i++) {
        advertsArray[i].querySelector('.popup__close').addEventListener('click', this.setOnPopupCloseClick(advertsArray[i]), false);
        advertsArray[i].querySelector('.popup__close').addEventListener('keydown', this.setOnPopupCloseEnterPress(advertsArray[i]), false);
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
      this.setOnPinEvents(window.domAdverts);
      this.setOnPopupEvents(window.domAdverts);
      this.hideAllAdverts();
      addressInput.setAttribute('value', `${activeMainPinX}, ${activeMainPinY}`);
    },

    hideAdvert: function (advert) {
      advert.classList.add('hidden');
      advert.querySelector('.popup__close').removeEventListener('click', this.setOnPopupCloseClick(advert));
      advert.querySelector('.popup__close').removeEventListener('keydown', this.setOnPopupCloseEnterPress(advert));
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
      this.hideAllAdverts();
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
        mainPin.removeEventListener('mousedown', this.onMainPinClick);
        mainPin.removeEventListener('keydown', this.onMainPinClick);
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
    addressInput.setAttribute('value', `${noActiveMainPinX}, ${noActiveMainPinY}`);
    addressInput.setAttribute('readonly', `true`);
  });

  mainPin.addEventListener('mousedown', window.main.onMainPinClick);
  mainPin.addEventListener('keydown', window.main.onMainPinClick);
})();
