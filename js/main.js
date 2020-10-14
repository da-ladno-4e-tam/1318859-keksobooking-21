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
  const addressInput = adForm.querySelector('#address');
  const mainPin = window.data.map.querySelector('.map__pin--main');
  const similarListElement = window.data.map.querySelector('.map__pins');
  const noActiveMainPinX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  const noActiveMainPinY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);

  function onMainPinClick(evt) {
    if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
      activateMap();
      mainPin.removeEventListener('keydown', onMainPinClick);
    }
  }

  function activateMap() {
    window.data.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.utils.disableElementsInArray(filterSelects, false);
    window.utils.disableElementsInArray(filterFieldsets, false);
    window.utils.disableElementsInArray(adFormFieldsets, false);
    window.backend.load(onLoad, onError);
  }

  function onLoad(adverts) {
    window.utils.getContent(window.pin.renderPin, adverts, similarListElement, 0);
    window.utils.getContent(window.card.renderPopup, adverts, window.data.map, 1);
    window.data.getDomAdverts();
    setOnPinEvents(window.data.domAdverts);
    setOnPopupEvents(window.data.domAdverts);
    hideAllAdverts();
  }

  function onError(errorMessage) {
    const node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: yellow;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.bottom = '46px';
    node.style.right = 0;
    node.style.fontSize = '28px';

    node.textContent = errorMessage;
    window.data.map.insertAdjacentElement('afterbegin', node);
  }

  function setOnPinEvents(advertsArray) {
    for (let i = 0; i < advertsArray.length; i++) {
      similarListElement.children[i].addEventListener('click', setOnPinClick(advertsArray[i], similarListElement.children[i]), false);
      similarListElement.children[i].addEventListener('keydown', setOnPinEnterPress(advertsArray[i], similarListElement.children[i]), false);
    }
  }

  function setOnPopupEvents(advertsArray) {
    for (let i = 0; i < advertsArray.length; i++) {
      advertsArray[i].querySelector('.popup__close').addEventListener('click', setOnPopupCloseClick(advertsArray[i]), false);
      advertsArray[i].querySelector('.popup__close').addEventListener('keydown', setOnPopupCloseEnterPress(advertsArray[i]), false);
    }
  }

  function hideAllAdverts() {
    window.backend.xhr.response.forEach(function (item, i) {
      window.data.map.children[i + 1].classList.add('hidden');
    });
  }

  function deactivatePins() {
    window.backend.xhr.response.forEach(function (item, i) {
      similarListElement.children[i].classList.remove('map__pin--active');
    });
  }

  function setOnPinClick(advert, pin) {
    return function () {
      showAdvert(advert);
      deactivatePins();
      pin.classList.add('map__pin--active');
      document.addEventListener('keydown', onPopupEscPress);
    };
  }

  function setOnPinEnterPress(advert, pin) {
    return function (evt) {
      if (evt.key === KEY_ENTER) {
        evt.preventDefault();
        showAdvert(advert);
        deactivatePins();
        pin.classList.add('map__pin--active');
      }
      document.addEventListener('keydown', onPopupEscPress);
    };
  }

  function showAdvert(advert) {
    hideAllAdverts();
    advert.classList.remove('hidden');
  }

  function hideAdvert(advert) {
    advert.classList.add('hidden');
    advert.querySelector('.popup__close').removeEventListener('click', setOnPopupCloseClick(advert));
    advert.querySelector('.popup__close').removeEventListener('keydown', setOnPopupCloseEnterPress(advert));
  }

  function setOnPopupCloseClick(advert) {
    return function () {
      hideAdvert(advert);
      deactivatePins();
    };
  }

  function setOnPopupCloseEnterPress(advert) {
    return function (evt) {
      if (evt.key === KEY_ENTER) {
        evt.preventDefault();
        hideAdvert(advert);
        deactivatePins();
      }
    };
  }

  function onPopupEscPress(evt) {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      deactivatePins();
      document.removeEventListener('keydown', onPopupEscPress);
      hideAllAdverts();
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

  window.main = {
    adForm: adForm,
    similarListElement: similarListElement,
    mainPin: mainPin,
    addressInput: addressInput,
  };

})();
