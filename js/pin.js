'use strict';

const PIN_OFFSET_X = -25;
const PIN_OFFSET_Y = -70;
const similarPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

function renderBadge(advert) {
  const pinElement = similarPinTemplate.cloneNode(true);

  pinElement.style = `left: ${advert.location.x + PIN_OFFSET_X}px; top: ${advert.location.y + PIN_OFFSET_Y}px;`;
  pinElement.querySelector(`img`).src = advert.author.avatar;
  pinElement.querySelector(`img`).alt = advert.offer.title;

  return pinElement;
}

window.pin = {
  renderBadge
};
