import {
  api
} from '@/utils/http'
/** 用户部分接口 */

/** 用户列表 */
export const sysUserList = (data) => {
  return api({
    url: '/sysUser/findList',
    data,
    method: 'post'
  })
}

/** 新增用户 */
export const sysUserAdd = (data) => {
  return api({
    url: '/sysUser/addUser',
    data,
    method: 'post'
  })
}

/** 更新用户 */
export const sysUserUpdate = (data) => {
  return api({
    url: '/sysUser/updateUser',
    data,
    method: 'post'
  })
}

/** 变更用户状态 */
export const sysUserChangeUserStatus = (data) => {
  return api({
    url: '/sysUser/changeUserStatus',
    data,
    method: 'post'
  })
}

/** 根据id删除 */
export const sysUserDelById = (id) => {
  return api({
    url: '/sysUser/delById/' + id,
    method: 'post'
  })
}

/** 查询用户详情 */
export const sysUserDetail = (id) => {
  return api({
    url: `/sysUser/findById/${id}`,
    method: 'post'
  })
}

/** 变更用户密码 */
export const sysUserPsChange = (data) => {
  return api({
    url: `/sysUser/changeUserPwd`,
    method: 'post',
    data
  })
}
