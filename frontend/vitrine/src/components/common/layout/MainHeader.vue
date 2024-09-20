<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import {useUserStore} from "@/stores/user";

import RouterMenu from "@/components/Header/RouterMenu.vue";
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Avatar from "primevue/avatar";

const PrimeVue = usePrimeVue();
const userStore = useUserStore();

const currentTheme = ref<string>('md-light-indigo');
const menu = ref();
const menuItems = [
  {
    label: 'Mes favoris',
    icon: 'pi pi-heart'
  },
  {
    label: 'Déconnexion',
    icon: 'pi pi-sign-out',
    command: () => {
      userStore.logout()
    }
  }
]

const toggleTheme = () => {
  let nextTheme = 'md-light-indigo';
  if (currentTheme.value === 'md-light-indigo') nextTheme = 'lara-dark-indigo';
  else if (currentTheme.value === 'lara-dark-indigo') nextTheme = 'md-light-indigo';
  PrimeVue.changeTheme(currentTheme.value, nextTheme, 'id-to-link', () => {});
  currentTheme.value = nextTheme;
}

const toggleMenu = () => {
  menu.value.toggle(event);
}
</script>

<template>
  <header class="h-14 w-full px-6 flex items-center justify-between">
    <div class="header-left h-full flex items-center justify-start gap-4">
      <div class="logo ">
        <img class="h-12" alt="Epita logo" src="/images/EPI.png"/>
      </div>
      <RouterMenu/>
    </div>
    <div class="header-right h-full w-fit flex items-center justify-end">
      <Button
          :icon="currentTheme === 'md-light-indigo' ? 'pi pi-moon' : 'pi pi-sun'"
          aria-label="Change theme"
          @click="toggleTheme"
      />
      <Button
          v-if="!userStore.isLoggedIn"
          class="btn-connection px-2 py-2"
          label="Connexion"
          @click="userStore.checkLoginAndFetchUser(true)"
      />
      <div v-else-if="userStore.user" class="user-menu flex justify-center items-center" @click="toggleMenu">
        <Avatar
            class="mr-1.5"
            :label="userStore.user?.firstName[0] + userStore.user?.lastName[0]"
            shape="circle"
        />
        <i class="pi pi-angle-down"/>
      </div>
      <Menu ref="menu" :model="menuItems" :popup="true"/>
    </div>
  </header>
</template>

<style>
header {
  border-bottom: solid 1px var(--surface-300);
}

header .header-left {
  width: 100%;
}

.p-button:focus {
  box-shadow: none;
}

.btn-connection {
  background-color: #4482A1;
  border-radius: 8px;
}

header .header-right .btn-connection span {
  font-weight: 400;
}

header .header-right .user-menu {
  user-select: none;
  cursor: pointer;
}

@media (max-width: 708px) {
  header .header-left > *:not(.logo) {
    display: none;
  }

  header .header-right {
    display: none;
  }
}
</style>