import * as local from './localStorage';

export default {
    vm:{},
    install(Vue){
        Vue.prototype.$storage = {
            local
        }
    }
}