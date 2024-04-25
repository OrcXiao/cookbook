import {api} from '../utils/http'

export const sysUserCaptchaImage = () => {
  return api({
    url: '/sysUser/captchaImage',
    method: 'GET',
  })
}
export const sysUserLoad = (data = {}) => {
  return api({
    url: '/sysUser/load',
    method: 'POST',
    data: data
  })
}
export const sysUserLogout = (data = {}) => {
  return api({
    url: '/sysUser/logout',
    method: 'POST',
    data: data
  })
}
export const sysUserUserinfo = (token) => {
  return api({
    url: '/sysUser/userinfo/' + token,
    method: 'POST',
  })
}
