'use strict';

const PIN_FIELD_MIN_Y = 130;
const PIN_FIELD_HEIGHT = 500;
const MAIN_PIN_TIP = 22;
const MAIN_PIN_HEIGHT = window.main.majorPin.offsetHeight + MAIN_PIN_TIP;

function fillAddress(currentX, currentY) {
  window.main.addressInput.setAttribute(`value`, `${currentX}, ${currentY}`);
}

window.main.majorPin.addEventListener(`mousedown`, function (evt) {
  evt.preventDefault();

  let startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  let activeMajorPinX = Math.round(window.main.majorPin.offsetLeft + window.main.majorPin.offsetWidth / 2);
  let activeMajorPinY = Math.round(window.main.majorPin.offsetTop + MAIN_PIN_HEIGHT);

  window.main.addressInput.setAttribute(`value`, `${activeMajorPinX}, ${activeMajorPinY}`);

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    const shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    const currentX = activeMajorPinX - shift.x;
    const currentY = activeMajorPinY - shift.y;

    activeMajorPinX = Math.round(window.main.majorPin.offsetLeft + window.main.majorPin.offsetWidth / 2);
    activeMajorPinY = Math.round(window.main.majorPin.offsetTop + MAIN_PIN_HEIGHT);
    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    window.main.majorPin.style.top = (window.main.majorPin.offsetTop - shift.y) + `px`;
    window.main.majorPin.style.left = (window.main.majorPin.offsetLeft - shift.x) + `px`;
    fillAddress(currentX, currentY);

    if (currentX <= 0) {
      window.main.majorPin.style.left = `${-window.main.majorPin.offsetWidth / 2}px`;
      fillAddress(0, currentY);
    }
    if (currentX >= window.main.similarListElement.offsetWidth) {
      window.main.majorPin.style.left = `${window.main.similarListElement.offsetWidth - window.main.majorPin.offsetWidth / 2}px`;
      fillAddress(window.main.similarListElement.offsetWidth, currentY);
    }

    if (currentY <= PIN_FIELD_MIN_Y) {
      window.main.majorPin.style.top = `${PIN_FIELD_MIN_Y - MAIN_PIN_HEIGHT}px`;
      fillAddress(currentX, PIN_FIELD_MIN_Y);
    }
    if (currentY >= PIN_FIELD_MIN_Y + PIN_FIELD_HEIGHT) {
      window.main.majorPin.style.top = `${PIN_FIELD_MIN_Y + PIN_FIELD_HEIGHT - MAIN_PIN_HEIGHT}px`;
      fillAddress(currentX, PIN_FIELD_MIN_Y + PIN_FIELD_HEIGHT);
    }
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  }

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
});
