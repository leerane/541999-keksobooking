'use strict';

/**
 * Модуль, связанный с конструктором объявления
 */
(function () {

  // Вспомогательные переменные
  var currentAd = '';
  var map = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters-container');

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
   * Конструктор объекта-объявления,
   * который содержит информацию о
   * самом объявлении, узлы пина и
   * карточки объявлени, а также
   * обработчики
   *
   * @param {Object} ad Объявление
   * @constructor
   */
  var Ad = function (ad) {

    // Данные
    this.data = ad;

    // Пин объявления
    this.renderPin = window.pin.render(ad);

    // Карточка объявления
    this.renderCard = window.card(ad);

    // Вспомогательные переменные
    var closeButton = this.renderCard.querySelector('.popup__close');
    var adFragment = document.createDocumentFragment();
    var self = this;

    /**
     * Функция показа карточки объявления
     */
    this.showCard = function () {
      // Закрываем предыдущую карточку (если есть)
      if (window.accommodation.current) {
        window.accommodation.current.closeCard();
      }
      // Обнуляем внешнюю переменную
      window.accommodation.current = '';
      // Обновляем внешнюю переменную
      window.accommodation.current = self;

      // Отрисовка карточки
      adFragment.appendChild(self.renderCard);
      map.insertBefore(adFragment, mapFilters);
      document.addEventListener('keydown', cardEscPressHandler);
    };

    /**
     * Функция закрытия карточки объявления
     *
     * @param {Node} element
     */
    this.closeCard = function (element) {
      window.accommodation.current = '';
      element = element || self.renderCard;
      map.removeChild(element);
      self.renderPin.classList.remove(PinData.ACTIVE_CLASS);
      document.removeEventListener('keydown', cardEscPressHandler);
    };

    /**
     * Функция-обработчик, закрывающая
     * окно карты при нажатии клавиши ESC
     *
     * @param {Event} evt
     */
    var cardEscPressHandler = function (evt) {
      window.utils.escPressHandler(evt, function () {
        self.closeCard();
      });
    };

    /**
     * Функция-обработчик, которая
     * осуществляет показ соответствующего
     * текущему пину объявления
     */
    var pinClickHandler = function () {
      self.renderPin.classList.add(PinData.ACTIVE_CLASS);
      self.showCard();
    };

    /**
     * Функция-обработчик, которая
     * осуществляет закрытие карточки
     * при клике на крест
     */
    var cardClickHandler = function () {
      self.closeCard();
    };

    this.renderPin.addEventListener('click', pinClickHandler);
    closeButton.addEventListener('click', cardClickHandler);
  };

  /**
   * Функция создания массива объектов
   * (на основе конструктора Ad
   * и массива объектов-объявлений)
   *
   * @param {number} amount
   * @param {Object[]} data
   * @return {Object[]}
   */
  var renderAds = function (amount, data) {
    var tempArray = [];
    for (var i = 0; i < amount; i++) {
      tempArray.push(new Ad(data[i]));
    }
    return tempArray;
  };

  // Экспорт
  window.accommodation = {
    render: renderAds,
    current: currentAd
  };
})();
