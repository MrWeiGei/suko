<template>
  <div style="width:100%">
    <heads title="房屋信息"></heads>
    <div>
      <el-form label-position="top" label-width="80px" :model="info" ref="info" :rules="rules">
        <el-form-item label="经营模式" prop="commMode">
          <el-select v-model="info.commMode" placeholder="请选择" class="info">
            <el-option label="自营房屋" value="0"></el-option>
            <el-option label="开放式房屋" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form label-position="top" label-width="80px" :model="city" ref="city" :rules="rule">
          <el-form-item label="房屋所在城市" prop="commCity">
            <el-cascader v-model="city.commCity" :props="props" class="info"></el-cascader>
          </el-form-item>
        </el-form>
        <el-form-item label="详细地址" prop="commHouseAddress">
          <el-input v-model="info.commHouseAddress" class="info" @blur="searchAddress"></el-input>
        </el-form-item>
        <el-form-item label="补充说明(选填)">
          <el-input v-model="info.commAddressRemark" class="info"></el-input>
        </el-form-item>
        <el-form-item label="门牌号(选填)">
          <el-input v-model="info.commRoomNum" class="info"></el-input>
        </el-form-item>
        <el-form-item label="地图定位">
          审核通过后不可修改。房客会根据此位置来找到您，拖动地图完成精准定位，不可定位在水里、路上等。
          <div id="container"></div>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="danger" @click="save('info')">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
var flag = false;
import heads from "./components/head";
import { createOne } from "@/api/goods/home";
import { getCity } from "@/api/city";
let id = 0;
export default {
  components: { heads },
  props: {
    index: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level == 0) {
            getCity({ parentId: 0 }).then(res => {
              var data = res.res;
              var arr = [];
              data.forEach(i => {
                arr.push({
                  value: i.cityName,
                  label: i.cityName,
                  id: i.id,
                  leaf: level >= 2
                });
              });
              resolve(arr);
            });
          } else {
            var id = node.data.id;
            getCity({ parentId: id }).then(res => {
              var data = res.res;
              var arr = [];
              data.forEach(i => {
                arr.push({
                  value: i.cityName,
                  label: i.cityName,
                  id: i.id,
                  leaf: level >= 2
                });
              });
              resolve(arr);
            });
          }
        }
      },
      info: {
        commMode: "0",
        commHouseAddress: ""
      },
      city: {
        commCity: []
      },
      rule: {
        commCity: [
          { required: true, message: "请选择所在城市", trigger: "blur" }
        ]
      },
      rules: {
        commMode: [
          { required: true, message: "请选择房屋类型", trigger: "blur" }
        ],
        commHouseAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ]
      },
      positionPicker: {},
      mapObj: {}
    };
  },
  methods: {
    initMap() {
      var that = this;
      AMapUI.loadUI(["misc/PositionPicker"], function(PositionPicker) {
        var map = new AMap.Map("container", {
          resizeEnable: true,
          center: [108.880797, 34.19484],
          zoom: 13
        });
        var positionPicker = new PositionPicker({
          mode: "dragMap", //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: map //依赖地图对象
        });
        that.positionPicker = positionPicker;

        that.positionPicker.on("success", function(positionResult) {
          if (positionResult.info == "OK") {
            that.makeInfo(positionResult.address, positionResult.position);
          }
        });
        //TODO:事件绑定、结果处理等
        that.mapObj = map;
        AMap.plugin(["AMap.ToolBar"], function() {
          //异步同时加载多个插件
          var toolbar = new AMap.ToolBar();
          map.addControl(toolbar);
        });
      });

      // var toolbar = new AMap.ToolBar();
      // this.mapObj.plugin(toolbar);
    },
    makeCity() {
      var city = "";
      this.city.commCity.forEach(i => {
        city += i;
      });
      return city;
    },
    getCity() {
      for (var i = 0; i < this.city.commCity.length; i++) {
        if (this.city.commCity[i].indexOf("市") != -1) {
          return this.city.commCity[i];
        }
      }
    },
    searchAddress() {
      var marker = false;
      var that = this;
      that.mapObj.clearMap();
      var city = this.makeCity();
      var address = city + this.info.commHouseAddress;
      AMap.plugin("AMap.Geocoder", function() {
        var geocoder = new AMap.Geocoder({
          city: "全国"
        });
        geocoder.getLocation(address, function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // result中对应详细地理坐标信息
            var lnglat = result.geocodes[0].location;
            if (!marker) {
              marker = new AMap.Marker({});
              that.mapObj.add(marker);
            }
            marker.setPosition(lnglat);
            that.mapObj.setFitView(marker);
            that.makeInfo(address, marker.getPosition());
            AMap.event.addListener(marker, "click", function() {
              if (!flag) {
                that.closeInfoWindow();
                flag = true;
              } else {
                that.makeInfo(
                  that.info.city + that.info.address,
                  marker.getPosition()
                );
                flag = false;
              }
            });
          }
        });
        // 使用geocoder做地理/逆地理编码
      });
    },
    makeInfo(address, lnglat) {
      var that = this;

      var infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: that.createInfoWindow(address),
        offset: new AMap.Pixel(16, -45)
      });
      infoWindow.open(that.mapObj, lnglat);
    },
    createInfoWindow(address) {
      var info = document.createElement("div");
      info.style.backgroundColor = "white";
      info.style.padding = "15px 30px";
      info.style.border = "1px solid #ccc";
      info.style.borderRadius = "5px";
      info.style.width = "300px";
      //可以通过下面的方式修改自定义窗体的宽高
      //info.style.width = "400px";
      // 定义顶部标题
      var top = document.createElement("div");
      var titleD = document.createElement("div");
      titleD.innerHTML = "提示";
      top.className = "info-top";
      top.appendChild(titleD);
      info.appendChild(top);

      var middle = document.createElement("div");
      middle.style.backgroundColor = "white";
      middle.innerHTML = address;
      info.appendChild(middle);
      var bottom = document.createElement("div");
      bottom.className = "info-bottom";
      bottom.style.position = "absolute";
      bottom.style.top = "92%";
      bottom.style.left = "44%";
      bottom.style.margin = "0 auto";
      var sharp = document.createElement("img");
      sharp.src = "https://webapi.amap.com/images/sharp.png";
      bottom.appendChild(sharp);
      info.appendChild(bottom);
      return info;
    },
    closeInfoWindow() {
      this.mapObj.clearInfoWindow();
    },
    save(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.info.commCity = this.getCity();
          this.$store.dispatch(
            "home/addIndexTrue",
            parseInt(this.$props.index)
          );
          this.info.commCity = "西安市";
          if (this.$store.getters.id == "-1") {
            createOne(this.info).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.$store.dispatch("home/updateId", res.res.id);
                this.$emit("next", {
                  index: String(parseInt(this.$props.index) + 1),
                  to: "infrastructure"
                });
              }
            });
          } else {
            this.info.id = this.$store.getters.id;
            createOne(this.info).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.$emit("next", {
                  index: String(parseInt(this.$props.index) + 1),
                  to: "infrastructure"
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>

<style lang="scss" scoped>
.info {
  width: 500px !important;
}

#container {
  width: 95%;
  height: 380px;
}
.btn {
  text-align: center;
  padding-top: 20px;

  button {
    width: 150px;
  }
}
</style>

