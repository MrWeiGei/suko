<template>
  <div>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      ref="tree"
      accordion
      highlight-current
      :props="defaultProps"
    ></el-tree>

    <div class="buttons">
      <el-button @click="getCheckedNodes">通过 node 获取</el-button>
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <el-button @click="setCheckedNodes">通过 node 设置</el-button>
      <el-button @click="setCheckedKeys">通过 key 设置</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: "二级 2-1"
        },
        {
          id: 9,
          label: "三级 1-1-1"
        }
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    }
  },

  data() {
    return {
      data: [
        {
          id: 1,
          label: "订单管理",
          children: [
            {
              id: 4,
              label: "民宿订单",
              children: [
                {
                  id: 9,
                  label: "查看"
                },
                {
                  id: 9,
                  label: "审核"
                }
              ]
            },
            {
              id: 5,
              label: "机票订单",
              children: [
                {
                  id: 9,
                  label: "查看"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "交易管理",
          children: [
            {
              id: 5,
              label: "订单退款",
              children: [
                {
                  id: 7,
                  label: "民宿退款",
                  children: [
                    {
                      id: 10,
                      label: "审核"
                    },
                    {
                      id: 10,
                      label: "删除"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  }
};
</script>