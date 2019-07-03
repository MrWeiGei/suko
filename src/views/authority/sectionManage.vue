<template>
  <div class="contnet">
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="部门管理" />
      <el-col style="margin-top:25px;margin-left:38px">
        <el-button type="danger" icon="el-icon-plus" @click="addone">增加</el-button>
      </el-col>
      <el-col style="margin-top:35px;margin-left:38px;padding-bottom:300px">
        <my-table
          class="table"
          :table-data="tableData"
          :table-head="tableHead"
          :make-data="makeData"
          :page-size="pageSize"
          :total="total"
          :load="load"
          @change="change"
          @sizeChange="sizeChange"
          @edit="edit"
          @del="del"
        />
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog title="信 息" :visible.sync="dialogFormVisible" class="dialog">
      <el-row>
        <el-col :offset="3" :span="18" style="margin-top:30px">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="部门名称:" label-width="90px" prop="deptName">
              <el-input v-model="form.deptName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="部门描述:" label-width="90px" prop="description">
              <el-input v-model="form.description" autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" style="margin-right:40px" @click="add('form')">{{button}}</el-button>
        <el-button type="danger" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UnifiedStyle from "@/components/UnifiedStyle";
import MyTable from "@/components/MyTable";
import {
  fetchList,
  createOne,
  updateOne,
  deleteOne,
  getPageList
} from "@/api/authority/dept";
export default {
  components: {
    UnifiedStyle,
    MyTable
  },
  data() {
    return {
      button: "提交",
      load: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogFormVisible: false,
      changeFlag: false,
      form: {
        deptName: "",
        description: ""
      },
      makeData: [
        {
          type: "edit",
          name: "编辑"
        },
        {
          type: "del",
          name: "删除"
        }
      ],
      tableHead: [
        {
          label: "部门名称",
          width: "150",
          prop: "deptName"
        },
        {
          label: "部门描述",
          width: "300",
          prop: "description"
        },
        {
          label: "创建时间",
          width: "150",
          prop: "createTime"
        }
      ],
      tableData: [],
      rules: {
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入部门描述", trigger: "blur" },
          { min: 5, max: 50, message: "长度在 5 到 50 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    addone() {
      this.dialogFormVisible = true;
      this.form = {};
      if (!this.$refs) {
        this.$refs["form"].resetFields();
      }
      this.changeFlag = false;
      this.button = "提交";
    },
    sizeChange(e) {
      this.pageSize = e.pageSize;
      this.pageNum = e.pageNum;
      this.getList();
    },
    edit(e) {
      this.dialogFormVisible = true;
      this.changeFlag = true;
      this.button = "修改";
      this.form.deptName = e.deptName;
      this.form.description = e.description;
      this.form.id = e.id;
    },
    del(e) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOne({ deptId: e.id }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            }
            if (res.code == 500) {
              this.$message({
                type: "warning",
                message: res.msg
              });
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
    change(e) {
      alert(JSON.stringify(e));
    },
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.changeFlag) {
            updateOne(this.form).then(res => {
              if (res.code == 0) {
                this.dialogFormVisible = false;
                this.getList();
              }
            });
          } else {
            createOne(this.form).then(res => {
              if (res) {
                this.dialogFormVisible = false;
                this.getList();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    async getList() {
      let res = await getPageList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      this.tableData = [];
      var data = res.res;
      this.total = data.total;
      this.tableData = data.list;
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
    min-width: 1300px !important;
    max-width: 1500px !important;
    margin: 0 auto;
  }
  .dialog-footer {
    margin-bottom: 20px;
  }

  .table {
    width: 810px;
  }
}
</style>

