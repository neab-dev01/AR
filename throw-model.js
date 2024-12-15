AFRAME.registerComponent("throw-model", {
	init: function () {
		this.isThrown = false;
		this.throwStartTime = 0;
		this.initialVelocity = 15; // ความเร็วต้น
		this.angle = 45; // มุมยิง (องศา)
		this.gravity = 9.8; // ค่าแรงโน้มถ่วง

		this.el.addEventListener("loaded", () => {
			// สร้าง UFO entity
			const scene = document.querySelector("a-scene");
			this.ufo = document.createElement("a-entity");

			// ตั้งค่าคุณสมบัติของ UFO
			this.ufo.setAttribute("id", "throwing-ufo");
			this.ufo.setAttribute("gltf-model", "#throwing-model");
			this.ufo.setAttribute("scale", "0.05 0.05 0.05");
			this.ufo.setAttribute("position", "0 -0.5 -2");
			this.ufo.setAttribute("animation", {
				property: "rotation",
				to: "0 360 0",
				dur: 5000,
				loop: true,
				easing: "linear",
			});

			// เพิ่ม UFO เข้าไปใน camera entity
			const camera = document.querySelector("[camera]");
			camera.appendChild(this.ufo);

			// เพิ่ม event listener สำหรับปุ่มโยน
			const throwButton = document.getElementById("throwButton");
			throwButton.addEventListener("click", () => this.throwObject());
		});
	},

	throwObject: function () {
		if (this.isThrown) return;

		this.isThrown = true;
		this.throwStartTime = Date.now();

		// เริ่ม animation loop
		this.animationLoop = requestAnimationFrame(() => this.updatePosition());
	},

	updatePosition: function () {
		if (!this.isThrown) return;

		const t = (Date.now() - this.throwStartTime) / 1000; // เวลาที่ผ่านไป (วินาที)
		const angleRad = (this.angle * Math.PI) / 180; // แปลงมุมเป็นเรเดียน

		// คำนวณตำแหน่งตามสมการโปรเจคไตล์
		const v0 = this.initialVelocity;
		const x = -v0 * Math.cos(angleRad) * t; // ลบเพราะแกน z คือแนวลึก
		const y = v0 * Math.sin(angleRad) * t - 0.5 * this.gravity * t * t;
		const z = -2 + x; // -2 คือตำแหน่งเริ่มต้นในแกน z

		// อัพเดทตำแหน่ง
		this.ufo.setAttribute("position", `0 ${y - 0.5} ${z}`);

		// เช็คว่าจบการเคลื่อนที่หรือยัง
		if (y < -0.5 || z < -20) {
			// ถ้าตกถึงพื้นหรือไปไกลเกินไป
			// รีเซ็ต
			this.isThrown = false;
			this.ufo.setAttribute("position", "0 -0.5 -2");
			cancelAnimationFrame(this.animationLoop);
		} else {
			// ทำ animation ต่อ
			this.animationLoop = requestAnimationFrame(() => this.updatePosition());
		}
	},
});
