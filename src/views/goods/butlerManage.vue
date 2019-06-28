<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="管家服务管理"></unified-style>
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
            <el-form-item label="项目类目" prop="itemType">
              <el-select v-model="info.itemType" placeholder="请选择项目类目" class="info">
                <el-option v-for="i in itemType" :key="i.index" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目详细说明" prop="remark">
              <el-input v-model="info.remark" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第2行 -->
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="info.contactName" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="info.contactPhone" autocomplete="off" class="info" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第3行 -->
          <el-col :span="12">
            <el-form-item label="基础价格" prop="basePrice">
              <el-input v-model="info.basePrice" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特殊价格" prop="realPrice">
              <el-input v-model="info.realPrice" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第4行 -->
          <el-col :span="12">
            <el-form-item label="活动价格" prop="activityPrice">
              <el-input v-model="info.activityPrice" autocomplete="off" class="info"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="citys">
              <el-cascader v-model="info.citys" :props="props" class="info"></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应类型" prop="vendorClass">
              <el-select v-model="info.vendorClass">
                <el-option label="个人" value="0"></el-option>
                <el-option label="供应商" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <div class="hr"></div>
          </el-col>

          <el-col style="margin-top:30px">
            <el-form-item label="上传图片">
              <photo :list="pic" url="http://192.168.1.26:81/" @remove="removePhoto"/>
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
} from "@/api/goods/service";
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
        itemType: "0", //项目类目
        remark: "11", //项目详细说明
        contactName: "111",
        contactPhone: "13111111111",
        basePrice: "11",
        realPrice: "11",
        activityPrice: "11",
        citys: [],
        city: "",
        startTime: "",
        endTime: "",
        pic: [],
        vendorClass: ""
      },
      dialogFormVisible: false,
      title: "发布商品",
      show: "确定",
      changeFlag: false,
      pageSize: 10,
      selectData: [],
      pageNum: 1,
      total: 0,
      pic: [],
      load: true,
      dictArr: [],
      findObj: {},
      findlist: {
        oneData: [
          {
            label: "城市",
            type: "input",
            from: "city"
          },
          {
            label: "项目类型",
            type: "select",
            from: "itemType",
            options: [
              {
                label: "保洁",
                value: 0
              },
              {
                label: "跑腿",
                value: 1
              },
              {
                label: "唤醒",
                value: 2
              },
              {
                label: "礼迎",
                value: 3
              },
              {
                label: "接送",
                value: 4
              },
              {
                label: "专车",
                value: 5
              },
              {
                label: "旅拍",
                value: 6
              },
              {
                label: "导游",
                value: 7
              },
              {
                label: "特产",
                value: 8
              }
            ]
          },
          {
            label: "供应商",
            type: "input",
            from: "vendorClass"
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
          prop: "city"
        },
        {
          label: "供应类型",
          width: "120",
          prop: "vendorClass",
          hasChange: true,
          content: ""
        },
        {
          label: "项目类别",
          width: "100",
          prop: "itemType",
          hasChange: true,
          content: ""
        },
        {
          label: "管家状态",
          width: "100",
          prop: "reviewStatus",
          hasChange: true,
          content: ""
        },
        {
          label: "联系人",
          width: "120",
          prop: "contactName"
        },
        {
          label: "联系人电话",
          width: "120",
          prop: "contactPhone"
        },
        {
          label: "基础价格",
          width: "120",
          prop: "basePrice"
        },
        {
          label: "特殊价格",
          width: "120",
          prop: "realPrice"
        },
        {
          label: "备注",
          width: "110",
          prop: "remark"
        }
      ],
      tableData: [],
      itemType: [
        {
          label: "保洁",
          value: "0"
        },
        {
          label: "跑腿",
          value: "1"
        },
        {
          label: "唤醒",
          value: "2"
        },
        {
          label: "礼迎",
          value: "3"
        },
        {
          label: "接送",
          value: "4"
        },
        {
          label: "专车",
          value: "5"
        },
        {
          label: "旅拍",
          value: "6"
        },
        {
          label: "导游",
          value: "7"
        },
        {
          label: "特产",
          value: "8"
        }
      ],
      rules: {
        itemType: [
          { required: true, message: "请选择项目类目", trigger: "change" }
        ],
        remark: [
          { required: true, message: "请输入项目详细说明", trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入联系人手机号", trigger: "blur" },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        basePrice: [
          { required: true, message: "请输入基础价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        realPrice: [
          { required: true, message: "请输入特殊价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        activityPrice: [
          { required: true, message: "请输入活动价位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validate }
        ],
        startTime: [
          { required: true, message: "请选择活动开始时间", trigger: "change" },
          { required: true, trigger: "change", validator: valiDate }
        ],
        endTime: [
          { required: true, message: "请选择活动结束时间", trigger: "change" },
          { required: true, trigger: "change", validator: valiDate }
        ],
        vendorClass: [
          { required: true, message: "请选择供应类型", trigger: "change" }
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
    removePhoto(e) {
      this.pic.splice(e, 1);
      this.info.pic.splice(e, 1);
    },
    remove(e) {
      this.info.pic.forEach((i, index) => {
        if (i == e.response.url) {
          this.info.pic.splice(index, 1);
          this.$message.success("文件删除成功！");
        }
      });
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
    success(e) {
      this.info.pic.push(e.response.url);
    },
    addGoods() {
      this.changeFlag = false;
      this.dialogFormVisible = true;
      this.title = "发布商品";
      this.show = "确定";
      if (!this.$refs) {
        this.$refs["info"].resetFields();
      }
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
      var itemType = await search("service_type");
      var vendorClass = await search("vendor_class");
      var reviewStatus = await search("review_status");
      this.dictArr = [
        {
          label: "itemType",
          value: itemType.res
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

