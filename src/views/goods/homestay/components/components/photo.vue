<template>
  <div>
    <el-row class="top">
      <el-col class="more">
        <span style="color:#FF6D60" v-if="importance">*</span>
        <span class="big">{{title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="small" v-if="haveNum">{{num}}/20</span>
      </el-col>
      <el-col class="small">{{info}}</el-col>
    </el-row>
    <div class="upload">
      <upload :type="haveNum==false?'file':'photo'" @success="success" :url="picUrl"></upload>
      <videos v-if="!importance" :url="mediaUrl"></videos>
    </div>
  </div>
</template>


<script>
import upload from "@/components/Upload";
import videos from "@/components/Upload/video";
import { mapGetters } from "vuex";
export default {
  components: { upload, videos },
  props: {
    importance: {
      type: Boolean,
      default: true
    },
    haveNum: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "卧室"
    },
    num: {
      type: String,
      default: "0"
    },
    info: {
      type: String,
      default: "卧室"
    }
  },
  methods: {
    success(e) {
      e.title = this.$props.title;
      this.$emit("success", e);
    }
  },
  computed: {
    ...mapGetters(["picUrl", "mediaUrl"])
  }
};
</script>

<style lang="scss" scoped>
.top {
  background: rgba(248, 248, 248, 1);

  .small {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(94, 94, 94, 1);
    padding: 5px 10px;
  }
  .more {
    padding: 5px 10px;
  }
  .big {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    padding: 10px 0;
  }
}
.upload {
  padding: 15px 0;
}
</style>
