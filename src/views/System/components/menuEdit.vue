<template>
  <!-- 新增编辑菜单 -->
  <my-dialog :title="isAdd?'新增菜单':'修改菜单'" v-model="show">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <!-- <el-form-item label="菜单类型" prop="component" required>
        <el-radio-group v-model="form.component">
          <el-radio label="1" >菜单</el-radio>
          <el-radio label="2" >按钮</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="菜单名称" prop="menuName" :rules="[{required:true,message:'菜单名称不可为空'}]">
        <el-input v-model="form.menuName" placeholder="请输入" />
      </el-form-item>
      <el-row>
        <el-col :span="14">

          <el-form-item label="菜单层级" required prop="level">
            <el-radio-group :disabled='!isAdd' v-model="form.level">
              <el-radio label="0">一级</el-radio>
              <el-radio label="1">下级</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>

        <el-col :span="10" v-if="form.level == '1'">
          <el-form-item label-width="0" prop="parentId" :rules='[{required:true,message:"请选择上级菜单"}]'>
            <el-select :disabled='!isAdd' v-show="form.level == 1" class="wd100" v-model="form.parentId">
              <el-option v-for="(option, optionIndex) in subMenuList" :key="optionIndex" :label="option.menuName" :value="option.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="菜单层级" required prop="level">
        <el-row>
          <el-col :span="14">
            <el-radio-group v-model="form.level">
              <el-radio label="0">一级</el-radio>
              <el-radio label="1">下级</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="10">
            <el-select v-show="form.level == 1" class="wd100" v-model="parentId">
              <el-option v-for="(option, optionIndex) in subMenuList" :key="optionIndex" :label="option.menuName" :value="option.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

      </el-form-item> -->
      <el-form-item label="路由地址" prop="path" :rules="[{required:true,message:'路由地址不可为空'}]">
        <el-input v-model="form.path" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="菜单排序" prop="orderNum" :rules="[{required:true,message:'排序不可为空'}]">
        <el-input-number v-model="form.orderNum"></el-input-number>
      </el-form-item>
      <el-form-item label="有效状态" prop="status">
        <el-switch v-model="form.status" />
      </el-form-item>
      <el-form-item label="功能描述" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="描述该功能的用途或使用场景" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" type="primary" :loading="loading">确认修改</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
import { sysMenuUpdate, sysMenuAdd } from '@/api/System/Menu'
export default {
  data() {
    return {
      isAdd: true,
      show: false,
      rules: {},
      form: {
        level: '0',
        status: true,
        remark: '',
        path: '',
        menuName: '',
        parentId: '',
        orderNum: ''
      },
      id: '',
      parentId: '',
      loading:false
    }
  },
  computed: {
    subMenuList() {
      return this.$parent.$refs.table && this.$parent.$refs.table.list || []
    }
  },
  methods: {
    init(r) {
      this.show = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        if (r) {
          this.isAdd = false
          this.form.status = r.menuStatus
          this.form.level = r.parentId == 0 ? '0' : '1'
          this.form.orderNum = r.orderNum
          this.form.remark = r.remark || ''
          this.form.path = r.path
          this.form.menuName = r.menuName
          this.form.parentId = r.parentId == 0 ? '' : r.parentId
          this.id = r.id
        } else {
          this.isAdd = true
        }
      })

    },
    submit() {
      const vm = this
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, vm.form, { parentId: +vm.form.level === 0 ? 0 : vm.form.parentId });
          let validName = params.status ? '有效' : '无效'
          let status = vm.$parent.validStatus.find(item => item.dictValue === validName).dictKey
          params.status = String(status)
          delete params.level
          !vm.isAdd && (params['id'] = vm.id);
          let handler = vm.isAdd ? sysMenuAdd : sysMenuUpdate;
          vm.loading = true
          handler(params).then(() => {
            vm.$message.success('操作成功');
            vm.show = false;
            vm.$parent.MiXin_searchTable();
          }).finally(() =>{
            vm.loading = false
          })
        }
      });
    }
  }
}
</script>
