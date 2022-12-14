// Handles toggling of 
AFRAME.registerComponent('element-visibility', {
    schema: {

    },

    init: function () {
      // Do something when component first attached.
    },

    /**
      * @Param {HTMLElement} elements Array of elements to toggle visibility on
      * @Param {} visibility HTML visibility string
      */
    setElementsVisibility: function (elements, newVisibility) {
      [elements].forEach(function (element) {
        element.style.visibility = newVisibility;
        console.log(element.id + ' set to ' + newVisibility);
      });
    }

});
