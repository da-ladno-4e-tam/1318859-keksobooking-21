'use strict';

const MOUSE_BUTTON_LEFT = 1;
const KEY_ENTER = `Enter`;
const KEY_ESCAPE = `Escape`;
const MAX_SIMILAR_ADVERT_COUNT = 5;
const MAX_PRICE = 1000000;
const ANY_CHOICE = `any`;
const PRICE_VALUES = {
  'any': {
    MIN_COST: 0,
    MAX_COST: MAX_PRICE
  },
  'low': {
    MIN_COST: 0,
    MAX_COST: 10000
  },
  'middle': {
    MIN_COST: 10000,
    MAX_COST: 50000
  },
  'high': {
    MIN_COST: 50000,
    MAX_COST: Infinity
  }
};
const map = document.querySelector(`.map`);
const mainContainer = document.querySelector(`main`);
const mapFilters = map.querySelector(`.map__filters`);
const filterSelects = mapFilters.querySelectorAll(`select`);
const filterFieldsets = mapFilters.querySelectorAll(`fieldset`);
const adForm = document.querySelector(`.ad-form`);
const roomPreviewContainer = adForm.querySelector(`.ad-form__photo`);
const avatarPreview = adForm.querySelector(`.ad-form-header__preview img`);
const adFormFieldsets = adForm.querySelectorAll(`fieldset`);
const addressInput = adForm.querySelector(`#address`);
const resetButton = adForm.querySelector(`.ad-form__reset`);
const majorPin = map.querySelector(`.map__pin--main`);
const similarListElement = map.querySelector(`.map__pins`);
const noActiveMajorPinX = Math.round(majorPin.offsetLeft + majorPin.offsetWidth / 2);
const noActiveMajorPinY = Math.round(majorPin.offsetTop + majorPin.offsetHeight / 2);
const successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);

let domAdverts = [];
let adverts = [];
let filteredAdverts = [];

function updateAdverts() {
  filteredAdverts = window.filter.selectAdverts(adverts);
  window.utils.getContent(window.pin.renderBadge, filteredAdverts, similarListElement, 0);
  window.utils.getContent(window.card.renderPopup, filteredAdverts, map, 1);
  getDomAdverts(filteredAdverts);
  setOnPinEvents(domAdverts);
  setOnPopupEvents(domAdverts);
  hideAllAdverts();
}

function clearAdverts() {
  for (let i = filteredAdverts.length - 1; i >= 0; i--) {
    similarListElement.children[i].parentNode.removeChild(similarListElement.children[i]);
    map.children[i + 1].parentNode.removeChild(map.children[i + 1]);
  }
  filteredAdverts = [];
  domAdverts = [];
}

function getDomAdverts(arr) {
  for (let i = 0; i < arr.length; i++) {
    domAdverts.push(map.children[i + 1]);
  }
  return domAdverts;
}

function onMajorPinClick(evt) {
  if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
    activateMap();
    majorPin.removeEventListener(`keydown`, onMajorPinClick);
    majorPin.removeEventListener(`mousedown`, onMajorPinClick);
  }
}

function onMajorPinSecondClick(evt) {
  if (evt.key === KEY_ENTER || evt.which === MOUSE_BUTTON_LEFT) {
    reactivateMap();
    majorPin.removeEventListener(`mousedown`, onMajorPinSecondClick);
    majorPin.removeEventListener(`keydown`, onMajorPinSecondClick);
  }
}

function activateMap() {
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  window.utils.disableElementsInArray(adFormFieldsets, false);
  window.backend.load(onLoad, onError);
}

function reactivateMap() {
  window.backend.load(onLoad, onError);
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  window.utils.disableElementsInArray(filterSelects, false);
  window.utils.disableElementsInArray(filterFieldsets, false);
  window.utils.disableElementsInArray(adFormFieldsets, false);
  showPins();
}

function checkOffer(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!arr[i].offer) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

function onLoad(data) {
  window.utils.disableElementsInArray(filterSelects, false);
  window.utils.disableElementsInArray(filterFieldsets, false);
  adverts = data;
  checkOffer(adverts);
  updateAdverts();
}

function onError(errorMessage) {
  const node = document.createElement(`div`);
  node.style = `z-index: 1; margin: 0 auto; text-align: center; background-color: yellow;`;
  node.style.position = `absolute`;
  node.style.left = 0;
  node.style.bottom = `46px`;
  node.style.right = 0;
  node.style.fontSize = `28px`;

  node.textContent = errorMessage;
  map.insertAdjacentElement(`afterbegin`, node);
}

function setOnPinEvents(advertsArray) {
  advertsArray.forEach(function (item, index) {
    similarListElement.children[index].addEventListener(`click`, setOnPinClick(item, similarListElement.children[index]), false);
    similarListElement.children[index].addEventListener(`keydown`, setOnPinEnterPress(item, similarListElement.children[index]), false);
  });
}

