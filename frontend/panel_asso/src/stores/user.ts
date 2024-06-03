import { defineStore } from 'pinia'
import type { FetchedUser } from '@/types/userInterfaces'
import * as yup from 'yup'

const userSchema = yup.object<FetchedUser>().shape({
  id: yup.string().required(),
  login: yup.string().required(),
  email: yup.string().email().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  school: yup.string().required()
})

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as FetchedUser | null
  }),
  actions: {
    setUser(user: FetchedUser | null) {
      userSchema
        .validate(user)
        .then((validatedUser) => {
          this.user = validatedUser as FetchedUser
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
