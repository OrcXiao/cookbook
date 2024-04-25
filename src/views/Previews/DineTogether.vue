<template>
  <div class="DineTogether-wrap pd-t20">
    <div class="te-ct ft-b fs18">
      {{ detail.name }}
    </div>
    <div class="dis-fl ju-ct pd-t10 pd-b30">
      <div class="type mg-r20">会餐食谱</div>
      <div>更新：{{ detail.updateTime }}</div>
    </div>
    <div v-html=" detail.content ">
    </div>
  </div>
</template>

<script>
import {contentDetail} from '@/api/Content'

export default {
  name: "DineTogether",
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    })
  },
  methods: {
    getData() {
      contentDetail(this.$route.query.id).then(res => {
        this.detail = res.data
        document.title = this.detail.name
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.DineTogether-wrap {
  width: 700px;
  height: 1000px;
  margin: 0 auto;

  .type {
    color: #409eff;
    padding: 3px;
    border: 1px solid #409eff;
  }
}
</style>
