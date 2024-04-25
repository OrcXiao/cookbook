import {
    api
} from '../utils/http'

/** 查询列表 */
export const contentList = (data) => {
    return api({
        url: '/tblTextContent/findList',
        data,
        method: 'post'
    })
}

/** 新增内容 */
export const contentAdd = (data) => {
    return api({
        url: '/tblTextContent/add',
        data,
        method: 'post'
    })
}

/** 更新内容 */
export const contentUpdate = (data) => {
    return api({
        url: '/tblTextContent/update',
        data,
        method: 'post'
    })
}

/** 查询内容详情 */
export const contentDetail = (id,needAdd=true) => {
    return api({
        url: `/tblTextContent/findById/${id}?needaddNum=${needAdd}`,
        method: 'post'
    })
}

/** 删除内容 */
export const contentDelete = (id) => {
    return api({
        url: `/tblTextContent/delById/${id}`,
        method: 'post'
    })
}