import {
    api
} from '../utils/http'
import axios from 'axios'
import store from '@/store'
/** 查询列表 */
export const questionaireList = (data) => {
    return api({
        url: '/tblQuestionnaire/findList',
        data,
        method: 'post'
    })
}

/** 获取用户回答结果 */

export const questionaireFindAnswer = (data) => {
    return api({
        url: '/tblQuestionnaire/findAnswer',
        data,
        method: 'post'
    })
}
/** 导出结果 */

export const tblQuestionnaireExport = (id) => {
    return axios({
        url:process.env.VUE_APP_BASE_API + '/tblQuestionnaire/export/' + id,
        data: {},
        method: 'post',
        responseType:'blob',
        headers:{token:store.getters.token}
    })
}

/** 新增问题 */
export const questionaireAdd = (data) => {
    return api({
        url: '/tblQuestionnaire/add',
        data,
        method: 'post'
    })
}

/** 更新问题 */
export const questionaireUpdate = (data) => {
    return api({
        url: '/tblQuestionnaire/update',
        data,
        method: 'post'
    })
}

/** 查询问题详情 */
export const questionaireDetail = (id) => {
    return api({
        url: `/tblQuestionnaire/findById/${id}`,
        method: 'post'
    })
}

/** 查询问题删除 */
export const questionaireDelete = (id) => {
    return api({
        url: `/tblQuestionnaire/delById/${id}`,
        method: 'post'
    })
}

/** 变更问题状态  */
export const questionaireChange = (data) => {
    return api({
        url: '/tblQuestionnaire/changeStatus',
        data,
        method: 'post'
    })
}

/** 回答问题  */
export const questionaireAnswer = (data) => {
    return api({
        url: '/tblQuestionnaire/answer',
        data,
        method: 'post'
    })
}

/** 改变状态  */
export const questionaireStatusChange = (data) => {
    return api({
        url: '/tblQuestionnaire/changeStatus',
        data,
        method: 'post'
    })
}
