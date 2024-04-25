/** 在线点餐 */
import {
    api
} from '../utils/http'


/** 点餐记录 */
export const onlineOrderList = (data)=>{
    return api({url:'/tblOrder/findList',data,method:'post'})
}


export const onlineOrderOrder = (ids)=>{
    return api({url:'/tblOrder/order' , data:ids,method:"post"})
}
