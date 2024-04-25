<template>
  <div class="title-wrap dis-fl ju-sb">
    <div class="left-wrap">
      <span>查询列表</span>
      <span v-if="tips" class="pd-l10 clf56c6c">
        ({{ tips }})
      </span>
    </div>
    <div class="right-wrap">
      <slot name="btns">

      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    tips: {
      type: String,
      default: '',
    },
    btns: {
      type: Array,
      default: function () {
        return []
      },
    },
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
