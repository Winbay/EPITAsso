import { defineStore } from 'pinia'
import type { FetchedUser } from '@/types/userInterfaces'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as FetchedUser | null
  }),
  actions: {
    setUser(user: FetchedUser) {
      this.user = user
    }
  },
  getters: {
    getUser(): FetchedUser | null {
      return this.user
    }
  }
})
