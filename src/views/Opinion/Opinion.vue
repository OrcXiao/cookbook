<template>
  <div class="Opinion-wrap">
    <my-query-title></my-query-title>
    <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
    <my-table-title titleTextType="查询列表"></my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns" rowKey="id" :isAuto='false'>
      <el-table-column slot="customHandleColumn" label="用户操作">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleCheck(row)">查看</el-button>
          <el-button type="text" size="small" @click="handleDelete(row)" :loading="row.deleteLoading">删除</el-button>
        </template>
      </el-table-column>
      <span slot="isOpen" slot-scope="{row}">
        <el-switch :disabled='row.statusLoading' @change="changeOpen(row)" v-model="row.isOpen"></el-switch>
      </span>
      <span slot="dataAuth" slot-scope="{text}">
        {{ MiXin_findDictValue(authDic, text) }}
      </span>
      <span slot="status" slot-scope="{text}">
        {{ MiXin_findDictValue(statusDic, text) }}
      </span>
    </my-table>
    <detail ref="detail"/>
  </div>
</template>

<script>
const columns = [
  {
    label: '意见名称',
    prop: 'title',
  },
  {
    label: '意见来源',
    prop: 'dataAuth',
    slotName: 'dataAuth'
  },
  {
    label: '浏览次数',
    prop: 'nums',
  },
  {
    label: '是否公开',
    prop: 'isOpen',
    slotName: 'isOpen',
  },
  {
    label: '回复状态',
    prop: 'status',
    slotName: 'status'
  },
  {
    label: '提交时间',
    prop: 'createTime',
  },
];
import {opinionList, opinionDelete, opinionChangeOpen, opinionAdd} from '@/api/Opinion';
import detail from './components/opinionDetail.vue';
import {cookDelete} from '@/utils';
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: 'Opinion',
  components: {detail},
  data() {
    return {
      columns,
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '意见名称',
            prop: 'title',
          },
          {
            type: 'select',
            label: '回复状态',
            prop: 'status',
            options: [],
          },
          {
            type: 'select',
            label: '是否公开',
            prop: 'open',
            options: [],
          },
        ],
      },
      loadData: (p) => {
        return opinionList(Object.assign({pagination: p}, this.queryObj)).then(res => {
          let data = res.data.map(item => Object.assign({isOpen: this.MiXin_findDictValue(this.whetherDic, item.open, 'dictValue') === '是' ? true : false}, item))
          return Promise.resolve({
            code: res.code,
            data,
            pagination: res.pagination
          })
        })
      },
      queryObj: {
        open: '',
        status: '',
        title: '',
      },
      whetherDic: [],
      authDic: [],
      statusDic: []
    };
  },
  mounted() {
    // opinionAdd({title:'测试',content:'213123'}).then(()=>{

    // })
    Promise.all([getDicTypeValue('replyStatus'), getDicTypeValue('whether'), getDicTypeValue('dataAuth')]).then(res => {
      let {0: reply, 1: whether, 2: dataAuth} = res
      this.formConfig.forms.find(item => item.prop === 'status').options = reply.map(item => {
        return {
          label: item.dictValue,
          value: item.dictKey
        }
      })
      this.formConfig.forms.find(item => item.prop === 'open').options = whether.map(item => {
        return {
          label: item.dictValue,
          value: item.dictKey
        }
      })
      this.statusDic = reply
      this.whetherDic = whether
      this.authDic = dataAuth
      this.$refs.table && this.$refs.table.loadData(true)
    })
  },
  methods: {
    handleCheck(r) {
      this.$refs.detail && this.$refs.detail.init(r);
    },
    changeOpen(r) {
      let open = r.isOpen ? this.MiXin_findDictValue(this.whetherDic, '是', 'dictKey', 'dictValue') : this.MiXin_findDictValue(this.whetherDic, '否', 'dictKey', 'dictValue')
      this.$set(r, 'statusLoading', true)
      opinionChangeOpen({open, id: r.id}).then(() => {
        this.$message.success('操作成功')
      }).finally(() => {
        this.$set(r, 'statusLoading', false)
      })
    },
    handleDelete(r) {
      cookDelete({
        content: '确认要删除该意见吗？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          opinionDelete(r.id)
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
