'use strict';

/**
 * Модуль, связанный с фильтрацией объявлений
 */
(function () {

  // Вспомогательные переменные
  var inputData = [];
  var filteredData = [];
  var DATA_AMOUNT = 5;

  // Форма фильтров и ее поля
  var filterForm = document.querySelector('.map__filters');
  var filterFormType = filterForm.querySelector('#housing-type');
  var filterFormPrice = filterForm.querySelector('#housing-price');
  var filterFormRooms = filterForm.querySelector('#housing-rooms');
  var filterFormGuests = filterForm.querySelector('#housing-guests');
  var filterFormFeatures = filterForm.querySelector('#housing-features');

  /**
   * @typedef {Object} low
   * @property {number} MIN
   * @property {number} MAX
   */

  /**
   * @typedef {Object} middle
   * @property {number} MIN
   * @property {number} MAX
   */

  /**
   * @typedef {Object} high
   * @property {number} MIN
   * @property {number} MAX
   */

  /**
   * Соответствие названий ценам
   *
   * @typedef {Object} filterPriceMap
   * @property {low}
   * @property {middle}
   * @property {high}
   */
  var filterPriceMap = {
    'low': {
      MIN: 0,
      MAX: 10000
    },
    'middle': {
      MIN: 10000,
      MAX: 50000
    },
    'high': {
      MIN: 50000,
      MAX: 9999999
    },
  };

  /**
   * Функция, определяющая
   * вид фильтрации
   *
   * @callback optionCallback
   */

  /**
   * Общая функция фильтрации
   * для типа жилья, количества гостей или комнат
   *
   * @param {Element} field Поле формы
   * @param {Object} item Объект
   * @param {string} prop Свойство
   * @return {boolean}
   */
  var filterSelect = function (field, item, prop) {
    return field.value !== 'any'
      ? item['data']['offer'][prop].toString() === field.value
      : true;
  };

  /**
   * Функция, описывающая тип фильтрации для цены
   *
   * @param {Element} field Поле формы
   * @param {Object} item Объект
   * @return {boolean}
   */
  var filterPrice = function (field, item) {
    return field.value !== 'any'
      ? item['data']['offer']['price'] >= filterPriceMap[field.value].MIN &&
      item['data']['offer']['price'] < filterPriceMap[field.value].MAX
      : true;
  };

  /**
   * Функция, описывающая тип фильтрации для фич
   *
   * @param {Element} field Поле формы
   * @param {Object} item Объект
   * @return {boolean}
   */
  var filterFeatures = function (field, item) {
    // Массив ":checked" чекбоксов
    var checkedFeatures = [].slice.call(filterFormFeatures.querySelectorAll('input[type="checkbox"]:checked'));
    var checkedFeaturesValue = checkedFeatures.map(function (item) {
      return item.value
    });

    return checkedFeaturesValue
      ? checkedFeaturesValue.every(function (element) {
          return ~item['data']['offer']['features'].indexOf(element);
        })
      : true;
  };

  /**
   * Функция-оработчик, реагирующая
   * на событие "change" на форме
   */
  var filterFormChangeHandler = function () {

    // Берем исходные данные и помещаем в новый массив
    filteredData = inputData.slice();

    // Фильтрация типа жилья
    filteredData = filteredData.filter(function (item) {
      return filterSelect(filterFormType, item, 'type');
    });
    // Фильтрация цены
    filteredData = filteredData.filter(function (item) {
      return filterPrice(filterFormPrice, item);
    });
    // Фильтрация количества комнат
    filteredData = filteredData.filter(function (item) {
      return filterSelect(filterFormRooms, item, 'rooms');
    });
    // Фильтрация количества гостей
    filteredData = filteredData.filter(function (item) {
      return filterSelect(filterFormGuests, item, 'guests');
    });
    // Фильтрация фич
    filteredData = filteredData.filter(function (item) {
      return filterFeatures(filterFormFeatures, item);
    });

    // Удаление карточки объявления (если она есть)
    if (window.accommodation.current) {
      window.accommodation.current.closeCard();
    }
    // Удаление существующих пинов
    window.pin.delete();
    // Отрисовка пинов непосредственно в DOM
    window.pin.append(filteredData, DATA_AMOUNT);
  };

  /**
   * Функция активации формы фильтров
   */
  var activateForm = function (data) {
    // При активации формы копируем массив объектов-конструкторов
    inputData = data.slice();
    // Включаем форму фильтров (удаляем атрибут disabled у полей)
    window.utils.enableFormChildren(filterForm);
    // Устанавливаем начальную проверку
    filterFormChangeHandler();
    // Добавление главного обработчика
    filterForm.addEventListener('change', filterFormChangeHandler);
  };

  /**
   * Функция деактивации формы фильтров
   */
  var deactivateForm = function () {
    // Ресет формы
    filterForm.reset();
    // Выключаем форму фильтров (добавляем атрибут disabled полям)
    window.utils.disableFormChildren(filterForm);
    // Удаление главного обработчика
    filterForm.removeEventListener('change', filterFormChangeHandler);
  };

  // Изначально выключаем форму объявления
  deactivateForm();

  // Экспорт
  window.filter = {
    activate: activateForm,
    deactivate: deactivateForm
  }
})();
