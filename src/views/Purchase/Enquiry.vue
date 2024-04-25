<template>
  <div class="inventory-wrap">
    <my-query-title></my-query-title>
    <my-query @searchData="$refs.table.loadData(true)" :formConfig="formConfig" :formModel="formModel"></my-query>
    <my-table-title>
      <template v-slot:btns>
        <el-button type="success" @click="downLoadTemplete" :loading='downLoading'>
          模板下载
        </el-button>
        <el-button @click="showImport" type="warning">
          批量导入
          <!-- <input accept=".xls,.xlsx" ref="input" @change="getFile" style="position:absolute;opacity:0;width:100%;height:100%;left:0;top:0;" type="file"> -->
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i>新增
        </el-button>
      </template>
    </my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns">
      <template slot="renderTotal" slot-scope="scope">
        {{ renderNum(scope.row.total) }}
      </template>
      <template slot="renderAve" slot-scope="scope">
        {{ renderNum(scope.row.ave) }}
      </template>
      <template slot="renderType" slot-scope="scope">
        {{ renderTypeText(scope.row) }}
      </template>
      <el-table-column slot="customHandleColumn" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </my-table>

    <!--    询价-->
    <el-dialog :visible.sync="isShowEnquiryDialog" :title="currentHandleType === 'add' ? '新增询价': '修改询价'"
               @close="MiXin_closeDialog('EnquiryForm')" width="700px">
      <div>
        <el-form ref="EnquiryForm" :model="EnquiryForm" :rules="EnquiryFormRules" label-width="120px">
          <el-form-item label="询价年月 :" prop="date">
            <el-date-picker :disabled="currentHandleType === 'edit'" v-model="EnquiryForm.date" value-format="yyyyMM"
                            type="month" placeholder="选择年月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="品名 :" prop="name">
            <el-input :disabled="currentHandleType === 'edit'" v-model="EnquiryForm.name" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="分类 :" prop="type">
            <el-select class="wd100" v-model="EnquiryForm.type" placeholder="请选择">
              <el-option v-for="item in EnquiryOptions" :key="item.value" :label="item.dictValue" :value="item.dictKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位 :" prop="measures">
            <el-input :disabled="currentHandleType === 'edit'" v-model="EnquiryForm.measures" placeholder="请输入"/>
          </el-form-item>
          <div class="price-wrap">
            <el-form-item v-for="(item) in supermarketList" :key="item.prop" :label="item.name + ' :'">
              <el-input
                  @keyup.native="Mixin_commonLimitInput('EnquiryForm.'+ item.prop ,6 ,2), commonInput($event)"
                  v-model="EnquiryForm[item.prop]"
                  placeholder="请输入价格(元)"/>
            </el-form-item>
            <div :style="{'top': supermarketList.length * 25 + 'px'}" class="result-wrap">
              <div>合计: {{ total }} 元</div>
              <div>均价: {{ price }} 元</div>
            </div>
          </div>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('EnquiryForm')">确 定</el-button>
        <el-button @click="isShowEnquiryDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <my-dialog title="批量导入" v-model="show">
      <el-form ref="importForm" :model="importForm" label-width="120px">
        <el-form-item label="选择导入年月" prop="date" :rules='[{required:true,message:"导入年月不可为空"}]'>
          <el-date-picker class="mg-b10" type="month" v-model="importForm.date" placement="left" placeholder="导入年月"
                          value-format="yyyyMM"></el-date-picker>
        </el-form-item>
        <el-form-item label="选择导入文件">
          <el-upload :on-change='beforeUpload' accept='.xls,.xlsx' ref="upload" class="avatar-uploader" :limit="1"
                     show-file-list action='#' :auto-upload='false'>
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">

        <div class="dis-fl ju-ct pd-t20">
          <el-button @click="submit" type="primary" :loading="loading">确认导入</el-button>
          <el-button @click="show = false">取消</el-button>
        </div>
      </span>
    </my-dialog>
  </div>
</template>


<script>
import validate from "../../validate";
import {
  getEnquiryType,
  tblInquiryFindList,
  tblInquiryAdd,
  tblInquiryUpdate,
  tblInquiryDelById,
  tblInquiryFindById,
} from "../../api/Enquiry";
import {fileUpload} from '@/api/File.js'
import {fileCommonDown} from '@/utils/file'
import Mixin_commonLimitInput from '@/mixins/inputLimit'

function renderValue(row, index, prop) {
  return !parseFloat(row[prop]) ? '' : row[prop]
}

