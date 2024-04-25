<template>
  <div class="index-wrap">
    <div class="banner-warp cu-pt"></div>
    <div class="content-wrap">
      <div class="query-wrap">
        <div class="query-title">
          <span class="text fs26 cl333333">查询条件</span>
        </div>
        <my-query
            :isFixedWidth="false"
            :isShowBigBtn="true"
            :formConfig="formConfig"
            :formModel="formModel"
            @searchData="searchData">
        </my-query>
      </div>

      <div class="list-wrap query-wrap">
        <div class="query-title dis-fl ju-sb">
          <span class="text fs26 cl333333">菜品列表</span>
          <div>
            <span class="cl333333 fs22">已选择: <span>{{ selectedCuisineTable.length }}</span></span>
            <el-button @click="clickPreView" class="review-btn fs24" type="success">预览</el-button>
            <el-button @click="submit" class="common-query-btn" type="warning">提交点餐</el-button>
          </div>
        </div>
        <div>
          <div class="dis-fl ju-sb">
            <div class="item-box">
              <el-table
                  class="cuisine-table"
                  :header-cell-style="{background:'#F4F4F4',textAlign:'center'}"
                  border
                  :row-style="{height: '40px'}"
                  :data="tableData1"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="name"
                    show-overflow-tooltip
                    label="菜品名称">
                  <template slot-scope="{row}">
                    <span v-if="!row.pic">{{ row.name }}</span>
                    <span v-else @click="clickName(row)" class="cu-pt td-ul">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    prop="type"
                    label="菜品分类">
                  <template slot-scope="scope">
                    {{ renderTypeText(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    prop="reclassify"
                    label="二级分类">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    width="120px"
                    label="口味">
                  <template slot-scope="scope">
                    <div v-if="scope.row.radioArr.length">
                      <el-radio-group @change="changeRowRadio(scope.row)" v-model="scope.row.radioVal">
                        <div v-for="(item,index) in scope.row.radioArr"
                             :key="index"
                             style="line-height: 20px">
                          <el-radio :label="item">
                            {{ item }}
                          </el-radio>
                        </div>
                      </el-radio-group>
                    </div>
                    <div class="te-ct" v-else>
                      {{ scope.row.remark }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    prop="nums"
                    label="近7天人气度">
                </el-table-column>
                <el-table-column
                    width="100px"
                    align="center"
                    prop="date"
                    label="将菜品添加到下周菜谱">
                  <template slot-scope="scope">
                    <el-checkbox
                        :disabled="isDisabled"
                        @change="changeIsSelect(scope.row)"
                        v-model="scope.row.isSelected">选择
                    </el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="item-box">
              <el-table
                  class="cuisine-table"
                  :header-cell-style="{background:'#F4F4F4',textAlign: 'center'}"
                  border
                  :row-style="{height: '40px'}"
                  :data="tableData2"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="name"
                    label="菜品名称">
                  <template slot-scope="{row}">
                    <span v-if="!row.pic">{{ row.name }}</span>
                    <span v-else @click="clickName(row)" class="cu-pt td-ul">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="type"
                    width="80px"
                    label="菜品分类">
                  <template slot-scope="scope">
                    {{ renderTypeText(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    prop="reclassify"
                    label="二级分类">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    width="120px"
                    label="口味">
                  <template slot-scope="scope">
                    <div v-if="scope.row.radioArr.length">
                      <el-radio-group @change="changeRowRadio(scope.row)" v-model="scope.row.radioVal">
                        <div v-for="(item,index) in scope.row.radioArr"
                             :key="index"
                             style="line-height: 20px">
                          <el-radio :label="item">
                            {{ item }}
                          </el-radio>
                        </div>
                      </el-radio-group>
                    </div>
                    <div class="te-ct" v-else>
                      {{ scope.row.remark }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    prop="nums"
                    label="近7天人气度">
                </el-table-column>
                <el-table-column
                    width="100px"
                    align="center"
                    prop="date"
                    label="将菜品添加到下周菜谱">
                  <template slot-scope="scope">
                    <el-checkbox
                        :disabled="isDisabled"
                        @change="changeIsSelect(scope.row)"
                        v-model="scope.row.isSelected">选择
                    </el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="dis-fl ju-ct">
            <el-pagination
                @current-change="TableChangePage"
                :current-page="TableCurrentPage"
                :page-size="TablePageSize"
                layout="total, prev, pager, next"
                :total="TableTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
        width="700px"
        title="已点菜品预览"
        :visible.sync="isShowSelectedCuisineDialog">
      <el-table
          :header-cell-style="{background:'#F4F4F4'}"
          border
          :data="selectedCuisineTable"
          style="width: 100%">
        <el-table-column prop="name" label="菜品名称"></el-table-column>
        <el-table-column prop="type" label="菜品分类">
          <template slot-scope="scope">
            {{ renderType(scope.row.type) }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowSelectedCuisineDialog = false">取 消</el-button>
        <el-button @click="submit" type="warning">提交点餐</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="预览"
        :visible.sync="isShowPreView"
    >
      <div class="img-wrap te-ct">
        <img class="wd100 hg100" :src="imgUrl" alt="">
      </div>
      <div class="dis-fl ju-ct pd-t10">
        <el-button type="primary" @click="isShowPreView = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getDicTypeValue} from '@/utils/dicMap'
import {tblFoodFindList,} from '../../api/Cuisine'
import {onlineOrderOrder, onlineOrderList} from '@/api/OnlineOrder'

let base = process.env.VUE_APP_BASE_IMAGE

export default {
  name: "HomeOrder",
  components: {},
  data() {
    return {
      base,
      formModel: {
        name: '',
        type: '',
        reclassify: '',
        remark: '',
      },
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '菜品名称',
            prop: 'name',
          },
          {
            type: 'select',
            label: '菜品分类',
            prop: 'type',
            options: [],
            opLabel: 'dictValue',
            opValue: 'dictKey',
            changeEvent: this.selectChange
          },
          {
            type: 'input',
            label: '二级分类',
            prop: 'reclassify',
          },
          {
            type: 'input',
            label: '口味',
            prop: 'remark',
          },
        ]
      },

      CuisineOptions: [],
      //菜品列表
      tableData: [],
      //已点菜品表格
      selectedCuisineTable: [],
      isShowSelectedCuisineDialog: false,
      TableTotal: 0,
      TablePageSize: 50,
      TableCurrentPage: 1,
      isDisabled: false,
      //提交点餐
      alreadyOrderList: [],
      isShowPreView: false,
      imgUrl: '',

      tableData1: [],
      tableData2: [],
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.user
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getDic()
      this.getTableData()
      document.title = '信息公开栏'
    })
  },
  methods: {
    //获取码表
    getDic() {
      Promise.all([getDicTypeValue('foodType')]).then(res => {
        let {
          0: foodType,
        } = res
        this.CuisineOptions = foodType
        this.formConfig.forms[1].options = foodType
      })
    },
    searchData(obj) {
      this.formModel = obj
      this.TableCurrentPage = 1
      this.getTableData()
    },
    getTableData() {
      let params = {
        pagination: {
          pageNum: this.TableCurrentPage,
          pageSize: this.TablePageSize,
        },
        name: this.formModel.name,
        type: this.formModel.type,
        remark: this.formModel.remark,
        reclassify: this.formModel.reclassify,
        status: 'valid',
        orderBy: 'sevenNums'
      }
      tblFoodFindList(params).then(res => {
        if (+res.code === 200) {
          res.data.forEach(item => {
            item.isDisabled = false
            item.isSelected = false
            if (item.remark && item.remark.includes('|')) {
              item.radioArr = item.remark.split('|')
            } else {
              item.radioArr = []
            }
            item.radioVal = null
          })
          this.TableTotal = res.pagination.total
          let arr = Object.assign([], res.data)
          if (arr.length === 0) {
            this.tableData1 = []
            this.tableData2 = []
          } else if (arr.length > (this.TablePageSize / 2)) {
            this.tableData1 = arr.slice(0, (this.TablePageSize / 2))
            this.tableData2 = arr.slice((this.TablePageSize / 2), arr.length)
          } else if (arr.length <= (this.TablePageSize / 2)) {
            this.tableData1 = arr
            this.tableData2 = []
          }
          this.isLoading = false
          this.getOnlineOrderList()
        }
      })
    },
    //获得点餐记录
    getOnlineOrderList() {
      this.alreadyOrderList = []
      let params = {
        createTimeStart: this.getMonday(),
        sysUserId: this.userInfo.id
      }
      onlineOrderList(params).then(res => {
        if (+res.code === 200) {
          this.alreadyOrderList.push(...res.data)
          if (res.data.length) {
            this.isDisabled = true;
            this.selectedCuisineTable = res.data
          }
        }
      })
    },

    TableChangePage(val) {
      this.TableCurrentPage = val
      this.getTableData()
    },
    clickPreView() {
      this.isShowSelectedCuisineDialog = true;
    },
    changeIsSelect(row) {
      if (row.radioArr.length) {
        if (!row.radioVal) {
          this.$message.warning('请选择口味')
          return false
        }
      }
      if (row.isSelected) {
        this.selectedCuisineTable.push(row)
      } else {
        this.selectedCuisineTable = this.selectedCuisineTable.filter(item => item.id !== row.id)
      }
    },
    renderTypeText(row) {
      let type = this.CuisineOptions.find(item => item.dictKey === row.type)
      return type ? type.dictValue : '/'
    },
    submit() {
      if (this.alreadyOrderList.length) {
        return this.$alert('本周已提交过点餐，不能重复提交', '操作提示', {
          confirmButtonText: '知道了',
        });
      }
      if (this.selectedCuisineTable.length === 0) {
        this.$message.warning('请选择菜品')
        return
      }
      let arr = []
      let state = true
      this.selectedCuisineTable.forEach(item => {
        if (item.radioArr.length) {
          if (!item.radioVal) {
            state = false
          }
        }
        if (item.radioVal) {
          arr.push({
            id: item.id,
            remark: item.radioVal
          })
        } else {
          arr.push({
            id: item.id,
            remark: item.remark,
          })
        }
      })
      if (!state) {
        this.$message.warning('请选择口味')
        return
      }
      onlineOrderOrder(arr).then(res => {
        if (+res.code === 200) {
          this.$message.success('提交成功')
          this.isShowSelectedCuisineDialog = false
        }
      })
    },
    //获取周一
    getMonday() {
      let nowDate = new Date();
      let nowTime = nowDate.getTime();
      let day = nowDate.getDay() || 7;
      let oneDayTime = 24 * 60 * 60 * 1000;
      let Monday = nowTime - (day - 1) * oneDayTime;
      let mondayTime = new Date(Monday);
      let year = mondayTime.getFullYear();
      let monMath = mondayTime.getMonth() + 1;
      let month = (monMath < 10) ? "0" + "" + monMath + "" : monMath;
      let data = (mondayTime.getDate() < 10) ? "0" + "" + mondayTime.getDate() + "" : mondayTime.getDate();
      return "" + year + "/" + month + "/" + data + " 00:00:00";
    },
    //渲染菜品分类
    renderType(type) {
      let option = this.CuisineOptions.find(item => {
        return item.dictKey === type
      })
      return option ? option.dictValue : '';
    },
    clickName(row) {
      this.imgUrl = ''
      this.isShowPreView = true

      this.$nextTick(() => {
        this.imgUrl = base + '/' + row.pic
      })
    },
    //二级分类下拉框改变时
    selectChange(val) {
      this.formModel.reclassify = ''
      if (val === 'huncai') {
        this.formConfig.forms[2] = {
          type: 'select',
          label: '二级分类',
          prop: 'reclassify',
          options: [
            {
              dictValue: '猪肉类',
              dictKey: '猪肉类',
            },
            {
              dictValue: '牛肉类',
              dictKey: '牛肉类',
            },
            {
              dictValue: '羊肉类',
              dictKey: '羊肉类',
            },
            {
              dictValue: '鸡肉类',
              dictKey: '鸡肉类',
            },
            {
              dictValue: '鸭肉类',
              dictKey: '鸭肉类',
            },
            {
              dictValue: '水产肉类',
              dictKey: '水产肉类',
            },
          ],
          opLabel: 'dictValue',
          opValue: 'dictKey',
        }
      } else if (val === 'shucai') {
        this.formConfig.forms[2] = {
          type: 'select',
          label: '二级分类',
          prop: 'reclassify',
          options: [
            {
              dictValue: '时令蔬菜',
              dictKey: '时令蔬菜',
            },
            {
              dictValue: '叶菜类',
              dictKey: '叶菜类',
            },
            {
              dictValue: '根茎类',
              dictKey: '根茎类',
            },

          ],
          opLabel: 'dictValue',
          opValue: 'dictKey',
        }
      } else {
        this.formConfig.forms[2] = {
          type: 'input',
          label: '二级分类',
          prop: 'reclassify',
        }
      }
    },
    changeRowRadio(row) {
      row.isSelected = false
    },

  },
}
</script>

<style lang="scss" scoped>

.banner-warp {
  height: 300px;
  background: url("../../assets/img/orderbg.png") no-repeat;
  background-size: 100% 100%;
}

.content-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 65px;

  .query-wrap {
    padding-top: 30px;

    & > .query-title {
      .text:before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 20px;
        background: #53C389;
        border-radius: 5px;
        margin-right: 5px;
      }

    }
  }

  .list-wrap {
    .review-btn {
      margin-left: 30px;
      margin-right: 30px;
    }

    .cuisine-table {
      margin-top: 29px;


      /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #000000;
      }

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #53C389;
        border-color: #53C389;
      }

      /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #53C389;
      }

    }
  }
}

.item-box {
  width: 49%;
}

.img-wrap {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

</style>
