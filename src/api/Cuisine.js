import {api} from '../utils/http'

//新增菜品
export const tblFoodAddFood = (data = {}) => {
  return api({
    url: '/tblFood/addFood',
    method: 'POST',
    data: data
  })
}
//变更菜品状态
export const tblFoodChangeFoodStatus = (data = {}) => {
  return api({
    url: '/tblFood/changeFoodStatus',
    method: 'POST',
    data: data
  })
}
// 菜品列表查询
export const tblFoodFindList = (data = {}) => {
  return api({
    url: '/tblFood/findList',
    method: 'POST',
    data: data
  })
}
//更新菜品
export const tblFoodUpdateFood = (data = {}) => {
  return api({
    url: '/tblFood/updateFood',
    method: 'POST',
    data: data
  })
}
//获取菜品分类
export const getCuisineType = (data = {}) => {
  return api({
    url: '/sysDictType/findBykey/foodType',
    method: 'POST',
    data: data
  })
}
//基于id删除
export const tblFoodDelById = ({id}) => {
  return api({
    url: '/tblFood/delById/' + id,
    method: 'POST',
  })
}
//基于id查找
export const tblFoodFindById = ({id}) => {
  return api({
    url: '/tblFood/findById/' + id,
    method: 'POST',
  })
}
