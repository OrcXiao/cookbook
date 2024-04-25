<template>
    <my-dialog :width="'700px'" title="查看" v-model="show">
        <div class="container-wrap">
            <h2>{{detail.name}}</h2>
            <div class="dis-fl ag-ct mg-t10">
                <el-tag type="plain">{{MiXin_findDictValue($parent.contentDic, detail.type)}}</el-tag>
                <div class="lines"></div>
                <span>浏览：{{detail.nums}}次</span>
                <div class="lines"></div>
                <span>更新：{{detail.updateTime}}</span>
                <div class="lines"></div>
                <span>备注：{{detail.remark}}</span>
            </div>
            <div class="content mg-t10" v-html="detail.content || ''"></div>
        </div>
        <span slot="footer"></span>
    </my-dialog>
</template>
<script>
import { contentUpdate, contentAdd, contentDetail } from '@/api/Content';

export default {
    data(){
        return {
            show:false,
            detail:{}
        }
    },
    methods:{
        init(r){
            contentDetail(r.id,false).then(res=>{
                this.detail = res.data
                this.show = true
            })
            // this.detail = Object.assign({},r)
        }
    }
}
</script>
<style lang='scss' scoped>
    .lines{
        height:18px;
        width:2px;
        background: #e5e5e5;
        margin:0 30px;
    }
    .content{
        max-height:600px;
        overflow-y: auto;
    }
</style>
