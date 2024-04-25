<template>
  <div class="page-header">
    <div class="dis-fl ju-sb header-wrap">
      <div @click="$router.push({path: '/'})" class="left-area cu-pt">
        <img class="logo" src="../../assets/img/LOGO.jpg" alt="">
        <span class="fs28 ft-b pd-l20">线上食谱定制系统（内网版）</span>
      </div>
      <div class="right-area">
        <span class="fs16 cl666666 pd-r5">数据切换</span>
        <el-select @change="changeValue" class="space" size="mini" v-model="value" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey">
          </el-option>
        </el-select>
        <div class="dis-ib pd-l10" v-if="userInfo.userName">
          <span>欢迎您</span>,
          <span>{{ userInfo.nickName }}</span>,
          <!--        <span>【{{ userInfo.dataAuth }}】</span>,-->
          <span @click="clickEditPassword" class="clF29E44 cu-pt">修改密码</span>,
          <span @click="clickLogout" class="clF29E44 cu-pt">退出</span>
        </div>
        <span class="login-btn cu-pt" @click="clickLoginBtn" v-if="!(userInfo.userName)">
          立即登录
      </span>
        <span class="login-btn cu-pt" @click="clickGoToAdmin" v-if="userInfo.userName && userInfo.roleType === 'admin'">
          进入后台管理
      </span>
      </div>
      <div @click="$router.push({path: '/'})" v-if="isShowNoticeText" class="cl409eff cu-pt te-un notice-board">前往公示栏
      </div>
    </div>

    <!--    登录弹框-->
    <el-dialog
        width="500px"
        title="用户登录"
        :visible.sync="isShowLoginDialog"
        @close="MiXin_closeDialog('loginObj')">
      <div class="dialog-wrap">
        <el-form
            :model="loginObj"
            :rules="loginRules"
            label-width="'140px'"
            ref="loginObj">
          <el-form-item prop="name">
            <el-input
                placeholder="请输入用户名"
                prefix-icon="el-icon-user-solid"
                v-model="loginObj.name">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                type="password"
                show-password
                placeholder="请输入密码"
                prefix-icon="el-icon-s-cooperation"
                v-model="loginObj.password">
            </el-input>
          </el-form-item>
          <el-form-item prop="authCode">
            <el-row>
              <el-col :span="17">
                <el-input
                    @keyup.enter.native="submitLogin('loginObj')"
                    placeholder="请输入验证码"
                    prefix-icon="el-icon-menu"
                    v-model="loginObj.authCode">
                </el-input>
              </el-col>
              <el-col :offset="1" :span="6">
                <div @click="getAuthCode">
                  <identify
                      title="点击切换验证码"
                      class="cu-pt"
                      :identify-code="IdentifyCodeObj.value">
                  </identify>
                </div>

              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div class="dis-fl ju-ct pd-t20">
        <el-button type="primary" class="wd100" @click="submitLogin('loginObj')">登录</el-button>
      </div>
    </el-dialog>

    <!--    修改密码-->
    <el-dialog
        width="500px"
        title="修改密码"
        :visible.sync="isShowPasswordDialog"
        @close="MiXin_closeDialog('passwordObj')">
      <div class="dialog-wrap">
        <el-form
            :model="passwordObj"
            :rules="passwordRules"
            label-width="100px"
            ref="passwordObj">
          <el-form-item prop="oldPassword" label="旧密码">
            <el-input
                type="password"
                placeholder="请输入旧密码"
                v-model="passwordObj.oldPassword">
            </el-input>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input
                type="password"
                placeholder="请输入新密码"
                v-model="passwordObj.newPassword">
            </el-input>
          </el-form-item>
          <el-form-item prop="againPassword" label="确认新密码">
            <el-input
                type="password"
                placeholder="请输入确认新密码"
                v-model="passwordObj.againPassword">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="isShowPasswordDialog = false">取 消</el-button>
        <el-button type="warning" @click="submitPass('passwordObj')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import md5 from 'js-md5';
import validate from "../../validate";
import identify from "./components/identify";
import {
  sysUserCaptchaImage,
  sysUserLogout,
} from "../../api/Login";
import {sysUserPsChange} from '@/api/System/User'

