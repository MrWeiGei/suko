<template>
  <div class="dashboard-admin">
    <!-- 第一列 -->
    <div>
      <el-row class="alls">
        <el-col style="color:#FF6D60;background:#F7F7F7;padding:10px">
          <img src="./../../../icons/icon1.png" alt class="icons">业绩总览
        </el-col>
        <info-list :info="info" :show="true"></info-list>
      </el-row>

      <el-row style="margin-top:10px;" class="alls">
        <el-col style="color:#FF6D60;background:#F7F7F7;padding:10px">
          <img src="./../../../icons/icon1.png" alt class="icons">待办事宜
        </el-col>
        <info-list :info="infos"></info-list>
      </el-row>
      <el-row style="height:420px;margin-top:10px" class="alls">
        <el-col style="color:#FF6D60;background:#F7F7F7;padding:10px">
          <img src="./../../../icons/icon1.png" alt class="icons">订单统计
        </el-col>
        <el-col :span="20">&nbsp;</el-col>
        <el-col :span="4" style="margin-top:20px">
          <el-radio-group v-model="date" size="medium" fill="#FF6D60">
            <el-radio-button label="周"></el-radio-button>
            <el-radio-button label="月"></el-radio-button>
            <el-radio-button label="年"></el-radio-button>
          </el-radio-group>
        </el-col>
        <line-chart :chart-data="lineChartData" class="lineChart"/>
      </el-row>
    </div>
  </div>
</template>

<script>
import infoList from "./components/infoList";
import LineChart from "./components/LineChart";

export default {
  components: { infoList, LineChart },
  data() {
    return {
      info: [
        {
          index: "1",
          message: "今日订单数量",
          color: "#FF6D60",
          number: "789"
        },
        {
          index: "2",
          message: "今日销售总额",
          color: "#0CB4B3",
          number: "￥99,888,777"
        },
        {
          index: "3",
          message: "昨日销售总额",
          color: "#FDC811",
          number: "￥99,888,777"
        },
        {
          index: "4",
          message: "近七天销售总额",
          color: "#7EBF2B",
          number: "￥99,888,777"
        }
      ],
      infos: [
        {
          index: "1",
          message: "待审房源",
          color: "#FF6D60",
          number: "789"
        },
        {
          index: "2",
          message: "待审退房",
          color: "#0CB4B3",
          number: "99,888,777"
        },
        {
          index: "3",
          message: "待审押金退款",
          color: "#FDC811",
          number: "99,888,777"
        },
        {
          index: "4",
          message: "待审评论",
          color: "#7EBF2B",
          number: "99,888,777"
        }
      ],
      lineChartData: {
        dateData: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        orderData: [190, 10, 50, 250, 150, 20, 100]
      },
      date: "周"
    };
  }
};
</script>

<style lang="scss" scoped>
.dashboard-admin {
  padding: 10px;
  background: #e7e7e7;

  .alls {
    overflow: hidden;
    background: #ffffff;
    border-radius: 8px;

    .lineChart {
      margin-top: 100px;
    }
  }
}
</style>

