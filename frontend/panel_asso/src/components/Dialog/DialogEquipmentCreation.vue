<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import axios from 'axios'

import { ref, defineProps } from 'vue'
import { useToast } from 'primevue/usetoast'
import type {EquipmentCreation} from "@/types/equipmentInterfaces";

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  reloadEquipments: {
    type: Function,
    required: true
  }
})

const toast = useToast()

const currEquipment = ref<EquipmentCreation>({
  name: '',
  assoOwner: {id: 1, name: "EPTV", logo: "/images/eptv.jpg", description: "", location: "KB"},
  quantity: 1,
  equipmentRequest: null,
  photo: ''
})

const createEquipment = async () => {
  try {
    await axios.post(`/api/equipment`, currEquipment.value);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Enregistrement de matériel',
      detail: "Le matériel n'a pas pu être enregistré.",
      life: 3000
    })
    console.log(error)
    return false
  }
  await props.reloadEquipments()
  props.setHidden()
  return true
}

const cancelDialog = () => {
  currEquipment.value = {
    name: '',
    assoOwner: {id: 1, name: "EPTV", logo: "/images/eptv.jpg", content: "", location: "KB"},
    quantity: 1,
    equipmentRequest: null,
    photo: ''
  }
  props.setHidden()
}
</script>

<template>
  <Dialog
      class="dialog-event"
      modal
      @update:visible="cancelDialog"
      header="Enregistrement d'un matériel"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="name" class="mb-2 text-2xl font-bold text-wrap">Nom</label>
      <InputText
          id="name"
          v-model="currEquipment.name"
          aria-describedby="username-help"
          placeholder="Nom du matériel"
          maxlength="255"
          class="max-w-3xl"
      />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="quantity" class="mb-2 text-2xl font-bold text-wrap">Quantité</label>
      <InputNumber id="quantity" v-model="currEquipment.quantity" type="number" :min="1"/>
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="photo" class="mb-2 text-2xl font-bold text-wrap">Photo (Optionnelle)</label>
      <InputText id="photo" v-model="currEquipment.photo" maxlength="255" placeholder="Url de l'image"/>
      <img v-if="currEquipment.photo !== ''" :src="currEquipment.photo" alt="Matériel photo"/>
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button
            label="Enregistrer"
            severity="success"
            class="w-1/4"
            @click="createEquipment"
        />
      </div>
    </div>
  </Dialog>
</template>

<style>
</style>