function setOnPopupEvents(advertsArray) {
  advertsArray.forEach(function (item) {
    item.querySelector(`.popup__close`).addEventListener(`click`, setOnPopupCloseClick(item), false);
    item.querySelector(`.popup__close`).addEventListener(`keydown`, setOnPopupCloseEnterPress(item), false);
  });
}

function hideAllAdverts() {
  domAdverts.forEach(function (item, i) {
    map.children[i + 1].classList.add(`hidden`);
  });
}

function deactivatePins() {
  domAdverts.forEach(function (item, i) {
    similarListElement.children[i].classList.remove(`map__pin--active`);
  });
}

function setOnPinClick(advert, pin) {
  return function () {
    showAdvert(advert);
    deactivatePins();
    pin.classList.add(`map__pin--active`);
    document.addEventListener(`keydown`, onPopupEscPress);
  };
}

function setOnPinEnterPress(advert, pin) {
  return function (evt) {
    if (evt.key === KEY_ENTER) {
      evt.preventDefault();
      showAdvert(advert);
      deactivatePins();
      pin.classList.add(`map__pin--active`);
    }
    document.addEventListener(`keydown`, onPopupEscPress);
  };
}

function showAdvert(advert) {
  hideAllAdverts();
  advert.classList.remove(`hidden`);
}

function hideAdvert(advert) {
  advert.classList.add(`hidden`);
  advert.querySelector(`.popup__close`).removeEventListener(`click`, setOnPopupCloseClick(advert));
  advert.querySelector(`.popup__close`).removeEventListener(`keydown`, setOnPopupCloseEnterPress(advert));
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
    document.removeEventListener(`keydown`, onPopupEscPress);
    hideAllAdverts();
  }
}

function deactivateForm() {
  window.utils.disableElementsInArray(filterSelects, true);
  window.utils.disableElementsInArray(filterFieldsets, true);
  window.utils.disableElementsInArray(adFormFieldsets, true);
  addressInput.setAttribute(`value`, `${noActiveMajorPinX}, ${noActiveMajorPinY}`);
}

function hidePins() {
  domAdverts.forEach(function (index) {
    similarListElement.children[index].classList.add(`hidden`);
  });
}

function showPins() {
  domAdverts.forEach(function (index) {
    similarListElement.children[index].classList.remove(`hidden`);
  });
}

function disableForm() {
  adForm.classList.add(`ad-form--disabled`);
  deactivateForm();
  adForm.reset();
}

function moveMajorPinToStart() {
  majorPin.style.left = `570px`;
  majorPin.style.top = `375px`;
}

function setMajorPinEvents() {
  majorPin.addEventListener(`mousedown`, onMajorPinSecondClick);
  majorPin.addEventListener(`keydown`, onMajorPinSecondClick);
}

function deactivateMap() {
  if (roomPreviewContainer.children[0]) {
    roomPreviewContainer.children[0].remove();
  }
  avatarPreview.src = `img/muffin-grey.svg`;
  map.classList.add(`map--faded`);
  mapFilters.reset();
  clearAdverts();
  window.filter.cancelChanges();
  moveMajorPinToStart();
  disableForm();
  hideAllAdverts();
  hidePins();
  deactivatePins();
  setMajorPinEvents();
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

  document.addEventListener(`click`, onFormMessageClick);
  document.addEventListener(`keydown`, onFormMessageEscPress);
  if (template === errorTemplate) {
    mainContainer.querySelector(`.error__button`).addEventListener(`mousedown`, onFormMessageClick);
  }
}

function renderFormMessage(template) {
  return template.cloneNode(true);
}

function onFormMessageClick() {
  mainContainer.children[0].parentNode.removeChild(mainContainer.children[0]);
  document.removeEventListener(`click`, onFormMessageClick);
  document.removeEventListener(`keydown`, onFormMessageEscPress);
}

function onFormMessageEscPress(evt) {
  if (evt.key === KEY_ESCAPE) {
    mainContainer.children[0].parentNode.removeChild(mainContainer.children[0]);
    document.removeEventListener(`click`, onFormMessageClick);
    document.removeEventListener(`keydown`, onFormMessageEscPress);
  }
}

deactivateForm();

majorPin.addEventListener(`mousedown`, onMajorPinClick);
majorPin.addEventListener(`keydown`, onMajorPinClick);

adForm.addEventListener(`submit`, onSubmit);

resetButton.addEventListener(`click`, deactivateMap);


window.main = {
  MAX_PRICE,
  MAX_SIMILAR_ADVERT_COUNT,
  ANY_CHOICE,
  PRICE_VALUES,
  map,
  mapFilters,
  adForm,
  similarListElement,
  majorPin,
  addressInput,
  roomPreviewContainer,
  avatarPreview,
  adverts,
  clearAdverts,
  updateAdverts
};
