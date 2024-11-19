import { createRouter, createWebHistory } from 'vue-router'

import Events from '@/views/Events.vue'
import Articles from '@/views/Articles.vue'
import Login from '@/components/Login.vue'
import MyAssociation from '@/views/MyAssociation.vue'
import Messaging from '@/views/Messaging.vue'
import Equipment from '@/views/Equipment.vue'
import { ASSOCIATION_ID } from '@/services/api'
import StudentEngagement from '@/views/Commitment.vue'
import Page404 from '@/views/Page404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MyAssociation },
    { path: '/events', component: Events },
    { path: '/articles', component: Articles },
    { path: '/commitments', component: StudentEngagement },
    { path: '/login', component: Login },
    { path: '/messaging', component: Messaging },
    { path: '/equipment', component: Equipment },
    { path: '/:pathMatch(.*)*', component: Page404}
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
