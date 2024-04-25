<template>
  <div class="pd-t20 pd-b20">
    <el-form ref="forms" :model="forms" label-width="100px">
      <el-row>
        <el-col
            v-for="(item, index) in formConfig.forms"
            :key="index"
            :offset="1"
            :span="6"
        >
          <el-form-item :label="showLabel ? item.label : ''" :label-width="showLabel ? '100px' : '0px'">
            <!--输入框-->
            <el-input
                @clear="inputClear(item.prop)"
                :class="{'wd200': isFixedWidth}"
                v-if="item.type === 'input'"
                v-model="forms[item.prop]"
                :clearable="item.clearable"
                :maxlength="item.maxlength"
                :disabled="item.disabled ? item.disabled : formConfig.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
            >
            </el-input>
            <!--下拉选择框-->
            <el-select
                @change="item.changeEvent&&item.changeEvent(forms[item.prop])"
                :class="{'wd200': isFixedWidth}"
                v-if="item.type === 'select'"
                v-model="forms[item.prop]"
                :disabled="item.disabled ? item.disabled : formConfig.disabled"
                :placeholder="`请选择${item.label}`"
            >
              <el-option
                  v-for="(option, optionIndex) in item.options"
                  :key="optionIndex"
                  :label="option[item.opLabel] || option.label"
                  :value="option[item.opValue] || option.value"
              >
              </el-option>
            </el-select>
            <!--日期选择框-->
            <el-date-picker
                class="wd200"
                v-if="item.type === 'date'"
                v-model="forms[item.prop]"
                type="date"
                value-format="yyyy/MM/dd"
                :placeholder="`请选择${item.label}`"
            >
            </el-date-picker>
            <!--月份选择框-->
            <el-date-picker
                class="wd200"
                v-if="item.type === 'month'"
                v-model="forms[item.prop]"
                value-format="yyyy/MM"
                type="month"
                :placeholder="`请选择${item.label}`"
            >
            </el-date-picker>
            <!--日期范围选择框-->
            <el-date-picker
                class="width280"
                v-if="item.type === 'daterange'"
                v-model="forms[item.prop]"
                type="daterange"
                :placeholder="`请选择${item.label}`"
                value-format="yyyy/MM/dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="!isShowBigBtn" class="dis-fl ju-ct">
      <el-button type="primary" @click="submitForm"> 查询</el-button>
      <el-button v-if="isShowResetBtn" style="margin-left:60px" @click="resetForm"> 重置</el-button>
      <slot name="btns"></slot>
    </div>

    <div v-else class="dis-fl ju-ct pd-t15">
      <el-button
          @click="submitForm"
          class="common-query-btn mg-r60"
          type="warning"
      >查询
      </el-button
      >
      <el-button @click="resetForm" class="common-reset-btn">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    formConfig: {
      type: Object,
      default: function () {
        return {};
      },
    },
    formModel: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isShowBigBtn: {
      type: Boolean,
      default: false,
    },
    isShowResetBtn: {
      type: Boolean,
      default: true,
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    isFixedWidth: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'formModel',
    event: 'input',
  },
  data() {
    return {
      forms: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.forms = this.formModel;
    });
  },
  methods: {
    submitForm() {
      this.$emit('input', this.forms);
      this.$emit('searchData', this.forms);
    },
    resetForm() {
      Object.keys(this.forms).forEach((key) => {
        this.forms[key] = '';
      });
      this.$emit('input', this.forms);
      this.$emit('searchData', this.forms);
    },
    inputClear(prop) {
      this.forms[prop] = ''
      this.$emit('searchData', this.forms);
    },
  },
};
</script>

<style lang="scss" scoped>
.wd200 {
  width: 240px !important;
  max-width: 16vw;
}
</style>
