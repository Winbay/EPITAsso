import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/Home.vue";
import StudentEngagement from '@/views/StudentEngagement.vue'
import Events from "@/views/Events.vue";
import EventEdit from '@/components/Dialog/DialogEvent.vue'
import MonAssociation from '@/components/MonAssociation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home},
    { path: '/engagement-etudiant', component: StudentEngagement},
    { path: '/events', component: Events},
    {
      path: '/events/:id',
      name: 'EventEdit',
      component: EventEdit,
      props: true
    },
    { path: '/mon-association', component: MonAssociation}
  ]
})

export default router
