'use strict';

const NUMBER_OF_ADVERTS = 8;
const PIN_FIELD_MIN_Y = 130;
const PIN_FIELD_HEIGHT = 500;
const TITLES = ['Заголовок1', 'Заголовок2', 'Заголовок3', 'Заголовок4', 'Заголовок5', 'Заголовок6', 'Заголовок7', 'Заголовок8'];
const PRICES = [1000, 2000, 3000, 4000, 5000];
const TYPES = ['palace', 'flat', 'house', 'bungalow'];
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

const map = document.querySelector('.map');
const adverts = [];
const similarListElement = map.querySelector('.map__pins');
const similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
const similarPopupTemplate = document.querySelector('#card').content.querySelector('.popup');

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
    const x = Math.floor(Math.random() * document.documentElement.clientWidth);
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

getAdvertsList();

map.classList.remove('map--faded');

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

getContent(renderPin, adverts, similarListElement, 0);

function renderPopup(advert) {
  const popupElement = similarPopupTemplate.cloneNode(true);
  const featuresList = popupElement.querySelector('.popup__features');
  const photosList = popupElement.querySelector('.popup__photos');
  const photoTemplate = photosList.children[0];

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
    for (let j = 0; j < advert.offer.features.length; j++) {
      if (featuresList.children[i].className.includes(`--${advert.offer.features[j]}`)) {
        featuresList.children[i].style = 'display: inline-block';
        break;
      } else {
        featuresList.children[i].style = 'display: none';
      }
    }
  }

  popupElement.querySelector('.popup__description').textContent = advert.offer.description;

  if (advert.offer.photos.length < 1) {
    photoTemplate.parentNode.removeChild(photoTemplate);
  } else {
    photoTemplate.src = advert.offer.photos[0];
    for (let i = 1; i < advert.offer.photos.length; i++) {
      const newPhoto = photoTemplate.cloneNode(true);
      photosList.append(newPhoto);
      photosList.children[i].src = advert.offer.photos[i];
    }
  }

  popupElement.querySelector('.popup__avatar').src = advert.author.avatar;

  return popupElement;
}

getContent(renderPopup, adverts, map, 1);
