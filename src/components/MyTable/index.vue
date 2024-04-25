<template>
  <div class="index-wrap">
    <!-- 表格区域 -->
    <div :class="{'height180': isFixedHeight}">
      <el-table
          :header-cell-style="{background:'#f5f7fa','text-align':'center'}"
          @expand-change='expandChange'
          v-loading='tableLoading'
          :data='list'
          :border='showB'
          :show-header="showH"
          :row-key='rowKey'
          :row-style="rowStyleObj"
          @select="tableSelect"
          @select-all='tableSelectAll'
          @selection-change='tableSelectionChange'
          @row-click='tableRowClick'
          :default-expand-all='tableExpandAll'
          :expand-row-keys="tableExpandKeys">
        <el-table-column
            v-if="showIndex"
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            v-if="showSelection"
            type="selection"
            :width="showSelection && showSelection.width"
            :align="showSelection.align || 'center'">
        </el-table-column>
        <el-table-column
            v-for="(item, index) in tableColumns"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align || 'center'"
            :min-width="item.minWidth"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :fixed="!!item.fixed">
          <template slot-scope="{row,$index}">
            <!--          渲染自定义组件-->
            <slot
                v-if="item.slotName"
                :name="item.slotName"
                :text="row[item.prop]"
                :row='row'
                :index='$index'>
            </slot>
            <!--          渲染自定义文本-->
            <span
                v-else-if="item.renderTextFun">
                {{ item.renderTextFun(row, $index, item.prop) }}
            </span>
            <!--          默认显示-->
            <span v-else>
            {{ row[item.prop] }}
          </span>
          </template>
        </el-table-column>
        <!--      用户自定义操作列-->
        <slot name="customHandleColumn"></slot>
      </el-table>
    </div>
    <!-- 合计-->
    <slot name="appendTotal"></slot>
    <!-- 分页器 -->
    <div :class="{'pagination-right': isPaginationRight}">
      <el-pagination
          v-if="!!showPagination && !tableData"
          :background="showPagination && showPagination.background"
          @current-change='pageChange'
          @size-change='pageSizeChange'
          :total='tablePagination.total'
          :current-page.sync="tablePagination.pageNum"
          :page-size="tablePagination.pageSize"
          :layout="showPagination && showPagination.layout">
      </el-pagination>

    </div>
  </div>
</template>

<script>
export default {
  name: "MyTable",
  props: {
    /** (return<Promise>) */
    data: Function,
    /** 页码 */
    pageNum: {
      type: Number,
      default: 1
    },
    /** 在没传入data 时可使用静态表格 */
    tableData: Array,
    /** 每页条数 */
    pageSize: {
      type: Number,
      default: 10
    },
    /** 是否展示分页器 */
    showPagination: {
      type: [Boolean, Object],
      default: () => {
        return {
          layout: 'total,sizes,prev,pager,next,jumper',
          background: true
        }
      }
    },
    //分页器展示在右边
    isPaginationRight: {
      type: Boolean,
      default: false
    },
    //是否固定表格高度
    isFixedHeight: {
      type: Boolean,
      default: false
    },
    /** 是否展示序号 */
    showIndex: {
      type: Boolean,
      default: false
    },
    /** 是否展示左侧选择 */
    showSelection: {
      type: [Boolean, Object],
      default: false
    },
    /** columns <Object>
     * {
     *    prop:'',
     *    width:'',
     *    label:'',
     *    slotName:'插槽名称' //如不传或为空则展示所取值
     *    fixed,
     *    renderTextFun
     *    min-width,
     * }
     *
     */
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    /** 是否展示表格 */
    showHeader: {
      type: Boolean,
      default: true
    },
    /** 边框 */
    border: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    /** 当数据包含children时是否展开所有行 */
    tableExpandAll: {
      type: Boolean,
      default: false
    },
    /** 设置展开行数据 <rowKey> */
    expandRowKeys: {
      type: Array,
      default: () => []
    },
    //行样式
    rowStyleObj: {
      type: Object,
      default: () => {
      }
    },
    /** 是否初始化加载数据 */
    isAuto: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    showH() {
      return this.showHeader
    },
    showB() {
      return this.border
    },
    showPage() {
      return this.showPagination
    },
    tableColumns() {
      return this.columns
    }
  },
  data() {
    return {
      list: [], //表格数据
      tablePagination: Object.assign({pageNum: 1, pageSize: 10, total: 0}, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }),
      tableLoading: false,
      tableExpandKeys: this.expandRowKeys || []
    }
  },
  watch: {
    tableData(val) {
      const vm = this
      if (!vm.data) {
        vm.list = val
        vm.showPagination && Object.assign(vm.tablePagination, {
          pageNum: 1,
          total: val.length
        })
      }
    }
  },
  mounted() {
    const vm = this
    if (vm.data) {
      vm.isAuto && vm.loadData(true)
    } else {
      vm.list = vm.tableData
      vm.showPagination && Object.assign(vm.tablePagination, {
        pageNum: 1,
        total: vm.tableData.length
      })
    }
  },
  methods: {
    /** 表格展开 */
    expandChange(expandedRows, expanded) {
      this.$emit('expand-change', expandedRows, expanded)
    },
    /** 表格加载 */
    loadData(bool = false) {
      const vm = this
      bool && (vm.tablePagination = Object.assign(vm.tablePagination, {pageNum: 1}))
      const {pageNum, pageSize} = vm.tablePagination
      let pageParams = vm.showPagination ? {pageNum, pageSize} : {}
      const res = vm.data(pageParams)
      if (
          (typeof res === "object" || typeof res === "function") &&
          typeof res.then === "function"
      ) {
        vm.tableLoading = true
        /** {
         *  code:0
         *  data:{
         *    list:[], //表格数据
         *    total:0 //总条数
         * }
         * } */
        res.then(res => {
          /** 获取的数据 */
          if (+res.code === 200) {
            let {pagination, data} = res || {}
            if (vm.showPagination && data && data.length <= 0 && +pageNum !== 1) { //如加载数据页码不为1 并且请求数据为空 跳回第一页处理
              vm.loadData(true) //强制刷新
            } else {
              vm.list = data
              vm.showPagination && Object.assign(vm.tablePagination, {total: pagination.total})
            }
            this.$emit('postTableData', res)
          } else {
            vm.list.splice(0)
          }
        }).catch(() => {
          vm.list.splice(0)
        }).finally(() => {
          vm.tableLoading = false
        })
      } else {
        throw new Error("props data must return Promise");
      }
    },
    /** 某行选中 */
    tableSelect(selection, row) {
      this.$emit('select', selection, row);
    },
    /** 全选 */
    tableSelectAll(selection) {
      this.$emit('select-all', selection)
    },

    /** 某行点击 */
    tableRowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
    /** 选中行改变 */
    tableSelectionChange(selection) {
      this.$emit('tableSelectionChange', selection)
    },
    /** 每页条数改变 */
    pageSizeChange(event) {
      this.tablePagination = Object.assign(this.tablePagination, {pageSize: event})
      this.loadData(true)
    },
    /** 页码改变 */
    pageChange(event) {
      this.tablePagination = Object.assign(this.tablePagination, {pageNum: event})
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-right {
  display: flex;
  justify-content: flex-end;
}

.height180 {
  min-height: 180px;
}
</style>
