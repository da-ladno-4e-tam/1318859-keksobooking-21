'use strict';

(function () {
  const TYPES = ['bungalow', 'flat', 'house', 'palace'];
  const TYPES_LOCAL = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
  const similarPopupTemplate = document.querySelector('#card').content.querySelector('.popup');

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

  function renderPhotos(photoData, template, photos) {
    if (photoData.length < 1) {
      template.parentNode.removeChild(template);
    } else {
      template.src = photoData[0];
      for (let i = 1; i < photoData.length; i++) {
        const newPhoto = template.cloneNode(true);
        photos.append(newPhoto);
        photos.children[i].src = photoData[i];
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
      if (advert.offer.features.length < 1) {
        featuresList.style = 'display: none';
      } else {
        hideUnusualFeatures(featuresList.children[i], advert.offer.features);
      }
    }

    popupElement.querySelector('.popup__description').textContent = advert.offer.description;

    renderPhotos(advert.offer.photos, photoTemplate, photosList);

    popupElement.querySelector('.popup__avatar').src = advert.author.avatar;

    return popupElement;
  }


  window.card = {
    TYPES: TYPES,
    renderPopup: renderPopup
  };
})();
