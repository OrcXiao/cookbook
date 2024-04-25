<template>
  <div class="TodayConsumePreview-wrap">
    <div class="fs36 ft-b te-ct pd-t40 pd-b40">
      每日消耗表({{ date }})
    </div>
    <div>
      <my-table :isFixedHeight="true" :pageSize='5' ref="consume" :isAuto="false"
                :showPagination="false"
                :isPaginationRight="true"
                :tableData="consumeTableData"
                :columns="consumeColumns">
      </my-table>

    </div>
  </div>
</template>

<script>
import {tblProcurementPlanOut} from "../../api/Home";
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "TodayConsumePreview",
  data() {
    return {
      date: '',
      currentDataAuth: '',
      meals: [],
      consumeTableData: [],
      consumeTime: '',
      /*
       * 每日消耗
       * */
      consumeColumns: [
        {
          label: '区分',
          width: '50',
          prop: 'meal'
        }
      ],

    }
  },
  async mounted() {
    this.date = this.$route.query.date
    await Promise.all([getDicTypeValue('inquiryType'), getDicTypeValue('dataAuth'), getDicTypeValue('meals')]).then(res => {
      let {0: inquiryType, 1: dataAuth, 2: meals} = res
      inquiryType.forEach((item, index) => {
        let obj = {}
        obj.label = item.dictValue
        obj.width = 71
        obj.prop = item.dictKey
        this.consumeColumns.push(obj)
      })
      this.meals = meals
      this.currentDataAuth = dataAuth.length ? dataAuth[0].dictKey : ''
    })
    this.getTblProcurementPlanOut()
  },
  methods: {

    getTblProcurementPlanOut() {
      let params = {
        outTimeStart: this.date + ' 00:00:00',
        outTimeEnd: this.date + ' 23:59:59',
        dataAuth: this.currentDataAuth,
      }
      tblProcurementPlanOut(params).then(res => {
        if (+res.code === 200) {
          if (res.data.length) {
            this.createArr()
            res.data.forEach(item => {
              let obj = this.consumeTableData.find(item2 => item2.mealType === item.meal)
              obj[item.type] = item.total
            })
          } else {
            this.consumeTableData = []
          }
        }
      })
    },
    createArr() {
      this.meals.forEach((item, index) => {
        let obj = {}
        this.consumeColumns.forEach((itemIn, indexIn) => {
          if (indexIn === 0) {
            obj[itemIn.prop] = item.dictValue
            obj.mealType = item.dictKey
          } else {
            obj[itemIn.prop] = ''
          }
        })
        this.consumeTableData.push(obj)
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.TodayConsumePreview-wrap {
  width: 1188px;
  margin: 0 auto;
}
</style>
