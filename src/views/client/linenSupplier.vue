<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="布草供应商管理"></unified-style>
      <find-list :data="findlist" @find="find"></find-list>
      <el-col style="margin-top:20px;margin-left:38px;">
        <el-col :span="2">
          <exports filename="管家服务管理导出表" :tabHead="tableHead" :tabData="selectData"></exports>
        </el-col>
        <el-col :span="2">
          <el-button @click="addGoods">发布商品</el-button>
        </el-col>

        <my-table
          style="width:82%"
          :tableData="tableData"
          :tableHead="tableHead"
          :makeData="makeData"
          :pageSize="pageSize"
          :total="total"
          :load="load"
          @select="select"
          colType="selection"
          @change="change"
          @sizeChange="sizeChange"
          @edit="edit"
        ></my-table>
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      class="dialog"
      label-position="left"
      v-if="dialogFormVisible"
    >
      <el-form :model="info" label-width="120px" :rules="rules" ref="info">
        <el-row class="row">
          <!-- 第一行 -->
          <el-col :span="12">
            <el-form-item label="供应商分类" prop="vendorClass">
              <el-select v-model="info.vendorClass" placeholder="请选择供应商分类" class="info">
                <el-option label="个人" value="0"></el-option>
                <el-option label="企业" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商简称" prop="vendorShortName">
              <el-input v-model="info.vendorShortName" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第2行 -->
          <el-col :span="12">
            <el-form-item label="所在城市" prop="citys">
              <el-cascader v-model="info.citys" :props="props" class="info"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表" prop="legalName">
              <el-input v-model="info.legalName" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>

          <!-- 第3行 -->
          <el-col :span="12">
            <el-form-item label="电话" prop="officePhone">
              <el-input v-model="info.officePhone" autocomplete="off" class="info" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="info.idCard" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第4行 -->
          <el-col :span="12">
            <el-form-item label="运营负责人" prop="vendorDuty">
              <el-input v-model="info.vendorDuty" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保障金" prop="margin">
              <el-input v-model="info.margin" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="save('info')">{{show}}</el-button>
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
import {
  fetchList,
  createOne,
  updateOne,
  delOne,
  searchList
} from "@/api/client/linen";
import { search } from "@/api/dict";
import { getCity } from "@/api/city";
import { JudgeDate, isJson } from "@/utils/validate";
import { mapGetters } from "vuex";
export default {
  components: {
    FindList,
    UnifiedStyle,
    MyTable,
    exports
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value == 0) {
        callback(new Error("请输入不为0的数字"));
      } else {
        callback();
      }
    };
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level == 0) {
            getCity({ parentId: 0 }).then(res => {
              var data = res.res;
              var arr = [];
              data.forEach(i => {
                arr.push({
                  value: i.cityName,
                  label: i.cityName,
                  id: i.id,
                  leaf: level >= 2
                });
              });
              resolve(arr);
            });
          } else {
            var id = node.data.id;
            getCity({ parentId: id }).then(res => {
              var data = res.res;
              var arr = [];
              data.forEach(i => {
                arr.push({
                  value: i.cityName,
                  label: i.cityName,
                  id: i.id,
                  leaf: true
                });
              });
              resolve(arr);
            });
          }
        }
      },
      info: {
        vendorClass: "0", //项目类目
        vendorShortName: "11", //项目详细说明
        legalName: "111",
        officePhone: "13111111111",
        vendorDuty: "11",
        margin: "11",
        idCard: "11",
        citys: [],
        city: ""
      },
      dialogFormVisible: false,
      title: "发布商品",
      show: "确定",
      changeFlag: false,
      pageSize: 10,
      selectData: [],
      pageNum: 1,
      total: 0,
      load: true,
      dictArr: [],
      findObj: {},
      findlist: {
        oneData: [
          {
            label: "供应商名称",
            type: "input",
            from: "vendorFullName"
          },
          {
            label: "供应商代码",
            type: "input",
            from: "vendorCode"
          },
          {
            label: "状态",
            type: "select",
            from: "reviewStatus",
            options: [
              {
                label: "已审核",
                value: 0
              },
              {
                label: "未审核",
                value: 1
              },
              {
                label: "审核不通过",
                value: 2
              },
              {
                label: "违规冻结",
                value: 3
              },
              {
                label: "解冻",
                value: 4
              }
            ]
          },
          {
            type: "button"
          }
        ],
        twoData: [
          {
            label: "城市",
            type: "input",
            from: "city"
          }
        ]
      },
      makeData: [
        {
          type: "edit",
          name: "编辑"
        }
      ],
      tableHead: [
        {
          label: "供应商代码",
          width: "200",
          prop: "vendorCode"
        },
        {
          label: "供应类型",
          width: "120",
          prop: "vendorClass",
          hasChange: true,
          content: ""
        },
        {
          label: "供应商简称",
          width: "110",
          prop: "vendorShortName"
        },
        {
          label: "所在国家或省份",
          width: "120",
          prop: "countryProvince"
        },
        {
          label: "所在城市",
          width: "100",
          prop: "city"
        },
        {
          label: "供应商地址",
          width: "100",
          prop: "vendorAddress"
        },
        {
          label: "法人代表",
          width: "120",
          prop: "legalName"
        },
        {
          label: "法人电话",
          width: "120",
          prop: "legalPhone"
        },
        {
          label: "支付科目",
          width: "120",
          prop: "payType",
          hasChange: true,
          content: ""
        },
        {
          label: "联系人姓名",
          width: "120",
          prop: "realName"
        },
        {
          label: "联系人电话",
          width: "120",
          prop: "officePhone"
        },
        {
          label: "保障金",
          width: "120",
          prop: "margin"
        },
        {
          label: "余额",
          width: "120",
          prop: "balance"
        },
        {
          label: "状态",
          width: "120",
          prop: "reviewStatus",
          hasChange: true,
          content: ""
        },
        {
          label: "注册时间",
          width: "120",
          prop: "registerTime"
        },
        {
          label: "备注",
          width: "120",
          prop: "remark"
        }
      ],
      tableData: [],
      rules: {
        vendorClass: [
          { required: true, message: "请选择供应商分类", trigger: "change" }
        ],
        vendorShortName: [
          { required: true, message: "请输入供应商简称", trigger: "blur" }
        ],
        legalName: [
          { required: true, message: "请输入法人代表名称", trigger: "blur" }
        ],
        officePhone: [
          { required: true, message: "请输入联系人手机号", trigger: "blur" },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        vendorDuty: [
          { required: true, message: "请输入运营负责人名称", trigger: "blur" }
        ],
        margin: [
          { required: true, message: "请输入保障金", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        idCard: [
          { required: true, message: "请输入身份证", trigger: "blur" },
          {
            pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: "请输入正确的身份证",
            trigger: "blur"
          }
        ],
        citys: [{ required: true, message: "请选择所在城市", trigger: "blur" }]
      }
    };
  },
  async mounted() {
    this.findObj = { pageSize: this.pageSize, pageNum: this.pageNum };
    await this.getDict();
    await this.getList(this.findObj);
  },
  methods: {
    // 头部搜索方法
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
    //编辑方法
    edit(e) {
      if (!this.$refs) {
        this.$refs["info"].resetFields();
      }
      this.pic = [];
      this.changeFlag = true;
      this.dialogFormVisible = true;
      this.title = "修改商品";
      this.show = "修改";

      for (var i in this.info) {
        for (var j in e) {
          if (i == j) {
            // 判断是否在传值时将某些对象类型的转为字符串 然后反转
            if (isJson(this.info[i])) {
              this.info[i] = JSON.parse(this.info[i]);
            }
            if (Array.isArray(this.info[i])) {
              if (e[j] == null) {
                e[j] = "[]";
              }
              this.info[i] = JSON.parse(e[j]);
            } else {
              if (e[j] == null) {
                e[j] = "";
              }
              this.info[i] = e[j];
            }
          }
        }
      }
      Object.assign(this.pic, this.info.pic);
      this.info.id = e.id;
    },
    // 分页方法
    change(e) {
      this.findObj.pageSize = e.pageSize;
      this.findObj.pageNum = e.pageNum;
      this.getList(this.findObj);
    },
    sizeChange(e) {
      this.findObj.pageSize = e.pageSize;
      this.findObj.pageNum = e.pageNum;
      this.getList(this.findObj);
    },
    // 表格多选框
    select(e) {
      this.selectData = e;
    },
    deletes(e) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delOne({ id: e.id }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList(this.findObj);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addGoods() {
      this.changeFlag = false;
      this.dialogFormVisible = true;
      this.title = "发布商品";
      this.show = "确定";
      if (!this.$refs) {
        this.$refs["info"].resetFields();
      }
      this.info = {
        vendorClass: "0",
        vendorShortName: "11",
        legalName: "111",
        officePhone: "13111111111",
        vendorDuty: "11",
        margin: "11",
        idCard: "11",
        citys: [],
        city: ""
      };
      this.pic = [];
    },
    getCity(city) {
      for (var i = 0; i < city.length; i++) {
        if (city[i].indexOf("市") != -1) {
          return city[i];
        }
      }
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        // debugger;
        if (valid) {
          this.info.city = this.getCity(this.info.citys);
          if (this.info.pic.length <= 0) {
            this.$message.warning("至少上传一张图片");
            return false;
          } else {
            this.info.pic = JSON.stringify(this.info.pic);
          }
          delete this.info.citys;
          if (!this.changeFlag) {
            // 非修改状态
            createOne(this.info).then(res => {
              if (res.code == 0) {
                this.getList(this.findObj);
                this.dialogFormVisible = false;
                this.$message.success("添加管家服务成功！");
              }
            });
          } else {
            // 修改状态
            updateOne(this.info).then(res => {
              if (res.code == 0) {
                this.getList(this.findObj);
                this.dialogFormVisible = false;
                this.$message.success("修改数据成功！");
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getDict() {
      var payType = await search("sys_pay_type");
      var vendorClass = await search("vendor_class");
      var reviewStatus = await search("review_status");
      this.dictArr = [
        {
          label: "payType",
          value: payType.res
        },
        {
          label: "vendorClass",
          value: vendorClass.res
        },
        {
          label: "reviewStatus",
          value: reviewStatus.res
        }
      ];
      this.tableHead.forEach(i => {
        if (i.hasChange) {
          this.dictArr.forEach(j => {
            if (i.prop == j.label) {
              i.content = j.value;
            }
          });
        }
      });
    },
    async getList(e) {
      this.load = true;
      let res = await searchList(e);
      var data = res.res.list;
      this.total = res.res.total;
      this.tableData = data;
      this.load = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.contnet {
  padding: 10px;
  background: #e7e7e7;
  .dialog {
    min-width: 1500px !important;
    max-width: 1600px !important;
    margin: 0 auto;
  }

  .row {
    padding: 15px 20px;

    .info {
      width: 230px;
    }
  }
}
.hr {
  width: 90%;
  height: 1px;
  background: rgba(221, 221, 221, 1) !important;
  margin: 0 auto;
}
</style>

