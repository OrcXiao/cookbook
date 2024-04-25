<template>
  <!-- 伙食费账目 -->
  <div class="FoodAccounts-wrap">
    <my-query-title></my-query-title>
    <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="add"> 新增伙食账目</el-button>
      </template>
    </my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns" rowKey="id">
      <el-table-column width="200px" slot="customHandleColumn" label="用户操作">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleCheck(row)">查看</el-button>
          <el-button v-if="MiXin_findDictValue(releaseDic,'已发布','dictKey','dictValue') !== row.status" type="text"
                     size="small" @click="handleEdit(row)">修改
          </el-button>
          <el-button v-if="MiXin_findDictValue(releaseDic,'已发布','dictKey','dictValue') !== row.status" type="text"
                     size="small" @click="handleRelease(row)">发布
          </el-button>
          <el-button type="text" size="small" @click="handleDelete(row)" :loading="row.deleteLoading">删除</el-button>
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
    renderTextFun: (row) => row.date.split('/')[0] + '/' + row.date.split('/')[1]
  },
  {
    label: '伙食费收入',
    prop: 'foodIncome',
    renderTextFun: (row) => row.foodIncome ? parseFloat(row.foodIncome).toFixed(2) : 0
  },
  {
    label: '伙食费支出',
    prop: 'foodExpenses',
    renderTextFun: (row) => row.foodExpenses ? parseFloat(row.foodExpenses).toFixed(2) : 0
  },
  {
    label: '粮食收入合计',
    prop: 'foodstuffIncome',
    renderTextFun: (row) => row.foodstuffIncome ? parseFloat(row.foodstuffIncome).toFixed(2) : 0

  },
  {
    label: '粮食支出合计',
    prop: 'foodstuffExpenses',
    renderTextFun: (row) => row.foodstuffExpenses ? parseFloat(row.foodstuffExpenses).toFixed(2) : 0

  },
  {
    label: '本月伙食节余',
    prop: 'foodSur',
    renderTextFun: (row) => row.foodstuffExpenses ? parseFloat(row.foodSur).toFixed(2) : 0
  },
  {
    label: '本月粮食节余',
    prop: 'foodstuffSur',
    renderTextFun: (row) => row.foodstuffExpenses ? parseFloat(row.foodstuffSur).toFixed(2) : 0
  },
  {
    label: '当前状态',
    prop: 'status',
    slotName: 'status'
  },
];
import edit from './components/foodAccountsEdit.vue';
import publish from './components/footAccountsPublish.vue';
import {cookDelete} from '@/utils';
import {tblFoodAccountList, tblFoodAccountDelete} from '@/api/BoardWages';
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: 'FoodAccounts',
  components: {edit, publish},
  data() {
    return {
      columns,
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
        ],
      },
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.queryObj);
        return tblFoodAccountList(params);
      },
      queryObj: {
        date: '',
        status: '',
      },
      releaseDic: [],//发布状态
      authDic: []
    };
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
      this.$refs.edit && this.$refs.edit.init();
    },
    // 查看
    handleCheck(row) {
      let url = `/FoodAccountsPreview?id=${row.id}`
      let routeUrl = this.$router.resolve({
        path: url,
      })
      window.open(routeUrl.href, '_blank')

    },
    // 修改
    handleEdit(r) {
      this.$refs.edit && this.$refs.edit.init(r);
    },
    // 删除
    handleDelete(r) {
      cookDelete({
        content: '确认要删除该伙食账目吗？',
        success: () => {
          this.$set(r, 'deleteLoading', true);
          tblFoodAccountDelete(r.id)
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
      this.$refs.publish && this.$refs.publish.init(r);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
