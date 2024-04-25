/**
 * @description 中间件通讯
 */
import Vue from 'vue'
let vm = new Vue() //实例化中间件
/**
 *
 * 监听事件
 * @export
 * @param {string} eventName
 * @param {Function} handler
 */
export function onEvent(eventName,handler){
    vm.$on(eventName, handler);
}

/**
 * 发起事件
 *
 * @export
 * @param {string} eventName
 * @param {string|object} param
 */
export function callEvent(eventName,param){
    vm.$emit(eventName, param);
}

/**
 *注销事件
 *
 * @export
 * @param {*} eventName
 */
export function offEvent(eventName){
    vm.$off(eventName);
}