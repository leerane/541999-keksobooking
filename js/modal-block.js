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
  var ModalBlock = function (options) {
    //
    var modalFragment = document.createDocumentFragment();
    var self = this;

    /**
     * @typedef {Object} CloseOption
     * @property {boolean} ESC
     * @property {boolean} OUTSIDE
     * @property {string} BUTTON
     * @property {boolean} HIDE
     * @property {boolean} DELETE
     */

    /**
     * Начальные параметры
     *
     * @typedef {Object} modalOptions
     * @property {string} template Шаблон (для селектора)
     * @property {string} innerBlock Внутренний блок самого окна
     * @property {string} parentBlock Ограничевающий блок
     * @property {string} hiddenClass Класс, скрывающий блок (если нет <template>)
     * @property {boolean} scroll Отключить или нет главный скролл
     * @property {CloseOption}
     */
    this.modalOptions = {
      template: '',
      innerBlock: '',
      parentBlock: '',
      hiddenClass: '',
      disableScroll: true,
      CloseOption: {
        ESC: true,
        OUTSIDE: true,
        BUTTON: '',
        HIDE: false,
        DELETE: true
      }
    };

    // Перезаписываем начальные значения
    window.utils.deepCopy(this.modalOptions, options);

    // Скролл
    document.body.style.overflow = this.modalOptions.disableScroll ?  'hidden' : 'visible';

    /**
     * Функция создания узла
     * модального окна
     *
     * @return {Element}
     */
    this.createModal = function () {
      var tempTemplate = document.querySelector(this.modalOptions.template);
      return tempTemplate.content.querySelector(this.modalOptions.innerBlock).cloneNode(true);
    };

    // Модальное окно
    this.modalBlock = this.modalOptions.template
      ? this.createModal()
      : document.querySelector(this.modalOptions.innerBlock);

    // Родительский блок
    this.parentBlock = document.querySelector(this.modalOptions.parentBlock);

    /**
     * Функция показа модального окна
     */
    this.showModal = function () {

      // Добавление узла или удаление "невидимого" класса
      if (self.modalOptions.template && !self.modalOptions.CloseOption.HIDE) {
        modalFragment.appendChild(self.modalBlock);
        self.parentBlock.appendChild(modalFragment);
      } else {
        self.modalBlock.classList.remove(self.modalOptions.hiddenClass);
      }

      // Добавление обработчиков
      if (self.modalOptions.CloseOption.ESC) {
        document.addEventListener('keydown', modalBlockEscPressHandler);
      }
      if (self.modalOptions.CloseOption.OUTSIDE) {
        document.addEventListener('mouseup', modalBlockClickOutHandler);
      }
    };

    /**
     * Функция закрытия модального окна
     */
    var closeModal = function () {

      // Удаление узла
      if (self.modalOptions.CloseOption.DELETE && self.modalOptions.template) {
        self.parentBlock.removeChild(self.modalBlock);
      }

      // Скрытие узла
      if (self.modalOptions.CloseOption.HIDE) {
        self.modalBlock.classList.add(self.modalOptions.hiddenClass);
      }

      // Удаление обработчиков
      if (self.modalOptions.CloseOption.ESC) {
        document.removeEventListener('keydown', modalBlockEscPressHandler);
      }
      if (self.modalOptions.CloseOption.OUTSIDE) {
        document.removeEventListener('mouseup', modalBlockClickOutHandler);
      }
    };

    /**
     * Функция-обработчик, закрывающая
     * модальное окно при нажатии клавиши ESC
     *
     * @param {Event} evt
     */
    var modalBlockEscPressHandler = function (evt) {
      window.utils.escPressHandler(evt, function () {
        closeModal(self.modalBlock);
      });
    };

    /**
     * Функция-обработчик, закрывающая
     * модальное окно при нажатии (клике) извне
     *
     * @param {Event} evt
     */
    var modalBlockClickOutHandler = function (evt) {
      window.utils.outsideClickHandler(evt, self.modalBlock, function () {
        closeModal(self.modalBlock);
      });
    };
  };

  // Экспорт
  window.ModalBlock = ModalBlock;
})();
