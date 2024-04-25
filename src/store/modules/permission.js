import { routes } from "@/router";
import { resetRouter } from "@/router";
/** 获取按钮权限hashMap */
const menu =[
  {
    title: '菜品管理',
    children: [
      {
        title: '菜品管理',
        path: '/Cuisine',
      },
    ]
  },
  {
    title: '食谱管理',
    children: [
      {
        title: '食谱管理',
        path: '/Recipe',
      },
    ]
  },
  {
    title: '采购管理',
    children: [
      {
        title: '采购计划',
        path: '/ProcurementPlan',
      },
      {
        title: '库存管理',
        path: '/Inventory',
      },
      {
        title: '询价管理',
        path: '/Enquiry',
      },
      {
        title: '副食出(入)库登记表',
        path: '/OutInRegistrationForm',
      },
    ]
  },
  {
    title: '点餐管理',
    children: [
      {
        title: '点餐管理',
        path: '/AdminOrder',
      },
    ]
  },
  {
    title: '系统管理',
    children: [
      {
        title: '用户管理',
        path: '/User',
      },
      // {
      //   title: '菜单管理',
      //   path: '/Menu',
      // },
      {
        title: '字典管理',
        path: '/Dictionaries',
      },
    ]
  },
  {
    title: '内容管理',
    children: [
      {
        title: '内容管理',
        path: '/Content',
      },
    ]
  },
  {
    title: '意见管理',
    children: [
      {
        title: '意见管理',
        path: '/Opinion',
      },
    ]
  },
  {
    title: '问卷管理',
    children: [
      {
        title: '问卷管理',
        path: '/Questionnaire',
      },
    ]
  },
  {
    title: '在线点餐',
    children: [
      {
        title: '在线点餐',
        path: '/OnlineOrder',
      },
    ]
  },
  {
    title: '伙食费管理',
    children: [
      {
        title: '伙食账目管理',
        path: '/FoodAccounts',
      },
       {
        title: '交伙管理',
        path: '/PartnerFood',
      },
    ]
  },
]
const state = {
  routes: [], //路由
  menuList: menu, //菜单数据
  mode: "all", //两种路由模式 后端模式 all 与 前端模式 intelligence
};

const mutations = {
  /** 设置路由 */
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
};

const actions = {
  //设置路由 现在两种模式
  async setRoutes({ commit, state }) {
    let { mode } = state;
    let accessRoutes = [];
    if (mode === "all") {
      console.log('all');
    } else {
      accessRoutes = [...routes];
      commit("user/SET_ROLES", ["admin"], { root: true });
      commit("SET_ROUTES", accessRoutes);
      await resetRouter(accessRoutes);
      return Promise.resolve(accessRoutes);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
