<script setup lang="ts">
import { getSocialNetworkImage } from '@/utils/associationUtils'
import type { SocialNetwork } from '@/types/associationInterfaces'
import { type PropType, ref } from 'vue'
import SpeedDial from 'primevue/speeddial'
import DialogSocialNetwork from '@/components/Dialog/DialogSocialNetwork.vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import type { MenuItem } from 'primevue/menuitem'

const props = defineProps({
  socialNetworks: {
    type: Array as PropType<SocialNetwork[]>,
    required: true
  }
})

const items = (index: number) =>
  [
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      severity: 'info',
      command: () => {
        editSocialNetwork(index)
      }
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      severity: 'danger',
      command: () => {
        deleteSocialNetwork(index)
      }
    }
  ] as MenuItem[]

const getDefaultSocialNetwork = (): SocialNetwork => ({
  id: -1,
  name: '',
  link: ''
})

const socialNetworksRef = ref<SocialNetwork[]>(props.socialNetworks)
const visibleDialogRef = ref(false)
const selectedSocialNetworkRef = ref<SocialNetwork>(getDefaultSocialNetwork())

const closeDialog = (
  socialNetwork: SocialNetwork | null = null,
  isEditing: boolean = false
): void => {
  if (socialNetwork) {
    if (isEditing) {
      const index = socialNetworksRef.value.findIndex((item) => item.id === socialNetwork.id)
      socialNetworksRef.value[index] = socialNetwork
    } else {
      socialNetworksRef.value.push(socialNetwork)
    }
  }
  visibleDialogRef.value = false
}

const isEditingSocialNetwork = ref<boolean>(false)

const editSocialNetwork = (index: number): void => {
  isEditingSocialNetwork.value = true
  selectedSocialNetworkRef.value = socialNetworksRef.value[index]
  visibleDialogRef.value = true
}

const deleteSocialNetwork = (index: number): void => {
  socialNetworksRef.value.splice(index, 1)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <label class="block mb-2 text-2xl font-bold text-wrap">Réseaux sociaux</label>
      <Button
        @click="
          () => {
            selectedSocialNetworkRef = getDefaultSocialNetwork()
            visibleDialogRef = true
          }
        "
        label="Ajouter un réseau social"
        icon="pi pi-plus"
        class="mb-5"
        outlined
      />
    </div>
    <Divider class="mt-0"></Divider>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(socialNetwork, index) in socialNetworksRef"
        :key="socialNetwork.name"
        class="relative"
      >
        <SpeedDial :model="items(index)" direction="down" class="relative">
          <template #button="{ toggleCallback }">
            <i
              @click="toggleCallback"
              :class="getSocialNetworkImage(socialNetwork.name)"
              class="text-3xl avatar cursor-pointer"
              :title="socialNetwork.name"
            />
          </template>
          <template #item="{ item, onClick }">
            <div class="speeddial-list">
              <Button @click="onClick" :icon="item.icon" :severity="item.severity" text />
            </div>
          </template>
        </SpeedDial>
      </div>
      <DialogSocialNetwork
        v-if="visibleDialogRef"
        v-model:visible="visibleDialogRef"
        :set-hidden="closeDialog"
        :social-network="JSON.parse(JSON.stringify(selectedSocialNetworkRef))"
        :editing="isEditingSocialNetwork"
      />
    </div>
  </div>
</template>

<style>
.avatar:hover {
  filter: brightness(80%);
}
.p-speeddial-list {
  position: absolute;
  top: 4rem;
  z-index: 10;
}
.speeddial-list {
  display: flex;
  flex-direction: column;
  background-color: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.3rem rgba(0, 0, 0, 1);
}
</style>
