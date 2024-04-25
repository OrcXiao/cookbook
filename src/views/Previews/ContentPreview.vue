<template>
  <!-- 内容 -->
  <div class="container-wrap">
    <h2>{{ detail.name }}</h2>
    <div class="dis-fl ag-ct mg-t10">
      <el-tag type="plain">{{MiXin_findDictValue(contentDic, detail.type) || '暂无'}}</el-tag>
      <div class="lines"></div>
      <span>浏览：{{ detail.nums }}次</span>
      <div class="lines"></div>
      <span>更新：{{ detail.updateTime }}</span>
      <div class="lines"></div>
      <span>备注：{{ detail.remark }}</span>
    </div>
    <div class="content mg-t10" v-html="detail.content || ''"></div>
  </div>
</template>
<script>
import {contentDetail} from '@/api/Content'
import { getDicTypeValue } from '@/utils/dicMap'

export default {
  name:'ContentPreview',
  data() {
    return {
      show: false,
      detail: {},
      contentDic:[]
    };
  },
  mounted(){
    this.init()
  },
  methods: {
    init() {
      contentDetail(this.$route.query.id).then(res=>{
        this.detail = res.data
        document.title = res.data.name
      })
      getDicTypeValue('contentType').then(res=>{
        this.contentDic = res
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.container-wrap{
    padding:20px 0;
    display: flex;
    flex-direction: column;
    width:100%;
    align-items: center;
}
.lines {
  height: 18px;
  width: 2px;
  background: #e5e5e5;
  margin: 0 30px;
}
.content {
  overflow-y: auto;
  width:1000px;
}
</style>
