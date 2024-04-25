<template>
  <!-- 在线点餐 -->
  <div class="OnlineOrder-wrap">
    <div class="banner-warp"></div>
    <my-query isShowBigBtn @searchData='searchData' :formConfig="formConfig" :formModel="formModel"></my-query>
    <div class="btns-wrapper dis-fl">
      <span class="ft-b">已选择：{{ allSelectedFood.length }}</span>
      <el-button class="mg-l10" @click="preview" type="success">预览</el-button>
      <el-button type="warning" @click="submit" :loading='loading'>提交点餐</el-button>
    </div>
    <preview ref="preview"/>
    <div v-loading="isLoading" class="table-wrap pd-t10">
      <div class="table-box">
        <el-table
            border
            :header-cell-style="{background:'#f5f7fa','text-align':'center'}"
            :data="tableData1"
            style="width: 100%">
          <el-table-column
              prop="name"
              align="center"
              show-overflow-tooltip
              label="菜品名称"
              width="100px">
            <template slot-scope="{row}">
              <span v-if="!row.pic">{{ row.name }}</span>
              <span v-else @click="clickName(row)" class="cu-pt td-ul">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="菜品分类"
              width="80px">
            <template slot-scope="{row}">
              {{ MiXin_findDictValue(foodTypeDic, row.type) }}
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
              width="80px"
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
              prop="sevenNums"
              align="center"
              width="80px"
              label="近7天人气度">
          </el-table-column>
          <el-table-column
              align="center"
              label="将菜品添加到下周食谱">
            <template slot-scope="{row}">
              <el-checkbox @change="selectChange(row)" v-model="row.checked">选择</el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-box">
        <el-table
            border
            :header-cell-style="{background:'#f5f7fa','text-align':'center'}"
            :data="tableData2"
            style="width: 100%">
          <el-table-column
              prop="name"
              align="center"
              show-overflow-tooltip
              label="菜品名称"
              width="100px">
            <template slot-scope="{row}">
              <span v-if="!row.pic">{{ row.name }}</span>
              <span v-else @click="clickName(row)" class="cu-pt td-ul">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="菜品分类"
              width="80px">
            <template slot-scope="{row}">
              {{ MiXin_findDictValue(foodTypeDic, row.type) }}
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
              width="80px"
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
              prop="sevenNums"
              align="center"
              width="80px"
              label="近7天人气度">
          </el-table-column>
          <el-table-column
              align="center"
              label="将菜品添加到下周食谱">
            <template slot-scope="{row}">
              <el-checkbox @change="selectChange(row)" v-model="row.checked">选择</el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="TableCurrentPage"
          :page-size="TablePageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TablePageTotal">
      </el-pagination>
    </div>


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
let base = process.env.VUE_APP_BASE_IMAGE
import preview from './components/onlineOrderPreview.vue'
import {tblFoodFindList} from '@/api/Cuisine'
import {onlineOrderOrder} from '@/api/OnlineOrder'
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "OnlineOrder",
  components: {preview},
  data() {
    return {
      base,
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
            changeEvent: this.FormSelectChange
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
      formModel: {
        name: '',
        type: '',
        reclassify: '',
        remark: '',
        status: 'valid',
      },
      selectedFood: [],
      allSelectedFood: [], //存储总选择
      foodTypeDic: [],
      loading: false,
      isLoading: false,
      tableData1: [],
      tableData2: [],
      TableCurrentPage: 1,
      TablePageSize: 50,
      TablePageTotal: 0,
      isShowPreView: false,
      imgUrl: ''
    }
  },
  mounted() {
    getDicTypeValue('foodType').then(data => {
      this.foodTypeDic = data
      this.formConfig.forms.find(item => item.prop === 'type').options = data.map(item => {
        return {
          label: item.dictValue,
          value: item.dictKey
        }
      })

      this.getTableData()
    })
  },
  methods: {
    searchData() {
      this.selectedFood.splice(0)
      this.allSelectedFood.splice(0)
      // this.MiXin_searchTable("table")
      this.getTableData()
    },
    selectChange(row) {
      if (row.radioArr.length) {
        if (!row.radioVal) {
          this.$message.warning('请选择口味')
          return false
        }
      }
      if (row.checked) {
        this.selectedFood.push(row)
        this.allSelectedFood.push(row)
      } else {
        let sI = this.selectedFood.findIndex(item => item.id === row.id)
        let asI = this.allSelectedFood.findIndex(item => item.id === row.id)
        sI >= 0 && (this.selectedFood.splice(sI, 1))
        asI >= 0 && (this.allSelectedFood.splice(asI, 1))
      }
    },
    submit() {
      const vm = this
      if (!vm.allSelectedFood.length) return vm.$message.warning('请选择菜品')
      vm.loading = true
      let arr = []
      let state = true
      this.allSelectedFood.forEach(item => {
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


      onlineOrderOrder(arr).then(() => {
        vm.$message.success('点餐成功')
        this.isShowSelectedCuisineDialog = false
        vm.searchData()
      }).finally(() => {
        vm.loading = false
      })
    },
    preview() {
      this.$refs.preview && this.$refs.preview.init(this.allSelectedFood)
    },
    getTableData() {
      this.isLoading = true
      let params = {
        pagination: {
          pageNum: this.TableCurrentPage,
          pageSize: this.TablePageSize,
        },
        name: this.formModel.name,
        type: this.formModel.type,
        reclassify: this.formModel.reclassify,
        remark: this.formModel.remark,
        status: 'valid',
        orderBy: 'sevenNums'
      };
      tblFoodFindList(params).then(res => {
        this.TablePageTotal = res.pagination.total
        res.data.forEach(item => {
          item.checked = this.allSelectedFood.map(item => item.id).indexOf(item.id) >= 0
          if (item.remark && item.remark.includes('|')) {
            item.radioArr = item.remark.split('|')
          } else {
            item.radioArr = []
          }
          item.radioVal = null
        })
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

      })
    },
    handleSizeChange(val) {
      this.TablePageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.TableCurrentPage = val
      this.getTableData()
    },
    clickName(row) {
      this.imgUrl = ''
      this.isShowPreView = true

      this.$nextTick(() => {
        this.imgUrl = base + '/' + row.pic
      })
    },
    FormSelectChange(val) {
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

  }
}
</script>

<style lang="scss" scoped>
.btns-wrapper {
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  background: rgba(255, 248, 230, 1);
  padding-right: 10px;
}

.banner-warp {
  height: 224px;
  background: url("../../assets/img/orderbg.png") no-repeat;
  background-size: cover;
}

.table-wrap {
  display: flex;
  justify-content: space-between;

  .table-box {
    width: 49%;
  }
}

.el-pagination {
  padding: 20px 0 0;
}

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
  background: transparent;
  border: 1px solid #E0E0E0;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #53C389;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #53C389;
}

.el-pagination.is-background .el-pager li:not(.disabled).active:hover {
  color: #ffffff;
}

.img-wrap {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>
