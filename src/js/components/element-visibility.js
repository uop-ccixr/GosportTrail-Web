// Handles toggling of 
AFRAME.registerComponent('element-visibility', {
    schema: {
        show: {type: ["selector"]},
        hide: {type: ["selector"]}
    },

    init: function () {
      // Do something when component first attached.
    },

    /**
      * @Param {HTMLElement} elements Array of elements to toggle visibility on
      * @Param {} visibility HTML visibility string
      */
    setElementsVisibility: function ([elements], newVisibility) {
      elements.forEach(function (element) {
        element.style.visibility = newVisibility;
      });
    }

});
