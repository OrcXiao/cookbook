<template>
  <div class="page-header dis-fl ju-ct">
    <div class="left-area">
      <img src="../../assets/img/bayi.png" alt="">
      <span class="fs36 ft-b pd-l20">线上食谱定制系统（内网版）</span>
    </div>
    <div class="right-area">
      <span class="fs16 cl666666 pd-r5">数据切换</span>
      <el-select class="space" size="mini" v-model="value" placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div class="dis-ib pd-l10">
        <span>欢迎您</span>,
        <span>ABC</span>
        <span>【一营】</span>,
        <span @click="clickEditPassword" class="clF29E44 cu-pt">修改密码</span>,
        <span class="clF29E44 cu-pt">退出</span>
      </div>
      <span class="login-btn cu-pt" @click="isShowLoginDialog = true">
          立即登录
      </span>
      <span class="login-btn cu-pt" @click="clickGoToAdmin">
          进入后台管理
      </span>
    </div>

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
                placeholder="请输入密码"
                prefix-icon="el-icon-s-cooperation"
                v-model="loginObj.password">
            </el-input>
          </el-form-item>
          <el-form-item prop="authCode">
            <el-input
                placeholder="请输入验证码"
                prefix-icon="el-icon-menu"
                v-model="loginObj.authCode">
              <template slot="append">
                <div>
                  ABCD
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="isShowLoginDialog = false">取 消</el-button>
        <el-button type="warning" @click="submit('loginObj')">确 定</el-button>
      </div>
    </el-dialog>


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
                placeholder="请输入旧密码"
                v-model="passwordObj.oldPassword">
            </el-input>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input
                placeholder="请输入新密码"
                v-model="passwordObj.newPassword">
            </el-input>
          </el-form-item>
          <el-form-item prop="againPassword" label="确认新密码">
            <el-input
                placeholder="请输入确认新密码"
                v-model="passwordObj.againPassword">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="isShowPasswordDialog = false">取 消</el-button>
        <el-button type="warning" @click="submit('passwordObj')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      isShowLoginDialog: false,
      loginObj: {
        name: '',
        password: '',
        authCode: '',
      },
      loginRules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        authCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
        ],
      },
      isShowPasswordDialog: false,
      passwordObj: {
        oldPassword: '',
        newPassword: '',
        againPassword: '',
      },
      passwordRules: {},
      options: [],
      value: '',
      tableData: [],
    }
  },
  methods: {
    clickEditPassword() {
      this.isShowPasswordDialog = true;
    },
    clickGoToAdmin() {
      this.$router.push('/admin');
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push('/admin');
        }
      });
    },
    MiXin_closeDialog(formName) {
      this.$refs[formName].resetFields();
    },
  },
}
</script>

<style lang="scss" scoped>
.page-header {
  user-select: none;
  height: 118px;
  .left-area {
    line-height: 118px;

    img {
      position: relative;
      top: 14px;
    }
  }

  .right-area {
    line-height: 118px;
    padding-left: 232px;
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
