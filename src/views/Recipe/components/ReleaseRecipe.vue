<template>
  <div class="ReleaseRecipe-wrap">
    <el-dialog
        :visible.sync="isShowReleaseRecipeDialog"
        title="发布确认"
        width="700px"
        @close="MiXin_closeDialog('ReleaseRecipeForm')">
      <el-form
          ref="ReleaseRecipeForm"
          :model="ReleaseRecipeForm"
          :rules="ReleaseRecipeRules"
          label-width="120px">
        <el-form-item label="制订日期 :" prop="name">
          {{ ReleaseRecipeForm.preparationDateStart }} 至 {{ ReleaseRecipeForm.preparationDateEnd }}
        </el-form-item>
        <el-form-item label="营长 :" prop="battalion">
          <el-input v-model="ReleaseRecipeForm.battalion" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="经济民主组 :" prop="economicDemocracyGroup">
          <el-input v-model="ReleaseRecipeForm.economicDemocracyGroup" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="司务长 :" prop="superintendent">
          <el-input v-model="ReleaseRecipeForm.superintendent" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer dis-fl ju-ct pd-t20">
        <el-button type="primary" @click="submitReleaseRecipeForm('ReleaseRecipeForm')">确认发布</el-button>
        <el-button @click="isShowReleaseRecipeDialog = false">再想想</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import validate from "../../../validate";
import {tblRecipesTotalPublished} from "../../../api/Recipe";

export default {
  name: "ReleaseRecipe",
  data() {
    return {
      /*
      * 发布食谱
      * */
      isShowReleaseRecipeDialog: false,
      ReleaseRecipeForm: {
        id: '',
        battalion: '',
        economicDemocracyGroup: '',
        superintendent: '',
      },
      ReleaseRecipeRules: {
        battalion: [validate.NotNull({name: '营长'})],
        economicDemocracyGroup: [validate.NotNull({name: '经济民主组'})],
        superintendent: [validate.NotNull({name: '司务长'})],
      }
    }
  },
  methods: {
    //获得当前行的数据
    getRowData(){
      let currentRow = this.$parent.ReleaseRecipeRow
      this.ReleaseRecipeForm.id = currentRow.id
      this.ReleaseRecipeForm.preparationDateStart = currentRow.preparationDateStart
      this.ReleaseRecipeForm.preparationDateEnd = currentRow.preparationDateEnd
      this.isShowReleaseRecipeDialog = true
    },
    //提交发布食谱
    submitReleaseRecipeForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.ReleaseRecipeForm
          tblRecipesTotalPublished(params).then(res => {
            if (+res.code === 200) {
              this.$message.success('操作成功')
              this.$parent.MiXin_searchTable();
              Object.assign(this.$data, this.$options.data())
              this.isShowReleaseRecipeDialog = false
            }
          })
        }
      });
    },

  }
}
</script>

<style lang="scss" scoped>

</style>
