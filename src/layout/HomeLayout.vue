<template>
  <div class="admin-wrap">
    <HomeHeader></HomeHeader>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import HomeHeader from '../components/HomeHeader'

export default {
  name: "index",
  components: {
    HomeHeader
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.admin-wrap {
  height: 100vh;
}
</style>
