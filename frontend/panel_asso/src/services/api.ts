import axios from 'axios'
import { useUserStore } from '@/stores/user'

const API_URL = import.meta.env.VITE_API_URL

function getCsrfToken() {
  const csrfCookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken='))
  return csrfCookie ? csrfCookie.split('=')[1] : ''
}

const djangoApi = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken()
  },
  withCredentials: true // to include session cookie
})

// to include csrf token in the header of each request
djangoApi.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

djangoApi.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refresh_token: refreshToken
          })
          const { access_token } = response.data
          localStorage.setItem('accessToken', access_token)
          djangoApi.defaults.headers['Authorization'] = `Bearer ${access_token}`
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`
          return djangoApi(originalRequest)
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError)
          const userStore = useUserStore()
          userStore.setUser(null)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default djangoApi
