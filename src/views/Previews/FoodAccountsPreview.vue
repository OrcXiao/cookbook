<template>
  <div class="FoodAccounts-wrap">
    <div class="te-ct fs32 ft-b pd10">
      {{ form.date.replace(/\//, '年') }}月伙食账目公布表
    </div>
    <div class="dis-fl">
      <div class="area-wrap">
        <div class="fs22 ft-b">
          一、伙食费
        </div>
        <div class="box">
          <table border>
            <thead>
            <tr>
              <td width="30">区分</td>
              <td class="te-ct">伙食费</td>
              <td class="te-ct">金额(元)</td>
            </tr>

            </thead>
            <tbody>
            <tr>
              <td>本月收入</td>
              <td class="data">
                <div>报销伙食费（含粮差）</div>
                <div>收军官（士官）伙食费</div>
                <div>收外来人员伙食费（含粮差）</div>
                <div>粮差转入伙食</div>
                <div>上级伙食补助</div>
                <div>本级生产收益补助</div>
                <div>本月库存食品折款</div>
                <div></div>
                <div class="te-ct">合计</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ form.foodReimbursement }}</div>
                <div class="te-ct">{{ form.foodReimbursementOfficer }}</div>
                <div class="te-ct">{{ form.foodReimbursementForeign }}</div>
                <div class="te-ct">{{ form.foodReimbursementGrain }}</div>
                <div class="te-ct">{{ form.foodReimbursementSuperior }}</div>
                <div class="te-ct">{{ form.foodReimbursementStock }}</div>
                <div class="te-ct">{{ form.foodReimbursementLevel }}</div>
                <div></div>
                <div class="te-ct">
                  <span>
                    {{
                      sumTotal(form.foodReimbursement, form.foodReimbursementOfficer, form.foodReimbursementForeign, form.foodReimbursementGrain, form.foodReimbursementSuperior, form.foodReimbursementStock, form.foodReimbursementLevel)
                    }}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>本月支出</td>
              <td class="data">
                <div>购买副食燃料款</div>
                <div>退伙食费（含粮差）</div>
                <div>自产肉菜折款</div>
                <div>上月库存食物折款</div>
                <div></div>
                <div class="te-ct">合计</div>
                <div class="te-ct">本月节余</div>
                <div class="te-ct">累计节余</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ form.fuelPayment }}</div>
                <div class="te-ct">{{ form.withdrawalFoodExpenses }}</div>
                <div class="te-ct">{{ form.meatDiscount }}</div>
                <div class="te-ct">{{ form.inventoryDiscount }}</div>
                <div class="te-ct"></div>
                <div class="te-ct">
                  {{
                    sumTotal(form.fuelPayment, form.withdrawalFoodExpenses, form.meatDiscount, form.inventoryDiscount)
                  }}
                </div>
                <div class="te-ct">
                  <span>{{
                      sumTotal(form.foodReimbursement, form.foodReimbursementOfficer, form.foodReimbursementForeign, form.foodReimbursementGrain, form.foodReimbursementSuperior, form.foodReimbursementStock, form.foodReimbursementLevel) - sumTotal(form.fuelPayment, form.withdrawalFoodExpenses, form.meatDiscount, form.inventoryDiscount)
                    }}</span>
                </div>
                <div class="te-ct">{{ form.foodsur }}</div>
              </td>
            </tr>
            </tbody>
          </table>

        </div>

      </div>
      <div class="area-wrap">
        <div class="fs22 ft-b">
          二、粮食
        </div>
        <div class="box">
          <table border>
            <thead>
            <tr>
              <td width="30">区分</td>
              <td class="te-ct">项目</td>
              <td class="te-ct">面粉（千克）</td>
              <td class="te-ct">大米（千克）</td>
              <td class="te-ct">合计（千克）</td>
            </tr>

            </thead>
            <tbody>
            <tr>
              <td>本月收入</td>
              <td class="data">
                <div>报销粮食</div>
                <div>收生产补助粮</div>
                <div>收上月库存粮</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">合计</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ form.flourReimbursement }}</div>
                <div class="te-ct">{{ form.flourStorage }}</div>
                <div class="te-ct">{{ form.flourStock }}</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">{{ sumTotal(form.flourStorage, form.flourStock, form.flourReimbursement) }}</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ form.riceReimbursement }}</div>
                <div class="te-ct">{{ form.riceStorage }}</div>
                <div class="te-ct">{{ form.riceStock }}</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">
                  {{ sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock) }}
                </div>
              </td>
              <td class="data">
                <div class="te-ct">{{ sumTotal(form.flourReimbursement, form.riceReimbursement) }}</div>
                <div class="te-ct">{{ sumTotal(form.flourStorage, form.riceStorage) }}</div>
                <div class="te-ct">{{ sumTotal(form.flourStock, form.riceStock) }}</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">
                  {{
                    sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock, form.flourStorage, form.flourStock, form.flourReimbursement)
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td>本月支出</td>
              <td class="data">
                <div>伙食消耗粮</div>
                <div></div>
                <div></div>
                <div></div>
                <div>自然损耗</div>
                <div class="te-ct">合计</div>
                <div class="te-ct">本月节余</div>
                <div class="te-ct">累计节余</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ form.flourConsumption }}</div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">{{ form.flourNaturalLoss }}</div>
                <div class="te-ct">
                  {{ sumTotal(form.flourConsumption, form.flourNaturalLoss) }}
                </div>
                <div class="te-ct">
                  {{
                    sumTotal(form.flourStorage, form.flourStock, form.flourReimbursement) - sumTotal(form.flourConsumption, form.flourNaturalLoss)
                  }}
                </div>
                <div class="te-ct">{{ form.floursur }}</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ form.riceConsumption }}</div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">{{ form.riceNaturalLoss }}</div>
                <div class="te-ct">
                  {{ sumTotal(form.riceConsumption, form.riceNaturalLoss) }}
                </div>
                <div class="te-ct">
                  {{
                    sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock) - sumTotal(form.riceConsumption, form.riceNaturalLoss)
                  }}
                </div>
                <div class="te-ct">{{ form.ricesur }}</div>
              </td>
              <td class="data">
                <div class="te-ct">{{ sumTotal(form.flourConsumption, form.riceConsumption) }}</div>
                <div></div>
                <div></div>
                <div></div>
                <div class="te-ct">{{ sumTotal(form.flourNaturalLoss, form.riceNaturalLoss) }}</div>
                <div class="te-ct">
                  {{
                    sumTotal(form.flourConsumption, form.flourNaturalLoss, form.riceConsumption, form.riceNaturalLoss)
                  }}
                </div>
                <div class="te-ct">
                  {{
                    sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock, form.flourStorage, form.flourStock, form.flourReimbursement) - sumTotal(form.flourConsumption, form.flourNaturalLoss, form.riceConsumption, form.riceNaturalLoss)
                  }}
                </div>
                <div class="te-ct">
                  {{ sumTotal(form.floursur, form.ricesur) }}
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
    <div class="dis-fl ju-sb ft-b pd-t20">
      <div>伙食单位: {{ dataAuth }}</div>
      <div>军人委员会主任：{{ form.director }}</div>
      <div>司务长：{{ form.superintendent }}</div>
    </div>
  </div>
