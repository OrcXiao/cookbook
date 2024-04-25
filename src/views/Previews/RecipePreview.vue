<template>
  <div class="RecipePreview-wrap">
    <div class="te-ct fs26 ft-b">一周食谱表</div>
    <div v-if="!currentPreview" class="dis-fl ju-sb">
      <div>单位：<span>{{ currentDataAuth.dictValue || '--' }}</span></div>
      <div>制订日期：<span>{{ RecipeObj.preparationDateStart }}到 {{ RecipeObj.preparationDateEnd }}</span></div>
    </div>
    <div v-else class="dis-fl ju-sb">
      <div>单位：<span>{{ currentDataAuth.dictValue }}</span></div>
      <div>制订日期：<span>{{ mocksStartDate }}到 {{ mocksEndDate }}</span></div>
    </div>
    <div class="table-wrap mg-t10 bor-t bor-l">
      <div class="dis-fl ju-sa week-wrap">
        <div class="week-item bor-b bor-r">&nbsp; &nbsp; &nbsp;</div>
        <div class="week-item te-ct" v-for="item in weeksArr" :key="item.id">
          <div class="bor-b pd5 bor-r">{{ item.zhCN }}</div>
          <div class="bor-b pd5 bor-r">品种</div>
        </div>

      </div>
      <div class="dis-fl type-wrap">
        <div class="dis-fl ju-ct ai-ct bor-r bor-b">
          <div>
            <div class="pd-b30">早</div>
            <div class="pd-t30">餐</div>
          </div>

        </div>
        <div v-for="(item) in breakfastArr" :key="item.id">
          <div class="foods-item bor-r" v-for="(itemIn) in item.foods" :key="itemIn.id">
            <span v-if="itemIn.name"> {{ itemIn.name }}</span>
            <span v-else>/ </span>
          </div>
        </div>
      </div>

      <div class="dis-fl type-wrap">
        <div class="dis-fl ju-ct ai-ct bor-r bor-b">
          <div>
            <div class="pd-b30">午</div>
            <div class="pd-t30">餐</div>
          </div>

        </div>
        <div v-for="(item) in lunchArr" :key="item.id">
          <div class="foods-item bor-r" v-for="(itemIn) in item.foods" :key="itemIn.id">
            <span v-if="itemIn.name"> {{ itemIn.name }}</span>
            <span v-else> / </span>
          </div>
        </div>
      </div>

      <div class="dis-fl type-wrap">
        <div class="dis-fl ju-ct ai-ct bor-r bor-b">
          <div>
            <div class="pd-b30">晚</div>
            <div class="pd-t30">餐</div>
          </div>
        </div>
        <div v-for="(item) in dinnerArr" :key="item.id">
          <div class="foods-item bor-r" v-for="(itemIn) in item.foods" :key="itemIn.id">
            <span v-if="itemIn.name"> {{ itemIn.name }}</span>
            <span v-else> / </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!currentPreview" class="dis-fl ju-sb ft-b pdt5 fs18">
      <div>营长: {{ RecipeObj.battalion || '--' }}</div>
      <div>经济民主组:{{ RecipeObj.economicDemocracyGroup || '--' }}</div>
      <div>司务长:{{ RecipeObj.superintendent || '--' }}</div>
    </div>
  </div>
</template>

<script>
import {tblRecipesTotalFindById} from "../../api/Recipe";
import {getStorage} from "../../utils/storage/localStorage";
import {getDicTypeValue} from '@/utils/dicMap'

