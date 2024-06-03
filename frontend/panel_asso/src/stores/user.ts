import { defineStore } from 'pinia'
import type { FetchedUser } from '@/types/userInterfaces'
import * as yup from 'yup'

interface BackendUser {
  id: string
  login: string
  email: string
  first_name: string
  last_name: string
  school: string
}

const backendUserSchema = yup.object().shape({
  id: yup.string().required(),
  login: yup.string().required(),
  email: yup.string().email().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  school: yup.string().required()
})

const transformBackendUser = (backendUser: BackendUser): FetchedUser => ({
  id: backendUser.id,
  login: backendUser.login,
  email: backendUser.email,
  firstName: backendUser.first_name,
  lastName: backendUser.last_name,
  school: backendUser.school
})

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as FetchedUser | null
  }),
  actions: {
    setUser(user: FetchedUser | null) {
      backendUserSchema
        .validate(user)
        .then((validatedUser) => {
          this.user = transformBackendUser(validatedUser)
        })
        .catch((error) => {
          console.error('Error validating user:', error)
        })
    }
  },
  getters: {
    getUser(): FetchedUser | null {
      return this.user
    }
  }
})
