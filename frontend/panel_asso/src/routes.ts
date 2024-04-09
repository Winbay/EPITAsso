import { createRouter, createWebHistory  } from 'vue-router'
import Home from "./components/Home.vue";
import MonAssociation from "./components/MonAssociation.vue";

const router = createRouter({
    history: createWebHistory (),
    routes: [
        { path: '/', component: Home},
        { path: '/mon-association', component: MonAssociation},
    ]
});

export default router;