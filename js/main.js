'use strict';

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';
const MOUSE_BUTTON_LEFT = 1;
const MAX_SIMILAR_ADVERT_COUNT = 5;
const MAX_PRICE = 1000000;
const ANY_CHOICE = 'any';
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
const map = document.querySelector('.map');
const mainContainer = document.querySelector('main');
const mapFilters = map.querySelector('.map__filters');
const filterSelects = mapFilters.querySelectorAll('select');
const filterFieldsets = mapFilters.querySelectorAll('fieldset');
const adForm = document.querySelector('.ad-form');
const roomPreviewContainer = adForm.querySelector('.ad-form__photo');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const adFormFieldsets = adForm.querySelectorAll('fieldset');
const addressInput = adForm.querySelector('#address');
const resetButton = adForm.querySelector('.ad-form__reset');
const mainPin = map.querySelector('.map__pin--main');
const similarListElement = map.querySelector('.map__pins');
const noActiveMainPinX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
const noActiveMainPinY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const filterOfType = mapFilters.querySelector('#housing-type');
const filterOfPrice = mapFilters.querySelector('#housing-price');
const filterOfRooms = mapFilters.querySelector('#housing-rooms');
const filterOfGuests = mapFilters.querySelector('#housing-guests');
// const filtersOfFeatures = mapFilters.querySelectorAll('.map__checkbox');

let domAdverts = [];
let adverts = [];
let filteredAdverts = [];
let typeOfHouse = ANY_CHOICE;
let price = ANY_CHOICE;
let numberOfRooms = ANY_CHOICE;
let numberOfGuests = ANY_CHOICE;
let features = [];

function updateAdverts() {
  // console.log('update');
  // console.log(typeOfHouse);
  filteredAdverts = window.filter.filterAdverts(adverts, filteredAdverts);
  // console.log(typeOfHouse);
  window.utils.getContent(window.pin.renderPin, filteredAdverts, similarListElement, 0);
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
  // console.log('activate');
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  window.utils.disableElementsInArray(adFormFieldsets, false);
  // console.log(typeOfHouse);
  window.backend.load(onLoad, onError);
  // console.log(typeOfHouse);
}

function reactivateMap() {

  // console.log('reactivate');
  // console.log(typeOfHouse);
  window.backend.load(onLoad, onError);
  // console.log(adverts);
  // console.log(filteredAdverts);
  // console.log(typeOfHouse);
  filteredAdverts = adverts;
  // console.log(filteredAdverts);
  // console.log(typeOfHouse);
  // filteredAdverts = window.filter.filterAdverts(adverts, filteredAdverts);
  // console.log(filteredAdverts);
  // console.log(typeOfHouse);
  // console.log(domAdverts);
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  window.utils.disableElementsInArray(filterSelects, false);
  window.utils.disableElementsInArray(filterFieldsets, false);
  window.utils.disableElementsInArray(adFormFieldsets, false);
  showPins();
}

function onLoad(data) {
  window.utils.disableElementsInArray(filterSelects, false);
  window.utils.disableElementsInArray(filterFieldsets, false);
  adverts = data;
  updateAdverts();
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

function disableForm() {
  adForm.classList.add('ad-form--disabled');
  window.utils.disableElementsInArray(filterSelects, true);
  window.utils.disableElementsInArray(filterFieldsets, true);
  window.utils.disableElementsInArray(adFormFieldsets, true);
  deactivateForm();
  adForm.reset();
}

function moveMainPinToStart() {
  mainPin.style.left = '570px';
  mainPin.style.top = '375px';
}

function setMainPinEvents() {
  mainPin.addEventListener('mousedown', onMainPinSecondClick);
  mainPin.addEventListener('keydown', onMainPinSecondClick);
}

function deactivateMap() {
  // console.log('deactivate');
  if (roomPreviewContainer.children[0]) {
    roomPreviewContainer.children[0].remove();
  }
  avatarPreview.src = "img/muffin-grey.svg";
  map.classList.add('map--faded');
  mapFilters.reset();
  clearAdverts();
  moveMainPinToStart();
  disableForm();
  hideAllAdverts();
  hidePins();
  deactivatePins();
  setMainPinEvents();
  refreshFilters();
  // console.log(typeOfHouse);
}

function refreshFilters() {
  typeOfHouse = ANY_CHOICE;
  price = ANY_CHOICE;
  numberOfRooms = ANY_CHOICE;
  numberOfGuests = ANY_CHOICE;
  filterOfType.value = ANY_CHOICE;
  filterOfPrice.value = ANY_CHOICE;
  filterOfRooms.value = ANY_CHOICE;
  filterOfGuests.value = ANY_CHOICE;
  features = [];
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
  if (template === errorTemplate) {
    mainContainer.querySelector('.error__button').addEventListener('mousedown', onFormMessageClick);
  }
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

adForm.addEventListener('submit', onSubmit);

resetButton.addEventListener('click', deactivateMap);


window.main = {
  MAX_PRICE: MAX_PRICE,
  MAX_SIMILAR_ADVERT_COUNT: MAX_SIMILAR_ADVERT_COUNT,
  ANY_CHOICE: ANY_CHOICE,
  PRICE_VALUES: PRICE_VALUES,
  map: map,
  mapFilters: mapFilters,
  adForm: adForm,
  similarListElement: similarListElement,
  mainPin: mainPin,
  addressInput: addressInput,
  roomPreviewContainer: roomPreviewContainer,
  avatarPreview: avatarPreview,
  adverts: adverts,
  clearAdverts: clearAdverts,
  updateAdverts: updateAdverts,
  typeOfHouse: typeOfHouse,
  price: price,
  numberOfRooms: numberOfRooms,
  numberOfGuests: numberOfGuests,
  features: features,

  filterOfType: filterOfType,
  filterOfPrice: filterOfPrice,
  filterOfRooms: filterOfRooms,
  filterOfGuests: filterOfGuests
};
