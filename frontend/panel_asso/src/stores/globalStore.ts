import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Association } from '@/types/associationInterfaces'

export const initAssociation = (): Association => {
  return {
    id: 0,
    name: 'Null',
    content: '',
    location: '',
    logo: '',
    webhook: ''
  }
}

export const useGlobalStore = defineStore('global', () => {
  const currentAssociation = ref<Association>(initAssociation())

  return { currentAssociation }
})
