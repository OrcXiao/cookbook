<template>
  <div class="admin-wrap">
    <AdminHeader></AdminHeader>
    <el-container class="admin-box">
      <el-aside width="200px">
        <Nav></Nav>
      </el-aside>
      <el-main class="body-wrap">
        <div class="dis-fl pd-b20">
          <div class="fs14 cl666666">当前位置 :</div>
          <div class="pd-t3 pd-l10">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item) in breadList" :key="item.path" :to="item.path">{{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AdminHeader from '@/components/AdminHeader'
import Nav from '@/components/Nav'

export default {
  name: "index",
  components: {
    AdminHeader,
    Nav,
  },
  data() {
    return {
      breadList: null
    }
  },
  watch: {
    $route() {
      this.getBread()
    }
  },
  created() {
    this.getBread()
  },
  mounted() {
    document.title = '线上食谱定制系统'

  },
  methods: {
    getBread() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const one = matched[0] || {}
      const menu = this.$store.getters.menuList
      let parent = menu.find(item => item.children.map(item => item.path).some(t => t === one.path))
      parent && matched.unshift({
        meta: {title: parent.title},
        path: ''
      })
      this.breadList = matched
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-wrap {
  height: 100%;
  .admin-box {
    .body-wrap{
      min-height: calc(100vh - 72px);
    }
  }
}
</style>
