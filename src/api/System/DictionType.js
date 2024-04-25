import {
    api
} from '@/utils/http'


/** 码表类型列表 */
export const sysDictTypeList = (data) => {
    return api({
        url: '/sysDictType/findList',
        data,
        method: 'post'
    })
}

/** 新增码表类型 */
export const sysDictTypeAdd = (data) => {
    return api({
        url: '/sysDictType/addDictType',
        data,
        method: 'post'
    })
}

/** 更新码表类型 */
export const sysDictTypeUpdate = (data) => {
    return api({
        url: '/sysDictType/updateDictType',
        data,
        method: 'post'
    })
}

/** 查询码表类型详情 */
export const sysDictTypeDetailById = (id) => {
    return api({
        url: `/sysDictType/findById/${id}`,
        method: 'post'
    })
}

/** 通过Key查询码表类型详情 */
export const sysDictTypeDetailByKey = (id) => {
    return api({
        url: `/sysDictType/findBykey/${id}`,
        method: 'post'
    })
}

/** 删除码表类型详情 */
export const sysDictTypeDelete = (id) => {
    return api({
        url: `/sysDictType/delById/${id}`,
        method: 'post'
    })
}