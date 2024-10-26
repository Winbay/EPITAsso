import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AssociationsView from '@/views/AssociationsView.vue'
import SingleAssociationView from '@/views/SingleAssociationView.vue'
import EventsView from '@/views/EventsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/associations', component: AssociationsView },
    { path: '/associations/:slug', component: SingleAssociationView },
    { path: '/events', component: EventsView }
  ]
})

export default router
