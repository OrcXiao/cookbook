<template>
  <my-dialog :top="'5vh'" :title="isAdd ? '新增' : '修改'" v-model="show">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称 :" prop="name" :rules="[{ required: true, message: '名称不可为空' }]">
        <el-input v-model="form.name" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="分类 :" prop="type" :rules="[{required:true,message:'分类不可为空'}]">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option v-for="(option, optionIndex) in $parent.contentDic" :key="optionIndex" :label="option.dictValue"
                     :value="option.dictKey">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="內容 :" required>
        <div class="edit-wrap-box">
          <vue-editor useCustomImageHandler @image-added="handleImageAdded" v-model="content"/>
        </div>
      </el-form-item>
      <el-form-item label="备注 :" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" :loading="loading" type="primary">提交保存</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
import { VueEditor } from 'vue2-editor';
import { contentUpdate, contentAdd, contentDetail } from '@/api/Content';
import { fileUpload } from '@/api/File.js'
import { getDicTypeValue } from '@/utils/dicMap'

export default {
  components: {VueEditor},
  data() {
    return {
      isAdd: true,
      show: false,
      form: {name: '', type: '', remark: ''},
      content: '', //富文本
      loading: false,
      id: '',
    };
  },
  mounted() {
  },
  methods: {
    init(r) {
      this.show = true;
      this.content = ''
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        if (r) {
          this.isAdd = false;
          contentDetail(r.id,false).then(res=>{
            let obj = res.data
            this.form.name = obj.name
            this.form.type = obj.type
            this.form.remark = obj.remark
            this.content = obj.content
            this.id = obj.id;
          })
        } else {
          this.isAdd = true;
        }
      })
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", file.type)
      const res = await fileUpload(formData)
      Editor.insertEmbed(cursorLocation, "image", process.env.VUE_APP_BASE_IMAGE + '/' + res.data);
      resetUploader();
    },
    submit() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (!vm.content) return vm.$message.error('富文本内容不可为空')
          let params = Object.assign({content: vm.content}, vm.form);
          !vm.isAdd && (params['id'] = vm.id);
          let handler = vm.isAdd ? contentAdd : contentUpdate;
          vm.loading = true
          handler(params).then(() => {
            vm.$message.success('操作成功');
            vm.show = false;
            vm.$parent.MiXin_searchTable();
          }).finally(() => {
            vm.loading = false
          })
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-wrap-box {
  max-height: 400px;
  overflow: auto;
}
</style>
