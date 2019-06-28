<template>
  <div class="content">
    <el-table
      v-loading="load"
      :data="tableData"
      border
      fit
      :highlight-current-row="light"
      :row-key="haschildren?'id':''"
      :lazy="haschildren?true:false"
      :load="loads"
      :indent="indent"
      @selection-change="select"
      style="width: 100%;"
      @row-click="rowClick"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55" v-if="colType=='selection'"></el-table-column>
      <el-table-column type="index" width="55" label="编号" v-if="colType=='index'"></el-table-column>
      <el-table-column
        v-for="(item,index) in tableHead"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :key="index"
      >
        <template slot-scope="scope">{{changeName(scope.row,item.prop,item.hasChange,item.content)}}</template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150" class="make">
        <template slot-scope="scope">
          <el-button
            v-for="i in makeData"
            :key="i.$index"
            type="text"
            size="small"
            @click="make(i.type,scope.row)"
          >{{ i.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="10"
        :page-sizes="[10,20, 50, 100, 300,500]"
        layout="sizes, prev, pager, next, jumper, ->, total"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-row>
  </div>
</template>

<script>
let index = 0;
export default {
  props: {
    load: { type: Boolean },
    tableHead: {
      type: Array
    },
    tableData: {
      type: Array
    },
    makeData: {
      type: Array,
      default: [
        {
          type: "edit",
          name: "编辑"
        },
        {
          type: "del",
          name: "删除"
        }
      ]
    },
    pageSize: {
      type: Number,
      default: 8
    },
    total: {
      type: Number,
      default: 1000
    },
    haschildren: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: true
    },
    colType: {
      type: String,
      default: "index"
    }
  },

  data() {
    return {
      currentPage: 1,
      indent: 24
    };
  },
  methods: {
    make(where, row) {
      this.$emit(where, row);
    },
    handleCurrentChange(val) {
      this.$emit("change", { pageSize: this.$props.pageSize, pageNum: val });
    },
    handleSizeChange(val) {
      this.$emit("sizeChange", { pageSize: val, pageNum: this.currentPage });
    },
    rowClick(row, column, cell, event) {
      if (!column.label) {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
      this.$emit("rowClick", row);
    },
    loads(tree, treeNode, resolve) {
      this.$emit("load", { tree, treeNode, resolve });
    },
    select(sel) {
      this.$emit("select", sel);
    },
    changeName(row, prop, hasChange, content) {
      if (hasChange == undefined) {
        return row[prop];
      }
      var name;
      if (hasChange) {
        for (var i = 0; i < content.length; i++) {
          if (row[prop] == content[i].dictValue) {
            name = content[i].dictLabel;
            break;
          } else {
            name = row[prop];
          }
        }
      }
      return name;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;

  .pagination {
    padding: 20px 0 20px 0;
    text-align: center;
  }
}
</style>


