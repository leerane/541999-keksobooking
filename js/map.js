'use strict';

// Переменные, связанные с узлами
var template = document.querySelector('#map-elements');
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');
var INACTIVE_MAP_CLASS = 'map--faded';
var cardBlock = document.querySelector('#card').content.querySelector('.map__card');
var ESC_KEYCODE = 27;
var accommodationsList;
var accommodationsClassesList;
var accommodationsAmount;
var mapPinsList;
var mapPinsCard;

// Переменные, связанные с формами
var INACTIVE_FORM_CLASS = 'ad-form--disabled';
var INVALID_FIELD_CLASS = 'invalid-field';
var filterForm = mapFilters.querySelector('.map__filters');
var accommodationForm = document.querySelector('.ad-form');
var accommodationFormTitle = accommodationForm.querySelector('#title');
var accommodationFormAddress = accommodationForm.querySelector('#address');
var accommodationFormRooms = accommodationForm.querySelector('#room_number');
var accommodationFormGuests = accommodationForm.querySelector('#capacity');
var accommodationFormPrice = accommodationForm.querySelector('#price');
var accommodationFormType = accommodationForm.querySelector('#type');
var accommodationFormTimeIn = accommodationForm.querySelector('#timein');
var accommodationFormTimeOut = accommodationForm.querySelector('#timeout');

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
 * @typedef {Object} accommodationMinValueMap
 * @property {number} palace
 * @property {number} flat
 * @property {number} house
 * @property {number} bungalo
 */
var accommodationMinValueMap = {
  'palace': 10000,
  'flat': 1000,
  'house': 5000,
  'bungalo': 0
};

/**
 * Соответствие количества комнат
 * количеству гостей
 *
 * @typedef {Object} accommodationCapacityMap
 * @property {number[]} 1
 * @property {number[]} 2
 * @property {number[]} 3
 * @property {number[]} 100
 */
var accommodationCapacityMap = {
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
    }
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
  return include ? withInclude :  withoutInclude;
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
 * Функция, возвращающее слово в
 * соответствующем числе для
 * родительного падежа
 *
 * @param {number} number
 * @param {string[]} options
 * @return {string}
 * @example
 *
 * makePlural(2, ['гостя', 'гостей']);
 * // returns 'гостей';
 */
