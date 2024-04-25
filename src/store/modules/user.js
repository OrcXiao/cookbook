//user store module
import {getToken, removeToken, setToken} from "@/utils/auth";
import {setStorage, removeStorage} from "../../utils/storage/localStorage"
import {
  sysUserLoad,
  sysUserUserinfo,
} from "../../api/Login";

const _defaultUser = () => {
  return {
    token: getToken() || "", // 唯一token
    roles: [],//角色
    user: {}, //用户相关系信息
    currentDataAuth: {},//当前所在的机构
  };
};
const state = _defaultUser();


const mutations = {
  /** 重置用户信息 */
  RESET_USER(state) {
    removeToken();
    removeStorage('CookBookUserInfo')
    removeStorage('CookBookCurrentDataAuth')
    removeStorage('CookBookPreviewRecipeData')
    removeStorage('COOK_BOOK_AUTH')
    Object.assign(state, _defaultUser())
  },
  /** 设置token  */
  SET_TOKEN(state, token) {
    state.token = token;
  },
  /** 设置角色 */
  SET_ROLES(state, role) {
    state.roles = role;
  },
  /** 设置用户 */
  SET_USER(state, user) {
    state.user = user
  },
  /** 设置当前的食堂 */
  SET_CURRENTDATAAUTH(state, currentDataAuth) {
    state.currentDataAuth = currentDataAuth
    setStorage('CookBookCurrentDataAuth', currentDataAuth)
  }
};

//异步提交
const actions = {
  //登录
  async _ac_login({commit}, payload) {
    try {
      let res = await sysUserLoad(payload)
      if (res.data) {
        try {
          let userInfo = await sysUserUserinfo(res.data)
          commit('SET_TOKEN', res.data)
          commit('SET_USER', userInfo.data)
          setToken(res.data)
          setStorage('CookBookUserInfo', userInfo.data)
          return Promise.resolve(userInfo)
        } catch (err) {
          return Promise.reject(err)
        }
      } else {
        return Promise.reject()
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
  //退出登录
  _ac_loginOut({commit}) {
    commit('RESET_USER')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
