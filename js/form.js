'use strict';

(function () {
  const MIN_TYPE_PRICE = [0, 1000, 5000, 10000];
  const MIN_TITLE_LENGTH = 30;
  const MAX_TITLE_LENGTH = 100;
  const MAX_PRICE = 1000000;
  const REGULAR_FOR_IMAGES = /\.(jpeg|jpg|png|webp)$/;
  const avatarInput = window.main.adForm.querySelector('#avatar');
  const imagesInput = window.main.adForm.querySelector('#images');
  const titleInput = window.main.adForm.querySelector('#title');
  const typeInput = window.main.adForm.querySelector('#type');
  const priceInput = window.main.adForm.querySelector('#price');
  const timeInInput = window.main.adForm.querySelector('#timein');
  const timeOutInput = window.main.adForm.querySelector('#timeout');
  const roomNumberInput = window.main.adForm.querySelector('#room_number');
  const roomNumberOneHundred = roomNumberInput.querySelector('option[value = "100"]');
  const capacityInput = window.main.adForm.querySelector('#capacity');
  const customValidities = {
    title: {
      minLength: `Заголовок должен быть не меньше ${MIN_TITLE_LENGTH} симв.`,
      maxLength: `Заголовок должен быть не больше ${MAX_TITLE_LENGTH} симв.`
    },
    price: `Максимальная цена за ночь не должна превышать ${MAX_PRICE} руб.`,
    capacity: `Измените количество комнат или гостей`,
    images: `Выберите изображение формата "jpeg", "jpg", "webp" или "png"`
  };

  window.form = {
    validateCapacity: function () {
      const capacityValue = Number(capacityInput.value);
      const roomsValue = Number(roomNumberInput.value);
      if ((capacityValue > roomsValue) || (roomsValue === Number(roomNumberOneHundred.value) && capacityValue !== roomsValue)) {
        capacityInput.setCustomValidity(customValidities.capacity);
      } else {
        capacityInput.setCustomValidity('');
      }
      capacityInput.reportValidity();
    },

    validatePicture: function (element) {
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
  };

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

  capacityInput.addEventListener('input', window.form.validateCapacity);
  roomNumberInput.addEventListener('input', window.form.validateCapacity);

  window.form.validatePicture(avatarInput);
  window.form.validatePicture(imagesInput);
})();
