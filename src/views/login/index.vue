<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">{{ $t('login.title') }}</h3>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="validateCode">
        <span class="svg-container"></span>
        <el-input
          ref="validateCode"
          v-model="loginForm.validateCode"
          :placeholder="$t('login.code')"
          name="validateCode"
          type="text"
          tabindex="1"
          auto-complete="on"
          style="width:260px;display:inline-block"
        />
        <span @click="getcode">
          <Sidentify
            style="display:inline-block;height:38px;vertical-align: middle;"
            :identifyCode="identifyCode"
          ></Sidentify>
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin:25px 0 20px 0;height:45px"
        @click.native.prevent="handleLogin"
        @keyUp.enter="handleLogin"
      >{{ $t('login.logIn') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import Sidentify from "@/components/Identify";
import { getCode } from "@/api/user";

export default {
  name: "Login",
  components: { Sidentify },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    const code = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请输入验证码"));
      }
      if (value != this.identifyCode) {
        callback(new Error("验证码输入有误"));
      } else {
        callback();
      }
    };
    return {
      identifyCode: "",
      loginForm: {
        username: "admin",
        password: "!@#QWE",
        validateCode: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        validateCode: [
          {
            required: true,
            trigger: "blur",
            validator: code
          }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.getcode();
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getcode() {
      getCode().then(e => {
        this.identifyCode = String(e.res);
        this.loginForm.validateCode = String(e.res);
      });
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(res => {
              if (res.code == 600) {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
                this.getcode();
              }
              if (res.code == 0) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
              }
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #ffffff;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: 16px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid #ccc;
    // border-radius: 4px;
    color: #454545;

    &:hover {
      border-bottom: 1px solid #ff6d60;
    }
  }

  .el-button {
    background: linear-gradient(
      128deg,
      rgba(230, 16, 66, 1) 0%,
      rgba(232, 52, 61, 1) 50%,
      rgba(233, 80, 52, 1) 100%
    );
    border-color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #000;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url("./../../icons/background.png");
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 600px;
    max-width: 100%;
    padding: 30px 100px 20px 100px;
    margin: 3% auto;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid #ffffff;
    box-shadow: 1px 1px 4px #ffffff;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    font-size: 22px;
  }

  .title-container {
    position: relative;

    .title {
      letter-spacing: 6px;
      font-weight: 300;
      color: rgba(250, 251, 250, 1);
      font-weight: 300;
      font-size: 38px;
      margin: 9% auto 0px auto;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
