'use strict';

// Константы
var INACTIVE_MAP_CLASS = 'map--faded';
var INACTIVE_FORM_CLASS = 'ad-form--disabled';
var INVALID_FIELD_CLASS = 'invalid-field';
var ESC_KEYCODE = 27;
var ADS_AMOUNT = 8;

// Переменные, связанные с узлами
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');
var cardBlock = document.querySelector('#card').content.querySelector('.map__card');
var adsList;
var adsClassesList;

// Переменные, связанные с формами
var filterForm = mapFilters.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var adFormTitle = adForm.querySelector('#title');
var adFormAddress = adForm.querySelector('#address');
var adFormRooms = adForm.querySelector('#room_number');
var adFormGuests = adForm.querySelector('#capacity');
var adFormPrice = adForm.querySelector('#price');
var adFormType = adForm.querySelector('#type');
var adFormTimeIn = adForm.querySelector('#timein');
var adFormTimeOut = adForm.querySelector('#timeout');

/**
 * Функция, проверяющая, есть ли
 * у элемента соответствующий родитель
 *
 * @param {Node} parent
 * @param {Node} element
 * @return {boolean}
 */
var checkParentNode = function (parent, element) {
  var desirableParent = parent;
  var currentElement = element;
  var isEqual = false;
  while (currentElement.parentNode) {
    if (currentElement.parentNode === desirableParent) {
      isEqual = true;
      break;
    }
    currentElement = currentElement.parentNode;
  }
  return isEqual;
};

/**
 * @callback addedCallback
 */

/**
 * Функция-обработчик, вызывающая
 * callback при клике вне элемента
 *
 * @param {Event} evt
 * @param {Element} element
 * @param {addedCallback} callback
 */
var outsideClickHandler = function (evt, element, callback) {
  var target = evt.target;
  if (target !== element && !checkParentNode(element, target)) {
    callback();
  }
};

/**
 * @callback addedCallback
 */

/**
 * Функция-обработчик, вызывающая
 * callback при нажатии ESC
 *
 * @param {Event} evt
 * @param {addedCallback} callback
 */
var escPressHandler = function (evt, callback) {
  if (evt.keyCode === ESC_KEYCODE) {
    callback();
  }
};

/**
 * Соответствие типа проживания минимальной цене
 *
 * @typedef {Object} adMinValueMap
 * @property {number} palace
 * @property {number} flat
 * @property {number} house
 * @property {number} bungalo
 */
var adMinValueMap = {
  'palace': 10000,
  'flat': 1000,
  'house': 5000,
  'bungalo': 0
};

/**
 * Соответствие количества комнат
 * количеству гостей
 *
 * @typedef {Object} adCapacityMap
 * @property {number[]} 1
 * @property {number[]} 2
 * @property {number[]} 3
 * @property {number[]} 100
 */
var adCapacityMap = {
  '1': [1],
  '2': [1, 2],
  '3': [1, 2, 3],
  '100': [0]
};

/**
 * Параметры обычной метки
 *
 * @typedef {Object} PinData
 * @property {number} WIDTH
 * @property {number} HEIGHT
 * @property {Node} BLOCK
 */
