import { defineStore } from 'pinia'

export const useAssociationStore = defineStore('association', {
  state: () => ({
    selectedAssociationId: null as string | null
  }),
  actions: {
    setSelectedAssociation(id: string) {
      this.selectedAssociationId = id
    }
  }
})
