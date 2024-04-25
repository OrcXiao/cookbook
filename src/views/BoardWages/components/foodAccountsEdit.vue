<template>
  <my-dialog width="700px" v-model="show" :title="isAdd ? '新增伙食帐目' : '修改伙食账目'">
    <div class="form-wrapper">
      <el-form ref="form" :model="form" :label-width="activeTag === 'money' ? '200px' : '0px'" label-position="left">
        <el-form-item label-width="0px" prop="date" :rules='[{required:true,message:"日期不可为空"}]'>
          <el-date-picker type="month"
                          class="mg-b10" v-model="form.date" placement="left"
                          placeholder="账目年月" value-format="yyyy/MM"></el-date-picker>
        </el-form-item>
        <el-tabs v-model="activeTag" type="card">
          <el-tab-pane label="伙食费" name="money"></el-tab-pane>
          <el-tab-pane label="粮食" name="food"></el-tab-pane>
        </el-tabs>
        <div v-show="activeTag === 'money'">
          <my-query-title class="mg-t10" title="本月收入（元）"></my-query-title>
          <el-row class="pd-t10">
            <el-col :span="12">
              <el-form-item label="报销伙食费 (含粮差)">
                <el-input type="number"
                          v-model="form.foodReimbursement"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursement' ,6 ,2)"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收军官（士官）伙食费">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursementOfficer' ,6 ,2)"
                          v-model="form.foodReimbursementOfficer"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收外来人员伙食费（含粮差）">
                <el-input type="number"
                          @blur="handleInput"
                          v-model="form.foodReimbursementForeign"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursementForeign' ,6 ,2)"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="粮差转入伙食">
                <el-input type="number"
                          @blur="handleInput"
                          v-model="form.foodReimbursementGrain"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursementGrain' ,6 ,2)"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="上级伙食补助">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursementSuperior' ,6 ,2)"
                          v-model="form.foodReimbursementSuperior"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本级生产收益补助">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursementStock' ,6 ,2)"
                          v-model="form.foodReimbursementStock"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="本月库存食品折款">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.foodReimbursementLevel' ,6 ,2)"
                          v-model="form.foodReimbursementLevel"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合计收入">
                <span>{{
                    sumTotal(form.foodReimbursement, form.foodReimbursementOfficer, form.foodReimbursementForeign, form.foodReimbursementGrain, form.foodReimbursementSuperior, form.foodReimbursementStock, form.foodReimbursementLevel)
                  }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <my-query-title title="本月支出（元）"></my-query-title>
          <el-row class="mg-t10">
            <el-col :span="12">
              <el-form-item label="购主副食燃料款">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.fuelPayment' ,6 ,2)"
                          v-model="form.fuelPayment"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退伙食费（含粮差）">
                <el-input type="number" @keyup.native="Mixin_commonLimitInput('form.withdrawalFoodExpenses' ,6 ,2)"
                          v-model="form.withdrawalFoodExpenses" placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="自产肉菜折款">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.meatDiscount' ,6 ,2)"
                          v-model="form.meatDiscount"
                          placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上月库存食物折款">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.inventoryDiscount' ,6 ,2)"
                          v-model="form.inventoryDiscount" placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="合计支出">
            <span>{{
                sumTotal(form.fuelPayment, form.withdrawalFoodExpenses, form.meatDiscount, form.inventoryDiscount)
              }}</span>
          </el-form-item>
          <my-query-title title="节余（元）"></my-query-title>
          <el-row>
            <el-col :span="12">
              <el-form-item label="本月节余">
                <span>{{
                    sumTotal(form.foodReimbursement, form.foodReimbursementOfficer, form.foodReimbursementForeign, form.foodReimbursementGrain, form.foodReimbursementSuperior, form.foodReimbursementStock, form.foodReimbursementLevel) - sumTotal(form.fuelPayment, form.withdrawalFoodExpenses, form.meatDiscount, form.inventoryDiscount)
                  }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计结余">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('save.foodsur' ,6 ,2)"
                          v-model="save.foodsur" placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="activeTag === 'food'">
          <el-row class="fx fxmc">
            <el-col :span="6"><span style="opacity: 0">--</span></el-col>
            <el-col :span="6">
              <span class="ft-b">面粉（千克）</span>
            </el-col>
            <el-col :span="6">
              <span class="ft-b">大米（千克）</span>
            </el-col>
            <el-col :span="6">
              <span class="ft-b">合计</span>
            </el-col>
          </el-row>
          <my-query-title class="mg-t10" title="本月收入（元）"></my-query-title>
          <el-row class="mg-t10">
            <el-col :span="6">报销粮食</el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.flourReimbursement' ,6 ,2)"
                          v-model="form.flourReimbursement" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.riceReimbursement' ,6 ,2)"
                          v-model="form.riceReimbursement" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourReimbursement, form.riceReimbursement) }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">收生产补助粮</el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.flourStorage' ,6 ,2)"
                          v-model="form.flourStorage" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.riceStorage' ,6 ,2)"
                          v-model="form.riceStorage" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourStorage, form.riceStorage) }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">收上月库存粮</el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          v-model="form.flourStock"
                          @keyup.native="Mixin_commonLimitInput('form.flourStock' ,6 ,2)" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          v-model="form.riceStock"
                          @keyup.native="Mixin_commonLimitInput('form.riceStock' ,6 ,2)" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourStock, form.riceStock) }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">合计</el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourStorage, form.flourStock, form.flourReimbursement) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{
                  sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock, form.flourStorage, form.flourStock, form.flourReimbursement)
                }}</span>
            </el-col>
          </el-row>
          <my-query-title class="mg-t10" title="本月支出（元）"></my-query-title>
          <el-row class="mg-t10">
            <el-col :span="6">伙食费消耗</el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number" @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.flourConsumption' ,6 ,2)"
                          v-model="form.flourConsumption" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number" @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.riceConsumption' ,6 ,2)"
                          v-model="form.riceConsumption" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourConsumption, form.riceConsumption) }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">自然损耗</el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number" @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.flourNaturalLoss' ,6 ,2)"
                          v-model="form.flourNaturalLoss" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number" @blur="handleInput"
                          @keyup.native="Mixin_commonLimitInput('form.riceNaturalLoss' ,6 ,2)"
                          v-model="form.riceNaturalLoss" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourNaturalLoss, form.riceNaturalLoss) }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">合计</el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.flourConsumption, form.flourNaturalLoss) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{ sumTotal(form.riceConsumption, form.riceNaturalLoss) }}</span>
            </el-col>
            <el-col :span="6">
              <span>{{
                  sumTotal(form.flourConsumption, form.flourNaturalLoss, form.riceConsumption, form.riceNaturalLoss)
                }}</span>
            </el-col>
          </el-row>
          <my-query-title class="mg-t10" title="节余（元）"></my-query-title>
          <el-row class="mg-t10">
            <el-col :span="6">本月节余</el-col>
            <el-col :span="6">
              {{
                subTotal(sumTotal(form.flourStorage, form.flourStock, form.flourReimbursement), sumTotal(form.flourConsumption, form.flourNaturalLoss))
              }}
            </el-col>
            <el-col :span="6">
              {{
                subTotal(sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock), sumTotal(form.riceConsumption, form.riceNaturalLoss))
              }}
            </el-col>
            <el-col :span="6">
              {{
                sumTotal(subTotal(sumTotal(form.flourStorage, form.flourStock, form.flourReimbursement), sumTotal(form.flourConsumption, form.flourNaturalLoss)), subTotal(sumTotal(form.riceReimbursement, form.riceStorage, form.riceStock), sumTotal(form.riceConsumption, form.riceNaturalLoss)))
              }}
            </el-col>
          </el-row>
          <el-row class="mg-t10">

            <el-col :span="6">
              累计结余
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          v-model="last.flour"
                          @keyup.native="Mixin_commonLimitInput('last.flour' ,6 ,2)" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mg-r10">
                <el-input type="number"
                          @blur="handleInput"
                          v-model="last.rice"
                          @keyup.native="Mixin_commonLimitInput('last.rice' ,6 ,2)" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              {{
                sumTotal(last.flour, last.rice)
              }}
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" :loading='loading' type="primary">{{ isAdd ? '提交新增' : '提交修改' }}</el-button>
        <el-button @click="show=false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
