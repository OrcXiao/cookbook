<template>
  <div class="home">
    <div @click="clickJump" class="banner-warp cu-pt"></div>
    <div class="body-wrap">
      <div class="info-wrap">
        <div class="dis-fl ju-ct title-wrap">
          <div class="before"></div>
          <div class="fs28 cl333333 ft-b title">{{ MiXin_findDictValue(authDic, currentDataAuth) }}信息公开栏</div>
          <div class="after"></div>
        </div>
        <div class="one-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">一周食谱</div>
            </div>
            <div>
              <my-table
                  class="home-table"
                  :pageSize='5'
                  ref="oneWeekRecipe"
                  :isAuto="false"
                  :showPagination="{
                      layout: 'total,prev,pager,next',
                      background: true
                  }"
                  :isPaginationRight="true"
                  :isFixedHeight="true"
                  :data="loadDataOneWeekRecipe"
                  :columns="oneWeekRecipeColumns">
                <template slot="renderFormulateDate" slot-scope="scope">
                  <span @click="clickCommonJump({path: '/RecipePreview', id: scope.row.id})"
                        class="cl409eff cu-pt">
                    {{
                      renderDateTime(scope.row.preparationDateStart)
                    }} - {{ renderDateTime(scope.row.preparationDateEnd) }}</span>
                </template>
              </my-table>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">会餐食谱列表</div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' ref="mealTable" :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                    }" :isPaginationRight="true" :data="loadDataMealTable" :columns="mealColumns">
                <template slot="renderList" slot-scope="scope">
                  <span @click="clickCommonJump({path: '/DineTogether', id: scope.row.id})"
                        class="cl409eff cu-pt">
                  {{ scope.row.name }}</span>
                </template>

              </my-table>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">伙食账目公布表</div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" ref="foodAccounts" :pageSize='5' :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                    }" :isPaginationRight="true" :data="loadDataFoodAccounts" :columns="foodAccountsColumns">
                <template slot="renderName" slot-scope="scope">
                  <span @click="clickCommonJump({ path: '/FoodAccountsPreview', id: scope.row.id})"
                        class="cl409eff cu-pt">{{ scope.row.date }} 伙食账目</span>
                </template>
              </my-table>
            </div>

          </div>
        </div>
        <div class="one-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">交伙情况</div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' ref="inGroup" :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                    }" :isPaginationRight="true" :data="loadDataInGroup" :columns="InGroupColumns">
                <template slot="renderName" slot-scope="scope">
                  <span @click="clickCommonJump({ path: '/Rendezvous', id: scope.row.id})"
                        class="cl409eff cu-pt">{{ scope.row.date }} 交伙情况</span>
                </template>
              </my-table>

            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">询价</div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' ref="enquiry" :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                    }" :isPaginationRight="true" :data="loadDataEnquiry" :columns="enquiryColumns">
                <template slot="renderName" slot-scope="scope">
                  <span @click="clickCommonJump({
                  path: '/EnquiryPreview',
                  id: scope.row.date,
                  })" class="cl409eff cu-pt">{{ scope.row.date }} 询价</span>
                </template>
              </my-table>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">定量标准</div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' ref="standard" :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                    }" :isPaginationRight="true" :data="loadDataStandard" :columns="standardColumns">
                <template slot="renderName" slot-scope="scope">
                  <span @click="clickCommonJump({
                  path: '/QuantitativeCriterion',
                  id: scope.row.id
                  })" class="cl409eff cu-pt">{{ scope.row.name }}</span>
                </template>
              </my-table>
            </div>
          </div>
        </div>
        <div class="two-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">采购情况</div>
            </div>
            <div class="dis-fl sub-type">
              <div v-for="(item, index) in dateOptions" :key="index" @click="changeDate(item)"
                   :class="{'active': item.value === dateActive}" class="item">
                {{ item.label }}
              </div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' :isAuto="false" ref="buyingSituation"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                  }" :isPaginationRight="true" :data="loadDataBuyingSituation" :columns="BuyingSituationColumns">
              </my-table>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">意见收集</div>
              <img @click="clickAdviseBtn" class="cu-pt edit-icon" src="../../assets/img/yijianfankui.png" alt="">
            </div>
            <div class="dis-fl sub-type">
              <div v-for="(item, index) in opinionOptions" :key="index" @click="changeOpinionType(item)"
                   :class="{'active': item.value === opinionActive}" class="item">
                {{ item.label }}
              </div>

            </div>
            <div v-show="opinionActive === '1'">
              <my-table :isFixedHeight="true" class="home-table" ref="optionTable" :isAuto="false" :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                  }" :isPaginationRight="true" :data="loadDataOpinion" :columns="opinionColumns" :pageSize='5'>
                  <span slot="nums" slot-scope="{text}">
                     <span class="cl409eff cu-pt">{{ text }}</span>
                  </span>
                <span slot="title" slot-scope="{row}">
                   <span @click="$refs.opinion && $refs.opinion.init(row)" class="cl409eff cu-pt">{{ row.title }}</span>
                  </span>
              </my-table>
            </div>
            <div v-show="opinionActive === '2'">
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' ref="questionaire" :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                  }" :isPaginationRight="true" :data="loadDataQuestionaire" :columns="QuestionaireColumns">
                  <span slot="name" slot-scope="{row}">
                     <span @click="OpenQuestionModal(row)" class="cl409eff cu-pt">{{ row.name }}</span>
                  </span>
              </my-table>
            </div>
          </div>
        </div>
        <div class="two-area dis-fl ju-sb">
          <div class="pd-r5">
            <div class="area-title">
              <div class="fs20 clffffff">当日消耗</div>
              <span class="pd-l20 consumeTime-wrap">
                  <el-date-picker
                      @change="getTblProcurementPlanOut"
                      size="mini"
                      v-model="consumeTime"
                      type="date"
                      value-format="yyyy/MM/dd"
                      placeholder="选择日期">
                  </el-date-picker>
                <span @click="clickNewWin" class="mg-l70 cu-pt clF29E44">新窗口打开</span>
              </span>

            </div>
            <div>
              <my-table :isFixedHeight="true" :pageSize='5' ref="consume" :isAuto="false"
                        class="home-table consume-table"
                        :showPagination="false"
                        :isPaginationRight="true"
                        :tableData="consumeTableData"
                        :columns="consumeColumns">
              </my-table>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs20 clffffff">其他</div>
            </div>
            <div>
              <my-table :isFixedHeight="true" class="home-table" :pageSize='5' ref="other" :isAuto="false"
                        :showPagination=" {
                      layout: 'total,prev,pager,next',
                      background: true
                  }" :isPaginationRight="true" :data="loadDataOther" :columns="OtherColumns">

                  <span slot="name" slot-scope="{row}">
                     <span @click="clickCommonJump({
                     path: '/ContentPreview',
                     id: row.id
                     })" class="cl409eff cu-pt">{{ row.name }}</span>
                  </span>
              </my-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div @click="clickAdviseBtn" class="opinion-wrap cu-pt">
      <img class=" edit-icon" src="../../assets/img/yijianfankui.png" alt="">
      <div class="fs16 cl666666">提意见</div>
    </div>

    <!-- 提意见-->
    <el-dialog :visible.sync="isShowOpinionDialog" title="提意见" @close="MiXin_closeDialog('OpinionForm')" width="500px">
      <el-form ref="OpinionForm" :model="OpinionForm" :rules="OpinionFormRules" label-width="120px">
        <el-form-item label="意见标题 :" prop="title">
          <el-input v-model="OpinionForm.title" placeholder="请输入意见标题"/>
        </el-form-item>
        <el-form-item label="意见内容 :" prop="content">
          <el-input type="textarea" v-model="OpinionForm.content" placeholder="匿名收集和呈现,请输入您宝贵的意见"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('OpinionForm')">确认提交</el-button>
        <el-button @click="isShowOpinionDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <OpinionModal @success="MiXin_searchTable('optionTable')" ref="opinion"/>
  </div>
