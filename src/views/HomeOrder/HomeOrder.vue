<template>
  <div class="index-wrap">
    <div class="banner-warp cu-pt"></div>
    <div class="content-wrap">
      <div class="query-wrap">
        <div class="query-title">
          <span class="text fs26 cl333333">查询条件</span>
        </div>
        <el-form class="pd-t30" inline ref="queryForm" :model="queryForm" label-width="80px">
          <el-form-item label="菜品名称">
            <el-input placeholder="请输入菜品名称" v-model="queryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="菜品分类">
            <el-select v-model="queryForm.region" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input placeholder="请输入关键字" v-model="queryForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div class="dis-fl ju-ct pd-t15">
          <el-button class="common-query-btn mg-r50" type="warning">查询</el-button>
          <el-button class="common-reset-btn">重置</el-button>
        </div>
      </div>

      <div class="list-wrap query-wrap">
        <div class="query-title dis-fl ju-sb">
          <span class="text fs26 cl333333">菜品列表</span>
          <div>
            <span class="cl333333 fs22">已选择: <span>1</span></span>
            <el-button @click="clickPreView" class="review-btn fs24" type="success">预览</el-button>
            <el-button class="common-query-btn" type="warning">提交点餐</el-button>
          </div>
        </div>
        <div>
          <el-table
              class="cuisine-table"
              :header-cell-style="{background:'#F4F4F4'}"
              border
              :data="tableData"
              style="width: 100%">
            <el-table-column
                align="center"
                prop="date"
                label="参考图">
            </el-table-column>
            <el-table-column
                align="center"
                prop="date"
                label="菜品名称">
            </el-table-column>
            <el-table-column
                align="center"
                prop="date"
                label="菜品分类">
            </el-table-column>
            <el-table-column
                align="center"
                prop="date"
                label="备注">
            </el-table-column>
            <el-table-column
                align="center"
                prop="date"
                label="累计被点次数">
            </el-table-column>
            <el-table-column
                width="280px"
                align="center"
                prop="date"
                label="将菜品添加到下周菜谱">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.date">选择</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog
        width="700px"
        title="已点菜品预览"
        :visible.sync="isShowSelectedCuisineDialog">
      <el-table
          :header-cell-style="{background:'#F4F4F4'}"
          border
          :data="selectedCuisineTable"
          style="width: 100%">
        <el-table-column property="date" label="菜品名称"></el-table-column>
        <el-table-column property="name" label="菜品分类"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="warning">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "HomeOrder",
  components: {},
  data() {
    return {
      queryForm: {},
      //菜品列表
      tableData: [
        {
          date: '2018-05-01',
        },
        {
          date: '2018-05-01',
        },
        {
          date: '2018-05-01',
        },
        {
          date: '2018-05-01',
        },
        {
          date: '2018-05-01',
        },
      ],
      //已点菜品表格
      selectedCuisineTable: [],
      isShowSelectedCuisineDialog: false,
    }
  },
  methods: {
    clickPreView() {
      this.isShowSelectedCuisineDialog = true;
    },
  }
}
</script>

<style lang="scss" scoped>

.banner-warp {
  height: 722px;
  background: url("../../assets/img/orderbg.png") no-repeat;
  background-size: cover;
}

.content-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 65px;

  .query-wrap {
    padding-top: 30px;

    & > .query-title {
      .text:before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 20px;
        background: #53C389;
        border-radius: 5px;
        margin-right: 5px;
      }

    }
  }

  .list-wrap {
    .review-btn {
      margin-left: 30px;
      margin-right: 30px;
    }

    .cuisine-table {
      margin-top: 29px;

      /deep/ .el-table__header .el-table__cell {
        padding: 40px 0;
      }

      /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #000000;
      }

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #53C389;
        border-color: #53C389;
      }

      /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #53C389;
      }

    }
  }
}
</style>
