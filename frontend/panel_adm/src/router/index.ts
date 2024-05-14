import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Association from "@/views/Association.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      { path: '/', component: Home },
      { path: '/associations', component: Association }
  ]
})

export default router
