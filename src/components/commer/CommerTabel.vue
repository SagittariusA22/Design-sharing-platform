<template>
  <div class="common-table">
    <el-table
      class="table"
      :data="comData"
      highlight-current-row
      header-cell-class-name="table_header"
      align="center"
      @sort-change="sortChange"
    >
      <slot name="top"></slot>
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
        align="center"
        :sortable="item.sortable"
      >
      </el-table-column>
      <slot></slot>
    </el-table>
    <!-- 分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="jumper, prev, pager, next, sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "CommerTabel",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  props: {
    tableData: Array,
    tableLabel: Array,
    total: Number,
  },
  methods: {
    // 指定排序的比较函数
    compare(property, type) {
      return function (obj1, obj2) {
        // 去除 - 比较大小
        var value1 = obj1[property].replace(/-/g, "");
        var value2 = obj2[property].replace(/-/g, "");
        if (type === "descending") {
          return value2 - value1; // 降序
        } else if (type === "ascending") {
          return value1 - value2; // 升序
        }
      };
    },
    // 排序方法
    sortChange(column) {
      // 排序后返回第一页
      this.currentPage = 1;
      this.tableData.sort(this.compare("date", column.order));
    },
    // 一页显示数量
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    // 修改显示页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  computed: {
    comData() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.pageSize * this.currentPage
      );
    },
  },
};
</script>

<style lang="less" scoped>
.common-table {
  z-index: 2;
  margin-bottom: 150px;
.el-pagination {
  position: fixed;
  padding: 15px 0;
  bottom: 60px;
  width: 100%;
  background-color: rgb(255, 255, 255);
  z-index: 3;
}
/deep/.table_header {
  background-color: #EFF3FF;
  color: #9DA5FE;
  font-weight: bold;
}
// 隐藏table滚动条
/deep/.el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}
}


</style>