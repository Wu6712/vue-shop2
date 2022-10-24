import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
=======
import Login from '@/components/Login'
import Home from '@/components/Home'
<<<<<<< HEAD
>>>>>>> login
=======
import Welcome from '@/components/Welcome'
import Users from '@/components/Users'
>>>>>>> user

Vue.use(VueRouter)

const routes = [
<<<<<<< HEAD
  
=======
  {
    path: '/',
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
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      }
    ]
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
