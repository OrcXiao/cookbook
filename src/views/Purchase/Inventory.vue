<template>
  <div class="inventory-wrap">
    <my-query-title></my-query-title>
    <my-query
        @searchData="$refs.table.loadData(true)"
        :formConfig="formConfig"
        :formModel="formModel"></my-query>
    <my-table-title></my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns">
      <el-table-column slot="customHandleColumn" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleCheck(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
      <span slot="dataAuth" slot-scope="{text}">
        {{ MiXin_findDictValue(authOptions, text) }}
      </span>
    </my-table>

    <!--    详情-->
    <el-dialog
        :visible.sync="isShowDetailsDialog"
        width="700px">
      <div>
        <div class="fs22 ft-b">
          <span>【{{ dialogType }}】</span>详情
        </div>
        <div class="pd-t20">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClickType">
            <el-tab-pane
                v-for="(item,index) in tabOptions"
                :key="index"
                :label="`按${item.dictValue}日期`" :name="item.dictKey">
            </el-tab-pane>
          </el-tabs>
          <div class="dis-fl">
            <el-date-picker
                @change="handleChangeDate"
                v-model="timeRange"
                type="daterange"
                value-format="yyyy/MM/dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button class="mg-l20" type="primary" @click="clickQuery">查询</el-button>
          </div>
          <div class="pd-t20">

            <el-table
                :data="dialogTableData"
                style="width: 100%;"
                border>
              <el-table-column
                  v-for="(item, index) in dialogTableConfigColumns"
                  :key="index"
                  :label="item.label"
                  align="center"
                  :width="(index+1) === dialogTableConfigColumns.length ? '200px': '' "
                  :prop="item.prop"/>
            </el-table>
            <div class="dis-fl ju-ct">
              <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="RecipeCurrentPage"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getType, tblStockFindDetail, tblStockFindList} from '../../api/Inventory'
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "inventory",
  data() {
    return {
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '品名',
            prop: 'name',
          },
          {
            type: 'input',
            label: '剩余库存低于',
            prop: 'surNums',
            placeholder: '输入0或正整数'
          },
        ]
      },
      formModel: {
        name: '',
        surNums: '',
      },
      columns: [
        {
          label: '伙食单位',
          prop: 'dataAuth',
          slotName: 'dataAuth'
        },
        {
          label: '品名',
          prop: 'name',
        },
        {
          label: '单位',
          prop: 'measures',
        },
        {
          label: '累计计划数量',
          prop: 'planNums',
        },
        {
          label: '累计入库数量',
          prop: 'inNums',
        },
        {
          label: '累计出库数量',
          prop: 'outNums',
        },
        {
          label: '剩余库存数量',
          prop: 'surNums',
        },
      ],
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.formModel)
        return tblStockFindList(params)
      },
      /*
      * 详情
      * */
      isShowDetailsDialog: false,
      activeName: 'plan',
      timeRange: [],
      tabOptions: [],
      dialogTableConfig: {
        plan: {
          columns: [
            {
              label: '计划日期',
              prop: 'date',
            },
            {
              label: '预约数量',
              prop: 'nums',
            },
            {
              label: '单位',
              prop: 'measures',
            },
          ]
        },
        in: {
          columns: [
            {
              label: '入库日期',
              prop: 'date',
            },
            {
              label: '入库数量',
              prop: 'nums',
            },
            {
              label: '单位',
              prop: 'measures',
            },
            {
              label: '经办人',
              prop: 'operator',
            },
            {
              label: '操作人',
              prop: 'createBy',
            },
            {
              label: '操作时间',
              prop: 'createTime',
            },
          ]
        },
        out: {
          columns: [
            {
              label: '出库日期',
              prop: 'date',
            },
            {
              label: '出库数量',
              prop: 'nums',
            },
            {
              label: '单位',
              prop: 'measures',
            },
            {
              label: '经办人',
              prop: 'operator',
            },

            {
              label: '操作人',
              prop: 'createBy',
            },
            {
              label: '操作时间',
              prop: 'createTime',
            },
          ]
        },
      },
      RecipeCurrentPage: 1,
      total: 0,
      dialogTableData: [],
      dialogTableConfigColumns: [],
      currentRowId: '',
      dialogType: '',
      authOptions: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getWarehouseType()
    })
    getDicTypeValue('dataAuth').then(res => {
      this.authOptions = res
    })
  },
  methods: {
    //获取字典项
    getWarehouseType() {
      getType().then(res => {
        if (+res.code === 200) {
          this.tabOptions = res.data;
          this.activeName = res.data[0].dictKey;
        }
      })
    },
    //点击详情
    handleCheck(row) {
      this.dialogType = row.name;
      this.currentRowId = row.id
      this.dialogTableConfigColumns = this.dialogTableConfig[this.activeName].columns;
      this.getDialogTableData()
      this.isShowDetailsDialog = true;
    },
    //点击查询
    clickQuery() {
      this.RecipeCurrentPage = 1;
      this.getDialogTableData()
    },
    //点击分类
    handleClickType() {
      this.timeRange = []
      this.RecipeCurrentPage = 1;
      this.dialogTableConfigColumns = this.dialogTableConfig[this.activeName].columns;
      this.getDialogTableData()
    },
    //点击分页
    handleCurrentChange() {
      this.getDialogTableData()
    },
    //获取弹框表格数据
    getDialogTableData() {
      let params = {
        createTimeStart: this.timeRange && this.timeRange.length ? this.timeRange[0] + ' 00:00:00' : '',
        createTimeEnd: this.timeRange && this.timeRange.length  ? this.timeRange[1] + ' 23:59:59' : '',
        id: this.currentRowId,
        type: this.activeName,
        pagination: {
          pageNum: this.RecipeCurrentPage,
          pageSize: 10,
        }
      }
      tblStockFindDetail(params).then(res => {
        if (+res.code === 200) {
          this.dialogTableData = res.data.map(item => {
            return Object.assign(item, {
              measures: item.inquiryDto ? item.inquiryDto.measures : ''
            })
          })
          this.total = res.pagination.total
        }
      })
    },
    //当时间改变
    handleChangeDate (){
      if(this.timeRange === null){
        this.clickQuery()
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
