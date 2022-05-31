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
        component: ()=> import('@/views/Home')
      },
      {
        path: 'Order',
        name: 'Order',
        component: ()=> import('@/views/Order')
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
        component: ()=> import('@/views/Home')
      },
    ],

  },
]

export default routes
