import './assets/main.css'
import 'primevue/resources/themes/lara-dark-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)
app.use(router)

app.mount('#app')
