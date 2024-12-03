import axios from 'axios'
import * as JWT from 'jwt-decode'
import { useUserStore } from '@/stores/user'

const API_URL = import.meta.env.VITE_API_URL
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'
export const ASSOCIATION_ID = 'associationId'

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

let isRefreshing = false

djangoApi.interceptors.request.use(
  async (config) => {
    const isRefreshCall = config.url?.includes('/refresh')
    if (isRefreshCall) {
      return config
    }

    let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    let refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (accessToken) {
      const accessTokenExpiry = getTokenExpiry(accessToken)
      const now = new Date().getTime()

      if (accessTokenExpiry && now >= accessTokenExpiry && !isRefreshing) {
        isRefreshing = true
        config.headers['Authorization'] = ``
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/api/auth/refresh`, {
              refresh: refreshToken
            })
            accessToken = response.data.access
            refreshToken = response.data.refresh
            if (accessToken && refreshToken) {
              localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
              localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
            }
            config.headers['Authorization'] = `Bearer ${accessToken}`
          } catch (error) {
            console.error('Failed to refresh token:', error)
            const userStore = useUserStore()
            userStore.setUser(null)
            localStorage.removeItem(ACCESS_TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            window.location.href = '/'
          } finally {
            isRefreshing = false
          }
        }
      } else {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
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

export default djangoApi
