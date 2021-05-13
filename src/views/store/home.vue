<template>
  <div id="container"></div>
</template>

<script>
import floor from "../../assets/img/store/floor.jpg";
import doorLeft from "../../assets/img/store/door_left.png";
import doorRight from "../../assets/img/store/door_right.png";
import Stats from "stats.js";

export default {
  name: "home",
  mounted() {
    this.initMain()
    this.initBuilding(this.buildingData)
    this.initStats();
    this.animate();
  },
  data() {
    return {
      initStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
      },
      buildingData: [
        {
          objectType: 'cube',
          name: 'floor',
          length: 3400,
          width: 1200,
          height: 10,
          positionX: 0,
          positionY: 0,
          positionZ: 0,
          materialOption: {
            color: 0x5F7480,
          },
          textureOption: {
            image: floor,
            allowRepeat: true,
            transparent: false,
            repeatY: 5,
            repeatX: 100
          }
        },
        {
          objectType: 'cube',
          name: 'wallBehind',
          length: 3440,
          width: 20,
          height: 140,
          positionX: 0,
          positionY: 70,
          positionZ: -610,
          materialOption: {
            color: 0x5F7480,
          },
          allowRepeat: false,
          transparent: false
        },
        {
          objectType: 'cube',
          name: 'wallLeft',
          length: 20,
          width: 1200,
          height: 140,
          positionX: -1710,
          positionY: 70,
          positionZ: 0,
          materialOption: {
            color: 0x5F7480,
          },
          allowRepeat: false,
          transparent: false
        },
        {
          objectType: 'cube',
          name: 'wallRight',
          length: 20,
          width: 1200,
          height: 140,
          positionX: 1710,
          positionY: 70,
          positionZ: 0,
          materialOption: {
            color: 0x5F7480,
          },
          allowRepeat: false,
          transparent: false
        },
        {
          objectType: 'cubeGroup',
          main:{
            name: 'wallFront',
            length: 3440,
            width: 20,
            height: 140,
            positionX: 0,
            positionY: 70,
            positionZ: 610,
            materialOption: {
              color: 0x5F7480,
            }
          },
          allowRepeat: false,
          transparent: false,
          children:[
            {
              objectType: 'cube',
              type:'subtract',
              name: 'doorHole',
              length: 200,
              width: 20,
              height: 100,
              positionX: 0,
              positionY: 50,
              positionZ: 610,
              materialOption: {
                color: 0x5F7480,
                transparent: true
              }
            },
            {
              objectType: 'cube',
              name: 'doorLeft',
              type:'add',
              length: 100,
              width: 20,
              height: 100,
              positionX: -50,
              positionY: 50,
              positionZ: 610,
              materialOption: {
                color: 0x5F7480,
                transparent: true,
              },
              textureOption: {
                image: doorLeft,
                allowRepeat: false,
                repeatY: 1,
                repeatX: 1
              }
            },
            {
              objectType: 'cube',
              name: 'doorRight',
              type:'add',
              length: 100,
              width: 20,
              height: 100,
              positionX: 50,
              positionY: 50,
              positionZ: 610,
              materialOption: {
                color: 0x5F7480,
                transparent: true,
              },
              textureOption: {
                image: doorRight,
                allowRepeat: false,
                repeatY: 1,
                repeatX: 1
              }
            }
          ]
        },

      ]
    }
  },
  methods: {
    async initBuilding(buildingData) {
      for (let i = 0; i < buildingData.length; i++) {
        let object = buildingData[i];

        switch (object.objectType) {
          case "cube":
            this.addObject(await this.createCube(object));
            break;
            case "cubeGroup":
              if(await this.createCubeGroup(object)){
                this.addObject(await this.createCubeGroup(object));
              }

        }
      }
    },
    async substractBSP(mainCubeBSP,subCubeBSP,materialOption){
      const resultBSP = mainCubeBSP.subtract(subCubeBSP);
      const result = resultBSP.toMesh(mainCubeBSP.material);
      result.geometry.computeFaceNormals()
      result.geometry.computeVertexNormals()
      result.material = new this.$three.MeshPhongMaterial(materialOption||{color: 0x5F7480})
      return result;
    },
    async createCubeGroup(options) {
      const group = new this.$three.Group();
      let mainCube;
      mainCube = await this.createCube(options.main);
      const mainCubeBSP = new this.$threeBSP(mainCube);
      if(options.children.length===0){
        return false;
      }
      for(let index = 0;index<options.children.length;index++){
        const option = options.children[index];
        console.log(option.type)
        if(option.type === 'add'){
          group.add( await this.createCube(option))
        }else if(option.type === 'subtract'){
          const subCube = await this.createCube(option);
          const subCubeBSP = new this.$threeBSP(subCube);
          mainCube = await this.substractBSP(mainCubeBSP,subCubeBSP);
        }
      }
      group.add(mainCube);
      this.addObject(group);
    }
  }
}
</script>

<style scoped>

</style>