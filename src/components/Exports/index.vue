<template>
  <div>
    <el-button
      style="margin-bottom:15px"
      type="primary"
      icon="document"
      @click="handleDownload"
    >导出Excel</el-button>
  </div>
</template>
<script>
var index = 0;
export default {
  props: {
    filename: {
      type: String,
      default: "导出表"
    },
    autoWidth: {
      type: Boolean,
      default: true
    },
    bookType: {
      type: String,
      default: "xlsx"
    },
    tabHead: {
      type: Array
    },
    tabData: {
      type: Array
    }
  },
  methods: {
    handleDownload() {
      this.$confirm("请确定是否要导出数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [];
            const content = [];
            var data;
            const list = this.$props.tabData;
            if (!list.length > 0) {
              this.$message.warning("您没有选择要导出的数据");
              return false;
            }
            for (let j in list) {
              var arr = [];
              for (let i in this.$props.tabHead) {
                data = this.formatJson(
                  list[j],
                  this.$props.tabHead[i].prop,
                  this.$props.tabHead[i].hasChange,
                  this.$props.tabHead[i].content
                );
                arr.push(data);
              }
              content.push(arr);
            }
            for (let i in this.$props.tabHead) {
              tHeader.push(this.$props.tabHead[i].label);
            }
            excel.export_json_to_excel({
              header: tHeader,
              data: content,
              filename: this.$props.filename,
              autoWidth: this.$props.autoWidth,
              bookType: this.$props.bookType
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出"
          });
        });
    },
    formatJson(row, prop, hasChange, content) {
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

