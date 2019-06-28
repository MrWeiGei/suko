<template>
  <div style="width:100%">
    <heads title="证件信息" small="请注明您的证件信息，以便更快通过系统审核"></heads>
    <div style="margin-top:35px">
      <el-form label-position="top" label-width="80px" :model="info" ref="info" :rules="rules">
        <el-form-item label="房东/城市合伙人" prop="name">
          <el-input v-model="info.name" class="info"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="info.phone" class="info" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="info.email" class="info"></el-input>
        </el-form-item>
        <el-form-item label="身份证照片">
          <el-row>
            <el-col :span="6">
              <el-form-item label="身份证正面照">
                <upload user/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="身份证反面照">
                <upload user/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row class="message">
                <el-col class="small">上传要求</el-col>
                <el-col class="small">1.证件信息：不可修改房东信息自己在前台编辑城市合伙人信息在客户管理中修改</el-col>
                <el-col class="small">2.请上传真实头像，若有营业执照也可以上传品牌logo，否则审核不会通过哟</el-col>
                <el-col class="small">3.请上传2MB以内的JPG、JPEG、GIF、PNG格式图片文件</el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="hr"></div>
        <el-form-item label="收款账号设置">
          <el-form-item label="开户银行">
            <el-input v-model="info.blank" class="smallInfo"></el-input>
          </el-form-item>
          <el-form-item label="开户地点">
            <el-input v-model="info.blank" class="smallInfo"></el-input>
          </el-form-item>
          <el-form-item label="支行名称">
            <el-input v-model="info.blank" class="smallInfo"></el-input>
          </el-form-item>
          <el-form-item label="开户姓名">
            <el-input v-model="info.blank" class="smallInfo"></el-input>
          </el-form-item>
          <el-form-item label="预留电话">
            <el-input v-model="info.blank" class="smallInfo"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="房产说明">
          <div class="red">上传房产证或其他能够证明房屋使用权的和合同。注意：必须提交扫描件或复印件，请勿使用手机拍摄的照片！</div>
          <upload/>
        </el-form-item>
        <div class="hr"></div>
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
        feature: "陕西省西安市",
        pos: "雁塔区绿地中心",
        zhoubian: "4545"
      },
      options: [
        {
          importance: true,
          title: "卧室",
          num: "0",
          info: "至少上传1张，展现完整客厅（默认第一张图片为封面）"
        },
        {
          importance: true,
          title: "客厅",
          num: "0",
          info: "至少上传1张，展现完整客厅"
        },
        {
          importance: true,
          title: "厨房浴室",
          num: "0",
          info: "至少上传1张，卫浴设施完整，地面整洁"
        },
        {
          importance: false,
          title: "其他",
          num: "0",
          info: "房屋外景等"
        },
        {
          importance: false,
          title: "上传视频",
          haveNum: false,
          info:
            "视频可以增加房屋曝光度（最多上传1个视频，单个视频不超过500M，视频作品将会展示在作品队列首位）"
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: "请输入房东/城市合伙人名称",
            trigger: "blur"
          },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$store.dispatch("home/addIndexTrue", parseInt(this.$props.index));
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("next", {
            index: String(parseInt(this.$props.index) + 1),
            to: "description"
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    success(e) {
      this.options.forEach(i => {
        if (e.title == i.title) {
          i.num = String(e.fileList.length);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.info {
  width: 500px !important;
}
.smallInfo {
  width: 300px !important;
}
.hr {
  width: 100%;
  height: 1px;
  background: rgba(221, 221, 221, 1) !important;
  margin-bottom: 20px;
}
.red {
  font-size: 15px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(255, 109, 96, 1);
  margin-bottom: 10px;
}
.message {
  padding: 15px 35px;
  background: rgba(250, 250, 250, 1);
  margin-top: 15px;

  .small {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(94, 94, 94, 1);
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