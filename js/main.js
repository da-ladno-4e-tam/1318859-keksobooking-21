'use strict';


const MIN_TYPE_PRICE = [0, 1000, 5000, 10000];
const MAIN_PIN_TIP = 22;
const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE = 1000000;
const REGULAR_FOR_IMAGES = /\.(jpeg|jpg|png|webp)$/;
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
const adForm = document.querySelector('.ad-form');
const adFormFieldsets = adForm.querySelectorAll('fieldset');
const avatarInput = adForm.querySelector('#avatar');
const imagesInput = adForm.querySelector('#images');
const titleInput = adForm.querySelector('#title');
const addressInput = adForm.querySelector('#address');
const typeInput = adForm.querySelector('#type');
const priceInput = adForm.querySelector('#price');
const timeInInput = adForm.querySelector('#timein');
const timeOutInput = adForm.querySelector('#timeout');
const roomNumberInput = adForm.querySelector('#room_number');
const roomNumberOneHundred = roomNumberInput.querySelector('option[value = "100"]');
const capacityInput = adForm.querySelector('#capacity');
const customValidities = {
  title: {
    minLength: `Заголовок должен быть не меньше ${MIN_TITLE_LENGTH} симв.`,
    maxLength: `Заголовок должен быть не больше ${MAX_TITLE_LENGTH} симв.`
  },
  price: `Максимальная цена за ночь не должна превышать ${MAX_PRICE} руб.`,
  capacity: `Измените количество комнат или гостей`,
  images: `Выберите изображение формата "jpeg", "jpg", "webp" или "png"`
};

window.addEventListener('load', function () {
  window.utils.disableElementsInArray(filterSelects, true);
  window.utils.disableElementsInArray(filterFieldsets, true);
  window.utils.disableElementsInArray(adFormFieldsets, true);
  addressInput.setAttribute('value', `${noActiveMainPinX}, ${noActiveMainPinY}`);
  addressInput.setAttribute('readonly', `true`);
});

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
  adForm.classList.remove('ad-form--disabled');
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

mainPin.addEventListener('mousedown', onMainPinClick);
mainPin.addEventListener('keydown', onMainPinClick);

function hideAllAdverts() {
  for (let j = 0; j < window.data.adverts.length; j++) {
    map.children[j + 1].classList.add('hidden');
  }
}

titleInput.addEventListener('input', function () {
  const titleValueLength = titleInput.value.length;

  if (titleValueLength < MIN_TITLE_LENGTH) {
    titleInput.setCustomValidity(customValidities.title.minLength);
  } else if (titleValueLength > MAX_TITLE_LENGTH) {
    titleInput.setCustomValidity(customValidities.title.maxLength);
  } else {
    titleInput.setCustomValidity('');
  }

  titleInput.reportValidity();
});

priceInput.addEventListener('input', function () {
  if (priceInput.value > MAX_PRICE) {
    priceInput.setCustomValidity(customValidities.price);
  } else {
    priceInput.setCustomValidity('');
  }

  priceInput.reportValidity();
});

typeInput.addEventListener('input', function () {
  for (let i = 0; i < window.data.TYPES.length; i++) {
    if (typeInput.value === window.data.TYPES[i]) {
      priceInput.setAttribute('min', `${MIN_TYPE_PRICE[i]}`);
      priceInput.placeholder = `${MIN_TYPE_PRICE[i]}`;
    }
  }
});

timeInInput.addEventListener('input', function () {
  timeOutInput.value = timeInInput.value;
});

timeOutInput.addEventListener('input', function () {
  timeInInput.value = timeOutInput.value;
});

function validateCapacity() {
  const capacityValue = Number(capacityInput.value);
  const roomsValue = Number(roomNumberInput.value);
  if ((capacityValue > roomsValue) || (roomsValue === Number(roomNumberOneHundred.value) && capacityValue !== roomsValue)) {
    capacityInput.setCustomValidity(customValidities.capacity);
  } else {
    capacityInput.setCustomValidity('');
  }

  capacityInput.reportValidity();
}

capacityInput.addEventListener('input', validateCapacity);
roomNumberInput.addEventListener('input', validateCapacity);

function validatePicture(element) {
  element.addEventListener('input', function () {
    const path = element.value;
    if (REGULAR_FOR_IMAGES.test(path)) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity(customValidities.images);
    }
    element.reportValidity();
  });
}

window.data.getAdvertsList();

validatePicture(avatarInput);
validatePicture(imagesInput);
