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
     * @typedef {Object} fileOptions
     * @property {boolean} multiple
     * @property {string} outputField Поле вывода фото
     * @property {string} parentBlock Ограничивающий элемент
     * @property {string} class Класс тега img
     * @property {string[]} type Массив допустимых типов
     */
    this.fileOptions = {
      multiple: true,
      outputField: '',
      parentBlock: '',
      class: '',
      type: ['image', 'png', 'jpeg']
    };

    // Перезаписываем начальные значения
    window.utils.deepCopy(this.fileOptions, options);

    // Родительский блок
    var parentBlock = this.fileOptions.multiple
      ? document.querySelector(this.fileOptions.parentBlock)
      : '';

    /**
     * Функция загрузки файлов
     *
     * @param {Event} evt
     */
    this.uploadFile = function (evt) {

      // Определяем объект FileList
      var files = evt.target.files;

      // Созданием экземпляра FileReader и вызов callback
      for (var prop in files) {
        if (files.hasOwnProperty(prop) && files[prop].type.match(new RegExp(self.fileOptions.type.join('|')))) {
          var reader = new FileReader();
          var currentFile = files[prop];

          /**
           * Функция IIFE
           */
          (function (file) {
            reader.addEventListener('load', function (readerEvt) {
              appendFile(file, readerEvt);
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
    this.deleteFiles = function () {
      if (self.fileOptions.multiple) {
        var outputFields = parentBlock.querySelectorAll(self.fileOptions.outputField);
        if (outputFields.length > 1) {
          var addedImages = [].slice.call(outputFields).splice(0, outputFields.length - 1);
          window.utils.removeChildren(parentBlock, addedImages);
        }
      } else {
        var currentOutputField = document.querySelector(self.fileOptions.outputField);
        var currentImage = window.utils.findTag(currentOutputField, 'IMG');
        currentImage.classList.remove(self.fileOptions.class);
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
    var appendFile = function (file, evt) {

      // Определение поля вывода
      var currentOutputField = self.fileOptions.multiple
        ? document.querySelector(self.fileOptions.outputField).cloneNode(true)
        : document.querySelector(self.fileOptions.outputField);

      // Определение тега img
      var currentImage = window.utils.findTag(currentOutputField, 'IMG') || document.createElement('img');

      // Фиксируем начальные значения
      if (!self.fileOptions.multiple) {
        OldValue.SRC = currentImage.src;
        OldValue.ALT = currentImage.alt;
      }

      // Меняем на новые
      currentImage.classList.add(self.fileOptions.class);
      currentImage.src = evt.target.result;
      currentImage.title = file.name.split('.')[0];

      if (!window.utils.findTag(currentOutputField, 'IMG')) {
        currentOutputField.appendChild(currentImage);
      }

      if (self.fileOptions.multiple) {
        parentBlock.insertBefore(currentOutputField, parentBlock.children[0].nextSibling);
      }
    };
  };

  // Экспорт
  window.PreviewFile = PreviewFile;
})();
