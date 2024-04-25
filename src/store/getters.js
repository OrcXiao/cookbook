//vuex getters like computed
export default {
  token: state => state.user.token,  // 用户唯一token
  roles: state => state.user.roles, //角色信息
  menuRoute: state => state.permission.routes,
  user: state => state.user.user, //用户信息
  menuList: state => state.permission.menuList,
  dicHashMap: state => state.dictionaries.dicHashMap,
  currentDataAuth: state => state.user.currentDataAuth,
}
