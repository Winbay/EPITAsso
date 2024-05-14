import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Association from "@/views/Association.vue";
import StudentEngagement from '@/views/StudentEngagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      { path: '/', component: Home },
      { path: '/associations', component: Association },
        { path: '/engagement-etudiant', component: StudentEngagement }
  ]
})

export default router
