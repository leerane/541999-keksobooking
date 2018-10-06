'use strict';

/**
 * Модуль, генерирующий искусственные данные
 */
(function () {

  // Вспомогательные переменные
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');

  /**
   * @typedef {Object} Price
   * @property {number} MIN
   * @property {number} MAX
   */

  /**
   * @typedef {Object} Room
   * @property {number} MIN
   * @property {number} MAX
   */

  /**
   * @typedef {Object} typesMap
   * @property {string} palace
   * @property {string} flat
   * @property {string} house
   * @property {string} bungalo
   */

  /**
   * Искусственные данные
   *
   * @typedef {Object} OfferData
   * @property {Price}
   * @property {Room}
   * @property {string[]} TITLES
   * @property {string[]} TYPES
   * @property {typesMap}
   * @property {string[]} ROOMS_PLURAL
   * @property {string[]} GUESTS_PLURAL
   * @property {string[]} DATES
   * @property {string[]} FEATURES
   * @property {string[]} PHOTOS
   */
  var OfferData = {
    Price: {
      MIN: 10,
      MAX: 1000000
    },
    Room: {
      MIN: 1,
      MAX: 5
    },
    TITLES: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],
    TYPES: [
      'palace',
      'flat',
      'house',
      'bungalo'
    ],
    typesMap: {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    },
    ROOMS_PLURAL: [
      'комната',
      'комнаты',
      'комнат'
    ],
    GUESTS_PLURAL: [
      'гостя',
      'гостей',
      'гостей'
    ],
    DATES: [
      '12:00',
      '13:00',
      '14:00'
    ],
    FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],
    PHOTOS: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ]
  };

  /**
   * @typedef {Object} MainPinLocation
   * @property {number} X
   * @property {number} Y
   */

  /**
   * Параметры главной метки
   *
   * @typedef {Object} MainPinData
   * @property {number} WIDTH
   * @property {number} HEIGHT
   * @property {Node} BLOCK
   * @property {function():Object} getLocation
   */
  var MainPinData = {
    WIDTH: 65,
    HEIGHT: 65,
    ARROW_HEIGHT: 18,
    BLOCK: document.querySelector('.map__pin--main'),

    /**
     * Получение координат главной метки
     *
     * @return {MainPinLocation}
     */
    getLocation: function () {
      return {
        X: this.BLOCK.offsetLeft,
        Y: this.BLOCK.offsetTop
      };
    }
  };

  /**
   * Границы координат объявлений
   *
   * @typedef {Object} LocationData
   * @property {LocationX} X
   * @property {LocationY} Y
   */
  var LocationData = {
    X: {
      MIN: -MainPinData.WIDTH / 2,
      MAX: mapPins.offsetWidth - MainPinData.WIDTH / 2
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  /**
   * Данные об аватаре
   *
   * @typedef {Object} AvatarData
   * @property {string} URL
   * @property {string} EXT
   */
  var AvatarData = {
    URL: 'img/avatars/user0',
    EXT: '.png'
  };

  /**
   * @typedef {Object} AuthorData
   * @property {string} avatar
   */

  /**
   * @typedef {Object} OfferData
   * @property {string} title
   * @property {string} address
   * @property {number} price
   * @property {string} type
   * @property {number} rooms
   * @property {number} guests
   * @property {string} checkin
   * @property {string} checkout
   * @property {string} features
   * @property {string} description
   * @property {string[]} photos
   */

  /**
   * @typedef {Object} LocationData
   * @property {number} x
   * @property {number} y
   */

  /**
   * @typedef {Object} AdObj
   * @property {AuthorData} author
   */

  /**
   * Создание объекта объявления
   *
   * @param {number} index
   * @return {AdObj}
   */
  var createAdObj = function (index) {
    var randomLocationX = window.utils.getRandomNumber(LocationData.X.MIN, LocationData.X.MAX, true);
    var randomLocationY = window.utils.getRandomNumber(LocationData.Y.MIN, LocationData.Y.MAX, true);
    var randomRooms = window.utils.getRandomNumber(OfferData.Room.MIN, OfferData.Room.MAX, true);
    var randomGuests = window.utils.getRandomNumber(OfferData.Room.MIN, randomRooms, true);
    var randomDate = OfferData.DATES[window.utils.getRandomNumber(0, OfferData.DATES.length, false)];

    return {
      'author': {
        'avatar': AvatarData.URL + index + AvatarData.EXT
      },

      'offer': {
        'title': OfferData.TITLES[index],
        'address': randomLocationX + ', ' + randomLocationY,
        'price': window.utils.getRandomNumber(OfferData.Price.MIN, OfferData.Price.MAX, true),
        'type': window.utils.shuffleArray(OfferData.TYPES)[window.utils.getRandomNumber(0, OfferData.TYPES.length, false)],
        'rooms': window.utils.getRandomNumber(OfferData.Room.MIN, OfferData.Room.MAX, true),
        'guests': randomGuests,
        'checkin': randomDate,
        'checkout': randomDate,
        'features': OfferData.FEATURES.slice(0, window.utils.getRandomNumber(0, OfferData.FEATURES.length, false)),
        'description': '',
        'photos': window.utils.shuffleArray(OfferData.PHOTOS)
      },

      'location': {
        'x': randomLocationX,
        'y': randomLocationY
      }
    };
  };

  /**
   * Генерация массива объявлений-объектов
   *
   * @param {number} amount
   * @return {Object[]}
   */
  var renderAdsObjects = function (amount) {
    var tempArray = [];
    for (var k = 0; k < amount; k++) {
      tempArray.push(createAdObj(k + 1));
    }
    return tempArray;
  };

  // Экспорт
  window.data = {
    renderAdsObjects: renderAdsObjects
  };
})();
