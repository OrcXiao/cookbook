import axios from "axios";
import {getToken} from "@utils/auth";
import {Message} from 'element-ui'
import store from "../../store";
import router from "../../router";
import domMessage from './messageOnce'
// new 对象实例
const messageOnce = new domMessage()
let whiteApiList = []; //接口白名单
import qs from "qs";
//统一中文提示map包
const CODE_MESSAGE = {
  200: "服务器成功返回请求数据",
  201: "新建或修改数据成功",
  202: "一个请求已经进入后台排队（异步任务）",
  204: "删除数据成功",
  400: "发出信息有误",
  401: "用户没有权限（令牌、用户名、密码错误）",
  403: "用户得到授权，但是访问是被禁止的",
  404: "访问资源不存在",
  406: "请求格式不可得",
  410: "请求资源被永久删除，且不会被看到",
  500: "服务器发生错误",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时",
};
const baseURL = process.env.VUE_APP_BASE_API
const contentType = 'application/json;charset=UTF-8'
const timeout = 20000
/**
 *
 * @param 统一处理 返回的DATA数据
 */
const handleData = async ({data, status}) => {
  if (+status === 200) {
    if (+data.code === 200) {
      return Promise.resolve(data);
    } else if (+data.code === 201) {
      await router.push({path: '/'})
      messageOnce.warning('请重新登录')
      store.commit('user/RESET_USER')
    } else {
      let msg = data.data || '请求出错'
      Message.error(msg)
      return Promise.reject(data);
    }
  } else {
    let msg = data.data || '请求出错'
    Message.error(msg)
    return Promise.reject(data);
  }
};


/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": contentType,
    'Cache-Control': 'no-cache',
  },
});

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    let token = getToken();
    if (token && whiteApiList.indexOf(config.url) < 0) {
      config.headers.token = token;
    }
    if (
      config.data &&
      config.headers["Content-Type"] ===
      "application/x-www-form-urlencoded;charset=UTF-8"
    ) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    Message.error(error.message || "未可知错误，请联系管理员处理",)
    return Promise.reject(error);
  }
);

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    return handleData(response);
  },
  (error) => {
    if (error.response.status === 401) {
      console.log(401);
    } else {
      const msg = CODE_MESSAGE[error.response.status];
      Message.error(msg || "未可知错误，请联系管理员处理",)
    }
    return Promise.reject(error);
  }
);

const installer = {
  vm: {},
  install(Vue) {
    Vue.prototype.$ajax = instance;
  },
};
export const api = instance;

export default installer;
