import * as date from './moment'

const install = {
    vm:{},
    install(Vue){
        Vue.prototype.$date = date
    }
}
export default install
