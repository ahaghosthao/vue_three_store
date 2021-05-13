<template>
    <div class="about">
       
    </div>
</template>
<script>
export default {
    name: "about",
    data() {
        return {
            scene: null,
            renderer: null,
            camera: null,
        };
    },
     mounted() {
       this.init();
        const material = this.setMaterial();
        const geometry = this.setGeometry();
        const line = new this.$three.Line(geometry, material);
        const light =  new this.$three.AmbientLight(0xffffff);
        const axios = new this.$three.axiosHelper(500)
        this.scene.add(axios);
        this.scene.add(light);
        this.scene.add(line);
        this.renderer.render(this.scene, this.camera);
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
        setMaterial() {
            const material = new this.$three.LineBasicMaterial({
                color: 0x0000ff,
            });
            return material;
        },
        setGeometry() {
            const points = [];
            points.push(new this.$three.Vector3(-10, 0, 0));
            points.push(new this.$three.Vector3(0, 10, 0));
            points.push(new this.$three.Vector3(10, 0, 0));

            const geometry = new this.$three.BufferGeometry().setFromPoints(
                points
            );
            return geometry;
        },
    },
};
</script>
