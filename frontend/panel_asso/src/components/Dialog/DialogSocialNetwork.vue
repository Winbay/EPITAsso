<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'

import { computed, defineProps, type PropType, ref } from 'vue'
import type { SocialNetwork } from '@/types/associationInterfaces'
import { getSocialNetworkIcon, socialNetworkTypes } from '@/utils/associationUtils'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  socialNetwork: {
    type: Object as PropType<SocialNetwork>,
    required: true
  },
  editing: {
    type: Boolean,
    required: false,
    default: false
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
  props.setHidden(socialNetworksRef.value, props.editing)
}

const cancelDialog = () => {
  socialNetworksRef.value = getDefaultSocialNetwork()
  props.setHidden()
}
</script>

<template>
  <Dialog :visible="true" modal @update:visible="cancelDialog" header="Ajouter un réseau social">
    <div>
      <Dropdown
        id="socialNetworkName"
        v-model="socialNetworksRef.name"
        :options="socialNetworkTypes"
        option-label="label"
        option-value="value"
        placeholder="Sélectionner un type"
        class="w-full mb-2 h-12"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center gap-4">
            <i :class="getSocialNetworkIcon(slotProps.value)" class="text-2xl"></i>
            {{ slotProps.value }}
          </div>
          <div v-else>Choisissez un réseau social</div>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center gap-4">
            <i :class="slotProps.option.icon" class="text-2xl"></i>
            {{ slotProps.option.label }}
          </div>
        </template>
      </Dropdown>
      <InputText
        id="socialNetworkLink"
        v-model="socialNetworksRef.link"
        placeholder="Lien vers le réseau social"
        class="w-full mb-2 h-12"
      />
      <div class="flex justify-start mt-5 gap-4">
        <Button label="Annuler" icon="pi pi-times" @click="cancelDialog" severity="secondary" />
        <Button
          :label="editing ? 'Modifier' : 'Ajouter'"
          icon="pi pi-check"
          @click="editOrCreate"
          :disabled="!isFormValid"
          severity="success"
        />
      </div>
    </div>
  </Dialog>
</template>

<style>
#socialNetworkName span.p-dropdown-label {
  align-content: center;
}
</style>
