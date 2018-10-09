'use strict';

/**
 * Модуль, связанный с генерацией маркера объявления
 */
(function () {

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
   * (в DocumentFragment)
   *
   * @param {number} amount
   * @param {Object[]} data
   * @return {DocumentFragment}
   */
  var appendPins = function (amount, data) {
    var pinsFragment = document.createDocumentFragment();
    for (var j = 0; j < amount; j++) {
      pinsFragment.appendChild(data[j].renderPin);
    }
    return pinsFragment;
  };

  // Экспорт
  window.pin = {
    render: renderAdPin,
    append: appendPins
  };
})();
