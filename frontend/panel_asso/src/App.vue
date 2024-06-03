<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
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

const API_URL = import.meta.env.VITE_API_URL
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

async function fetchTokenWithCode(code: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, redirect_uri: REDIRECT_URI })
    })
    if (response.ok) {
      return await response.json()
    }
    throw new Error('Failed to fetch token with code')
  } catch (error) {
    console.error('Failed to fetch token:', error)
    return null
  }
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    })
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
      return data.access_token
    }
    throw new Error('Failed to refresh access token')
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}

async function fetchUserDetails(accessToken: string): Promise<FetchedUser | null> {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    if (response.ok) {
      return await response.json()
    }
    console.error('Failed to fetch user details:', response.statusText)
    return null
  } catch (error) {
    console.error('Error fetching user details:', error)
    return null
  }
}

async function handleTokenFetchAndUserDetails(code: string) {
  const tokenData = await fetchTokenWithCode(code)
  if (tokenData) {
    const { token_type, access_token, refresh_token } = tokenData
    if (token_type && access_token && refresh_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
      const userData = await fetchUserDetails(access_token)
      if (userData) {
        userStore.setUser(userData)
        return true
      }
    }
  }
  return false
}

async function checkLoginAndFetchUser() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const queryParams = new URLSearchParams(window.location.search)
  const code = queryParams.get('code')

  if (code) {
    const success = await handleTokenFetchAndUserDetails(code)
    if (success) {
      isLoggedIn.value = true
      await router.push('/')
    } else {
      await router.push('/login')
    }
  } else if (accessToken && refreshToken) {
    let userData = await fetchUserDetails(accessToken)
    if (!userData) {
      const newAccessToken = await refreshAccessToken(refreshToken)
      if (newAccessToken) {
        userData = await fetchUserDetails(newAccessToken)
      }
    }
    if (userData) {
      userStore.setUser(userData)
      isLoggedIn.value = true
      await router.push('/')
    } else {
      await router.push('/login')
    }
  } else {
    await router.push('/login')
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
