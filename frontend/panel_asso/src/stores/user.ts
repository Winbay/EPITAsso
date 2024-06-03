import { defineStore } from 'pinia'

interface User {}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    }
  },
  getters: {
    getUser(): User | null {
      return this.user
    }
  }
})
