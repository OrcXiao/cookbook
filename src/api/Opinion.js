import {
    api
} from '../utils/http'

/** 查询列表 */
export const opinionList = (data) => {
    return api({
        url: '/tblOpinion/findList',
        data,
        method: 'post'
    })
}

/** 新增意见 */
export const opinionAdd = (data) => {
    return api({
        url: '/tblOpinion/addOpinion',
        data,
        method: 'post'
    })
}

/** 意见回复 */
export const opinionReply = (data) => {
    return api({
        url: '/tblOpinion/reply',
        data,
        method: 'post'
    })
}

/** 查询意见详情 */
export const opinionDetail = (id) => {
    return api({
        url: `/tblOpinion/findById/${id}`,
        method: 'post'
    })
}

/** 删除意见 */
export const opinionDelete = (id) => {
    return api({
        url: `/tblOpinion/delById/${id}`,
        method: 'post'
    })
}

/** 变更意见公开状态 */
export const opinionChangeOpen = (data) => {
    return api({
        url: '/tblOpinion/changeOpinionOpen',
        method: 'post',
        data
    })
}