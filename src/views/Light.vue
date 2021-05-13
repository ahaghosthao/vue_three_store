<template>
  <canvas id="Light"></canvas>
</template>

<script>
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GUI} from "dat.gui";


export default {
  name: "Light",
  mounted() {
    this.init();
  },
  methods: {
    init(){
      const canvas = document.querySelector('canvas#Light');
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const scene = new this.$three.Scene();
      scene.background = new this.$three.Color('black');
      const renderer = new this.$three.WebGLRenderer({
        canvas
      })
      renderer.setSize(window.innerWidth,window.innerHeight)
      const camera = new this.$three.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,100);
      camera.position.set(0,10,20);

      const controls = new OrbitControls(camera, canvas);
      controls.target.set(0, 5, 0);
      controls.update();

      const planeSize = 40;

      const loader = new this.$three.TextureLoader();
      const texture = loader.load(require('../assets/img/checker.png'),(texture)=>{
        console.log(texture)
      });
      texture.wrapS = this.$three.RepeatWrapping;
      texture.wrapT = this.$three.RepeatWrapping;
      texture.magFilter = this.$three.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new this.$three.PlaneGeometry(planeSize, planeSize);
      const planeMat = new this.$three.MeshPhongMaterial({
        map: texture,
        side: this.$three.DoubleSide,
      });
      const mesh = new this.$three.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -.5;
      scene.add(mesh)
      class ColorGUIHelper {
        constructor(object, prop) {
          this.object = object;
          this.prop = prop;
        }
        get value() {
          return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
          this.object[this.prop].set(hexString);
        }
      }

        // // const color = 0xFFFFFF;
        // const skyColor = 0xB1E1FF;  // light blue
        // const groundColor = 0xB97A20;  // brownish orange
        // const intensity = 1;
        // // const light = new this.$three.AmbientLight(color, intensity);
        // const light = new this.$three.HemisphereLight(skyColor, groundColor, intensity);
        // scene.add(light);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new this.$three.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);

        const helper = new this.$three.DirectionalLightHelper(light);
        scene.add(helper);
        function updateLight() {
          light.target.updateMatrixWorld();
          helper.update();
        }
        updateLight();

        function makeXYZGUI(gui, vector3, name, onChangeFn) {
          const folder = gui.addFolder(name);
          folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
          folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
          folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
          folder.open();
        }
        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
        // gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
        gui.add(light, 'intensity', 0, 2, 0.01);
        gui.add(light.target.position,'x',-10,10);
        gui.add(light.target.position,'x',-10,10);
        gui.add(light.target.position,'z',-10,10);
        gui.add(light.target.position,'y',0,10);

        makeXYZGUI(gui, light.position, 'position', updateLight);
        makeXYZGUI(gui, light.target.position, 'target', updateLight);

      const cubeSize = 4;
      const cubeGeo = new this.$three.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new this.$three.MeshPhongMaterial({color: '#8AC'});
      const cubeMesh = new this.$three.Mesh(cubeGeo, cubeMat);
      cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      scene.add(cubeMesh);

      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new this.$three.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new this.$three.MeshPhongMaterial({color: '#CA8'});
      const sphereMesh = new this.$three.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      scene.add(sphereMesh);

      // function resizeRendererToDisplaySize(renderer) {
      //   const canvas = renderer.domElement;
      //   const width = canvas.clientWidth;
      //   const height = canvas.clientHeight;
      //   const needResize = canvas.width !== width || canvas.height !== height;
      //   if (needResize) {
      //     renderer.setSize(width, height, false);
      //   }
      //   return needResize;
      // }

      function render() {

        // if (resizeRendererToDisplaySize(renderer)) {
        //   const canvas = renderer.domElement;
        //   camera.aspect = canvas.clientWidth / canvas.clientHeight;
        //   camera.updateProjectionMatrix();
        // }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);

    }
  }
}
</script>

<style scoped>

</style>