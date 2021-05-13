<template>
  <canvas class="webgl"></canvas>
</template>

<script>
import AxisGridHelper from "../build/axisGridHelper";
import {GUI} from "dat.gui";


export default {
  name: "SceneGraph",
  mounted() {
    this.main();
  },
  methods: {
    main() {
      const scene = new this.$three.Scene();
      const canvas = document.querySelector("canvas.webgl");
      const renderer = new this.$three.WebGLRenderer({
        canvas
      });
      const gui = new GUI();
      this.gui = gui;
      const sizes = {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      };
      const camera = new this.$three.PerspectiveCamera(
          45,
          sizes.width / sizes.height,
          0.1,
          3000
      );
      camera.position.set(-100, 50, 0);
      camera.lookAt(0, 0, 0);

      const objects = [];
      const radius = 1;
      const widthSegments = 60;
      const heightSegments = 60;
      const sphereGeometry = new this.$three.SphereGeometry(
          radius,
          widthSegments,
          heightSegments
      );


      const track = new this.$three.Mesh(new this.$three.RingGeometry(20, 20 + 0.5, 64, 1), new this.$three.MeshBasicMaterial({
        side: this.$three.DoubleSide
      }));
      track.rotation.x = - Math.PI / 2;
      scene.add(track);
      const color = 0xffffff;
      const intensity = 3;
      const light = new this.$three.PointLight(color, intensity);
      scene.add(light);
      // 创建太阳系
      const {solarOrbit, sunMesh} = this.createSolarOrbit(sphereGeometry);
      const {earthOrbit, earthMesh} = this.createEarthOrbit(sphereGeometry);
      const {moonOrbit, moonMesh} = this.createMoonOrbit(sphereGeometry);

      objects.push(solarOrbit);
      objects.push(sunMesh);
      objects.push(earthMesh);
      objects.push(earthOrbit);
      objects.push(moonMesh);
      objects.push(moonOrbit);

      earthOrbit.add(moonOrbit);
      solarOrbit.add(earthOrbit);
      scene.add(solarOrbit)

      const ringGeometry = new this.$three.RingGeometry( 1, 5, 32 );
      const ringMaterial = new this.$three.MeshPhongMaterial( { color: 0xffff00, side: this.$three.DoubleSide } );
      const mesh = new this.$three.Mesh( ringGeometry, ringMaterial );
      scene.add( mesh );

      renderer.render(scene, camera);
      renderer.shadowMap.enabled = true; //辅助线
      renderer.shadowMapSoft = true; //柔和阴影
      renderer.setClearColor(0xffffff, 0);

      this.makeAxisGrid(solarOrbit, 'solarSystem', 25);
      this.makeAxisGrid(sunMesh, 'sunMesh');
      this.makeAxisGrid(earthOrbit, 'earthOrbit');
      this.makeAxisGrid(earthMesh, 'earthMesh');
      this.makeAxisGrid(moonOrbit, 'moonOrbit');
      this.makeAxisGrid(moonMesh, 'moonMesh');
      requestAnimationFrame(
          this.render.bind(this, renderer, scene, camera, objects)
      );
    },
    createEarthOrbit(sphereGeometry) {
      const earthOrbit = new this.$three.Object3D();
      earthOrbit.position.x = 10;
      const earthMaterial = new this.$three.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
      });
      const earthMesh = new this.$three.Mesh(sphereGeometry, earthMaterial);
      earthOrbit.add(earthMesh);
      return {earthOrbit, earthMesh}
    },
    createSolarOrbit(sphereGeometry) {
      // 创建一个空的场景图节点
      const solarOrbit = new this.$three.Object3D();

      const sunMaterial = new this.$three.MeshPhongMaterial({
        emissive: 0xffff00,
      });
      const sunMesh = new this.$three.Mesh(sphereGeometry, sunMaterial);
      sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
      solarOrbit.add(sunMesh);
      return {
        solarOrbit,
        sunMesh
      }
    },
    createMoonOrbit(sphereGeometry) {
      const moonOrbit = new this.$three.Object3D();
      moonOrbit.position.x = 2;
      const moonMaterial = new this.$three.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})
      const moonMesh = new this.$three.Mesh(sphereGeometry, moonMaterial)
      moonMesh.scale.set(.5, .5, .5);
      moonOrbit.add(moonMesh)
      return {moonOrbit, moonMesh}
    },

    makeAxisGrid(node, label, units) {
      const helper = new AxisGridHelper(node, units);
      this.gui.add(helper, 'visible').name(label);
    },

    resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      const needResize =
          canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    },

    render() {
      const renderer = arguments[0],
          scene = arguments[1],
          camera = arguments[2],
          objects = arguments[3];
      let time = arguments[arguments.length - 1];
      time *= 0.001;
      if (this.resizeRendererToDisplaySize(renderer)) {
        camera.updateProjectionMatrix();
      }
      objects.forEach((obj) => {
        obj.rotation.y = time;

      });
      renderer.render(scene, camera);
      requestAnimationFrame(
          this.render.bind(this, renderer, scene, camera, objects)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.webgl {
  height: 100%;
  width: 100%;
}
</style>