import {mapActions} from 'vuex'
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: 'Home',
  components: {
    identify,
  },
  data() {
    let checkAgainPass = (rule, value, callback) => {
      if (value !== this.passwordObj.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      //是否登录
      isLogin: false,
      //登录弹框显示
      isShowLoginDialog: false,
      //登录对象
      loginObj: {
        name: '',
        password: '',
        authCode: '',
      },
      //登录规则校验
      loginRules: {
        name: [
          validate.NotNull({name: '用户名'})
        ],
        password: [
          validate.NotNull({name: '密码'})
        ],
        authCode: [
          validate.NotNull({name: '验证码'}),
        ],
      },
      //密码弹框
      isShowPasswordDialog: false,
      //密码对象
      passwordObj: {
        oldPassword: '',
        newPassword: '',
        againPassword: '',
      },
      //密码规则校验
      passwordRules: {
        oldPassword: [
          validate.NotNull({name: '旧密码'})
        ],
        newPassword: [
          validate.NotNull({name: '新密码'})
        ],
        againPassword: [
          validate.NotNull({name: '确认新密码'}),
          {validator: checkAgainPass, trigger: 'blur'}
        ],
      },
      options: [],
      value: '',
      tableData: [],
      //验证码
      IdentifyCodeObj: '',
      isShowNoticeText: false,
    }
  },
  watch: {
    '$route': {
      handler: function (to, from) {
        this.isShowNoticeText = (to.path === '/HomeOrder')
      },
      immediate: true
    }
  },
  computed: {
    userInfo: function () {
      return this.$store.getters.user
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDic()
    })
    this.$bus.onEvent('DOLOGIN', () => {
      this.clickLoginBtn()
    })
  },
  beforeDestroy() {
    this.$bus.offEvent('DOLOGIN')
  },
  methods: {
    getDic() {
      Promise.all([getDicTypeValue('dataAuth')]).then(async res => {
        let {0: dataAuth} = res
        this.options = dataAuth
        this.value = dataAuth[0].dictKey
        await this.$store.commit('user/SET_CURRENTDATAAUTH', dataAuth[0])
      })
    },
    ...mapActions({
      doLogin: 'user/_ac_login',
    }),
    changeValue() {
      let obj = this.options.find(item => item.dictKey === this.value)
      this.$store.commit('user/SET_CURRENTDATAAUTH', obj)
      this.$bus.callEvent('DATAAUTH_CHANGE', this.value)

    },
    //点击立即登录按钮
    clickLoginBtn() {
      this.isShowLoginDialog = true;
      this.getAuthCode()
    },
    //获取验证码
    getAuthCode() {
      sysUserCaptchaImage().then(res => {
        if (+res.code === 200) {
          this.IdentifyCodeObj = res.data
        }
      })
    },
    //提交登录
    submitLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let {code, value} = this.IdentifyCodeObj
          if (value.toLocaleLowerCase() !== this.loginObj['authCode'].toLocaleLowerCase()) {
            this.getAuthCode()
            return this.$message.error('验证码错误')
          }
          let params = {
            name: this.loginObj.name,
            pw: md5(this.loginObj.password),
            code,
            value
          }
          this.doLogin(params).then(() => {
            this.isShowLoginDialog = false
          }).finally(() => {
            this.getAuthCode()
          })
        }
      });
    },
    //密码修改
    submitPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.userInfo.id,
            oldPwd: md5(this.passwordObj.oldPassword),
            pwd: md5(this.passwordObj.newPassword)
          }
          sysUserPsChange(params).then(res => {
            if (+res.code === 200) {
              this.$message.success('密码修改成功, 请重新登录')
              this.isShowPasswordDialog = false
            }
          })
        }
      });
    },
    //点击编辑密码
    clickEditPassword() {
      this.isShowPasswordDialog = true;
    },
    //点击退出
    clickLogout() {
      this.$confirm('确定要退出登录吗?', '退出确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysUserLogout().then(res => {
          if (+res.code === 200) {
            this.$store.commit('user/RESET_USER')
            this.$message.success('退出成功')
          }
        })

      }).catch(() => {
      });
    },
    clickGoToAdmin() {
      this.$router.push('/admin');
    },
  },
}
</script>

<style lang="scss" scoped>
.page-header {
  width: 1200px;
  margin: 0 auto;
  user-select: none;
  height: 118px;

  .header-wrap {
    .notice-board {
      margin-top: 50px;
    }
  }

  .left-area {
    line-height: 118px;

    img {
      width: 60px;
      position: relative;
      top: 16px;
    }
  }

  .right-area {
    line-height: 118px;
    //padding-left: 232px;
  }

  .space {
    width: 161px;
    height: 41px;
    line-height: normal;
  }

  .login-btn {
    display: inline-block;
    width: 140px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #ffffff;
    font-size: 18px;
    background: #53C389;
    border-radius: 6px;
    margin-left: 67px;
  }

  /deep/ .el-input--mini .el-input__inner {
    height: 41px;
    line-height: 40px;
  }
}

</style>
