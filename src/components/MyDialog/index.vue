<template>
  <el-dialog :top="top" :custom-class="customClass" :visible.sync='dialogVisible' :title="title" :width='width' @open='$emit("open")' @close='$emit("close"),$emit("input",dialogVisible)'>
    <slot />
    <span slot="footer">
      <slot name="footer">
        <div class="dis-fl ju-ct pd-t20">
          <el-button @click="no">取 消</el-button>
          <el-button :loading='yesLoading' type="warning" @click="yes">确 定</el-button>
        </div>
      </slot>
    </span>
  </el-dialog>
</template>
<script>
/**
	@propery
	   value: Boolean 以v-model形式绑定
	@event
	   yes: {() => void} 确定事件
	   no: {() => void} 取消事件
       close:{()=> void} 关闭事件
 */
import { Dialog } from 'element-ui'
export default {
  props: {
    ...Dialog.props,
    width: {
      type: String,
      default: () => '700px'
    },
    top: {
      type: String,
      default: () => '5vh'
    },
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    customClass:{
      type: String,
      default: ''
    }
  },
  computed: {
    yesLoading() {
      return this.loading
    }
  },
  watch: {
    value(o, n) {
      if (o !== n) {
        this.dialogVisible = o
      }
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      dialogVisible: this.value
    }
  },
  methods: {
    yes() {
      this.$emit('yes')
    },
    no() {
      this.$emit('no')
      this.autoClose && (this.dialogVisible = false, this.$emit('input', this.dialogVisible))
    }
  }
}
</script>
