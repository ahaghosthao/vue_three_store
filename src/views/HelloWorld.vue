<template>
    <div></div>
</template>

<script>
import * as dat from "dat.gui";

const controls = new (function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
})();
const gui = new dat.GUI();
gui.add(controls, "rotationSpeed", 0, 0.5);
gui.add(controls, "bouncingSpeed", 0, 0.5);
export default {
    name: "HelloWorld",
    mounted() {
        this.init();
        this.renderer.setClearColor(new this.$three.Color(0x000000));

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        
        const axes = new this.$three.AxesHelper(20);
        this.scene.add(axes);

        const planeGeometry = new this.$three.PlaneGeometry(60, 20);
        const planeMaterial = new this.$three.MeshLambertMaterial({
            color: 0xaaaaaa,
        });

        const plane = new this.$three.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        plane.receiveShadow = true;
        this.scene.add(plane);

        const cubeGeometry = new this.$three.BoxGeometry(4, 4, 4);
        const cubeMaterial = new this.$three.MeshLambertMaterial({
            color: 0xff0000,
        });
        const cube = new this.$three.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        cube.castShadow = true;
        this.scene.add(cube);

        const sphereGeometry = new this.$three.SphereGeometry(4, 20, 20);
        const sphereMaterial = new this.$three.MeshLambertMaterial({
            color: 0x7777ff,
        });
        const sphere = new this.$three.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 4, 2);
        sphere.castShadow = true;
        this.scene.add(sphere);

        const spotLight = new this.$three.SpotLight(0xffffff);
        spotLight.position.set(-40, 40, -15);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize = new this.$three.Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;
        this.scene.add(spotLight);

        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(this.scene.position);
        document.body.appendChild(this.renderer.domElement);

        let step = 0;

          window.addEventListener("resize", onResize1.bind(this), false);

        function onResize1 () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        const renderScene = function () {
            cube.rotation.x += controls.rotationSpeed;
            cube.position.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            step += controls.bouncingSpeed;

            sphere.position.x = 20 + 10 * Math.cos(step);
            sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(renderScene);
        }.bind(this);

        renderScene();

      
    },
    data() {
        return {
            scene: null,
            renderer: null,
            camera: null,
        };
    },
    methods: {
        init() {
            this.setScene();
            this.setCamera();
            this.setRenderer();
        },
        setScene() {
            this.scene = new this.$three.Scene();
        },
        setCamera() {
            let camera = new this.$three.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                1,
                500
            );
            camera.position.set(0, 0, 100);
            camera.lookAt(0, 0, 0);
            this.camera = camera;
        },
        setRenderer() {
            let renderer = new this.$three.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            this.renderer = renderer;
        },
    },
};
</script>

<style lang="less" scoped>
</style>