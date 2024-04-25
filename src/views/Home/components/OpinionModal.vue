<template>
  <my-dialog width="700px" custom-class="query-opinion-dialog" v-model="show" title="查看意见">
    <div class="content">
      <span class="ft-b fs18">{{ detail.title }}</span>
      <div class="dis-fl ag-ct mg-t10">
        <span>来源：{{ MiXin_findDictValue($parent.authDic, detail.dataAuth) }}</span>
        <div class="line"></div>
        <span>提交时间：{{ detail.createTime }}</span>
        <div class="line"></div>
        <span class="cl409eff">浏览次数 {{ detail.nums }}次</span>
      </div>
      <div class="text fs14 cl666666 mg-t20">
        <span>{{ detail.content }}</span>
      </div>
      <div v-if="detail.status === 'replied'" class="pd-t50">
        <div class="fs20 ft-b">管理员回复 :</div>
        <div class="pd-t10 pd-b10">回复时间 : {{ detail.updateTime }}</div>
        <div class="replayContent">
          <span>{{ detail.replayContent }}</span>
        </div>
      </div>
    </div>
    <span slot="footer"></span>
  </my-dialog>
</template>
<script>
import {opinionDetail} from '@/api/Opinion.js'
export default {
  data() {
    return {
      show: false,
      msg: '',
      loading: false,
      detail: {}
    }
  },
  methods: {
    init(r) {
      this.msg = ''
      this.show = true
      opinionDetail(r.id).then(res=>{
        this.$emit('success')
        this.detail = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.line {
  width: 1px;
  height: 15px;
  background: #727b84;
  margin: 0 15px;
}

.text {
  line-height: 20px;
}
.replayContent{
  padding: 10px;
  background: #f3f3f3;
}


</style>
