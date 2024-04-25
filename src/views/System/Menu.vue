<template>
  <div class="Menu-wrap">
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="add"> 新增 </el-button>
      </template>
    </my-table-title>
    <my-table :isAuto='false' ref="table" :showPagination='false' :data="loadData" :expandRowKeys="['1']" :columns="columns" rowKey="id">
      <el-table-column slot="customHandleColumn" label="用户操作">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <span slot='status' slot-scope="{row}">
        <el-switch :disabled='row.statusLoading' @change="statusChange(row)" v-model="row.menuStatus"></el-switch>
      </span>
    </my-table>
    <edit ref="edit" />
  </div>
</template>

<script>
const columns = [
  {
    label: '菜单名称',
    prop: 'menuName',
  },
  {
    label: '菜单类型',
    prop: 'a',
  },
  {
    label: '路由/权限标识',
    prop: 'path',
  },
  {
    label: '菜单排序',
    prop: 'orderNum',
  },
  {
    label: '功能描述',
    prop: 'remark',
  },
  {
    label: '有效状态',
    prop: 'status',
    slotName: 'status'
  },
];
import edit from './components/menuEdit.vue';
import { cookDelete } from '@/utils'
import { sysMenuList, sysMenuDelete, sysMenuChangeStatus } from '@/api/System/Menu'
import { getDicTypeValue } from '@/utils/dicMap'
export default {
  name: 'Menu',
  components: { edit },
  data() {
    return {
      columns,
      loadData: (p) => {
        return sysMenuList(Object.assign({ pagination: p })).then(res => {
          this.flatStatus(res.data)
          return Promise.resolve({
            code: 200,
            data:res.data
          })
        })
      },
      validStatus: [],
      activeStatus: '',
      inActiveStatus: ''
    };
  },
  mounted() {
    getDicTypeValue('validStatus').then(data => {
      this.validStatus = data
      this.$refs.table && this.$refs.table.loadData(true)
      this.activeStatus = data.find(item=>item.dictValue === '有效').dictKey
      this.inActiveStatus = data.find(item=>item.dictValue === '无效').dictKey
    })
  },
  methods: {
    flatStatus(data){
      data.forEach(item=>{
        item.menuStatus = this.validStatus.find(item => item.dictValue === '有效').dictKey == item.status
        item.children.length && (this.flatStatus(item.children))
      })
    },
    statusChange(row) {
      let params = {
        id:row.id,
        status:row.menuStatus ? this.activeStatus : this.inActiveStatus
      }
      this.$set(row,'statusLoading',true)
      sysMenuChangeStatus(params).then(()=>{
        this.$message.success('操作成功')
      }).finally(() =>{
        this.$set(row,'statusLoading',false)
      })
    },
    add() {
      this.$refs.edit && this.$refs.edit.init();
    },
    handleEdit(r) {
      this.$refs.edit && this.$refs.edit.init(r);
    },
    handleDelete(r) {
      cookDelete({
        content: '确认要删除该菜单吗？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          sysMenuDelete(r.id)
            .then(() => {
              this.$message.success('删除成功');
              this.MiXin_searchTable()
            })
            .finally(() => {
              this.$set(r, 'deleteLoading', false);
            });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
