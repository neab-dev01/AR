AFRAME.registerComponent('ufo-controller', {
  init: function() {
    // สอให้โมเดลโหลดเสร็จก่อน
    this.el.addEventListener('loaded', () => {
      // สร้าง UFO entity
      const scene = document.querySelector('a-scene');
      this.ufo = document.createElement('a-entity');
      
      // ตั้งค่าคุณสมบัติของ UFO
      this.ufo.setAttribute('id', 'throwing-ufo');
      this.ufo.setAttribute('gltf-model', '#ufo-model');
      this.ufo.setAttribute('scale', '0.2 0.2 0.2');
      this.ufo.setAttribute('position', '0 -0.5 -2');
      
      // เพิ่ม UFO เข้าไปใน camera entity
      const camera = document.querySelector('[camera]');
      camera.appendChild(this.ufo);
    });
  }
}); 