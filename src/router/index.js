import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Main from '../components/Main.vue'

import Home from '../components/Home.vue'
import List from '../components/List.vue'
import Handle from '../components/Handle.vue'
import Group from '../components/Group.vue'
import AddTask from '../components/AddTask.vue'

import Detail from '../components/Detail.vue'


Vue.use(VueRouter)

  const routes = [
  { path: '/', redirect: '/login'},
  { path: '/login', component: Login },
  { path: '/main', 
    component: Main,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home
      },
      {
        path: '/list',
        component: List
      },
      {
        path: '/handle',
        component: Handle
      },
      {
        path: '/group',
        component: Group
      },
      {
        path: '/addTask',
        component: AddTask
      }
    ]
  },
  
  // {
  //   path: '/group',
  //   component: Group
  // },
  // {
  //   path: '/addTask',
  //   component: AddTask
  // },
  {
    path: '/detail',
    component: Detail
  },
  // {
  //   path: '/handle',
  //   component: Handle
  // }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
