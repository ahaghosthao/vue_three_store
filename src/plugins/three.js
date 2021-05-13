import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const ThreeBSP = require('jthreebsp')(THREE)

let ThreePlugin = {
    install: function (Vue) {
        Vue.prototype.$three = THREE;
        Vue.prototype.$threeBSP = ThreeBSP;
        Vue.mixin({
            data() {
                return {
                    scene: null,
                    renderer: null,
                    camera: null,
                    canvas: null,
                    orbitControl: null,
                    objects: [],
                    stats: null
                }
            },

            methods: {
                initMain() {
                    this.initScene();
                    this.initCamera();
                    this.initRenderer();
                    this.initOrbitControl();
                    this.initLight();
                },
                initScene() {
                    this.scene = new this.$three.Scene();
                },

                initRenderer() {
                    this.renderer = new this.$three.WebGLRenderer(
                        {
                            antialias: true,//是否开启反锯齿，设置为true开启反锯齿。
                            alpha: true,//是否可以设置背景色透明。
                            logarithmicDepthBuffer: true//模型的重叠部位便不停的闪烁起来。这便是Z-Fighting问题，为解决这个问题，我们可以采用该种方法
                        }
                    );
                    this.renderer.setSize(window.innerWidth, window.innerHeight);//渲染器的尺寸与windows的尺寸相同
                    this.renderer.setClearColor(0x39609B);//设置渲染的背景颜色
                    this.renderer.setPixelRatio(window.devicePixelRatio);//设置渲染器的分辨率与浏览器电脑本身的分辨率相同
                    //将渲染器添加到我们的网页中，可以将渲染的内容在网页中显示出来
                    let container = document.getElementById("container");
                    container.appendChild(this.renderer.domElement);
                },
                initCamera() {
                    //声明一个透视相机，
                    // 视角：60，
                    // 纵横比aspect:全屏，使用的是浏览器的宽度/高度
                    //近平面near：0.1
                    //远平面视角far:10000

                    this.camera = new this.$three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
                    /*
                    设置相机位置，注意threejs中的坐标系采用的是右手坐标系
                     */
                    this.camera.position.x = 0;
                    this.camera.position.y = 1600;
                    this.camera.position.z = 1000;
                    //相机的朝向
                    this.camera.lookAt(0, 0, 0);
                    //将相机放到场景中
                    this.scene.add(this.camera);

                },
                initLight() {
                    let ambient = new this.$three.AmbientLight(0xffffff, 1); //AmbientLight,影响整个场景的光源
                    ambient.position.set(0, 0, 0);
                    this.addObject(ambient);
                    //添加平行光,平行光类似于太阳光
                    let directionalLight = new this.$three.DirectionalLight(0xffffff, 0.3);//模拟远处类似太阳的光源
                    directionalLight.position.set(0, 200, 0);
                    this.addObject(directionalLight);
                    //设置点光源
                    let pointLight1 = new this.$three.PointLight(0xffffff, 0.3);
                    pointLight1.position.set(-500, 200, 0);
                    this.addObject(pointLight1);
                    let pointLight2 = new this.$three.PointLight(0xffffff, 0.3);
                    pointLight2.position.set(500, 200, 0);
                    this.addObject(pointLight2);
                },
                addObject(object) {
                    this.scene.add(object);
                    this.objects.push(object);
                },
                initOrbitControl() {
                    this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
                    this.orbitControl.enableDamping = true;
                    this.orbitControl.dampingFactor = 0.5;
                    // 视角最小距离
                    this.orbitControl.minDistance = 0;
                    // 视角最远距离
                    this.orbitControl.maxDistance = 4000;
                    // 最大角度
                    this.orbitControl.maxPolarAngle = Math.PI / 2.2;
                },
                animate() {
                    requestAnimationFrame(this.animate.bind(this));
                    this.stats.begin();
                    this.orbitControl.update();
                    this.stats.end();
                    this.renderer.render(this.scene, this.camera);
                },
                async createMaterial(materialOptions, textureLoaderOptions) {
                    if (textureLoaderOptions) {
                        if (textureLoaderOptions.image) {
                            materialOptions.map = await this.createTexture(textureLoaderOptions)
                        }
                    }
                    return new this.$three.MeshPhongMaterial(materialOptions)
                },
                 async createTexture(textureLoaderOptions) {
                    const textureLoader = new this.$three.TextureLoader();
                    const texture =  await textureLoader.load(textureLoaderOptions.image);
                     if (textureLoaderOptions.allowRepeat) {
                         texture.repeat.x = textureLoaderOptions.repeatX;
                         texture.repeat.y = textureLoaderOptions.repeatY;
                         texture.wrapS = texture.wrapT = this.$three.RepeatWrapping;
                     }
                     return texture
                },

                async createCube(options) {
                    const geo = new this.$three.BoxGeometry(options.length || 1, options.height || 1, options.width || 1);
                    let material = await this.createMaterial(options.materialOption,options.textureOption)
                    let cube = new this.$three.Mesh(geo, material);
                    cube.name = options.name;
                    cube.position.x = options.positionX || 0;
                    cube.position.y = options.positionY || 0;
                    cube.position.z = options.positionZ || 0;
                    return cube;
                }
            }
        })
    }
}

export default ThreePlugin
