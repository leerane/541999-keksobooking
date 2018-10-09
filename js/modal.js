'use strict';

/**
 * Модуль создания модального окна
 */
(function () {

  /**
   * Конструктор модального окна
   *
   * @param {Object} options
   * @constructor
   */
  var Modal = function (options) {

    // Вспомогательные переменные
    var modalFragment = document.createDocumentFragment();
    var self = this;

    /**
     * @typedef {Object} Close
     * @property {boolean} ESC
     * @property {boolean} OUTSIDE
     * @property {string} BUTTON
     * @property {boolean} HIDE
     * @property {boolean} DELETE
     */

    /**
     * Начальные параметры
     *
     * @typedef {Object} options
     * @property {string} template Шаблон (для селектора)
     * @property {string} innerBlock Внутренний блок
     * @property {string} contentBlock Контентовый блок
     * @property {string} parentBlock Ограничевающий блок
     * @property {string} hiddenClass Класс, скрывающий блок (если нет <template>)
     * @property {boolean} scroll Отключить или нет главный скролл
     * @property {Close}
     */
    this.options = {
      template: '',
      innerBlock: '',
      contentBlock: '',
      parentBlock: '',
      hiddenClass: '',
      disableScroll: true,
      Close: {
        ESC: true,
        OUTSIDE: true,
        BUTTON: '',
        HIDE: false,
        DELETE: true
      }
    };

    // Перезаписываем начальные значения
    window.utils.deepCopy(this.options, options);

    // Скролл
    document.body.style.overflow = this.options.disableScroll ? 'hidden' : 'visible';

    /**
     * Функция создания узла
     * модального окна
     *
     * @return {Element}
     */
    this.create = function () {
      var tempTemplate = document.querySelector(this.options.template);
      return tempTemplate.content.querySelector(this.options.innerBlock).cloneNode(true);
    };

    // Модальное окно
    this.mainBlock = this.options.template
      ? this.create()
      : document.querySelector(this.options.innerBlock);

    // Модальное окно
    this.contentBlock = this.mainBlock.querySelector(this.options.contentBlock);

    // Кнопка закрытия
    this.closeButton = this.options.Close.BUTTON
      ? self.mainBlock.querySelector(this.options.Close.BUTTON)
      : '';

    // Родительский блок
    this.parentBlock = document.querySelector(this.options.parentBlock);

    /**
     * Функция показа модального окна
     */
    this.show = function () {

      // Добавление узла или удаление "невидимого" класса
      if (self.options.template) {
        modalFragment.appendChild(self.mainBlock);
        self.parentBlock.appendChild(modalFragment);
      } else {
        self.mainBlock.classList.remove(self.options.hiddenClass);
      }

      // Добавление обработчиков
      if (self.options.Close.ESC && self.mainBlock) {
        document.addEventListener('keydown', mainBlockEscPressHandler);
      }
      if (self.options.Close.OUTSIDE && self.mainBlock) {
        document.addEventListener('mouseup', mainBlockClickOutHandler);
      }
      if (self.closeButton && self.mainBlock) {
        self.closeButton.addEventListener('mouseup', closeButtonClickHandler);
      }
    };

    /**
     * Функция закрытия модального окна
     */
    var closeModal = function () {

      // Скролл
      document.body.style.overflow = self.options.disableScroll ? 'visible' : 'hidden';

      // Удаление узла
      if (self.options.Close.DELETE && self.options.template) {
        self.parentBlock.removeChild(self.mainBlock);
      }

      // Скрытие узла
      if (self.options.Close.HIDE && self.mainBlock) {
        self.mainBlock.classList.add(self.options.hiddenClass);
      }

      // Удаление обработчиков
      if (self.options.Close.ESC && self.mainBlock) {
        document.removeEventListener('keydown', mainBlockEscPressHandler);
      }
      if (self.options.Close.OUTSIDE && self.mainBlock) {
        document.removeEventListener('mouseup', mainBlockClickOutHandler);
      }
      if (self.closeButton && self.mainBlock) {
        self.closeButton.removeEventListener('mouseup', closeButtonClickHandler);
      }
    };

    /**
     * Функция-обработчик, закрывающая
     * модальное окно при нажатии клавиши ESC
     *
     * @param {Event} evt
     */
    var mainBlockEscPressHandler = function (evt) {
      window.utils.escPressHandler(evt, function () {
        closeModal(self.mainBlock);
      });
    };

    /**
     * Функция-обработчик, закрывающая
     * модальное окно при нажатии (клике) извне
     *
     * @param {Event} evt
     */
    var mainBlockClickOutHandler = function (evt) {
      window.utils.outsideClickHandler(evt, self.contentBlock, function () {
        closeModal(self.mainBlock);
      });
    };

    /**
     * Функция-обработчик, закрывающая
     * модальное окно при нажатии на кнопку
     *
     * @param {Event} evt
     */
    var closeButtonClickHandler = function (evt) {
      evt.preventDefault();
      closeModal(self.mainBlock);
    };
  };

  // Экспорт
  window.Modal = Modal;
})();
