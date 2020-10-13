'use strict';

(function () {
  const StatusCode = {
    OK: 200
  };
  const TIMEOUT = 3000;
  const xhr = new XMLHttpRequest();

  window.backend = {
    xhr: xhr,
    load: function (onLoad, onError) {
      const URL = 'https://21.javascript.pages.academy/keksobooking/data';

      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Кексоботы не успели найти вам жильё :(');
      });

      xhr.timeout = TIMEOUT;

      xhr.open('GET', URL);
      xhr.send();
    }

    // save: function (data, onLoad, onError) {
    //   const URL = 'https://21.javascript.pages.academy/code-and-magick';
    //   const xhr = new XMLHttpRequest();
    //
    //   xhr.responseType = 'json';
    //
    //   xhr.addEventListener('load', function () {
    //     if (xhr.status === StatusCode.OK) {
    //       onLoad(xhr.response);
    //     } else {
    //       onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText, 'save');
    //     }
    //   });
    //
    //   xhr.addEventListener('error', function () {
    //     onError('Произошла ошибка соединения', 'save');
    //   });
    //
    //   xhr.addEventListener('timeout', function () {
    //     onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс', 'save');
    //   });
    //
    //   xhr.timeout = TIMEOUT;
    //
    //   xhr.open('POST', URL);
    //   xhr.send(data);
    // }
  };
})();
