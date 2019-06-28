<template>
  <div class="head">
    <span>{{title}}</span>
    <span class="small">{{small}}</span>
    <div class="hr"></div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    small: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.head {
  font-size: 24px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);

  .hr {
    margin: 10px 0 10px 0; 
    width: 100%;
    height: 1px;
    background: #ccc;
  }

  .small {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(189, 189, 189, 1);
  }
}
</style>
