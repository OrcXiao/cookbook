<template>
  <div class="inventory-wrap">
    <my-query-title></my-query-title>
    <my-query
        @searchData="$refs.table.loadData(true)"
        :formConfig="formConfig"
        :formModel="formModel"></my-query>
    <my-table-title></my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns">
      <span slot="dataAuth" slot-scope="{text}">
        {{ MiXin_findDictValue(authOptions, text) }}
      </span>
      <el-table-column slot="customHandleColumn" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleCheck(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </my-table>
  </div>
</template>

<script>
import {tblStockFindDate} from '../../api/Inventory'
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "inventory",
  data() {
    return {
      formConfig: {
        forms: [
          {
            type: 'date',
            label: '出入库日期',
            prop: 'date',
          },
        ]
      },
      formModel: {
        date: '',
      },
      columns: [
        {
          label: '伙食单位',
          prop: 'dataAuth',
          slotName: 'dataAuth'
        },
        {
          label: '出入库日期',
          prop: 'date',
        },
      ],
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.formModel)
        if (params['date']) {
          params['createTimeStart'] = params['date'] + ' 00:00:00'
          params['createTimeEnd'] = params['date'] + ' 23:59:59'
        }
        delete params.date
        return tblStockFindDate(params)
      },
      authOptions: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      getDicTypeValue('dataAuth').then(res => {
        this.authOptions = res
      })
    })
  },
  methods: {
    handleCheck(row) {
      if (!row.date) return
      let routeLink = this.$router.resolve({
        path: '/NonStapleFoodPreview',
        query: {
          date: row.date,
        }
      })
      window.open(routeLink.href, '_blank')
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
