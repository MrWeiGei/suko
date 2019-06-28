<template>
  <div>
    <el-col
      v-for="i in info"
      :key="i.index"
      :span="show==true?5:6"
      :style="{height:height+'px'}"
      class="list_one"
      :class="show==true?' show':' noshow'"
    >
      <div :class="show==true?'':'box'">
        <div class="info">{{i.message}}</div>
        <div :class="show==true?' number':' numbers'" :style="{color:i.color}">{{i.number}}</div>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Array,
      default: ""
    },
    height: {
      type: String,
      default: "144"
    },
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.show {
  margin: 25px 0 25px 3%;
  border: 1px solid rgba(231, 231, 231, 1);
  border-radius: 5px;
  box-shadow: 2px 2px 43px #f2f2f2;
  &:hover {
    box-shadow: 2px 2px 15px #ccc;
  }
}
.noshow {
  margin: 20px 0 20px 0;
}

.list_one {
  text-align: center;
  padding-top: 40px;
  padding-bottom: 40px;
  transition: 0.6s;

  .box {
    border-right: 1px solid rgba(231, 231, 231, 1);
  }
  .info {
    color:#333333;
    font-size: 18px;
  }

  .number {
    margin-top: 24px;
    font-size: 32px;
  }
  .numbers {
    margin-top: 24px;
    font-size: 28px;
  }

  &:nth-last-child(1) {
    .box {
      border-right: 0px;
    }
  }
}
</style>

