import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
=======
import Login from '@/components/Login'
import Home from '@/components/Home'
>>>>>>> login

Vue.use(VueRouter)

const routes = [
<<<<<<< HEAD
  
=======
  {
    path: '/',
    // 默认打开
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: []
  }
>>>>>>> login
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 过载路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') 
  next()
})


export default router
