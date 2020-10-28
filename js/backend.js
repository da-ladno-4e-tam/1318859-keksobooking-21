'use strict';

const StatusCode = {
  OK: 200
};
const TIMEOUT = 10000;


function load(onLoad, onError) {
  const URL = 'https://21.javascript.pages.academy/keksobooking/data';
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = TIMEOUT;

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

  xhr.open('GET', URL);
  xhr.send();
}

function save(data, onSave, onError) {
  const URL = 'https://21.javascript.pages.academy/keksobooking';
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = TIMEOUT;

  xhr.addEventListener('load', function () {
    if (xhr.status === StatusCode.OK) {
      onSave();

    } else {
      onError();
    }
  });

  xhr.addEventListener('error', function () {
    onError();
  });

  xhr.addEventListener('timeout', function () {
    onError();
  });

  xhr.open('POST', URL);
  xhr.send(data);
}

window.backend = {
  load: load,
  save: save
};
