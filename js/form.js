'use strict';

/**
 * Модуль, связанный с основной
 * формой объявления
 */
(function () {

  // Вспомогательные переменные
  var photos;
  var avatar;

  // Переменные, связанные с формами
  var INACTIVE_FORM_CLASS = 'ad-form--disabled';
  var INVALID_FIELD_CLASS = 'invalid-field';
  var adForm = document.querySelector('.ad-form');
  var adFormTitle = adForm.querySelector('#title');
  var adFormAddress = adForm.querySelector('#address');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormGuests = adForm.querySelector('#capacity');
  var adFormPrice = adForm.querySelector('#price');
  var adFormType = adForm.querySelector('#type');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormAvatar = adForm.querySelector('#avatar');
  var adFormPhotos = adForm.querySelector('#images');

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
   * Значения адреса
   *
   * @typedef {Object} AddressValue
   * @property {string} INITIAL Начальное значение
   * @property {string} NEW Изменяемое значение
   */
  var AddressValue = {
    INITIAL: (MainPinData.getLocation().X + MainPinData.WIDTH / 2) + ', ' +
    (MainPinData.getLocation().Y + MainPinData.HEIGHT / 2),
    NEW: 0
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
   * Функция, отмечающая валидное
   * или невалидное поле
   *
   * @param {Element} field
   */
  var markupInvalidField = function (field) {
    if (!field.validity.valid) {
      highlightInvalidField(field);
    } else {
      unHighlightInvalidField(field);
    }
  };

  /**
   * Функция-обработчик, осуществляющая
   * "отметку" невалидных полей
   *
   * @param {Event} evt
   */
  var formInvalidHandler = function (evt) {
    markupInvalidField(evt.target);
  };

  /**
   * Функция-обработчик, синхронизирующая
   * время отъезда гостей
   */
  var timeOutChangeHandler = function () {
    window.utils.changeValue(adFormTimeOut, adFormTimeIn);
  };

  /**
   * Функция-обработчик, синхронизирующая
   * время въезда гостей
   */
  var timeInChangeHandler = function () {
    window.utils.changeValue(adFormTimeIn, adFormTimeOut);
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
   * Функция-обработчик, осуществляющая
   * показ аватара при событии "change"
   *
   * @param {Event} evt
   */
  var avatarChangeHandler = function (evt) {
    avatar = new window.PreviewFile({
      multiple: false,
      outputField: '.ad-form-header__preview',
      class: 'ad-form-header__img'
    });

    avatar.uploadFile(evt);
  };

  /**
   * Функция-обработчик, осуществляющая
   * показ фотографий при событии "change"
   *
   * @param {Event} evt
   */
  var photosChangeHandler = function (evt) {
    photos = new window.PreviewFile({
      multiple: true,
      outputField: '.ad-form__photo',
      parentBlock: '.ad-form__photo-container',
      class: 'ad-form__img'
    });

    photos.deleteFiles();
    photos.uploadFile(evt);
  };

  /**
   * Функция очистки формы объявления
   */
  var resetForm = function () {
    // Ресет формы
    adForm.reset();
    // Возвращаем значение адреса
    adFormAddress.value = AddressValue.INITIAL;
    // Возвращаем начальные значения типа объявления и минимальной цены
    formTypeChangeHandler();
    // Возвращаем начальную синхронизацию соответствующего количества гостей
    setGuests(adFormRooms, adFormGuests);
    // Удаляем загруженные изображения и аватар
    if (avatar) {
      avatar.deleteFiles();
    }
    if (photos) {
      photos.deleteFiles();
    }
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
    // Отображение загруженного аватара
    adFormAvatar.addEventListener('change', avatarChangeHandler);
    // Отображение фотографий жилья
    adFormPhotos.addEventListener('change', photosChangeHandler);
  };

  /**
   * Функция удаления обработчиков
   * с элементов формы объявления
   */
  var removeEventListeners = function () {
    // Валидация заголовка объявления
    adFormTitle.removeEventListener('input', formTitleInputHandler);
    // Установка гостей и комнат при событии change
    adFormRooms.removeEventListener('change', selectChangeHandler);
    // Время въезда и выезда при событии change
    adFormTimeIn.removeEventListener('change', timeInChangeHandler);
    adFormTimeOut.removeEventListener('change', timeOutChangeHandler);
    // Установление типа объявления и минимальной цены при событии change
    adFormType.removeEventListener('change', formTypeChangeHandler);
    // Валидация полей (добавление и удаление красной рамки)
    adForm.removeEventListener('invalid', formInvalidHandler, true);
    // Отображение загруженного аватара
    adFormAvatar.removeEventListener('change', avatarChangeHandler);
    // Отображение фотографий жилья
    adFormPhotos.removeEventListener('change', photosChangeHandler);
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
  };

  /**
   * Функция деактивации формы объявления
   */
  var deactivateForm = function () {
    // Ресет формы
    resetForm();
    // Неактивное состояние формы
    adForm.classList.add(INACTIVE_FORM_CLASS);
    // Выключаем форму объявления (добавляем атрибут disabled полям)
    disableFormChildren(adForm);
    // Удаление всех обработчиков
    removeEventListeners();
  };

  // Изначально выключаем форму объявления
  deactivateForm();

  // Экспорт
  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    disableFormChildren: disableFormChildren,
    enableFormChildren: enableFormChildren
  };
})();
