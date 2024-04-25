<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import {getStorage} from "./utils/storage/localStorage";

export default {
  mounted() {
    this.$nextTick(() => {
      let userInfo = getStorage('CookBookUserInfo')
      if (userInfo) {
        this.$store.commit('user/SET_USER', userInfo)
      }
    })
  },
}
</script>
<style lang="scss">
#app {
  height: 100vh;
}

</style>
