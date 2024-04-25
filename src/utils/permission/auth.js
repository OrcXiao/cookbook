import router from "@/router";
import {getStorage} from "../storage/localStorage";

router.beforeEach(async (to, from, next) => {
  //如果跳转到非系统页, 直接跳转过去
  if (to.matched[0].path !== '/admin') {
    next()
  } else {
    //如果跳转到系统页, 判断是否登录
    let CookBookUserInfo = getStorage("CookBookUserInfo")
    //如果没有登录, 跳转到首页
    if (!CookBookUserInfo) {
      next({path: '/'});
    } else {
      //如果登录了, 判断是否有权限
      let roleType = getStorage("CookBookUserInfo").roleType;
      if ((roleType !== 'admin')) {
        next({path: '/'});
      } else {
        next()
      }
    }
  }
});
