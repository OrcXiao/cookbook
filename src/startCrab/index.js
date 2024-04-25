/** 注册文件 */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/common.scss";
import MyTable from "@/components/MyTable";
import MyDialog from '@/components/MyDialog'
import MyQueryTitle from '@/components/MyQueryTitle'
import MyTableTitle from '@/components/MyTableTitle'
import MyQuery from '@/components/MyQuery'
import "@/utils/permission/auth";
import axios from "@/utils/http";
import date from "@/utils/date";
import bus from "@/utils/eventBus";
import storage from "@/utils/storage";
import MiXins from '../mixins'

export function startCrab(Vue) {
  Vue.use(axios).use(date).use(bus).use(storage);
  Vue.use(ElementUI);
  Vue.component("my-table", MyTable);
  Vue.component("my-dialog", MyDialog)
  Vue.component("my-query-title", MyQueryTitle);
  Vue.component("my-table-title", MyTableTitle);
  Vue.component("my-query", MyQuery);
  Vue.mixin(MiXins)
}

/*
* ElementUI全局配置
* */
// 全局关闭点遮罩关闭弹框
ElementUI.Dialog.props.closeOnClickModal.default = false;
// 全局关闭点遮罩关闭弹框
ElementUI.Dialog.props.closeOnPressEscape.default = false;
