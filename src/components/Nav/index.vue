<template>
  <div class="index-wrap">
    <el-menu
        router
        default-active="2">
      <el-submenu index="1" >
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      navList:[
        {
          title: '菜品管理',
          children:[
            {
              title: '菜品管理',
              path: '/Cuisine',
            },
          ]
        },
        {
          title: '食谱管理',
          children:[
            {
              title: '食谱管理',
              path: '/Recipe',
            },
          ]
        },
        {
          title: '采购管理',
          children:[
            {
              title: '采购计划',
              path: '/ProcurementPlan',
            },
            {
              title: '库存管理',
              path: '/inventory',
            },
            {
              title: '询价管理',
              path: '/enquiry',
            },
          ]
        },
        {
          title: '点餐管理',
          children:[
            {
              title: '点餐管理',
              path: '/Order',
            },
          ]
        },
        {
          title: '系统管理',
          children:[
            {
              title: '用户管理',
              path: '/User',
            },
            {
              title: '菜单管理',
              path: '/Menu',
            },
            {
              title: '字典管理',
              path: '/Dictionaries',
            },
          ]
        },
        {
          title: '内容管理',
          children:[
            {
              title: '内容管理',
              path: '/Content',
            },
          ]
        },
        {
          title: '意见管理',
          children:[
            {
              title: '意见管理',
              path: '/Opinion',
            },
          ]
        },
        {
          title: '问卷管理',
          children:[
            {
              title: '问卷管理',
              path: '/Questionnaire',
            },
          ]
        },
        {
          title: '在线点餐',
          children:[
            {
              title: '在线点餐',
              path: '/OnlineOrder',
            },
          ]
        },
        {
          title: '伙食费管理',
          children:[
            {
              title: '伙食账目管理',
              path: '/FoodAccounts',
            },
          ]
        },
      ]
    }
  },

}
</script>

<style lang="scss" scoped>

</style>