</template>

<script>
import {tblFoodAccountDetail, tblFoodAccountHistory, tblFoodAccountHistoryHome} from '@/api/BoardWages'
import {getStorage} from "../../utils/storage/localStorage";
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "FoodAccountsPreview",
  data() {
    return {
      form: {
        foodReimbursement: '',
        foodReimbursementOfficer: '',
        foodReimbursementForeign: '',
        foodReimbursementGrain: '',
        foodReimbursementSuperior: '',
        foodReimbursementStock: '',
        foodReimbursementLevel: '',
        fuelPayment: '',
        withdrawalFoodExpenses: '',
        meatDiscount: '',
        inventoryDiscount: '',
        flourReimbursement: '',
        riceReimbursement: '',
        flourStorage: '',
        riceStorage: '',
        flourStock: '',
        riceStock: '',
        flourConsumption: '',
        riceConsumption: '',
        flourNaturalLoss: '',
        riceNaturalLoss: '',
        date: '',
        foodsur: 0,//伙食费结余
        foodstuffSur: 0,//粮食结余
        floursur: 0,//面粉结余
        ricesur: 0,//大米结余

      },
      // save: {
      //   foodsur: 0,//伙食费结余
      //   foodstuffSur: 0,//粮食结余
      //   floursur: 0,//面粉结余
      //   ricesur: 0,//大米结余
      // },
      dataAuthOptions: [],
      dataAuth: '',

    }
  },
  computed: {
    currentDataAuth: function () {
      return getStorage('CookBookCurrentDataAuth')
    },
  },
  mounted() {

    this.getDic()
  },
  methods: {
    getDic() {
      Promise.all([getDicTypeValue('dataAuth')]).then(async res => {
        this.dataAuthOptions = res[0]
        this.getData()
      })
    },

    getData() {
      let id = this.$route.query.id
      tblFoodAccountDetail(id).then(res => {
        if (+res.code === 200) {
          this.form = Object.assign(this.form, res.data)
          let obj = this.dataAuthOptions.find(item => item.dictKey === res.data.dataAuth)
          this.dataAuth = obj.dictValue
          document.title = '账目公布表'
        }
      })
    },
    sumTotal() {
      let args = [...arguments]
      let val = (args || []).reduce((pre, next) => {
        return parseFloat(pre || 0) + parseFloat(next || 0)
      }, 0)
      if (!val) {
        return 0
      } else {
        return val.toFixed(2)
      }
    },

  },
}
</script>

<style lang="scss" scoped>
.FoodAccounts-wrap {
  width: 1200px;
  margin: 0 auto;

  .area-wrap {
    width: 50%;

    .box {
      border: 2px solid black;
      width: 95%;

      table {
        width: 100%;

        tr > td:first-child {
          text-align: center;
        }

        td.data > div {
          padding-left: 5px;
          border-bottom: 1px solid gray;
          height: 32px;
          line-height: 32px;
        }

      }
    }
  }
}
</style>
