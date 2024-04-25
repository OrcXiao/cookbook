<template>
  <!-- 交伙管理 -->
  <div class="PartnerFood-wrap">
    <my-query-title></my-query-title>
    <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="add">
          新增交伙
        </el-button>
      </template>
    </my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns" rowKey='id'>
      <el-table-column slot="customHandleColumn" label="用户操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleCheck(row)">查看</el-button>
          <el-button v-if="MiXin_findDictValue(releaseDic,'已发布','dictKey','dictValue') !== row.status" type="text"
                     size="small" @click="handleEdit(row)">修改
          </el-button>
          <el-button v-if="MiXin_findDictValue(releaseDic,'已发布','dictKey','dictValue') !== row.status" type="text"
                     size="small" @click="handleRelease(row)">发布
          </el-button>
          <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <span slot="dataAuth" slot-scope="{text}">
         {{ MiXin_findDictValue(authDic, text) }}
      </span>
      <span slot="status" slot-scope="{text}">
         {{ MiXin_findDictValue(releaseDic, text) }}

      </span>
    </my-table>
    <edit ref="edit"/>
    <publish ref="publish"/>
  </div>
</template>

<script>
const columns = [
  {
    label: '伙食单位',
    prop: 'dataAuth',
    slotName: 'dataAuth'
  },
  {
    label: '账目年月',
    prop: 'date',
  },
  {
    label: '交伙次数',
    prop: 'num',
  },
  {
    label: '金额',
    prop: 'sum',
  },
  {
    label: '当前状态',
    prop: 'status',
    slotName: 'status'
  },
]
import {tblBoardExpensesList, tblBoardExpensesDelete} from '@/api/BoardWages'
import publish from './components/partnerFoodPublish.vue'
import edit from './components/partnerfoodEdit.vue'
import {cookDelete} from '@/utils'
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "PartnerFood",
  components: {publish, edit},
  data() {
    return {
      columns: Object.assign([], columns),
      formConfig: {
        forms: [
          {
            type: 'month',
            label: '账目年月',
            prop: 'date',
          },
          {
            type: 'select',
            label: '当前状态',
            prop: 'status',
            options: [],
          },
        ]
      },
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.queryObj)
        return tblBoardExpensesList(params)
      },
      queryObj: {
        date: '',
        status: '',
      },
      releaseDic: [],//发布状态
      authDic: []
    }
  },
  mounted() {
    Promise.all([getDicTypeValue('releaseStatus'), getDicTypeValue('dataAuth')]).then(res => {
      let {0: release, 1: dataAuth} = res
      this.formConfig.forms.find(item => item.prop === 'status').options = release.map(item => {
        return {
          label: item.dictValue,
          value: item.dictKey
        }
      })
      this.releaseDic = release
      this.authDic = dataAuth
    })
  },
  methods: {
    // 新增伙食账目
    add() {
      this.$refs.edit && this.$refs.edit.init()
    },
    // 查看
    handleCheck(row) {
      let url = `/Rendezvous?id=${row.id}`
      let routeUrl = this.$router.resolve({
        path: url,
      })
      window.open(routeUrl.href, '_blank')

    },
    // 修改
    handleEdit(r) {
      this.$refs.edit && this.$refs.edit.init(r)
    },
    // 删除
    handleDelete(r) {
      cookDelete({
        content: '确认要删除该交伙吗？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          tblBoardExpensesDelete(r.id)
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
    // 公布
    handleRelease(r) {
      this.$refs.publish && this.$refs.publish.init(r)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
