import {api} from '../utils/http'

// 食谱汇总表列表查询
export const tblRecipesTotalFindList = (data = {}) => {
  return api({
    url: '/tblRecipesTotal/findList',
    method: 'POST',
    data: data
  })
}

// 新增食谱
export const tblRecipesTotalAdd = (data = {}) => {
  return api({
    url: '/tblRecipesTotal/add',
    method: 'POST',
    data: data
  })
}
//根据id查询食谱详情
export const tblRecipesTotalFindById = (data = {}) => {
  return api({
    url: '/tblRecipesTotal/findById/' + data.id,
    method: 'POST',
    // data: data
  })
}
//根据id删除食谱
export const tblRecipesTotalDelById = (data = {}) => {
  return api({
    url: '/tblRecipesTotal/delById/' + data.id,
    method: 'POST',
    // data: data
  })
}
//食谱发布
export const tblRecipesTotalPublished = (data = {}) => {
  return api({
    url: '/tblRecipesTotal/published',
    method: 'POST',
    data: data
  })
}
//食谱发布
export const tblRecipesTotalUpdate = (data = {}) => {
  return api({
    url: '/tblRecipesTotal/update',
    method: 'POST',
    data: data
  })
}

