<template>
  <div class="dis-fl ju-ct">
    <div class="EnquiryPreview-wrap">
      <div class="fs36 ft-b te-ct pd-t40 pd-b40">
        {{ date }}询价及定价表
      </div>
      <table class="wd100" border>
        <thead>
        <tr>
          <td>品名</td>
          <td>单位</td>
          <td>分类</td>
          <td>达达超市</td>
          <td>沃尔玛超市</td>
          <td>广平市场</td>
          <td>滨河市场</td>
          <td>佳佳超市</td>
          <td>合计</td>
          <td>平均价</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in tableData" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.measures }}</td>
          <td>{{ renderTypeText(item.type) }}</td>
          <td>{{ renderValue(item.dada) }}</td>
          <td>{{ renderValue(item.woerma) }}</td>
          <td>{{ renderValue(item.guangping) }}</td>
          <td>{{ renderValue(item.binghe) }}</td>
          <td>{{ renderValue(item.jiajia) }}</td>
          <td> {{ renderNum(item.total) }}</td>
          <td> {{ renderNum(item.ave) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {tblInquiryFindById, tblInquiryFindList} from "../../api/Enquiry";
import {getStorage} from "../../utils/storage/localStorage";
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "EnquiryPreview",
  data() {
    return {
      tableData: [],
      inquiryTypeOptions: [],
      date: ''
    }
  },
  computed: {
    currentDataAuth: function () {
      let res = getStorage('CookBookCurrentDataAuth')
      return res || {}
    }
  },
  mounted() {
    document.title = '月询价公开'
    this.getDic()
    this.getData()

  },
  methods: {
    //获取码表
    getDic() {
      Promise.all([getDicTypeValue('inquiryType')]).then(res => {
        let {0: inquiryType} = res
        this.inquiryTypeOptions = inquiryType
      })
    },
    getData() {
      let date = this.$route.query.id
      let year = date.substring(0, 4)
      let month = date.substring(4, 6)
      this.date = year + '年' + month + '月'
      let params = {
        date: date,
        pagination: {
          pageNum: 1,
          pageSize: 10000,
        },
        type: ""
      }
      tblInquiryFindList(params).then(res => {
        if (+res.code === 200) {

          this.tableData = res.data
        }
      })
    },
    renderTypeText(val) {
      let obj = this.inquiryTypeOptions.find(item => item.dictKey === val)
      return obj ? obj.dictValue : ''
    },
    renderNum(num) {
      if (typeof num === 'number') {
        return num.toFixed(2)
      }
    },
    renderValue(value) {
      return !parseFloat(value) ? '' : value
    }
  },
}
</script>

<style lang="scss" scoped>
.EnquiryPreview-wrap {

  thead {
    td {
      padding: 20px 10px;
      text-align: center;
      background: #f5f7fa;
    }
  }

  tbody {
    td {
      text-align: center;
      padding: 5px;
    }

  }

}
</style>
