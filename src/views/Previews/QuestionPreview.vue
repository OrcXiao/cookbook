<template>
  <!-- 问卷调查 -->
  <div class="QuestionPreview">
    <h2>{{ obj.name }}</h2>
    <div class="dis-fl ag-ct mg-t10">
      <el-tag style="border-color: #00c50d; color: #00c50d" type="plain">{{
        MiXin_findDictValue(authDic, obj.dataAuth) || '暂无'
      }}</el-tag>
      <el-tag class="mg-l20 mg-r20" type="plain">问卷</el-tag>
      <span>更新：{{ obj.createTime }}</span>
    </div>
    <div class="headers-btns">
        <div v-if="obj.answerDetails && obj.answerDetails.length" class="dis-fl ag-ct" style="background:rgba(0, 123, 255, 1);color: #FFFFFF;padding:0 10px;border-radius:4px;">
            你已完成该问卷的填写 <el-button class="mg-l5" type="text" style="color:#fff" @click="$router.push('/')">立即返回</el-button>
        </div>
        <div v-else class="dis-fl ag-ct" style="background:rgba(0, 123, 255, 1);color: #FFFFFF;padding:0 10px;border-radius:4px;">
            已完成填写({{computedTotal()}}/{{questionDetails.length}}) <el-button class="mg-l5" type="text" style="color:#fff" @click="submit">立即提交</el-button>
        </div>
      </div>
    <div class="questino-container">
      <div class="question-item" v-for="(item, index) in questionDetails" :key="index">
        <div class="item-header">
            <el-tag type="plain">{{MiXin_findDictValue(typeDic, item.type)}}</el-tag>
            <div class="item-content">
                <div class="item-content-top dis-fl">
                    <div style="width:15px">
                     <span style="color:red" v-if="MiXin_findDictValue(whetherDic, item.required) === '是'">*</span>
                    </div>
                    <span>问题{{index+1}}：</span>
                    <span>{{item.name}}</span>
                </div>
                <div class="item-content-detail">
                    <el-input v-model="item.textAnswer" :rows="4" type="textarea" v-if="MiXin_findDictValue(typeDic, item.type) === '文本'"></el-input>
                    <div v-else-if="MiXin_findDictValue(typeDic, item.type) === '单选'">
                        <el-radio-group v-model="item.radioAnswer">
                            <el-radio v-for="(q,i) in item.contents.filter(t=>t!=='*')" :key="i" :label="q"></el-radio>
                        </el-radio-group>
                    </div>
                    <div v-else>
                        <el-checkbox-group v-model="item.answer">
                            <el-checkbox v-for="(q,i) in item.contents.filter(t=>t!=='*')" :key="i" :label="q"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { questionaireDetail, questionaireAnswer , questionaireFindAnswer} from '@/api/Questionnaire';
import { getDicTypeValue } from '@/utils/dicMap';

export default {
  name: 'QuestionPreview',
  data() {
    return {
      obj: {},
      questionDetails: [], //问题列表
      authDic: [],
      releaseDic: [],
      whetherDic: [],
      typeDic: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    computedTotal(){
        return this.questionDetails.filter(item=>{
            return (this.MiXin_findDictValue(this.typeDic, item.type) === '文本' && item.textAnswer !== '')
            || (this.MiXin_findDictValue(this.typeDic, item.type) === '单选' && item.radioAnswer !== '')
            || (this.MiXin_findDictValue(this.typeDic, item.type) === '多选' && item.answer.length)
        }).length
    },
    submit(){
        const vm = this
        let requiredList = vm.questionDetails.filter(item=>vm.MiXin_findDictValue(vm.whetherDic, item.required) === '是')
        if(requiredList.filter(item=>{
            return (vm.MiXin_findDictValue(vm.typeDic, item.type) === '文本' && item.textAnswer !== '')
            || (vm.MiXin_findDictValue(vm.typeDic, item.type) === '单选' && item.radioAnswer !== '')
            || (vm.MiXin_findDictValue(vm.typeDic, item.type) === '多选' && item.answer.length)
        }).length !== requiredList.length) return vm.$message.error('请完成所有必填项')
        let params = vm.questionDetails.map(item=>{
            let content = this.MiXin_findDictValue(this.typeDic, item.type) === '文本' ? [item.textAnswer] : this.MiXin_findDictValue(this.typeDic, item.type) === '单选' ? [item.radioAnswer] : item.answer
            return {
                id:item.id,
                content
            }
        })
        questionaireAnswer(params).then(res=>{
            this.$message.success('提交成功')
            this.$router.replace('/')
        })
    },
    init() {
      Promise.all([
        getDicTypeValue('questionnaireStatus'),
        getDicTypeValue('dataAuth'),
        getDicTypeValue('questionnaireType'),
        getDicTypeValue('whether'),
      ]).then((res) => {
        let { 0: status, 1: auth, 2: type, 3: whether } = res;
        this.releaseDic = status;
        this.authDic = auth;
        this.typeDic = type;
        this.whetherDic = whether;
        questionaireFindAnswer({pagination:{pageSize:10,pageNum:1},id:this.$route.query.id,createById:this.$store.getters.user.id}).then((res) => {
          this.obj = res.data;
          document.title = this.obj.name
          this.questionDetails = res.data.details.map(item=>{
            return Object.assign({answer:[],textAnswer:'',radioAnswer:''},item)
          })
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.QuestionPreview {
  width: 1000px;
  height: 100vh;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin:0 auto;
}
.questino-container {
  display: flex;
  flex-direction: column;
//   align-items: center;
  padding:50px 0;
  width:800px;
}
.item-header{
    display: flex;
    flex-direction:flex-start;
    width:100%;
}
.item-content{
    margin-left:15px;
}

.question-item{
    padding:20px;
}
.item-content-detail{
    margin-top:20px;
}
.headers-btns{
    position: absolute;
    right:0px;
    top:50px;
}
</style>
