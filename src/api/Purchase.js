import {api} from '../utils/http'

/*
* 采购计划
* */
// 查询采购计划列表
export const tblProcurementPlanFindList = (data = {}) => {
  return api({
    url: '/tblProcurementPlan/findList',
    method: 'POST',
    data: data
  })
}
// 新增采购计划
export const tblProcurementPlanAdd = (data = {}) => {
  return api({
    url: '/tblProcurementPlan/add',
    method: 'POST',
    data: data
  })
}
// 更新采购详情
export const tblProcurementPlanUpdate = (data = {}) => {
  return api({
    url: '/tblProcurementPlan/update',
    method: 'POST',
    data: data
  })
}
// 发布
export const tblProcurementPlanChangeStatus = (data = {}) => {
  return api({
    url: '/tblProcurementPlan/changeStatus',
    method: 'POST',
    data: data
  })
}
// 查询采购详情
export const tblProcurementPlanFindById = (id) => {
  return api({
    url: '/tblProcurementPlan/findById/' + id,
    method: 'POST',
    data: {}
  })
}
// 新增出/入库
export const tblProcurementPlanHousing = (data = {}) => {
  return api({
    url: '/tblProcurementPlan/housing',
    method: 'POST',
    data: data
  })
}

//基于id删除
export const tblProcurementPlanDelById = ({id}) => {
  return api({
    url: '/tblProcurementPlan/delById/' + id,
    method: 'POST',
  })
}
// 库存出入库分组查询
export const tblStockFindGroup = (data = {}) => {
  return api({
    url: '/tblStock/findGroup',
    data: data,
    method: 'POST',
  })
}
