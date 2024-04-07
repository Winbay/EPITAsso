import './assets/main.css'
import 'primevue/resources/themes/lara-dark-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from "primevue/config";
import router from './routes';


const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.mount('#app');
