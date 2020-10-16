'use strict';

(function () {

  window.utils = {
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
