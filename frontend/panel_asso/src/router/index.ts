import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/Home.vue";
import EngagementEtudiant from '@/views/StudentEngagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home},
    { path:'/engagement-etudiant', component: EngagementEtudiant}
  ]
})

export default router
