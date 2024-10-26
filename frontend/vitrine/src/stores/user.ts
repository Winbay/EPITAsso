import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserDetail } from '@/types/userInterfaces'
import type { AuthenticationToken } from '@/types/authenticationInterface'
import { ACCESS_TOKEN_KEY, REDIRECT_URI, REFRESH_TOKEN_KEY } from '@/services/api'
import { useRouter } from 'vue-router'
import UserDetailService from '@/services/user/details'
import AuthenticationService from '@/services/authentication/authentification'
import * as toast from '@/composables/toast'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserDetail | null>(null)
  const isLoggedIn = ref<boolean>(false)
  const redirect_uri = ref<string>(REDIRECT_URI)
  const router = useRouter()

  const userService = new UserDetailService(toast)
  const authenticationService = new AuthenticationService(toast)

  async function fetchTokenWithCode(code: string): Promise<AuthenticationToken> {
    return await authenticationService.getToken(code, redirect_uri.value)
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
    user.value = await fetchUserDetails()
    isLoggedIn.value = true
    await router.push(router.currentRoute.value.path)
  }

  const handleMicrosoftLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    window.location.href = `${apiUrl}/api/auth/authorize?redirect_uri=${redirect_uri.value}`
  }

  async function checkLoginAndFetchUser(btnClicked: boolean = false): Promise<void> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    redirect_uri.value = import.meta.env.VITE_HOST + window.location.pathname

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
      } else if (btnClicked) {
        handleMicrosoftLogin()
      }
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    window.location.href = '/'
  }

  return {
    user,
    isLoggedIn,
    checkLoginAndFetchUser,
    logout
  }
})