import {tblFoodAccountAdd, tblFoodAccountUpdate, tblFoodAccountDetail, tblFoodAccountHistory} from '@/api/BoardWages'
import Mixin_commonLimitInput from '@/mixins/inputLimit'

export default {
  mixins: [Mixin_commonLimitInput],
  data() {
    return {
      show: false,
      isAdd: true,
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
        date: ''
      },
      activeTag: 'money',
      loading: false,
      id: '',
      save: {
        foodsur: 0,//伙食费结余
      },
      last: {
        flour: '',
        rice: '',
      }
    };
  },
  methods: {
    init(r) {
      this.save.foodsur = 0
      this.show = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        Object.keys(this.form).forEach(key => {
          this.form[key] = ''
        })
        if (r) {
          this.isAdd = false;
          this.id = r.id
          tblFoodAccountDetail(r.id).then(res => {
            this.form = Object.assign(this.form, res.data)
            this.save.foodsur = res.data.foodsur
            this.last.flour = res.data.floursur
            this.last.rice = res.data.ricesur
          })
        } else {
          this.isAdd = true;
        }

      })
    },
    sumTotal() {
      let args = [...arguments]
      return (args || []).reduce((pre, next) => {
        return parseFloat(pre || 0) + parseFloat(next || 0)
      }, 0).toFixed(2)
    },
    subTotal() {
      let args = [...arguments]
      return (parseFloat(args[0]) - parseFloat(args[1])).toFixed(2)
    },
    submit() {
      const vm = this
      vm.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, vm.form)
          !vm.isAdd && (params['id'] = vm.id)
          let handler = vm.isAdd ? tblFoodAccountAdd : tblFoodAccountUpdate
          vm.loading = true
          params.foodsur = this.save.foodsur
          params.ricesur = this.last.rice
          params.floursur = this.last.flour
          handler(params).then(() => {
            vm.$message.success('操作成功');
            vm.show = false;
            vm.$parent.MiXin_searchTable();
          }).finally(() => {
            vm.loading = false
          })
        }
      })
    },
    handleInput(e) {
      e.target.value = parseFloat(e.target.value)
    },

  },
};
</script>
<style scoped lang='scss'>
/deep/ input::-webkit-inner-spin-button,
/deep/ input::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}

/deep/ input[type="number"] {
  -moz-appearance: textfield !important;
}

.form-wrapper {
  max-height: 480px;
  overflow-y: auto;
}

/deep/ .el-form-item {
  margin-bottom: 0 !important;
}

/deep/ .title-wrap {
  background: #FFFFFF;
  padding: 0 5px;
  border-left: 3px solid blue;
}

/deep/ .el-tabs {
  .el-tabs__item.is-active {

    background: #2BA847 !important;
    color: #FFFFFF;

  }

  .el-tabs__header {
    border-bottom: 1px solid #E4E7ED !important;
  }

  .el-tabs__header {
    border: none !important;
  }
}

/deep/ .el-form--label-left .el-form-item__label {
  padding-left: 5px;
}

.el-row {
  padding: 5px;
  display: flex;
  align-items: center;
}
</style>
