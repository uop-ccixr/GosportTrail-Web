require('aframe');

// Re-usable setup for AR scenes containing startup / shutdown behaviour and the hit test target
AFRAME.registerComponent('ar-scene', {
    schema: {
        hitTestTargetElement: {type: "selector"},
        elementToHide: {type: "selector"},
        elementToShow: {type: "selector"}
    },

    init: function () {
        this.isActive = false;
    },
    events: {
        startARScene: function () {
            // Check if the AR scene is already running, make it exit the last one first if so.
            if(this.el.sceneEl.is('ar-mode')){
                console.log("Exiting current AR scene...");
                if (this.isActive) {
                    this.events.stopARScene(); // Exits this AR scene and does nothing afterwards
                } else {
                    // Waits until the last AR scene has exited before continuing.
                    this.el.sceneEl.addEventListener('exit-vr', this.events.startARScene);
                    this.el.sceneEl.exitVR();
                }
                return;
            }
            console.log("Entering AR");

            this.el.sceneEl.removeEventListener('exit-vr', this.events.startARScene);

            this.isActive = true
            this.el.sceneEl.setAttribute('ar-hit-test', 'enabled', true);
            this.el.sceneEl.setAttribute('ar-hit-test', 'target', this.data.hitTestTargetElement);
            console.log("Hit test target set to " + this.data.hitTestTargetElement.id);
    
            // Exit automatically if the AR session ends
            this.el.sceneEl.addEventListener('exit-vr', this.events.stopARScene);
    
            this.el.sceneEl.enterAR();
            this.data.elementToHide.style.visibility = "hidden";
            this.data.elementToShow.style.visibility = "visible";
        },
    
        stopARScene: function () {
            console.log("Exiting AR");
    
            this.el.sceneEl.removeEventListener('exit-vr', this.events.stopARScene);
            
            this.isActive = false;
            this.data.hitTestTargetElement.object3D.visible = false;
            console.log("Hit test target " + this.data.hitTestTargetElement.id + " has been hidden");
            this.el.sceneEl.setAttribute('ar-hit-test', 'enabled', false);
    
            this.el.sceneEl.exitVR();
            this.data.elementToHide.style.visibility = "visible";
            this.data.elementToShow.style.visibility = "hidden";
        }
    }
    
});
