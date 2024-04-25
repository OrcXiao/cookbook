<template>
  <div class="User-wrap">
    <my-query-title></my-query-title>
    <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="queryObj"></my-query>
    <my-table-title titleTextType="查询列表">
      <template slot="btns">
        <el-button type="primary" @click="add">
          新增
        </el-button>
      </template>
    </my-table-title>
    <my-table ref="table" :data="loadData" :columns="columns" rowKey='id' :isAuto='false'>
      <el-table-column slot="customHandleColumn" label="用户操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleCheck(row)">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
          <el-button type="text" size="small" @click="handleReset(row)">重置密码</el-button>
        </template>
      </el-table-column>
      <span slot="dataAuth" slot-scope="{text}">
        {{ MiXin_findDictValue(authDic, text) }}
      </span>
      <span slot="status" slot-scope="{row}">
        <!-- {{MiXin_findDictValue(userStatusDic,text)}} -->
        <el-switch :disabled='row.statusLoading' @change="statusChange(row)" v-model="row.userStatus"></el-switch>
      </span>
      <span slot="roleType" slot-scope="{text}">
        {{ MiXin_findDictValue(roleDic, text) }}
      </span>
    </my-table>
    <!-- 查看 -->
    <my-dialog width='700px' title="查看详情" v-model="showUser">
      <div class="user-content">
        <el-row class="mg-b20">
          <el-col :span="12">
            <span class="user-left">用户名</span>
            <span class="mg-l20"> {{ current.userName }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">姓名</span>
            <span class="mg-l20"> {{ current.nickName }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">性别</span>
            <span class="mg-l20"> {{ current.sex }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">数据权限</span>
            <span class="mg-l20"> {{ current.dataAuth }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">职务</span>
            <span class="mg-l20"> {{ current.position }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">角色类型</span>
            <span class="mg-l20" style="color:#007BFF"> {{ current.roleType }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">用户状态</span>
            <span class="mg-l20" style="color:#007BFF"> {{ current.status }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">创建人</span>
            <span class="mg-l20"> {{ current.createBy }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">创建时间</span>
            <span class="mg-l20"> {{ current.createTime }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">修改人</span>
            <span class="mg-l20"> {{ current.updateBy || '---' }} </span>
          </el-col>
          <el-col :span="12">
            <span class="user-left">修改时间</span>
            <span class="mg-l20"> {{ current.updateTime }} </span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer"></span>
    </my-dialog>
    <!-- 重置密码 -->
    <my-dialog width='500px' title="重置密码" v-model="showResetPs" @close="$refs.form.resetFields()">
      <div>
        <h3 class="mg-t10 mg-b10">正在为【{{ current.userName }}重置密码】</h3>
        <el-form :model="form" ref="form">
          <el-form-item label-width="70px" prop="pwd" label="新密码" :rules="[{required:true,message:'新密码不可为空'}]">
            <el-input type="password" show-password v-model="form.pwd" placeholder="请输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <div class="dis-fl ju-ct pd-t20">
          <el-button @click="handlePsChange" :loading="pwdLoading" type="primary">确认修改</el-button>
          <el-button @click="showResetPs = false">取消</el-button>
        </div>
      </span>
    </my-dialog>
    <edit ref="edit"/>
  </div>
</template>

<script>
import {moment} from '@/utils/date/moment'
import md5 from 'js-md5'

const columns = [
  {
    label: '用户名',
    prop: 'nickName',
  },
  {
    label: '姓名',
    prop: 'userName',
  },
  {
    label: '数据权限',
    prop: 'dataAuth',
    slotName: 'dataAuth'
  },
  {
    label: '职务',
    prop: 'position',
  },
  {
    label: '用户状态',
    prop: 'status',
    slotName: 'status'
  },
  {
    label: '角色类型',
    prop: 'roleType',
    slotName: 'roleType'

  },
  {
    label: '创建人',
    prop: 'createBy',
  },
  {
    label: '创建时间',
    prop: 'createTime',
    renderTextFun: (row) => row.createTime ? moment(row.createTime).format('yyyy-MM-DD HH:mm:ss') : '--'
  }
]
import edit from './components/userEdit.vue'
import {sysUserList, sysUserPsChange, sysUserChangeUserStatus, sysUserDelById} from '@/api/System/User'
import {getDicTypeValue} from '@/utils/dicMap'
import {tblProcurementPlanChangeStatus} from "../../api/Purchase";

export default {
  name: "User",
  components: {edit},
  data() {
    return {
      columns,
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '用户信息',
            prop: 'userName'
          },
          {
            type: 'select',
            label: '角色信息',
            prop: 'roleType',
            options: [],
          },
          {
            type: 'input',
            label: '创建人',
            prop: 'createBy'
          },
          {
            type: 'daterange',
            label: '创建时间',
            prop: 'date'
          },
          {
            type: 'select',
            label: '数据权限',
            prop: 'dataAuth',
            options: [],
          },
          {
            type: 'select',
            label: '用户状态',
            prop: 'status',
            options: [],
          }
        ]
      },
      loadData: (p) => {
        let params = Object.assign({pagination: p}, this.queryObj)
        if (params['date']) {
          params['createTimeStart'] = params['date'][0]
          params['createTimeEnd'] = params['date'][1]
        }
        delete params.date
        return sysUserList(params).then(res => {
          let data = res.data
          data.forEach(item => {
            item.userStatus = this.userStatusDic.find(item => item.dictValue === '启用').dictKey == item.status
          })
          return Promise.resolve({
            code: 200,
            data: data,
            pagination: res.pagination
          })
        })
      },
      queryObj: {
        date: '',
        roleType: '',
        userName: '',
        createBy: '',
        status: '',
        dataAuth: ''
      },
      showUser: false,
      showResetPs: false,
      user: {},//储存查看的用户信息
      roleDic: [],
      sexDic: [],
      authDic: [],
      userStatusDic: [],
      form: {
        pwd: ''
      },
      current: {},//正在查看或者修改的用户\
      pwdLoading: false
    }
  },
  mounted() {
    this.getDic()
  },
  methods: {
    getDic() {
      Promise.all([getDicTypeValue('roleType'), getDicTypeValue('sex'), getDicTypeValue('dataAuth'), getDicTypeValue('userStatus')]).then(res => {
        let {0: role, 1: sex, 2: dataAuth, 3: userStatus} = res
        this.roleDic = role
        this.sexDic = sex
        this.authDic = dataAuth
        this.userStatusDic = userStatus
        this.formConfig.forms.find(item => item.prop === 'roleType').options = role.map(item => {
          return {label: item.dictValue, value: item.dictKey}
        })
        this.formConfig.forms.find(item => item.prop === 'status').options = userStatus.map(item => {
          return {label: item.dictValue, value: item.dictKey}
        })
        this.formConfig.forms.find(item => item.prop === 'dataAuth').options = dataAuth.map(item => {
          return {label: item.dictValue, value: item.dictKey}
        })
        this.MiXin_searchTable()
      })
    },
    statusChange(row) {
      let value = row.userStatus ? '启用' : '停用'
      const handler = () => {
        let params = {
          id: row.id,
          status: this.userStatusDic.find(item => item.dictValue === value).dictKey
        }
        this.$set(row, 'statusLoading', true)
        sysUserChangeUserStatus(params).then(() => {
          this.$message.success('操作成功')
          row.status = params.status
          this.MiXin_searchTable()
        }).catch(() => {
          row.userStatus = !row.userStatus
        }).finally(() => {
          this.$set(row, 'statusLoading', false)
        })
      }
      if (!row.userStatus) {
        this.$confirm('确认停用该用户吗?停用后将无法登录', '操作确认', {
          confirmButtonText: '确认',
          cancelButtonText: '再想想',
          center: true
        }).then(() => {
          handler()
        }).catch(() => {
          row.userStatus = !row.userStatus
        })
      } else {
        handler()
      }

    },
    handleCheck(r) {
      this.current = Object.assign({}, r)
      this.current.status = this.MiXin_findDictValue(this.userStatusDic, r.status)
      this.current.dataAuth = this.MiXin_findDictValue(this.authDic, r.dataAuth)
      this.current.sex = this.MiXin_findDictValue(this.sexDic, r.sex)
      this.current.roleType = this.MiXin_findDictValue(this.roleDic, r.roleType)
      this.showUser = true
    },
    add() {
      this.$refs.edit && this.$refs.edit.init()
    },
    handleEdit(r) {
      this.$refs.edit && this.$refs.edit.init(r)
    },
    handleReset(r) {
      this.current = Object.assign({}, r)
      this.showResetPs = true
    },
    handleDelete(row) {
      this.$confirm('确定删除该用户 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysUserDelById(row.id).then(res => {
          if (+res.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.loadData(true)
          }
        })
      })
    },
    handlePsChange() {
      const vm = this
      let params = {
        id: vm.current.id,
        pwd: md5(vm.form.pwd)
      }
      vm.pwdLoading = true
      sysUserPsChange(params).then(() => {
        vm.$message.success('修改密码成功')
        vm.showResetPs = false
      }).finally(() => {
        vm.pwdLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-content span {
  color: #999999;
  font-size: 14px;
  line-height: 30px;
}

.user-left {
  width: 70px;
  text-align: right;
  display: inline-block;
}
</style>
