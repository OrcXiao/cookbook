import HomeLayout from "@/layout/HomeLayout.vue";
import AdminLayout from "@/layout/AdminLayout.vue";

const routes = [
  {
    path: "/",
    component: HomeLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home/Home.vue"),
      },
      {
        path: "HomeOrder",
        name: "HomeOrder",
        component: () => import("@/views/HomeOrder/HomeOrder.vue"),
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "AdminHome",
        component: () => import("@/views/AdminHome/AdminHome.vue"),
        meta: {title: "首页"},
      },
      {
        path: "/Cuisine",
        name: "CuisineManager",
        component: () => import("@/views/Cuisine/Cuisine.vue"),
        meta: {title: "菜品管理"},
        children: [
          {
            path: "/Cuisine/Cuisine",
            name: "Cuisine",
            component: () => import("@/views/Cuisine/Cuisine.vue"),
            meta: {title: "菜品管理"},
          }
        ]
      },
      {
        path: "/Recipe",
        name: "Recipe",
        component: () => import("@/views/Recipe/Recipe.vue"),
        meta: {title: "食谱管理"},
      },
      {
        path: "/Purchase",
        name: "Purchase",
        component: () => import("@/views/Recipe/Recipe.vue"),
        meta: {title: "采购管理"},
      },
      {
        path: "/ProcurementPlan",
        name: "ProcurementPlan",
        component: () => import("@/views/Purchase/ProcurementPlan.vue"),
        meta: {title: "采购计划"},
      },
      {
        path: "/Inventory",
        name: "Inventory",
        component: () => import("@/views/Purchase/Inventory.vue"),
        meta: {title: "库存管理"},
      },
      {
        path: "/Enquiry",
        name: "Enquiry",
        component: () => import("@/views/Purchase/Enquiry.vue"),
        meta: {title: "询价管理"},
      },
      {
        path: "/OutInRegistrationForm",
        name: "OutInRegistrationForm",
        component: () => import("@/views/Purchase/OutInRegistrationForm.vue"),
        meta: {title: "副食出(入)库登记表"},
      },
      {
        path: "/AdminOrder",
        name: "AdminOrder",
        component: () => import("@/views/AdminOrder/AdminOrder.vue"),
        meta: {title: "点餐管理"},
      },

      {
        path: "/FoodAccounts",
        name: "FoodAccounts",
        component: () => import("@/views/BoardWages/FoodAccounts.vue"),
        meta: {title: '伙食账目管理'}
      },
      {
        path: "/PartnerFood",
        name: "PartnerFood",
        component: () => import("@/views/BoardWages/PartnerFood.vue"),
        meta: {title: '交伙管理'}
      },
      {
        path: "/OnlineOrder",
        name: "OnlineOrder",
        component: () => import("@/views/OnlineOrder/OnlineOrder.vue"),
        meta: {title: '在线点餐'}
      },
      {
        path: "/Questionnaire",
        name: "Questionnaire",
        component: () => import("@/views/Questionnaire/Questionnaire.vue"),
        meta: {title: '问卷管理'}
      },
      {
        path: "/Opinion",
        name: "Opinion",
        component: () => import("@/views/Opinion/Opinion.vue"),
        meta: {title: '意见管理'}
      },
      {
        path: "/Content",
        name: "Content",
        component: () => import("@/views/Content/Content.vue"),
        meta: {title: '内容管理'}
      }, {
        path: '/User',
        name: "User",
        component: () => import("@/views/System/User.vue"),
        meta: {title: '用户管理'}
      },
      {
        path: '/Dictionaries',
        name: "Dictionaries",
        component: () => import("@/views/System/Dictionaries.vue"),
        meta: {title: '字典管理'}
      },
      // {
      //   path: '/Menu',
      //   name: "Menu",
      //   component: () => import("@/views/System/Menu.vue"),
      //   meta: {title: '菜单管理'}
      // }
    ],
  },
  {
    path: "/RecipePreview",
    name: "RecipePreview",
    component: () => import("@/views/Previews/RecipePreview.vue"),
  },
  {
    path: "/AppointReceipt",
    name: "AppointReceipt",
    component: () => import("@/views/Previews/AppointReceipt.vue"),
  },
  {
    path: "/DineTogether",
    name: "DineTogether",
    component: () => import("@/views/Previews/DineTogether.vue"),
  },
  {
    path: "/Rendezvous",
    name: "Rendezvous",
    component: () => import("@/views/Previews/Rendezvous.vue"),
  },
  {
    path: "/FoodAccountsPreview",
    name: "FoodAccountsPreview",
    component: () => import("@/views/Previews/FoodAccountsPreview.vue"),
  },
  {
    path: "/EnquiryPreview",
    name: "EnquiryPreview",
    component: () => import("@/views/Previews/EnquiryPreview.vue"),
  },
  {
    path: "/ContentPreview",
    name: "ContentPreview",
    component: () => import("@/views/Previews/ContentPreview.vue"),
  },
  {
    path: "/QuestionPreview",
    name: "QuestionPreview",
    component: () => import("@/views/Previews/QuestionPreview.vue"),
  },
  {
    path: "/NonStapleFoodPreview",
    name: "NonStapleFoodPreview",
    component: () => import("@/views/Previews/NonStapleFoodPreview.vue"),
  },
  {
    path: "/TodayConsumePreview",
    name: "TodayConsumePreview",
    component: () => import("@/views/Previews/TodayConsumePreview.vue"),
  },
  {
    path: "/QuantitativeCriterion",
    name: "QuantitativeCriterion",
    component: () => import("@/views/Previews/QuantitativeCriterion.vue"),
  },
];

export default routes;
