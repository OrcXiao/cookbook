<template>
  <el-menu
      :default-active="defaultActive"
      router
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-submenu
        :index="index + ''"
        v-for="(item, index) in $store.getters.menuList"
        :key="index">
      <template slot="title">
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
            v-for="(itemIn) in item.children"
            :key="itemIn.path"
            :index="itemIn.path">
          {{ itemIn.title }}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      defaultActive: '',
    }
  },
  watch:{
    '$route':{
      handler(val){
        this.defaultActive = val.path;
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
}
</style>
