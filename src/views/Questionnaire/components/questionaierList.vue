<template>
  <!-- 问卷数据 -->
  <div class="Questionnaire-wrap">
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="$parent.showList=false">
          返回
        </el-button>
      </template>
    </my-table-title>
    <my-query :isShowResetBtn="false" :showLabel='false' @searchData='resetData' :formConfig="formConfig"
              :formModel="queryObj">
      <template slot="btns">
        <div class="pd-l60">
          <el-button type="warning" @click="clickExport">
            导出
          </el-button>
        </div>
      </template>
    </my-query>

    <my-table :isAuto='false' ref="table" :data="loadData" :columns="columns" rowKey='id'>
      <span slot="dataAuth" slot-scope="{text}">
        {{ text ? text.split(',').map(item => MiXin_findDictValue($parent.authDic, item)).join(',') : '' }}
      </span>
    </my-table>
  </div>
</template>

<script>
const columns = [
  {
    label: '提交日期',
    prop: 'createTime',
  },
  {
    label: '姓名',
    prop: 'createBy',
  },
  // {
  //   label: '姓名',
  //   prop: 'nickName',
  // },
  {
    label: '数据来源',
    prop: 'dataAuth',
    slotName: 'dataAuth'
  }
]
import {
  questionaireDetail,
  questionaireFindAnswer,
  questionaireList,
  tblQuestionnaireExport
} from '@/api/Questionnaire'
import {fileCommonDown} from '@/utils/file'

export default {
  data() {
    return {
      columns: Object.assign([], columns),
      formConfig: {
        forms: [
          {
            type: 'select',
            label: '选择问卷',
            prop: 'id',
            options: [],
          },
          {
            type: 'input',
            label: '用户名/姓名/手机号',
            prop: 'createBy',
            clearable: true
          },
          {
            type: 'date',
            label: '请选择提交起止日期',
            prop: 'date',
          },
        ]
      },
      list: [],
      queryObj: {
        date: '',
        id: '',
        createBy: ''
      },
      isEdit: false,
      id: '',
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.queryObj)
        if (params['date']) {
          params['createTimeStart'] = params['date'] + ' 00:00:00'
          params['createTimeEnd'] = params['date'] + ' 23:59:59'
        }
        delete params.date
        params['id'] = this.queryObj.id
        return questionaireFindAnswer(params).then(res => {
          let data = res.data.answerDetails
          let mapKey = {}
          let list = []
          data.forEach(item => {
            if (!mapKey[item.createBy]) {
              let obj = {
                createBy: item.createBy,
                createTime: item.createTime,
                dataAuth: item.dataAuth,
                id: item.createById
              }
              obj['question' + item.tblQuestionnaireDetailId] = item.content
              list.push(obj)
              mapKey[item.createBy] = obj
            } else {
              mapKey[item.createBy]['question' + item.tblQuestionnaireDetailId] = item.content
            }
          })
          return Promise.resolve({
            code: 200,
            data: list,
            pagination: {total: list.length}
          })
        })
      },
    }
  },
  methods: {
    init(r) {
      this.queryObj.id = r.id
      this.id = r.id
      this.getList(r.id)
      questionaireList({pagination: {pageSize: 9999, pageNum: 1}}).then(res => {
        this.formConfig.forms.find(item => item.prop === 'id').options = res.data.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      })
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.loadData(true)
      })
    },
    /** 列表 */
    getList() {

      questionaireFindAnswer({id: this.queryObj.id}).then(res => {
        // questionaireDetail(this.queryObj.id).then(res => {
        this.columns = Object.assign([], columns)
        this.columns = this.columns.concat(res.data.details.map((item) => {
          return {
            showOverflowTooltip: true,
            label: item.name,
            prop: 'question' + item.id //加上问题id
          }
        }))
        this.list = res.data.answerDetails || []
      })
    },
    /** 重新查询 */
    resetData() {
      const vm = this
      // vm.queryObj.id = vm.id
      vm.MiXin_searchTable()
      vm.getList()
    },
    //点击导出
    clickExport() {
      fileCommonDown('', '问卷详情.xlsx', tblQuestionnaireExport(this.id)).then(() => {
      }).finally(() => {
        this.downLoading = false
      })

    },
  }
}
</script>

<style lang="scss" scoped>
</style>
