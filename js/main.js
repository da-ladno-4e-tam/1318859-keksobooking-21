'use strict';

(function () {
  const MAIN_PIN_TIP = 22;
  const KEY_ENTER = 'Enter';
  const KEY_ESCAPE = 'Escape';
  const MOUSE_BUTTON_LEFT = 1;
  const map = document.querySelector('.map');
  const mainPin = map.querySelector('.map__pin--main');
  const noActiveMainPinX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  const noActiveMainPinY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
  const activeMainPinX = noActiveMainPinX;
  const activeMainPinY = noActiveMainPinY + MAIN_PIN_TIP;
  const mapFilters = map.querySelector('.map__filters');
  const filterSelects = mapFilters.querySelectorAll('select');
  const filterFieldsets = mapFilters.querySelectorAll('fieldset');
  const domAdverts = [];
  window.similarListElement = map.querySelector('.map__pins');
  window.adForm = document.querySelector('.ad-form');
  const adFormFieldsets = window.adForm.querySelectorAll('fieldset');
  const addressInput = window.adForm.querySelector('#address');

  function getDomAdverts() {
    for (let i = 0; i < window.data.adverts.length; i++) {
      domAdverts.push(map.children[i + 1]);
    }
    return domAdverts;
  }

  function setOnPinEvents(advertsArray) {
    for (let i = 0; i < advertsArray.length; i++) {
      window.similarListElement.children[i].addEventListener('click', setOnPinClick(advertsArray[i]), false);
      window.similarListElement.children[i].addEventListener('keydown', setOnPinEnterPress(advertsArray[i]), false);
    }
  }

  function setOnPopupEvents(advertsArray) {
    for (let i = 0; i < advertsArray.length; i++) {
      advertsArray[i].querySelector('.popup__close').addEventListener('click', setOnPopupCloseClick(advertsArray[i]), false);
      advertsArray[i].querySelector('.popup__close').addEventListener('keydown', setOnPopupCloseEnterPress(advertsArray[i]), false);
    }
  }

  function activateMap() {
    map.classList.remove('map--faded');
    window.adForm.classList.remove('ad-form--disabled');
    window.utils.disableElementsInArray(filterSelects, false);
    window.utils.disableElementsInArray(filterFieldsets, false);
    window.utils.disableElementsInArray(adFormFieldsets, false);
    window.utils.getContent(window.pin.renderPin, window.data.adverts, window.similarListElement, 0);
    window.utils.getContent(window.card.renderPopup, window.data.adverts, map, 1);
    getDomAdverts();
    setOnPinEvents(domAdverts);
    setOnPopupEvents(domAdverts);
    hideAllAdverts();
    addressInput.setAttribute('value', `${activeMainPinX}, ${activeMainPinY}`);
  }

  function hideAdvert(advert) {
    advert.classList.add('hidden');
    advert.querySelector('.popup__close').removeEventListener('click', setOnPopupCloseClick(advert));
    advert.querySelector('.popup__close').removeEventListener('keydown', setOnPopupCloseEnterPress(advert));
  }

  function setOnPopupCloseClick(advert) {
    return function () {
      hideAdvert(advert);
    };
  }

  function setOnPopupCloseEnterPress(advert) {
    return function (evt) {
      if (evt.key === KEY_ENTER) {
        evt.preventDefault();
        hideAdvert(advert);
      }
    };
  }

  function onPopupEscPress(evt) {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      document.removeEventListener('keydown', onPopupEscPress);
      hideAllAdverts();
    }
  }

  function showAdvert(advert) {
    hideAllAdverts();
    advert.classList.remove('hidden');
  }

  function setOnPinClick(advert) {
    return function () {
      showAdvert(advert);
      document.addEventListener('keydown', onPopupEscPress);
    };
  }

  function setOnPinEnterPress(advert) {
    return function (evt) {
      if (evt.key === KEY_ENTER) {
        evt.preventDefault();
        showAdvert(advert);
      }
      document.addEventListener('keydown', onPopupEscPress);
    };
  }

  function onMainPinClick(evt) {
    if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
      activateMap();
      mainPin.removeEventListener('mousedown', onMainPinClick);
      mainPin.removeEventListener('keydown', onMainPinClick);
    }
  }

  function hideAllAdverts() {
    for (let j = 0; j < window.data.adverts.length; j++) {
      map.children[j + 1].classList.add('hidden');
    }
  }

  window.addEventListener('load', function () {
    window.utils.disableElementsInArray(filterSelects, true);
    window.utils.disableElementsInArray(filterFieldsets, true);
    window.utils.disableElementsInArray(adFormFieldsets, true);
    addressInput.setAttribute('value', `${noActiveMainPinX}, ${noActiveMainPinY}`);
    addressInput.setAttribute('readonly', `true`);
  });

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinClick);

})();
