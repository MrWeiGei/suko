<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="门票订单"></unified-style>
      <find-list :data="findlist" @find="find"></find-list>
      <el-col style="margin-top:20px;margin-left:38px;">
        <my-table
          style="width:95%"
          :tableData="tableData"
          :tableHead="tableHead"
          :makeData="makeData"
          :pageSize="pageSize"
          :total="total"
          :load="load"
          @change="change"
          @search="search"
        ></my-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FindList from "@/components/FindList";
import MyTable from "@/components/MyTable";
import UnifiedStyle from "@/components/UnifiedStyle";
export default {
  components: {
    FindList,
    UnifiedStyle,
    MyTable
  },
  data() {
    return {
      pageSize: 8,
      total: 100,
      load: true,
      findlist: {
        oneData: [
          {
            label: "订单编号",
            type: "input",
            from: "orderNum"
          },
          {
            label: "订单状态",
            type: "input",
            from: "status"
          },
          {
            label: "旅游日期",
            type: "date",
            from: "date"
          },
          {
            label: "搜索",
            type: "button"
          }
        ],
        twoData: [
          {
            label: "取票人",
            type: "input",
            from: "peoples"
          },
          {
            label: "证件号码",
            type: "input",
            from: "num"
          },
          {
            label: "手机号码",
            type: "input",
            from: "phoneNum"
          }
        ]
      },
      makeData: [
        {
          type: "search",
          name: "查看"
        }
      ],
      tableHead: [
        {
          label: "订单编号",
          width: "100",
          prop: "zip"
        },
        {
          label: "景区名称",
          width: "120",
          prop: "name"
        },
        {
          label: "门票名称",
          width: "200",
          prop: "name"
        },
        {
          label: "景型",
          width: "100",
          prop: "date"
        },
        {
          label: "城市",
          width: "120",
          prop: "date"
        },
        {
          label: "手续费/张",
          width: "120",
          prop: "date"
        },
        {
          label: "保险",
          width: "120",
          prop: "date"
        },
        {
          label: "单价",
          width: "120",
          prop: "date"
        },
        {
          label: "数量",
          width: "110",
          prop: "date"
        },
        {
          label: "旅游日期",
          width: "120",
          prop: "date"
        },
        {
          label: "取票人",
          width: "180",
          prop: "date"
        },
        {
          label: "证件号码",
          width: "120",
          prop: "date"
        },
        {
          label: "手机号",
          width: "120",
          prop: "date"
        },
        {
          label: "小计",
          width: "120",
          prop: "date"
        },
        {
          label: "订单状态",
          width: "120",
          prop: "date"
        },
        {
          label: "订单来源",
          width: "120",
          prop: "date"
        }
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王虎",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "呼虎",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "轩辕钩子",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "老王",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        }
      ]
    };
  },
  mounted() {
    this.make();
  },
  methods: {
    find(e) {
      alert(JSON.stringify(e));
    },
    search(e) {
      alert(JSON.stringify(e));
    },
    change(e) {
      alert(JSON.stringify(e));
    },
    make() {
      var this_ = this;
      setTimeout(function() {
        this_.load = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.contnet {
  padding: 10px;
  background: #e7e7e7;
}
</style>

