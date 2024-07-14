import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'

import StudentEngagement from '@/views/StudentEngagement.vue'
import Events from '@/views/Events.vue'
import Articles from '@/views/Articles.vue'
import Login from '@/components/Login.vue'
import MyAssociation from '@/views/MyAssociation.vue'
import Profile from '@/views/Profile.vue'
import Messaging from '@/views/Messaging.vue'
import Equipment from '@/views/Equipment.vue'
import { ASSOCIATION_ID } from '@/services/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MyAssociation },
    { path: '/engagement-etudiant', component: StudentEngagement },
    { path: '/events', component: Events },
    { path: '/articles', component: Articles },
    // { path: '/mon-association', component: MyAssociation },
    { path: '/login', component: Login },
    { path: '/profile', component: Profile },
    { path: '/messaging', component: Messaging },
    { path: '/equipment', component: Equipment }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/profile']
  const associationId = localStorage.getItem(ASSOCIATION_ID)
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !associationId) {
    next('/')
  } else {
    next()
  }
})

export default router
