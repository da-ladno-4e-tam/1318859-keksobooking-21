'use strict';

const PIN_OFFSET_X = -25;
const PIN_OFFSET_Y = -70;
const similarPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

function renderBadge(advert) {
  const badgeElement = similarPinTemplate.cloneNode(true);

  badgeElement.style = `left: ${advert.location.x + PIN_OFFSET_X}px; top: ${advert.location.y + PIN_OFFSET_Y}px;`;
  badgeElement.querySelector(`img`).src = advert.author.avatar;
  badgeElement.querySelector(`img`).alt = advert.offer.title;

  return badgeElement;
}

window.pin = {
  renderBadge
};
