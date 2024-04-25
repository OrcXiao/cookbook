<template>
  <!-- 预览 -->
  <my-dialog title="已点菜品预览" v-model="show">
    <div>
      <my-table :tableData='tableData' :columns='columns'>
        <span slot="type" slot-scope="{row}">
            {{ MiXin_findDictValue($parent.foodTypeDic, row.type) }}
        </span>
      </my-table>
    </div>
    <span slot="footer">
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" type="primary" :loading='loading'>提交点餐</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
const columns = [
  {
    label: '菜品名称',
    prop: 'name',
  },
  {
    label: '菜品分类',
    prop: 'type',
    slotName: 'type'
  }
]
import {onlineOrderOrder} from '@/api/OnlineOrder'

export default {
  data() {
    return {
      show: false,
      columns,
      tableData: [],
      loading: false
    };
  },
  methods: {
    submit() {
      const vm = this
      let ids = vm.tableData.map(item => {
        return {
          id: item.id,
          remark: item.remark
        }
      })
      vm.loading = true
      onlineOrderOrder(ids).then(() => {
        vm.$message.success('点餐成功')
        vm.show = false
        vm.$parent.searchData()
      }).finally(() => {
        vm.loading = false
      })
    },
    init(r) {
      this.show = true;
      this.tableData = r
    },
  },
};
</script>
