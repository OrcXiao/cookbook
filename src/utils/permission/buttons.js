/** 按钮权限部分 */
import Vue from 'vue'
import store from '@/store'

export default {
    vm:{},
    install(Vue){
        Vue.prototype.$auth = (key)=>{
            const buttonsActions = store.getters.buttonsAction //按钮权限hashMap
            const roles = store.getters.roles
            return roles.indexOf('admin')>=0 ||buttonsActions[key] //管理员权限则不需要按钮
        }
    }
}