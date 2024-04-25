
import {api} from '../utils/http'

// 首页采购情况
export const tblProcurementPlanProcurement = (data = {}) => {
  return api({
    url:  '/tblProcurementPlan/home/procurement',
    method: 'POST',
    data: data
  })
}
// 首页消耗情况
export const tblProcurementPlanOut = (data = {}) => {
  return api({
    url:  '/tblProcurementPlan/home/out',
    method: 'POST',
    data: data
  })
}


