'use strict';

/**
 * Модуль, связанный с фильтрацией объявлений
 */
(function () {
  // Форма фильтров и ее поля
  var filterForm = document.querySelector('.map__filters');

  // Выключаем форму фильтров (добавляем атрибут disabled полям)
  window.form.disableFormChildren(filterForm);
})();
