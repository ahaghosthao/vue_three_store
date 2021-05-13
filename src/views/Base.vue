<template>
    <canvas id="webgl"></canvas>
</template>

<script>
export default {
    name: "Base",
    mounted() {
        this.init();
        this.main(this.camera, this.renderer, this.scene);
    },
    methods: {
        init() {
            this.canvas = document.querySelector("canvas#webgl");
            this.setScene();
            this.setRenderer(this.canvas);
            this.setPerspectiveCamera();
        },
        /**
         * 设置一个场景
         */
        setScene() {
            this.scene = new this.$three.Scene();
            this.scene.background = new this.$three.Color(0xAAAAAA);
        },
        /**˚
         * 设置渲染器
         */
        setRenderer(canvas) {
            const renderer = new this.$three.WebGLRenderer({ canvas });
            this.renderer = renderer;
        },

        setPerspectiveCamera() {
            const fav = 75,
                aspect = 2,
                near = 0.1,
                far = 500;
            const perspectivaCamera = new this.$three.PerspectiveCamera(
                fav,
                aspect,
                near,
                far
            );
            perspectivaCamera.position.z = 400;
            this.camera = perspectivaCamera;
        },

        main(camera, renderer, scene) {
            /**
             * add light
             */
            const color = 0xffffff;
            const intensity = 1;
            const light = new this.$three.DirectionalLight(color, intensity);
            light.position.set(4, 4, 4);
            scene.add(light);

            const boxWidth = 100;
            const boxHeight = 100;
            const boxDepth = 100;
            const geometry = new this.$three.BoxGeometry(
                boxWidth,
                boxHeight,
                boxDepth
            );

            const cubes = [
                this.makeInstance(geometry, 0x44aa88, 0),
                this.makeInstance(geometry, 0xaa8844, 200),
                this.makeInstance(geometry, 0x8844aa, -200),
            ];

            requestAnimationFrame(
                this.render.bind(this, cubes, renderer, scene, camera)
            );
        },

        render() {
            const cubes = arguments[0];
            const renderer = arguments[1];
            const scene = arguments[2];
            const camera = arguments[3];
            let time = arguments[4];
            time *= 0.001;

            cubes.forEach((cube, ndx) => {
                const speed = 1 + ndx * 0.1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });
            if (this.resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
            renderer.render(scene, camera);
            requestAnimationFrame(
                this.render.bind(this, cubes, renderer, scene, camera)
            );
        },

        makeInstance(geometry, color, x) {
            const material = new this.$three.MeshPhongMaterial({ color });
            const cube = new this.$three.Mesh(geometry, material);
            this.scene.add(cube);
            cube.position.x = x;
            return cube;
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
    },
};
</script>

<style lang="scss" scoped>
#webgl {
    width: 100%;
    height: 100%;
    display: block;
}
</style>