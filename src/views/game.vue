<template>
    <div></div>
</template>

<script>
export default {
    name: "game",
    mounted() {
        this.init();
    },
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
        };
    },
    methods: {
        init() {
            this.setScece();
            this.setCamera();
            this.setCube();
            this.setAmbienLight();
            this.setDirectionalLight();
            this.setRenderer();

        },
        setCamera() {
            let width  = 10;
            let height = width * (window.innerHeight / window.innerWidth)
            let camera = new this.$three.OrthographicCamera(
               width / -2,
               width / 2,
               height /2 ,
               height / -2,
               1,
               100
            );
            camera.position.set(4,4,4);
            camera.lookAt(0, 0, 0);
            this.camera = camera;
        },
        setScece() {
            let scene = new this.$three.Scene();
            this.scene = scene;
        },
        setRenderer() {
            let renderer = new this.$three.WebGLRenderer({
                antialias:true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(this.scene,this.camera);
            document.body.appendChild(renderer.domElement);
            this.renderer = renderer;
        },
        setCube() {
            const geometry = new this.$three.BoxGeometry(3, 1, 3);
            const material = new this.$three.MeshLambertMaterial({
                color: 0xfb8e00,
            });
            const mesh = new this.$three.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            this.scene.add(mesh);
        },
        setAmbienLight() {
            const ambientLight = new this.$three.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
        },
        setDirectionalLight() {
            const directionalLight = new this.$three.DirectionalLight(
                0xffffff,
                0.6
            );
            directionalLight.position.set(10,20,0);
            this.scene.add(directionalLight);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>