export default {
  name: "inventory",
  mixins: [Mixin_commonLimitInput],
  data() {
    return {
      formConfig: {
        forms: [
          {
            type: 'month',
            label: '年月',
            prop: 'date',
          },
          {
            type: 'input',
            label: '品名',
            prop: 'name',
            placeholder: '输入关键字'
          },
          {
            type: 'select',
            label: '分类',
            prop: 'type',
            options: [],
            opLabel: 'dictValue',
            opValue: 'dictKey',
          },
        ]
      },
      formModel: {
        date: '',
        name: '',
        type: '',
      },
      columns: [
        {
          label: '年月',
          prop: 'date',
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
          label: '分类',
          prop: 'type',
          slotName: 'renderType',
        },
        {
          label: '达达超市',
          prop: 'dada',
          renderTextFun: renderValue,
        },
        {
          label: '沃尔玛超市',
          prop: 'woerma',
          renderTextFun: renderValue,
        },
        {
          label: '广平市场',
          prop: 'guangping',
          renderTextFun: renderValue,
        },
        {
          label: '滨河市场',
          prop: 'binghe',
          renderTextFun: renderValue,
        },
        {
          label: '佳佳超市',
          prop: 'jiajia',
          renderTextFun: renderValue,
        },
        {
          label: '合计',
          slotName: 'renderTotal',
        },
        {
          label: '平均价',
          slotName: 'renderAve',
        },
      ],

      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.formModel)
        params.date = params.date ? (params.date.replace(/\//g, '')) : ''
        return tblInquiryFindList(params)
      },
      //导入
      importForm: {
        date: '',
        file: null
      },
      show: false,
      /*
      * 询价
      * */
      currentHandleType: '',
      isShowEnquiryDialog: false,
      EnquiryForm: {
        binghe: '',
        dada: '',
        date: '',
        guangping: '',
        measures: '',
        name: '',
        remark: '',
        type: '',
        woerma: '',
        jiajia: '',
      },
      //校验规则
      EnquiryFormRules: {
        date: [
          validate.NotNull({name: '询价年月'})
        ],
        name: [
          validate.NotNull({name: '品名'})
        ],
        type: [
          validate.NotNull({name: '分类'})
        ],
        measures: [
          validate.NotNull({name: '单位'})
        ],
        dada: [
          validate.isNumber({name: '单位', isRequired: false})
        ],
      },
      //询价分类候选项
      EnquiryOptions: [],
      //总计
      total: 0,
      //单价
      price: 0,
      //超市集合
      supermarketList: [
        {
          name: '达达超市',
          prop: 'dada',
        },
        {
          name: '沃尔玛超市',
          prop: 'woerma',
        },
        {
          name: '广平市场',
          prop: 'guangping',
        },
        {
          name: '滨河市场',
          prop: 'binghe',
        },
        {
          name: '佳佳超市',
          prop: 'jiajia',
        },
      ],
      /** 模板下载 */
      downLoading: false,
      loading: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getEnquiryTypeOptions()
    })
  },
  methods: {

    showImport() {
      this.show = true
      this.$nextTick(() => {
        this.$refs.importForm.resetFields()
        this.importForm.file = null
        this.$refs.upload.clearFiles()
      })
    },
    // 提交导入
    submit() {
      this.$refs.importForm.validate(valid => {
        if (valid) {
          const formData = new FormData();
          formData.append("file", this.importForm.file);
          formData.append("date", this.importForm.date);
          formData.append("type", 'inquiry')
          this.loading = true
          fileUpload(formData).then(() => {
            this.$message.success('批量导入成功')
            this.show = false
            this.MiXin_searchTable()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },


    beforeUpload(file) {
      this.importForm.file = file.raw
    },
    /** 下载模板 */
    downLoadTemplete() {
      this.downLoading = true
      fileCommonDown('inquiry').then(() => {
      }).finally(() => {
        this.downLoading = false
      })
    },
    //获取询价候选项
    getEnquiryTypeOptions() {
      getEnquiryType().then(res => {
        if (+res.code === 200) {
          this.EnquiryOptions = res.data
          this.formConfig.forms[2].options = res.data
        }
      })
    },
    handleAdd() {
      this.total = 0;
      this.price = 0;
      this.currentHandleType = 'add';
      this.isShowEnquiryDialog = true;
    },
    handleEdit(row) {
      this.currentHandleType = 'edit';
      tblInquiryFindById({id: row.id}).then(res => {
        if (+res.code === 200) {
          this.EnquiryForm = Object.assign({}, row)
          this.supermarketList.forEach(item => {
            this.EnquiryForm[item.prop] = !parseFloat(this.EnquiryForm[item.prop]) ? '' : res.data[item.prop]
          })
          this.getTotalAndPrice()
          this.isShowEnquiryDialog = true;
        }
      })
    },
    //点击提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = this.EnquiryForm
          let res
          if (this.currentHandleType === 'add') {
            res = await tblInquiryAdd(params)
          } else {
            res = await tblInquiryUpdate(params)
          }
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.isShowEnquiryDialog = false
            this.$refs.table.loadData(true)
          }
        }
      });
    },
    //点击删除
    handleRemove(row) {
      this.$confirm('确定要删除该菜品吗?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tblInquiryDelById({id: row.id}).then(res => {
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.loadData(true)
          }
        })
      }).catch(() => {
      });
    },

    //输入价格时
    commonInput(e) {
      if (isNaN(e.target.value)) {
        this.$message.warning('请输入正确的数字 !')
        this.total = 0;
        this.price = 0;
        return
      }
      this.getTotalAndPrice()
    },
    //计算合计和均价
    getTotalAndPrice() {
      let total = 0
      let num = 0
      this.supermarketList.forEach(item => {
        if (this.EnquiryForm[item.prop]) {
          num++
          total += (parseFloat(this.EnquiryForm[item.prop]))
        }
      })
      this.total = Number(total).toFixed(2) || '0.00'
      this.price = Number(total / num) ? Number(total / num).toFixed(2) : '0.00'
    },
    //渲染分类文本
    renderTypeText(row) {
      let obj = this.EnquiryOptions.find(item => {
        return item.dictKey === row.type
      })
      return obj ? obj.dictValue : ''
    },
    renderNum(num) {
      if (typeof num === 'number') {
        return num.toFixed(2)
      }
    },
    renderValue(value) {
      return parseFloat(value) === 0 ? '' : value
    },
  }
}
</script>

<style lang="scss" scoped>
.price-wrap {
  position: relative;
  width: 380px;
  padding-right: 20px;
  border-right: 1px solid #e5e5e5;

  & > .result-wrap {
    position: absolute;
    right: -150px;
    //top: 100px;
  }
}
</style>
