<template>
  <!--    食谱制定-->
  <el-dialog
      :visible.sync="isShowRecipeFormulateDialog"
      width="700px">
    <div>
      <div class="bor-b fs22 pd-b10">食谱制定({{ stepNum }}/3)</div>
      <div class="pd20">
        <div v-if="stepNum === 1">
          第一步：制定 <span class="cl0061b2 ft-b fs18">早餐</span>，
          每天最多选择<span class="cl0061b2 ft-b fs18"> 6</span> 项，菜品默认按本周人气降序排列
        </div>
        <div v-if="stepNum === 2">
          第二步：制定 <span class="cl0061b2 ft-b fs18">午餐</span>，
          每天最多选择<span class="cl0061b2 ft-b fs18"> 10</span> 项，菜品默认按本周人气降序排列
        </div>
        <div v-if="stepNum === 3">
          第三步：制定 <span class="cl0061b2 ft-b fs18">晚餐</span>，
          每天最多选择<span class="cl0061b2 ft-b fs18"> 9</span> 项，菜品默认按本周人气降序排列
        </div>
      </div>
      <el-row>
        <el-col :span="5">
          <!--       早餐-->
          <div v-if="stepNum === 1" class="week-wrap">
            <div
                class="week-item pd10 bor-b"
                v-for="(item, index) in breakfastObj.list"
                :key="index">
              周 {{ item.week }}
              ( {{ item.foods.length }} / {{ breakfastObj.maxValue }} )
            </div>
          </div>
          <!--        午餐-->
          <div v-if="stepNum === 2" class="week-wrap">
            <div
                class="week-item pd10 bor-b"
                v-for="(item, index) in lunchObj.list"
                :key="index">
              周 {{ item.week }}
              ( {{ item.foods.length }} / {{ lunchObj.maxValue }} )
            </div>
          </div>
          <!--        晚餐-->
          <div v-if="stepNum === 3" class="week-wrap">
            <div
                class="week-item pd10 bor-b"
                v-for="(item, index) in supperObj.list"
                :key="index">
              周 {{ item.week }}
              ( {{ item.foods.length }} / {{ supperObj.maxValue }} )
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="pd-l20">
            <el-tabs
                v-model="formulateTableActiveName"
                @tab-click="handleClick"
                type="card">
              <el-tab-pane
                  v-for="(item) in dictMap.foodTypeOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :name="item.dictKey">
              </el-tab-pane>
            </el-tabs>
            <div class="dis-fl">
              <el-input @clear="getTblFoodFindList(1)" clearable v-model="formulateTableQueryName" class="width300"
                        placeholder="请输入菜品关键字"/>
              <el-button class="mg-l20" type="primary" @click="getTblFoodFindList(1)">搜索</el-button>
            </div>
            <div class="pd-t20">
              <el-table
                  :data="formulateTable"
                  style="width: 100%;"
                  border>
                <el-table-column label="菜品名称" align="center" prop="name"/>
                <el-table-column label="菜品分类" align="center">
                  <template slot-scope="scope">
                    {{ renderTypeText(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column :label="stepNum ===1 ?'近7天人气度':'本周点击次数'" align="center" prop="sevenNums"/>
                <el-table-column label="选择(1-7）" align="center" width="260">
                  <template slot-scope="scope">
                    <ul class="weeks">
                      <li
                          v-for="(item, index) in scope.row.weekList"
                          :key="index"
                          @click="clickWeekItem(scope.row, item, index)"
                          :class="{'isSelected': item.isSelected}"
                          class="week-item">
                        {{ item.week }}
                      </li>
                    </ul>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                  @current-change="formulateTableChangePage"
                  :current-page="formulateTableCurrentPage"
                  :page-size="formulateTablePageSize"
                  layout="total, prev, pager, next"
                  :total="formulateTableTotal">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <!--        NO.1-->
      <div v-if="stepNum === 1">
        <el-button @click="isShowRecipeFormulateDialog = false">取 消</el-button>
        <el-button type="primary" @click="clickNextStep(1)">下一步</el-button>
      </div>

      <!--        NO.2-->
      <div v-if="stepNum === 2">
        <el-button type="primary" @click="clickLastStep(2)">上一步</el-button>
        <el-button type="primary" @click="clickNextStep(2)">下一步</el-button>
      </div>

      <!--        NO.3-->
      <div v-if="stepNum === 3">
        <span class="pd-r10 cl666666">制订日期 :</span>
        <el-date-picker
            v-model="formulateDate"
            :clearable="false"
            type="daterange"
            value-format="yyyy/MM/dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <br>
        <br>
        <el-button type="primary" @click="clickLastStep(3)">上一步</el-button>
        <el-button type="success" @click="clickPreView('RecipeForm')">预览</el-button>
        <el-button type="primary" @click="submitFormulate">提交制定</el-button>
      </div>
    </div>
  </el-dialog>

</template>

<script>
import {getDicTypeValue} from '@/utils/dicMap'
import {tblFoodFindList} from "../../../api/Cuisine";
import {tblRecipesTotalAdd} from "../../../api/Recipe";
import {moment} from '@/utils/date/moment'

export default {
  name: "AddRecipe",
  data() {
    return {
      /*
       * 食谱制定
       */
      isShowRecipeFormulateDialog: false,
      //步骤
      stepNum: 1,
      //菜品关键字
      formulateTableQueryName: '',
      //菜品类型
      formulateTableActiveName: 'all',
      //菜品表格
      formulateTable: [],
      formulateTableCurrentPage: 1,
      formulateTablePageSize: 5,
      formulateTableTotal: 0,
      //早餐集合
      breakfastObj: {
        maxValue: 6,
        list: []
      },
      //午餐集合
      lunchObj: {
        maxValue: 10,
        list: []
      },
      //晚餐集合
      supperObj: {
        maxValue: 9,
        list: []
      },
      activeName: '',
      keyword: '',
      //制定日期
      formulateDate: [moment().add('weeks', 1).startOf('week').format('YYYY/MM/DD'), moment().add('weeks', 1).endOf('week').format('YYYY/MM/DD')],
      //食品类型
      foodTypeOptions: [],
      //初始星期数据
      initWeek: [
        {
          week: '一',
          weekEn: 'monday',
          foodIds: [],
          foods: []
        },
        {
          week: '二',
          weekEn: 'tuesday',
          foodIds: [],
          foods: []
        },
        {
          week: '三',
          weekEn: 'wednesday',
          foodIds: [],
          foods: []
        },
        {
          week: '四',
          weekEn: 'thursday',
          foodIds: [],
          foods: []
        },
        {
          week: '五',
          weekEn: 'friday',
          foodIds: [],
          foods: []
        },
        {
          week: '六',
          weekEn: 'Saturday',
          foodIds: [],
          foods: []
        },
        {
          week: '日',
          weekEn: 'sunday',
          foodIds: [],
          foods: []
        },

      ]

    }
  },
  /** 接收字典 */
  inject: ['dictMap'],
  mounted() {
    this.$nextTick(() => {
      this.breakfastObj.list = this.$options.data().initWeek
      this.lunchObj.list = this.$options.data().initWeek
      this.supperObj.list = this.$options.data().initWeek
    })
  },
  methods: {
    //获取菜品列表
    getTblFoodFindList(pageNum) {
      let params = {
        name: this.formulateTableQueryName,
        type: this.formulateTableActiveName === 'all' ? '' : this.formulateTableActiveName,
        status: 'valid',
        pagination: {
          pageNum: pageNum || this.formulateTableCurrentPage,
          pageSize: this.formulateTablePageSize,
        }
      }
      tblFoodFindList(params).then(res => {
        if (+res.code === 200) {
          res.data.forEach(item => {
            item.weekList = [];
            for (let i = 0, len = 7; i < len; i++) {
              item.weekList.push({
                week: i + 1,
                isSelected: false
              })
            }
          })
          this.formulateTable = res.data
          this.formulateTableTotal = res.pagination.total
          this.isShowRecipeFormulateDialog = true
          this.restoreFormulateTableData()
        }
      })
    },
    //菜品表格分页
    formulateTableChangePage(val) {
      this.formulateTableCurrentPage = val
      this.getTblFoodFindList()

    },

    //还原食谱制定表格的数据
    restoreFormulateTableData() {
      let dataArr = {}
      if (this.stepNum === 1) {
        dataArr = this.breakfastObj.list
      } else if (this.stepNum === 2) {
        dataArr = this.lunchObj.list
      } else if (this.stepNum === 3) {
        dataArr = this.supperObj.list
      }

      if (!this.formulateTable.length) return
      dataArr.forEach((item, index) => {
        this.formulateTable.forEach((itemIn) => {
          if (item.foodIds.includes(itemIn.id)) {
            itemIn.weekList[index].isSelected = true
            this.$forceUpdate()
          }
        })
      })
    },
    //点击上一步
    clickLastStep(stepIndex) {
      if (stepIndex === 2) {
        this.stepNum = 1
      } else if (stepIndex === 3) {
        this.stepNum = 2
      }
      this.handleClick()

    },
    //点击下一步
    clickNextStep(stepIndex) {
      if (stepIndex === 1) {
        this.stepNum = 2
      } else if (stepIndex === 2) {
        this.stepNum = 3
      }
      this.handleClick()
    },

    //菜品改变时
    clickWeekItem(row, item, index) {

      //组装需要的数据
      let {id, name, type} = row
      let pushItem = {tblFoodId: id, name, type}
      let foodsArr = []
      let foodIdsArr = []
      let maxValue = 0
      //判断饭餐类型(早餐/午餐/晚餐)
      if (this.stepNum === 1) {
        foodsArr = this.breakfastObj.list[index].foods
        foodIdsArr = this.breakfastObj.list[index].foodIds
        maxValue = this.breakfastObj.maxValue
      } else if (this.stepNum === 2) {
        foodsArr = this.lunchObj.list[index].foods
        foodIdsArr = this.lunchObj.list[index].foodIds
        maxValue = this.lunchObj.maxValue
      } else if (this.stepNum === 3) {
        foodsArr = this.supperObj.list[index].foods
        foodIdsArr = this.supperObj.list[index].foodIds
        maxValue = this.supperObj.maxValue
      }
      //如果原有数组为空, 直接追加到数组中
      if (!foodsArr.length) {
        foodIdsArr.push(pushItem.tblFoodId)
        foodsArr.push(pushItem)
      } else {
        //判断是否存在原有数组中
        if (foodIdsArr.includes(pushItem.tblFoodId)) {
          let i = foodsArr.findIndex(el => el.id === pushItem.tblFoodId)
          foodIdsArr.splice(i, 1)
          foodsArr.splice(i, 1)
        } else {
          //判断是否超过了当日饭餐类型的最多项
          if (foodsArr.length >= maxValue) {
            return this.$message.warning('菜品数量不能大于当日最多项')
          }
          foodsArr.push(pushItem)
          foodIdsArr.push(pushItem.tblFoodId)
        }
      }
      item.isSelected = !item.isSelected
    },
    //点击提交制定
    async submitFormulate() {
      let params = {}
      params.weeks = [];
      await this.breakfastObj.list.forEach(item => {
        if (item.foods.length) {
          let obj = {}
          obj.week = item.weekEn;
          obj.meal = 'breakfast';
          obj.foods = item.foods;
          params.weeks.push(obj)
        }
      })
      await this.lunchObj.list.forEach(item => {
        if (item.foods.length) {
          let obj = {}
          obj.week = item.weekEn;
          obj.meal = 'lunch';
          obj.foods = item.foods;
          params.weeks.push(obj)
        }
      })
      await this.supperObj.list.forEach(item => {
        if (item.foods.length) {
          let obj = {}
          obj.week = item.weekEn;
          obj.meal = 'dinner';
          obj.foods = item.foods;
          params.weeks.push(obj)
        }
      })
      if (!this.formulateDate || !this.formulateDate.length) {
        return this.$message.warning('请选择制定日期')
      }
      params.preparationDateStart = this.formulateDate[0]
      params.preparationDateEnd = this.formulateDate[1]

      tblRecipesTotalAdd(params).then(res => {
        if (+res.code === 200) {
          this.$message.success('添加成功')
          this.isShowRecipeFormulateDialog = false
          this.$parent.MiXin_searchTable();
          Object.assign(this.$data, this.$options.data())
        }
      })
    },

    //点击预览
    clickPreView() {
      if (!this.formulateDate || !this.formulateDate.length) {
        return this.$message.warning('请选择制定日期')
      }
      let previewData = {
        breakfast: this.breakfastObj.list,
        lunch: this.lunchObj.list,
        supper: this.supperObj.list,
        date: this.formulateDate
      }
      let url = `/RecipePreview?type=CookBookPreviewRecipeData`
      let routeUrl = this.$router.resolve({
        path: url,
      })
      window.open(routeUrl.href, '_blank')
      localStorage.setItem('CookBookPreviewRecipeData', JSON.stringify(previewData))

    },

    //渲染
    renderTypeText(row) {
      let obj = this.dictMap.foodTypeOptions.find(item => {
        return item.dictKey === row.type
      })
      return obj ? obj.dictValue : '/'
    },
    //点击菜品分类
    handleClick() {
      this.formulateTableCurrentPage = 1
      this.getTblFoodFindList()
    }
  }
}
</script>

<style lang="scss" scoped>
.week-wrap {
  border-right: 1px solid #E0E0E0;
}

.weeks {
  display: flex;
  user-select: none;

  .week-item {
    width: 40px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #e5e5e5;
    cursor: pointer;
  }

  .week-item:hover {
    background-color: #E0E0E0;
  }

  .week-item.isSelected {
    background-color: #409EFF;
    color: white;
  }
}

</style>
