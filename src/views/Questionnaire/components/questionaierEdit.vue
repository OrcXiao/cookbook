<template>
  <!-- 问卷新增编辑 -->
  <div class="questionaierEdit wrap">
    <span class="cl666666 ft-b">{{ isAdd ? '新增问卷' : '编辑问卷' }}</span>
    <el-divider></el-divider>
    <div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="问卷名称" prop="name" :rules="[{ required: true, message: '问卷名称不可为空' }]">
          <el-input v-model="form.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="问卷说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="发布单位" prop="dataAuth" :rules="[{ required: true, message: '发布单位不可为空' }]">
          <!-- <el-select v-model="form.type">
            <el-option v-for="item in $parent.authDic" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
            </el-option>
          </el-select> -->
          <el-checkbox-group v-model="form.dataAuth">
            <el-checkbox v-for="item in $parent.authDic" :key="item.dictKey" :label="item.dictKey">
              {{ item.dictValue }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="问卷内容">
          <div class="dis-fl">
            <div class="content-wrap">
              <div class="dis-fl ag-ct mg-b10" v-for="(item, index) in form.details || []" :key="index">
                <div class="title">{{ item.title }}</div>
                <el-input class="width300 mg-r10" v-model="item.name" placeholder="请输入问题名称"></el-input>
                <el-button :style="{'opacity':item.title !== '文本'? 1 : 0}" @click="editQuestion(item ,index)"
                           type="text" class="mg-l10 mg-r10">编辑
                </el-button>
                <el-checkbox v-model="item.required"></el-checkbox>
                <div class="mg-l10 mg-r10" style="width: 40px">必填</div>
                <i @click="clickRemove(index)" class="el-icon-delete mg-r10 cu-pt" style="color: red"></i>
              </div>
            </div>
            <div style="flex: 1;min-width:200px">
              <el-button type="primary" @click="addQuestion">添加</el-button>
              <div class="type-wrap" v-show="showType">
                <el-button v-for="(item,index) in $parent.typeDic" :key="index" type="text" @click="addType(item)">
                  {{ item.dictValue }}
                </el-button>
                <!-- <el-button type="text" @click="addType(1)">单选</el-button>
                <el-button type="text" @click="addType(2)">文本</el-button> -->
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="dis-fl ju-ct pd-t20">
      <el-button @click="submit" type="primary" :loading='loading'>提交保存</el-button>
      <el-button @click="$parent.isEdit = false">取消</el-button>
    </div>

    <my-dialog :title="detail.title" v-model="showContent" @yes='confirm'>
      <div>最多支持5项({{ detail.content && detail.content.length || 0 }}/5)</div>
      <draggable v-model="detail.content" @update="listUpdate">
        <div class="dis-fl mg-t10 ag-ct" v-for="(item,index) in detail.content" :key="index">
          <span style="width:60px">问题{{ index + 1 }}</span>
          <el-input style="width:370px;" class="mg-l10 mg-r10" :maxlength="20" v-model="item.content"
                    placeholder="请输入选项,长度不超过20"></el-input>
          <i class="el-icon-s-operation mg-r10 acIcon"></i>
          <i class="el-icon-delete mg-r10 acIcon" @click="deleteQues(index)" style="color:red"></i>
          <el-button style="background:#E5E5E5;opacity:.9;" v-show="index === 0" type="default" @click="addQues"><i
              class="el-icon-plus"></i> 添加选项
          </el-button>
        </div>
      </draggable>
    </my-dialog>

  </div>
</template>
<script>
const quetionsMap = {};
import draggable from 'vuedraggable'
import {questionaireAdd, questionaireUpdate, questionaireDetail} from '@/api/Questionnaire'
import {deepClone} from '@/utils'
export default {
  data() {
    return {
      isAdd: true,
      form: {
        details: [],
        dataAuth: [],
        name: '',
        remark: ''
      },
      showType: false,
      detail: {}, //编辑的问题
      editIndex: -1, //编辑问题的下标
      showContent: false,
      loading: false,
      id: ''
    };
  },
  components: {draggable},
  created() {
    this.$parent.typeDic.forEach(item => {
      quetionsMap[item.dictKey] = {
        title: item.dictValue,
        name: '',
        required: false,
        content: [{content: ''}],
        type: item.dictKey
      }
    })
  },
  methods: {
    init(r) {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        if (r) {
          this.isAdd = false;
          this.id = r.id
          questionaireDetail(r.id).then(res => {
            this.form.name = res.data.name
            this.form.dataAuth = res.data.dataAuth.split(',')
            this.form.remark = res.data.remark
            this.form.details = res.data.details.map(item => {
              return {
                title: this.MiXin_findDictValue(this.$parent.typeDic, item.type),
                type: item.type,
                required: this.MiXin_findDictValue(this.$parent.whetherDic, item.required) === '是',
                content: item.contents ? item.contents.map(item => {
                  return {content: item}
                }) : [],
                name: item.name
              }
            })
          })
        } else {
          this.isAdd = true;
        }
      })
    },
    submit() {
      const vm = this
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, vm.form);
          if (!params.details.length) return vm.$message.warning('请添加问卷内容')
          if (params.details.some(item => item.name === '' || item.name === undefined)) return vm.$message.warning('问题名称不可为空')
          if (params.details.some(item => item.title !== '文本' && !item.content.filter(t => t.content !== '').length)) return vm.$message.warning('单选或多选至少包含一个选择')
          params.details = params.details.map(item => {
            const value = item.required ? '是' : '否'
            return {
              name: item.name,
              content: item.title === '文本' ? [] : item.content.map(item => item.content),
              type: item.type,
              required: vm.MiXin_findDictValue(vm.$parent.whetherDic, value, 'dictKey', 'dictValue')
            }
          })
          params.dataAuth = params.dataAuth.join(',')
          !vm.isAdd && (params['id'] = vm.id);
          vm.loading = true
          let handler = vm.isAdd ? questionaireAdd : questionaireUpdate;
          handler(params).then(() => {
            vm.$message.success('操作成功');
            vm.$parent.isEdit = false;
            vm.$parent.$refs.table.loadData(true)
            vm.$parent.MiXin_searchTable();
          }).finally(() => {
            vm.loading = false
          })
        }
      });
    },
    confirm() {
      const vm = this
      if (vm.detail.content.some(item => item.content === '' || item.content === undefined)) return vm.$message.warning('问题不可为空')
      vm.form.details[vm.editIndex] = vm.detail
      vm.showContent = false
    },
    addQuestion() {
      this.showType = true;
    },
    addQues() {
      if (this.detail.content && this.detail.content.length >= 5) return this.$message.warning('最多支持5个选项')
      this.detail.content.push({content: ''})
    },
    addType(item) {
      this.showType = false;
      let questionDetail = quetionsMap[item.dictKey]
      this.form.details.push(Object.assign({}, questionDetail));
    },
    editQuestion(item, index) {
      this.showContent = true
      this.detail = deepClone(item)
      this.editIndex = index
    },
    listUpdate(evt) {
    },
    deleteQues(i) {
      if (this.detail.content.length <= 1) return this.$message.warning('至少需要1个选项')
      this.detail.content.splice(i, 1)
    },
    clickRemove(index) {
      this.form.details.splice(index, 1)
    },
  },
};
</script>
<style lang='scss' scoped>
.questionaierEdit {
  padding: 20px 300px;
}

.title {
  background: rgba(221, 221, 221, 1);
  color: #868e96;
  width: 70px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-right: 10px;
}

.content-wrap {
  display: flex;
  flex-direction: column;
  flex: 2;
}

.acIcon {
  font-size: 20px;
  cursor: pointer;
}
</style>
