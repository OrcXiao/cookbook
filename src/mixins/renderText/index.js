export default {
  data() {
    return {}
  },
  methods: {
    //渲染状态文本
    mixin_renderStatusText(row) {
      return row.status === 'unpublished' ? '未发布' : '已发布'
    },
  }
}
