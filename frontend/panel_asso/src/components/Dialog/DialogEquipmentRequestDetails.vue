<script setup lang="ts">
import Dialog from 'primevue/dialog'

import {defineProps, type PropType} from 'vue'
import type {EquipmentRequest} from "@/types/equipmentInterfaces";
import Avatar from "primevue/avatar";

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  equipmentRequest: {
    type: Object as PropType<EquipmentRequest>,
    required: true
  }
})

const cancelDialog = () => {
  props.setHidden()
}

const timestampToString = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
</script>

<template>
  <Dialog
      class="dialog-details"
      modal
      @update:visible="cancelDialog"
      header="Détails de la demande"
      v-if="equipmentRequest"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="name" class="mb-2 text-xl font-bold text-wrap underline">Matériel</label>
      <span>{{ equipmentRequest.equipmentName }}</span>
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label class="mb-2 text-xl font-bold text-wrap underline">Association emprunteuse</label>
      <div class="flex items-center">
        <Avatar
            :image="equipmentRequest.assoBorrower.logo"
            size="xlarge"
            class="flex align-items-center justify-content-center mr-2"
        />
        <div class="flex flex-col mr-4">
          <span>Nom de l'association : {{ equipmentRequest.assoBorrower.name }}</span>
          <span>Responsable : {{ equipmentRequest.userRespoBorrower.login }}</span>
          <span class="text-xs">Emprunt : {{ timestampToString(equipmentRequest.borrowingDate) }}</span>
          <span class="text-xs">Retour : {{ timestampToString(equipmentRequest.dueDate) }}</span>
        </div>
      </div>
    </div>
    <div class="title mb-6 flex justify-start items-center" v-if="equipmentRequest.userRespoOwner">
      <label class="mb-2 text-xl font-bold text-wrap underline">
        {{ equipmentRequest.status === 'accepted' ? 'Acceptée' : 'Refusée' }} par :
      </label>
      <span class="ml-4">{{ equipmentRequest.userRespoOwner.login }}</span>
    </div>
    <div class="title mb-6 flex flex-col justify-start" >
      <label class="mb-2 text-xl font-bold text-wrap underline">Commentaire</label>
      <span class="max-w-lg">{{ equipmentRequest.comment !== '' ? equipmentRequest.comment : 'Aucun commentaire fourni' }}</span>
    </div>
  </Dialog>
</template>

<style>
</style>