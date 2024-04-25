<template>
  <div class="Purchase-wrap">
    <my-query-title></my-query-title>
    <my-query
        :formConfig="formConfig"
        :formModel="formModel"
        @searchData="$refs.table.loadData(true)">
    </my-query>
    <my-table-title>
      <template v-slot:btns>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i>新增
        </el-button>
      </template>
    </my-table-title>
    <my-table @postTableData="postTableData" ref="table" :data="loadData" :columns="columns">
      <template slot="renderStatus" slot-scope="scope">
        {{ mixin_renderStatusText(scope.row) }}
      </template>
      <template slot="dataAuth" slot-scope="{text}">
        {{ MiXin_findDictValue(authOptions, text) }}
      </template>
      <template slot="appendTotal">
        <div class="dis-fl total-wrap mg-t20 pd-l20 clffffff">
          合计 : <span class="pd-l10 pd-r10">{{ summation }}</span>元,
          浮动比例:
          <el-input v-model="proportion" @input="changeProportion" class="width200 mg-l10 mg-r10"
                    placeholder="输入0-1, 比如0.95"></el-input>
          ,
          实际金额 <span class="pd-l10 pd-r10">{{ practical }}</span>元
        </div>
      </template>
      <el-table-column slot="customHandleColumn" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleCheck(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.status === 'published'" type="text" size="small"
                     @click="handleEnterRoom(scope.row)">入库
          </el-button>
          <el-button v-if="scope.row.status === 'published'" type="text" size="small"
                     @click="handleGetOutRoom(scope.row)">出库
          </el-button>
          <el-button v-if="scope.row.status === 'unpublished'" type="text" size="small"
                     @click="handleRelease(scope.row)">发布
          </el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </my-table>

    <!--    新增/编辑采购计划-->
    <el-dialog
        :visible.sync="isShowProcurementPlaneDialog"
        :title="`${currentHandleType === 'add' ? '新增': '修改'}采购计划`"
        width="700px"
        @close="MiXin_closeDialog('ProcurementPlaneForm')">
      <div>
        <el-form
            ref="ProcurementPlaneForm"
            :model="ProcurementPlaneForm"
            :rules="ProcurementPlaneRules"
            label-width="110px">
          <el-form-item label="计划日期 :" prop="date">
            <el-date-picker
                @change="changeDate"
                v-model="ProcurementPlaneForm.date"
                type="date"
                :disabled="currentHandleType === 'edit'"
                value-format="yyyy/MM/dd"
                placeholder="请选择计划日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="伙食单位 :">
            <span>{{ MiXin_findDictValue(authOptions, userInfo.dataAuth) }}</span>
          </el-form-item>
          <el-form-item label="添加采购内容 :">
            <div>
              <div class="dis-fl ju-ed pd-b20">
                <el-button type="primary" @click="addItem">添加采购项</el-button>
              </div>
              <div>
                <el-table
                    border
                    highlight-current-row
                    :header-cell-style="{'text-align':'center'}"
                    :data="ProcurementPlaneForm.ProcurementPlaneTableData"
                    style="width: 100%">
                  <el-table-column
                      label="名称">
                    <template slot-scope="scope">
                      <div>
                        <el-select
                            filterable
                            @focus="focusNameSelect"
                            @change="changNameSelect(scope.$index)"
                            v-model="scope.row.tblInquiryId"
                            placeholder="请选择">
                          <el-option
                              v-for="item in nameOptions"
                              :key="item.value"
                              :label="item.name"
                              :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      label="计划数量">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.planNums" placeholder="请输入"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="unit"
                      width="50"
                      label="单位">
                  </el-table-column>
                  <el-table-column
                      prop="price"
                      width="80"
                      label="单价">
                    <template slot-scope="scope">
                      <span>{{ (scope.row.price + '') ? scope.row.price.toFixed(2) : '' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="remark"
                      label="备注">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" placeholder="请输入"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                      width="50"
                      label="操作">
                    <template slot-scope="scope">
                      <div class="te-ct">
                        <i @click="clickRemovePlaneItem(scope.$index)"
                           class="el-icon-delete clf56c6c cu-pt"></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div>
          <span class="cl409eff fs12">找不到名称？</span>
          <span class="fs12">请前往询价管理配置</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ProcurementPlaneForm')">
          {{ currentHandleType === 'add' ? '确认新增' : '提交修改' }}
        </el-button>
        <el-button @click="isShowProcurementPlaneDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--    入库-->
    <el-dialog
        :visible.sync="isShowEnquiryDialog"
        width="1000px">
      <div>
        <div class="fs26 ft-b">【{{ MiXin_findDictValue(authOptions, CheckObj.dataAuth) }}】采购计划-入库</div>
        <div class="pd-t20">
          <el-row>
            <el-col :span="5">
              <div>计划日期: <span>{{ CheckObj.date }}</span></div>
            </el-col>
            <el-col :span="3">
              <div>创建人: <span>{{ CheckObj.createBy }}</span></div>
            </el-col>
            <el-col :span="6">
              <div>更新日期: <span>{{ CheckObj.createTime }}</span></div>
            </el-col>
            <el-col :span="5">
              <div>当前状态: <span>{{ CheckObj.status === 'published' ? '已发布' : '未发布' }}</span></div>
            </el-col>
          </el-row>
        </div>
        <div class="pd-t20">
          <my-table
              :showIndex="true"
              :showPagination="false"
              :tableData="CheckTableData"
              :columns="EnquiryTableColumns">
            <template slot="nums" slot-scope="scope">
              <el-input v-model="scope.row.nums" placeholder="请输入"/>
            </template>
          </my-table>
        </div>
        <div class="pd-t20 dis-fl">
          <el-date-picker
              v-model="EnquiryTime"
              value-format="yyyy/MM/dd HH:mm:ss"
              type="datetime"
              placeholder="请选择入库日期">
          </el-date-picker>
          <el-input class="width200 mg-l20" v-model="EnquiryResponsiblePerson" placeholder="请输入经办人"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEnterRoom">确认入库</el-button>
        <el-button @click="isShowEnquiryDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--    出库-->
    <el-dialog
        :visible.sync="isShowInventoryDialog"
        width="1000px">
      <div>
        <div class="fs26 ft-b">【{{ MiXin_findDictValue(authOptions, CheckObj.dataAuth) }}】采购计划-出库</div>
        <div class="pd-t20">
          <el-row>
            <el-col :span="5">
              <div>计划日期: <span>{{ CheckObj.date }}</span></div>
            </el-col>
            <el-col :span="3">
              <div>创建人: <span>{{ CheckObj.createBy }}</span></div>
            </el-col>
            <el-col :span="6">
              <div>更新日期: <span>{{ CheckObj.createTime }}</span></div>
            </el-col>
            <el-col :span="5">
              <div>当前状态: <span>{{ CheckObj.status === 'published' ? '已发布' : '未发布' }}</span></div>
            </el-col>
          </el-row>
        </div>
        <div class="pd-t20">
          <my-table
              :showIndex="true"
              :showPagination="false"
              :tableData="CheckTableData"
              :columns="InventoryTableColumns">
            <template slot="renderType" slot-scope="scope">
              {{ renderType(scope.row) }}
            </template>
            <template slot="nums" slot-scope="scope">
              <el-input v-model="scope.row.nums" placeholder="请输入"/>
            </template>
            <template slot="threeMeals" slot-scope="scope">
              <el-select v-model="scope.row.meal" placeholder="请选择">
                <el-option
                    v-for="item in threeMealsOptions"
                    :key="item.value"
                    :label="item.dictValue"
                    :value="item.dictKey">
                </el-option>
              </el-select>
            </template>
          </my-table>
        </div>
        <div class="pd-t20">
          <el-date-picker
              value-format="yyyy/MM/dd HH:mm:ss"
              v-model="InventoryTime"
              type="datetime"
              placeholder="请选择出库日期">
          </el-date-picker>
          <el-input class="width200 mg-l20" v-model="InventoryResponsiblePerson" placeholder="请输入经办人"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOutRoom('ProcurementPlaneForm')">确 定</el-button>
        <el-button @click="isShowInventoryDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 提醒弹框-->
    <el-dialog
        :visible.sync="isShowHintDialog"
        title="操作提示"
        width="400px">
      <div class="te-ct pd20">
        根据计划日期自动匹配询价，请先选择计划日期
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowHintDialog = false">知道了</el-button>
      </div>
    </el-dialog>

    <!--    查看-->
    <el-dialog
        :visible.sync="isShowCheckDialog"
        width="1000px">
      <div>
        <div class="fs26 ft-b">【{{ MiXin_findDictValue(authOptions, CheckObj.dataAuth) }}】采购计划</div>
        <div class="pd-t20">
          <el-row>
            <el-col :span="5">
              <div>计划日期: <span>{{ CheckObj.date }}</span></div>
            </el-col>
            <el-col :span="5">
              <div>创建人: <span>{{ CheckObj.createBy }}</span></div>
            </el-col>
            <el-col :span="5">
              <div>更新日期: <span>{{ CheckObj.createTime }}</span></div>
            </el-col>
            <el-col :span="4">
              <div>当前状态: <span>{{ CheckObj.status === 'published' ? '已发布' : '未发布' }}</span></div>
            </el-col>
            <el-col :span="5">
              <el-button @click="clickAppoint" type="success">预约验收单</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="pd-t20 pd-b30">
          <my-table
              :tableData="CheckTableData"
              :showPagination="false"
              :columns="CheckTableColumns">
          </my-table>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {
  tblProcurementPlanFindList,
  tblProcurementPlanAdd,
  tblProcurementPlanChangeStatus,
  tblProcurementPlanFindById,
  tblProcurementPlanHousing,
  tblProcurementPlanUpdate, tblProcurementPlanDelById,
} from "../../api/Purchase";
import validate from '../../validate'
import {tblInquiryFindList} from "../../api/Enquiry";
import {getDicTypeValue} from '@/utils/dicMap'
import renderText from "../../mixins/renderText";

export default {
  name: "Purchase",
  mixins: [renderText],
  data() {
    return {
      formConfig: {
        forms: [
          {
            type: 'daterange',
            label: '计划日期',
            prop: 'planTime',
          },
          {
            type: 'input',
            label: '创建人',
            prop: 'createBy',
          },
          {
            type: 'select',
            label: '当前状态',
            prop: 'status',
            options: [
              {
                label: '未发布',
                value: 'unpublished',
              },
              {
                label: '已发布',
                value: 'published ',
              },
            ],
          },
          {
            type: 'daterange',
            label: '创建日期',
            prop: 'createTime',
          },
        ]
      },
      formModel: {
        planTime: '',
        status: '',
        createBy: '',
        createTime: '',
      },
      columns: [
        {
          label: '计划日期',
          prop: 'date',
        },
        {
          label: '伙食单位',
          prop: 'dataAuth',
          slotName: 'dataAuth'
        },
        {
          label: '当前状态',
          slotName: 'renderStatus'
        },
        {
          label: '合计(元)',
          prop: 'sum',
        },
        {
          label: '创建人',
          prop: 'createBy',
        },
        {
          label: '创建日期',
          prop: 'createTime',
        },
      ],
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.formModel)
        if (params['planTime']) {
          params['planTimeStart'] = params['planTime'][0] + ' 00:00:00'
          params['planTimeEnd'] = params['planTime'][1] + ' 23:59:59'
        }
        delete params.planTime
        if (params['createTime']) {
          params['createTimeStart'] = params['createTime'][0] + ' 00:00:00'
          params['createTimeEnd'] = params['createTime'][1] + ' 23:59:59'
        }
        delete params.createTime

        return tblProcurementPlanFindList(params)
      },
      tableData: [],
      ProcurementPlaneForm: {
        date: '',
        ProcurementPlaneTableData: [],
      },
      ProcurementPlaneRules: {
        date: [
          validate.NotNull({name: '计划日期'})
        ]
      },
      currentHandleType: '',
      currentHandleRowId: '',
      /*
      * 采购计划弹框
      * */
      isShowProcurementPlaneDialog: false,
      options: [],
      /*
      * 入库
      * */
      isShowEnquiryDialog: false,
      EnquiryTableColumns: [
        {
          label: '名称',
          prop: 'name',
        },
        {
          label: '单位',
          prop: 'measures'
        },
        {
          label: '计划数量',
          prop: 'planNums'
        },
        {
          label: '已实收数量',
          prop: 'inNums'
        },
        {
          label: '实收数量',
          slotName: 'nums'
        },
        {
          label: '备注',
          prop: 'remark'
        },
      ],
      //入库日期
      EnquiryTime: '',
      //入库经办人
      EnquiryResponsiblePerson: '',

      /*
      * 出库
      * */
      isShowInventoryDialog: false,
      InventoryTableColumns: [
        {
          label: '名称',
          prop: 'name',
        },
        {
          label: '分类',
          slotName: 'renderType'
        },
        {
          label: '单位',
          prop: 'measures'
        },
        {
          label: '实收数量',
          prop: 'inNums'
        },
        {
          label: '已出库数量',
          prop: 'outNums'
        },
        {
          label: '出库数量',
          slotName: 'nums'
        },
        {
          label: '三餐',
          slotName: 'threeMeals'
        },
        {
          label: '备注',
          prop: 'remark'
        },
      ],
      //出库日期
      InventoryTime: '',
      //出库经办人
      InventoryResponsiblePerson: '',

      /*
      * 提醒弹框
      * */
      isShowHintDialog: false,
      /*
      * 其他
      * */
      nameOptions: [],
      /*
      * 查看
      * */
      isShowCheckDialog: false,
      CheckTableData: [],
      CheckTableColumns: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '计划数量',
          prop: 'planNums'
        },
        {
          label: '入库数量',
          prop: 'inNums'
        },
        {
          label: '出库量',
          prop: 'outNums'
        },
        {
          label: '单位',
          prop: 'measures'
        },
        {
          label: '单价(元)',
          prop: 'ave',
          renderTextFun: function (row) {
            return row ? parseFloat(row.ave).toFixed(2) : ''
          }
        },
        {
          label: '合计',
          prop: 'total',
          renderTextFun: function (row) {
            return row ? parseFloat(row.total).toFixed(2) : ''
          }
        },
        {
          label: '备注',
          prop: 'remark'
        },
      ],
      CheckObj: {},
      inquiryTypeOptions: [],
      threeMealsOptions: [],
      authOptions: [],
      summation: '--',
      practical: '--',
      proportion: '',
    }
  },
  computed: {
    userInfo: function () {
      return this.$store.getters.user
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
      Promise.all([getDicTypeValue('inquiryType'), getDicTypeValue('meals'), getDicTypeValue('dataAuth')]).then(res => {
        let {
          0: inquiryType,
          1: meals,
          2: auth
        } = res
        this.inquiryTypeOptions = inquiryType
        this.threeMealsOptions = meals
        this.authOptions = auth
      })
    },
    //点击新增
    handleAdd() {
      this.currentHandleType = 'add'
      this.isShowProcurementPlaneDialog = true;
    },
    addItem() {
      if (!this.ProcurementPlaneForm.date) {
        return this.isShowHintDialog = true
      }
      this.ProcurementPlaneForm.ProcurementPlaneTableData.push({
        tblInquiryId: '',
        planNums: '',
        unit: '',
        price: '',
        remark: '',
      })
    },
    //点击查看
    handleCheck(row) {
      this.getPlanDetails(row.id, 'check')
    },
    //点击出库
    handleGetOutRoom(row) {
      this.getPlanDetails(row.id, 'out')
    },
    //点击入库
    handleEnterRoom(row) {
      this.getPlanDetails(row.id, 'in')
    },
    //点击修改
    handleEdit(row) {
      this.getPlanDetails(row.id, 'edit')
    },
    //获取计划详情,
    getPlanDetails(id, type) {
      tblProcurementPlanFindById(id).then(async res => {
        if (+res.code === 200) {
          this.CheckObj = res.data
          await res.data.planDetails.forEach(item => {
            item.name = item.inquiryDto.name
            item.measures = item.inquiryDto.measures
            item.ave = item.inquiryDto.ave
            item.type = item.inquiryDto.type
          })
          this.CheckTableData = res.data.planDetails;
          if (type === 'check') {
            this.currentHandleRowId = id
            this.isShowCheckDialog = true;
          } else if (type === 'in') {
            this.isShowEnquiryDialog = true;
            this.EnquiryTime = '';
            this.EnquiryResponsiblePerson = '';
          } else if (type === 'out') {
            this.isShowInventoryDialog = true;
            this.InventoryTime = '';
            this.InventoryResponsiblePerson = '';
          } else if (type === 'edit') {
            this.currentHandleType = 'edit'
            this.currentHandleRowId = id
            this.isShowProcurementPlaneDialog = true;
            this.ProcurementPlaneForm.date = res.data.date
            await this.changeDate()
            let arr = []
            res.data.planDetails.forEach(item => {
              arr.push({
                tblInquiryId: item.inquiryDto.id,
                unit: item.inquiryDto.measures,
                price: item.inquiryDto.ave,
                planNums: item.planNums,
                remark: item.remark,
              })
            })
            this.ProcurementPlaneForm.ProcurementPlaneTableData = arr
          }
        }
      })
    },
    //提交入库
    submitEnterRoom() {
      let state = true;
      let list = this.CheckTableData.filter(item => !(item.nums === '' || item.nums === undefined))
      list.forEach(item => {
        if (isNaN(item.nums)) {
          state = false
        }
      })
      if (!list.length) {
        return this.$message.warning('请完善入库数据')
      }
      if (!state) {
        return this.$message.warning('请输入正确的数字')
      }
      if (!this.EnquiryTime || !this.EnquiryTime.length) {
        return this.$message.warning('请选择入库日期')
      }
      if (!this.EnquiryResponsiblePerson) {
        return this.$message.warning('请输入经办人')
      }
      let params = {
        details: list.map(item => {
          return {
            id: item.id,
            nums: parseFloat(item.nums)
          }
        }),
        type: 'in',
        date: this.EnquiryTime,
        operator: this.EnquiryResponsiblePerson
      }
      tblProcurementPlanHousing(params).then(res => {
        if (+res.code === 200) {
          this.$message.success('操作成功')
          this.$refs.table.loadData(true)
          this.EnquiryTime = '';
          this.EnquiryResponsiblePerson = '';
          this.isShowEnquiryDialog = false
        }
      })
    },
    //提交出库
    submitOutRoom() {
      let isNull = true;
      let NumState = true;
      let MealsState = true;
      let authState = true;
      let arr = []
      this.CheckTableData.forEach(item => {
        if (item.nums) {
          arr.push(item)
        }
      })
      if (!arr.length) {
        return this.$message.warning('请输入出库数量')
      }
      arr.forEach(item => {
        if (isNaN(item.nums)) {
          NumState = false
        }
        if ((parseFloat(item.nums) === 0)) {
          isNull = false
        }
        if (!item.meal) {
          MealsState = false
        }
        if (item.nums) {
          if (parseFloat(item.nums) > (parseFloat(item.inNums) - parseFloat(item.outNums))) {
            authState = false
          }
        }
      })

      if (!NumState) {
        return this.$message.warning('请输入正确的数字')
      }
      if (!isNull) {
        return this.$message.warning('出库数量不能为0')
      }
      if (!MealsState) {
        return this.$message.warning('请选择三餐')
      }
      if (!authState) {
        return this.$message.warning('出库数量不能大于剩余库存数量')
      }
      if (!this.InventoryTime) {
        return this.$message.warning('请选择出库日期')
      }
      if (!this.InventoryResponsiblePerson) {
        return this.$message.warning('请输入经办人')
      }
      let params = {
        details: [],
        type: 'out',
        date: this.InventoryTime,
        operator: this.InventoryResponsiblePerson
      }
      arr.forEach(item => {
        params.details.push({
          id: item.id,
          meal: item.meal,
          nums: parseFloat(item.nums),
        })
      })
      tblProcurementPlanHousing(params).then(res => {
        if (+res.code === 200) {
          this.$message.success('操作成功')
          this.$refs.table.loadData(true)
          this.InventoryTime = '';
          this.InventoryResponsiblePerson = '';
          this.isShowInventoryDialog = false
        }
      })
    },
    //点击发布
    handleRelease(row) {
      this.$confirm('确认要发布该计划吗 ?', '发布确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          status: row.status === 'published' ? 'unpublished' : 'published'
        }
        tblProcurementPlanChangeStatus(params).then(res => {
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.loadData(true)
          }
        })
      })
    },
    //点击删除
    handleDelete(row) {
      this.$confirm('确定要删除该采购计划吗?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tblProcurementPlanDelById({id: row.id}).then(res => {
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.loadData(true)
          }
        })
      }).catch(() => {
      });
    },
    //点击提交采购计划
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.ProcurementPlaneForm.ProcurementPlaneTableData.length) {
            return this.$message.warning('采购项目不能为空, 请添加采购项')
          }
          let nameState = true
          let isNaNState = true
          let numState = true
          this.ProcurementPlaneForm.ProcurementPlaneTableData.forEach(item => {
            if (!item.tblInquiryId || !item.planNums) {
              nameState = false
            }
            if (isNaN(item.planNums)) {
              isNaNState = false
            }
            if (parseFloat(item.planNums) === 0) {
              numState = false
            }
          })
          if (!nameState) {
            return this.$message.warning('请完善采购内容')
          }
          if (!isNaNState) {
            return this.$message.warning('计划数量请输入正确的数字')
          }
          if (!numState) {
            return this.$message.warning('计划数量不能为 0')
          }
          let params = {}
          params.date = this.ProcurementPlaneForm.date
          params.planDetailParams = this.ProcurementPlaneForm.ProcurementPlaneTableData
          let res
          if (this.currentHandleType === 'add') {
            res = await tblProcurementPlanAdd(params)
          } else {
            params.id = this.currentHandleRowId
            res = await tblProcurementPlanUpdate(params)
          }
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.isShowProcurementPlaneDialog = false
            this.$refs.table.loadData(true)
          }
        }
      });
    },
    //点击采购项里的删除
    clickRemovePlaneItem(index) {
      this.ProcurementPlaneForm.ProcurementPlaneTableData.splice(index, 1)
    },
    //采购计划里的每一项下拉框改变时..
    changNameSelect(index) {
      let target = this.ProcurementPlaneForm.ProcurementPlaneTableData[index]
      let obj = this.nameOptions.find(item => {
        return target.tblInquiryId === item.id
      })
      target.unit = obj.measures
      target.price = obj.ave
      target.remark = obj.remark
    },
    //采购计划里的每一项下拉框获得焦点时..
    focusNameSelect() {
      if (!this.ProcurementPlaneForm.date) {
        this.isShowHintDialog = true
      }
    },
    //计划日期改变时..
    changeDate() {
      if (!this.ProcurementPlaneForm.date) {
        return this.isShowHintDialog = true
      }
      let date = this.ProcurementPlaneForm.date
          .replace(/-/g, '')
          .replace(/\//g, '')
          .substring(0, 6)
      let params = {
        date: date,
        pagination: {
          pageNum: 1,
          pageSize: 10000,
        }
      }
      tblInquiryFindList(params).then(res => {
        if (+res.code === 200) {
          this.nameOptions = res.data
        }
      })
    },
    //渲染分类文本
    renderType(row) {
      let obj = this.inquiryTypeOptions.find(item => {
        return item.dictKey === row.type
      })
      return obj ? obj.dictValue : ''
    },
    //点击预约签收单
    clickAppoint() {
      let routeLink = this.$router.resolve({
        path: '/AppointReceipt',
        query: {
          id: this.currentHandleRowId
        }
      })
      window.open(routeLink.href, '_blank')
    },
    postTableData(data) {
      let arr = data.data;
      let total = 0
      arr.forEach(item => {
        total += item.sum
      })
      this.summation = total.toFixed(2)
    },
    changeProportion() {
      if (isNaN(this.proportion)) {
        this.practical = '--'
      } else {
        this.practical = (this.summation * this.proportion).toFixed(2)
      }
      this.practical = (this.practical === '0.00' ? '--' : this.practical)
    },
  }
}
</script>

<style lang="scss" scoped>
.total-wrap {
  height: 50px;
  line-height: 50px;
  background: #409EFF;
}
</style>