var PinData = {
  WIDTH: 50,
  HEIGHT: 70,
  BLOCK: document.querySelector('#pin').content.querySelector('.map__pin'),
  ACTIVE_CLASS: 'map__pin--active'
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
 * @typedef {Object} LocationX
 * @property {number}
 * @property {number}
 */

/**
 * @typedef {Object} LocationY
 * @property {number}
 * @property {number}
 */

/**
 * Границы отрисовки пинов
 *
 * @typedef {Object} LocationData
 * @property {LocationX} X
 * @property {LocationY} Y
 */
var LocationData = {
  X: {
    MIN: 100,
    MAX: mapPins.offsetWidth - 100
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};

/**
 * Данные о аватаре
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
 * Генерация случайного числа
 *
 * @param {number} min
 * @param {number} max
 * @param {boolean} include Включать или нет правую границу
 * @return {number}
 */
var getRandomNumber = function (min, max, include) {
  var withInclude = Math.floor(Math.random() * (max - min + 1) + min);
  var withoutInclude = Math.floor(Math.random() * (max - min) + min);
  return include ? withInclude : withoutInclude;
};

/**
 * Функция, возвращающее слово в
 * соответствующем числе
 *
 * @param {number} number
 * @param {string[]} options
 * @return {string}
 * @example
 *
 * makePlural(5, ['комната', 'комнаты', 'комнат']);
 * // return 'комнат';
 */
var makePlural = function (number, options) {
  var firstDigit = number % 10;
  var secondDigit = Math.floor(number / 10) % 10;

  if (secondDigit !== 1) {
    if (firstDigit === 1) {
      return options[0];
    } else if ((firstDigit >= 2 && firstDigit <= 4)) {
      return options[1];
    }
    return options[2];
  }
  return options[2];
};

/**
 * Перетасовка массива по алгоритму Фишера-Йетса
 *
 * @param {Array} array
 * @return {Array}
 */
var shuffleArray = function (array) {
  var tempArray = array.slice();
  var tempValue;
  var currentIndex;
  var arrayLength = tempArray.length;
  for (var i = arrayLength - 1; i > 0; i--) {
    currentIndex = Math.floor(Math.random() * (i + 1));
    tempValue = tempArray[i];
    tempArray[i] = tempArray[currentIndex];
    tempArray[currentIndex] = tempValue;
  }
  return tempArray;
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
  var randomLocationX = getRandomNumber(LocationData.X.MIN, LocationData.X.MAX, true);
  var randomLocationY = getRandomNumber(LocationData.Y.MIN, LocationData.Y.MAX, true);
  var randomRooms = getRandomNumber(OfferData.Room.MIN, OfferData.Room.MAX, true);
  var randomGuests = getRandomNumber(OfferData.Room.MIN, randomRooms, true);
  var randomDate = OfferData.DATES[getRandomNumber(0, OfferData.DATES.length, false)];

  return {
    'author': {
      'avatar': AvatarData.URL + index + AvatarData.EXT
    },

    'offer': {
      'title': OfferData.TITLES[index],
      'address': randomLocationX + ', ' + randomLocationY,
      'price': getRandomNumber(OfferData.Price.MIN, OfferData.Price.MAX, true),
      'type': shuffleArray(OfferData.TYPES)[getRandomNumber(0, OfferData.TYPES.length, false)],
      'rooms': getRandomNumber(OfferData.Room.MIN, OfferData.Room.MAX, true),
      'guests': randomGuests,
      'checkin': randomDate,
      'checkout': randomDate,
      'features': OfferData.FEATURES.slice(0, getRandomNumber(0, OfferData.FEATURES.length, false)),
      'description': '',
      'photos': shuffleArray(OfferData.PHOTOS)
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
 * Функция рендеринга фич объявления
 *
 * @param {Object} ad Объявление
 * @param {ParentNode} featuresNode Узел фич
 */
var renderAdFeatures = function (ad, featuresNode) {
  var currentFeatures = ad['offer']['features'];
  var featuresArray = [].slice.call(featuresNode.children);
  if (currentFeatures.length < featuresNode.childElementCount) {
    for (var k = currentFeatures.length; k < featuresNode.childElementCount; k++) {
      featuresNode.removeChild(featuresNode.children[k]);
    }
  }
  featuresArray.forEach(function (item, index) {
    item.textContent = currentFeatures[index];
  });
};

/**
 * Функция рендеринга фото объявления
 *
 * @param {Object} ad Объявление
 * @param {Element} photosNode Узел фотографий
 */
var renderAdPhotos = function (ad, photosNode) {
  var currentPhotos = ad['offer']['photos'];
  var currentAdPhoto = photosNode.children[0];
  photosNode.innerHTML = '';
  var photosFragment = document.createDocumentFragment();
  currentPhotos.forEach(function (item, index) {
    var tempAdPhoto = currentAdPhoto.cloneNode(true);
    tempAdPhoto.src = currentPhotos[index];
    photosFragment.appendChild(tempAdPhoto);
  });
  photosNode.appendChild(photosFragment);
};

/**
 * Функция рендеринга карточки объявления
 * на основе шаблона
 *
 * @param {Object} ad Объявление
 * @return {Node}
 */
var renderAdCard = function (ad) {
  var adCard = cardBlock.cloneNode(true);
  adCard.querySelector('.popup__avatar').src = ad['author']['avatar'];
  adCard.querySelector('.popup__title').textContent = ad['offer']['title'];
  adCard.querySelector('.popup__text--address').textContent = ad['offer']['address'];
  adCard.querySelector('.popup__text--price').textContent = ad['offer']['price'] + '\u20bd/ночь.';
  adCard.querySelector('.popup__type').textContent = OfferData.typesMap[ad['offer']['type']];
  adCard.querySelector('.popup__text--time').textContent = 'Заезд после ' +
    ad['offer']['checkin'] + ', выезд до ' + ad['offer']['checkout'];

  var pluralRoomsAmount = makePlural(ad['offer']['rooms'], OfferData.ROOMS_PLURAL);
  var pluralGuestsAmount = makePlural(ad['offer']['guests'], OfferData.GUESTS_PLURAL);
  adCard.querySelector('.popup__text--capacity').textContent = ad['offer']['rooms'] + ' ' +
    pluralRoomsAmount + ' для ' + ad['offer']['guests'] + ' ' + pluralGuestsAmount;

  var adCardDescription = adCard.querySelector('.popup__description');
  if (!ad['offer']['description']) {
    adCard.removeChild(adCardDescription);
  } else {
    adCardDescription.textContent = ad['offer']['description'];
  }

  var adCardFeatures = adCard.querySelector('.popup__features');
  if (ad['offer']['features'].length) {
    renderAdFeatures(ad, adCardFeatures);
  } else {
    adCard.removeChild(adCardFeatures);
  }

  var adCardPhotos = adCard.querySelector('.popup__photos');
  if (ad['offer']['photos'].length) {
    renderAdPhotos(ad, adCardPhotos);
  } else {
    adCard.removeChild(adCardPhotos);
  }

  return adCard;
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
  this.data = ad;

  // Пин объявления
  this.renderPin = renderAdPin(ad);

  // Карточка объявления
  this.renderAd = renderAdCard(ad);

  var closeButton = this.renderAd.querySelector('.popup__close');
  var adFragment = document.createDocumentFragment();
  var self = this;

  /**
   * Функция показа карточки объявления
   */
  var showCard = function () {
    adFragment.appendChild(self.renderAd);
    map.insertBefore(adFragment, mapFilters);
    document.addEventListener('keydown', cardEscPressHandler);
    document.addEventListener('mouseup', cardClickOutHandler);
  };

  /**
   * Функция закрытия карточки объявления
   *
   * @param {Node} element
   */
  var closeCard = function (element) {
    map.removeChild(element);
    self.renderPin.classList.remove(PinData.ACTIVE_CLASS);
    document.removeEventListener('keydown', cardEscPressHandler);
    document.removeEventListener('mouseup', cardClickOutHandler);
  };

  /**
   * Функция-обработчик, закрывающая
   * окно карты при нажатии клавиши ESC
   *
   * @param {Event} evt
   */
  var cardEscPressHandler = function (evt) {
    escPressHandler(evt, function () {
      closeCard(self.renderAd);
    });
  };

  /**
   * Функция-обработчик, закрывающая
   * окно карты при нажатии (клике)
   * вне объявления
   * @param {Event} evt
   */
  var cardClickOutHandler = function (evt) {
    outsideClickHandler(evt, self.renderAd, function () {
      closeCard(self.renderAd);
    });
  };

  /**
   * Функция-обработчик, которая
   * осуществляет показ соответствующего
   * текущему пину объявления
   */
  var pinClickHandler = function () {
    var previousAd = mapFilters.previousElementSibling;
    self.renderPin.classList.add(PinData.ACTIVE_CLASS);
    if (previousAd.classList.contains('map__card')) {
      closeCard(previousAd);
    }
    showCard();
  };

  /**
   * Функция-обработчик, которая
   * осуществляет закрытие карточки
   * при клике на крест
   */
  var cardClickHandler = function () {
    closeCard(self.renderAd);
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

/**
 * Функция отрисовки пинов
 * (в DocumentFragment)
 *
 * @param {number} amount
 * @param {Object[]} data
 * @return {DocumentFragment}
 */
var renderPins = function (amount, data) {
  var pinsFragment = document.createDocumentFragment();
  for (var j = 0; j < amount; j++) {
    pinsFragment.appendChild(data[j].renderPin);
  }
  return pinsFragment;
};

/**
 * Функция, устанавливающая соответствующее
 * число гостей выбранному числу комнат
 *
 * @param {Element} room
 * @param {Element} guest
 */
var setGuests = function (room, guest) {
  var selectedGuestsOptions = guest.children;

  [].slice.call(selectedGuestsOptions).forEach(function (item) {
    item.disabled = !~adCapacityMap[room.value].indexOf(+item.value) ? true : false;
  });
  guest.value = ~adCapacityMap[room.value].indexOf(+guest.value)
    ? guest.value
    : adCapacityMap[room.value][0];
};

/**
 * Функция-обработчик, меняющая
 * минимальную цену за ночь в зависимости
 * от типа жилья
 */
var formTypeChangeHandler = function () {
  var selectedValue = adFormType.value;
  var minValue = adMinValueMap[selectedValue];
  adFormPrice.min = minValue;
  adFormPrice.placeholder = minValue.toString();
};

/**
 * Функция-обработчик, проверяющая
 * количество введенных символов
 * в поле заголовка формы (объявления)
 *
 * @param {Event} evt
 */
var formTitleInputHandler = function (evt) {
  var target = evt.target;
  var inputSymbols = target.value.length;
  var inputSymbolsMessage = '. Введено символов: ' + inputSymbols;
  if (target.validity.tooShort) {
    target.setCustomValidity('Минимальное количество символов: ' + target.minLength + inputSymbolsMessage);
  } else if (target.validity.tooLong) {
    target.setCustomValidity('Максимальное количество символов: ' + target.maxLength + inputSymbolsMessage);
  } else {
    target.setCustomValidity('');
  }
};

/**
 * Функция, изменяющая значение
 * "другого" поля на значение текущего
 *
 * @param {Element} current
 * @param {Element} opposite
 */
var changeValue = function (current, opposite) {
  opposite.value = current.value;
};

/**
 * Функция, которая подсвечивает невалидное поле формы
 *
 * @param {Element} field
 */
var highlightInvalidField = function (field) {
  field.classList.add(INVALID_FIELD_CLASS);
};

/**
 * Функция, которая убирает подсветку
 * невалидного поля формы
 *
 * @param {Element} field
 */
var unHighlightInvalidField = function (field) {
  field.classList.remove(INVALID_FIELD_CLASS);
};

/**
 * Функция-обработчик, проверяющая
 * поля формы на валидность (подсветка)
 *
 * @param {Event} evt
 */
var formInvalidHandler = function (evt) {
  var target = evt.target;
  if (target) {
    highlightInvalidField(target);
  } else {
    unHighlightInvalidField(target);
  }

  target.addEventListener('change', function () {
    if (target.checkValidity()) {
      unHighlightInvalidField(target);
    }
  });
};

/**
 * Функция-обработчик, синхронизирующая
 * время отъезда гостей
 */
var timeOutChangeHandler = function () {
  changeValue(adFormTimeOut, adFormTimeIn);
};

/**
 * Функция-обработчик, синхронизирующая
 * время въезда гостей
 */
var timeInChangeHandler = function () {
  changeValue(adFormTimeIn, adFormTimeOut);
};

/**
 * Функция-обработчик, вызывающая
 * функцию, которая устанавливает
 * соответствующее число гостей
 * данному числу комнат
 */
var selectChangeHandler = function () {
  setGuests(adFormRooms, adFormGuests);
};

/**
 * Функция добавления обработчиков
 * на элементы формы объявления
 */
var addEventListeners = function () {
  // Валидация заголовка объявления
  adFormTitle.addEventListener('input', formTitleInputHandler);
  // Установка гостей и комнат при событии change
  adFormRooms.addEventListener('change', selectChangeHandler);
  // Время въезда и выезда при событии change
  adFormTimeIn.addEventListener('change', timeInChangeHandler);
  adFormTimeOut.addEventListener('change', timeOutChangeHandler);
  // Установление типа объявления и минимальной цены при событии change
  adFormType.addEventListener('change', formTypeChangeHandler);
  // Валидация полей (добавление и удаление красной рамки)
  adForm.addEventListener('invalid', formInvalidHandler, true);
};

/**
 * Функция активации формы объявления
 */
var activateForm = function () {
  // Активное состояние формы
  adForm.classList.remove(INACTIVE_FORM_CLASS);
  // Включаем форму объявления (удаляем атрибут disabled у полей)
  enableFormChildren(adForm);
  // Добавление всех обработчиков
  addEventListeners();
  // Изменение значения адреса
  adFormAddress.value = (MainPinData.getLocation().X + MainPinData.WIDTH / 2) + ', ' +
    (MainPinData.getLocation().Y + MainPinData.HEIGHT + MainPinData.ARROW_HEIGHT);
};

/**
 * Функция-обработчик, осуществляющая
 * перевод страницы в активное состояние
 */
var mainPinMouseUpHandler = function () {
  // Активное состояние карты
  map.classList.remove(INACTIVE_MAP_CLASS);
  // Активация формы объявления
  activateForm();
  // Включаем форму фильтров (удаляем атрибут disabled у полей)
  enableFormChildren(filterForm);
  // Массив объектов на основе конструктора Ad
  adsClassesList = renderAds(ADS_AMOUNT, adsList);
  // Отрисовка пинов непосредственно в DOM (в блок 'map__pins')
  mapPins.appendChild(renderPins(ADS_AMOUNT, adsClassesList));
  // Удаление обработчика
  MainPinData.BLOCK.removeEventListener('mouseup', mainPinMouseUpHandler);
};

/**
 * Функция перевода в неактивное состояние
 * элементов формы
 *
 * @param {Element} element Узел формы
 */
var disableFormChildren = function (element) {
  [].slice.call(element.children).forEach(function (item) {
    item.setAttribute('disabled', '');
  });
};

/**
 * Функция перевода в активное состояние
 * элементов формы
 *
 * @param {Element} element Узел формы
 */
var enableFormChildren = function (element) {
  [].slice.call(element.children).forEach(function (item) {
    item.removeAttribute('disabled');
  });
};

// Список объектов объявлений
adsList = renderAdsObjects(ADS_AMOUNT);

// Выключение форм
disableFormChildren(filterForm);
disableFormChildren(adForm);

// Начальная установка соответствующего количества гостей
setGuests(adFormRooms, adFormGuests);

// Начальное установление типа объявления и минимальной цены
formTypeChangeHandler();

// Начальная установка значения адреса
adFormAddress.value = (MainPinData.getLocation().X + MainPinData.WIDTH / 2) + ', ' +
  (MainPinData.getLocation().Y + MainPinData.HEIGHT / 2);

// Включение активного режима и "отрисовка всего"
MainPinData.BLOCK.addEventListener('mouseup', mainPinMouseUpHandler);
