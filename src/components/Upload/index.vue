<template>
  <div>
    <el-upload
      v-if="type=='photo'"
      :class="user==true?'avatar-uploader':'nouser'"
      :show-file-list="user==true?false:true"
      :action="url"
      list-type="picture-card"
      :on-remove="user==true?function(){return void(666)}:handleRemove"
      :on-success="success"
      :on-error="error"
      :limit="user==true?1:999"
      :before-upload="user==true?beforeAvatarUpload:function(){return void(666)}"
      :multiple="user==true?false:true"
    >
      <div v-if="!user">
        <i class="el-icon-plus"></i>
      </div>
      <div v-else>
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>

    <el-upload
      v-else-if="type=='file'"
      class="upload-demo"
      :action="url"
      :limit="999"
      :multiple="true"
      :on-success="success"
      :on-error="error"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUploadFile"
    >
      <el-button type="danger">上传视频</el-button>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "photo"
    },
    url: {
      type: String,
      default: "https://jsonplaceholder.typicode.com/posts/"
    }
  },
  data() {
    return {
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  mounted() {
    this.imageUrl = "";
  },
  methods: {
    // 删除文件
    handleRemove(file, fileList) {
      this.$emit("remove", file);
    },
    // 点击预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功
    success(response, file, fileList) {
      if (JSON.stringify(response) != "{}") {
        this.$emit("success", { response, file, fileList });
        this.$message.success("文件上传成功！");
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传失败
    error(err, file) {
      this.$message.error("文件上传失败！");
    },
    // 检索图片类型&&大小 应用于主图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传文件只能是 JPG或者PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUploadFile(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isLt2M;
    }
  }
};
</script>
<style scoped>
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
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
