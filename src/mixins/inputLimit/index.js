export default {
  data() {
    return {}
  },
  methods: {
    /**
     *输入框的判断效数判断
     * value stirng类型
     *前面多少位
     * 后面多少位
     */

    //input框的类型必须是text...
    //value,输入框传输的值..
    //before,指定小数点前面的位数..
    //after, 指定小数点后面的位数..
    //state, 是否可以输入小数点, 默认为true,可以输入小数点. / false, 不能输入小数点.

    Mixin_commonLimitInput(str, before, after, state = true) {
      let that = this;
      let value = '';
      if (str.indexOf(".") >= 0) {
        let attr1 = str.split(".")[0];
        let attr2 = str.split(".")[1];
        value = that[attr1][attr2] + ''
      } else {
        value = that[str] + ''
      }
      value = value.replace('。', '.');
      let newBefore = parseFloat(before);
      let newAfter = parseFloat(after);
      value = value.replace(/[^ \d.]|\s|^\./g, "");
      value = value.replace(/^0{2,}/g, "0");
      if (state) {
        value = value.replace(/\.{2,}/g, ".");
      } else {
        value = value.replace(/\./g, "");
      }
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      if (value.indexOf(".") >= 0) {
        value = value.split(".")[0].slice(0, newBefore) + "." + value.split(".")[1].slice(0, newAfter);
      } else {
        value = value.slice(0, newBefore);
      }
      if (str.indexOf(".") >= 0) {
        let attr1 = str.split(".")[0];
        let attr2 = str.split(".")[1];
        that[attr1][attr2] = value
      } else {
        that[str] = value
      }
    },
  }
}
