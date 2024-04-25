<template>
  <div class="Content-wrap">
    <my-query-title></my-query-title>
    <my-query  @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
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
          <el-button type="text" size="small" @click="handleCheck(row)">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
          <el-button type="text" size="small" :loading='row.deleteLoading' @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <span slot="name" slot-scope="{row}">
        <el-button type="text" @click="handleCheck(row)">{{row.name}}</el-button>
      </span>
      <span slot="type" slot-scope="{text}">
        {{MiXin_findDictValue(contentDic,text)}}
      </span>
    </my-table>
    <edit ref="edit" />
    <detail ref="detail" />
  </div>
</template>

<script>
const columns = [
  {
    label: '标题名称',
    prop: 'name',
    slotName:'name'
  },
  {
    label: '信息分类',
    prop: 'type',
    slotName:'type'
  },
  {
    label: '创建人',
    prop: 'createBy',
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '备注',
    prop: 'remark',
  }
]
import { contentList, contentDelete } from '@/api/Content'
import edit from './components/contentEdit.vue'
import detail from './components/contentView.vue'
import { getDicTypeValue } from '@/utils/dicMap'
import { cookDelete } from '@/utils'

export default {
  name: "Content",
  components:{edit, detail},
  data() {
    return {
      columns,
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '标题名称',
            prop: 'name',
          },
          {
            type: 'select',
            label: '信息分类',
            prop: 'type',
            options: [],
          },
          {
            type:'daterange',
            label:'创建时间',
            prop:'date'
          }
        ]
      },
      loadData:(p)=>{
        let params = Object.assign({pagination:p},this.queryObj||{})
        if(params['date']){
          params['createTimeStart'] = params['date'][0] + ' 00:00:00'
          params['createTimeEnd'] = params['date'][1] + ' 23:59:59'
        }
        delete params.date
        return contentList(params)
      },
      queryObj: {
        date: '',
        type: '',
        name:''
      },
      contentDic:[]
    }
  },
  mounted(){
    getDicTypeValue('contentType').then(data=>{
      this.contentDic = data
      this.formConfig.forms.find(item=>item.prop === 'type').options = data.map(item=>{
        return {
          label:item.dictValue,
          value:item.dictKey
        }
      })
    })
  },
  methods:{
    handleCheck(r){
      this.$refs.detail && this.$refs.detail.init(r)
    },
    handleDelete(r){
      cookDelete({
        content: '确认要删除该条记录吗？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          contentDelete(r.id)
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
    handleEdit(r){
      this.$refs.edit && this.$refs.edit.init(r)
    },
    add(){
      this.$refs.edit && this.$refs.edit.init()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
