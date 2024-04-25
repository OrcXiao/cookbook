<template>
  <div class="Rendezvous-wrap pd-t40">
    <div class="te-ct fs32 ft-b">{{ year }}年{{ month }}月交伙情况</div>
    <div class="pd-t20 pd-b20">单位：<span>{{ currentDataAuth.dictValue || '--' }}</span></div>
    <table class="wd100" border>
      <thead>
      <tr>
        <td width="50">序号</td>
        <td>姓名</td>
        <td>次数</td>
        <td>标准</td>
        <td>金额</td>
        <td>备注</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.days }}</td>
        <td>{{ item.standard }}</td>
        <td>{{ item.sum }}</td>
        <td>{{ item.remark }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {getStorage} from "../../utils/storage/localStorage";
import {tblBoardExpensesDetail} from '@/api/BoardWages'
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "Rendezvous",
  data() {
    return {
      tableData: [],
      year: '',
      month: '',
      dataAuthOptions: [],
      currentDataAuth: {},
    }
  },
  mounted() {
    getDicTypeValue('dataAuth').then(res => {
      this.dataAuthOptions = res
      this.getData()
    })
  },
  methods: {
    getData() {
      let id = this.$route.query.id;
      tblBoardExpensesDetail(id).then(res => {
        if (+res.code === 200) {
          this.currentDataAuth = this.dataAuthOptions.find(item => item.dictKey === res.data.dataAuth)
          this.year = res.data.date.substring(0, 4)
          this.month = res.data.date.substring(5, 7)
          this.tableData = res.data.details
          document.title = '交伙情况'
        }
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.Rendezvous-wrap {
  width: 900px;
  margin: 0 auto;

  td {
    padding: 10px 0;
    text-align: center;
  }
}
</style>
