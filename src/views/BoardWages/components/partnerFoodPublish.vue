<template>
  <my-dialog title="发布确认" v-model="show">
    <div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="账目年月" prop="sort">
          <span>{{form.date}}</span>
        </el-form-item>
        <el-form-item label="伙食单位" prop="sort">
          <span>{{MiXin_findDictValue($parent.authDic,form.dataAuth)}}</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
        <div class="dis-fl ju-ct pd-t20">
      <el-button @click="submit" type="primary" :loading='loading'>确认发布</el-button>
      <el-button @click="show = false">再想想</el-button>
    </div>
    </span>
  </my-dialog>
</template>
<script>
import { tblBoardExpensesPublish } from '@/api/BoardWages'
export default {
  data() {
    return {
      show: false,
      form: {},
      loading:false
    };
  },
  methods: {
    submit() {
      const vm = this
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let status = vm.MiXin_findDictValue(vm.$parent.releaseDic,'已发布','dictKey','dictValue')
          let params = {id:vm.form.id , status};
          vm.loading = true
          tblBoardExpensesPublish(params).then(() => {
            vm.$message.success('操作成功');
            vm.show = false;
            vm.$parent.MiXin_searchTable();
          }).finally(()=>{
            vm.loading = false
          })
        }
      });
    },
    init(r) {
      this.show = true;
      this.form = r
    },
  },
};
</script>
