<template>
  <div style="width:100%">
    <heads title="制定规则" small="请注明您的房屋入住相关说明，以保证能收到合适的订单"></heads>
    <div>
      <el-form label-position="top" label-width="80px" :model="info" ref="info" :rules="rules">
        <el-row>
          <el-col :span="6">
            <el-form-item label="房客入住时间" prop="rulePersonInTime">
              <el-time-picker
                format="HH:mm"
                value-format="HH:mm"
                v-model="info.rulePersonInTime"
                placeholder="请选择入住时间"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="房客退房时间" prop="rulePersonOutTime">
              <el-time-picker
                format="HH:mm"
                value-format="HH:mm"
                v-model="info.rulePersonOutTime"
                placeholder="请选择退房时间"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="接待房客的时间">
          <el-col v-for="i in ruleReceivePeriod" :key="i.index" style="margin:8px 0">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              is-range
              v-model="i.time"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-col>
          <el-button type="danger" @click="makeTime" style="margin-top:5px">+ 添加接待时间段</el-button>
        </el-form-item>
        <el-form-item label="接待性别" prop="ruleReceiveSex">
          <el-radio-group v-model="info.ruleReceiveSex">
            <el-radio :label="2">不限</el-radio>
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接待年龄段" prop="ruleReceiveAge">
          <el-checkbox-group v-model="info.ruleReceiveAge" class="info">
            <el-checkbox label="儿童(0-12岁)"></el-checkbox>
            <el-checkbox label="老人(65岁以上)"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <span class="title">打扫换洗方式</span>
        <el-row>
          <el-col :span="6">
            <el-form-item label="多久提供打扫卫生" prop="langClear">
              <el-select v-model="ruleWashWay.langClear" placeholder="请选择" class="info">
                <el-option label="一客一扫" value="0"></el-option>
                <el-option label="一天一扫" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="多久提供被单更换" prop="langChange">
              <el-select v-model="ruleWashWay.langChange" placeholder="请选择" class="info">
                <el-option label="一客一换" value="0"></el-option>
                <el-option label="一天一换" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="对房客要求" prop="ruleRequire">
          <el-checkbox-group v-model="info.ruleRequire" class="info">
            <el-checkbox v-for="i in requireOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="danger" @click="save('info')">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import heads from "./components/head";
import { createOne } from "@/api/goods/home";
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
      info: {
        rulePersonInTime: "12:00:00", //房客入住时间
        rulePersonOutTime: "14:00:00", //房客退房时间
        ruleReceivePeriod: "", //接待时间段
        ruleReceiveSex: 0, //接待性别
        ruleReceiveAge: [], //接待年龄段
        ruleRequire: [], //对房客要求
        ruleWashWay: "" //换洗方式
      },
      ruleReceivePeriod: [
        {
          time: ["8:00", "14:00"]
        }
      ],
      ruleWashWay: {
        langClear: "",
        langChange: ""
      },
      requireOption: [
        {
          label: "允许吸烟"
        },
        {
          label: "允许带宠物"
        },
        {
          label: "允许做饭"
        },
        {
          label: "允许聚会"
        },
        {
          label: "允许加入"
        },
        {
          label: "允许商业拍照"
        },
        {
          label: "允许客房加床"
        }
      ],
      rules: {
        rulePersonInTime: [
          { required: true, message: "请选择房客入住时间", trigger: "change" }
        ],
        rulePersonOutTime: [
          { required: true, message: "请选择房客入住时间", trigger: "change" }
        ],
        ruleReceiveSex: [
          { required: true, message: "请选择接待年龄段", trigger: "change" }
        ],
        ruleReceiveAge: [
          { required: true, message: "请选择接待性别", trigger: "change" }
        ],
        ruleRequire: [
          {
            required: true,
            message: "请选择对房客要求",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    makeTime() {
      this.ruleReceivePeriod.push({
        time: ""
      });
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.info.ruleReceivePeriod = JSON.stringify(this.ruleReceivePeriod);
          this.info.ruleWashWay = JSON.stringify(this.ruleWashWay);
          this.info.ruleReceiveAge = JSON.stringify(this.info.ruleReceiveAge);
          this.info.ruleRequire = JSON.stringify(this.info.ruleRequire);
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
                to: "servers"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  color: #606266;
  font-weight: bolder;
}

.some {
  width: 140px;
  height: 36px;
  padding-left: 20px;
  background: rgba(250, 250, 250, 1);
  border: 1px solid rgba(243, 243, 243, 1);
  border-radius: 4px;
}
.btn {
  text-align: center;
  padding-top: 20px;

  button {
    width: 150px;
  }
}
</style>
