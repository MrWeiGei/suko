<template>
  <div style="width:100%">
    <heads title="价格设置"></heads>
    <el-row class="message">
      <el-col class="small">价格分为基础日期售价和特殊价格售价。</el-col>
      <el-col class="small">基础价格是指大多数情况下的房屋售价，通常是指周一到周四的非节日售价。</el-col>
      <el-col class="small">特殊价格通常是指周五到周日的售价，也包含各大节假日价格。</el-col>
    </el-row>
    <div class="red">*平台将收取民宿订单总价的10%作为平台服务费</div>
    <div>
      <el-form :model="info" ref="info" :rules="rules">
        <el-form-item label="基础价位" prop="setBasePrice">
          <el-input class="info" v-model="info.setBasePrice" @change="setCash"></el-input>元/晚
        </el-form-item>
        <el-form-item label="特殊价位" prop="setSpecialPrice">
          <el-input class="info" v-model="info.setSpecialPrice"></el-input>元/晚
        </el-form-item>
        <el-form-item label="押金金额" prop="setCash">
          <el-input class="info" v-model="info.setCash"></el-input>元（押金为普通日期房价一半取整，押金不足10元按10元算）
        </el-form-item>
        <el-row>
          <el-col :span="9">
            <el-form-item label="活动开始时间" prop="setActiveStart">
              <el-date-picker
                v-model="info.setActiveStart"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="活动结束时间" prop="setActiveEnd">
              <el-date-picker
                v-model="info.setActiveEnd"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动价位" prop="setActivePrice">
          <el-input class="info" v-model="info.setActivePrice"></el-input>元/晚
        </el-form-item>
        <div class="hr"></div>

        <el-row class="message">
          <el-col class="small">收款方式：全额预付</el-col>
          <el-col class="small">舒逸客目前仅支持全额预付房费，并且通过平台线上收取</el-col>
          <el-col class="small">退款规则：宽松的退款规则会让更多的人预定您的房屋</el-col>
        </el-row>

        <el-row class="bottom">
          <el-form-item prop="setCancelDays">
            <el-col>
              入住
              <el-select v-model="info.setCancelDays" placeholder="请选择" class="smallInfo">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>14点前取消订单，房屋可全额退还
            </el-col>
          </el-form-item>
          <el-form-item prop="setCancelBreach">
            <el-col>
              在此之后取消订单，将收取未住宿房费的
              <el-select v-model="info.setCancelBreach" placeholder="请选择" class="smallInfo">
                <el-option
                  v-for="item in money"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>作为违约金支付给房东。(包含未入住和提前离店）
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>

      <div class="btn">
        <el-button type="danger" @click="save('info')">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import heads from "./components/head";
import upload from "@/components/Upload";
import { JudgeDate } from "@/utils/validate";
import { createOne } from "@/api/goods/home";
export default {
  components: { heads, upload },
  props: {
    index: {
      type: String,
      default: "0"
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value == 0) {
        callback(new Error("请输入不为0的数字"));
      } else {
        callback();
      }
    };
    const valiDate = (rule, value, callback) => {
      if (JudgeDate(this.info.setActiveStart, this.info.setActiveEnd)) {
        callback();
      } else {
        callback(new Error("活动结束时间必须晚于开始时间"));
      }
    };
    return {
      info: {
        setBasePrice: "", //基础价位
        setSpecialPrice: "", //特殊价位
        setCash: "", //押金
        setActivePrice: "", //活动价格
        setActiveStart: "", //开始时间
        setActiveEnd: "", //结束时间
        setCancelDays: "", //入住前几天退款可全额退
        setCancelBreach: "" //取消订单退款的违约金比例
      },
      options: [
        {
          label: "当天",
          value: 0
        },
        {
          label: "前一天",
          value: 1
        },
        {
          label: "前两天",
          value: 2
        },
        {
          label: "前三天",
          value: 3
        },
        {
          label: "前四天",
          value: 4
        },
        {
          label: "前五天",
          value: 5
        },
        {
          label: "前六天",
          value: 6
        },
        {
          label: "前七天",
          value: 7
        }
      ],
      money: [
        {
          label: "0%",
          value: 0
        },
        {
          label: "10%",
          value: 10
        },
        {
          label: "20%",
          value: 20
        },
        {
          label: "30%",
          value: 30
        },
        {
          label: "40%",
          value: 40
        },
        {
          label: "50%",
          value: 50
        },
        {
          label: "60%",
          value: 60
        },
        {
          label: "70%",
          value: 70
        },
        {
          label: "80%",
          value: 80
        },
        {
          label: "90%",
          value: 90
        },
        {
          label: "100%",
          value: 100
        }
      ],
      rules: {
        setBasePrice: [
          { required: true, message: "请输入基础价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        setSpecialPrice: [
          { required: true, message: "请输入特殊价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        setCash: [{ required: true, trigger: "blur", validator: validate }],
        setActiveStart: [
          { required: true, message: "请选择活动开始时间", trigger: "change" },
          { required: true, trigger: "change", validator: valiDate }
        ],
        setActiveEnd: [
          { required: true, message: "请选择活动结束时间", trigger: "change" },
          { required: true, trigger: "change", validator: valiDate }
        ],
        setActivePrice: [
          { required: true, message: "请输入活动价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        setCancelDays: [
          {
            required: true,
            message: "请选择入住前几天退款可全额退",
            trigger: "change"
          }
        ],
        setCancelBreach: [
          {
            required: true,
            message: "请选择取消订单退款的违约金比例",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
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
                to: "information"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setCash(e) {
      this.info.setCash = Math.round(this.info.setBasePrice / 2);
      if (this.info.setCash < 10) {
        this.info.setCash = 10;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  width: 200px !important;
}
.hr {
  width: 100%;
  height: 1px;
  background: rgba(221, 221, 221, 1) !important;
  margin-bottom: 20px;
}
.message {
  padding: 15px 35px;
  background: rgba(250, 250, 250, 1);
  margin-bottom: 10px;

  .small {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(94, 94, 94, 1);
    padding: 5px 0;
  }
}
.red {
  font-size: 15px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(255, 109, 96, 1);
  padding: 10px 0;
  margin-bottom: 10px;
}
.btn {
  text-align: center;
  padding-top: 20px;

  button {
    width: 150px;
  }
}
.bottom {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(94, 94, 94, 1);
  padding: 5px 0;
  .smallInfo {
    width: 100px !important;
  }
}
</style>
