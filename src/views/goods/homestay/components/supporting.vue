<template>
  <div style="width:100%">
    <heads title="配套设施" small="房客可以按照他们想要的配套设施选择房屋。因此，请在页面上尽可能地全面展示您的房屋的配套设施。"></heads>
    <el-form
      label-position="top"
      label-width="80px"
      :model="suportInfo"
      ref="suportInfo"
      :rules="rules"
    >
      <el-form-item label="电子设备" prop="electron">
        <el-checkbox-group v-model="suportInfo.electron" class="info">
          <el-checkbox v-for="i in electronOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="hr"></div>
      <el-form-item label="卫浴设备" prop="bathroom">
        <el-checkbox-group v-model="suportInfo.bathroom" class="info">
          <el-checkbox v-for="i in bathroomOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="hr"></div>
      <el-form-item label="厨房设备" prop="kitchen">
        <el-checkbox-group v-model="suportInfo.kitchen" class="info">
          <el-checkbox v-for="i in kitchenOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="hr"></div>
      <el-form-item label="安全设施" prop="safety">
        <el-checkbox-group v-model="suportInfo.safety" class="info">
          <el-checkbox v-for="i in safetyOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="hr"></div>
      <el-form-item label="娱乐设施" prop="recreation">
        <el-checkbox-group v-model="suportInfo.recreation" class="info">
          <el-checkbox v-for="i in recreationOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="hr"></div>
      <el-form-item label="周边设施" prop="surrounding">
        <el-checkbox-group v-model="suportInfo.surrounding" class="info">
          <el-checkbox v-for="i in surroundingOption" :key="i.index" :label="i.label" class="some"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="hr"></div>
    </el-form>
    <div class="btn">
      <el-button type="danger" @click="save('suportInfo')">下一步</el-button>
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
        suportInfo: ""
      },
      suportInfo: {
        electron: [], //电子设备
        bathroom: [], //卫浴设备
        kitchen: [], //厨房设备
        safety: [], //安全设施
        recreation: [], //娱乐设施
        surrounding: [] //周边设施
      },
      electronOption: [
        {
          label: "智能电视"
        },
        {
          label: "空调"
        },
        {
          label: "WIFI/宽带"
        },
        {
          label: "冰箱"
        },
        {
          label: "移动台灯"
        }
      ],
      bathroomOption: [
        {
          label: "沐浴"
        },
        {
          label: "洗衣机"
        },
        {
          label: "马桶"
        },
        {
          label: "吹风机"
        },
        {
          label: "浴缸"
        },
        {
          label: "洗漱用品"
        }
      ],
      kitchenOption: [
        {
          label: "电饭煲"
        },
        {
          label: "微波炉"
        },
        {
          label: "烤箱"
        },
        {
          label: "燃气灶"
        },
        {
          label: "锅具"
        },
        {
          label: "油烟机"
        },
        {
          label: "餐具"
        }
      ],
      safetyOption: [
        {
          label: "智能门锁"
        },
        {
          label: "安全监控"
        },
        {
          label: "烟雾报警器"
        },
        {
          label: "医药箱"
        },
        {
          label: "灭火器"
        }
      ],
      recreationOption: [
        {
          label: "家庭影院"
        },
        {
          label: "K歌"
        },
        {
          label: "桌球"
        },
        {
          label: "麻将机"
        },
        {
          label: "游戏机"
        },
        {
          label: "智能音箱"
        }
      ],
      surroundingOption: [
        {
          label: "停车场"
        },
        {
          label: "庭院"
        },
        {
          label: "健身房"
        },
        {
          label: "游泳"
        },
        {
          label: "超市"
        },
        {
          label: "ATM取款机"
        },
        {
          label: "药店"
        }
      ],
      rules: {
        electron: [
          { required: true, message: "请选择电子设备", trigger: "change" }
        ],
        bathroom: [
          { required: true, message: "请选择卫浴设备", trigger: "change" }
        ],
        kitchen: [
          { required: true, message: "请选择厨房设备", trigger: "change" }
        ],
        safety: [
          { required: true, message: "请选择安全设施", trigger: "change" }
        ],
        recreation: [
          { required: true, message: "请选择娱乐设施", trigger: "change" }
        ],
        surrounding: [
          { required: true, message: "请选择周边设施", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.info.suportInfo = JSON.stringify(this.suportInfo);
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
                to: "roles"
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
.info {
  .some {
    width: 140px;
    height: 36px;
    padding-left: 20px;
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(243, 243, 243, 1);
    border-radius: 4px;
  }
}
.hr {
  width: 100%;
  height: 1px;
  background: rgba(221, 221, 221, 1) !important;
}

.textarea {
  width: 700px !important;
}
.message {
  padding: 15px 35px;
  background: rgba(250, 250, 250, 1);

  .big {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    padding: 5px 0;
  }

  .small {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(94, 94, 94, 1);
    padding: 5px 0;
  }
}
.btn {
  text-align: center;
  padding-top: 20px;

  button {
    width: 150px;
  }
}
</style>