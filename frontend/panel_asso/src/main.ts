import './assets/main.css'
import 'primevue/resources/themes/lara-dark-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService, { type ToastServiceMethods } from 'primevue/toastservice'
import router from './router'
import Tooltip from 'primevue/tooltip'
import AssociationService from '@/services/association/association'
import { initializeConversations } from '@/fixtures/conversations.js';
import { initializeMessages } from '@/fixtures/messages.js';
import UserService from '@/services/user/user'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)
app.use(router)
app.directive('tooltip', Tooltip)

const toast = app.config.globalProperties.$toast as ToastServiceMethods;
const associationService = new AssociationService(toast);
const userService = new UserService(toast);

initializeConversations(associationService).then(() => {
  initializeMessages(userService).then(() => {
    app.mount('#app')
  });
});