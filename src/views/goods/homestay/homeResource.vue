<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="房源管理"></unified-style>
      <find-list :data="findlist" @find="find"></find-list>
      <el-col style="margin-left:38px;">
        <el-col :span="2">
          <exports filename="房源导出表" :tabHead="tableHead" :tabData="selectData"></exports>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" plain @click="addHome">发布房屋</el-button>
        </el-col>
      </el-col>
      <el-col style="margin-top:20px;margin-left:38px;">
        <my-table
          style="width:95%"
          :tableData="tableData"
          :tableHead="tableHead"
          :makeData="makeData"
          :pageSize="pageSize"
          colType="selection"
          :total="total"
          :load="load"
          @sizeChange="sizeChange"
          @change="change"
          @search="search"
          @check="check"
          @select="select"
        ></my-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      class="dialog"
      label-position="left"
    >
      <el-form :model="info" label-width="100px">
        <el-form-item></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">确 定</el-button>
        <el-button type="danger" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FindList from "@/components/FindList";
import UnifiedStyle from "@/components/UnifiedStyle";
import MyTable from "@/components/MyTable";
import exports from "@/components/Exports";
import { setTimeout } from "timers";
import { fetchList, search } from "@/api/goods/home";
import { search as searchDict } from "@/api/dict";
export default {
  components: {
    FindList,
    UnifiedStyle,
    MyTable,
    exports
  },
  data() {
    return {
      selectData: [],
      pageSize: 10,
      pageNum: 1,
      total: 100,
      load: true,
      title: "审核信息",
      dialogFormVisible: false,
      dictArr: [],
      info: {},
      findObj: {},
      findlist: {
        oneData: [
          {
            label: "城市",
            type: "input",
            from: "orderNum"
          },
          {
            label: "房东姓名",
            type: "input",
            from: "status"
          },
          {
            label: "手机号码",
            type: "input",
            from: "phone"
          },
          {
            label: "搜索",
            type: "button"
          }
        ],
        twoData: [
          {
            label: "房屋来源",
            type: "input",
            from: "peoples"
          }
        ]
      },
      makeData: [
        {
          type: "search",
          name: "查看",
          status: "0"
        },
        {
          type: "check",
          name: "审核",
          status: "1"
        },
        {
          type: "makeCheck",
          name: "已审核",
          status: "2"
        }
      ],
      tableHead: [
        {
          label: "房屋来源",
          width: "100",
          prop: "commMode",
          hasChange: true,
          content: ""
        },
        {
          label: "城市",
          width: "120",
          prop: "commCity"
        },
        {
          label: "房屋编号",
          width: "300",
          prop: "uuid"
        },
        {
          label: "房屋名称",
          width: "100",
          prop: "desHouseName"
        },
        {
          label: "房源状态",
          width: "120",
          prop: "reviewStatus",
          hasChange: true,
          content: ""
        },
        {
          label: "房东姓名",
          width: "120",
          prop: "date"
        },
        {
          label: "房东电话",
          width: "120",
          prop: "date"
        },
        {
          label: "房屋类型",
          width: "120",
          prop: "commHouseType",
          hasChange: true,
          content: ""
        },
        {
          label: "主题类型",
          width: "110",
          prop: "commThemeType",
          hasChange: true,
          content: ""
        },
        {
          label: "基础价格",
          width: "120",
          prop: "setBasePrice"
        },
        {
          label: "房屋押金",
          width: "180",
          prop: "setCash"
        },
        {
          label: "活动价格",
          width: "120",
          prop: "setActivePrice"
        },
        {
          label: "备注",
          width: "120",
          prop: "reviewExplain"
        }
      ],
      tableData: []
    };
  },
  async mounted() {
    this.findObj = { pageSize: this.pageSize, pageNum: this.pageNum };
    await this.getDict();
    await this.getList(this.findObj);
  },
  methods: {
    find(e) {
      this.load = true;
      for (var i in e) {
        if (e[i] === "") {
          delete e[i];
        }
      }
      e.pageSize = this.pageSize;
      e.pageNum = this.pageNum;
      this.findObj = e;
      this.getList(this.findObj);
    },
    search(e) {
      alert(JSON.stringify(e));
    },
    change(e) {
      this.pageSize = e.pageSize;
      this.pageNum = e.pageNum;
      this.getList(this.findObj);
    },
    sizeChange(e) {
      this.findObj.pageSize = e.pageSize;
      this.findObj.pageNum = e.pageNum;
      this.getList(this.findObj);
    },
    async getDict() {
      // 房屋经营模式
      var commMode = await searchDict("business_model");
      // 房屋审核状态
      var status = await searchDict("review_status");
      // 房屋类型
      var houseType = await searchDict("house_type");
      // 主题类型
      var themeType = await searchDict("theme_type");
      this.dictArr = [
        {
          label: "commMode",
          value: commMode.res
        },
        {
          label: "reviewStatus",
          value: status.res
        },
        {
          label: "commHouseType",
          value: houseType.res
        },
        {
          label: "commThemeType",
          value: themeType.res
        }
      ];
    },
    async getList(e) {
      var res = await fetchList(e);
      this.tableHead.forEach(i => {
        if (i.hasChange) {
          this.dictArr.forEach(j => {
            if (i.prop == j.label) {
              i.content = j.value;
            }
          });
        }
      });
      this.total = res.res.total;
      var data = res.res.list;
      this.tableData = data;
      this.load = false;
    },
    addHome() {
      this.$router.push({ path: "/addHome" });
    },
    check(e) {
      this.dialogFormVisible = true;
    },
    select(e) {
      this.selectData = e;
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

