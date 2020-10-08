'use strict';

const NUMBER_OF_ADVERTS = 8;
const PIN_FIELD_MIN_Y = 130;
const PIN_FIELD_HEIGHT = 500;
const TITLES = ['Заголовок1', 'Заголовок2', 'Заголовок3', 'Заголовок4', 'Заголовок5', 'Заголовок6', 'Заголовок7', 'Заголовок8'];
const PRICES = [1000, 2000, 3000, 4000, 5000];
const TYPES = ['bungalow', 'flat', 'house', 'palace'];
const MIN_TYPE_PRICE = [0, 1000, 5000, 10000];
const TYPES_LOCAL = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
const ROOMS = [1, 2, 3, 100];
const GUESTS = [1, 2, 3];
const CHECKIN_TIME = ['12:00', '13:00', '14:00'];
const CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
const FEATURES_LIST = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
const DESCRIPTIONS = ['Описание1', 'Описание2', 'Описание3', 'Описание4', 'Описание5', 'Описание6', 'Описание7', 'Описание8'];
const PHOTOS_LIST = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
const PIN_OFFSET_X = -25;
const PIN_OFFSET_Y = -70;
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
const adverts = [];
const domAdverts = [];
const similarListElement = map.querySelector('.map__pins');
const similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
const similarPopupTemplate = document.querySelector('#card').content.querySelector('.popup');
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

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomSortedList(arr) {
  const NUMBERS_OF_ELEMENTS = Math.floor(Math.random() * (arr.length + 1));
  const cloneArr = [...arr];
  const shuffledArr = shuffleArray(cloneArr);
  const randomSortedList = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < NUMBERS_OF_ELEMENTS; j++) {
      if (arr[i] === shuffledArr[j]) {
        randomSortedList.push(shuffledArr[j]);
      }
    }
  }
  return randomSortedList;
}

function getAdvertsList() {
  for (let i = 0; i < NUMBER_OF_ADVERTS; i++) {
    const x = Math.floor(Math.random() * similarListElement.offsetWidth);
    const y = Math.floor(Math.random() * PIN_FIELD_HEIGHT) + PIN_FIELD_MIN_Y;
    const advert = {
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: TITLES[i],
        address: `${x}, ${y}`,
        price: getRandomElement(PRICES),
        type: getRandomElement(TYPES),
        rooms: getRandomElement(ROOMS),
        guests: getRandomElement(GUESTS),
        checkin: getRandomElement(CHECKIN_TIME),
        checkout: getRandomElement(CHECKOUT_TIME),
        features: getRandomSortedList(FEATURES_LIST),
        description: DESCRIPTIONS[i],
        photos: getRandomSortedList(PHOTOS_LIST)
      },
      location: {
        x: x,
        y: y
      }
    };

    adverts.push(advert);
  }
  return adverts;
}

function renderPin(advert) {
  const pinElement = similarPinTemplate.cloneNode(true);

  pinElement.style = `left: ${advert.location.x + PIN_OFFSET_X}px; top: ${advert.location.y + PIN_OFFSET_Y}px;`;
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.querySelector('img').alt = advert.offer.title;
  return pinElement;
}

function getContent(render, arr, parent, child) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i++) {
    fragment.appendChild(render(arr[i]));
  }

  parent.insertBefore(fragment, parent.children[child]);
}

function hideUnusualFeatures(feature, features) {
  for (let j = 0; j < features.length; j++) {
    if (feature.className.includes(`--${features[j]}`)) {
      feature.style = 'display: inline-block';
      break;
    } else {
      feature.style = 'display: none';
    }
  }
}

function renderPhotos(photoData, template, photosList) {
  if (photoData.length < 1) {
    template.parentNode.removeChild(template);
  } else {
    template.src = photoData[0];
    for (let i = 1; i < photoData.length; i++) {
      const newPhoto = template.cloneNode(true);
      photosList.append(newPhoto);
      photosList.children[i].src = photoData[i];
    }
  }
}

function renderPopup(advert) {

  const popupElement = similarPopupTemplate.cloneNode(true);
  const featuresList = popupElement.querySelector('.popup__features');
  const photosList = popupElement.querySelector('.popup__photos');
  const photoTemplate = photosList.children[0];

  popupElement.classList.add('hidden');
  popupElement.querySelector('.popup__title').textContent = advert.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  popupElement.querySelector('.popup__text--price').innerHTML = `${advert.offer.price}&#x20bd;<span>/ночь</span>`;

  for (let i = 0; i < TYPES.length; i++) {
    if (advert.offer.type === TYPES[i]) {
      popupElement.querySelector('.popup__type').textContent = TYPES_LOCAL[i];
    }
  }

  popupElement.querySelector('.popup__text--capacity').textContent = `${advert.offer.rooms} комнаты для ${advert.offer.guests} гостей`;
  popupElement.querySelector('.popup__text--time').textContent = `Заезд после ${advert.offer.checkin}, выезд до ${advert.offer.checkout}`;

  for (let i = 0; i < featuresList.children.length; i++) {
    hideUnusualFeatures(featuresList.children[i], advert.offer.features);
  }

  popupElement.querySelector('.popup__description').textContent = advert.offer.description;

  renderPhotos(advert.offer.photos, photoTemplate, photosList);

  popupElement.querySelector('.popup__avatar').src = advert.author.avatar;

  return popupElement;
}

function disableElementsInArray(arr, flag) {
  for (let i = 0; i < arr.length; i++) {
    if (flag === true) {
      arr[i].setAttribute('disabled', 'disabled');
    } else {
      arr[i].removeAttribute('disabled');
    }
  }
}

window.addEventListener('load', function () {
  disableElementsInArray(filterSelects, true);
  disableElementsInArray(filterFieldsets, true);
  disableElementsInArray(adFormFieldsets, true);
  addressInput.setAttribute('value', `${noActiveMainPinX}, ${noActiveMainPinY}`);
  addressInput.setAttribute('readonly', `true`);
});

function getDomAdverts() {
  for (let i = 0; i < adverts.length; i++) {
    domAdverts.push(map.children[i + 1]);
  }
  return domAdverts;
}

function setOnPinEvents(advertsArray) {
  for (let i = 0; i < advertsArray.length; i++) {
    similarListElement.children[i].addEventListener('click', setOnPinClick(advertsArray[i]), false);
    similarListElement.children[i].addEventListener('keydown', setOnPinEnterPress(advertsArray[i]), false);
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
  disableElementsInArray(filterSelects, false);
  disableElementsInArray(filterFieldsets, false);
  disableElementsInArray(adFormFieldsets, false);
  getContent(renderPin, adverts, similarListElement, 0);
  getContent(renderPopup, adverts, map, 1);
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
  for (let j = 0; j < adverts.length; j++) {
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
  for (let i = 0; i < TYPES.length; i++) {
    if (typeInput.value === TYPES[i]) {
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

getAdvertsList();

validatePicture(avatarInput);
validatePicture(imagesInput);
