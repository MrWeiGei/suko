<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="管家服务管理"></unified-style>
      <find-list :data="findlist" @find="find"></find-list>
      <el-col style="margin-top:20px;margin-left:38px;">
        <el-col :span="2">
          <exports filename="布草管理导出表" :tabHead="tableHead" :tabData="selectData"></exports>
        </el-col>
        <el-col :span="2">
          <el-button @click="addGoods">发布商品</el-button>
        </el-col>

        <my-table
          style="width:96%"
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
          @delete="deletes"
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
            <el-form-item label="商品种类" prop="goodsItem">
              <el-select v-model="info.goodsItem" placeholder="请选择商品种类" class="info">
                <el-option v-for="i in goodsItem" :key="i.index" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品名称" prop="goodsName">
              <el-input v-model="info.goodsName" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第2行 -->
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="info.specification" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="onePrice">
              <el-input
                v-model="info.onePrice"
                autocomplete="off"
                class="info"
                @blur="makeAllPrice"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 第3行 -->
          <el-col :span="12">
            <el-form-item label="数量" prop="quantity">
              <el-input
                v-model="info.quantity"
                autocomplete="off"
                class="info"
                @blur="makeAllPrice"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="活动价格" prop="activePrice">
              <el-input v-model="info.activePrice" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第4行 -->
          <el-col :span="12">
            <el-form-item label="城市" prop="citys">
              <el-cascader v-model="info.citys" :props="props" class="info"></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="info.remark" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第五行 -->
          <el-col :span="12">
            <el-form-item label="总价" prop="sumPrice">
              <el-input v-model="info.sumPrice" autocomplete="off" class="info" readonly></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="供应类型" prop="vendorClass">
              <el-select v-model="info.vendorClass">
                <el-option label="个人" value="0"></el-option>
                <el-option label="供应商" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <!-- 第3行 -->
          <!-- <el-col :span="12">
            <el-form-item label="活动开始时间" prop="startTime">
              <el-date-picker
                v-model="info.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束时间" prop="endTime">
              <el-date-picker
                v-model="info.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>-->
          <el-col>
            <div class="hr"></div>
          </el-col>

          <el-col style="margin-top:30px">
            <el-form-item label="上传图片">
              <photo :list="pic" url="http://192.168.1.3:81/" @remove="removePhoto"/>
              <upload :url="picUrl" @success="success" @remove="remove"/>
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
import upload from "@/components/Upload";
import photo from "@/components/Upload/photo";
import {
  fetchList,
  createOne,
  updateOne,
  delOne,
  searchList
} from "@/api/goods/linen";
import { search } from "@/api/dict";
import { getCity } from "@/api/city";
import { JudgeDate, isJson } from "@/utils/validate";
import { mapGetters } from "vuex";
export default {
  components: {
    FindList,
    UnifiedStyle,
    MyTable,
    exports,
    upload,
    photo
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value == 0) {
        callback(new Error("请输入不为0的数字"));
      } else {
        callback();
      }
    };
    const valiDate = (rule, value, callback) => {
      if (JudgeDate(this.info.startTime, this.info.endTime)) {
        callback();
      } else {
        callback(new Error("活动结束时间必须晚于开始时间"));
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
        goodsItem: "0", //商品种类
        goodsName: "",
        remark: "11", //备注
        specification: "111", //规格
        onePrice: "11", //单价
        sumPrice: "11", //总价
        activePrice: "11", //活动价格
        citys: [],
        vendorCity: "",
        pic: [],
        quantity: "1"
      },
      pic: [],
      dialogFormVisible: false,
      title: "发布商品",
      show: "确定",
      selectData: [],
      changeFlag: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      load: true,
      dictArr: [],
      findObj: {},
      findlist: {
        oneData: [
          {
            label: "城市",
            type: "input",
            from: "vendorCity"
          },
          {
            label: "商品种类",
            type: "select",
            from: "goodsItem",
            options: [
              {
                label: "床单",
                value: 0
              },
              {
                label: "被罩",
                value: 1
              },
              {
                label: "枕面",
                value: 2
              }
            ]
          },
          {
            label: "供应商",
            type: "input",
            from: "vendorName"
          },
          {
            type: "button"
          }
        ],
        twoData: [
          {
            label: "手机号",
            type: "input",
            from: "contactPhone"
          }
        ]
      },
      makeData: [
        {
          type: "edit",
          name: "编辑"
        },
        {
          type: "delete",
          name: "删除"
        }
      ],
      tableHead: [
        {
          label: "城市",
          width: "200",
          prop: "vendorCity"
        },
        {
          label: "商品种类",
          width: "120",
          prop: "goodsItem",
          hasChange: true,
          content: ""
        },
        {
          label: "供应商",
          width: "100",
          prop: "vendorName"
        },
        {
          label: "货品名称",
          width: "100",
          prop: "goodsName"
        },
        {
          label: "规格",
          width: "120",
          prop: "specification"
        },
        {
          label: "单价",
          width: "120",
          prop: "onePrice"
        },
        {
          label: "布草状态",
          width: "120",
          prop: "reviewStatus",
          hasChange: true,
          content: ""
        },
        {
          label: "数量",
          width: "120",
          prop: "quantity"
        },
        {
          label: "总价",
          width: "110",
          prop: "sumPrice"
        },
        {
          label: "活动价格",
          width: "110",
          prop: "activePrice"
        },
        {
          label: "备注",
          width: "110",
          prop: "remark"
        }
      ],
      tableData: [],
      goodsItem: [
        {
          label: "床单",
          value: "0"
        },
        {
          label: "被罩",
          value: "1"
        },
        {
          label: "枕面",
          value: "2"
        }
      ],
      rules: {
        goodsItem: [
          { required: true, message: "请选择商品种类", trigger: "change" }
        ],
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请输入规格", trigger: "blur" }
        ],
        onePrice: [
          { required: true, message: "请输入单价", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        quantity: [
          { required: true, message: "请输入数量", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        sumPrice: [
          { required: true, message: "请输入总价", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        activePrice: [
          { required: true, message: "请输入活动价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        // startTime: [
        //   { required: true, message: "请选择活动开始时间", trigger: "blur" },
        //   { required: true, trigger: "blur", validator: valiDate }
        // ],
        // endTime: [
        //   { required: true, message: "请选择活动结束时间", trigger: "blur" },
        //   { required: true, trigger: "blur", validator: valiDate }
        // ],
        // vendorClass: [
        //   { required: true, message: "请选择供应类型", trigger: "change" }
        // ],
        citys: [{ required: true, message: "请选择所在城市", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注信息", trigger: "blur" }]
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
    // 获取总价
    makeAllPrice() {
      this.info.sumPrice =
        parseFloat(this.info.quantity) * parseFloat(this.info.onePrice);
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
      this.info.quantity = "";
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
    // 分页大小发生改变
    sizeChange(e) {
      this.findObj.pageSize = e.pageSize;
      this.findObj.pageNum = e.pageNum;
      this.getList(this.findObj);
    },
    // 表格多选框
    select(e) {
      this.selectData = e;
    },
    // 上传图片时删除图片的操作
    remove(e) {
      this.info.pic.forEach((i, index) => {
        if (i == e.response.url) {
          this.info.pic.splice(index, 1);
          this.$message.success("文件删除成功！");
        }
      });
    },
    // 已经上传的图片 删除方法
    removePhoto(e) {
      this.pic.splice(e, 1);
      this.info.pic.splice(e, 1);
    },
    // 删除方法
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
    // 图片上传成功
    success(e) {
      this.info.pic.push(e.response.url);
    },
    // 发布商品按钮
    addGoods() {
      this.changeFlag = false;
      this.dialogFormVisible = true;
      this.title = "发布商品";
      this.show = "确定";
      if (!this.$refs) {
        this.$refs["info"].resetFields();
      }
      this.info = {
        goodsItem: "0", //商品种类
        goodsName: "",
        remark: "11", //备注
        specification: "111", //规格
        onePrice: "11", //单价
        sumPrice: "11", //总价
        activePrice: "11", //活动价格
        citys: [],
        vendorCity: "",
        pic: [],
        quantity: "1"
      };
      this.pic = [];
    },
    // 获取城市的方法
    getCity(city) {
      for (var i = 0; i < city.length; i++) {
        if (city[i].indexOf("市") != -1) {
          return city[i];
        }
      }
    },
    // 上传&&修改的操作
    save(formName) {
      this.$refs[formName].validate(valid => {
        // debugger;
        if (valid) {
          this.info.vendorCity = this.getCity(this.info.citys);
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
                this.pic = [];
              }
            });
          } else {
            // 修改状态
            updateOne(this.info).then(res => {
              if (res.code == 0) {
                this.getList(this.findObj);
                this.dialogFormVisible = false;
                this.$message.success("修改数据成功！");
                this.pic = [];
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取数据字典
    async getDict() {
      var goodsItem = await search("goos_item");
      //   var vendorClass = await search("vendor_class");
      var reviewStatus = await search("review_status");
      this.dictArr = [
        {
          label: "goodsItem",
          value: goodsItem.res
        },
        // {
        //   label: "vendorClass",
        //   value: vendorClass.res
        // },
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
    // 获取列表
    async getList(e) {
      this.load = true;
      let res = await searchList(e);
      var data = res.res.list;
      this.total = res.res.total;
      this.tableData = data;
      this.load = false;
    }
  },
  computed: {
    ...mapGetters(["picUrl"])
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

