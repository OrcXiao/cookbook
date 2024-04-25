import {api} from '../utils/http'

//询价分类
export const getEnquiryType = (data = {}) => {
  return api({
    url: '/sysDictType/findBykey/inquiryType',
    method: 'POST',
    data: data
  })
}
// 查询分组
export const tblInquiryFindGroup = (data = {}) => {
  return api({
    url: '/tblInquiry/findGroup',
    method: 'POST',
    data: data
  })
}
//询价列表查询
export const tblInquiryFindList = (data = {}) => {
  return api({
    url: '/tblInquiry/findList',
    method: 'POST',
    data: data
  })
}
//新增询价
export const tblInquiryAdd = (data = {}) => {
  return api({
    url: '/tblInquiry/add',
    method: 'POST',
    data: data
  })
}
//更新询价
export const tblInquiryUpdate = (data = {}) => {
  return api({
    url: '/tblInquiry/update',
    method: 'POST',
    data: data
  })
}
//根据id查找数据
export const tblInquiryFindById = ({id}) => {
  return api({
    url: '/tblInquiry/findById/' + id,
    method: 'POST',
  })
}
//根据id删除数据
export const tblInquiryDelById = ({id}) => {
  return api({
    url: '/tblInquiry/delById/' + id,
    method: 'POST',
  })
}
