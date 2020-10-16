'use strict';

(function () {

  const PIN_FIELD_MIN_Y = 130;
  const PIN_FIELD_HEIGHT = 500;
  const MAIN_PIN_TIP = 22;
  const MAIN_PIN_HEIGHT = window.main.mainPin.offsetHeight + MAIN_PIN_TIP;

  function fillAddress(currentX, currentY) {
    window.main.addressInput.setAttribute('value', `${currentX}, ${currentY}`);
  }

  window.main.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    let activeMainPinX = Math.round(window.main.mainPin.offsetLeft + window.main.mainPin.offsetWidth / 2);
    let activeMainPinY = Math.round(window.main.mainPin.offsetTop + MAIN_PIN_HEIGHT);

    window.main.addressInput.setAttribute('value', `${activeMainPinX}, ${activeMainPinY}`);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      const currentX = activeMainPinX - shift.x;
      const currentY = activeMainPinY - shift.y;

      activeMainPinX = Math.round(window.main.mainPin.offsetLeft + window.main.mainPin.offsetWidth / 2);
      activeMainPinY = Math.round(window.main.mainPin.offsetTop + MAIN_PIN_HEIGHT);
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.main.mainPin.style.top = (window.main.mainPin.offsetTop - shift.y) + 'px';
      window.main.mainPin.style.left = (window.main.mainPin.offsetLeft - shift.x) + 'px';
      fillAddress(currentX, currentY);

      if (currentX <= 0) {
        window.main.mainPin.style.left = `${-window.main.mainPin.offsetWidth / 2}px`;
        fillAddress(0, currentY);
      }
      if (currentX >= window.main.similarListElement.offsetWidth) {
        window.main.mainPin.style.left = `${window.main.similarListElement.offsetWidth - window.main.mainPin.offsetWidth / 2}px`;
        fillAddress(window.main.similarListElement.offsetWidth, currentY);
      }

      if (currentY <= PIN_FIELD_MIN_Y) {
        window.main.mainPin.style.top = `${PIN_FIELD_MIN_Y - MAIN_PIN_HEIGHT}px`;
        fillAddress(currentX, PIN_FIELD_MIN_Y);
      }
      if (currentY >= PIN_FIELD_MIN_Y + PIN_FIELD_HEIGHT) {
        window.main.mainPin.style.top = `${PIN_FIELD_MIN_Y + PIN_FIELD_HEIGHT - MAIN_PIN_HEIGHT}px`;
        fillAddress(currentX, PIN_FIELD_MIN_Y + PIN_FIELD_HEIGHT);
      }
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();
