<template>
  <div style="width:100%">
    <heads title="管家服务" small="请注明您的房屋入住相关说明，以保证能收到合适的订单"></heads>
    <div>
      <el-form label-position="top" label-width="80px" :model="serviceInfo" ref="serviceInfo">
        <el-form-item label="是否能为房客提供家庭管家服务">
          <el-radio-group v-model="serviceInfo.homeService">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否能保证房屋清洁达标">
          <el-radio-group v-model="serviceInfo.clear">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十分钟内响应服务">
          <el-radio-group v-model="serviceInfo.responseServer">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="能够提供以下基础服务">
          <el-checkbox-group v-model="serviceInfo.basicService">
            <el-checkbox label="礼仪"></el-checkbox>
            <el-checkbox label="唤醒"></el-checkbox>
            <el-checkbox label="保洁"></el-checkbox>
            <el-checkbox label="跑腿"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="增值服务">
          <el-checkbox-group v-model="serviceInfo.addedServices">
            <el-checkbox label="旅拍"></el-checkbox>
            <el-checkbox label="导游"></el-checkbox>
            <el-checkbox label="特产"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="城市管家服务">
          <el-checkbox-group v-model="serviceInfo.cityService">
            <el-checkbox label="接送"></el-checkbox>
            <el-checkbox label="专车"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="上传相关服务人员证件（专业度展示）">
          <upload @success="success" :url="picUrl"/>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="danger" @click="save('serviceInfo')">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import heads from "./components/head";
import upload from "@/components/Upload";
import { createOne } from "@/api/goods/home";
import { mapGetters } from "vuex";
export default {
  components: { heads, upload },
  props: {
    index: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      info: {
        serviceInfo: ""
      },
      serviceInfo: {
        homeService: 0,
        clear: 0,
        responseServer: 0,
        basicService: ["保洁"],
        addedServices: [],
        cityService: [],
        card: []
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.info.serviceInfo = JSON.stringify(this.serviceInfo);
          this.info.id = this.$store.getters.id;
          createOne(this.info).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.$store.dispatch(
                "home/addIndexTrue",
                parseInt(this.$props.index)
              );
              this.$emit("next", {
                index: String(parseInt(this.$props.index) + 1),
                to: "price"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    success(e) {
      this.serviceInfo.card.push(e.response.url);
    }
  },
  computed: {
    ...mapGetters(["picUrl"])
  }
};
</script>

<style lang="scss" scoped>
.btn {
  text-align: center;
  padding-top: 20px;

  button {
    width: 150px;
  }
}
</style>
