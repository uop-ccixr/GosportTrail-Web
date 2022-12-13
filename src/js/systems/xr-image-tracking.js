require('aframe');

// Tracking system for xr-tracked-image types. Retrieved from: https://github.com/stspanho/aframe-image-tracking
AFRAME.registerSystem("xr-image-tracking", {
    init: function () {
        console.log("xr-image-tracking init");
        this.trackedNodesByImageIdNum = {};
        this.trackedImageList = [];
        this.trackedImagesPreviousFrame = {};
        this.el.sceneEl.systems.webxr.sessionConfiguration.trackedImages = this.trackedImageList;
        this.el.sceneEl.addEventListener("register-xr-tracked-image", async ev => {
            let node = ev.detail.node;
            console.log("register", node);
            let trackedData = node.data;
            let bitmap = await createImageBitmap(trackedData.element);
            let idNum = this.trackedImageList.length;
            this.trackedImageList.push({
                image: bitmap,
                widthInMeters: trackedData.widthInMeters
            });
            this.trackedNodesByImageIdNum[idNum] = node;
        });

        this.el.sceneEl.addEventListener("enter-vr", ev => {
            if (this.el.sceneEl.is("ar-mode")) {
                console.log("ar-mode start");

                let session = this.el.sceneEl.renderer.xr.getSession();
                let refSpaceType =
                        this.el.sceneEl.systems.webxr.sessionReferenceSpaceType ||
                        "local-floor";
                session.requestReferenceSpace(refSpaceType).then(space => {
                    this.refSpace = space;
                });
            }
        });
    },
    tick: function () {
        let session = this.el.sceneEl.renderer.xr.getSession();
        if (!session) return;
        let frame = this.el.sceneEl.frame;
        let imagesTrackedThisFrame = {};
        let results = frame.getImageTrackingResults();
        for (let i = 0; i < results.length; ++i) {
            let result = results[i];
            let pose = frame.getPose(result.imageSpace, this.refSpace);
            let idNum = result.index;
            imagesTrackedThisFrame[idNum] = true;
            console.log("pose", pose, "for image", idNum, " state=" + result.trackingState, " width=", result.measuredWidthInMeters);
            let node = this.trackedNodesByImageIdNum[idNum];
            console.log(node);
            if (!node) continue;
            // node.el.children[1].setAttribute(
            // 		"opacity",
            // 		result.trackingState == "tracked" ? 0.7 : 0.1);
            if (pose) {
                let object3D = node.el.object3D;
                object3D.visible = true;
                object3D.matrix.elements = pose.transform.matrix;
                object3D.matrix.decompose(
                        object3D.position,
                        object3D.rotation,
                        object3D.scale
                );
            }
        }

        for (const index in this.imagesTrackedPreviousFrame) {
            if (!imagesTrackedThisFrame[index]) {
                this.trackedNodesByImageIdNum[index].el.object3D.visible = false;
            }
        }
        this.imagesTrackedPreviousFrame = imagesTrackedThisFrame;
    }
});