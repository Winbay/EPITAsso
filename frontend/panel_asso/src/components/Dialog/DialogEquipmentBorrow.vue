<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import axios from 'axios'

import {ref, defineProps, type PropType, onMounted} from 'vue'
import { useToast } from 'primevue/usetoast'
import type {Equipment, EquipmentRequestCreation} from "@/types/equipmentInterfaces";
import type {Association} from "@/types/associationInterfaces";
import Calendar from "primevue/calendar";

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  reloadEquipments: {
    type: Function,
    required: true
  },
  reloadEquipmentRequests: {
    type: Function,
    required: true
  },
  equipment: {
    type: Object as PropType<Equipment>,
    required: true
  },
  currAsso: {
    type: Object as PropType<Association>,
    required: true
  }
})

const toast = useToast()

const currEquipment = ref<Equipment>();
const currEquipmentRequest = ref<EquipmentRequestCreation>();
const borrowingDate = ref(new Date(Date.now()));
const dueDate = ref(new Date(Date.now()));
const invalidDates = ref<Date[]>([]);

const borrowEquipment = async () => {
  if (!currEquipment.value || !currEquipmentRequest.value) { return }
  if (borrowingDate.value < new Date()){
    toast.add({
      severity: 'error',
      summary: 'Prêt de matériel',
      detail: "La date d'emprunt ne peut pas être antérieure à aujourd'hui.",
      life: 3000
    });
    return false;
  }
  if (dueDate.value < borrowingDate.value){
    toast.add({
      severity: 'error',
      summary: 'Prêt de matériel',
      detail: "La date de retour ne peut pas être antérieure à la date d'emprunt.",
      life: 3000
    });
    return false;
  }
  try {
    await axios.post(`/api/equipment/${currEquipment.value.id}/borrow`, {
      ...currEquipmentRequest.value,
      borrowingDate: borrowingDate.value.getTime() / 1000,
      dueDate: dueDate.value.getTime() / 1000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Prêt de matériel',
      detail: "La demande de prêt du matériel n'a pas pu être créée.",
      life: 3000
    })
    console.log(error)
    return false
  }
  await props.reloadEquipments()
  await props.reloadEquipmentRequests();
  props.setHidden()
  return true
}

const cancelDialog = () => {
  currEquipmentRequest.value = {
    equipmentId: props.equipment.id,
    assoBorrower: props.currAsso,
    borrowingDate: Date.now() / 1000,
    dueDate: Date.now() / 1000
  };
  borrowingDate.value = new Date(Date.now());
  dueDate.value = new Date(Date.now());
  props.setHidden()
}

const loadInvalidDates = async () => {
  try {
    const rep = await axios.post<number[][]>(`/api/equipment/${props.equipment.id}/invalid-dates`,
        { id: props.equipment.id });
    const timestampList = rep.data;
    timestampList.forEach((timestampTuple) => {
      const startDate = new Date(timestampTuple[0] * 1000);
      const endDate = new Date(timestampTuple[1] * 1000);
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        invalidDates.value.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    })
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Matériel - Dates invalides',
      detail: `La liste des dates invalides pour le matériel ${props.equipment?.name} n'a pas pu être chargée`,
      life: 3000
    })
    console.log(error)
    return false
  }
}

onMounted(() => {
  currEquipment.value = props.equipment;
  currEquipmentRequest.value = {
    equipmentId: props.equipment.id,
    assoBorrower: props.currAsso,
    borrowingDate: Date.now() / 1000,
    dueDate: Date.now() / 1000
  }
})
</script>

<template>
  <Dialog
      modal
      @update:visible="cancelDialog"
      header="Emprunt du matériel"
      v-if="currEquipment && currEquipmentRequest"
      @show="loadInvalidDates()"
  >
    <div class="mb-6 flex">
      <div class="title flex flex-col justify-start">
        <label for="name" class="mb-2 text-xl font-bold text-wrap">Matériel</label>
        <span>Nom : {{ currEquipment.name }}</span>
        <span>Quantité : {{ currEquipment.quantity }}</span>
      </div>
      <div v-if="currEquipment.photo !== ''" class="photo flex justify-start max-w-32 max-h-32 ml-6">
        <img :src="currEquipment.photo" alt="Matériel photo"/>
      </div>
    </div>

    <div class="mb-6 flex">
      <div class="flex flex-col mr-6">
        <label class="mb-2 text-xl font-bold text-wrap">Date d'emprunt</label>
        <Calendar
            v-model="borrowingDate"
            :disabled-dates="invalidDates"
            dateFormat="dd/mm/yy"
        />
      </div>
      <div class="flex flex-col">
        <label class="mb-2 text-xl font-bold text-wrap">Date de retour</label>
        <Calendar
            v-model="dueDate"
            :disabled-dates="invalidDates"
            dateFormat="dd/mm/yy"
        />
      </div>
    </div>

    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button
            label="Confirmer"
            severity="success"
            class="w-1/4"
            @click="borrowEquipment"
        />
      </div>
    </div>
  </Dialog>
</template>

<style>
</style>