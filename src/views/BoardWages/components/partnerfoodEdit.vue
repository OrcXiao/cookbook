<template>
  <my-dialog width="1000px" :title="isAdd ? '新增交伙' : '修改交伙'" v-model="show">
    <div>
      <el-form :inline="true" label-width="120px" :model="form" ref="form">
        <el-form-item label-width="0" prop="date" :rules="[{ required: true, message: '账目年月不可为空' }]">
          <el-date-picker type="month" class="width200" v-model="form.date" placeholder="请选择账目年月"
                          value-format="yyyy/MM"></el-date-picker>
        </el-form-item>
<!--        <el-form-item label-width="0" prop="standard" :rules="[{ required: true, message: '标准不可为空' }]">-->
<!--          <el-input type="number" class="width200" v-model="form.standard" placeholder="输入标准(元)"></el-input>-->
<!--        </el-form-item>-->
      </el-form>

      <div class="mg-b10">
        <el-button type="primary" @click="tableAdd">添加</el-button>
      </div>
      <my-table :tableData="details" :columns="columns">
        <el-table-column slot="customHandleColumn" label="用户操作">
          <template slot-scope="{ $index }">
            <el-button type="text" size="small" @click="handleDelete($index)">删除</el-button>
          </template>
        </el-table-column>
        <span slot="name" slot-scope="{ row }" style="position:relative">
          <el-input size="small" v-model="row.name" placeholder="请输入"></el-input>
        </span>
        <span slot="days" slot-scope="{ row }">
          <el-input type="number" size="small" v-model="row.days" placeholder="请输入"></el-input>
        </span>
        <span slot="standard" slot-scope="{ row }">
          <el-input type="number" size="small" v-model="row.standard" placeholder="请输入"></el-input>
        </span>
        <span slot="money"
              slot-scope="{row}">
          {{
            row.days && row.standard ? (row.days || 0) * (row.standard || 0) : '自动计算'
          }}
        </span>
        <span slot="remark" slot-scope="{ row }">
          <el-input size="small" v-model="row.remark" placeholder="请输入"></el-input>
        </span>
      </my-table>
    </div>
    <span slot="footer">
      <div class="dis-fl ju-ct pd-t20">
        <el-button @click="submit" type="primary" :loading='loading'>{{ isAdd ? '提交新增' : '提交修改' }}</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </span>
  </my-dialog>
</template>
<script>
const columns = [
  {
    label: '姓名',
    prop: 'name',
    slotName: 'name',
  },
  {
    label: '次数',
    prop: 'days',
    slotName: 'days',
  },
  {
    label: '标准',
    prop: 'standard',
    slotName: 'standard',
  },
  {
    label: '金额',
    prop: 'money',
    slotName: 'money',
  },
  {
    label: '备注',
    prop: 'remark',
    slotName: 'remark',
  },
];
import {tblBoardExpensesUpdate, tblBoardExpensesAdd, tblBoardExpensesDetail} from '@/api/BoardWages';

export default {
  data() {
    return {
      show: false,
      details: [],
      columns,
      form: {date: ''},
      isAdd: true,
      loading: false,
      id: ''
    };
  },
  methods: {
    submit() {
      const vm = this
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, vm.form);
          if (!vm.details.some(item => item.name !== '')) return vm.$message.warning('姓名不可为空')
          params.details = vm.details.map(item => {
            return {
              days: item.days,
              name: item.name,
              standard: item.standard,
              remark: item.remark,
            }
          })
          !vm.isAdd && (params['id'] = vm.id);
          vm.loading = true
          let handler = vm.isAdd ? tblBoardExpensesAdd : tblBoardExpensesUpdate;
          handler(params).then(() => {
            vm.$message.success('操作成功');
            vm.show = false;
            vm.$parent.MiXin_searchTable();
          }).finally(() => {
            vm.loading = false
          })
        }
      });
    },
    init(data) {
      this.show = true;
      this.details = [{name: '', days: '', standard: '', remark: ''}];
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        if (data) {
          tblBoardExpensesDetail(data.id).then(res => {
            let r = res.data
            this.isAdd = false
            this.form.date = r.date
            this.id = r.id
            this.details = (r.details || []).map(item => {
              return {
                name: item.name,
                days: item.days,
                standard: item.standard,
                remark: item.remark,
              }
            })
          })
        } else {
          this.isAdd = true
        }
      })
    },
    tableAdd() {
      this.details.push({name: '', day: '', standard: '', remark: ''});
    },
    handleDelete(i) {
      if (this.details.length <= 1) {
        return this.$message.warning('至少保留一行');
      }
      this.details.splice(i, 1);
    },
  },
};
</script>
<style lang='scss' scoped>
/deep/ input::-webkit-inner-spin-button,
/deep/ input::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}

/deep/ input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>
