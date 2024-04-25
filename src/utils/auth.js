/** 
 * cookie tenantId 
 * storage session_id refresh_id token相关相关
 * cookie 可配置过期时间 可自行添加
 * 详情参见 https://www.jb51.net/article/136942.htm
 */

import {setStorage , getStorage , removeStorage} from './storage/localStorage'
const ACCESS_TOKEN = 'COOK_BOOK_AUTH'


// access-token
export function getToken() {
  return getStorage(ACCESS_TOKEN)
}

export function setToken(token) {
  return setStorage(ACCESS_TOKEN, token)
}

export function removeToken() {
  return removeStorage(ACCESS_TOKEN)
}



