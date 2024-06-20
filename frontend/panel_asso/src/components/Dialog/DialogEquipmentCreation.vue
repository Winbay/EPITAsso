<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

import { ref, defineProps } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { EquipmentCreation } from '@/types/equipmentInterfaces'
import EquipmentService from '@/services/equipment/equipment'

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
const equipmentService: EquipmentService = new EquipmentService(toast)

const currEquipment = ref<EquipmentCreation>({
  name: '',
  quantity: 1,
  photo: ''
})

const createEquipment = async () => {
  // TODO use POST return object to update the list of equipments
  await equipmentService.createEquipment(currEquipment.value)
  await props.reloadEquipments()
  props.setHidden()
  return true // TODO why ?
}

const cancelDialog = () => {
  currEquipment.value = {
    name: '',
    quantity: 1,
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
      <InputNumber id="quantity" v-model="currEquipment.quantity" type="number" :min="1" />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="photo" class="mb-2 text-2xl font-bold text-wrap">Photo (Optionnelle)</label>
      <InputText
        id="photo"
        v-model="currEquipment.photo"
        maxlength="255"
        placeholder="Url de l'image"
      />
      <img v-if="currEquipment.photo !== ''" :src="currEquipment.photo" alt="Matériel photo" />
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button label="Enregistrer" severity="success" class="w-1/4" @click="createEquipment" />
      </div>
    </div>
  </Dialog>
</template>

<style></style>
