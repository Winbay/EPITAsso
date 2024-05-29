import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'

import StudentEngagement from '@/views/StudentEngagement.vue'
import Events from '@/views/Events.vue'
import Articles from '@/views/Articles.vue'
import MonAssociation from '@/components/MonAssociation.vue'
import Login from '@/components/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/engagement-etudiant', component: StudentEngagement },
    { path: '/events', component: Events },
    { path: '/articles', component: Articles },
    { path: '/mon-association', component: MonAssociation },
    { path: '/login', component: Login },
  ]
})

export default router
