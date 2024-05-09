import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/Home.vue";
import Events from "@/views/Events.vue";
import EventEdit from '@/components/Dialog/DialogEvent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home},
    { path: '/events', component: Events},
    {
      path: '/events/:id',
      name: 'EventEdit',
      component: EventEdit,
      props: true
    }
  ]
})

export default router
