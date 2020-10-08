'use strict';

(function () {

  window.utils = {
    getRandomElement: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    shuffleArray: function (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    getRandomSortedList: function (arr) {
      const NUMBERS_OF_ELEMENTS = Math.floor(Math.random() * (arr.length + 1));
      const cloneArr = [...arr];
      const shuffledArr = this.shuffleArray(cloneArr);
      const randomSortedList = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < NUMBERS_OF_ELEMENTS; j++) {
          if (arr[i] === shuffledArr[j]) {
            randomSortedList.push(shuffledArr[j]);
          }
        }
      }
      return randomSortedList;
    },

    getContent: function (render, arr, parent, child) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < arr.length; i++) {
        fragment.appendChild(render(arr[i]));
      }

      parent.insertBefore(fragment, parent.children[child]);
    },

    disableElementsInArray: function (arr, flag) {
      for (let i = 0; i < arr.length; i++) {
        if (flag === true) {
          arr[i].setAttribute('disabled', 'disabled');
        } else {
          arr[i].removeAttribute('disabled');
        }
      }
    }
  };
})();
