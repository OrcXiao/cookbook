<template>
  <div class="NonStapleFood-wrap">
    <div class="te-ct fs32 ft-b pd10">
      副食出(入)库登记表
    </div>
    <div class="mg-t20">
      <table border class="te-ct">
        <thead>
        <tr>
          <td width="50">序号</td>
          <td width="150">日期</td>
          <td width="150">品名</td>
          <td width="150">
            <div class="num-td">数量(千克)</div>
            <div class="dis-fl ju-ct num-wrap">
              <div>入库</div>
              <div>出库</div>
            </div>
          </td>
          <td width="150">原库存数 <br>(千克)</td>
          <td width="150">现库存数 <br>(千克)</td>
          <td width="150">经办人</td>
          <td width="150">备注</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableData" :key="item">
          <td>{{ index + 1 }}</td>
          <td>
            {{ item.date.replace(/\//, '年').replace(/\//, '月') + '日' }}
          </td>
          <td>
            {{ item.inquiryDto.name }}
          </td>
          <td>
            <div class="dis-fl ju-ct num-wrap">
              <div>{{ item.inNums }}</div>
              <div>{{ item.outNums }}</div>
            </div>
          </td>
          <!--          <td>{{ item.hisNums }}</td>-->
          <!--          <td>{{ item.nowNums }}</td>-->
          <td></td>
          <td></td>
          <td>{{ item.operator.join(',') }}</td>
          <td>{{ item.remark }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {tblStockFindGroup} from '../../api/Purchase'

export default {
  name: "NonStapleFood",
  data() {
    return {
      date: '',
      tableData: [],
    }
  },
  mounted() {
    document.title = '副食出(入)库登记表'
    this.date = this.$route.query.date
    this.getData()
  },
  methods: {
    getData() {
      let params = {}
      params.createTimeStart = this.date + ' 00:00:00'
      params.createTimeEnd = this.date + ' 23:59:59'
      tblStockFindGroup(params).then(res => {
        if (res.code === "200") {
          this.tableData = res.data
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.NonStapleFood-wrap {
  width: 1000px;
  margin: 0 auto;

  .num-td {
    border-bottom: 1px solid black;
  }

  .num-wrap {
    & > div {
      flex: 1;
    }

    & > div:first-child {
      border-right: 1px solid black;
    }
  }
}

</style>
