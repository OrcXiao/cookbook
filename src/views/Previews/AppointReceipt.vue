<template>
  <div class="AppointReceipt-wrap">
    <div class="fs40 te-ct ft-b pd40">
      副食品采购预约（验收）单
    </div>
    <div class="dis-fl ju-sb pd-b20">
      <div>单位 : {{ currentDataAuth.dictValue }}</div>
      <div>日期 : {{ details.createTime }}</div>
    </div>
    <div>
      <table class="wd100" border>
        <thead>
        <tr>
          <td>序号</td>
          <td>品名</td>
          <td>单位</td>
          <td>预约数量</td>
          <td>实收数量</td>
          <td>单价</td>
          <td>金额</td>
          <td>备注</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableData" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.inquiryDto.name }}</td>
          <td>{{ item.inquiryDto.measures }}</td>
          <td>{{ item.planNums }}</td>
          <td>{{ item.inNums }}</td>
          <td>{{ item.inquiryDto.ave.toFixed(2) }}</td>
          <td>{{ item.total.toFixed(2) }}</td>
          <td>{{ item.remark }}</td>
        </tr>
        <tr>
          <td colspan="5"></td>
          <td>合计</td>
          <td>
            {{ this.totalNum.toFixed(2) }}
          </td>
        </tr>
        </tbody>
      </table>
      <div class="bor-all">
        <div class="pd-t20 pd-b20 bor-b">供应商签字：</div>
        <div class="te-ct ft-b fs22 bor-b pd-t20 pd-b20">伙食单位相关人员签字</div>
        <div>
          <div>伙食单位军官（生活服务中心主任）：</div>
          <div class="dis-fl  pd-t20 pd-b20">
            <div style="width: 200px">司 务 长：</div>
            <div>炊事班班长（副班长）：</div>
          </div>
          <div class="pd-b10">厨房值班员：</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {tblProcurementPlanFindById} from "../../api/Purchase";
import {getDicTypeValue} from '@/utils/dicMap'
import {getStorage} from "../../utils/storage/localStorage";

export default {
  name: "AppointReceipt",
  data() {
    return {
      details: {},
      tableData: [],
      dataAuthOptions: [],
      totalNum: 0,
      currentDataAuth: {},
    }
  },
  mounted() {
    document.title = '副食品采购预约（验收）单'
    getDicTypeValue('dataAuth').then(res => {
      this.dataAuthOptions = res
      this.getPlanDetails()
    })
  },
  methods: {
    getPlanDetails() {
      let id = this.$route.query.id;
      tblProcurementPlanFindById(id).then(async res => {
        if (+res.code === 200) {
          this.details = res.data
          this.tableData = res.data.planDetails
          this.totalNum = 0
          this.tableData.forEach(item => {
            this.totalNum += item.total
          })
          this.currentDataAuth = this.dataAuthOptions.find(item => item.dictKey === res.data.dataAuth)
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.AppointReceipt-wrap {
  width: 1150px;
  margin: 0 auto;

  td {
    padding: 5px;
  }

  .bor-l {
    border-left: 1px solid black;
  }

  .bor-r {
    border-right: 1px solid black;
  }

  .bor-t {
    border-top: 1px solid black;
  }

  .bor-b {
    border-bottom: 1px solid black;
  }

  .bor-all {
    border: 1px solid black;
  }
}
</style>
