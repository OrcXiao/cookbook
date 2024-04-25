import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters' //vuex 计算属性
Vue.use(Vuex)
import permission from './modules/permission' // 权限控制模块
import user from './modules/user' //用户
import dictionaries from './modules/dictionaries' //码表
const store = new Vuex.Store({
  modules:{
    permission,
    user,
    dictionaries
  },
  getters
})

export default store
