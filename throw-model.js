AFRAME.registerComponent("throw-model", {
	init: function () {
		// สอให้โมเดลโหลดเสร็จก่อน
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
				dur: 5000, // 5 วินาที ต่อ 1 รอบ
				loop: true,
				easing: "linear",
			});

			// เพิ่ม UFO เข้าไปใน camera entity
			const camera = document.querySelector("[camera]");
			camera.appendChild(this.ufo);
		});
	},
});