export default {
  name: "RecipePreview",
  data() {
    return {
      //食谱对象
      RecipeObj: {},

      //星期数组
      weeksArr: [
        {
          type: 'monday',
          zhCN: '星期一',
          id: 1,
          foods: [],
        },
        {
          type: 'tuesday',
          zhCN: '星期二',
          id: 2,
          foods: [],
        },
        {
          type: 'wednesday',
          zhCN: '星期三',
          id: 3,
          foods: [],
        },
        {
          type: 'thursday',
          zhCN: '星期四',
          id: 4,
          foods: [],
        },
        {
          type: 'friday',
          zhCN: '星期五',
          id: 5,
          foods: [],
        },
        {
          type: 'Saturday',
          zhCN: '星期六',
          id: 6,
          foods: [],
        },
        {
          type: 'sunday',
          zhCN: '星期日',
          id: 7,
          foods: [],
        },
      ],

      /*
      * 单独开发
      * */
      breakfastArr: [],
      lunchArr: [],
      dinnerArr: [],
      //当前预览
      currentPreview: '',
      currentDataAuth: '',
      mocksStartDate: '',
      mocksEndDate: '',
      dataAuthOptions: [],


    }
  },
  mounted() {
    document.title = '一周食谱表'
    this.$nextTick(() => {
      this.breakfastArr = this.$options.data().weeksArr
      this.breakfastArr.forEach(item => {
        item.foods = this.createArr(6)
      })
      this.lunchArr = this.$options.data().weeksArr
      this.lunchArr.map(item => {
        item.foods = this.createArr(10)
      })
      this.dinnerArr = this.$options.data().weeksArr
      this.dinnerArr.map(item => {
        item.foods = this.createArr(9)
      })
      if (this.$route.query.type === 'CookBookPreviewRecipeData') {
        this.currentPreview = 'CookBookPreviewRecipe'
        let mockData = getStorage('CookBookPreviewRecipeData')
        this.breakfastArr.forEach((item, index) => {
          let arr = mockData.breakfast[index].foods
          if (arr.length <= 6) {
            for (let i = 0, len = (6 - arr.length); i < len; i++) {
              arr.push({name: ''})
            }
          }
          item.foods = arr
        })
        this.lunchArr.forEach((item, index) => {
          let arr = mockData.lunch[index].foods
          if (arr.length <= 10) {
            for (let i = 0, len = (10 - arr.length); i < len; i++) {
              arr.push({name: ''})
            }
          }
          item.foods = arr
        })
        this.dinnerArr.forEach((item, index) => {
          let arr = mockData.supper[index].foods
          if (arr.length <= 9) {
            for (let i = 0, len = (9 - arr.length); i < len; i++) {
              arr.push({name: ''})
            }
          }
          item.foods = arr
        })

        this.mocksStartDate = mockData.date[0].replace(/\//, '年').replace(/\//, '月') + '日'
        this.mocksEndDate = mockData.date[1].replace(/\//, '年').replace(/\//, '月') + '日'
        let dataAuth = getStorage('CookBookUserInfo').dataAuth
        getDicTypeValue('dataAuth').then(res => {
          this.dataAuthOptions = res
          this.currentDataAuth = this.dataAuthOptions.find(item => item.dictKey === dataAuth)
        })
      } else {
        getDicTypeValue('dataAuth').then(res => {
          this.dataAuthOptions = res
          this.getData()
        })
      }
    });
  },
  methods: {
    createArr(max) {
      let arr = []
      for (let i = 0; i < max; i++) {
        let obj = {
          name: '',
        }
        arr.push(obj)
      }
      return arr
    },

    //获取食谱
    getData() {
      let id = this.$route.query.id;
      tblRecipesTotalFindById({id: id}).then(res => {
        this.currentDataAuth = this.dataAuthOptions.find(item => item.dictKey === res.data.dataAuth)
        this.RecipeObj = res.data;
        this.RecipeObj.preparationDateStart = res.data.preparationDateStart.replace(/\//, '年').replace(/\//, '月') + '日'
        this.RecipeObj.preparationDateEnd = res.data.preparationDateEnd.replace(/\//, '年').replace(/\//, '月') + '日'
        let arr = res.data.recipesDetailDtoList
        arr.forEach(async item => {
          if (item.meal === 'breakfast') {
            let obj = this.breakfastArr.find(itemIn => itemIn.type === item.week)
            let arr = item.foods
            if (arr.length <= 6) {
              for (let i = 0, len = (6 - arr.length); i < len; i++) {
                arr.push({name: ''})
              }
            }
            obj.foods = arr
          }
          if (item.meal === 'lunch') {
            let obj = this.lunchArr.find(itemIn => itemIn.type === item.week)
            let arr = item.foods
            if (arr.length <= 10) {
              for (let i = 0, len = (10 - arr.length); i < len; i++) {
                arr.push({name: ''})
              }
            }
            obj.foods = arr
          }
          if (item.meal === 'dinner') {
            let obj = this.dinnerArr.find(itemIn => itemIn.type === item.week)
            let arr = item.foods
            if (arr.length <= 9) {
              for (let i = 0, len = (9 - arr.length); i < len; i++) {
                arr.push({name: ''})
              }
            }
            obj.foods = arr
          }
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.RecipePreview-wrap {
  width: 1100px;
  margin: 0 auto;

  .week-wrap {
    .week-item {
      width: 12.5%
    }
  }

  .type-wrap {
    & > div {
      width: 12.5%;
    }
  }

  .foods-item {
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-bottom: 1px solid black;
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
