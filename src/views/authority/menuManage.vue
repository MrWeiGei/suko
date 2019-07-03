<template>
  <div class="contnet">
    <el-row style="overflow: hidden;background: #ffffff;border-radius: 8px;">
      <unified-style title="菜单管理" />
      <el-col style="margin-top:25px;margin-left:38px">
        <el-button type="danger" icon="el-icon-plus" @click="addone">增加</el-button>
      </el-col>
      <el-col style="margin-top:35px;margin-left:38px">
        <my-table
          style="width:90%"
          class="table"
          :table-data="tableData"
          :table-head="tableHead"
          :make-data="makeData"
          :page-size="pageSize"
          :total="total"
          :haschildren="true"
          :light="light"
          :load="loads"
          @sizeChange="sizeChange"
          @change="change"
          @edit="edit"
          @del="del"
          @rowClick="rowClick"
          @load="load"
        />
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog title="信 息" :visible.sync="dialogFormVisible" class="dialog">
      <el-row>
        <el-col :offset="3" :span="18" style="margin-top:30px">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="菜单名称:" label-width="90px" prop="menuName">
              <el-input v-model="form.menuName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="父集:" label-width="90px" v-if="!id" prop="parentId">
              <el-select v-model="form.parentId" placeholder="请选择" class="select">
                <el-option label="主菜单" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="路由地址:" label-width="90px" prop="url">
              <el-input v-model="form.router" autocomplete="off" />
            </el-form-item>
            <el-form-item label="请求地址:" label-width="90px" prop="url">
              <el-input v-model="form.url" autocomplete="off" />
            </el-form-item>
            <el-form-item label="菜单类型:" label-width="90px" prop="menuType">
              <el-select v-model="form.menuType" placeholder="请选择" class="select">
                <el-option
                  v-for="item in menuoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="菜单状态:" label-width="90px" prop="visible">
              <el-select v-model="form.visible" placeholder="请选择" class="select">
                <el-option label="显示" value="1" />
                <el-option label="隐藏" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="菜单图标:" label-width="90px" prop="icon">
              <el-input v-model="form.icon" autocomplete="off" />
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
import { search } from "@/api/dict";
import {
  createOne,
  delOne,
  fetchList,
  editone,
  searchList
} from "@/api/authority/menu";
export default {
  components: {
    UnifiedStyle,
    MyTable
  },
  data() {
    return {
      loads: true,
      button: "提交",
      light: true,
      dictArr: [],
      menuoptions: [
        {
          value: "M",
          label: "目录"
        },
        {
          value: "C",
          label: "菜单"
        },
        {
          value: "F",
          label: "按钮"
        }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogFormVisible: false,
      changeFlag: false,
      form: {
        menuName: "",
        parentId: "0",
        url: "",
        menuType: "菜单",
        visible: "显示",
        icon: "",
        router: ""
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
          label: "菜单名称",
          width: "240",
          prop: "menuName"
        },
        {
          label: "路由地址",
          width: "335",
          prop: "router"
        },
        {
          label: "url",
          width: "335",
          prop: "url"
        },
        {
          label: "菜单类型",
          width: "150",
          prop: "menuType",
          hasChange: true,
          content: ""
        },
        {
          label: "是否可见",
          width: "150",
          prop: "visible",
          hasChange: true,
          content: ""
        },
        {
          label: "图标",
          width: "150",
          prop: "icon"
        }
      ],
      tableData: [],
      index: 0,
      id: false,
      rowFlag: 0,
      rules: {
        menuName: [
          { required: true, message: "请输入菜单名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择父集", trigger: "change" }
        ],
        url: [
          { required: true, message: "请输入请求地址", trigger: "blur" },
          {
            min: 3,
            max: 100,
            message: "长度在 3 到 100 个字符",
            trigger: "blur"
          }
        ],
        menuType: [
          { required: true, message: "请选择菜单类型", trigger: "change" }
        ],
        visible: [
          { required: true, message: "请选择菜单状态", trigger: "change" }
        ]
      }
    };
  },
  async mounted() {
    await this.getDict();
    await this.getList();
  },
  methods: {
    // 打开增加按钮
    addone() {
      this.dialogFormVisible = true;
      this.form = {};
      if (!this.$refs) {
        this.$refs["form"].resetFields();
      }
      this.changeFlag = false;
      this.button = "提交";
    },
    // 表单修改按钮
    edit(e) {
      this.dialogFormVisible = true;
      this.changeFlag = true;
      this.button = "修改";
      this.form.menuName = e.menuName;
      this.form.parentId = e.parentId;
      this.form.url = e.url;
      this.form.icon = e.icon;
      this.form.router = e.router;
      this.form.id = e.id;
    },
    // 表单删除按钮

    del(e) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delOne({ menuId: e.id }).then(res => {
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
    sizeChange(e) {
      this.pageSize = e.pageSize;
      this.pageNum = e.pageNum;
      this.getList();
    },
    // 分页
    change(e) {
      this.pageSize = e.pageSize;
      this.pageNum = e.pageNum;
      this.getList();
    },
    // 添加||修改的方法
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 做修改时的操作
          if (this.changeFlag) {
            editone(this.form).then(e => {
              if (e.code == 0) {
                this.dialogFormVisible = false;
                this.getList();
              } else {
                this.$message({
                  type: "error",
                  message: e.msg
                });
              }
            });
          } else {
            // 自己添加时的操作
            if (this.index == 0) {
              createOne(this.form).then(res => {
                if (res) {
                  this.dialogFormVisible = false;
                  this.getList();
                }
              });
            } else {
              if (this.light) {
                this.form.parentId = this.id;
                createOne(this.form).then(res => {
                  if (res) {
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
            }
          }
        } else {
          return false;
        }
      });
    },
    // 一行点击事件
    rowClick(e) {
      if (this.index == 0) {
        this.index++;
        this.id = e.id;
        this.rowFlag = e.id;
      } else {
        if (this.rowFlag == e.id) {
          this.light = false;
          this.rowFlag = false;
          this.id = false;
        } else {
          this.light = true;
          this.rowFlag = e.id;
          this.id = e.id;
        }
      }
    },
    // 多级点击表单
    load(e) {
      searchList({ pageSize: 100, pageNum: 1, parentId: e.tree.id }).then(
        res => {
          var data = res.res.list;
          for (let i in data) {
            if (data[i].childNum > 0) {
              data[i].hasChildren = true;
            }
          }
          e.resolve(data);
        }
      );
    },
    // 获取所有列表
    async getList() {
      var data = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        parentId: 0
      };
      let res = await searchList(data);
      this.tableData = [];
      var data = res.res.list;
      for (let i in data) {
        if (data[i].childNum > 0) {
          data[i].hasChildren = true;
        }
      }
      this.total = res.res.total;
      this.loads = false;
      this.tableData = data;
    },
    async getDict() {
      var dict = await search("menu_type");
      var Btndict = await search("menu_status");
      this.dictArr = [
        {
          label: "menuType",
          value: dict.res
        },
        {
          label: "visible",
          value: Btndict.res
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
    width: 1150px;
  }
  .select {
    width: 360px;
  }
}
</style>

