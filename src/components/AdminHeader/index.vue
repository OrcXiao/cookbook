<template>
  <div class="header-wrap dis-fl ju-sb">
    <div class="left-wrap">
      <img class="logo" src="../../assets/img/LOGO.jpg" alt="">
      <span class="pd-l20 cl0061b2 ft-b fs18">线上食谱定制系统</span>
    </div>
    <div class="right-wrap cl0061b2">
      <span>欢迎管理员，{{ userInfo.userName }}</span>
      <span @click="clickEditPass" class="pd-l20 pd-r20 cu-pt">修改密码</span>
      <span @click="clickNoticeBoard" class="pd-l20 pd-r20 cu-pt te-un">前往公示栏</span>
      <i @click="clickLogout" class="el-icon-switch-button logout cu-pt"></i>
    </div>

    <el-dialog
        :visible.sync="isShowPassDialog"
        title="修改密码"
        width="500px"
        @close="MiXin_closeDialog('PassForm')">
      <el-form
          ref="PassForm"
          :model="PassForm"
          :rules="PassFormRules"
          label-width="120px">
        <el-form-item label="旧密码 :" prop="oldPass">
          <el-input type="password"
                    show-password v-model="PassForm.oldPass" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="新密码 :" prop="newPass">
          <el-input type="password"
                    show-password v-model="PassForm.newPass" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="确认新密码 :" prop="againPass">
          <el-input type="password"
                    show-password v-model="PassForm.againPass" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('PassForm')">确 定</el-button>
        <el-button @click="isShowPassDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import validate from "../../validate";
import {sysUserLogout} from "../../api/Login";
import {mapActions} from "vuex";
import md5 from "js-md5";
import {sysUserPsChange} from '@/api/System/User'

export default {
  name: "index",
  data() {
    let checkAgainPass = (rule, value, callback) => {
      if (value !== this.PassForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isShowPassDialog: false,
      PassForm: {
        oldPass: '',
        newPass: '',
        againPass: '',
      },
      PassFormRules: {
        oldPass: [
          validate.NotNull({name: '旧密码'})
        ],
        newPass: [
          validate.NotNull({name: '新密码'})
        ],
        againPass: [
          validate.NotNull({name: '确认新密码'}),
          {validator: checkAgainPass, trigger: 'blur'}
        ],
      },
    }
  },
  computed: {
    userInfo: function () {
      return this.$store.getters.user
    }
  },
  // ...mapActions({
  //   doLoginOut: 'user/_ac_loginOut',
  // }),

  methods: {
    clickEditPass() {
      this.isShowPassDialog = true
    },
    clickNoticeBoard() {
      let url = `/`
      let routeUrl = this.$router.resolve({
        path: url,
      })
      window.open(routeUrl.href, '_blank')

    },
    //点击退出
    clickLogout() {
      let vm = this;
      this.$confirm('确定要退出登录吗?', '退出确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysUserLogout().then(res => {
          if (+res.code === 200) {
            this.$store.commit('user/RESET_USER')
            this.$message.success('退出成功')
            this.$router.push('/')
          }
        })

      }).catch(() => {
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.userInfo.id,
            oldPwd: md5(this.PassForm.oldPass),
            pwd: md5(this.PassForm.newPass)
          }
          sysUserPsChange(params).then(res => {
            if (+res.code === 200) {
              this.$message.success('密码修改成功, 请重新登录')
              this.$store.commit('user/RESET_USER')
              this.$router.push('/')
              this.isShowPassDialog = false
            }
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  border-bottom: 1px solid #efe9e9;

  & > .left-wrap {
    padding-left: 20px;
    line-height: 70px;

    .logo {
      width: 40px;
      position: relative;
      top: 12px;
    }
  }

  & > .right-wrap {
    line-height: 70px;

    .logout {
      padding: 10px;
    }
  }
}
</style>
