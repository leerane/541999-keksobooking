'use strict';

// Константы
var INACTIVE_MAP_CLASS = 'map--faded';

// Переменные, связанные с узлами
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var adList;
var adClassesList;

// Переменные, связанные с формами
var adForm = document.querySelector('.ad-form');
var adFormAddress = adForm.querySelector('#address');
var adFormResetButton = adForm.querySelector('.ad-form__reset');

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
 * Добавляем начальные координаты
 * главного маркера
 *
 * @typedef {Object} InitialLocation
 * @property {number} X
 * @property {number} Y
 */
MainPinData.InitialLocation = {
  X: MainPinData.getLocation().X,
  Y: MainPinData.getLocation().Y
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
 * Функция получения данных с сервера
 * и передачи их модулю фильтрации
 *
 * @param {*} data
 */
var printData = function (data) {
  // Загружаем данные с сервера
  adList = data;
  // Образуем массив объектов
  adClassesList = window.accommodation.render(adList.length, adList);
  // Активация формы фильтров
  window.filter.activate(adClassesList);
};

/**
 * Функция создания блока ошибки
 */
var createErrorBlock = function () {
  var errorModal = new window.Modal({
    template: '#error',
    innerBlock: '.error',
    contentBlock: '.error__message',
    parentBlock: 'body',
    hiddenClass: '',
    disableScroll: true,
    Close: {
      ESC: true,
      OUTSIDE: true,
      BUTTON: '.error__button',
      HIDE: false,
      DELETE: true
    }
  });

  errorModal.show();
  resetAdPage();
};

/**
 * Функция создания блока "success"
 */
var createSuccessBlock = function () {
  var successModal = new window.Modal({
    template: '#success',
    innerBlock: '.success',
    contentBlock: '.success__message',
    parentBlock: 'body',
    hiddenClass: '',
    disableScroll: true,
    Close: {
      ESC: true,
      OUTSIDE: true,
      BUTTON: '',
      HIDE: false,
      DELETE: true
    }
  });

  successModal.show();
  resetAdPage();
};

/**
 * Функция-обработчик, осуществляющая
 * перевод страницы в активное состояние
 */
var mainPinMouseUpHandler = function () {
  // Активное состояние карты
  map.classList.remove(INACTIVE_MAP_CLASS);
  // Загружаем данные с сервера
  window.backend.load(printData, createErrorBlock);
  // Активация формы объявления
  window.form.activate();
  // Удаление обработчика
  MainPinData.BLOCK.removeEventListener('mouseup', mainPinMouseUpHandler);
  // Добавляем обработчик отправки данных формы объявления
  adForm.addEventListener('submit', formSubmitHandler);
  // Добавляем обработчик "очистки" страницы
  adFormResetButton.addEventListener('click', resetButtonClickHandler);
};

/**
 * Функция-обработчик, осуществляющая
 * перевод страницы в неактивное состояние
 */
var resetAdPage = function () {
  // Неактивное состояние карты
  map.classList.add(INACTIVE_MAP_CLASS);
  // Деактивация формы объявления
  window.form.deactivate();
  // Деактивация формы фильтров
  window.filter.deactivate();
  // Удаление пинов
  window.pin.delete();
  // Удаление карточки объявления (если она есть)
  if (window.accommodation.current) {
    window.accommodation.current.closeCard();
  }
  // Возвращаем главный пин в исходное положение
  MainPinData.BLOCK.style.left = MainPinData.InitialLocation.X + 'px';
  MainPinData.BLOCK.style.top = MainPinData.InitialLocation.Y + 'px';
  // Возвращаем обработчик на кнопку
  MainPinData.BLOCK.addEventListener('mouseup', mainPinMouseUpHandler);
  // Удаляем обработчик отправки данных формы объявления
  adForm.removeEventListener('submit', formSubmitHandler);
  // Удаляем обработчик "очистки" страницы
  adFormResetButton.removeEventListener('click', resetButtonClickHandler);
};

/**
 * Функция-обработчик, осуществляющая
 * отправку формы на сервер и вызов cb
 *
 * @param {Event} evt
 */
var formSubmitHandler = function (evt) {
  evt.preventDefault();
  var formData = new FormData(adForm);
  window.backend.upload(formData, createSuccessBlock, createErrorBlock);
};

/**
 * Функция-обработчик, осуществляющая
 * "сбрасывание" страницы в искодное состояние
 *
 * @param {Event} evt
 */
var resetButtonClickHandler = function (evt) {
  evt.preventDefault();
  resetAdPage();
};

// Включение активного режима и "отрисовка всего"
MainPinData.BLOCK.addEventListener('mouseup', mainPinMouseUpHandler);

// Перетаскивание главного маркера
window.dragElement(MainPinData.BLOCK, {
  parentBlock: document.querySelector('.map__pins'),
  direction: 'both',
  outputField: adFormAddress,
  OffsetCoord: {
    X: MainPinData.WIDTH / 2,
    Y: MainPinData.HEIGHT + MainPinData.ARROW_HEIGHT
  },
  AvailableCoord: {
    X: {
      MIN: LocationData.X.MIN,
      MAX: LocationData.X.MAX
    },
    Y: {
      MIN: LocationData.Y.MIN - MainPinData.HEIGHT - MainPinData.ARROW_HEIGHT,
      MAX: LocationData.Y.MAX - MainPinData.HEIGHT - MainPinData.ARROW_HEIGHT,
    }
  }
});
