<template>
  <div class="contnet">
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="管理员管理"></unified-style>
      <el-col style="margin-top:25px;margin-left:38px">
        <el-button type="danger" icon="el-icon-plus" @click="addone">增加</el-button>
      </el-col>
      <el-col style="margin-top:35px;margin-left:38px">
        <my-table
          class="table"
          :tableData="tableData"
          :tableHead="tableHead"
          :makeData="makeData"
          :pageSize="pageSize"
          :total="total"
          :load="load"
          @sizeChange="sizeChange"
          @change="change"
          @edit="edit"
          @del="del"
        ></my-table>
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog title="信 息" :visible.sync="dialogFormVisible" class="dialog">
      <el-row>
        <el-col :offset="3" :span="18" style="margin-top:30px">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="用户名:" label-width="90px" prop="userName">
              <el-input v-model="form.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" label-width="90px" prop="email">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" label-width="90px" prop="phone">
              <el-input v-model="form.phone" autocomplete="off" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="权限组:" label-width="90px" prop="deptId">
              <el-select v-model="form.deptId" class="select">
                <el-option
                  v-for="item in optionArr"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色:" label-width="90px">
              <el-checkbox-group v-model="roleIds">
                <el-checkbox v-for="i in roles" :label="i.id" :key="i.index">{{i.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="add('form')" style="margin-right:40px">{{button}}</el-button>
        <el-button type="danger" @click="dialogFormVisible = false" plain>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UnifiedStyle from "@/components/UnifiedStyle";
import MyTable from "@/components/MyTable";
import { validEmail } from "@/utils/validate";
import { fetchList as fetchOptionList } from "@/api/authority/dept";
import { searchList } from "@/api/authority/role";
import { createOne, fetchList, updateOne, delOne } from "@/api/authority/admin";
const roleOption = [
  { name: "超级管理员", id: "2" },
  { name: "管理员", id: "3" }
];
export default {
  components: {
    UnifiedStyle,
    MyTable
  },
  data() {
    return {
      button: "添加",
      load: true,
      pageSize: 10,
      pageNum: 1,
      optionArr: [],
      total: 0,
      dialogFormVisible: false,
      roles: roleOption,
      roleIds: [],
      changeFlag: false,
      form: {
        userName: "",
        deptId: "",
        email: "",
        phone: ""
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
          label: "用户名",
          width: "150",
          prop: "userName"
        },
        {
          label: "邮箱",
          width: "250",
          prop: "email"
        },
        {
          label: "手机号",
          width: "150",
          prop: "phone"
        },
        {
          label: "所在权限组",
          width: "150",
          prop: "deptId"
        }
      ],
      tableData: [],
      rules: {
        userName: [
          { required: true, message: "请输入菜单名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        deptId: [
          { required: true, message: "请选择菜单类型", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    addone() {
      this.roleIds = [];
      this.dialogFormVisible = true;
      this.form = {};
      this.changeFlag = false;
      this.button = "添加";
      if (!this.$refs) {
        this.$refs["form"].resetFields();
      }
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
      this.form.userName = e.userName;
      this.form.email = e.email;
      this.form.phone = e.phone;
      this.form.deptId = e.deptId;
      this.form.id = e.id;
    },
    del(e) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delOne({ userId: e.id }).then(res => {
            debugger;
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
      debugger;
      this.$refs[formName].validate(valid => {
        debugger;
        if (valid) {
          if (this.changeFlag) {
            debugger;
            updateOne({
              user: this.form,
              roles: this.roleIds
            }).then(res => {
              if (res.code == 500) {
                this.$message({
                  type: "warning",
                  message: res.msg
                });
              }
              if (res.code == 0) {
                this.dialogFormVisible = false;
                this.getList();
              }
            });
          } else {
            createOne({
              user: this.form,
              roles: this.roleIds
            }).then(res => {
              if (res.code == 500) {
                this.$message({
                  type: "warning",
                  message: res.msg
                });
              }
              if (res.code == 0) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
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
      this.optionArr = [];
      let opres = await fetchOptionList();
      var opData = opres.res;
      opData.forEach(e => {
        this.optionArr.push({ label: e.deptName, value: e.id });
      });
      let role = await searchList();
      var roleArr = role.res;
      var arr = [];
      roleArr.forEach(e => {
        arr.push({ name: e.roleName, id: e.id });
      });
      this.roles = arr;
      let res = await fetchList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      this.total = res.res.total;
      this.tableData = res.res.list;
      this.load = false;
    }
  },
  mounted() {
    this.getList();
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
    width: 910px;
  }
  .select {
    width: 360px;
  }
}
</style>

