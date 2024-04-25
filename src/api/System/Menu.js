import {
    api
} from '@/utils/http'


/** 菜单列表 */
export const sysMenuList = (data) => {
    return api({
        url: '/sysMenu/findList',
        data,
        method: 'post'
    })
}

/** 新增菜单 */
export const sysMenuAdd = (data) => {
    return api({
        url: '/sysMenu/add',
        data,
        method: 'post'
    })
}

/** 更新菜单 */
export const sysMenuUpdate = (data) => {
    return api({
        url: '/sysMenu/update',
        data,
        method: 'post'
    })
}

/** 变更菜单状态 */
export const sysMenuChangeStatus = (data) => {
    return api({
        url: '/sysMenu/changeStatus',
        data,
        method: 'post'
    })
}

/** 查询菜单详情 */
export const sysMenuDetail = (id) => {
    return api({
        url: `/sysMenu/findById/${id}`,
        method: 'post'
    })
}

/** 删除菜单详情 */
export const sysMenuDelete = (id) => {
    return api({
        url: `/sysMenu/delById/${id}`,
        method: 'post'
    })
}