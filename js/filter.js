'use strict';

const filterOfType = window.main.mapFilters.querySelector(`#housing-type`);
const filterOfPrice = window.main.mapFilters.querySelector(`#housing-price`);
const filterOfRooms = window.main.mapFilters.querySelector(`#housing-rooms`);
const filterOfGuests = window.main.mapFilters.querySelector(`#housing-guests`);
const filtersOfFeatures = window.main.mapFilters.querySelectorAll(`.map__checkbox`);
const featuresArray = Array.from(filtersOfFeatures);
let typeOfHouse = window.main.ANY_CHOICE;
let price = window.main.ANY_CHOICE;
let numberOfRooms = window.main.ANY_CHOICE;
let numberOfGuests = window.main.ANY_CHOICE;
let features = [];


function cancelChanges() {
  typeOfHouse = window.main.ANY_CHOICE;
  price = window.main.ANY_CHOICE;
  numberOfRooms = window.main.ANY_CHOICE;
  numberOfGuests = window.main.ANY_CHOICE;
  filterOfType.value = window.main.ANY_CHOICE;
  filterOfPrice.value = window.main.ANY_CHOICE;
  filterOfRooms.value = window.main.ANY_CHOICE;
  filterOfGuests.value = window.main.ANY_CHOICE;
  features = [];
}

function onFilterChange() {
  window.main.clearAdverts();
  window.main.updateAdverts();
}

function intersectArrays(array, subArray) {

  // return array.filter(function (item) {
  //   subArray.includes(item);
  // });


  return array.filter((item) => subArray.includes(item));
}

function filterByType(advert) {
  return (typeOfHouse === window.main.ANY_CHOICE) ? window.main.adverts : advert.offer.type === typeOfHouse;
}

function filterByPrice(advert) {
  return (price === window.main.ANY_CHOICE) ? window.main.adverts : (advert.offer.price > window.main.PRICE_VALUES[price].MIN_COST && advert.offer.price <= window.main.PRICE_VALUES[price].MAX_COST);
}

function filterByRooms(advert) {
  return (numberOfRooms === window.main.ANY_CHOICE) ? window.main.adverts : advert.offer.rooms === Number(numberOfRooms);
}

function filterByGuests(advert) {
  return (numberOfGuests === window.main.ANY_CHOICE) ? window.main.adverts : advert.offer.guests === Number(numberOfGuests);
}

function filterByFeatures(advert) {
  let arr = [];

  features.forEach(function (item) {
    arr.push(advert.offer.features.indexOf(item));
  });

  return (!arr.includes(-1));
}

function selectAdverts(adverts, filteredAdverts) {
  const sameTypeOfHouseAdverts = adverts.filter(filterByType);
  const samePriceAdverts = adverts.filter(filterByPrice);
  const sameTypeOfRoomsAdverts = adverts.filter(filterByRooms);
  const sameTypeOfGuestsAdverts = adverts.filter(filterByGuests);
  const sameTypeOfFeatures = adverts.filter(filterByFeatures);

  let resultAdverts = intersectArrays(sameTypeOfHouseAdverts, samePriceAdverts);
  resultAdverts = intersectArrays(resultAdverts, sameTypeOfRoomsAdverts);
  resultAdverts = intersectArrays(resultAdverts, sameTypeOfGuestsAdverts);
  resultAdverts = intersectArrays(resultAdverts, sameTypeOfFeatures);

  if (resultAdverts.length > window.main.MAX_SIMILAR_ADVERT_COUNT) {
    for (let i = 0; i < window.main.MAX_SIMILAR_ADVERT_COUNT; i++) {
      filteredAdverts.push(resultAdverts[i]);
    }
  } else {
    filteredAdverts = resultAdverts;
  }
  return filteredAdverts;
}


filterOfType.addEventListener(`change`, window.utils.debounce(function () {
  typeOfHouse = filterOfType.value;
  onFilterChange();
}));

filterOfPrice.addEventListener(`change`, window.utils.debounce(function () {
  price = filterOfPrice.value;
  onFilterChange();
}));

filterOfRooms.addEventListener(`change`, window.utils.debounce(function () {
  numberOfRooms = filterOfRooms.value;
  onFilterChange();
}));

filterOfGuests.addEventListener(`change`, window.utils.debounce(function () {
  numberOfGuests = filterOfGuests.value;
  onFilterChange();
}));


featuresArray.forEach(function (item) {
  item.addEventListener(`change`, window.utils.debounce(function () {
    if (item.checked) {
      features.push(item.value);
    } else {
      const index = features.indexOf(item.value);
      if (index > -1) {
        features.splice(index, 1);
      }
    }
    onFilterChange();
  }));
});

window.filter = {
  selectAdverts,
  cancelChanges
};
