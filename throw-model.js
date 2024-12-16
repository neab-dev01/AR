AFRAME.registerComponent("throw-model", {
  schema: {
    defaultPosition: { default: "0 -0.5 -2" },
    scale: { default: "0.05 0.05 0.05" },
  },
  init: function () {
    this.isThrown = false;
    this.throwStartTime = 0;
    this.initialVelocity = 15; // ความเร็วต้น
    this.angle = 45; // มุมยิง (องศา)
    this.gravity = 9.8; // ค่าแรงโน้มถ่วง

    //! สร้าง UI สำหรับแสดงค่าพิกัด ----------------
    const distanceDisplay = document.createElement("div");
    distanceDisplay.style.cssText = `
			position: fixed;
			top: 10px;
			right: 10px;
			background: rgba(0,0,0,0.7);
			color: white;
			padding: 10px;
			z-index: 999;
			border-radius: 5px;
			font-family: Arial, sans-serif;
		`;
    distanceDisplay.innerHTML = `
			<div>ระยะทางแนวนอน: <span id="x-distance">0.00</span> เมตร</div>
			<div>ความสูง: <span id="y-distance">0.00</span> เมตร</div>
		`;
    document.body.appendChild(distanceDisplay);
    //! สร้าง UI สำหรับแสดงค่าพิกัด ----------------

    this.el.addEventListener("loaded", () => {
      // สร้าง UFO entity
      const scene = document.querySelector("a-scene");
      this.ufo = document.createElement("a-entity");

      // ตั้งค่าคุณสมบัติของ UFO
      this.ufo.setAttribute("id", "throwing-ufo");
      this.ufo.setAttribute("gltf-model", "#throwing-model");
      this.ufo.setAttribute("scale", this.data.scale);
      this.ufo.setAttribute("position", this.data.defaultPosition);
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

    // ใช้ค่า power จากตัวแปร Global
    const power = window.throwingPower.value;
    this.initialVelocity = 15 * (power / 100);

    this.isThrown = true;
    this.throwStartTime = Date.now();

    // เริ่ม animation loop
    this.animationLoop = requestAnimationFrame(() => this.updatePosition());
  },

  updatePosition: function () {
    if (!this.isThrown) return;

    const t = (Date.now() - this.throwStartTime) / 1000;
    const angleRad = (this.angle * Math.PI) / 180;

    const v0 = this.initialVelocity;
    const x = -v0 * Math.cos(angleRad) * t;
    const y = v0 * Math.sin(angleRad) * t - 0.5 * this.gravity * t * t;
    const z = -2 + x;

    this.ufo.setAttribute("position", `0 ${y} ${z}`);

    // อัพเดทค่าแสดงผล
    const xDistance = Math.abs(x);
    document.getElementById("x-distance").textContent = xDistance.toFixed(2);
    document.getElementById("y-distance").textContent = y.toFixed(2);

    // เช็คระยะทางและเปลี่ยนสีห่วง
    const ring = document.querySelector("#santa-model");
    
    // ดึงค่าระยะห่างจริงจาก Global variable
    const markerX = Math.abs(window.markerDistance.z);
    const markerY = window.markerDistance.y;
    
    // คำนวณช่วง tolerance 10%
    const toleranceX = markerX * 0.1;
    const minX = markerX - toleranceX;
    const maxX = markerX + toleranceX;

	const toleranceY = markerY * 1;
    const minY = markerY - toleranceY;
    const maxY = markerY + toleranceY;

    // เช็คว่า xDistance อยู่ในช่วง ±10% ของระยะห่างจริง
    if (xDistance >= minX && xDistance <= maxX ) {
      ring.setAttribute("material", "color: #00ff00");
    } else {
      ring.setAttribute("material", "color: #ff0000");
    }

    // เช็คว่าจบการเคลื่อนที่หรือยัง
    if (y < -10 || z < -30) {
      // ถ้าตกถึงพื้นหรือไปไกลเกินไป
      // รีเซ็ต
      this.isThrown = false;
      this.ufo.setAttribute("position", this.data.defaultPosition);
      ring.setAttribute("material", "color: #ff0000"); // รีเซ็ตสีห่วงกลับเป็นสีแดง
      cancelAnimationFrame(this.animationLoop);

      // รีเซ็ตค่าแสดงผล
      document.getElementById("x-distance").textContent = "0.00";
      document.getElementById("y-distance").textContent = "0.00";
    } else {
      // ทำ animation ต่อ
      this.animationLoop = requestAnimationFrame(() => this.updatePosition());
    }
  },
});
