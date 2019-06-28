<template>
  <div>
    <el-row class="content">
      <!-- 顶部布局 -->
      <el-col style="margin-bottom:20px">
        <div @click="goBack">返回列表</div>
      </el-col>
      <el-col :span="3">
        <ul>
          <li
            v-for="(index,i) in list"
            :key="i.index"
            @click="go(i,index.to,index.able)"
            :class="{'active':indexs==i,'able':!index.able}"
          >
            <el-row>
              <el-col :span="3" :offset="5">
                <svg-icon v-if="index.icon" :icon-class="index.icon" class="svgIcon"/>
              </el-col>
              <el-col :span="10">{{index.name}}</el-col>
              <el-col :span="5">
                <svg-icon v-if="indexTrue.indexOf(i)!=-1" icon-class="true" class="true"/>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-col>
      <el-col :offset="1" :span="20" class="right">
        <keep-alive>
          <home-info v-if="toFlag=='homeInfo'" index="0" @next="next"></home-info>
          <infrastructure v-if="toFlag=='infrastructure'" index="1" @next="next"></infrastructure>
          <description v-if="toFlag=='description'" index="2" @next="next"></description>
          <supporting v-if="toFlag=='supporting'" index="3" @next="next"></supporting>
          <roles v-if="toFlag=='roles'" index="4" @next="next"></roles>
          <servers v-if="toFlag=='servers'" index="5" @next="next"></servers>
          <price v-if="toFlag=='price'" index="6" @next="next"></price>
          <information v-if="toFlag=='information'" index="7" @next="next"></information>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import homeInfo from "./components/homeInfo";
import infrastructure from "./components/infrastructure";
import description from "./components/description";
import supporting from "./components/supporting";
import roles from "./components/roles";
import servers from "./components/servers";
import price from "./components/price";
import information from "./components/information";
export default {
  name: "addHome",
  components: {
    homeInfo,
    infrastructure,
    description,
    supporting,
    roles,
    servers,
    price,
    information
  },
  data() {
    return {
      indexs: 0,
      toFlag: "homeInfo",
      list: [
        {
          name: "房屋信息",
          to: "homeInfo",
          icon: "homeInfo",
          able: false
        },
        {
          name: "基础设施",
          to: "infrastructure",
          icon: "infrastructure",
          able: true
        },
        {
          name: "房屋描述",
          to: "description",
          icon: "description",
          able: true
        },
        {
          name: "配套设施",
          to: "supporting",
          icon: "supporting",
          able: true
        },
        {
          name: "制定规则",
          to: "roles",
          icon: "roles",
          able: true
        },
        {
          name: "管家服务",
          to: "servers",
          icon: "servers",
          able: true
        },
        {
          name: "价格设置",
          to: "price",
          icon: "price",
          able: true
        },
        {
          name: "证件信息",
          to: "information",
          icon: "information",
          able: true
        }
      ]
    };
  },
  methods: {
    goBack() {
      this.$store.dispatch("home/delIndexTrue");
      this.$router.push({ path: "/goods/homestay/homeResource" });
    },
    go(index, to, able) {
      if (!able) {
        this.indexs = index;
        this.toFlag = to;
      }
    },
    next(e) {
      this.indexs = e.index;
      this.toFlag = e.to;
      this.list.forEach((index, i) => {
        if (i == e.index) {
          this.list[i].able = false;
        }
      });
    }
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
    ...mapGetters(["indexTrue", "id"])
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 30px;
  width: 80%;
  margin: 0 auto;

  ul {
    margin: 0 auto;
    width: 160px;
    border-top: 3px solid rgba(255, 109, 96, 1);
    box-shadow: 0px 0px 4px 0px rgba(118, 118, 118, 0.34);
    text-align: center;
    padding: 0;

    li {
      font-family: MicrosoftYaHei;
      height: 40px;
      line-height: 40px;
      list-style: none;
      font-weight: 400;
      font-size: 16px;
      color: #ccc;

      .svgIcon {
        width: 16px;
      }
      .true {
        width: 15px;
      }
    }
    .able {
      color: gray;
      &:hover {
        background: rgba(255, 247, 247, 1);
      }
    }
    .active {
      color: rgba(255, 109, 96, 1);
      background: rgba(255, 247, 247, 1);
    }
  }

  .right {
    padding: 20px 20px;
    box-shadow: 0px 0px 4px 0px rgba(118, 118, 118, 0.34);
  }
}
</style>

