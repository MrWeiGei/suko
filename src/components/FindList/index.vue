<template>
  <div>
    <el-col style="margin-top:10px;">
      <el-form ref="dataObj" :model="dataObj" label-width="100px">
        <!-- 第一栏 -->
        <el-row>
          <el-col
            :offset="1"
            :span="i.type=='button'?3:5"
            v-for="i in data.oneData"
            :key="i.$index"
          >
            <el-form-item :label="i.label+':'" v-if="i.type=='input'">
              <el-input v-model="dataObj[i.from]" class="input" clearable></el-input>
            </el-form-item>

            <el-form-item :label="i.label+':'" v-else-if="i.type=='select'">
              <el-select v-model="dataObj[i.from]" placeholder="请选择" clearable>
                <el-option
                  v-for="item in i.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-else-if="i.type=='button'">
              <el-button type="danger" class="find" @click="search">搜索</el-button>
            </el-form-item>

            <el-form-item :label="i.label+':'" v-else>
              <el-date-picker
                v-model="dataObj[i.from]"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                class="date"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二栏 -->
        <el-row>
          <el-col
            :offset="1"
            :span="i.type=='button'?3:5"
            v-for="i in data.twoData"
            :key="i.$index"
          >
            <el-form-item :label="i.label+':'" v-if="i.type=='input'">
              <el-input v-model="dataObj[i.from]" class="input" clearable></el-input>
            </el-form-item>

            <el-form-item :label="i.label+':'" v-else-if="i.type=='select'">
              <el-select v-model="dataObj[i.from]" placeholder="请选择" clearable>
                <el-option
                  v-for="item in i.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-else-if="i.type=='button'">
              <el-button type="danger" class="find" @click="search">搜索</el-button>
            </el-form-item>

            <el-form-item :label="i.label+':'" v-else>
              <el-date-picker
                v-model="dataObj[i.from]"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                class="date"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: ""
    }
  },
  data() {
    return {
      dataObj: {}
    };
  },
  methods: {
    search() {
      this.$emit("find", this.dataObj);
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  width: 200px;
}

.find {
  width: 90px;
}

.date {
  width: 250px;
}
</style>
