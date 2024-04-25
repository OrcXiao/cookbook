<template>
  <div class="EditRecipe-wrap">
    <el-dialog
        :visible.sync="isShowRecipeEditDialog"
        title="食谱修改"
        width="700px">
      <el-form
          label-width="120px">
        <el-row>
          <el-col :span="5">
            <div>
              数据来源 : {{ currentDataAuth.dictValue }}
            </div>
            <div class="pd-t30 meal-wrap">
              <el-radio-group @change="getRecipeEditTableData" v-model="mealsActive">
                <el-radio-button
                    v-for="(item, index) in mealsOptions"
                    :key="index"
                    :label="item.dictKey"
                >{{ item.dictValue }} {{ mealsObj[item.dictKey].length }} / {{ item.maxVal }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="18">
            <el-form-item label-width="0">
              <el-radio-group @change="getRecipeEditTableData" v-model="weeksActive">
                <el-radio-button
                    v-for="(item, index) in weeksOptions"
                    :key="index"
                    :label="item.dictKey"
                >{{ item.dictValue }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="dis-fl pd-b20">
                <el-button @click="getTblFoodFindList(1)" type="success">添加菜品</el-button>
                <el-button @click="clickPersonalizationAdd" type="success">个性化添加</el-button>
              </div>
              <div class="add-recipe-wrap">
                <el-table
                    :header-cell-style="{background:'#f5f7fa'}"
                    :data="RecipeEditTableData"
                    style="width: 100%;"
                    border>
                  <el-table-column label="菜品名称" align="center" prop="name"/>
                  <el-table-column label="菜品分类" align="center">
                    <template slot-scope="scope">
                      {{ renderTypeText(scope.row) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <span class="clf56c6c cu-pt" @click="clickRemoveCuisine(scope.row, scope.$index)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>

              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowRecipeEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRecipeEditForm">确认修改</el-button>
      </div>
    </el-dialog>

    <!--    添加食谱-->
    <el-dialog
        @close="AddRecipeDialogDialogClose"
        :visible.sync="isShowAddRecipeDialog"
        title="添加食谱"
        width="700px">
      <div>
        <div class="pd-l20">
          <el-tabs
              v-model="formulateTableActiveName"
              @tab-click="handleClick"
              type="card">
            <el-tab-pane
                v-for="(item, index) in foodTypeOptions"
                :key="index"
                :label="item.dictValue"
                :name="item.dictKey">
            </el-tab-pane>
          </el-tabs>

          <div class="dis-fl">
            <el-input v-model="formulateTableQueryName" @clear="getTblFoodFindList(1)" clearable class="width300"
                      placeholder="请输入菜品关键字"/>
            <el-button
                class="mg-l20"
                type="primary"
                @click="getTblFoodFindList( 1)">搜索
            </el-button>
          </div>
          <div class="pd-t20">
            <el-table
                @select-all="AddRecipeTableHandleSelectAll"
                @select="AddRecipeTableHandleSelect"
                :data="AddRecipeTableData"
                style="width: 100%;"
                border>
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <el-table-column label="菜品名称" align="center" prop="name"/>
              <el-table-column label="菜品分类" align="center">
                <template slot-scope="scope">
                  {{ renderTypeText(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="本周点击次数" align="center" prop="sevenNums"></el-table-column>
            </el-table>
            <div class="dis-fl ju-ct">
              <el-pagination
                  @current-change="AddRecipeTableChangePage"
                  :current-page.sync="formulateTableCurrentPage"
                  :page-size="formulateTablePageSize"
                  layout="total, prev, pager, next"
                  :total="formulateTableTotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm">确认添加</el-button>
        <el-button @click="isShowAddRecipeDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--    个性化添加-->
    <el-dialog
        :visible.sync="isShowPersonalizationAddDialog"
        title="个性化添加"
        width="500px">
      <div>
        <div class="pd-l20">
          <el-button type="primary" @click="clickPersonalizationAddBtn">添加</el-button>
          <div class="pd-t20">
            <el-table
                :data="PersonalizationAddTableData"
                style="width: 100%;"
                border>
              <el-table-column label="自定义名称" align="center">
                <template slot-scope="scope">
                  <el-input placeholder="输入要展示的名字" v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="clickRemovePersonalizationAdd(scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPersonalizationAddForm('ClassifyForm')">确认添加</el-button>
        <el-button @click="isShowPersonalizationAddDialog = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {tblRecipesTotalFindById, tblRecipesTotalUpdate} from "../../../api/Recipe";
import {tblFoodFindList} from "../../../api/Cuisine";
import {getDicTypeValue} from '@/utils/dicMap'
import {getStorage} from "../../../utils/storage/localStorage";

export default {
  name: "EditRecipe",
  data() {
    return {
      /*
      * 食谱修改
      * */
      EditRecipeRow: {},
      isShowRecipeEditDialog: false,
      currentRecipeId: '',
      RecipeEditObj: {},
      RecipeEditAllData: [],
      RecipeEditTableData: [],
      formulateTableCurrentPage: 1,
      formulateTablePageSize: 5,
      formulateTableTotal: 0,
      formulateTableQueryName: '',
      formulateTableActiveName: 'all',
      foodTypeOptions: [],
      weeksOptions: [],
      mealsOptions: [],
      mealsActive: '',
      weeksActive: '',

      mealsObj: {
        breakfast: [],
        lunch: [],
        dinner: []
      },

      /*
      * 添加食谱
      * */
      isShowAddRecipeDialog: false,
      RecipeCurrentPage: 1,
      AddRecipeTableData: [],
      selectAddRecipeItems: [],

      /*
      * 个性化添加
      * */
      isShowPersonalizationAddDialog: false,
      PersonalizationAddTableData: [],

    }
  },
  computed: {
    currentDataAuth: function () {
      let res = getStorage('CookBookCurrentDataAuth')
      return res || {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDic()
    })
  },
  methods: {
    //获取码表
    getDic() {
      Promise.all([getDicTypeValue('foodType'), getDicTypeValue('meals'), getDicTypeValue('weekType')]).then(res => {
        let {0: foodType, 1: meals, 2: weekType,} = res
        let arr = [...foodType]
        arr.unshift({
          dictValue: '全部',
          dictKey: 'all',
        })
        this.foodTypeOptions = arr
        meals.forEach(item => {
          item.nums = 0;
          if (item.dictKey === "breakfast") {
            item.maxVal = 6
          } else if (item.dictKey === "lunch") {
            item.maxVal = 10
          } else if (item.dictKey === "dinner") {
            item.maxVal = 9
          }
        })
        this.mealsOptions = meals
        this.weeksOptions = weekType
        this.mealsActive = meals[0].dictKey
        this.weeksActive = weekType[0].dictKey
      })
    },
    getRowData() {
      let row = this.$parent.EditRecipeRow
      tblRecipesTotalFindById({id: row.id}).then(res => {
        if (+res.code === 200) {
          this.RecipeEditObj = res.data;
          this.isShowRecipeEditDialog = true;
          this.RecipeEditAllData = res.data.recipesDetailDtoList;
          this.getRecipeEditTableData()
        }
      })
    },
    //获得修改食谱弹框中表格的数据
    getRecipeEditTableData() {
      let arr = []
      this.RecipeEditAllData.forEach(item => {
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
        } else if (item.meal === 'dinner') {
          dinnerArr.push(...item.foods)
        }
        if (item.meal === this.mealsActive) {
          dataArr.push(...item.foods)
        }
      })
      this.mealsObj.breakfast = breakfastArr
      this.mealsObj.lunch = lunchArr
      this.mealsObj.dinner = dinnerArr
      this.RecipeEditTableData = dataArr
    },
    //点击菜品分类
    handleClick() {
      this.formulateTableCurrentPage = 1
      this.getTblFoodFindList()
    },
    //添加食谱弹框关闭
    AddRecipeDialogDialogClose() {
      this.formulateTableQueryName = ''
    },
    //获取菜品列表
    getTblFoodFindList(pageNum) {
      this.selectAddRecipeItems = []
      let params = {
        name: this.formulateTableQueryName,
        type: this.formulateTableActiveName === 'all' ? '' : this.formulateTableActiveName,
        pagination: {
          pageNum: pageNum || this.formulateTableCurrentPage,
          pageSize: this.formulateTablePageSize,
        },
        status: 'valid'
      }
      tblFoodFindList(params).then(res => {
        if (+res.code === 200) {
          this.AddRecipeTableData = res.data
          this.formulateTableTotal = res.pagination.total
          this.isShowAddRecipeDialog = true
        }
      })
    },
    //点击个性化添加
    clickPersonalizationAdd() {
      this.isShowPersonalizationAddDialog = true
      this.PersonalizationAddTableData = []
    },
    //点击删除菜品
    clickRemoveCuisine(row, index) {
      this.RecipeEditTableData.splice(index, 1)
      let obj = this.RecipeEditAllData.find(item => {
        return item.meal === this.mealsActive && item.week === this.weeksActive
      })
      obj.foods.splice(index, 1)
      this.mealsObj[this.mealsActive].splice(index, 1)
      this.$forceUpdate()
    },
    //渲染菜品文本
    renderTypeText(row) {
      let obj = this.foodTypeOptions.find(item => {
        return item.dictKey === row.type
      })
      return obj ? obj.dictValue : '/'
    },
    AddRecipeTableChangePage(val) {
      this.formulateTableCurrentPage = val
      this.getTblFoodFindList()
    },

    AddRecipeTableHandleSelectAll(selection) {
      this.selectAddRecipeItems = selection
    },
    AddRecipeTableHandleSelect(selection) {
      this.selectAddRecipeItems = selection
    },

    //点击添加食谱弹框确认添加
    submitAddForm() {
      if (!this.selectAddRecipeItems.length) {
        return this.$message.warning('请选择要添加的菜品')
      }
      let arr = []
      this.selectAddRecipeItems.forEach(item => {
        let obj = this.RecipeEditTableData.find(el => el.id === item.id)
        if (!obj) {
          let {id, type, name} = item
          arr.push({id, type, name})
        }
      })
      let maxVal = this.mealsOptions.find(item => item.dictKey === this.mealsActive).maxVal;
      let mealType = this.mealsOptions.find(item => item.dictKey === this.mealsActive).dictValue;
      if (arr.length + this.RecipeEditTableData.length > maxVal) {
        return this.$message.warning(mealType + '最多只能添加' + maxVal + '个菜品')
      }
      let isExist = false
      this.RecipeEditAllData.forEach(item => {
        if (item.meal === this.mealsActive && item.week === this.weeksActive) {
          isExist = true
          item.foods.push(...arr)
        }
      })
      if (!isExist) {
        this.RecipeEditAllData.push({
          meal: this.mealsActive,
          week: this.weeksActive,
          foods: arr
        })
      }
      this.getRecipeEditTableData()
      this.isShowAddRecipeDialog = false
      this.selectAddRecipeItems = []
    },
    //点击个性化添加弹框里的添加按钮
    clickPersonalizationAddBtn() {
      this.PersonalizationAddTableData.push({
        name: '',
      })
    },
    //点击个性化添加弹框里的删除按钮
    clickRemovePersonalizationAdd(index) {
      this.PersonalizationAddTableData.splice(index, 1)
    },
    //点击个性化添加弹框里的确认添加按钮
    submitPersonalizationAddForm() {
      let arr = []
      this.PersonalizationAddTableData.forEach(item => {
        let {name} = item
        arr.push({name})
      })

      let maxVal = this.mealsOptions.find(item => item.dictKey === this.mealsActive).maxVal;
      let mealType = this.mealsOptions.find(item => item.dictKey === this.mealsActive).dictValue;
      if (arr.length + this.RecipeEditTableData.length > maxVal) {
        return this.$message.warning(mealType + '最多只能添加' + maxVal + '个菜品')
      }

      let isExist = false
      this.RecipeEditAllData.forEach(item => {
        if (item.meal === this.mealsActive && item.week === this.weeksActive) {
          isExist = true
          item.foods.push(...arr)
        }
      })
      if (!isExist) {
        this.RecipeEditAllData.push({
          meal: this.mealsActive,
          week: this.weeksActive,
          foods: arr
        })
      }
      this.getRecipeEditTableData()
      this.isShowPersonalizationAddDialog = false
      setTimeout(() => {
        this.PersonalizationAddTableData = []
      }, 200)
    },
    //点击提交食谱修改
    submitRecipeEditForm() {
      let row = this.$parent.EditRecipeRow
      let params = {}
      params.id = row.id;
      params.weeks = this.RecipeEditAllData;
      tblRecipesTotalUpdate(params).then(res => {
        if (+res.code === 200) {
          this.$message.success('操作成功')
          this.isShowRecipeEditDialog = false
          this.mealsActive = this.mealsOptions[0].dictKey
          this.weeksActive = this.weeksOptions[0].dictKey
          this.$parent.MiXin_searchTable();
        }
      })
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
.add-recipe-wrap{
  max-height: 300px;
  overflow-y: auto;
}
</style>
