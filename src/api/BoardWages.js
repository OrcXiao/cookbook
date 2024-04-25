import {
  api
} from '../utils/http'
// 交伙部分
/** 交伙管理列表 */
export const tblBoardExpensesList = (data) => {
  return api({
    url: '/tblBoardExpenses/findList',
    data,
    method: 'post'
  })
}

/** 新增交伙 */
export const tblBoardExpensesAdd = (data) => {
  return api({
    url: '/tblBoardExpenses/add',
    data,
    method: 'post'
  })
}

/** 发布交伙 */
export const tblBoardExpensesPublish = (data) => {
  return api({
    url: '/tblBoardExpenses/changeStatus',
    data,
    method: 'post'
  })
}

/** 更新交伙 */
export const tblBoardExpensesUpdate = (data) => {
  return api({
    url: '/tblBoardExpenses/update',
    data,
    method: 'post'
  })
}

/** 查询交伙详情 */
export const tblBoardExpensesDetail = (id) => {
  return api({
    url: `/tblBoardExpenses/findById/${id}`,
    method: 'post'
  })
}

/** 删除交伙 */
export const tblBoardExpensesDelete = (id) => {
  return api({
    url: `/tblBoardExpenses/delById/${id}`,
    method: 'post'
  })
}

/** 伙食账目部分 */

//伙食列表
export const tblFoodAccountList = (data) => {
  return api({
    url: '/tblFoodAccount/findList',
    data,
    method: 'post'
  })
}


/** 新增伙食账目 */
export const tblFoodAccountAdd = (data) => {
  return api({
    url: '/tblFoodAccount/add',
    data,
    method: 'post'
  })
}

/** 发布伙食账目 */
export const tblFoodAccountPublish = (data) => {
  return api({
    url: '/tblFoodAccount/changeStatus',
    data,
    method: 'post'
  })
}

/** 更新伙食账目*/
export const tblFoodAccountUpdate = (data) => {
  return api({
    url: '/tblFoodAccount/update',
    data,
    method: 'post'
  })
}

/** 查询伙食账目详情 */
export const tblFoodAccountDetail = (id) => {
  return api({
    url: `/tblFoodAccount/findById/${id}`,
    method: 'post'
  })
}

/** 删除伙食账目 */
export const tblFoodAccountDelete = (id) => {
  return api({
    url: `/tblFoodAccount/delById/${id}`,
    method: 'post'
  })
}

/** 删除伙食账目历史结余 */
export const tblFoodAccountHistory = (date) => {
  return api({
    url: `/tblFoodAccount/history`,
    method: 'post',
    data: {date}
  })
}
/*2022-08-01*/
/** 删除伙食账目历史结余 */
export const tblFoodAccountHistoryHome = (data) => {
  return api({
    url: `/tblFoodAccount/history`,
    method: 'post',
    data: data
  })
}
