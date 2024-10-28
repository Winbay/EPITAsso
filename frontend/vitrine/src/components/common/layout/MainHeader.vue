<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePrimeVue } from 'primevue/config'
import { useUserStore } from '@/stores/user'

import RouterMenu from '@/components/Header/RouterMenu.vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import TieredMenu from 'primevue/tieredmenu'
import router from '@/router'
import FavoriteService from '@/services/association/favorite'
import { useToast } from 'primevue/usetoast'
import type { AssociationFavorite } from '@/types/associationInterfaces'

interface MenuItem {
  label: string
  icon?: string
  isSubMenu?: boolean
  items?: MenuItem[]
  disabled?: boolean
  command?: () => void
}

const PrimeVue = usePrimeVue()
const userStore = useUserStore()

const toast = useToast()
const favoriteService = new FavoriteService(toast)

const currentTheme = ref<string>('md-light-indigo')
const menu = ref<TieredMenu>()
const menuItems: MenuItem[] = [
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
  let nextTheme = 'md-light-indigo'
  if (currentTheme.value === 'md-light-indigo') nextTheme = 'lara-dark-indigo'
  else if (currentTheme.value === 'lara-dark-indigo') nextTheme = 'md-light-indigo'
  PrimeVue.changeTheme(currentTheme.value, nextTheme, 'id-to-link', () => {})
  currentTheme.value = nextTheme
}

const isLoadingFavorites = ref(false)

const loadFavorites = async () => {
  try {
    isLoadingFavorites.value = true
    const response = await favoriteService.getFavorites()
    menuItems[0].disabled = !(response && response.length > 0);
    if (response && response.length > 0) {
      menuItems[0].items = response.map((asso: AssociationFavorite) => ({
        label: asso.name,
        icon: asso.logo,
        isSubMenu: true,
        command: () => {
          router.push(`/associations/${asso.slug}`)
        }
      }))
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingFavorites.value = false
  }
}

const toggleMenu = async (event: Event) => {
  menu.value?.toggle(event)
}

onMounted(async () => {
  if (userStore.user) {
    await loadFavorites()
  }
})
</script>

<template>
  <header class="h-14 w-full px-6 flex items-center justify-between">
    <div class="header-left h-full flex items-center justify-start gap-4">
      <div class="logo">
        <img class="h-12" alt="Epita logo" src="/images/EPI.png" />
      </div>
      <RouterMenu />
      <div class="menu-icons items-center gap-4">
        <router-link to="/"><i class="pi pi-home" /></router-link>
        <router-link to="/associations"><i class="pi pi-graduation-cap" /></router-link>
        <router-link to="/events"><i class="pi pi-calendar" /></router-link>
      </div>
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
      <div
        v-else-if="userStore.user"
        class="user-menu flex justify-center items-center"
        @click="toggleMenu"
      >
        <Avatar
          class="mr-1.5"
          :label="userStore.user?.firstName[0] + userStore.user?.lastName[0]"
          shape="circle"
        />
        <i class="pi pi-angle-down" />
      </div>
    </div>
    <TieredMenu v-if="!isLoadingFavorites" ref="menu" :model="menuItems" :popup="true">
      <template #item="{ item, hasSubmenu, label }">
        <div
          :class="{ 'disabled': item.disabled }"
          class="flex items-center gap-2">
          <i v-if="!item.isSubMenu" :class="item.icon"></i>
          <img
            v-if="item.isSubMenu && item.icon && item.icon.startsWith('http')"
            :src="item.icon"
            alt="logo"
            class="menu-logo select-none"
          />
          <span class="select-none">{{ label }}</span>
          <i v-if="hasSubmenu" class="pi pi-angle-right"></i>
        </div>
      </template>
    </TieredMenu>
  </header>
</template>

<style>
header {
  border-bottom: solid 1px var(--surface-300);
}

header .header-left {
  width: 100%;
}

header .menu-icons {
  display: none;
  cursor: pointer;
}

header .menu-icons i {
  font-size: 1.5rem;
}

.p-button:focus {
  box-shadow: none;
}

.btn-connection {
  background-color: #4482a1;
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
  header .header-left > * {
    display: none;
  }

  header .menu-icons {
    display: flex;
  }
}

.p-tieredmenu {
  min-width: fit-content;
  padding: 0.5rem;

  .p-menuitem-content,
  .p-submenu-list {
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;

    .disabled {
      color: #b0b0b0;
      pointer-events: none;
      cursor: not-allowed;
    }
  }
  .p-menuitem-content:hover {
    background-color: var(--surface-300);
  }
}

.menu-logo {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

@media (max-width: 708px) {
  .p-tieredmenu .p-submenu-list {
    left: auto;
    right: 100%;
  }
}
</style>