</template>

<script>
import {getDicTypeValue} from '@/utils/dicMap'

import validate from "../../validate";
import {tblRecipesTotalFindList} from '../../api/Recipe'
import {contentList} from '../../api/Content'
import {tblFoodAccountList, tblBoardExpensesList} from '@/api/BoardWages';
import {tblInquiryFindList, tblInquiryFindGroup} from "../../api/Enquiry";
import {tblProcurementPlanProcurement, tblProcurementPlanOut} from "../../api/Home";
import {opinionList, opinionAdd} from '@/api/Opinion';
import {questionaireList} from '@/api/Questionnaire'
import OpinionModal from './components/OpinionModal.vue'

export default {
  name: 'Home',
  components: {OpinionModal},
  data() {
    return {
      tableData: [],
      isShowOpinionDialog: false,
      OpinionForm: {
        title: '',
        content: '',
      },
      OpinionFormRules: {
        title: [
          validate.NotNull({name: '意见标题'})
        ],
        content: [
          validate.NotNull({name: '意见内容'})
        ],
      },
      /*
       * 一周食谱
       * */
      oneWeekRecipeColumns: [
        {
          label: '制定日期',
          slotName: 'renderFormulateDate',
        },
      ],
      /*
       * 会餐食谱列表
       * */
      mealColumns: [
        {
          label: '会餐食谱列表',
          slotName: 'renderList',
        },
      ],
      /*
       * 伙食账目公布表
       * */
      foodAccountsColumns: [
        {
          label: '标题名称',
          slotName: 'renderName',
        },
        {
          label: '发布时间',
          prop: 'updateTime',
        },
      ],
      /*
       * 交伙情况
       * */
      InGroupColumns: [
        {
          label: '标题名称',
          slotName: 'renderName',
        },
        {
          label: '发布时间',
          prop: 'updateTime',
        },
      ],
      /*
       * 询价
       * */
      enquiryColumns: [
        {
          label: '标题名称',
          slotName: 'renderName',
        },
        {
          label: '发布时间',
          prop: 'date',
        },
      ],
      /*
       * 定量标准
       * */
      standardColumns: [
        {
          label: '标题名称',
          slotName: 'renderName',
        },
        {
          label: '发布时间',
          prop: 'createTime',
        },
      ],
      /*
       * 采购情况
       * */
      dateOptions: [
        {
          label: '今日',
          value: '1',
        },
        {
          label: '昨日',
          value: '2',
        },
        {
          label: '近7天',
          value: '3',
        },
      ],
      dateActive: '1',
      BuyingSituationColumns: [
        {
          label: '品名',
          prop: 'name',
        },
        {
          label: '计划数量',
          prop: 'planNums',
        },
        {
          label: '实购数量',
          prop: 'inNums',
        },
        {
          label: '出库量',
          prop: 'outNums',
        },
        {
          label: '单位',
          prop: 'measures',
        },
        {
          label: '合计(元)',
          prop: 'total',
          renderTextFun: function (row) {
            if (typeof row.total == 'number') {
              return row.total.toFixed(2)
            }
          }
        },
      ],

      /*
       * 意见收集
       * */
      opinionOptions: [
        {
          label: '意见列表',
          value: '1',
        },
        {
          label: '调查问卷',
          value: '2',
        },
      ],
      opinionActive: '1',
      opinionColumns: [
        {
          label: '意见名称',
          prop: 'title',
          slotName: 'title'
        },
        {
          label: '浏览次数',
          prop: 'nums',
          slotName: 'nums'
        },
        {
          label: '提交时间',
          prop: 'createTime',
        },
      ],
      QuestionaireColumns: [
        {
          label: '问卷名称',
          prop: 'name',
          slotName: 'name'
        },
        {
          label: '参与次数',
          prop: 'nums',
        },
        {
          label: '发布时间',
          prop: 'createTime',
        },
      ],
      /*
       * 每日消耗
       * */
      consumeColumns: [
        {
          label: '区分',
          width: '35',
          prop: 'meal'
        }
      ],
      consumeTable: [],

      /*
     * 定量标准
     * */
      OtherColumns: [
        {
          label: '标题名称',
          prop: 'name',
          slotName: 'name'
        },
        {
          label: '发布时间',
          prop: 'createTime',
        },
      ],

      authDic: [],
      meals: [],

      currentDataAuth: '',
      consumeTableData: [],
      consumeTime: '',
    }
  },
  beforeDestroy() {
    this.$bus.offEvent('DATAAUTH_CHANGE')
  },
  async mounted() {
    this.$bus.onEvent('DATAAUTH_CHANGE', value => {
      this.currentDataAuth = value
      this.getData()
    })
    await Promise.all([getDicTypeValue('inquiryType'), getDicTypeValue('dataAuth'), getDicTypeValue('meals')]).then(res => {
      let {0: inquiryType, 1: dataAuth, 2: meals} = res
      this.authDic = dataAuth
      inquiryType.forEach((item, index) => {
        let obj = {}
        obj.label = item.dictValue
        obj.width = 34
        obj.prop = item.dictKey
        this.consumeColumns.push(obj)
      })
      this.meals = meals
      this.currentDataAuth = dataAuth.length ? dataAuth[0].dictKey : ''
      this.getData()
    })


    document.title = '信息公开栏'
  },
  methods: {
    createArr() {
      this.meals.forEach((item, index) => {
        let obj = {}
        this.consumeColumns.forEach((itemIn, indexIn) => {
          if (indexIn === 0) {
            obj[itemIn.prop] = item.dictValue
            obj.mealType = item.dictKey
          } else {
            obj[itemIn.prop] = ''
          }
        })
        this.consumeTableData.push(obj)
      })
    },
    //获得数据
    getData() {
      this.MiXin_searchTable('mealTable')
      this.MiXin_searchTable('foodAccounts')
      this.MiXin_searchTable('inGroup')
      this.MiXin_searchTable('enquiry')
      this.MiXin_searchTable('standard')
      this.MiXin_searchTable('buyingSituation')
      this.MiXin_searchTable('oneWeekRecipe')
      this.MiXin_searchTable('optionTable')
      this.MiXin_searchTable('questionaire')
      this.MiXin_searchTable('other')
      this.getTblProcurementPlanOut()
    },
    //点击跳转
    clickJump() {
      this.$router.push({
        path: '/HomeOrder'
      })
    },
    //提交意见
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let {title, content} = this.OpinionForm
          let params = {content, title}
          opinionAdd(params).then(res => {
            if (+res.code === 200) {
              this.$message.success('意见提交成功')
              this.isShowOpinionDialog = false
            }
          })
        }
      });
    },
    /** 处理日期参数 */
    handleTimeFormat() {
      let item = this.dateActive
      let params = {}
      //昨天的时间
      let day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      let s1 = day1.getFullYear() + "/" + (day1.getMonth() + 1) + "/" + day1.getDate();
      //今天的时间
      let day2 = new Date();
      day2.setTime(day2.getTime());
      let s2 = day2.getFullYear() + "/" + (day2.getMonth() + 1) + "/" + day2.getDate();
      //一周前的时间
      let day3 = new Date();
      day3.setTime(day3.getTime() - 24 * 60 * 60 * 1000 * 7);
      let s3 = day3.getFullYear() + "/" + (day3.getMonth() + 1) + "/" + day3.getDate();

      if (item === '1') {
        params.planTimeStart = s2
        params.planTimeEnd = s2
      } else if (item === '2') {
        params.planTimeStart = s1
        params.planTimeEnd = s1
      } else if (item === '3') {
        params.planTimeStart = s3
        params.planTimeEnd = s2
      }
      return params
    },
    //改变采购情况日期
    changeDate(item) {
      this.dateActive = item.value
      this.MiXin_searchTable('buyingSituation')
    },
    //改变意见类型
    changeOpinionType(item) {
      this.opinionActive = item.value;
      if (item.value === '1') {
        this.MiXin_searchTable('optionTable')
      } else {
        this.MiXin_searchTable('questionaire')
      }
    },
    loadDataOneWeekRecipe(p) {
      let params = {
        pagination: p,
        status: 'published',
        dataAuth: this.currentDataAuth,
      }
      return tblRecipesTotalFindList(params)
    },
    loadDataMealTable(p) {
      let params = {
        pagination: p,
        type: 'diningDiet',
        dataAuth: this.currentDataAuth,
      }
      return contentList(params)
    },
    loadDataFoodAccounts(p) {
      let params = {
        pagination: p,
        status: 'published',
        dataAuth: this.currentDataAuth,
      }
      return tblFoodAccountList(params)
    },
    loadDataInGroup(p) {
      let params = {
        pagination: p,
        status: 'published',
        dataAuth: this.currentDataAuth,
      }
      return tblBoardExpensesList(params)
    },
    loadDataEnquiry(p) {
      let params = {
        pagination: p,
        status: 'published',
        dataAuth: this.currentDataAuth.dictKey,
      }
      return tblInquiryFindGroup(params)
    },
    loadDataStandard(p) {
      let params = {
        pagination: p,
        type: 'quantitativeStandard',
        status: 'published',
        dataAuth: this.currentDataAuth,
      }
      return contentList(params)
    },
    loadDataBuyingSituation(p) {
      let day1 = new Date();
      day1.setTime(day1.getTime());
      let s1 = day1.getFullYear() + "/" + (day1.getMonth() + 1) + "/" + day1.getDate();
      let obj = this.handleTimeFormat()
      let params = {
        pagination: p,
        dataAuth: this.currentDataAuth,
        planTimeStart: (obj ? obj.planTimeStart : s1) + ' 00:00:00',
        planTimeEnd: (obj ? obj.planTimeEnd : '') + ' 23:59:59',
      }
      return tblProcurementPlanProcurement(params)
    },
    loadDataOpinion(p) {
      let params = {
        pagination: p,
        dataAuth: this.currentDataAuth,
        open: 'yes'
      }
      return opinionList(params)
    },
    loadDataQuestionaire(p) {
      let params = {
        pagination: p,
        dataAuth: this.currentDataAuth,
        status: 'published',
      }
      return questionaireList(params)
    },
    getTblProcurementPlanOut() {
      let day1 = new Date();
      let s1 = day1.getFullYear() + "/" + (day1.getMonth() + 1) + "/" + day1.getDate();
      let params = {
        outTimeStart: this.consumeTime ? this.consumeTime : s1 + ' 00:00:00',
        outTimeEnd: this.consumeTime ? this.consumeTime : s1 + ' 23:59:59',
        dataAuth: this.currentDataAuth,
      }
      tblProcurementPlanOut(params).then(res => {
        if (+res.code === 200) {
          if (res.data.length) {
            this.createArr()
            res.data.forEach(item => {
              let obj = this.consumeTableData.find(item2 => item2.mealType === item.meal)
              obj[item.type] = item.total
            })
          } else {
            this.consumeTableData = []
          }
        }
      })
    },
    //点击新窗口打开
    clickNewWin() {
      let day1 = new Date();
      let s1 = day1.getFullYear() + "/" + (day1.getMonth() + 1) + "/" + day1.getDate();
      let url = `/TodayConsumePreview?date=${this.consumeTime ? this.consumeTime : s1}`
      let routeUrl = this.$router.resolve({
        path: url,
      })
      window.open(routeUrl.href, '_blank')
    },
    loadDataOther(p) {
      let params = {
        pagination: p,
        homeOther: true,
        dataAuth: this.currentDataAuth,
      }
      return contentList(params)
    },
    //点击提意见
    clickAdviseBtn() {
      let userInfo = localStorage.getItem('CookBookUserInfo')
      if (userInfo) {
        this.isShowOpinionDialog = true
      } else {
        this.$bus.callEvent('DOLOGIN')
      }
    },
    OpenQuestionModal(row) {
      if (!this.$store.getters.token) {
        this.$bus.callEvent('DOLOGIN')
        return
      }
      let url = `/QuestionPreview?id=${row.id}`
      this.$router.push(url)
    },
    //点击功能跳转(path: 跳转路由)
    clickCommonJump(obj) {
      let url = `${obj.path}?id=${obj.id}`
      let routeUrl = this.$router.resolve({
        path: url,
      })
      window.open(routeUrl.href, '_blank')
    },
    //渲染时间文本
    renderDateTime(time) {
      if (typeof time === 'string') {
        let arr = time.split(' ')
        return arr[0].replace(/\//, '年').replace(/\//, '月') + '日'
      }
    },
    changeConsumeDate() {

    },
  },
}
</script>

