<template>
  <div class="CheckRecipe-wrap">
    <el-dialog :visible.sync="isShowQueryRecipeDialog" title="查看食谱" width="700px">
      <div>
        <el-form label-width="120px">
          <el-row>
            <el-col :span="8">
              <div>发布人 : {{ QueryRecipeObj.updateBy || '--' }} &nbsp;</div>
            </el-col>
            <el-col :span="11">
              <div>发布日期 : {{ QueryRecipeObj.fabuTime || '--' }}</div>
            </el-col>
            <el-col :span="4">
              <el-button type="success" @click="clickPreview">打印预览</el-button>
            </el-col>
            <el-col :span="24">
              <div class="pd-b20">食谱制订日期 : {{ QueryRecipeObj.preparationDateStart }} ~
                {{ QueryRecipeObj.preparationDateEnd }}
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                数据来源 : {{ MiXin_findDictValue(dictMap.authOptions, QueryRecipeObj.dataAuth) || '' }}
              </div>
              <div class="pd-t30 meal-wrap">
                <el-radio-group @change="getQueryRecipeTableData" v-model="mealsActive">
                  <el-radio-button v-for="(item, index) in dictMap.mealsOptions" :key="index" :label="item.dictKey">
                    {{ item.dictValue }} {{ mealsObj[item.dictKey].length }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
            <el-col :span="18">
              <el-form-item label-width="0">
                <el-radio-group @change="getQueryRecipeTableData" v-model="weeksActive">
                  <el-radio-button v-for="(item, index) in dictMap.weeksOptions" :key="index" :label="item.dictKey">
                    {{ item.dictValue }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label-width="0">
                <el-table :data="QueryRecipeTable" style="width: 100%;" border>
                  <el-table-column label="菜品名称" align="center" prop="name"/>
                  <el-table-column label="菜品分类" align="center">
                    <template slot-scope="scope">
                      {{ renderTypeText(scope.row) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {tblRecipesTotalFindById} from "../../../api/Recipe";
import Moment from "moment";

export default {
  name: "CheckRecipe",
  data() {
    return {
      /*
      * 查看食谱
      * */
      isShowQueryRecipeDialog: false,
      QueryRecipeObj: {},
      QueryRecipeAllData: [],
      QueryRecipeTable: [],
      foodTypeOptions: [],
      weeksOptions: [],
      mealsOptions: [],
      authOptions: [],
      mealsActive: '',
      weeksActive: '',
      mealsObj: {
        breakfast: [],
        lunch: [],
        dinner: []
      },
    }
  },
  /** 接收字典 */
  inject: ['dictMap'],
  watch: {
    'dictMap.mealsOptions': function (o) {
      if (o.length) {
        this.mealsActive = o[0].dictKey
      }
    },
    'dictMap.weeksOptions': function (o) {
      if (o.length) {
        this.weeksActive = o[0].dictKey
      }
    }
  },
  methods: {
    getRowData() {
      tblRecipesTotalFindById({id: this.$parent.CheckRecipeRow.id}).then(res => {
        if (+res.code === 200) {
          this.QueryRecipeObj = res.data
          this.QueryRecipeObj.preparationDateStart = Moment(res.data.preparationDateStart).format('YYYY-MM-DD').replace(/-/g, '/')
          this.QueryRecipeObj.preparationDateEnd = Moment(res.data.preparationDateEnd).format('YYYY-MM-DD').replace(/-/g, '/')
          this.isShowQueryRecipeDialog = true;
          this.QueryRecipeAllData = res.data.recipesDetailDtoList;
          this.getQueryRecipeTableData()
        }
      })
    },
    //获得查看食谱弹框中表格的数据
    getQueryRecipeTableData() {
      let arr = []
      this.QueryRecipeAllData.forEach(item => {
        if (item.week === this.weeksActive) {
          arr.push(item)
        }
      })
      let dataArr = []
      let breakfastArr = []
      let lunchArr = []
      let dinnerArr = []
      arr.forEach(item => {
        if (item.meal === 'breakfast') {
          breakfastArr.push(...item.foods)
        } else if (item.meal === 'lunch') {
          lunchArr.push(...item.foods)
        } else {
          dinnerArr.push(...item.foods)
        }
        if (item.meal === this.mealsActive) {
          dataArr.push(...item.foods)
        }
      })
      this.mealsObj.breakfast = breakfastArr
      this.mealsObj.lunch = lunchArr
      this.mealsObj.dinner = dinnerArr
      this.QueryRecipeTable = dataArr
    },

    //渲染类型
    renderTypeText(row) {
      let obj = this.dictMap.foodTypeOptions.find(item => {
        return item.dictKey === row.type
      })
      return obj ? obj.dictValue : '/'
    },
    //点击预览
    clickPreview() {
      let routeLink = this.$router.resolve({
        path: '/RecipePreview',
        query: {
          id: this.$parent.CheckRecipeRow.id
        }
      })
      window.open(routeLink.href, '_blank')
    },
  }
}
</script>

<style lang="scss" scoped>
.meal-wrap {
  /deep/ .el-radio-button {
    border: 1px solid #DCDFE6 !important;

  }

  /deep/ .el-radio-button__inner {
    width: 120px !important;
    border: none !important;
  }

  /deep/ .el-radio-button:last-child .el-radio-button__inner,
  /deep/ .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0 !important;
  }

  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #53C389 !important;
    border-color: #53C389 !important;
  }

  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    box-shadow: none !important;
  }

}

</style>
