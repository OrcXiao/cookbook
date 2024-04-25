import * as bus from './event'

export default {
    vm:{},
    install(Vue){
        Vue.prototype.$bus = bus
    }
}