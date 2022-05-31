<template>
    <div class="admin-wrap">
      <AdminHeader></AdminHeader>

      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <router-view/>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import AdminHeader from '@/components/AdminHeader'
export default {
  name: "index",
  components:{
    AdminHeader
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.admin-wrap{
  height: 100vh;
}
</style>
