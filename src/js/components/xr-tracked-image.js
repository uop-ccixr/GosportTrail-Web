require('aframe');

// Trackable image used with the xr-image-tracking system. Retrived from: https://github.com/stspanho/aframe-image-tracking
AFRAME.registerComponent("xr-tracked-image", {
    schema: {
        element: {type: "selector"},
        widthInMeters: {type: "number"}
    },
    init: function () {
        console.log("xr-tracked-image init");
        this.el.emit("register-xr-tracked-image", {node: this});
    }
});