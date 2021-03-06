// файл pictures.js
'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
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
  var dialogTitle = offerDialog.querySelector('.dialog__title');
  var closeDialog = offerDialog.querySelector('.dialog__close img');
  var type = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var title = document.querySelector('#title');
  var address = document.querySelector('#address');
  // var noticeForm = document.querySelector('.notice__form');
  var arrayPins = [];

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
    var div = document.createElement('div');
    var img = document.createElement('img');
    div.classList.add('pin');
    div.style = 'left: ' + (pinMap.location.x - 75) + 'px; top: ' + (pinMap.location.y - 28) + 'px';
    div.appendChild(img);
    img.setAttribute('src', pinMap.author.avatar);
    img.classList.add('rounded');
    img.style.width = '40px';
    img.style.height = '40px';
    img.setAttribute('tabindex', '0');
    return div;
  };

  var printPinMap = function (pinMap) {
    arrayPins = pinMap;
    tokyoPinMap.querySelector('div').remove();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayPins.length; i++) {
      fragment.appendChild(getPinMap(arrayPins[i]));
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

  var addInformation = function (element, target) {
    var offerPanel = offerDialog.querySelector('.dialog__panel');
    var lodgeElement = similarLodgeTemplate.cloneNode(true);
    lodgeElement.querySelector('.lodge__title').textContent = element.offer.title;
    lodgeElement.querySelector('.lodge__address').textContent = +(target.style.left.replace('px', '')) + ', ' + +(target.style.top.replace('px', ''));
    lodgeElement.querySelector('.lodge__price').textContent = element.offer.price + '\u20BD' + '/ночь';
    lodgeElement.querySelector('.lodge__type').textContent = getTypeLodge(element.offer.type);
    lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + element.offer.guests + ' гостей в ' + element.offer.rooms + ' комнатах';
    lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после' + element.offer.checkin + ' , выезд до ' + element.offer.checkout;
    lodgeElement.querySelector('.lodge__features').appendChild(getComfortLodge(element.offer.features));
    lodgeElement.querySelector('.lodge__description').textContent = element.offer.description;
    dialogTitle.querySelector('img').setAttribute('src', element.author.avatar);
    offerDialog.replaceChild(lodgeElement, offerPanel);
  };

  var onEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE && evt.currentTarget.className === 'pin') {
      openOfferDialog(evt);
    }
    if (evt.keyCode === ENTER_KEYCODE && evt.currentTarget.className === 'dialog__close') {
      closeOfferDialog();
    }
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeOfferDialog();
    }
  };

  var findIndex = function (element, array) {
    var srcElement = element.attributes.src.nodeValue;
    for (var i = 0; i <= array.length; i++) {
      if (array[i].author.avatar === srcElement) {
        break;
      }
    }
    return i;
  };

  var removeClassActive = function () {
    var pins = tokyoPinMap.querySelectorAll('.pin');
    [].forEach.call(pins, function (element) {
      element.classList.remove('pin--active');
    });
  };

  var closeOfferDialog = function () {
    removeClassActive();
    offerDialog.classList.add('hidden');
    closeDialog.removeEventListener('click', closeOfferDialog);
    closeDialog.parentElement.removeEventListener('keydown', onEnterPress);
    document.removeEventListener('keydown', onEscPress);
  };

  var openOfferDialog = function (evt) {
    removeClassActive();
    var target = null;
    if (evt.target.tagName === 'IMG') {
      target = evt.target;
    } else {
      target = evt.target.firstChild;
    }
    target.parentElement.classList.add('pin--active');
    var element = arrayPins[findIndex(target, arrayPins)];
    addInformation(element, target.parentElement);
    offerDialog.classList.remove('hidden');
    closeDialog.addEventListener('click', closeOfferDialog);
    closeDialog.parentElement.addEventListener('keydown', onEnterPress);
    document.addEventListener('keydown', onEscPress);
  };

  var onClickPin = function () {
    var pins = tokyoPinMap.querySelectorAll('.pin');
    [].forEach.call(pins, function (element) {
      element.addEventListener('click', openOfferDialog);
      element.addEventListener('keydown', onEnterPress);
    });
  };

  onClickPin();

  // ф-ция синхронизации времени заезда и выезда
  var changeTime = function (evt) {
    if (evt.currentTarget === timein) {
      timeout.selectedIndex = timein.selectedIndex;
    } else {
      timein.selectedIndex = timeout.selectedIndex;
    }
  };

  // ф-ция установки мин. цены в зависимости от типа жилья
  var setPrice = function (evt) {
    var elem = document.querySelector('#price');
    switch (evt.target.value) {
      case 'bungalo':
        elem.setAttribute('value', '0');
        elem.setAttribute('min', '0');
        break;

      case 'flat':
        elem.setAttribute('value', '1000');
        elem.setAttribute('min', '1000');
        break;

      case 'house':
        elem.setAttribute('value', '5000');
        elem.setAttribute('min', '5000');
        break;

      case 'palace':
        elem.setAttribute('value', '10000');
        elem.setAttribute('min', '10000');
        break;
    }
  };

  // ф-ция синхронизации кол-ва гостей и кол-ва комнат
  var setRooms = function (evt) {
    if (evt.currentTarget === roomNumber) {
      switch (evt.target.value) {
        case '1':
          capacity.selectedIndex = roomNumber.selectedIndex;
          break;
        case '2':
          capacity.selectedIndex = getRandomNumber(2);
          break;
        case '3':
          capacity.selectedIndex = getRandomNumber(3);
          break;
        default:
          capacity.selectedIndex = 3;
          break;
      }
    } else {
      switch (evt.target.value) {
        case '0':
          roomNumber.selectedIndex = 3;
          break;
        case '1':
          roomNumber.selectedIndex = getRandomNumber(3);
          break;
        case '2':
          roomNumber.selectedIndex = getRandomMinMax(1, 2);
          break;
        default:
          roomNumber.selectedIndex = capacity.selectedIndex;
          break;
      }
    }
  };

  // волидация формы
  var makeRedFrame = function (evt) {
    if (!evt.target.validity.valid) {
      evt.target.style.borderColor = 'red';
      evt.target.style.borderWidth = '1.5px';
    }
  };

  var looksForm = function (evt) {
    evt.target.style.borderColor = '';
    evt.target.style.borderWidth = '';
  };

  // сброс значений формы
  // var resetForm = function () {
  //   noticeForm.reset();
  // };

  timeout.addEventListener('change', changeTime);
  timein.addEventListener('change', changeTime);
  type.addEventListener('change', setPrice);
  roomNumber.addEventListener('change', setRooms);
  capacity.addEventListener('change', setRooms);
  title.addEventListener('invalid', makeRedFrame);
  address.addEventListener('invalid', makeRedFrame);
  title.addEventListener('input', looksForm);
  address.addEventListener('input', looksForm);
  // noticeForm.addEventListener('submit', resetForm);

})();
