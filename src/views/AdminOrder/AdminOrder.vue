<template>
  <div class="index-wrap">
    <my-query @searchData='MiXin_searchTable("table")' :formConfig="formConfig" :formModel="formModel">
    </my-query>
    <my-table ref="table" :data="loadData" :columns="columns" rowKey='id'>
      <span slot="img" slot-scope="{row}">
        <img :src="row.img" width="180px" alt="">
      </span>
      <span slot="type" slot-scope="{text}">
        {{MiXin_findDictValue(foodTypeDic,text)}}
      </span>
      <span slot="dataAuth" slot-scope="{text}">
        {{MiXin_findDictValue(authDic,text)}}
      </span>
    </my-table>
  </div>
</template>

<script>
import { getDicTypeValue } from '@/utils/dicMap'
import { onlineOrderList } from '@/api/OnlineOrder'
const columns = [
  {
    label: '菜品名称',
    prop: 'name',
  },
  {
    label: '菜品分类',
    prop: 'type',
    slotName: 'type'
  },
  {
    label: '二级分类',
    prop: 'reclassify',
  },
  {
    label: '口味',
    prop: 'remark',
  },
  {
    label: '点餐人',
    prop: 'createBy',
  },
  {
    label: '数据来源',
    prop: 'dataAuth',
    slotName: 'dataAuth'
  },
  {
    label: '提交时间',
    prop: 'createTime',
  },
]
export default {
  name: "AdminOrder",
  components: {},
  data() {
    return {
      columns,
      formConfig: {
        forms: [
          {
            type: 'input',
            label: '菜品名称',
            prop: 'name',
          },
          {
            type: 'select',
            label: '菜品分类',
            prop: 'type',
            options: [],
            opLabel: 'dictValue',
            opValue: 'dictKey',
            changeEvent: this.selectChange
          },
          {
            type: 'input',
            label: '二级分类',
            prop: 'reclassify',
          },
          {
            type: 'input',
            label: '点餐人',
            prop: 'createBy',
          },
          {
            type: 'date',
            label: '提交时间',
            prop: 'date'
          }
        ]
      },
      loadData: (p) => {
        const params = Object.assign({ pagination: p }, this.formModel)
        if (params['date']) {
          params['createTimeStart'] = params['date'] + ' ' + '00:00:00'
          params['createTimeEnd'] = params['date'] + ' ' + '23:59:59'
          delete params.date
        }
        return onlineOrderList(params)
      },
      formModel: {
        name: '',
        type: '',
        reclassify: '',
        createBy: '',
        date: this.$date.moment().format('yyyy/MM/DD')
      },
      foodTypeDic: [],
      authDic: []
    }
  },
  mounted() {
    this.getDic()
  },
  methods: {
    //获取码表
    getDic() {
      Promise.all([getDicTypeValue('foodType'), getDicTypeValue('dataAuth')]).then(res => {
        let { 0: food, 1: auth } = res
        this.foodTypeDic = food
        this.authDic = auth
        this.formConfig.forms.find(item => item.prop === 'type').options = food.map(item => {
          return {
            label: item.dictValue,
            value: item.dictKey
          }
        })
      })
    },
    //二级分类下拉框改变时
    selectChange(val) {
      this.formModel.reclassify = ''
      if (val === 'huncai') {
        this.formConfig.forms[2] = {
          type: 'select',
          label: '二级分类',
          prop: 'reclassify',
          options: [
            {
              dictValue: '猪肉类',
              dictKey: '猪肉类',
            },
            {
              dictValue: '牛肉类',
              dictKey: '牛肉类',
            },
            {
              dictValue: '羊肉类',
              dictKey: '羊肉类',
            },
            {
              dictValue: '鸡肉类',
              dictKey: '鸡肉类',
            },
            {
              dictValue: '鸭肉类',
              dictKey: '鸭肉类',
            },
            {
              dictValue: '水产肉类',
              dictKey: '水产肉类',
            },
          ],
          opLabel: 'dictValue',
          opValue: 'dictKey',
        }
      } else if (val === 'shucai') {
        this.formConfig.forms[2] = {
          type: 'select',
          label: '二级分类',
          prop: 'reclassify',
          options: [
            {
              dictValue: '时令蔬菜',
              dictKey: '时令蔬菜',
            },
            {
              dictValue: '叶菜类',
              dictKey: '叶菜类',
            },
            {
              dictValue: '根茎类',
              dictKey: '根茎类',
            },

          ],
          opLabel: 'dictValue',
          opValue: 'dictKey',
        }
      } else {
        this.formConfig.forms[2] = {
          type: 'input',
          label: '二级分类',
          prop: 'reclassify',
        }
      }
    },

  }
}
</script>

<style lang="scss" scoped>
</style>
