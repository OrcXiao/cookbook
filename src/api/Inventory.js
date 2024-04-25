import {api} from '../utils/http'

//库存详情查询
export const tblStockFindDetail = (data = {}) => {
  return api({
    url: '/tblStock/findDetail',
    method: 'POST',
    data: data
  })
}

//库存列表查询
export const tblStockFindList = (data = {}) => {
  return api({
    url: '/tblStock/findList',
    method: 'POST',
    data: data
  })
}
//获取菜品分类
export const getType = (data = {}) => {
  return api({
    url: '/sysDictType/findBykey/wareType',
    method: 'POST',
    data: data
  })
}
//副食出入库登记表
export const tblStockFindDate = (data = {}) => {
  return api({
    url: '/tblStock/findDate',
    method: 'POST',
    data: data
  })
}

