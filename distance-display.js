// distance-display.js - ไฟล์สำหรับแสดงระยะห่างระหว่างกล้องและมาร์คเกอร์

// เพิ่มตัวแปร Global ไว้ด้านบนสุดของไฟล์
window.markerDistance = {
	x: 0,
	y: 0,
	z: 0
};

// ลงทะเบียน component ชื่อ marker-distance ใน A-Frame
AFRAME.registerComponent("marker-distance", {
	// ฟังก์ชัน init จะทำงานเมื่อ component ถูกสร้างขึ้น
	init: function () {
		// สร้าง UI element สำหรับแสดงระยะห่างรวม
		const distanceDisplay = document.createElement("div");
		distanceDisplay.id = "distance-display"; // กำหนด id
		distanceDisplay.style.position = "fixed"; // กำหนดตำแหน่งแบบคงที่
		distanceDisplay.style.top = "10px"; // ห่างจากด้านบน 10px
		distanceDisplay.style.left = "10px"; // ห่างจากด้านซ้าย 10px
		distanceDisplay.style.background = "rgba(0,0,0,0.7)"; // พื้นหลังสีดำโปร่งใส
		distanceDisplay.style.color = "white"; // ตัวอักษรสีขาว
		distanceDisplay.style.padding = "10px"; // ระยะห่างขอบใน 10px
		distanceDisplay.style.fontFamily = "Arial, sans-serif"; // กำหนดฟอนต์
		distanceDisplay.style.zIndex = "999"; // กำหนดลำดับการซ้อนทับ
		document.body.appendChild(distanceDisplay); // เพิ่ม element เข้าไปใน body

		// สร้าง UI element สำหรับแสดงระยะห่างแต่ละแกน
		const axisDisplay = document.createElement("div");
		axisDisplay.id = "axis-display"; // กำหนด id
		axisDisplay.style.position = "fixed"; // กำหนดตำแหน่งแบบคงที่
		axisDisplay.style.bottom = "10px"; // ห่างจากด้านล่าง 10px
		axisDisplay.style.left = "10px"; // ห่างจากด้านซ้าย 10px
		axisDisplay.style.background = "rgba(0,0,0,0.7)"; // พื้นหลังสีดำโปร่งใส
		axisDisplay.style.color = "white"; // ตัวอักษรสีขาว
		axisDisplay.style.padding = "10px"; // ระยะห่างขอบใน 10px
		axisDisplay.style.fontFamily = "Arial, sans-serif"; // กำหนดฟอนต์
		axisDisplay.style.zIndex = "999"; // กำหนดลำดับการซ้อนทับ
		document.body.appendChild(axisDisplay); // เพิ่ม element เข้าไปใน body

		// เก็บ reference ไปยัง marker, camera และ display elements
		this.marker = document.querySelector("a-marker");
		this.camera = document.querySelector("a-entity[camera]");
		this.distanceDisplay = distanceDisplay;
		this.axisDisplay = axisDisplay;
	},

	// ฟังก์ชัน tick จะทำงานทุกเฟรม
	tick: function () {
		// ตรวจสอบว่า marker ปรากฏอยู่ในภาพหรือไม่
		if (this.marker.object3D.visible) {
			const markerPosition = this.marker.object3D.position; // ตำแหน่งของ marker
			const cameraPosition = this.camera.object3D.position; // ตำแหน่งของกล้อง

			// คำนวณระยะห่างรวมระหว่างกล้องและ marker
			const distance = markerPosition.distanceTo(cameraPosition);
			this.distanceDisplay.textContent = `ระยะห่างรวม: ${distance.toFixed(2)} เมตร`;

			// คำนวณระยะห่างในแต่ละแกน x, y, z โดยไม่ใช้ Math.abs()
			const xDist = markerPosition.x - cameraPosition.x;
			const yDist = markerPosition.y - cameraPosition.y;
			const zDist = markerPosition.z - cameraPosition.z;

			// อัพเดทค่า Global
			window.markerDistance.x = xDist;
			window.markerDistance.y = yDist;
			window.markerDistance.z = zDist;

			// แสดงระยะห่างในแต่ละแกน
			this.axisDisplay.innerHTML = `
          ระยะห่างตามแกน:<br>
          X: ${xDist.toFixed(2)} เมตร<br>
          Y: ${yDist.toFixed(2)} เมตร<br>
          Z: ${zDist.toFixed(2)} เมตร
        `;
		}
	},
});
