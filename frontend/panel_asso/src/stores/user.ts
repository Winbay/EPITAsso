import { defineStore } from 'pinia'
import type { UserDetail } from '@/types/userInterfaces'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDetail | null
  }),
  actions: {
    setUser(user: UserDetail | null) {
      this.user = user
    }
  },
  getters: {
    getUser(): UserDetail | null {
      return this.user
    }
  }
})
