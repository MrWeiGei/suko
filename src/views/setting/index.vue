<template>
  <div class="contnet">
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="基本信息"></unified-style>
      <el-col style="margin-top:10px">
        <el-row>
          <el-form ref="info" :model="info" label-width="120px">
            <el-col :offset="offset" :span="span" style="text-align:center;padding-left:90px">
              <el-upload
                class="avatar-uploader"
                action="/gao/common/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :offset="offset" :span="span" style="margin-top:10px">
              <el-form-item label="网站名称:">
                <el-input v-model="info.webName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="offset" :span="span">
              <el-form-item label="公司名称:">
                <el-input v-model="info.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="offset" :span="span">
              <el-form-item label="公司地址:">
                <el-input v-model="info.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="offset" :span="span">
              <el-form-item label="客服电话:">
                <el-input v-model="info.num"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="offset" :span="span">
              <el-form-item label="公司邮箱:">
                <el-input v-model="info.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="offset" :span="span">
              <el-form-item label="网站ICP备案号:">
                <el-input v-model="info.nums"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :offset="offset"
              :span="span"
              style="text-align:center;padding-left:100px;margin-bottom:35px"
            >
              <el-button type="danger" @click="saveInfo">保存</el-button>
            </el-col>
          </el-form>
        </el-row>
      </el-col>
    </el-row>

    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;margin-top:10px">
      <unified-style title="修改密码"></unified-style>

      <el-col style="margin-top:30px">
        <el-row>
          <el-form :model="passwd" status-icon :rules="rules" ref="passwd" label-width="120px">
            <el-col :offset="offset" :span="span">
              <el-form-item label="新密码:" prop="pass">
                <el-input type="password" v-model="passwd.pass" autocomplete="off" maxlength="12"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="offset" :span="span">
              <el-form-item label="确认密码:" prop="checkPass">
                <el-input type="password" v-model="passwd.checkPass" autocomplete="off" maxlength="12"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :offset="offset"
              :span="span"
              style="text-align:center;padding-left:100px;margin-bottom:35px"
            >
              <el-button type="danger" @click="submitForm('passwd')">保存</el-button>
            </el-col>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UnifiedStyle from "@/components/UnifiedStyle";
import logo from "@/icons/logo_.png";
export default {
  components: {
    UnifiedStyle
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwd.checkPass !== "") {
          this.$refs.passwd.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwd.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      info: {},
      passwd: {
        pass: "",
        checkPass: ""
      },
      imageUrl: logo,
      offset: 6,
      span: 8,
      rules: {
        pass: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    saveInfo() {
      alert(JSON.stringify(this.info));
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.passwd);
        } else {
          this.$message.error("请输入信息后再点击！");
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl ="http://192.168.2.113/"+res.fileName;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/png"||"image/jepg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style lang="scss" scoped>
.contnet {
  padding: 10px;
  background: #e7e7e7;

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 65px;
    line-height: 65px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 65px;
    display: block;
  }
}
</style>
