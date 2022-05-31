<template>
  <div class="home">
    <div @click="clickJump" class="banner-warp cu-pt"></div>
    <div class="body-wrap">
      <div class="info-wrap">
        <div class="dis-fl ju-ct title-wrap">
          <div class="before"></div>
          <div class="fs36 cl333333 ft-b title">一营信息公开栏</div>
          <div class="after"></div>
        </div>
        <div class="one-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">一周食谱</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="制定日期">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">会餐食谱列表</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="会餐食谱列表">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">伙食账目公布表</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="标题名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="发布时间">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>

          </div>
        </div>
        <div class="one-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">交伙情况</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="标题名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="发布时间">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">询价</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="标题名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="发布时间">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">定量标准</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="标题名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="发布时间">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>

          </div>
        </div>
        <div class="two-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">采购情况</div>
            </div>
            <div class="dis-fl sub-type">
              <div class="item active">今日</div>
              <div class="item">昨日</div>
              <div class="item">近7天</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="品名">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="计划数量">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="实购数量">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="出库量">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="单位">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="合计(元)">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">意见收集</div>
              <img class="cu-pt edit-icon" src="../../assets/img/yijianfankui.png" alt="">
            </div>
            <div class="dis-fl sub-type">
              <div class="item active">意见列表</div>
              <div class="item">调查问卷</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="制定日期">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
        <div class="two-area dis-fl ju-sb">
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">当日消耗</div>
            </div>
            <div>
              <el-table
                  class="consume-table"
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 585px">
                <el-table-column
                    align="center"
                    width="34px"
                    label="品名"
                    prop="date">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="大米"
                    width="34px"
                    prop="date">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="面粉"
                    width="34px"
                    prop="date">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="畜肉">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="禽肉">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="禽蛋">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="鱼虾">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="牛奶">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="大豆">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="蔗糖">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="蔬菜">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="水果">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="食用菌">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="34px"
                    label="干菜">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="36px"
                    label="饮料">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="36px"
                    label="调料">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="36px"
                    label="燃料">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
          <div>
            <div class="area-title">
              <div class="fs22 clffffff">其他</div>
            </div>
            <div>
              <el-table
                  :header-cell-style="{background:'#F4F4F4'}"
                  border
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="date"
                    label="标题名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    label="发布时间">
                </el-table-column>
              </el-table>
              <div class="dis-fl ju-ed">
                <el-pagination
                    small
                    background
                    layout="total, prev, pager, next"
                    :total="44">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="opinion-wrap cu-pt">
      <img class=" edit-icon" src="../../assets/img/yijianfankui.png" alt="">
      <div class="fs16 cl666666">提意见</div>
    </div>

  </div>
</template>

<script>


export default {
  name: 'Home',
  components: {},
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    MiXin_closeDialog(formName) {
      this.$refs[formName].resetFields();
    },
    clickJump (){
      this.$router.push({
        path: '/HomeOrder'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page-header {
  user-select: none;
  height: 118px;
  line-height: 118px;
  margin: 0 auto;

  img {
    position: relative;
    top: 14px;
  }

  .right-area {

    padding-left: 232px;
  }

  .space {
    width: 161px;
    height: 41px;
    line-height: normal;
  }

  .login-btn {
    display: inline-block;
    width: 140px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #ffffff;
    font-size: 18px;
    background: #53C389;
    border-radius: 6px;
    margin-left: 67px;
  }

  /deep/ .el-input--mini .el-input__inner {
    height: 41px;
    line-height: 40px;
  }
}

.banner-warp {
  height: 722px;
  background: url("../../assets/img/banner.png") no-repeat;
  background-size: cover;
}

.body-wrap {
  background: url("../../assets/img/homebg.png") no-repeat;
}

.info-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
  padding-top: 70px;

  .title-wrap {
    padding-bottom: 33px;

    .before,
    .after {
      width: 444px;
      height: 4px;
      margin-top: 23px;
      background: #53C389;
    }

    .title {
      padding: 0 25px;
    }
  }

  .one-area {
    padding: 30px 0;
    border-bottom: 1px solid #E0E0E0;

    & > div {
      width: 380px;
    }
  }

  .two-area {
    padding: 30px 0;
    border-bottom: 1px solid #E0E0E0;

    & > div {
      width: 585px;
    }
  }

  .two-area:last-child {
    border-bottom: none;
  }

  .area-title {
    position: relative;
    border-bottom: 2px solid #F29E44;
    margin-bottom: 15px;

    & > div {
      display: inline-block;
      padding: 8px 19px;
      background: #F29E44;
    }

    .edit-icon {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .sub-type {
    padding: 0 17px 14px;

    & > .item {
      cursor: pointer;
      padding: 7px 15px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #888888;
      margin-right: 10px;
      border: 1px solid #CCCCCC;
    }

    & > .item.active {
      color: #ffffff;
      background: #53C389
    }
  }

}

.opinion-wrap {
  position: fixed;
  top: 50%;
  right: 0;
  width: 80px;
  height: 85px;
  background: #FFFFFF;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px 0px 0px 10px;
  text-align: center;
  padding-top: 15px;
}


</style>
