import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AssociationsView from "@/views/AssociationsView.vue";
import EventsView from "@/views/EventsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: HomeView},
    {path: '/associations', component: AssociationsView},
    {path: '/events', component: EventsView},
  ]
})

export default router
