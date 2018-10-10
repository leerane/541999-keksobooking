'use strict';

/**
 * Модуль, связанный с генерацией маркера объявления
 */
(function () {

  // Вспомогательные элементы
  var appendedPins = [];
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');

  /**
   * Параметры обычной метки
   *
   * @typedef {Object} PinData
   * @property {number} WIDTH
   * @property {number} HEIGHT
   * @property {Node} BLOCK
   * @property {string} ACTIVE_CLASS
   */
  var PinData = {
    WIDTH: 50,
    HEIGHT: 70,
    BLOCK: document.querySelector('#pin').content.querySelector('.map__pin'),
    ACTIVE_CLASS: 'map__pin--active'
  };

  /**
   * Функция рендеринга пина
   *
   * @param {Object} ad Объявление
   * @return {Node}
   */
  var renderAdPin = function (ad) {
    var currentPin = PinData.BLOCK.cloneNode(true);
    var currentPinImg = currentPin.querySelector('img');
    currentPin.style.left = ad['location']['x'] - PinData.WIDTH / 2 + 'px';
    currentPin.style.top = ad['location']['y'] - PinData.HEIGHT + 'px';
    currentPinImg.src = ad['author']['avatar'];
    currentPinImg.alt = ad['author']['title'];
    return currentPin;
  };

  /**
   * Функция отрисовки пинов
   *
   * @param {Object[]} data Массив объектов-конструкторов
   * @param {number} amount
   */
  var appendPins = function (data, amount) {
    var pinsFragment = document.createDocumentFragment();
    data.slice(0, amount).forEach(function (item) {
      pinsFragment.appendChild(item.renderPin);

      // Запоминаем пины
      appendedPins.push(item.renderPin);
    });

    // Добавляем фрагмент в разметку
    mapPins.appendChild(pinsFragment);
  };

  /**
   * Функция удаления пинов
   */
  var deletePins = function () {
    if (appendedPins) {
      appendedPins.forEach(function (item) {
        mapPins.removeChild(item);
      });

      // Обнуляем массив
      appendedPins = [];
    }
  };

  // Экспорт
  window.pin = {
    render: renderAdPin,
    append: appendPins,
    delete: deletePins
  };
})();
