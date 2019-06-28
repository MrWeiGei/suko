<template>
  <div class="navbar">
    <div class="logo" @click="gotoIndex">
      <img :src="logo" class="navbar-logo">
    </div>
    <!-- 伸展左侧菜单栏 -->
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />-->
    <!-- 显示导航 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/> -->

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'"> -->
      <!-- 搜索框 -->
      <!-- <search id="header-search" class="right-menu-item"/> -->
      <!-- 错误日志 -->
      <!-- <error-log id="error-log" class="errLog-container right-menu-item hover-effect"/> -->
      <!-- 全屏显示 -->
      <!-- <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect"/>
      </el-tooltip>-->

      <!-- 文字大小显示 -->
      <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
      </el-tooltip>-->
      <!-- 语言选择 -->
      <!-- <el-tooltip :content="$t('navbar.lang')" effect="dark" placement="bottom">
          <lang-select class="right-menu-item hover-effect"/>
      </el-tooltip>-->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          {{name}}
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/setting">
            <el-dropdown-item>{{ $t('navbar.setting') }}</el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip :content="$t('navbar.messages')" effect="dark" placement="bottom">
        <svg-icon icon-class="messages" class="messages right-menu-item" @click="open"/>
      </el-tooltip>
      <el-tooltip :content="$t('navbar.logout')" effect="dark" placement="bottom">
        <svg-icon icon-class="logout" class="logout right-menu-item" @click="out"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import logo from "@/icons/logo.png";
import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb";
// import Hamburger from "@/components/Hamburger";
// import ErrorLog from "@/components/ErrorLog";
// import Screenfull from "@/components/Screenfull";
// import SizeSelect from "@/components/SizeSelect";
// import LangSelect from "@/components/LangSelect";
// import Search from "@/components/HeaderSearch";

export default {
  components: {
    // Breadcrumb,
    // Hamburger,
    // ErrorLog
    // Screenfull,
    // SizeSelect,
    // LangSelect,
    // Search
  },
  data() {
    return {
      logo: logo,
      dialogLogout: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "name"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    gotoIndex(e) {
      this.$router.push({ path: "/dashboard" });
    },
    mess(e) {
      console.log(e);
    },
    open() {
      const h = this.$createElement;
      this.$notify({
        title: "标题名称",
        dangerouslyUseHTMLString: true,
        message: `<ul><li @cilck="mess">这是第一条</li></ul>`,
        duration: 3000,
        offset: 90
      });
    },
    out() {
      this.$confirm("确认退出吗？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "祝您生活愉快!"
          });
          this.logout();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出操作"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.navbar {
  height: $navBarHeight;
  overflow: hidden;
  position: fixed;
  z-index: 100;
  width: 100%;
  background: linear-gradient(
    -3deg,
    rgba(233, 78, 53, 1) 0%,
    rgba(230, 21, 65, 1) 100%
  );
  box-shadow: 0px 0px 25px 2px rgba(233, 78, 53, 0.14);

  .confirm {
    background: linear-gradient(
      -3deg,
      rgba(233, 78, 53, 1) 0%,
      rgba(230, 21, 65, 1) 100%
    );
  }
  .logo {
    float: left;
    width: 270px;
    height: $navBarHeight;
    line-height: $navBarHeight;
    text-align: center;
  }

  .navbar-logo {
    margin-top: 5px;
    width: 42%;
  }

  .hamburger-container {
    line-height: 100px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: $navBarHeight;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .logout {
      // margin-top: -8px;
      margin-right: 46px;
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }
    .messages {
      // margin-top: -5px;
      margin-right: 25px;
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }
  }
}
</style>
