<template>
  <!-- 字典 -->
  <div class="Dictionaries-wrap">
    <my-query-title></my-query-title>
    <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button v-show="type===1" type="default" @click="type=0" class="mg-l10">返回上一级</el-button>
      </template>
    </my-table-title>
    <my-table v-if="type === 0" ref="table" :data="loadData" :columns="columns" rowKey='id'>
      <el-table-column slot="customHandleColumn" label="用户操作" align="center">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
          <el-button type="text" size="small" :loading='row.deleteLoading' @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <span slot="dictKey" slot-scope="{text,row}">
        <el-button type="text" @click="checkDetail(row)">{{text}}</el-button>
      </span>
    </my-table>
    <div v-else>
      <my-table ref="table" :data="loadData" :columns="columns" rowKey='id'>
        <el-table-column slot="customHandleColumn" label="用户操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleEditValue(row)">修改</el-button>
              <el-button type="text" size="small" @click="handleDeleteValue(row)" :loading='row.deleteLoading'>删除</el-button>
          </template>
        </el-table-column>
        <span slot="dictKey" slot-scope="{text}">
          {{text}}
        </span>
      </my-table>
    </div>
    <edit ref="edit" />
    <editValue ref="editValue" />
  </div>
</template>

<script>
const columns = [
  {
    label: '字典名称',
    prop: 'dictValue',
  },
  {
    label: '字典编码',
    prop: 'dictKey',
    slotName: 'dictKey'
  },
  {
    label: '排序',
    prop: 'dictSort',
  },
  {
    label: '备注',
    prop: 'remark',
  },
  {
    label: '创建时间',
    prop: 'createTime',
  }
]
import { sysDictTypeList, sysDictTypeDelete } from '@/api/System/DictionType'
import {sysDictDataByTypeId, sysDictDataDelete} from '@/api/System/Dictionaries'
import edit from './components/dictionariesEdit.vue'
import { cookDelete } from '@/utils'
import editValue from './components/dictionariesEditValue.vue'

export default {
  name: "Dictionaries",
  components: { edit, editValue },
  data() {
    return {
      columns,
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '字典名称',
            prop: 'dictValue'
          },
          {
            type: 'input',
            label: '字典编码',
            prop: 'dictKey'
          },
          {
            type: 'daterange',
            label: '创建时间',
            prop: 'date'
          },
        ]
      },
      loadData: (p) => {
        let params = Object.assign({ pagination: p }, this.queryObj)
        if (params['date']) {
          params['createTimeStart'] = params['date'][0] + ' 00:00:00'
          params['createTimeEnd'] = params['date'][1] + ' 23:59:59'
        }
        delete params.date
        this.type === 1 && (params['dictTypeId'] = this.dictTypeId)
        let handler = this.type === 0 ? sysDictTypeList : sysDictDataByTypeId
        return handler(params)
      },
      dictKey: '',//存储查询的dictKey
      dictTypeId:'', //存储查询详情的dictTypeId
      queryObj: {
        date: '',
        dictKey: '',
        dictValue: ''
      },
      type: 0 //0 类型 1值
    }
  },
  methods: {
    add() {
      if(this.type === 0){
          this.$refs.edit && this.$refs.edit.init()
      }else{
          this.$refs.editValue && this.$refs.editValue.init()
      }
    },
    handleEdit(r) {
      this.$refs.edit && this.$refs.edit.init(r)
    },
    handleEditValue(r) {
      this.$refs.editValue && this.$refs.editValue.init(r)
    },
    checkDetail(r) {
      this.dictKey = r.dictKey
      this.dictTypeId = r.id
      this.type = 1
    },
    handleDelete(r) {
      cookDelete({
        content: '确认删除？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          sysDictTypeDelete(r.id)
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
    handleDeleteValue(r) {
      cookDelete({
        content: '确认删除？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          sysDictDataDelete(r.id)
            .then(() => {
              this.$message.success('删除成功');
              this.MiXin_searchTable()
            })
            .finally(() => {
              this.$set(r, 'deleteLoading', false);
            });
        },
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
