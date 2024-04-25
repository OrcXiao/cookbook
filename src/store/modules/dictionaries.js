
import {sysDictTypeDetailByKey} from '@/api/System/DictionType'

const state = {
    dicHashMap:{}
}


const mutations = {
  /** 更新字典 */
  updateDic(state,data){
      state.dicHashMap = data
  }
};

//异步提交
const actions = {
   ac_getDic({commit,state},key){
    return sysDictTypeDetailByKey(key).then(res=>{
        state['dicHashMap'][key] = res.data 
        commit('updateDic',state['dicHashMap'])
        return Promise.resolve(res.data)
    }).catch(err=>{
        return Promise.reject(err)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
