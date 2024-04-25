<template>
  <div class="Recipe-wrap">
    <my-query-title></my-query-title>
    <my-query :formConfig="formConfig" :formModel="formModel" @searchData="$refs.table.loadData(true)"></my-query>
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="handleRecipeFor">
          食谱制定
        </el-button>
      </template>
    </my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns">
      <span slot="status" slot-scope="scope">
        {{ scope.row.status === 'published' ? '已发布' : '待发布' }}
      </span>
      <span slot="dataAuth" slot-scope="{text}">
        {{ MiXin_findDictValue(dictionary.authOptions, text) }}
      </span>
      <el-table-column slot="customHandleColumn" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleCheck(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.status !== 'published'" type="text" size="small" @click="handleRelease(scope.row)">
            发布食谱
          </el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </my-table>

    <!--    食谱制定-->
    <AddRecipe v-if="isShowAddRecipe" ref="AddRecipe"></AddRecipe>

    <!--    发布食谱-->
    <ReleaseRecipe ref="ReleaseRecipe"></ReleaseRecipe>

    <!--    查看食谱-->
    <CheckRecipe ref="CheckRecipe"></CheckRecipe>

    <!--    修改食谱-->
    <EditRecipe ref="EditRecipe"></EditRecipe>

  </div>
</template>

<script>
import {
  tblRecipesTotalFindList,
  tblRecipesTotalDelById,
} from '../../api/Recipe'

import Moment from "moment";
import renderText from "../../mixins/renderText";
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "Recipe",
  components: {
    AddRecipe: () => import('./components/AddRecipe'),
    ReleaseRecipe: () => import('./components/ReleaseRecipe'),
    EditRecipe: () => import('./components/EditRecipe'),
    CheckRecipe: () => import('./components/CheckRecipe'),
  },
  mixins: [renderText],
  data() {
    return {
      formConfig: {
        forms: [
          {
            type: 'daterange',
            label: '制订日期',
            prop: 'preparationDate',
          },
          {
            type: 'select',
            label: '食谱状态',
            prop: 'status',
            options: [
              {
                dictValue: '待发布',
                dictKey: 'unpublished',
              },
              {
                dictValue: '已发布',
                dictKey: 'published',
              },
            ],
            opLabel: 'dictValue',
            opValue: 'dictKey',
          },
        ]
      },
      formModel: {
        preparationDate: '',
        status: '',
      },
      tableData: [],
      columns: [
        {
          label: '制订日期',
          renderTextFun: (row) => {
            return Moment(row.preparationDateStart).format('YYYY-MM-DD').replace(/-/g, '/')
                + ' ~ ' + Moment(row.preparationDateEnd).format('YYYY-MM-DD').replace(/-/g, '/')
          }
        },
        {
          label: '伙食单位',
          prop: 'dataAuth',
          slotName: 'dataAuth',
        },
        {
          label: '食谱状态',
          prop: 'status',
          slotName: 'status'
        },
        {
          label: '发布人',
          prop: 'updateBy',
          renderTextFun: (row) => {
            return row.updateBy || '--'
          }
        },
        {
          label: '发布日期',
          prop: 'fabuTime',
          renderTextFun: (row) => {
            return row.fabuTime || '--'
          }

        },
      ],

      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.formModel)
        if (params['preparationDate']) {
          params['preparationDateStart'] = params['preparationDate'][0]
          params['preparationDateEnd'] = params['preparationDate'][1]
        }
        delete params.preparationDate
        return tblRecipesTotalFindList(params)
      },

      /*
      * 查看食谱
      * */
      CheckRecipeRow: {},
      /*
      * 发布食谱
      * */
      ReleaseRecipeRow: {},
      /*
      * 食谱修改
      * */
      EditRecipeRow: {},
      dictionary: {
        authOptions: [], //单位
        releaseOptions: [], //发布状态
        foodTypeOptions: [], //食品分类
        mealsOptions: [],// 菜单
        weeksOptions: []
      },
      isShowAddRecipe: false,
    }
  },
  provide() {
    return {
      /** 存放字典 */
      dictMap: this.dictionary
    }
  },
  mounted() {
    Promise.all([getDicTypeValue('dataAuth'), getDicTypeValue('releaseStatus'), getDicTypeValue('foodType'), getDicTypeValue('meals'), getDicTypeValue('weekType')]).then(res => {
      let {0: auth, 1: status, 2: food, 3: meals, 4: weekType} = res

      this.dictionary.authOptions = auth
      let arr = [...food]
      arr.unshift({
        dictValue: '全部',
        dictKey: 'all',
      })
      this.dictionary.foodTypeOptions = arr
      this.dictionary.mealsOptions = meals
      this.dictionary.weeksOptions = weekType
    })
  },
  methods: {
    //点击食谱制定
    //先隐藏再显示,让dom重新渲染
    handleRecipeFor() {
      this.isShowAddRecipe = false
      this.$nextTick(() => {
        this.isShowAddRecipe = true
        setTimeout(() => {
          this.$refs.AddRecipe.getTblFoodFindList()
        }, 100)
      })
    },
    //点击查看
    handleCheck(row) {
      this.CheckRecipeRow = row
      this.$refs.CheckRecipe.getRowData()
    },
    //点击编辑食谱
    handleEdit(row) {
      this.EditRecipeRow = row;
      this.$refs.EditRecipe.getRowData()
    },
    //点击发布食谱
    handleRelease(row) {
      this.ReleaseRecipeRow = row
      this.$refs.ReleaseRecipe.getRowData()
    },
    //点击删除食谱
    handleDelete(row) {
      this.$confirm('确定要删除该食谱吗?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tblRecipesTotalDelById({id: row.id}).then(res => {
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.loadData(true)
          }
        })
      }).catch(() => {
      });
    },
    //点击预览
    clickPreView() {
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
