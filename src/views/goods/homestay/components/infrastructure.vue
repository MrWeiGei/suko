<template>
  <div style="width:100%">
    <heads title="基础设施"></heads>
    <div>
      <el-form label-position="top" label-width="80px" :model="info" ref="info" :rules="rules">
        <el-form-item label="房屋类型" prop="commHouseType">
          <el-select v-model="info.commHouseType" placeholder="请选择" class="info">
            <el-option
              v-for="item in commHouseTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地理优势" prop="commAdvantage">
          <el-checkbox-group v-model="info.commAdvantage">
            <el-checkbox label="景点"></el-checkbox>
            <el-checkbox label="商圈"></el-checkbox>
            <el-checkbox label="行政中心"></el-checkbox>
            <el-checkbox label="机场/车站"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="主题类型" prop="commThemeType">
          <el-checkbox-group v-model="info.commThemeType">
            <el-checkbox label="商务"></el-checkbox>
            <el-checkbox label="情侣"></el-checkbox>
            <el-checkbox label="家庭"></el-checkbox>
            <el-checkbox label="青春"></el-checkbox>
            <el-checkbox label="个性"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="出租类型" prop="commLeaseType">
          <el-select v-model="info.commLeaseType" placeholder="请选择" class="info">
            <el-option label="整套出租" value="0"></el-option>
            <el-option label="独立单间" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间面积" prop="commHouseArea">
          <el-input v-model="info.commHouseArea" class="info"></el-input>平米
        </el-form-item>
        <el-form-item label="装修时间" prop="commDecorationTime">
          <el-date-picker
            v-model="info.commDecorationTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="居室类型" prop="baseRoomType">
          <el-select v-model="info.baseRoomType" placeholder="请选择" class="info">
            <el-option
              v-for="item in baseRoomTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋户型">
          <el-row>
            <el-col :span="4">
              卧室
              <el-input type="number" v-model="baseHouseUnit.bedRoom" class="small" min="0"></el-input>
            </el-col>
            <el-col :span="4">
              卫生间
              <el-input type="number" v-model="baseHouseUnit.bathRoom" class="small" min="0"></el-input>
            </el-col>
            <el-col :span="4">
              餐厅
              <el-input type="number" v-model="baseHouseUnit.dininRoom" class="small" min="0"></el-input>
            </el-col>
            <el-col :span="4">
              厨房
              <el-input type="number" v-model="baseHouseUnit.kitchen" class="small" min="0"></el-input>
            </el-col>
            <el-col :span="4">
              书房
              <el-input type="number" v-model="baseHouseUnit.studyRoom" class="small" min="0"></el-input>
            </el-col>
            <el-col :span="4">
              阳台
              <el-input type="number" v-model="baseHouseUnit.balcony" class="small" min="0"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="床型">
          <el-row>
            <el-col v-for="(j,i) in baseBedType" :key="i.index" style="margin-bottom:15px">
              <el-select v-model="j.bedType" placeholder="请选择床型" class="bedInfo">
                <el-option
                  v-for="item in bedType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="j.bedRole" placeholder="请选择床类规格" class="bedInfo">
                <el-option
                  v-for="item in bedRole"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                type="number"
                v-model="j.bedNum"
                class="bedInfo"
                min="1"
                placeholder="请输入床数"
              ></el-input>
              <span class="delete" @click="deletes(i)">删除</span>
            </el-col>
            <el-button type="danger" @click="createOneBed" style="margin-top:5px">+ 继续添加床型</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="宜住人数" prop="baseGoodPersons">
          <el-input v-model="info.baseGoodPersons" class="info"></el-input>人
        </el-form-item>
        <el-form-item label="同类房屋数量" prop="baseSameCount">
          <div class="msg">房屋数量是指相同类型房屋的数量，最终会以库存的形式呈现。</div>
          <el-input v-model="info.baseSameCount" class="info"></el-input>套
          <div class="msg">该信息审核通过后不可修改</div>
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
    const validate = (rule, value, callback) => {
      if (value == 0) {
        callback(new Error("请输入不为0的数字"));
      } else {
        callback();
      }
    };
    return {
      info: {
        commHouseType: "0", //房屋类型
        commAdvantage: [], //地理优势
        commThemeType: [], //主题类型
        commLeaseType: "1", //出租类型
        commHouseArea: "", //房屋面积
        commDecorationTime: "", //装修时间
        baseRoomType: "", //居室类型
        baseHouseUnit: "", //房屋户型
        baseBedType: "", //床型
        baseGoodPersons: "", //宜住人数
        baseSameCount: "" //同类房屋数量
      },
      baseHouseUnit: {
        bedRoom: "1", //卧室
        bathRoom: "1", //卫生间
        dininRoom: "0", //餐厅
        kitchen: "0", //厨房
        studyRoom: "0", //书房
        balcony: "0" //阳台
      },
      baseBedType: [
        {
          bedType: "大床",
          bedRole: "2*1.8米",
          bedNum: "1"
        }
      ],
      commHouseTypeOptions: [
        {
          label: "普通公寓",
          value: "0"
        },
        {
          label: "独栋别墅",
          value: "1"
        },
        {
          label: "农家乐",
          value: "2"
        },
        {
          label: "四合院",
          value: "3"
        },
        {
          label: "LOFT",
          value: "4"
        },
        {
          label: "其他",
          value: "5"
        }
      ],
      baseRoomTypeOptions: [
        {
          label: "一居室",
          value: "0"
        },
        {
          label: "二居室",
          value: "1"
        },
        {
          label: "三居室",
          value: "2"
        },
        {
          label: "四居室以上",
          value: "3"
        }
      ],
      bedType: [
        {
          label: "大床",
          value: "大床"
        },
        {
          label: "圆床",
          value: "圆床"
        },
        {
          label: "双人床",
          value: "双人床"
        },
        {
          label: "单人床",
          value: "单人床"
        },
        {
          label: "儿童床",
          value: "儿童床"
        },
        {
          label: "榻榻米",
          value: "榻榻米"
        },
        {
          label: "双层床",
          value: "双层床"
        }
      ],
      bedRole: [
        {
          label: "2*1.8米",
          value: "2*1.8米"
        },
        {
          label: "2*1.5米",
          value: "2*1.5米"
        },
        {
          label: "1.8*1.5米",
          value: "1.8*1.5米"
        },
        {
          label: "2*2米",
          value: "2*2米"
        },
        {
          label: "2*1.6米",
          value: "2*1.6米"
        },
        {
          label: "2.2*2.2米",
          value: "2.2*2.2米"
        }
      ],
      rules: {
        commHouseType: [
          { required: true, message: "请选择房屋类型", trigger: "change" }
        ],
        commAdvantage: [
          { required: true, message: "请选择地理优势", trigger: "change" }
        ],
        commThemeType: [
          { required: true, message: "请选择主题类型", trigger: "change" }
        ],
        commLeaseType: [
          { required: true, message: "请选择出租类型", trigger: "change" }
        ],
        commHouseArea: [
          { required: true, message: "请输入房间面积", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          },
          { required: true, trigger: "blur", validator: validate }
        ],
        commDecorationTime: [
          { required: true, message: "请选择装修时间", trigger: "change" }
        ],
        baseRoomType: [
          { required: true, message: "请选择居室类型", trigger: "change" }
        ],
        baseGoodPersons: [
          { required: true, message: "请输入宜住人数", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          },
          { required: true, trigger: "blur", validator: validate }
        ],
        baseSameCount: [
          { required: true, message: "请输入同类房屋数量", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          },
          { required: true, trigger: "blur", validator: validate }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.info.baseBedType = JSON.stringify(this.baseBedType);
          this.info.baseHouseUnit = JSON.stringify(this.baseHouseUnit);
          this.info.commAdvantage = JSON.stringify(this.info.commAdvantage);
          this.info.commThemeType = JSON.stringify(this.info.commThemeType);
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
                to: "description"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createOneBed() {
      this.baseBedType.push({
        bedType: "大床",
        bedRole: "2*1.8米",
        bedNum: "1"
      });
    },
    deletes(e) {
      if (this.baseBedType.length > 1) {
        this.baseBedType.splice(e, 1);
      }
    },
    change(e, a, c) {
      console.log(e, a, c);
      return 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  width: 300px !important;
}
.small {
  width: 100px !important;
}
.msg {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(194, 194, 194, 1);
}
.bedInfo {
  width: 200px !important;
}
.delete {
  color: rgb(141, 154, 233);
  padding: 10px;
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