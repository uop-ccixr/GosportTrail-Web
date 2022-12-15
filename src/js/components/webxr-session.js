// Re-usable setup for AR scenes containing startup / shutdown behaviour and the hit test target
AFRAME.registerComponent('webxr-session', {
    dependencies: ['element-visibility'],

    schema: {
        hitTestTargetElement: {type: "selector"},
        elementsToHide: {type: ["selector"]},
        elementsToShow: {type: ["selector"]}
    },

    init: function () {
        this.isActive = false;
        this.el.setAttribute('element-visibility');
        this.visibilityToggle = this.el.components['element-visibility'];
    },



    events: {
        startARSession: function () {
            // Check if the AR scene is already running, make it exit the last one first if so.
            if(this.el.sceneEl.is('ar-mode')){
                console.log("Exiting current AR scene...");
                if (this.isActive) {
                    this.events.stopARSession(); // Exits this AR scene and does nothing afterwards
                } else {
                    // Waits until the last AR scene has exited before continuing.
                    this.el.sceneEl.addEventListener('exit-vr', this.events.startARSession);
                    this.el.sceneEl.exitVR();
                }
                return;
            }
            console.log("Entering AR");

            this.el.sceneEl.removeEventListener('exit-vr', this.events.startARSession);

            this.isActive = true
            this.el.sceneEl.setAttribute('ar-hit-test', 'enabled', true);
            this.el.sceneEl.setAttribute('ar-hit-test', 'target', this.data.hitTestTargetElement);
            console.log("Hit test target set to " + this.data.hitTestTargetElement.id);
    
            // Exit automatically if the AR session ends
            this.el.sceneEl.addEventListener('exit-vr', this.events.stopARSession);
    
            this.el.sceneEl.enterAR();
            this.visibilityToggle.setElementsVisibility(elementsToHide, "hidden");
            this.visibilityToggle.setElementsVisibility(elementsToShow, "visible")
        },
    
        stopARSession: function () {
            console.log("Exiting AR");
    
            this.el.sceneEl.removeEventListener('exit-vr', this.events.stopARSession);
            
            this.isActive = false;
            this.data.hitTestTargetElement.object3D.visible = false;
            console.log("Hit test target " + this.data.hitTestTargetElement.id + " has been hidden");
            this.el.sceneEl.setAttribute('ar-hit-test', 'enabled', false);
    
            this.el.sceneEl.exitVR();
            this.visibilityToggle.setElementsVisibility(elementsToHide, "visibile");
            this.visibilityToggle.setElementsVisibility(elementsToShow, "hidden")
        }
    }
    
});