<style lang="scss" scoped>
.page-header {
  user-select: none;
  height: 118px;
  line-height: 118px;
  margin: 0 auto;

  img {
    position: relative;
    top: 14px;
  }

  .right-area {
    padding-left: 232px;
  }

  .space {
    width: 161px;
    height: 41px;
    line-height: normal;
  }

  .login-btn {
    display: inline-block;
    width: 140px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #ffffff;
    font-size: 18px;
    background: #53c389;
    border-radius: 6px;
    margin-left: 67px;
  }

  /deep/ .el-input--mini .el-input__inner {
    height: 41px;
    line-height: 40px;
  }
}

.banner-warp {
  height: 300px;
  background: url("../../assets/img/banner.png") no-repeat;
  background-size: 100% 100%;
}

.body-wrap {
  background: url("../../assets/img/homebg.png") no-repeat;
}

.info-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
  padding-top: 70px;

  .title-wrap {
    padding-bottom: 33px;

    .before,
    .after {
      width: 444px;
      height: 4px;
      margin-top: 23px;
      background: #53c389;
    }

    .title {
      padding: 0 25px;
    }
  }

  .one-area {
    padding: 30px 0;
    border-bottom: 1px solid #e0e0e0;

    & > div {
      width: 380px;
    }
  }

  .two-area {
    padding: 30px 0;
    border-bottom: 1px solid #e0e0e0;

    & > div {
      width: 585px;
    }
  }

  .two-area:last-child {
    border-bottom: none;
  }

  .area-title {
    position: relative;
    border-bottom: 2px solid #f29e44;
    margin-bottom: 15px;

    & > div {
      display: inline-block;
      padding: 8px 19px;
      background: #f29e44;
    }

    .edit-icon {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .sub-type {
    padding: 0 17px 14px;

    & > .item {
      cursor: pointer;
      padding: 7px 15px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #888888;
      margin-right: 10px;
      border: 1px solid #cccccc;
    }

    & > .item.active {
      color: #ffffff;
      background: #53c389;
    }
  }
}

.opinion-wrap {
  position: fixed;
  top: 50%;
  right: 0;
  width: 80px;
  height: 85px;
  background: #ffffff;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px 0px 0px 10px;
  text-align: center;
  padding-top: 15px;
}

.body-wrap {

  /deep/ .el-table__header .cell {
    font-size: 18px !important;
  }

}

.thead-td {
  box-sizing: border-box;
  padding: 3px;
  text-align: center;
  width: 34px;
  color: #666666;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  background: rgb(245, 247, 250);
}

.consumeTime-wrap {
  position: relative;
  bottom: 3px;
}
</style>
