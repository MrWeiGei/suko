<template>
  <div>
    <div v-for="(item,index) in list" :key="index" class="photo">
      <img :src="url+item" class="avatar">
      <div class="mask" @click="removeOld(index)">
        <i class="el-icon-delete avatar-uploader-icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    },
    url: {
      type: String
    }
  },
  methods: {
    removeOld(e) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("remove", e);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.photo {
  width: 148px;
  height: 148px;
  display: inline-block;
  position: relative;
  overflow: hidden;
  transition: 0.3;
  .avatar {
    width: 100%;
    height: 100%;
  }
  .mask {
    position: absolute;
    top: -100%;
    width: 100%;
    text-align: center;
    background: rgba($color: #000000, $alpha: 0.5);
    transition: 0.3;

    .avatar-uploader-icon {
      font-size: 20px;
      color: white;
      line-height: 148px;
    }
  }
  &:hover {
    .mask {
      transition: 0.3;
      top: 0;
    }
  }
}
</style>