var makePluralGuests = function (number, options) {
  var firstDigit = number % 10;
  var secondDigit = Math.floor(number / 10) % 10;

  if (secondDigit !== 1) {
    if (firstDigit === 1) {
      return options[0];
    }
    return options[1];
  }
  return options[1];
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
 * @typedef {Object} AccommodationObj
 * @property {AuthorData} author
 */

/**
 * Создание объекта объявления
 *
 * @param {number} index
 * @return {AccommodationObj}
 */
var createAccommodationObj = function (index) {
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
var renderAccommodationsObjects = function (amount) {
  var tempArray = [];
  for (var k = 0; k < amount; k++) {
    tempArray.push(createAccommodationObj(k + 1));
  }
  return tempArray;
};

/**
 * Функция рендеринга пина
 *
 * @param {Object} accommodation Объявление
 * @return {Node}
 */
var renderAccommodationPin = function (accommodation) {
  var currentPin = PinData.BLOCK.cloneNode(true);
  var currentPinImg = currentPin.querySelector('img');
  currentPin.style.left = accommodation['location']['x'] - PinData.WIDTH / 2 + 'px';
  currentPin.style.top = accommodation['location']['y'] - PinData.HEIGHT + 'px';
  currentPinImg.src = accommodation['author']['avatar'];
  currentPinImg.alt = accommodation['author']['title'];
  return currentPin;
};

/**
 * Функция рендеринга фич объявления
 *
 * @param {Object} accommodation Объявление
 * @param {ParentNode} featuresNode Узел фич
 */
var renderAccommodationFeatures = function (accommodation, featuresNode) {
  var currentFeatures = accommodation['offer']['features'];
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
 * @param {Object} accommodation Объявление
 * @param {Element} photosNode Узел фотографий
 */
var renderAccommodationPhotos = function (accommodation, photosNode) {
  var currentPhotos = accommodation['offer']['photos'];
  var currentAccommodationPhoto = photosNode.children[0];
  photosNode.innerHTML = '';
  var photosFragment = document.createDocumentFragment();
  currentPhotos.forEach(function (item, index) {
    var tempAccommodationPhoto = currentAccommodationPhoto.cloneNode(true);
    tempAccommodationPhoto.src = currentPhotos[index];
    photosFragment.appendChild(tempAccommodationPhoto);
  });
  photosNode.appendChild(photosFragment);
};

/**
 * Функция рендеринга карточки объявления
 * на основе шаблона
 *
 * @param {Object} accommodation Объявление
 * @return {Node}
 */
var renderAccommodationCard = function (accommodation) {
  var accommodationCard = cardBlock.cloneNode(true);
  accommodationCard.querySelector('.popup__avatar').src = accommodation['author']['avatar'];
  accommodationCard.querySelector('.popup__title').textContent = accommodation['offer']['title'];
  accommodationCard.querySelector('.popup__text--address').textContent = accommodation['offer']['address'];
  accommodationCard.querySelector('.popup__text--price').textContent = accommodation['offer']['price'] + '\u20bd/ночь.';
  accommodationCard.querySelector('.popup__type').textContent = OfferData.typesMap[accommodation['offer']['type']];
  accommodationCard.querySelector('.popup__text--time').textContent = 'Заезд после ' +
    accommodation['offer']['checkin'] + ', выезд до ' + accommodation['offer']['checkout'];

  var pluralRoomsAmount = makePlural(accommodation['offer']['rooms'], OfferData.ROOMS_PLURAL);
  var pluralGuestsAmount = makePluralGuests(accommodation['offer']['guests'], OfferData.GUESTS_PLURAL);
  accommodationCard.querySelector('.popup__text--capacity').textContent = accommodation['offer']['rooms'] + ' ' +
    pluralRoomsAmount + ' для ' + accommodation['offer']['guests'] + ' ' + pluralGuestsAmount;

  var accommodationCardDescription = accommodationCard.querySelector('.popup__description');
  if (!accommodation['offer']['description']) {
    accommodationCard.removeChild(accommodationCardDescription);
  } else {
    accommodationCardDescription.textContent = accommodation['offer']['description'];
  }

  var accommodationCardFeatures = accommodationCard.querySelector('.popup__features');
  if (accommodation['offer']['features'].length !== 0) {
    renderAccommodationFeatures(accommodation, accommodationCardFeatures);
  } else {
    accommodationCard.removeChild(accommodationCardFeatures);
  }

  var accommodationCardPhotos = accommodationCard.querySelector('.popup__photos');
  if (accommodation['offer']['photos'].length !== 0) {
    renderAccommodationPhotos(accommodation, accommodationCardPhotos);
  } else {
    accommodationCard.removeChild(accommodationCardPhotos);
  }

  return accommodationCard;
};

/**
 * Конструктор объекта-объявления,
 * который содержит информацию о
 * самом объявлении, узлы пина и
 * карточки объявлени, а также
 * обработчики
 *
 * @param {Object} accommodation Объявление
 * @constructor
 */
var Accommodation = function (accommodation) {
  this.data = accommodation;

  // Пин объявления
  this.renderPin = renderAccommodationPin(accommodation);

  // Карточка объявления
  this.renderAd = renderAccommodationCard(accommodation);

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
    this.classList.add(PinData.ACTIVE_CLASS);
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
 * (на основе конструктора Accommodation
 * и массива объектов-объявлений)
 *
 * @param {number} amount
 * @param {Object[]} data
 * @return {Object[]}
 */
var renderAccommodations = function (amount, data) {
  var tempArray = [];
  for (var i = 0; i < amount; i++) {
    tempArray.push(new Accommodation(data[i]));
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
    if (!~accommodationCapacityMap[room.value].indexOf(+item.value)) {
      item.setAttribute('disabled', '');
    } else {
      item.removeAttribute('disabled');
    }
  });
  guest.value = ~accommodationCapacityMap[room.value].indexOf(+guest.value) ? guest.value : accommodationCapacityMap[room.value][0];
};

/**
 * Функция-обработчик, меняющая
 * минимальную цену за ночь в зависимости
 * от типа жилья
 */
var formTypeChangeHandler = function () {
  var selectedValue = accommodationFormType.value;
  var minValue = accommodationMinValueMap[selectedValue];
  accommodationFormPrice.min = minValue;
  accommodationFormPrice.placeholder = minValue.toString();
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
  changeValue(accommodationFormTimeOut, accommodationFormTimeIn);
};

/**
 * Функция-обработчик, синхронизирующая
 * время въезда гостей
 */
var timeInChangeHandler = function () {
  changeValue(accommodationFormTimeIn, accommodationFormTimeOut);
};

/**
 * Функция-обработчик, вызывающая
 * функцию, которая устанавливает
 * соответствующее число гостей
 * данному числу комнат
 */
var selectChangeHandler = function () {
  setGuests(accommodationFormRooms, accommodationFormGuests);
};

/**
 * Функция добавления обработчиков
 * на элементы формы объявления
 */
var addEventListeners = function () {
  // Валидация заголовка объявления
  accommodationFormTitle.addEventListener('input', formTitleInputHandler);
  // Установка гостей и комнат при событии change
  accommodationFormRooms.addEventListener('change', selectChangeHandler);
  // Время въезда и выезда при событии change
  accommodationFormTimeIn.addEventListener('change', timeInChangeHandler);
  accommodationFormTimeOut.addEventListener('change', timeOutChangeHandler);
  // Установление типа объявления и минимальной цены при событии change
  accommodationFormType.addEventListener('change', formTypeChangeHandler);
  // Валидация полей (добавление и удаление красной рамки)
  accommodationForm.addEventListener('invalid', formInvalidHandler, true);
};

/**
 * Функция удаления обработчиков
 * с элементов формы
 */
var removeEventListeners = function () {
  // Валидация заголовка объявления
  accommodationFormTitle.removeEventListener('input', formTitleInputHandler);
  // Установка гостей и комнат при событии change
  accommodationFormRooms.removeEventListener('change', selectChangeHandler);
  // Время въезда и выезда при событии change
  accommodationFormTimeIn.removeEventListener('change', timeInChangeHandler);
  accommodationFormTimeOut.removeEventListener('change', timeOutChangeHandler);
  // Установление типа объявления и минимальной цены при событии change
  accommodationFormType.removeEventListener('change', formTypeChangeHandler);
  // Валидация полей (добавление и удаление красной рамки)
  accommodationForm.removeEventListener('invalid', formInvalidHandler, true);
};

/**
 * Функция активации формы объявления
 */
var activateForm = function () {
  // Активное состояние формы
  accommodationForm.classList.remove(INACTIVE_FORM_CLASS);
  // Включаем форму объявления (удаляем атрибут disabled у полей)
  enableFormChildren(accommodationForm);
  // Добавление всех обработчиков
  addEventListeners();
  // Изменение значения адреса
  accommodationFormAddress.value = (MainPinData.getLocation().X + MainPinData.WIDTH / 2) + ', ' +
    (MainPinData.getLocation().Y + MainPinData.HEIGHT + MainPinData.ARROW_HEIGHT);
};

/**
 * Функция деактивации формы объявления
 */
var deactivateForm = function () {
  // Ресет формы
  accommodationForm.reset();
  // Неактивное состояние формы
  accommodationForm.classList.add(INACTIVE_FORM_CLASS);
  // Выключаем форму объявления (добавляем атрибут disabled полям)
  disableFormChildren(accommodationForm);
  // Удаление всех обработчиков
  removeEventListeners();
  // Возвращаем начальные значения типа объявления и минимальной цены
  formTypeChangeHandler();
  // Возвращаем начальную синхронизацию соответствующего количества гостей
  setGuests(accommodationFormRooms, accommodationFormGuests);
  // Изменение значения адреса (возвращаем начальное)
  accommodationFormAddress.value = (MainPinData.getLocation().X + MainPinData.WIDTH / 2) + ', ' +
    (MainPinData.getLocation().Y + MainPinData.HEIGHT / 2);
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
  // Массив объектов на основе конструктора Accommodation
  accommodationsClassesList = renderAccommodations(accommodationsAmount, accommodationsList);
  // Отрисовка пинов непосредственно в DOM (в блок 'map__pins')
  mapPins.appendChild(renderPins(accommodationsAmount, accommodationsClassesList));
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

// Устанавливаем количество объявлений для отрисовки
accommodationsAmount = 8;

// Список объектов объявлений
accommodationsList = renderAccommodationsObjects(accommodationsAmount);

// Выключение форм
disableFormChildren(filterForm);
disableFormChildren(accommodationForm);

// Начальная установка соответствующего количества гостей
setGuests(accommodationFormRooms, accommodationFormGuests);
// Начальное установление типа объявления и минимальной цены
formTypeChangeHandler();
// Начальная установка значения адреса
accommodationFormAddress.value = (MainPinData.getLocation().X + MainPinData.WIDTH / 2) + ', ' +
  (MainPinData.getLocation().Y + MainPinData.HEIGHT / 2);

// Включение активного режима и "отрисовка всего"
MainPinData.BLOCK.addEventListener('mouseup', mainPinMouseUpHandler);
