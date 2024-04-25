import {
    api
} from '@/utils/http'
/** 码表值 */
/** 通过类型id查询具体值 */
export const sysDictDataByTypeId = (data) => {
    return api({
        url: '/sysDictData/findByDictTypeId',
        data,
        method: 'post'
    })
}

/** 新增字典 */
export const sysDictDataAdd = (data) => {
    return api({
        url: '/sysDictData/addDictData',
        data,
        method: 'post'
    })
}

/** 更新字典 */
export const sysDictDataUpdate = (data) => {
    return api({
        url: '/sysDictData/updateDictData',
        data,
        method: 'post'
    })
}

/** 查询字典详情 */
export const sysDictDataDetail = (id) => {
    return api({
        url: `/sysDictData/findById/${id}`,
        method: 'post'
    })
}

/** 删除字典详情 */
export const sysDictDataDelete = (id) => {
    return api({
        url: `/sysDictData/delById/${id}`,
        method: 'post'
    })
}