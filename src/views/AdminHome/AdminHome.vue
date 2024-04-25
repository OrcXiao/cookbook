<template>
  <div class="AdminHome-wrap">
    <p class="fs26 ft-b te-ct cl409eff pd-t40">欢迎使用本系统，选择左侧菜单开始使用！</p>
  </div>
</template>

<script>
export default {
  name: "AdminHome",
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.AdminHome-wrap{
  min-height: 80%;
  height: calc(100vh - 160px);
  background: url("../../assets/img/welcome.png") no-repeat;
  background-size: cover;
}
</style>
