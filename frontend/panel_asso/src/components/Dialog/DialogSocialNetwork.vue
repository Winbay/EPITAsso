<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

import { computed, defineProps, type PropType, ref } from 'vue'
import type { SocialNetwork } from '@/types/associationInterfaces'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  socialNetwork: {
    type: Object as PropType<SocialNetwork>,
    required: true
  }
})

const getDefaultSocialNetwork = (): SocialNetwork => ({
  id: -1,
  name: '',
  link: ''
})

const socialNetworksRef = ref<SocialNetwork>(props.socialNetwork)

const isFormValid = computed(() => {
  return socialNetworksRef.value.name.trim() && socialNetworksRef.value.link.trim()
})

const editOrCreate = (): void => {
  props.setHidden(socialNetworksRef.value)
}

const cancelDialog = () => {
  socialNetworksRef.value = getDefaultSocialNetwork()
  props.setHidden()
}
</script>

<template>
  <Dialog :visible="true" modal @update:visible="cancelDialog" header="Ajouter un réseau social">
    <div>
      <InputText
        id="socialNetworkName"
        v-model="socialNetworksRef.name"
        placeholder="Nom du réseau social"
        class="w-full mb-2 h-12"
      />
      <InputText
        id="socialNetworkLink"
        v-model="socialNetworksRef.link"
        placeholder="Lien vers le réseau social"
        class="w-full mb-2 h-12"
      />
      <div class="flex justify-start mt-5 gap-4">
        <Button label="Annuler" icon="pi pi-times" @click="cancelDialog" severity="secondary" />
        <Button
          :label="socialNetworksRef.id === -1 ? 'Ajouter' : 'Modifier'"
          icon="pi pi-check"
          @click="editOrCreate"
          :disabled="!isFormValid"
          severity="success"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
