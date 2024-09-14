<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ImageUploader from '@/components/ImageUploader.vue'

import { defineProps, type PropType, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { EquipmentModification } from '@/types/equipmentInterfaces'
import EquipmentService from '@/services/equipment/equipment'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  reloadEquipments: {
    type: Function,
    required: true
  },
  equipment: {
    type: Object as PropType<EquipmentModification>,
    required: true
  },
  oldPhoto: {
    type: String,
    required: true
  }
})

const toast = useToast()
const equipmentService: EquipmentService = new EquipmentService(toast)

const newPhoto = ref<File | null>(null)

const updateEquipment = async () => {
  const newEquipment = { ...props.equipment }
  newEquipment.photo = newPhoto.value
  await equipmentService.patchEquipment(newEquipment)
  await props.reloadEquipments()
  props.setHidden()
  return true
}

const cancelDialog = () => {
  props.setHidden()
}

const onImageChange = (file: File | null) => {
  newPhoto.value = file
}
</script>

<template>
  <Dialog
    class="dialog-event"
    modal
    @update:visible="cancelDialog"
    header="Modification du matériel"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="name" class="mb-2 text-2xl font-bold text-wrap">Nom</label>
      <InputText
        id="name"
        v-model="$props.equipment.name"
        aria-describedby="username-help"
        placeholder="Nom du matériel"
        maxlength="255"
        class="max-w-3xl"
      />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="quantity" class="mb-2 text-2xl font-bold text-wrap">Quantité</label>
      <InputNumber id="quantity" v-model="$props.equipment.quantity" type="number" :min="1" />
    </div>
    <div class="content mb-6 flex flex-col justify-start" v-if="$props.equipment.photo">
      <label class="text-2xl font-bold text-wrap">Photo actuelle</label>
      <div class="w-1/3 h-1/3 mt-2">
        <img :src="props.oldPhoto" alt="Matériel photo" />
      </div>
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="photo" class="mb-2 text-2xl font-bold text-wrap"
        >Nouvelle photo (Optionnelle)</label
      >
      <ImageUploader v-on:update:model-value="onImageChange" />
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button label="Enregistrer" severity="success" class="w-1/4" @click="updateEquipment" />
      </div>
    </div>
  </Dialog>
</template>

<style></style>
