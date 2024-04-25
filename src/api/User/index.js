import {api} from '@/utils/http'

/** 登录 */
export function Login(data){
    return api({url:'/sysUser/load',method:'post',data})
}
