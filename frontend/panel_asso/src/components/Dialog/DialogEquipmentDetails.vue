<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'

import {defineProps, type PropType, ref, onMounted} from 'vue'
import type {Equipment} from "@/types/equipmentInterfaces";
import Avatar from "primevue/avatar";

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

const currEquipment = ref<Equipment>();

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

onMounted(() => {
  currEquipment.value = props.equipment;
})
</script>

<template>
  <Dialog
      class="dialog-details"
      modal
      @update:visible="cancelDialog"
      header="Détails du matériel"
      v-if="currEquipment"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="name" class="mb-2 text-xl font-bold text-wrap underline">Matériel</label>
      <span>Nom : {{ currEquipment.name }}</span>
      <span>Quantité : {{ currEquipment.quantity }}</span>
    </div>
    <div class="content mb-6 flex flex-col justify-start" v-if="currEquipment.equipmentRequest !== null">
      <label class="mb-2 text-xl font-bold text-wrap underline">Association propriétaire</label>
      <div class="flex items-center">
        <Avatar
            :image="currEquipment.assoOwner.logo"
            size="xlarge"
            class="flex align-items-center justify-content-center mr-2"
        />
        <div class="flex flex-col pl-2" v-if="currEquipment.equipmentRequest.userRespoOwner">
          <span>Nom de l'association : {{ currEquipment.assoOwner.name }}</span>
          <span>Responsable : {{ currEquipment.equipmentRequest.userRespoOwner.login }}</span>
        </div>
      </div>
    </div>
    <div class="content mb-6 flex flex-col justify-start" v-if="currEquipment.equipmentRequest !== null">
      <label class="mb-2 text-xl font-bold text-wrap underline">Association emprunteuse</label>
      <div class="flex items-center">
        <Avatar
            :image="currEquipment.equipmentRequest.assoBorrower.logo"
            size="xlarge"
            class="flex align-items-center justify-content-center mr-2"
        />
        <div class="flex flex-col mr-4">
          <span>Nom de l'association : {{ currEquipment.equipmentRequest.assoBorrower.name }}</span>
          <span>Responsable : {{ currEquipment.equipmentRequest.userRespoBorrower.login }}</span>
          <span class="text-xs">Emprunt : {{ timestampToString(currEquipment.equipmentRequest.borrowingDate) }}</span>
          <span class="text-xs">Retour : {{ timestampToString(currEquipment.equipmentRequest.dueDate) }}</span>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style>
</style>