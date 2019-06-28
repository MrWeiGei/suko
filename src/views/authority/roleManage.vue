<template>
  <div class="contnet">
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="角色管理"/>
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
          @edit="edit"
          @del="del"
        />
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog title="信 息" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :offset="3" :span="18" style="margin-top:30px">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="用户名:" label-width="100px" prop="roleName">
              <el-input v-model="form.roleName" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="所在权限组:" label-width="100px">
              <el-select v-model="deptId" class="select">
                <el-option
                  v-for="item in optionArr"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述:" label-width="100px">
              <el-input v-model="form.remark" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="选择权限:" label-width="100px">
              <el-tree
                :props="defaultProps"
                :data="data"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                accordion
                class="tree"
              ></el-tree>
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
import { createOne, fetchList, updateOne, delOne } from "@/api/authority/role";
import { searchList, getMenuList } from "@/api/authority/menu";
import { fetchList as fetchOptionList } from "@/api/authority/dept";
export default {
  components: {
    UnifiedStyle,
    MyTable
  },
  data() {
    return {
      button: "提交",
      load: true,
      pageSize: 8,
      pageNum: 1,
      total: 100,
      dialogFormVisible: false,
      changeFlag: false,
      optionArr: [],
      data: [
        {
          id: 0,
          menuName: "全部菜单",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "menuName",
        isLeaf: "leaf"
      },
      form: {
        roleName: "",
        remark: ""
      },
      deptId: "",
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
          label: "角色名称",
          width: "150",
          prop: "roleName"
        },
        {
          label: "部门名称",
          width: "150",
          prop: "deptId"
        },
        {
          label: "权限描述",
          width: "150",
          prop: "remark"
        },
        {
          label: "创建时间",
          width: "150",
          prop: "createTime"
        }
      ],
      tableData: [],
      parentId: 0,
      rules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
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
    edit(e) {
      this.dialogFormVisible = true;
      this.changeFlag = true;
      this.button = "修改";
      this.form.roleName = e.roleName;
      this.form.roleKey = e.roleKey;
      this.form.remark = e.remark;
      this.form.id = e.id;
    },
    del(e) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delOne({ roleId: e.id }).then(res => {
            if (res.code == 500) {
              this.$message({
                type: "warning",
                message: res.msg
              });
            }
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
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
      this.pageSize = e.pageSize;
      this.pageNum = e.pageNum;
      this.getList();
    },
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var menus = this.$refs.tree.getCheckedKeys();
          menus.forEach((item, index) => {
            if (item == 0) {
              menus.splice(index, 1);
            }
          });
          if (this.changeFlag) {
            updateOne({ role: this.form, menus, deptId: this.deptId }).then(
              res => {
                if (res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.msg
                  });
                  this.dialogFormVisible = false;
                  this.getList();
                }
              }
            );
          } else {
            createOne({ role: this.form, menus, deptId: this.deptId }).then(
              res => {
                if (res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.msg
                  });
                  this.dialogFormVisible = false;
                  this.getList();
                }
                if (res.code == 500) {
                  this.$message({
                    type: "success",
                    message: res.msg
                  });
                  this.dialogFormVisible = false;
                  this.getList();
                }
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    async getList() {
      this.optionArr = [];
      let res = await fetchList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      var data = res.res;
      this.tableData = data.list;
      this.load = false;
      this.total = data.total;
      let opres = await fetchOptionList();
      var opData = opres.res;
      opData.forEach(e => {
        this.optionArr.push({ label: e.deptName, value: e.id });
      });
      let e = await getMenuList();
      this.data[0].children = e.res;
    }
  }
};
</script>
<style lang="scss" scoped>
.contnet {
  padding: 10px;
  background: #e7e7e7;

  .dialog-footer {
    margin-bottom: 20px;
  }

  .table {
    width: 810px;
  }

  .tree {
    height: 250px;
    overflow-y: scroll;
  }
  .select {
    width: 350px;
  }
}
</style>

