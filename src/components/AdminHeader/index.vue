<template>
  <div class="header-wrap dis-fl ju-sb">
    <div class="left-wrap">
      <img class="logo" src="../../assets/img/logo.jpg" alt="">
      <span class="pd-l20 cl0061b2">线上食谱定制系统</span>
    </div>
    <div class="right-wrap cl0061b2">
      <span>欢迎管理员，admin</span>
      <span class="pd-l20 pd-r20 cu-pt">修改密码</span>
      <i class="el-icon-switch-button logout cu-pt"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.header-wrap {
  border-bottom: 1px solid #efe9e9;

  & > .left-wrap {
    padding-left: 20px;
    line-height: 70px;

    .logo {
      position: relative;
      top: 5px;
    }
  }

  & > .right-wrap {
    line-height: 70px;
    .logout{
      padding: 10px;
    }
  }
}
</style>
