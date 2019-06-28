<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="url"
      list-type="picture-card"
      :show-file-list="false"
      :on-error="handleError"
      :on-success="handleSuccessVideo"
      :on-progress="uploadProcess"
      :before-upload="videoBeforeUpload"
      :on-remove="handleRemove"
    >
      <video
        v-if="imageUrl.length > 1 && imgFlag == false"
        controls="controls"
        :src="[qiniuUrl + '/' + imageUrl]"
        class="avatar"
      ></video>
      <i
        v-else-if="imageUrl.length < 1 && imgFlag == false"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
      <el-progress
        v-if="imgFlag == true"
        type="circle"
        :percentage="percent"
        style="margin-top: 20px"
      ></el-progress>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: "https://jsonplaceholder.typicode.com/posts/"
    }
  },
  data() {
    return {
      qiniuUrl: "https://192.168.1.25:8080/", // 个人七牛访问前缀
      imgFlag: false,
      imageUrl: [],
      percent: 0,
      dialogImageUrl: ""
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageUrl = "";
    },
    handleSuccessVideo(response) {
      console.log(123, response);
      this.imgFlag = false;
      this.percent = 0;
      if (response.hash) {
        this.imageUrl = response.hash;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    handleError(err, file, fileList) {
      // 上传失败异常处理
      const error = JSON.parse(JSON.stringify(err));
      console.log(err);
      console.log(error);
      this.$message.error(error.status.toString());
      this.imgFlag = false;
      this.percent = 0;
    },
    videoBeforeUpload(file) {
      console.log(file);
      const _self = this;
      const isVideo =
        file.type === "video/mp4" ||
        file.type === "video/ogg" ||
        file.type === "video/flv" ||
        file.type === "video/avi" ||
        file.type === "video/wmv" ||
        file.type === "video/rmvb";
      const isLt30M = file.size / 1024 / 1024 < 30;
      if (!isVideo) {
        this.$message.warning("请上传正确格式的视频！");
        return false;
      } else {
        if (!isLt30M) {
          this.$message.warning("上传视频文件大小不能超过 30MB!");
          return false;
        }
      }
    },
    uploadProcess(event, file, fileList) {
      this.imgFlag = true;
      this.percent = Math.floor(event.percent);
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.image-preview {
  width: 178px;
  height: 178px;
  position: relative;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  float: left;
}

.image-preview .image-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview .image-preview-wrapper img {
  width: 100%;
  height: 100%;
}

.image-preview .image-preview-action {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  cursor: pointer;
  text-align: center;
  line-height: 200px;
}

.image-preview .image-preview-action .el-icon-delete {
  font-size: 32px;
}

.image-preview:hover .image-preview-action {
  opacity: 1;
}
</style>
