// distance-display.js
AFRAME.registerComponent("marker-distance", {
	init: function () {
		// สร้าง UI element สำหรับระยะห่างรวม
		const distanceDisplay = document.createElement("div");
		distanceDisplay.id = "distance-display";
		distanceDisplay.style.position = "fixed";
		distanceDisplay.style.top = "10px";
		distanceDisplay.style.left = "10px";
		distanceDisplay.style.background = "rgba(0,0,0,0.7)";
		distanceDisplay.style.color = "white";
		distanceDisplay.style.padding = "10px";
		distanceDisplay.style.fontFamily = "Arial, sans-serif";
		distanceDisplay.style.zIndex = "999";
		document.body.appendChild(distanceDisplay);

		// สร้าง UI element สำหรับระยะห่างแต่ละแกน
		const axisDisplay = document.createElement("div");
		axisDisplay.id = "axis-display";
		axisDisplay.style.position = "fixed";
		axisDisplay.style.bottom = "10px";
		axisDisplay.style.left = "10px";
		axisDisplay.style.background = "rgba(0,0,0,0.7)";
		axisDisplay.style.color = "white";
		axisDisplay.style.padding = "10px";
		axisDisplay.style.fontFamily = "Arial, sans-serif";
		axisDisplay.style.zIndex = "999";
		document.body.appendChild(axisDisplay);

		this.marker = document.querySelector("a-marker");
		this.camera = document.querySelector("a-entity[camera]");
		this.distanceDisplay = distanceDisplay;
		this.axisDisplay = axisDisplay;
	},

	tick: function () {
		if (this.marker.object3D.visible) {
			const markerPosition = this.marker.object3D.position;
			const cameraPosition = this.camera.object3D.position;

			// คำนวณระยะห่างรวม
			const distance = markerPosition.distanceTo(cameraPosition);
			this.distanceDisplay.textContent = `ระยะห่างรวม: ${distance.toFixed(
				2
			)} เมตร`;

			// คำนวณระยะห่างในแต่ละแกน
			const xDist = Math.abs(markerPosition.x - cameraPosition.x);
			const yDist = Math.abs(markerPosition.y - cameraPosition.y);
			const zDist = Math.abs(markerPosition.z - cameraPosition.z);

			this.axisDisplay.innerHTML = `
          ระยะห่างตามแกน:<br>
          X: ${xDist.toFixed(2)} เมตร<br>
          Y: ${yDist.toFixed(2)} เมตร<br>
          Z: ${zDist.toFixed(2)} เมตร
        `;
		}
	},
});
