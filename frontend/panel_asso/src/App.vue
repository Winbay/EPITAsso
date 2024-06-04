<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import djangoApi, {
  ACCESS_TOKEN_KEY,
  REDIRECT_URI,
  REFRESH_TOKEN_KEY
} from '@/services/api'
import TheHeader from '@/components/TheHeader.vue'
import MainPanel from '@/components/MainPanel.vue'
import SideMenu from '@/components/SideMenu.vue'
import Login from '@/components/Login.vue'
import type { FetchedUser } from '@/types/userInterfaces'

import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'

const userStore = useUserStore()
const router = useRouter()
const isLoggedIn = ref(false)
const isLoading = ref(true)

async function fetchTokenWithCode(code: string): Promise<any> {
  try {
    const response = await djangoApi.post('/api/auth/token', { code, redirect_uri: REDIRECT_URI })
    if (response.status === 200) {
      return response.data
    }
    throw new Error('Failed to fetch token with code')
  } catch (error) {
    console.error('Failed to fetch token:', error)
    return null
  }
}

async function fetchUserDetails(): Promise<FetchedUser | null> {
  try {
    const response = await djangoApi.get('/api/users/me')
    if (response.status === 200) {
      return response.data
    }
    console.error('Failed to fetch user details:', response.statusText)
    return null
  } catch (error) {
    console.error('Error fetching user details:', error)
    return null
  }
}

async function handleTokenFetch(code: string): Promise<boolean> {
  const tokenData = await fetchTokenWithCode(code)
  if (tokenData) {
    const { token_type, access_token, refresh_token } = tokenData
    if (token_type && access_token && refresh_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
      return true
    }
  }
  return false
}

async function login(): Promise<void>{
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
