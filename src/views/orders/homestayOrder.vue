<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="民宿订单"></unified-style>
      <find-list :data="findlist" @find="find"></find-list>
      <el-col style="margin-top:20px;margin-left:38px;">
        <exports :tabHead="tableHead" :tabData="tableData"></exports>
        <my-table
          style="width:95%"
          :tableData="tableData"
          :tableHead="tableHead"
          :makeData="makeData"
          :pageSize="pageSize"
          :total="total"
          :load="load"
          @select="select"
          colType="selection"
          @change="change"
          @search="search"
        ></my-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FindList from "@/components/FindList";
import UnifiedStyle from "@/components/UnifiedStyle";
import MyTable from "@/components/MyTable";
import exports from "@/components/Exports";
import { setTimeout } from "timers";
export default {
  components: {
    FindList,
    UnifiedStyle,
    MyTable,
    exports
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
            from: "order"
          },
          {
            label: "订单状态",
            type: "select",
            from: "status",
            options: [
              {
                label: "待付款",
                value: 0
              },
              {
                label: "待审核",
                value: 1
              },
              {
                label: "待入住",
                value: 2
              },
              {
                label: "已入住",
                value: 3
              },
              {
                label: "已离店",
                value: 4
              },
              {
                label: "已取消",
                value: 5
              }
            ]
          },
          {
            label: "城市",
            type: "input",
            from: "city"
          },
          {
            type: "button"
          }
        ],
        twoData: [
          {
            label: "入住人",
            type: "input",
            from: "people"
          },
          {
            label: "入住时间",
            type: "date",
            from: "date"
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
          label: "城市",
          width: "120",
          prop: "name"
        },
        {
          label: "房屋编号",
          width: "100",
          prop: "name"
        },
        {
          label: "下单时间",
          width: "100",
          prop: "date"
        },
        {
          label: "支付状态",
          width: "120",
          prop: "date"
        },
        {
          label: "订单状态",
          width: "120",
          prop: "date"
        },
        {
          label: "订单用户",
          width: "120",
          prop: "date"
        },
        {
          label: "入住人",
          width: "120",
          prop: "date"
        },
        {
          label: "入住人电话",
          width: "110",
          prop: "date"
        },
        {
          label: "证件号码",
          width: "120",
          prop: "date"
        },
        {
          label: "入住时间段",
          width: "180",
          prop: "date"
        },
        {
          label: "入住天数",
          width: "120",
          prop: "date"
        },
        {
          label: "金额",
          width: "120",
          prop: "date"
        },
        {
          label: "押金",
          width: "120",
          prop: "date"
        },
        {
          label: "实收金额",
          width: "120",
          prop: "date"
        },
        {
          label: "支付方式",
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
      this.load = true;
      this.make();
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
      }, 1500);
    },
    select(e) {
      console.log(e);
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

