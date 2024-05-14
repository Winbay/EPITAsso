import './assets/main.css'
import 'primevue/resources/themes/lara-dark-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'vue-file-selector/dist/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import FileSelector from 'vue-file-selector'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(ToastService)
app.use(FileSelector)
app.use(router)

app.mount('#app')
