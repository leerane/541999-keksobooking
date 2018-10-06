'use strict';

/**
 * Модуль вспомогательных функций и переменных
 */
(function () {

  // Вспомогательные переменные
  var ESC_KEYCODE = 27;

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
   * Функция, удаляющая определенных детей
   * родительского элемента
   *
   * @param {Node} parent
   * @param {Node} elements
   */
  var removeChildren = function (parent, elements) {
    for (var i = 0; i < elements.length; i++) {
      parent.removeChild(elements[i]);
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
   * Функция, определяющая значения
   * top и left для элемента
   * относительно окна или страницы
   *
   * @param {Element} elem
   * @param {boolean} relative Относительно страницы
   * @return {Object}
   */
  var getCoords = function (elem, relative) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = relative ? box.top + scrollTop - clientTop : box.top;
    var left = relative ? box.left + scrollLeft - clientLeft : box.left;

    return {
      top: top,
      left: left
    };
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
   * Функция глубокого копирования свойств объектов
   *
   * @param {Object} targetObject
   * @param {Object} refObject
   * @return {Object}
   */
  var deepCopy = function (targetObject, refObject) {
    for (var prop in targetObject) {
      if (targetObject.hasOwnProperty(prop)) {
        if (typeof targetObject[prop] === 'object') {
          targetObject[prop] = refObject[prop] ? deepCopy(targetObject[prop], refObject[prop]) : targetObject[prop];
        } else {
          targetObject[prop] = (refObject[prop] || typeof refObject[prop] === 'boolean')
            ? refObject[prop]
            : targetObject[prop];
        }
      }
    }
    return targetObject;
  };

  /**
   * Функция, возвращающая входящее
   * число, если оно в промежутке.
   * В противном случае возвращается
   * одна из заданных границ
   *
   * @param {number} number
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  var conditionalRange = function (number, min, max) {
    return (number < min && min) || (number > max && max) || number;
  };

  /**
   * Функция нахождения тега в родителе
   *
   * @param {Element} parent
   * @param {string} tag
   * @return {Element}
   */
  var findTag = function (parent, tag) {
    var tempElement;

    [].slice.call(parent.children).forEach(function (item) {
      if (item.tagName === tag) {
        tempElement = item;
      }
    });

    return tempElement;
  };

  // Экспорт
  window.utils = {
    getRandomNumber: getRandomNumber,
    makePlural: makePlural,
    shuffleArray: shuffleArray,
    removeChildren: removeChildren,
    escPressHandler: escPressHandler,
    outsideClickHandler: outsideClickHandler,
    getCoords: getCoords,
    changeValue: changeValue,
    deepCopy: deepCopy,
    conditionalRange: conditionalRange,
    findTag: findTag
  };
})();
