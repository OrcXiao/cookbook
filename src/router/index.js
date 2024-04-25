import Vue from "vue";
import VueRouter from "vue-router";
import routerDefalt from "./routes";

Vue.use(VueRouter);

const createRouter = (routes = routerDefalt) =>
  new VueRouter({
    base: "",
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes,
  });
const router = createRouter();
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(routes = routerDefalt) {
  router.matcher = createRouter(routes).matcher; // reset route
}

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

export const routes = routerDefalt
export default router;
