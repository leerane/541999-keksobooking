'use strict';

/**
 * Модуль, осуществляющий Drag'n'Drop
 * для произвольного элемента
 */
(function () {

  /**
   * Функция Drag'n'Drop
   *
   * @param {Element} element
   * @param {Object} options Входные данные (совпадает с dragOptions)
   */
  var dragElement = function (element, options) {

    /**
     * Доп. координаты, то есть
     * смещение реальных координат
     * элемента на X и Y
     *
     * @typedef {Object} OffsetCoord
     * @param {number} X
     * @param {number} Y
     */

    /**
     * @typedef {Object} X
     * @property {number} MIN
     * @property {number} MAX
     */

    /**
     * @typedef {Object} Y
     * @property {number} MIN
     * @property {number} MAX
     */

    /**
     * @typedef {Object} AvailableCoord
     * @property {X}
     * @property {Y}
     */

    /**
     * Начальные данные
     *
     * @typedef {Object} dragOptions
     * @property {Element} parentBlock Ограничивающий элемент
     * @property {string} direction Направление
     * @property {Element} outputField Поле вывода данных
     * @property {OffsetCoord}
     * @property {AvailableCoord}
     */
    var dragOptions = {
      parentBlock: '',
      direction: 'both',
      outputField: '',
      OffsetCoord: {
        X: 0,
        Y: 0
      },
      AvailableCoord: {
        X: {
          MIN: 0,
          MAX: 0
        },
        Y: {
          MIN: 0,
          MAX: 0
        }
      }
    };

    // Перезаписываем начальные значения
    window.utils.deepCopy(dragOptions, options);

    /**
     * Функция-обработчик, определяющая
     * элемента пина при нажатии мыши
     *
     * @param {Event} downEvt
     */
    var elementMouseDownHandler = function (downEvt) {
      downEvt.preventDefault();

      var self = element;
      var elementCoords = window.utils.getCoords(self, true);
      var parentBlockCoords = window.utils.getCoords(dragOptions.parentBlock, true);

      /**
       * @typedef {Object} ShiftedCoord
       * @property {number} X
       * @property {number} Y
       */
      var ShiftedCoord = {
        X: downEvt.pageX - elementCoords.left,
        Y: downEvt.pageY - elementCoords.top
      };

      // Сохраняем координаты в переменную
      var outputCoords = (elementCoords.left - parentBlockCoords.left + dragOptions.OffsetCoord.X) + ', '
        + (elementCoords.top - parentBlockCoords.top + dragOptions.OffsetCoord.Y);

      // Вывод координат в отдельное поле
      dragOptions.outputField.value = outputCoords;

      /**
       * Функция-обработчик, определяющая
       * положение элемента при движении мыши
       *
       * @param {Event} moveEvt
       */
      var elementMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        /**
         * Координаты "движения", которые
         * смещены на границы родительского блока
         *
         * @typedef {Object} MoveCoord
         * @property {number} X
         * @property {number} Y
         */
        var MoveCoord = {
          X: window.utils.conditionalRange(moveEvt.pageX - ShiftedCoord.X - parentBlockCoords.left,
              dragOptions.AvailableCoord.X.MIN, dragOptions.AvailableCoord.X.MAX),
          Y: window.utils.conditionalRange(moveEvt.pageY - ShiftedCoord.Y - parentBlockCoords.top,
              dragOptions.AvailableCoord.Y.MIN, dragOptions.AvailableCoord.Y.MAX),
        };

        element.style.left = MoveCoord.X + 'px';
        element.style.top = MoveCoord.Y + 'px';

        // Сохраняем координаты в переменную
        outputCoords = (MoveCoord.X + dragOptions.OffsetCoord.X) + ', '
          + (MoveCoord.Y + dragOptions.OffsetCoord.Y);

        // Вывод координат в отдельное поле
        dragOptions.outputField.value = outputCoords;
      };

      /**
       * Функция-обработчик, определяющая
       * положение элемента при отпускании мыши
       *
       * @param {Event} upEvt
       */
      var elementMouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        dragOptions.parentBlock.removeEventListener('mousemove', elementMouseMoveHandler);
        dragOptions.parentBlock.removeEventListener('mouseup', elementMouseUpHandler);
      };

      dragOptions.parentBlock.addEventListener('mousemove', elementMouseMoveHandler);
      dragOptions.parentBlock.addEventListener('mouseup', elementMouseUpHandler);
    };

    // Назначение "главного" обработчика
    element.addEventListener('mousedown', elementMouseDownHandler);
  };

  // Экспорт
  window.dragElement = dragElement;
})();
