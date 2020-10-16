'use strict';

(function () {
  const KEY_ENTER = 'Enter';
  const KEY_ESCAPE = 'Escape';
  const MOUSE_BUTTON_LEFT = 1;
  const map = document.querySelector('.map');
  const mainContainer = document.querySelector('main');
  const mapFilters = map.querySelector('.map__filters');
  const filterSelects = mapFilters.querySelectorAll('select');
  const filterFieldsets = mapFilters.querySelectorAll('fieldset');
  const adForm = document.querySelector('.ad-form');
  const adFormFieldsets = adForm.querySelectorAll('fieldset');
  const addressInput = adForm.querySelector('#address');
  const submitButton = adForm.querySelector('.ad-form__submit');
  const resetButton = adForm.querySelector('.ad-form__reset');
  const mainPin = map.querySelector('.map__pin--main');
  const similarListElement = map.querySelector('.map__pins');
  const noActiveMainPinX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  const noActiveMainPinY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);

  const successTemplate = document.querySelector('#success').content.querySelector('.success');
  const errorTemplate = document.querySelector('#error').content.querySelector('.error');
  let domAdverts = [];

  function getDomAdverts(adverts) {

    adverts.forEach(function (item, i) {
      domAdverts.push(map.children[i + 1]);
    });

    return domAdverts;
  }

  function onMainPinClick(evt) {
    if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
      activateMap();
      mainPin.removeEventListener('keydown', onMainPinClick);
      mainPin.removeEventListener('mousedown', onMainPinClick);
    }
  }

  function onMainPinSecondClick(evt) {
    if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
      reactivateMap();
    }
  }

  function activateMap() {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.utils.disableElementsInArray(filterSelects, false);
    window.utils.disableElementsInArray(filterFieldsets, false);
    window.utils.disableElementsInArray(adFormFieldsets, false);
    window.backend.load(onLoad, onError);
  }

  function reactivateMap() {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.utils.disableElementsInArray(filterSelects, false);
    window.utils.disableElementsInArray(filterFieldsets, false);
    window.utils.disableElementsInArray(adFormFieldsets, false);
    showPins();
  }

  function onLoad(adverts) {
    window.utils.getContent(window.pin.renderPin, adverts, similarListElement, 0);
    window.utils.getContent(window.card.renderPopup, adverts, map, 1);
    getDomAdverts(adverts);
    setOnPinEvents(domAdverts);
    setOnPopupEvents(domAdverts);
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
    map.insertAdjacentElement('afterbegin', node);
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
    domAdverts.forEach(function (item, i) {
      map.children[i + 1].classList.add('hidden');
    });
  }

  function deactivatePins() {
    domAdverts.forEach(function (item, i) {
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

  function deactivateForm() {
    window.utils.disableElementsInArray(filterSelects, true);
    window.utils.disableElementsInArray(filterFieldsets, true);
    window.utils.disableElementsInArray(adFormFieldsets, true);
    addressInput.setAttribute('value', `${noActiveMainPinX}, ${noActiveMainPinY}`);
  }

  function hidePins() {
    for (let i = 0; i < domAdverts.length; i++) {
      similarListElement.children[i].classList.add('hidden');
    }
  }

  function showPins() {
    for (let i = 0; i < domAdverts.length; i++) {
      similarListElement.children[i].classList.remove('hidden');
    }
  }

  function deactivateMap() {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mainPin.style.left = '570px';
    mainPin.style.top = '375px';
    window.utils.disableElementsInArray(filterSelects, true);
    window.utils.disableElementsInArray(filterFieldsets, true);
    window.utils.disableElementsInArray(adFormFieldsets, true);
    mapFilters.reset();
    adForm.reset();
    deactivateForm();
    hideAllAdverts();
    hidePins();
    deactivatePins();
    mainPin.addEventListener('mousedown', onMainPinSecondClick);
    mainPin.addEventListener('keydown', onMainPinSecondClick);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), onSaveSuccess, onSaveError);
  }

  function onSaveSuccess() {
    deactivateMap();
    showFormMessage(successTemplate);
  }

  function onSaveError() {
    showFormMessage(errorTemplate);
  }

  function showFormMessage(template) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(renderFormMessage(template));

    mainContainer.insertBefore(fragment, mainContainer.children[0]);

    document.addEventListener('click', onFormMessageClick);
    document.addEventListener('keydown', onFormMessageEscPress);
    mainContainer.querySelector('.error__button').addEventListener('mousedown', onFormMessageClick);
  }

  function renderFormMessage(template) {
    return template.cloneNode(true);
  }

  function onFormMessageClick() {
    mainContainer.children[0].parentNode.removeChild(mainContainer.children[0]);
    document.removeEventListener('click', onFormMessageClick);
    document.removeEventListener('keydown', onFormMessageEscPress);
  }

  function onFormMessageEscPress(evt) {
    if (evt.key === KEY_ESCAPE) {
      mainContainer.children[0].parentNode.removeChild(mainContainer.children[0]);
      document.removeEventListener('click', onFormMessageClick);
      document.removeEventListener('keydown', onFormMessageEscPress);
    }
  }

  deactivateForm();

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinClick);

  submitButton.addEventListener('click', onSubmit);

  resetButton.addEventListener('click', deactivateMap);

  window.main = {
    adForm: adForm,
    similarListElement: similarListElement,
    mainPin: mainPin,
    addressInput: addressInput,
  };

})();
