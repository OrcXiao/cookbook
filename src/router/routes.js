import HomeLayout from '@/layout/HomeLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: ()=> import('@/views/Home/Home.vue')
      },
      {
        path: 'HomeOrder',
        name: 'HomeOrder',
        component: ()=> import('@/views/HomeOrder/HomeOrder.vue')
      },
    ],
  },
  {
    path: '/admin',
    name: 'layout',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: ()=> import('@/views/Home/Home.vue')
      },

    ],

  },
]

export default routes
