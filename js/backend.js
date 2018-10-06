'use strict';

/**
 * Модуль XHR
 */
(function () {

  // Вспомогательные переменные
  var TIME_OUT = 1000;
  var ServerUrl = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking/'
  };

  /**
   * @callback successCallback
   * @callback errorCallback
   */

  /**
   * Функция создания XHR и соединения
   *
   * @param {string} method
   * @param {string} url
   * @param {*} data
   * @param {successCallback} onSuccess
   * @param {errorCallback} onError
   */
  var createXhr = function (method, url, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = TIME_OUT;

    // Устанавливаем (ограничиваем) тип получаемых данных
    if (method === 'GET') {
      xhr.responseType = 'json';
    }

    // Обработка ошибок до 4xx включительно
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Номер ошибки: ' + xhr.status + '.');
      }
    });

    // Ошибка "задержки"
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });

    // Ошибка соединения
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения ' + xhr.status + '.');
    });

    // Открытие запроса
    xhr.open(method, url, true);

    // Отправка запроса
    xhr.send(data || null);
  };

  // Функции GET и POST запросов
  var loadRequest = function (onSuccess, onError) {
    createXhr('GET', ServerUrl.LOAD, '', onSuccess, onError);
  };

  var uploadRequest = function (data, onSuccess, onError) {
    createXhr('POST', ServerUrl.UPLOAD, data, onSuccess, onError);
  };

  // Экспорт
  window.backend = {
    loadRequest: loadRequest,
    uploadRequest: uploadRequest
  };
})();
