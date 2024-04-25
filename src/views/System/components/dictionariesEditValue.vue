<template>
  <!-- 新增编辑字典值 -->
  <my-dialog :title="isAdd?'新增字典值':'修改字典值'" v-model="show">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="字典名称" prop="dictValue" :rules="[{required:true,message:'字典名称不可为空'}]">
        <el-input v-model="form.dictValue" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="字典编码" prop="dictKey" :rules="[{required:true,message:'字典编码不可为空'}]">
        <el-input v-model="form.dictKey" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="排序" prop="dictSort" :rules="[{required:true,message:'排序不可为空'}]">
        <el-input-number v-model="form.dictSort"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注" />
      </el-form-item>
    </el-form>
    <span slot="footer">
        <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" type="primary" :loading="loading">{{isAdd?'确认新增':'确认修改'}}</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
import {sysDictDataAdd, sysDictDataUpdate} from '@/api/System/Dictionaries'
export default {
  data() {
    return {
      isAdd: true,
      show: false,
      form: {
        dictValue:'',
        dictKey:'',
        dictSort:'',
        remark:''
      },
      loading:false,
      id:''
    }
  },
  methods: {
    init(r) {
      const vm = this
      vm.show = true;
      vm.$nextTick(() => {
        vm.$refs.form.resetFields();
        if (r) {
          vm.isAdd = false;
          vm.form = Object.assign(vm.form,r)
          vm.id = r.id
        } else {
          vm.isAdd = true;
        }
      });
    },
    submit(){
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({dictTypeId:vm.$parent.dictTypeId}, vm.form);
          !vm.isAdd && (params['id'] = vm.id);
          let handler = vm.isAdd ? sysDictDataAdd : sysDictDataUpdate;
          vm.loading = true;
          handler(params)
            .then(() => {
              vm.$message.success('操作成功');
              vm.show = false;
              vm.$parent.MiXin_searchTable();
            })
            .finally(() => {
              vm.loading = false;
            });
        }
      });
    }
  }
}
</script>