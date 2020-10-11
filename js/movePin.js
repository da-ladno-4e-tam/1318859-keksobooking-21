'use strict';

(function () {
  const MAIN_PIN_TIP = 22;
  const MainPinHeight = window.mainPin.offsetHeight + MAIN_PIN_TIP;

  window.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    let activeMainPinX = Math.round(window.mainPin.offsetLeft + window.mainPin.offsetWidth / 2);
    let activeMainPinY = Math.round(window.mainPin.offsetTop + MainPinHeight);

    window.addressInput.setAttribute('value', `${activeMainPinX}, ${activeMainPinY}`);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      const currentX = activeMainPinX - shift.x;
      const currentY = activeMainPinY - shift.y;

      activeMainPinX = Math.round(window.mainPin.offsetLeft + window.mainPin.offsetWidth / 2);
      activeMainPinY = Math.round(window.mainPin.offsetTop + MainPinHeight);
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.mainPin.style.top = (window.mainPin.offsetTop - shift.y) + 'px';
      window.mainPin.style.left = (window.mainPin.offsetLeft - shift.x) + 'px';
      window.addressInput.setAttribute('value', `${currentX}, ${currentY}`);

      if (currentX <= 0) {
        window.mainPin.style.left = (-window.mainPin.offsetWidth / 2) + 'px';
        window.addressInput.setAttribute('value', `${0}, ${currentY}`);
      } else if (currentX >= window.similarListElement.offsetWidth) {
        window.mainPin.style.left = (window.similarListElement.offsetWidth - window.mainPin.offsetWidth / 2) + 'px';
        window.addressInput.setAttribute('value', `${window.similarListElement.offsetWidth}, ${currentY}`);
      }

      if (currentY <= window.PIN_FIELD_MIN_Y + MainPinHeight) {
        window.mainPin.style.top = `${window.PIN_FIELD_MIN_Y}px`;
        window.addressInput.setAttribute('value', `${currentX}, ${MainPinHeight + window.PIN_FIELD_MIN_Y}`);
      } else if (currentY >= MainPinHeight + window.PIN_FIELD_MIN_Y + window.PIN_FIELD_HEIGHT) {
        window.mainPin.style.top = `${window.PIN_FIELD_MIN_Y + window.PIN_FIELD_HEIGHT}px`;
        window.addressInput.setAttribute('value', `${currentX}, ${MainPinHeight + window.PIN_FIELD_MIN_Y + window.PIN_FIELD_HEIGHT}`);
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
