<template>
  <div class="title-wrap dis-fl ju-sb">
    <div class="left-wrap">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    title: {
      type: String,
      default: '查询条件'
    }
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.title-wrap {

  padding: 5px 10px;
  border-left: 5px solid #409eff;
  background-color: #f3f3f3;
  font-weight: 400;
  color: #606266;

  & > .left-wrap {
    line-height: 40px;
  }
}
</style>
