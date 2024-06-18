<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  ACCESS_TOKEN_KEY,
  configureDjangoApi,
  REDIRECT_URI,
  REFRESH_TOKEN_KEY
} from '@/services/api'
import TheHeader from '@/components/TheHeader.vue'
import MainPanel from '@/components/MainPanel.vue'
import SideMenu from '@/components/SideMenu.vue'
import Login from '@/components/Login.vue'

import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import UserDetailService from '@/services/user/details'
import type { UserDetail } from '@/types/userInterfaces'
import AuthenticationService from '@/services/authentication/authentification'
import type { AuthenticationToken } from '@/types/authenticationInterface'

const userStore = useUserStore()
const router = useRouter()
const isLoggedIn = ref(false)
const isLoading = ref(true)

const toast = useToast()
configureDjangoApi(toast)
const userService = new UserDetailService(toast)
const authenticationService = new AuthenticationService(toast)

async function fetchTokenWithCode(code: string): Promise<AuthenticationToken> {
  return await authenticationService.getToken(code, REDIRECT_URI)
}

async function fetchUserDetails(): Promise<UserDetail | null> {
  return await userService.getUser()
}

async function handleTokenFetch(code: string): Promise<boolean> {
  const tokenData: AuthenticationToken = await fetchTokenWithCode(code)
  if (tokenData) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken)
    return true
  }
  return false
}

async function login(): Promise<void> {
  let userData = await fetchUserDetails()
  userStore.setUser(userData)
  isLoggedIn.value = true
  await router.push(router.currentRoute.value.path)
}

async function checkLoginAndFetchUser(): Promise<void> {
  let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  let refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  if (accessToken && refreshToken) {
    await login()
  } else {
    const queryParams = new URLSearchParams(window.location.search)
    const code = queryParams.get('code')

    if (code) {
      const success = await handleTokenFetch(code)
      if (success) {
        await login()
      }
    }
  }
  isLoading.value = false
}

onMounted(async () => {
  await checkLoginAndFetchUser()
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="spinner">
      <ProgressSpinner />
    </div>
    <Login v-else-if="!isLoggedIn" />
    <div v-else>
      <Toast />
      <TheHeader />
      <main id="main-content" class="h-full flex flex-wrap overflow-hidden">
        <SideMenu />
        <MainPanel />
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  height: max-content;
  background-color: #131923;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

.spinner {
  height: 100vh;
  align-content: center;
  text-align: center;
  background-color: #131923;
}
</style>
