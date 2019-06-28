<template>
  <div>
    <el-col style="color:#FF6D60;background:#F7F7F7;padding:10px">
      <img src="./../../icons/icon1.png" alt class="icons">
      {{title}}
    </el-col>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  }
};
</script>
 
 <style lang="scss" scoped>
</style>
 