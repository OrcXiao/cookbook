/**
 * @description 本地 localStorage 
 */

 /**
  *
  * 设置缓存
  * @export
  * @param {string} key
  * @param {any} value
  */
 export function setStorage(key,value){
    return localStorage.setItem(key,typeof(value) === 'object' ? JSON.stringify(value):value)
 }

/**
 *
 * 获取指定key缓存
 * @export
 * @param {string} key
 */
export function getStorage(key){
    try{
        let res = JSON.parse(localStorage.getItem(key))
        return res 
    }catch(err){
        return localStorage.getItem(key)
    }
}

/**
 *
 * 移除指定缓存
 * @export
 * @param {string} key
 */
export function removeStorage(key){
    return localStorage.removeItem(key)
}

/**
 * 清除所有缓存
 * @export
 * @return {*} 
 */
export function removeAll(){
    return localStorage.clear()
}