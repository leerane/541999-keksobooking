'use strict';

/**
 * Модуль, связанный с генерацией карточки объявления
 */
(function () {

  // Вспомогательные переменные
  var cardBlock = document.querySelector('#card').content.querySelector('.map__card');
  var ROOMS_PLURAL = ['комната', 'комнаты', 'комнат'];
  var GUESTS_PLURAL = ['гостя', 'гостей', 'гостей'];

  /**
   * Соответствие англ. и рус. названий
   *
   * @typedef {Object} typesMap
   * @property {string} palace
   * @property {string} flat
   * @property {string} house
   * @property {string} bungalo
   */
  var typesMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  /**
   * Функция рендеринга фич объявления
   *
   * @param {Object} ad Объявление
   * @param {ParentNode} featuresNode Узел фич
   */
  var renderAdFeatures = function (ad, featuresNode) {
    var currentFeatures = ad['offer']['features'];
    var featuresArray = [].slice.call(featuresNode.children);
    featuresArray.forEach(function (item, index) {
      if (index >= currentFeatures.length) {
        featuresNode.removeChild(item);
      }
      item.textContent = currentFeatures[index];
    });
  };

  /**
   * Функция рендеринга фото объявления
   *
   * @param {Object} ad Объявление
   * @param {Element} photosNode Узел фотографий
   */
  var renderAdPhotos = function (ad, photosNode) {
    var currentPhotos = ad['offer']['photos'];
    var currentAdPhoto = photosNode.children[0];
    photosNode.innerHTML = '';
    var photosFragment = document.createDocumentFragment();
    currentPhotos.forEach(function (item, index) {
      var tempAdPhoto = currentAdPhoto.cloneNode(true);
      tempAdPhoto.src = currentPhotos[index];
      photosFragment.appendChild(tempAdPhoto);
    });
    photosNode.appendChild(photosFragment);
  };

  /**
   * Функция рендеринга карточки объявления
   * на основе шаблона
   *
   * @param {Object} ad Объявление
   * @return {Node}
   */
  var renderAdCard = function (ad) {
    var adCard = cardBlock.cloneNode(true);
    adCard.querySelector('.popup__avatar').src = ad['author']['avatar'];
    adCard.querySelector('.popup__title').textContent = ad['offer']['title'];
    adCard.querySelector('.popup__text--address').textContent = ad['offer']['address'];
    adCard.querySelector('.popup__text--price').textContent = ad['offer']['price'] + '\u20bd/ночь.';
    adCard.querySelector('.popup__type').textContent = typesMap[ad['offer']['type']];
    adCard.querySelector('.popup__text--time').textContent = 'Заезд после ' +
      ad['offer']['checkin'] + ', выезд до ' + ad['offer']['checkout'];

    var pluralRoomsAmount = window.utils.makePlural(ad['offer']['rooms'], ROOMS_PLURAL);
    var pluralGuestsAmount = window.utils.makePlural(ad['offer']['guests'], GUESTS_PLURAL);
    adCard.querySelector('.popup__text--capacity').textContent = ad['offer']['rooms'] + ' ' +
      pluralRoomsAmount + ' для ' + ad['offer']['guests'] + ' ' + pluralGuestsAmount;

    var adCardDescription = adCard.querySelector('.popup__description');
    if (!ad['offer']['description']) {
      adCard.removeChild(adCardDescription);
    } else {
      adCardDescription.textContent = ad['offer']['description'];
    }

    var adCardFeatures = adCard.querySelector('.popup__features');
    if (ad['offer']['features'].length) {
      renderAdFeatures(ad, adCardFeatures);
    } else {
      adCard.removeChild(adCardFeatures);
    }

    var adCardPhotos = adCard.querySelector('.popup__photos');
    if (ad['offer']['photos'].length) {
      renderAdPhotos(ad, adCardPhotos);
    } else {
      adCard.removeChild(adCardPhotos);
    }

    return adCard;
  };

  // Экспорт
  window.card = renderAdCard;
})();
