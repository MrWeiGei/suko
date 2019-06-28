<template>
  <div style="width:100%">
    <heads title="房屋描述" small="上传真实、漂亮的房屋照片更能吸引房客"></heads>
    <el-row class="message">
      <el-col class="big">照片需上传6-40张且满足以下类型：</el-col>
      <el-col class="big">客厅：2张 &nbsp;&nbsp;&nbsp;&nbsp;卧室：1张 &nbsp;&nbsp;&nbsp;&nbsp;卫生间：1张</el-col>
      <el-col class="small">请保证上传的图片高清、无水印、无logo和联系方式；为了避免房屋图片与户型不符产生客诉</el-col>
    </el-row>
    <div style="margin-top:35px">
      <photo
        v-for="i in options"
        :key="i.index"
        :importance="i.importance"
        :title="i.title"
        :num="i.num"
        :haveNum="i.haveNum"
        :info="i.info"
        @success="success"
      ></photo>
      <el-form label-position="top" label-width="80px" :model="info" ref="info" :rules="rules">
        <el-form-item label="房屋名称" prop="desHouseName">
          <el-input v-model="info.desHouseName" placeholder="建议：地标+特色/亮点+户型" class="info"></el-input>
        </el-form-item>
        <el-form-item label="房屋描述" prop="desFeature">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="可描述房屋软装风格，家具配套，小区环境，物业管理等"
            v-model="info.desFeature"
            class="textarea"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="交通位置（选填）">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="位于朝阳门外大街，从朝阳门地铁站A口5分钟到达，楼下有38路，101路等多条 公交线路，十分方便。"
            v-model="info.desLocation"
            class="textarea"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="周边位置（选填）">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="小区东侧有条美食街，特别推荐冒牌火锅菜、海鲜烧烤；附近有超市便利店、量贩式KTV，24小时药店，建行ATM，生活便利."
            v-model="info.desAround"
            class="textarea"
            maxlength="500"
            show-word-limit
          ></el-input>
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
import photo from "./components/photo";
import { createOne } from "@/api/goods/home";
import { defaults } from "codemirror";
export default {
  components: { heads, photo },
  props: {
    index: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      info: {
        desPic: "", //房源图片
        desHouseName: "为一室一厅", //房屋名称
        desFeature:
          "房间为一室一厅，有独立卫生间和厨房，可容纳两人入住，床品一客一换，干净卫生；房间里面配备常用家电,无线网络、电视机、全自动洗衣机、冰箱、微波炉，厨房我们可以提供简单的做饭餐具，就等着您来大显身手啦～ 天然气热水器提供24小时热水，毛巾浴巾，吹风机，洗澡的凉拖以及牙具浴帽梳子，洗发水，沐浴露,护发素，都有贴心准备，还有洗衣液,足够数量的衣架等一应俱全，让每一段出行都充满家的感觉！", //房屋描述
        desLocation: "", //交通位置（选填）
        desAround: "" //周边位置（选填）
      },
      desPic: {
        bedroom: [], //卧室
        livingRoom: [], //客厅
        KitchenBath: [], //厨房浴室
        other: [], //其他
        video: [] //上传视频
      }, //房源图片
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
        city: [{ required: true, message: "请选择所在城市", trigger: "blur" }],
        desHouseName: [
          { required: true, message: "请输入房屋名称", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        desFeature: [
          { required: true, message: "请输入房屋特色", trigger: "blur" },
          {
            min: 30,
            max: 1000,
            message: " 房屋特色需在30-1000个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (var k in this.desPic) {
            if (k == "bedroom") {
              if (this.desPic[k].length == 0) {
                this.$message({
                  message: "卧室的图片不能为空",
                  type: "error"
                });
                return false;
              }
            }
            if (k == "livingRoom") {
              if (this.desPic[k].length == 0) {
                this.$message({
                  message: "客厅的图片不能为空",
                  type: "error"
                });
                return false;
              }
            }
            if (k == "KitchenBath") {
              if (this.desPic[k].length == 0) {
                this.$message({
                  message: "厨房浴室的图片不能为空",
                  type: "error"
                });
                return false;
              }
            }
          }
          this.info.desPic = JSON.stringify(this.desPic);
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
                to: "supporting"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    success(e) {
      console.log(e);
      // this.info.desPic.push(e.response.url);
      if (e.title == "卧室") {
        this.desPic.bedroom.push(e.response.url);
      }
      if (e.title == "客厅") {
        this.desPic.livingRoom.push(e.response.url);
      }
      if (e.title == "厨房浴室") {
        this.desPic.KitchenBath.push(e.response.url);
      }
      if (e.title == "其他") {
        this.desPic.other.push(e.response.url);
      }
      if (e.title == "上传视频") {
        this.desPic.video.push(e.response.url);
      }
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

.textarea {
  width: 700px !important;
}
.message {
  padding: 15px 35px;
  background: rgba(250, 250, 250, 1);

  .big {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    padding: 5px 0;
  }

  .small {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(94, 94, 94, 1);
    padding: 5px 0;
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