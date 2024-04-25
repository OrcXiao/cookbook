<template>
  <!-- 问卷管理 -->
  <div class="Questionnaire-wrap">
    <div v-show="!isEdit && !showList">
      <my-query-title></my-query-title>
      <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
      <my-table-title titleTextType="查询列表">
        <template slot="btns">
          <el-button type="primary" @click="add">
            新增
          </el-button>
        </template>
      </my-table-title>
      <my-table ref="table" :data="loadData" :columns="columns" rowKey='id'>
        <el-table-column slot="customHandleColumn" label="用户操作">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCheck(row)">数据</el-button>
            <el-button v-if="MiXin_findDictValue(releaseDic,'已发布','dictKey','dictValue') !== row.status" type="text"
                       size="small" @click="handleEdit(row)">修改
            </el-button>
            <el-button v-if="MiXin_findDictValue(releaseDic,'未发布','dictKey','dictValue') === row.status" type="text"
                       size="small" @click="handleRelease(row,'1','未发布')">发布
            </el-button>
            <el-button v-if="MiXin_findDictValue(releaseDic,row.status) !== '未发布'" type="text" size="small"
                       @click="handleRelease(row,MiXin_findDictValue(releaseDic,row.status)==='已关闭' ? '1' : '2',MiXin_findDictValue(releaseDic,row.status)==='已关闭' ? '已关闭' : '已开启')">
              {{ MiXin_findDictValue(releaseDic, row.status) === '已关闭' ? '开启' : '关闭' }}
            </el-button>
            <el-button type="text" size="small" :loading='row.deleteLoading' @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <span slot="dataAuth" slot-scope="{text}">
          {{ text ? text.split(',').map(item => MiXin_findDictValue(authDic, item)).join(',') : '' }}
        </span>
        <span slot="status" slot-scope="{text}">
          {{ MiXin_findDictValue(releaseDic, text) }}
        </span>
      </my-table>
    </div>
    <edit ref="edit" v-if="isEdit"/>
    <list ref="list" v-if="showList"/>
    <my-dialog width='700px' :title="publishName === '未发布' ?  '发布确认' : publishName === '已开启' ? '关闭确认' : '开启确认'"
               v-model="showPublish">
      <div class="dis-fl ju-ct ft-b">
        确认要{{ publishName === '未发布' ? '发布' : publishName === '已开启' ? '关闭' : '开启' }}该问卷吗？
      </div>
      <span slot="footer">
        <div class="dis-fl ju-ct pd-t20">
          <el-button @click="doPublish" type="primary"
                     :loading='publishLoading'>{{
              publishName === '未发布' ? '确认发布' : publishName === '已开启' ? '确认关闭' : '确认开启'
            }}</el-button>
          <el-button @click="showPublish = false">再想想</el-button>
        </div>
      </span>
    </my-dialog>
  </div>
</template>

<script>
const columns = [
  {
    label: '问卷名称',
    prop: 'name',
  },
  {
    label: '所属单位',
    prop: 'dataAuth',
    slotName: 'dataAuth'
  },
  {
    label: '发布状态',
    prop: 'status',
    slotName: 'status'
  },
  {
    label: '创建日期',
    prop: 'createTime',
  }
]
import edit from './components/questionaierEdit.vue'
import list from './components/questionaierList.vue'
import {
  questionaireList,
  questionaireDelete,
  questionaireStatusChange
} from '@/api/Questionnaire'
import {getDicTypeValue} from '@/utils/dicMap'
import {cookDelete} from '@/utils';

export default {
  name: "Questionnaire",
  components: {edit, list},
  data() {
    return {
      columns,
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '问卷名称',
            prop: 'name'
          },
          {
            type: 'daterange',
            label: '创建日期',
            prop: 'date',
          },
          {
            type: 'select',
            label: '发布状态',
            prop: 'status',
            options: [],
          },
        ]
      },
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.queryObj)
        if (params['date']) {
          params['createTimeStart'] = params['date'][0] + ' 00:00:00'
          params['createTimeEnd'] = params['date'][1] + ' 23:59:59'
        }
        delete params.date
        return questionaireList(params)
      },
      queryObj: {
        date: '',
        status: '',
        name: ''
      },
      isEdit: false,
      showList: false,
      showPublish: false,
      authDic: [],
      typeDic: [],
      whetherDic: [],
      releaseDic: [],
      id: '', //点击发布的id
      publishLoading: false,
      publishName: '',
      publishStaus: ''
    }
  },
  mounted() {
    Promise.all([getDicTypeValue('questionnaireStatus'), getDicTypeValue('dataAuth'), getDicTypeValue('questionnaireType'), getDicTypeValue('whether')]).then(res => {
      let {0: status, 1: auth, 2: type, 3: whether} = res
      this.formConfig.forms.find(item => item.prop === 'status').options = status.map(item => {
        return {
          label: item.dictValue,
          value: item.dictKey
        }
      })
      this.releaseDic = status
      this.authDic = auth
      this.typeDic = type
      this.whetherDic = whether
    })
  },
  methods: {
    // 新增伙食账目
    add() {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.edit && this.$refs.edit.init()
      })
    },
    // 查看
    handleCheck(r) {
      this.showList = true
      this.$nextTick(() => {
        this.$refs.list && this.$refs.list.init(r)
      })
    },
    // 修改
    handleEdit(r) {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.edit && this.$refs.edit.init(r)
      })
    },
    // 删除
    handleDelete(r) {
      cookDelete({
        content: '确认要删除该问卷吗？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          questionaireDelete(r.id)
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
    handleRelease(r, status, publishName) {
      this.showPublish = true
      this.id = r.id
      this.publishName = publishName
      this.publishStaus = +status === 1 ? '已发布' : '已关闭'
    },
    // 发布
    doPublish() {
      const vm = this
      const dictKey = vm.MiXin_findDictValue(vm.releaseDic, vm.publishStaus, 'dictKey', 'dictValue')
      vm.publishLoading = true
      questionaireStatusChange({status: dictKey, id: vm.id}).then(() => {
        vm.$message.success('操作成功')
        vm.MiXin_searchTable()
      }).finally(() => {
        vm.showPublish = false
        vm.publishLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
