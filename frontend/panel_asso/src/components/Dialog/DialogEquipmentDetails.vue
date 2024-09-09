<script setup lang="ts">
import Dialog from 'primevue/dialog'

import { defineProps, type PropType } from 'vue'
import type { Equipment } from '@/types/equipmentInterfaces'
import Avatar from 'primevue/avatar'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  equipment: {
    type: Object as PropType<Equipment>,
    required: true
  }
})

const cancelDialog = () => {
  props.setHidden()
}

const timestampToString = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
</script>

<template>
  <Dialog
    class="dialog-details"
    modal
    @update:visible="cancelDialog"
    header="Détails du matériel"
    v-if="props.equipment"
  >
    <div class="mb-6 flex">
      <div class="title flex flex-col justify-start">
        <label for="name" class="mb-2 text-xl font-bold text-wrap underline">Matériel</label>
        <span>Nom : {{ props.equipment.name }}</span>
        <span>Quantité : {{ props.equipment.quantity }}</span>
      </div>
      <div
        v-if="props.equipment.photo !== ''"
        class="photo flex justify-start max-w-32 max-h-32 ml-6"
      >
        <img :src="props.equipment.photo" alt="Matériel photo" />
      </div>
    </div>
    <div
      class="content mb-6 flex flex-col justify-start"
      v-if="props.equipment.equipmentRequest !== null"
    >
      <label class="mb-2 text-xl font-bold text-wrap underline">Association propriétaire</label>
      <div class="flex items-center">
        <Avatar
          :image="props.equipment.assoOwner.logo"
          size="xlarge"
          class="flex align-items-center justify-content-center mr-2"
        />
        <div class="flex flex-col pl-2" v-if="props.equipment.equipmentRequest.userRespoOwner">
          <span>Nom de l'association : {{ props.equipment.assoOwner.name }}</span>
          <span>Responsable : {{ props.equipment.equipmentRequest.userRespoOwner.login }}</span>
        </div>
      </div>
    </div>
    <div
      class="content mb-6 flex flex-col justify-start"
      v-if="props.equipment.equipmentRequest !== null"
    >
      <label class="mb-2 text-xl font-bold text-wrap underline">Association emprunteuse</label>
      <div class="flex items-center">
        <Avatar
          :image="props.equipment.equipmentRequest.assoBorrower.logo"
          size="xlarge"
          class="flex align-items-center justify-content-center mr-2"
        />
        <div class="flex flex-col mr-4">
          <span>Nom de l'association : {{ props.equipment.equipmentRequest.assoBorrower.name }}</span>
          <span>Responsable : {{ props.equipment.equipmentRequest.userRespoBorrower.login }}</span>
          <span class="text-xs"
            >Emprunt : {{ timestampToString(props.equipment.equipmentRequest.borrowingDate) }}</span
          >
          <span class="text-xs"
            >Retour : {{ timestampToString(props.equipment.equipmentRequest.dueDate) }}</span
          >
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style></style>
