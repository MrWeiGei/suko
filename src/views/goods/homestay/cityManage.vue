<template>
  <div class="contnet">
    <!-- 第一列 -->
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <el-col style="margin-top:20px;margin-left:38px;">
        <el-col :span="2" style="margin-bottom:40px">
          <el-button @click="addGoods">添加城市</el-button>
        </el-col>

        <my-table
          style="width:50%"
          :tableData="tableData"
          :tableHead="tableHead"
          :makeData="makeData"
          :pageSize="pageSize"
          :total="total"
          :load="load"
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
      <el-form :model="info" label-width="120px" :rules="rules" ref="info" class="form">
        <el-form-item label="城市名称" prop="citys">
          <el-cascader
            v-model="info.citys"
            :props="props"
            class="info"
            filterable
            @change="getCode"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="城市拼音" prop="simpe">
          <el-input v-model="info.simpe" autocomplete="off" class="info" readonly></el-input>
        </el-form-item>
        <el-form-item label="热门城市" prop="isHot">
          <el-radio-group v-model="info.isHot">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="save('info')">{{show}}</el-button>
        <el-button type="danger" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//by chenjiagnbo
import MyTable from "@/components/MyTable";
import {
  fetchList,
  createOne,
  updateOne,
  delOne,
  simpeCode
} from "@/api/goods/city";
import { search } from "@/api/dict";
import { getCity } from "@/api/city";
import { JudgeDate, isJson } from "@/utils/validate";
import { mapGetters } from "vuex";
export default {
  components: {
    MyTable
  },
  data() {
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
        citys: ["北京市"],
        cityName: "", //城市
        simpe: "", //城市拼音
        isHot: "0" //是否热门
      },
      dialogFormVisible: false,
      title: "添加城市",
      show: "确定",
      changeFlag: false,
      pageSize: 10,
      selectData: [],
      pageNum: 1,
      total: 0,
      load: true,
      dictArr: [],
      findObj: {},
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
          label: "城市名称",
          width: "200",
          prop: "cityName"
        },
        {
          label: "城市拼音",
          width: "200",
          prop: "simpe"
        },
        {
          label: "是否是热门城市",
          width: "200",
          prop: "isHot",
          hasChange: true,
          content: []
        }
      ],
      tableData: [],
      rules: {
        isHot: [
          { required: true, message: "请选择是否为热门城市", trigger: "blur" }
        ],
        simpe: [{ required: true, message: "请输入城市拼音", trigger: "blur" }],
        citys: [{ required: true, message: "请选择所在城市", trigger: "blur" }]
      },
      options: [
        {
          value: "北京",
          label: "北京",
          children: [
            {
              value: "北京市",
              label: "北京市"
            }
          ]
        },
        {
          value: "天津",
          label: "天津",
          children: [
            {
              value: "天津市",
              label: "天津市"
            }
          ]
        }
      ]
    };
  },
  async mounted() {
    this.findObj = { pageSize: this.pageSize, pageNum: this.pageNum };
    await this.getDict();
    await this.getList(this.findObj);
  },
  methods: {
    getCode(e) {
      var city = this.getCity(e[1]);
      simpeCode({ chin: city }).then(res => {
        this.info.simpe = res.msg;
      });
    },
    //编辑方法
    edit(e) {
      debugger;
      if (!this.$refs) {
        this.$refs["info"].resetFields();
      }
      this.changeFlag = true;
      this.dialogFormVisible = true;
      this.title = "修改城市";
      this.show = "修改";

      for (var i in this.info) {
        for (var j in e) {
          if (i == j) {
            if (e[j] == null) {
              e[j] = "";
            }
            this.info[i] = e[j];
          }
        }
      }
      this.info.citys = [this.info.city];
      this.info.id = e.id;
    },
    getCity(city) {
      if (city.indexOf("市") != -1) {
        return city.split("市")[0];
      }
      if (city.indexOf("自治州") != -1) {
        return city.split("自治州")[0];
      }
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
      this.title = "添加城市";
      this.show = "确定";
      if (!this.$refs) {
        this.$refs["info"].resetFields();
      }
      this.info = {
        citys: ["北京", "北京市"],
        cityName: "", //城市
        simpe: "", //城市拼音
        isHot: "0" //是否热门
      };
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        // debugger;
        if (valid) {
          this.info.cityName = this.getCity(this.info.citys[1]);
          delete this.info.citys;
          if (!this.changeFlag) {
            // 非修改状态
            createOne(this.info).then(res => {
              if (res.code == 0) {
                this.getList(this.findObj);
                this.dialogFormVisible = false;
                this.$message.success("添加城市成功！");
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
      var ishot = await search("is_not_city");
      this.dictArr = [
        {
          label: "isHot",
          value: ishot.res
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
      let res = await fetchList(e);
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
    margin: 100px auto 0 auto;
    min-width: 1100px !important;
    max-width: 1100px !important;
  }
  .form {
    padding: 20px;
    .info {
      width: 330px;
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

