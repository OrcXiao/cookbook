<template>
  <div class="Cuisine-wrap">
    <my-query-title></my-query-title>
    <my-query :formConfig="formConfig" :formModel="formModel" @searchData="$refs.table.loadData(true)">
    </my-query>
    <my-table-title :tips="'Tips:所有食堂共用菜品库，有状态为无效时，该菜品将无法提交点菜'">
      <template v-slot:btns>
        <el-button type="success" @click="downLoadTemplete" :loading='downLoading'>
          模板下载
        </el-button>
        <el-button style='position:relative' type="warning">
          批量导入
          <input accept=".xls,.xlsx" ref="input" @change="getFile"
                 style="position:absolute;opacity:0;width:100%;height:100%;left:0;top:0;" type="file">
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i>新增
        </el-button>
      </template>
    </my-table-title>


    <my-table :rowStyleObj="{height: '100px'}" ref="table" :data="loadData" :columns="columns">
      <template slot="renderPic" slot-scope="scope">
        <div class="" v-if="scope.row.pic">
          <img :src="imgUrl + scope.row.pic" class="height90" alt="">
        </div>
        <span v-else>暂无</span>
      </template>
      <template slot="renderType" slot-scope="scope">
        {{ renderType(scope.row.type) }}
      </template>
      <template slot="renderStatus" slot-scope="scope">
        <el-switch @change="changeStatus(scope.row)" v-model="scope.row.status" active-value="valid"
                   inactive-value="invalid">
        </el-switch>
      </template>
      <template slot="renderDate" slot-scope="scope">
        {{ renderDate(scope.row.createTime) }}
      </template>
      <el-table-column slot="customHandleColumn" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleCheck(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </my-table>


    <!--  新增/编辑菜品弹框  -->
    <el-dialog :visible.sync="isShowCuisineDialog" :title="currentHandleType === 'add' ? '新增菜品' : '修改菜品'" width="700px"
               @close="MiXin_closeDialog('CuisineForm')">
      <el-form ref="CuisineForm" :model="CuisineForm" :rules="CuisineRules" label-width="120px">
        <el-form-item label="菜品名称 :" prop="name">
          <el-input class="width300" v-model="CuisineForm.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="菜品分类 :" prop="type">
          <el-select @change="changeType" class="width300" v-model="CuisineForm.type" placeholder="请选择">
            <el-option v-for="(option, optionIndex) in CuisineOptions" :key="optionIndex" :label="option.dictValue"
                       :value="option.dictKey">
            </el-option>
          </el-select>
        </el-form-item>

        <!--  荤菜下拉框      -->
        <el-form-item v-if="CuisineForm.type === 'huncai'" label="二级分类 :">
          <el-select class="width300" v-model="CuisineForm.reclassify" placeholder="请选择">
            <el-option v-for="(option, optionIndex) in HunCaiOptions" :key="optionIndex" :label="option.dictValue"
                       :value="option.dictKey">
            </el-option>
          </el-select>
        </el-form-item>
        <!--  素菜下拉框      -->
        <el-form-item v-if="CuisineForm.type === 'shucai'" label="二级分类 :">
          <el-select class="width300" v-model="CuisineForm.reclassify" placeholder="请选择">
            <el-option v-for="(option, optionIndex) in ShuCaiOptions" :key="optionIndex" :label="option.dictValue"
                       :value="option.dictKey">
            </el-option>
          </el-select>
        </el-form-item>
        <!--  其他      -->
        <el-form-item v-if="!(['huncai','shucai'].includes(CuisineForm.type))"  label="二级分类 :">
          <el-input class="width300" v-model="CuisineForm.reclassify" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="菜品图片 :">
          <el-upload
              :on-remove="removeImg"
              ref="upload" list-type="picture-card" class="avatar-uploader" :limit="1" show-file-list
              :file-list='fileList' action='#' :auto-upload='true' :http-request='customRequst'>
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="有效状态 :" prop="status">
          <el-switch active-value="valid" inactive-value="invalid" v-model="CuisineForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="口味 :">
          <el-input class="width300" v-model="CuisineForm.remark" placeholder="多种口味请用 | 进行分隔, 如: 特辣|中辣"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('CuisineForm')">确 定</el-button>
        <el-button @click="isShowCuisineDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--    查看详情弹框-->
    <el-dialog :visible.sync="isShowDetailsDialog" title="查看详情" width="700px">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜品编号 :">
              {{ DetailsForm.id }}
            </el-form-item>
            <el-form-item label="菜品分类 :">
              {{ renderType(DetailsForm.type) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜品名称 :">
              <div>
                <div>
                  {{ DetailsForm.name }}
                </div>
                <div class="pd-l10">
                  <img v-if="DetailsForm.pic" :src="imgUrl + DetailsForm.pic" class="width150" alt="">
                  <span v-else>暂无图片</span>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="备注 :">
                {{ DetailsForm.remark || '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="被点总次数 :">
                {{ DetailsForm.nums }}
              </el-form-item>
            </el-col>

          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人 :">
              {{ DetailsForm.createBy }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间 :">
              {{ DetailsForm.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="DetailsForm.updateBy" label="修改人 :">
              {{ DetailsForm.updateBy }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="DetailsForm.updateTime" label="修改时间 :">
              {{ DetailsForm.updateTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  tblFoodAddFood,
  tblFoodFindList,
  tblFoodDelById,
  tblFoodFindById, tblFoodChangeFoodStatus, tblFoodUpdateFood,
} from '../../api/Cuisine'
import validate from "../../validate";
import {format} from '../../utils/date/moment.js'
import {getDicTypeValue} from '@/utils/dicMap'
import {fileUpload} from '@/api/File'
import {fileCommonDown} from '@/utils/file'

export default {
  name: "Cuisine",
  data() {
    return {

      /** 模板下载 */
      downLoading: false,
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
            label: '创建人',
            prop: 'createBy',
          },
          {
            type: 'daterange',
            label: '创建时间',
            prop: 'createTime',
          },
          {
            type: 'select',
            label: '有效状态',
            prop: 'status',
            options: [
              {
                label: '有效',
                value: 'valid',
              },
              {
                label: '无效',
                value: 'invalid',
              },
            ],
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
        createBy: '',
        createTime: '',
        status: '',
        remark: '',
      },
      columns: [
        {
          label: '菜品图片',
          prop: 'pic',
          slotName: 'renderPic',

        },
        {
          label: '菜品名称',
          prop: 'name',

        },
        {
          label: '菜品分类',
          prop: 'type',
          slotName: 'renderType',
        },
        {
          label: '二级分类',
          prop: 'reclassify',
        },
        {
          label: '口味',
          prop: 'remark',
        },
        {
          label: '被点总次数',
          prop: 'nums',
        },
        {
          label: '有效状态',
          prop: 'status',
          slotName: 'renderStatus',
        },
        {
          label: '创建人',
          prop: 'createBy',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          slotName: 'renderDate',
        },
      ],
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.formModel)
        if (params['createTime']) {
          params['createTimeStart'] = params['createTime'][0] + ' 00:00:00'
          params['createTimeEnd'] = params['createTime'][1] + ' 23:59:59'
        }
        delete params.createTime
        return tblFoodFindList(params)
      },
      /*
      * 菜品弹框
      * */
      isShowCuisineDialog: false,
      currentHandleType: '',
      CuisineForm: {
        name: '',
        type: '',
        reclassify: '',
        pic: '',
        status: 'valid',
        remark: '',
      },
      CuisineRules: {
        name: [
          validate.NotNull({name: '菜品名称'})
        ],
        type: [
          validate.NotNull({name: '菜品分类'})
        ],
        status: [
          validate.NotNull({name: '有效状态'})
        ],
      },
      /** 上传图片 */
      fileList: [],
      //菜品类型
      CuisineOptions: [],
      /*
      * 详情弹框
      * */
      DetailsForm: {},
      isShowDetailsDialog: false,
      imgUrl: process.env.VUE_APP_BASE_IMAGE + '/',
      HunCaiOptions: [
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
      ShuCaiOptions: [
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDic()
    })
  },
  methods: {
    /** 获取文件 */
    getFile() {
      let file = this.$refs.input.files[0]
      if (!file) return
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", 'food')
      fileUpload(formData).then(() => {
        this.$message.success('批量导入成功')
        this.MiXin_searchTable()
      })
    },
    /** 下载模板 */
    downLoadTemplete() {
      this.downLoading = true
      fileCommonDown('food').then(() => {
      }).finally(() => {
        this.downLoading = false
      })
    },
    /** 上传文件 */
    async customRequst({file}) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", file.type)
      try {
        const res = await fileUpload(formData)
        this.CuisineForm.pic = res.data
      } catch (err) {
        this.$refs.upload.clearFiles()
      }
    },
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
    handleAdd() {
      this.currentHandleType = 'add'
      this.isShowCuisineDialog = true
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
      })
    },
    handleCheck(row) {
      tblFoodFindById({id: row.id}).then(res => {
        if (+res.code === 200) {
          this.DetailsForm = res.data
          this.isShowDetailsDialog = true
        }
      })
    },
    handleEdit(row) {
      this.CuisineForm = Object.assign({}, row)
      this.currentHandleType = 'edit'
      this.isShowCuisineDialog = true
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
        this.fileList.splice(0)
        if (row.pic) {
          this.fileList = [{
            name: row.pic,
            url: this.imgUrl + row.pic
          }]
        }
      })
    },
    handleDelete(row) {
      if (row.status === 'valid') {
        return this.$message.warning('当前为有效状态, 无法删除 !')
      }
      this.$confirm('确定要删除该菜品吗?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tblFoodDelById({id: row.id}).then(res => {
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.loadData(true)
          }
        })
      }).catch(() => {
      });
    },
    //新增或编辑提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.CuisineForm
          if (this.currentHandleType === 'add') {
            tblFoodAddFood(params).then(res => {
              if (+res.code === 200) {
                this.$message.success('操作成功')
                this.isShowCuisineDialog = false
                this.$refs.table.loadData(true)
              }
            })
          } else {
            tblFoodUpdateFood(params).then(res => {
              if (+res.code === 200) {
                this.$message.success('操作成功')
                this.isShowCuisineDialog = false
                this.$refs.table.loadData(true)
              }
            })
          }

        }
      });
    },
    //变更菜品状态
    changeStatus(row) {
      let params = {
        id: row.id,
        status: row.status
      }
      tblFoodChangeFoodStatus(params).then(res => {
        if (+res.code === 200) {
          this.$message.success('操作成功')
          this.$refs.table.loadData(true)
        }
      })
    },
    //渲染菜品分类
    renderType(type) {
      let option = this.CuisineOptions.find(item => {
        return item.dictKey === type
      })
      return option ? option.dictValue : '';
    },
    //渲染时间
    renderDate(date) {
      return format(date)
    },
    //删除图片
    removeImg() {
      this.fileList = [];
      this.CuisineForm.pic = ''
    },
    changeType (){
      this.CuisineForm.reclassify = ''
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
    }
  },

}
</script>

<style lang="scss" scoped>
</style>
