<template>
  <my-dialog v-model="show" title="意见详情">
    <div class="content">
      <span class="ft-b fs18">{{detail.title}}</span>
      <div class="dis-fl ag-ct mg-t10">
        <span>来源：{{MiXin_findDictValue($parent.authDic,detail.dataAuth)}}</span>
        <div class="line"></div>
        <span>提交时间：{{detail.createTime}}</span>
        <div class="line"></div>
        <span class="cl409eff">浏览次数 {{detail.nums}}次</span>
      </div>
      <div class="text fs14 cl666666 mg-t20">
        <span>{{ detail.content }}</span>
      </div>

      <div v-if="detail.status === 'replied'" class="pd-t50">
        <div class="fs18 ft-b">管理员回复</div>
        <div class="pd-t10 pd-b10">回复时间: {{detail.replayTime}}</div>
        <div class="pd5 replayContent">
          {{detail.replayContent}}
        </div>
      </div>

      <div v-else class="dis-fl ag-ct pd-t20">
        <el-input class="mg-r20" type="textarea" placeholder="请输入回复内容，内容公开请妥善回复" v-model="msg"></el-input>
        <el-button type="primary" :loading='loading' @click="submit">回复</el-button>
      </div>
    </div>
    <span slot="footer"></span>
  </my-dialog>
</template>
<script>
import { opinionReply } from '@/api/Opinion'
export default {
  data() {
    return {
      show: false,
      msg: '',
      loading:false,
      detail:{}
    }
  },
  methods: {
    init(r) {
      this.msg = ''
      this.show = true
      this.detail = r
    },
    submit() {
      if (this.msg === '') return this.$message.warning('请输入回复意见')
      this.loading = true
      opinionReply({replayContent:this.msg,id:this.detail.id}).then(()=>{
        this.$message.success('回复成功')
        this.show = false
        this.$parent.MiXin_searchTable()
      }).finally(() =>{
        this.loading = false
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
  background: #f3f3f3;
}
</style>
