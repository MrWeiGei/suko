<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="机票订单"></unified-style>
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
import UnifiedStyle from "@/components/UnifiedStyle";
import MyTable from "@/components/MyTable";
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
            from: "num"
          },
          {
            label: "订票人",
            type: "input",
            from: "people"
          },
          {
            label: "航班时间",
            type: "date",
            from: "date"
          },
          {
            type: "button"
          }
        ],
        twoData: [
          {
            label: "乘机人",
            type: "input",
            from: "peoples"
          },
          {
            label: "订单状态",
            type: "select",
            from: "status",
            options: [
              {
                label: "申请中",
                value: 0
              },
              {
                label: "已订座",
                value: 1
              },
              {
                label: "已调度",
                value: 2
              },
              {
                label: "配送中",
                value: 3
              },
              {
                label: "部分出票",
                value: 4
              },
              {
                label: "客户取消",
                value: 5
              },
              {
                label: "已完成",
                value: 6
              }
            ]
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
          label: "订票员",
          width: "120",
          prop: "name"
        },
        {
          label: "预订时间",
          width: "100",
          prop: "name"
        },
        {
          label: "PNR",
          width: "100",
          prop: "date"
        },
        {
          label: "航班类型",
          width: "120",
          prop: "date"
        },
        {
          label: "航程",
          width: "120",
          prop: "date"
        },
        {
          label: "航班号",
          width: "120",
          prop: "date"
        },
        {
          label: "起飞时间",
          width: "120",
          prop: "date"
        },
        {
          label: "乘机人",
          width: "110",
          prop: "date"
        },
        {
          label: "证件号码",
          width: "120",
          prop: "date"
        },
        {
          label: "人数",
          width: "180",
          prop: "date"
        },
        {
          label: "采购价",
          width: "120",
          prop: "date"
        },
        {
          label: "账单价",
          width: "120",
          prop: "date"
        },
        {
          label: "加利/让利",
          width: "120",
          prop: "date"
        },
        {
          label: "销售价",
          width: "120",
          prop: "date"
        },
        {
          label: "机建",
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
      }, 1500);
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

