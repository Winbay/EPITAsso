import axios from 'axios'
import * as JWT from 'jwt-decode'
import { useUserStore } from '@/stores/user'
import AuthenticationRefreshService from '@/services/authentication/refresh'
import { useToast } from 'primevue/usetoast'
import type { AuthenticationRefresh } from '@/types/authenticationInterface'

const API_URL = import.meta.env.VITE_API_URL
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'

export function getTokenExpiry(token: string): number | null {
  try {
    const decodedToken: { exp: number } = JWT.jwtDecode(token)
    return decodedToken.exp ? decodedToken.exp * 1000 : null
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const djangoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // to include session cookie
})

export function configureDjangoApi(toast: ReturnType<typeof useToast>) {
  const authenticationRefreshService = new AuthenticationRefreshService(toast)

  djangoApi.interceptors.request.use(
    async (config) => {
      let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      if (accessToken) {
        const accessTokenExpiry = getTokenExpiry(accessToken)
        const now = new Date().getTime()

        if (accessTokenExpiry && now >= accessTokenExpiry) {
          if (refreshToken) {
            const data: AuthenticationRefresh = await authenticationRefreshService.refresh(refreshToken)
            accessToken = data.access
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
            djangoApi.defaults.headers['Authorization'] = `Bearer ${accessToken}`
          }
        }
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => {
      const userStore = useUserStore()
      userStore.setUser(null)
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      window.location.href = '/'
      return Promise.reject(error)
    }
  )
}

export default djangoApi
