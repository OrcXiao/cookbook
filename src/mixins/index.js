const obj = {
  data() {
    return {}
  },
  methods: {
    //弹框关闭
    MiXin_closeDialog(obj) {
      this.$refs[obj].resetFields();
      this[obj] = this.$options.data()[obj];
    },
    //查询表格
    MiXin_searchTable(ref='table'){
      this.$refs[ref] && this.$refs[ref].loadData(true)
    },
    /**
     * 字典专用
     * @param {String|Nunber} key 通过哪个字段找寻 
     * @param {*} value 对应字段的想要找寻的值 
     */
    MiXin_findDictValue(list,value,returnValue='dictValue',key='dictKey'){
      let item = list.find(item=>item[key] == value)
      return  item ? item[returnValue] : ''
    }
  }
}

export default obj

