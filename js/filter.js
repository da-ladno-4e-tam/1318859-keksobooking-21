'use strict';

// const filterOfType = window.main.mapFilters.querySelector('#housing-type');
// const filterOfPrice = window.main.mapFilters.querySelector('#housing-price');
// const filterOfRooms = window.main.mapFilters.querySelector('#housing-rooms');
// const filterOfGuests = window.main.mapFilters.querySelector('#housing-guests');
const filtersOfFeatures = window.main.mapFilters.querySelectorAll('.map__checkbox');
const featuresArray = Array.from(filtersOfFeatures);
// let typeOfHouse = window.main.ANY_CHOICE;
// let price = window.main.ANY_CHOICE;
// let numberOfRooms = window.main.ANY_CHOICE;
// let numberOfGuests = window.main.ANY_CHOICE;
// let features = [];

function debounce(cb) {
  const DEBOUNCE_INTERVAL = 500;
  let lastTimeout;
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
}


function onFilterChange() {
  window.main.clearAdverts();
  window.main.updateAdverts();
}

function intersectArrays(array, subArray) {
  return array.filter((item) => subArray.includes(item));
}

function filterByType(advert) {
  return (window.main.typeOfHouse === window.main.ANY_CHOICE) ? window.main.adverts : advert.offer.type === window.main.typeOfHouse;
}

function filterByPrice(advert) {
  return (window.main.price === window.main.ANY_CHOICE) ? window.main.adverts : (advert.offer.price > window.main.PRICE_VALUES[window.main.price].MIN_COST && advert.offer.price <= window.main.PRICE_VALUES[window.main.price].MAX_COST);
}

function filterByRooms(advert) {
  return (window.main.numberOfRooms === window.main.ANY_CHOICE) ? window.main.adverts : advert.offer.rooms === Number(window.main.numberOfRooms);
}

function filterByGuests(advert) {
  return (window.main.numberOfGuests === window.main.ANY_CHOICE) ? window.main.adverts : advert.offer.guests === Number(window.main.numberOfGuests);
}

function filterByFeatures(advert) {
  let arr = [];
  for (let i = 0; i < window.main.features.length; i++) {
    arr.push(advert.offer.features.indexOf(window.main.features[i]));
  }
  return (!arr.includes(-1));
}

function filterAdverts(adverts, filteredAdverts) {
  // console.log('filter');
  // console.log(window.main.typeOfHouse);
  const sameTypeOfHouseAdverts = adverts.filter(filterByType);
  // console.log(window.main.typeOfHouse);
  // console.log('meow');
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


window.main.filterOfType.addEventListener('change', function () {
  window.main.typeOfHouse = window.main.filterOfType.value;
  debounce(onFilterChange);
});

window.main.filterOfPrice.addEventListener('change', function () {
  window.main.price = window.main.filterOfPrice.value;
  debounce(onFilterChange);
});

window.main.filterOfRooms.addEventListener('change', function () {
  window.main.numberOfRooms = window.main.filterOfRooms.value;
  debounce(onFilterChange);
});

window.main.filterOfGuests.addEventListener('change', function () {
  window.main.numberOfGuests = window.main.filterOfGuests.value;
  debounce(onFilterChange);
});

for (let i = 0; i < featuresArray.length; i++) {
  featuresArray[i].addEventListener('change', function () {
    if (featuresArray[i].checked) {
      window.main.features.push(featuresArray[i].value);
    } else {
      const index = window.main.features.indexOf(featuresArray[i].value);
      if (index > -1) {
        window.main.features.splice(index, 1);
      }
    }
    debounce(onFilterChange);
  });
}

window.filter = {
  filterAdverts: filterAdverts,
};
