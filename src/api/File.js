/** 文件相关 */
import {api} from '../utils/http'
import axios from 'axios'
import store from '@/store'
/** 文件上传 */
export function fileUpload(data){
    return api({url: '/file/fileUpload',data ,method:'post',headers:{"Content-Type":"multipart/form-data"}})
}

/** 文件下载 */
export function fileDown(params){
    return api({url:'/file/fileDownload',params})
}

/** 模板下载 */

export function fileTempleteDown(type){
    return axios({url:process.env.VUE_APP_BASE_API + `/file/templateDownload/${type}`,responseType:'blob',headers:{token:store.getters.token}})
}