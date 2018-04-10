// файл pictures.js
'use strict';

(function () {

  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_LOCATION_X = 300;
  var MAX_LOCATION_X = 900;
  var MIN_LOCATION_Y = 100;
  var MAX_LOCATION_Y = 500;
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
    'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPE = ['flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var tokyoPinMap = document.querySelector('.tokyo__pin-map');
  var similarLodgeTemplate = document.querySelector('#lodge-template').content;
  var offerDialog = document.querySelector('#offer-dialog');
  var offerPanel = offerDialog.querySelector('.dialog__panel');
  var dialogTitle = offerDialog.querySelector('.dialog__title');

  var getRandomMinMax = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var getRandomNumber = function (number) {
    return Math.floor(Math.random() * (number - 1));
  };

  var getFeatures = function (randomNumber, array) {
    var newArray = [];
    var length = randomNumber(array.length);
    if (length === 0) {
      newArray = ['НЕТ'];
    } else {
      for (var i = 0; i < length; i++) {
        newArray[i] = array[i];
      }
    }
    return newArray;
  };

  var makeArray = function (randomNumber, randomMinMax, getFeature) {
    var proposals = [];
    for (var i = 0; i < 8; i++) {
      proposals[i] = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },

        offer: {
          title: TITLES[randomNumber(TITLES.length)],
          address: '',
          price: randomMinMax(MIN_PRICE, MAX_PRICE),
          type: TYPE[randomNumber(TYPE.length)],
          rooms: randomMinMax(MIN_ROOMS, MAX_ROOMS),
          guests: null,
          checkin: CHECKIN[randomNumber(CHECKIN.length)],
          checkout: CHECKOUT[randomNumber(CHECKOUT.length)],
          features: getFeature(randomNumber, FEATURES),
          description: '',
          photos: []
        },


        location: {
          x: randomMinMax(MIN_LOCATION_X, MAX_LOCATION_X),
          y: randomMinMax(MIN_LOCATION_Y, MAX_LOCATION_Y)
        }

      };
      proposals[i].offer.address = proposals[i].location.x + ', ' + proposals[i].location.y;
      proposals[i].offer.guests = proposals[i].offer.rooms * 2;
    }
    return proposals;
  };

  var getPinMap = function (pinMap) {
    // debugger;
    var div = document.createElement('div');
    var img = document.createElement('img');
    div.classList.add('pin');
    div.style = 'left: ' + (pinMap.location.x - 75) + 'px; top: ' + (pinMap.location.y - 28) + 'px';
    div.appendChild(img);
    img.setAttribute('src', pinMap.author.avatar);
    img.classList.add('rounded');
    img.style.width = '40px';
    img.style.height = '40px';
    return div;
  };

  var printPinMap = function (pinMap) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pinMap.length; i++) {
      fragment.appendChild(getPinMap(pinMap[i]));
    }
    tokyoPinMap.appendChild(fragment);
  };

  printPinMap(makeArray(getRandomNumber, getRandomMinMax, getFeatures));

  var getTypeLodge = function (element) {
    var text;
    switch (element) {
      case 'flat':
        text = 'Квартира';
        break;
      case 'bungalo':
        text = 'Бунгало';
        break;
      case 'house':
        text = 'Дом';
        break;
      default:
        text = 'Не понятно что';
    }
    return text;
  };

  var getComfortLodge = function (array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var span = document.createElement('span');
      span.classList.add('feature__image');
      span.classList.add('feature__image--' + array[i]);
      fragment.appendChild(span);
    }
    return fragment;
  };

  var addInformation = function (element) {
    var lodgeElement = similarLodgeTemplate.cloneNode(true);
    lodgeElement.querySelector('.lodge__title').textContent = element.offer.title;
    lodgeElement.querySelector('.lodge__address').textContent = element.offer.address;
    lodgeElement.querySelector('.lodge__price').textContent = element.offer.price + '\u20BD' + '/ночь';
    lodgeElement.querySelector('.lodge__type').textContent = getTypeLodge(element.offer.type);
    lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + element.offer.guests + ' гостей в ' + element.offer.rooms + ' комнатах';
    lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после' + element.offer.checkin + ' , выезд до ' + element.offer.checkout;
    lodgeElement.querySelector('.lodge__features').appendChild(getComfortLodge(element.offer.features));
    lodgeElement.querySelector('.lodge__description').textContent = element.offer.description;
    dialogTitle.querySelector('img').setAttribute('src', element.author.avatar);
    offerDialog.replaceChild(lodgeElement, offerPanel);
  };

  addInformation(makeArray(getRandomNumber, getRandomMinMax, getFeatures)[2]);

})();
