'use strict';

const titles = ['Заголовок1', 'Заголовок2', 'Заголовок3', 'Заголовок4', 'Заголовок5', 'Заголовок6', 'Заголовок7', 'Заголовок8'];
const prices = [1000, 2000, 3000, 4000, 5000];
const types = ['palace', 'flat', 'house', 'bungalow'];
const rooms = [1, 2, 3, 100];
const guests = [1, 2, 3];
const checkinTime = ['12:00', '13:00', '14:00'];
const checkoutTime = ['12:00', '13:00', '14:00'];
const featuresList = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
const descriptions = ['Описание1', 'Описание2', 'Описание3', 'Описание4', 'Описание5', 'Описание6', 'Описание7', 'Описание8'];
const photosList = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
const map = document.querySelector('.map');
const adverts = [];
const similarListElement = map.querySelector('.map__pins');
const similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
const pinOffsetX = -25;
const pinOffsetY = -70;

function getRandomElement(arr) {
  const randomElement = Math.floor(Math.random() * arr.length);
  return arr[randomElement];
}

function getRandomList(arr) {
  const randomList = [];
  for (let i = 0; i < arr.length; i++) {
    const random = Boolean(Math.round(Math.random()));
    if (random) {
      randomList.push(arr[i]);
    }
  }
  return randomList;
}

function getAdvertsList() {
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(Math.random() * document.documentElement.clientWidth);
    const y = Math.floor(Math.random() * 500) + 130;
    const advert = {
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: titles[i],
        address: `${x}, ${y}`,
        price: getRandomElement(prices),
        type: getRandomElement(types),
        rooms: getRandomElement(rooms),
        guests: getRandomElement(guests),
        checkin: getRandomElement(checkinTime),
        checkout: getRandomElement(checkoutTime),
        features: getRandomList(featuresList),
        description: descriptions[i],
        photos: getRandomList(photosList)
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

  pinElement.style = `left: ${advert.location.x + pinOffsetX}px; top: ${advert.location.y + pinOffsetY}px;`;
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.querySelector('img').alt = advert.offer.title;
  return pinElement;
}

function getContent(render, arr) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i++) {
    fragment.appendChild(render(arr[i]));
  }

  similarListElement.appendChild(fragment);
}

getContent(renderPin, adverts);

/* const similarPopupTemplate = document.querySelector('#card').content.querySelector('.popup');

function renderPopup(advert) {
  let popupElement = similarPopupTemplate.cloneNode(true);

  popupElement.querySelector('.popup__avatar').src = advert.author.avatar;
  popupElement.querySelector('.popup__title').textContent = advert.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  popupElement.querySelector('.popup__text--price').innerHTML = `${advert.offer.price}&#x20bd;<span>/ночь</span>`;
  popupElement.querySelector('.popup__type').textContent = advert.offer.type;
  popupElement.querySelector('.popup__text--capacity').textContent = `${advert.offer.rooms} комнаты для ${advert.offer.guests} гостей`;
  popupElement.querySelector('.popup__title').textContent = `Заезд после ${advert.offer.checkin}, выезд до ${advert.offer.checkout}`;

  popupElement.querySelector('.popup__features').src = advert.features;
  popupElement.querySelector('.popup__description').textContent = advert.offer.description;
  popupElement.querySelector('.popup__title').src = advert.photos;

  return popupElement;
}

getContent(renderPopup, adverts);*/
