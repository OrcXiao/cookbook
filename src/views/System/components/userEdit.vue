<template>
  <!-- 新增编辑用户 -->
  <my-dialog :title="isAdd ? '新增用户' : '修改用户'" v-model="show">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item
          label="用户名"
          prop="nickName"
          :rules="[{ required: true,validator: checkNickName, trigger: 'blur' }]"
      >
        <el-input :disabled='!isAdd' v-model="form.nickName" placeholder="请输入"/>
      </el-form-item>
      <el-form-item
          label="姓名"
          prop="userName"
          :rules="[{ required: true, message: '姓名不可为空' }]"
      >
        <el-input v-model="form.userName" placeholder="请输入"/>
      </el-form-item>
      <el-form-item
          label="性别"
          :rules="[{ required: true, message: '性别不可为空' }]"
      >
        <el-radio-group v-model="form.sex">
          <el-radio
              v-for="(item, index) in $parent.sexDic"
              :label="item.dictKey"
              :key="index"
          >{{ item.dictValue }}
          </el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
          label="职务"
          prop="position"
          :rules="[{ required: true, message: '职务不可为空' }]"
      >
        <el-input v-model="form.position" placeholder="请输入"/>
      </el-form-item>

      <el-form-item
          label="角色类型"
          prop="roleType"
          :rules="[{ required: true, message: '角色类型不可为空' }]"
      >
        <el-select v-model="form.roleType" placeholder="请选择">
          <el-option
              v-for="(option, optionIndex) in $parent.roleDic"
              :key="optionIndex"
              :label="option.dictValue"
              :value="option.dictKey"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
          label="数据权限"
          prop="dataAuth"
          :rules="[{ required: true, message: '数据权限不可为空' }]"
      >
        <el-select v-model="form.dataAuth" placeholder="请选择">
          <el-option
              v-for="(option, optionIndex) in $parent.authDic"
              :key="optionIndex"
              :label="option.dictValue"
              :value="option.dictKey"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" required>
        <el-switch v-model="form.status"></el-switch>
        <span style="margin-left:5px">{{ form.status ? '有效' : '无效' }}</span>
      </el-form-item>
      <el-form-item
          v-if="isAdd"
          label="登录密码"
          prop="password"
          :rules="[{ required: true, message: '登录密码不可为空' }]">
        <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" type="primary" :loading="loading">
          {{ isAdd ? '确认新增' : '确认修改' }}
        </el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
import {sysUserUpdate, sysUserAdd} from '@/api/System/User';
import md5 from "js-md5";

export default {
  data() {
    return {
      isAdd: true,
      show: false,
      loading: false,
      form: {
        password: '',
        nickName: '',
        userName: '',
        sex: 'man',
        position: '',
        dataAuth: '',
        status: true,
        roleType: ''
      },
      id: ''
    };
  },
  methods: {
    checkNickName(rule, value, callback) {
      if (value === '') {
        callback(new Error('用户名不可为空'));
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('用户名不能为中文'));
      } else {
        callback();
      }
    },
    init(r) {
      const vm = this
      vm.show = true;
      vm.$nextTick(() => {
        vm.$refs.form.resetFields();
        if (r) {
          vm.isAdd = false;
          vm.form.nickName = r.nickName
          vm.form.userName = r.userName
          vm.form.sex = r.sex
          vm.form.position = r.position
          vm.form.dataAuth = r.dataAuth
          vm.form.roleType = r.roleType
          vm.form.status = vm.MiXin_findDictValue(vm.$parent.userStatusDic, r.status) === '启用'
          vm.id = r.id
        } else {
          vm.isAdd = true;
        }
      });
    },
    submit() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, vm.form);
          let startValue = params.status ? '启用' : '停用';
          params['status'] = vm.$parent.userStatusDic.find(
              (item) => item.dictValue === startValue
          ).dictKey;
          !vm.isAdd && (params['id'] = vm.id);
          let handler = vm.isAdd ? sysUserAdd : sysUserUpdate;
          vm.loading = true;
          params.password = md5(params.password)
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
    },
  },
};
</script>
