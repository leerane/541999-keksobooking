'use strict';

/**
 * Модуль, позволяющий отображать загруженные файлы
 * посредством FileReader API
 */
(function () {

  /**
   * Конструктор отображения файла
   *
   * @param {Object} options
   * @constructor
   */
  var PreviewFile = function (options) {

    // Вспомогательные переменные
    var self = this;

    /**
     * Начальные значения img
     *
     * @typedef {Object} OldValue
     * @property {string} SRC
     * @property {string} ALT
     */
    var OldValue = {
      SRC: '',
      ALT: ''
    };

    /**
     * Начальные данные
     *
     * @typedef {Object} options
     * @property {boolean} multiple
     * @property {string} outputField Поле вывода фото
     * @property {string} parentBlock Ограничивающий элемент
     * @property {string} class Класс тега img
     * @property {string[]} type Массив допустимых типов
     */
    this.options = {
      multiple: true,
      outputField: '',
      parentBlock: '',
      class: '',
      type: ['image', 'png', 'jpeg']
    };

    // Перезаписываем начальные значения
    window.utils.deepCopy(this.options, options);

    // Родительский блок
    var parentBlock = this.options.multiple
      ? document.querySelector(this.options.parentBlock)
      : '';

    /**
     * Функция загрузки файлов
     *
     * @param {Event} evt
     */
    this.upload = function (evt) {

      // Определяем объект FileList
      var files = evt.target.files;

      // Созданием экземпляра FileReader и вызов callback
      for (var prop in files) {
        if (files.hasOwnProperty(prop) && files[prop].type.match(new RegExp(self.options.type.join('|')))) {
          var reader = new FileReader();
          var currentFile = files[prop];

          /**
           * Функция IIFE
           */
          (function (file) {
            reader.addEventListener('load', function (readerEvt) {
              append(file, readerEvt);
            });
          })(currentFile);

          // Метод чтения файла
          reader.readAsDataURL(currentFile);
        }
      }
    };

    /**
     * Функция удаления файлов,
     * если они уже есть
     */
    this.delete = function () {
      if (self.options.multiple) {
        var outputFields = parentBlock.querySelectorAll(self.options.outputField);
        if (outputFields.length > 1) {
          var addedImages = [].slice.call(outputFields).splice(0, outputFields.length - 1);
          window.utils.removeChildren(parentBlock, addedImages);
        }
      } else {
        var currentOutputField = document.querySelector(self.options.outputField);
        var currentImage = window.utils.findTag(currentOutputField, 'IMG');
        currentImage.classList.remove(self.options.class);
        currentImage.src = OldValue.SRC;
        currentImage.alt = OldValue.ALT;
      }
    };

    /**
     * Функция отрисовки файла
     *
     * @param {Object} file
     * @param {Event} evt
     */
    var append = function (file, evt) {

      // Определение поля вывода
      var currentOutputField = self.options.multiple
        ? document.querySelector(self.options.outputField).cloneNode(true)
        : document.querySelector(self.options.outputField);

      // Определение тега img
      var currentImage = window.utils.findTag(currentOutputField, 'IMG') || document.createElement('img');

      // Фиксируем начальные значения
      if (!self.options.multiple) {
        OldValue.SRC = currentImage.src;
        OldValue.ALT = currentImage.alt;
      }

      // Меняем на новые
      currentImage.classList.add(self.options.class);
      currentImage.src = evt.target.result;
      currentImage.title = file.name.split('.')[0];

      if (!window.utils.findTag(currentOutputField, 'IMG')) {
        currentOutputField.appendChild(currentImage);
      }

      if (self.options.multiple) {
        parentBlock.insertBefore(currentOutputField, parentBlock.children[0].nextSibling);
      }
    };
  };

  // Экспорт
  window.PreviewFile = PreviewFile;
})();
