<script setup lang="ts">
import Textarea from "primevue/textarea";
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import EquipmentRequestService from "@/services/equipment/equipmentRequest";

import { ref, defineProps } from 'vue'
import { useToast } from 'primevue/usetoast'

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
  equipmentRequestId: {
    type: Number,
    required: true
  }
})

const toast = useToast();
const equipmentRequestService: EquipmentRequestService = new EquipmentRequestService(toast);

const comment = ref<string>('');

const acceptEquipmentRequest = async () => {
  await equipmentRequestService.acceptRequest({ id: props.equipmentRequestId, comment: comment.value });
  await props.reloadEquipments();
  await props.reloadEquipmentRequests()
  props.setHidden()
  return true
}

const cancelDialog = () => {
  comment.value = '';
  props.setHidden();
}
</script>

<template>
  <Dialog
      class="dialog-event"
      modal
      @update:visible="cancelDialog"
      header="Acceptation de la demande"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="comment" class="mb-2 text-xl font-bold text-wrap">Commentaire (optionnel)</label>
      <Textarea
          v-model="comment"
          id="comment"
          placeholder="Commentaire"
          rows="3"
          cols="30"
          auto-resize
      />
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button
            label="Confirmer"
            severity="success"
            class="w-1/4"
            @click="acceptEquipmentRequest"
        />
      </div>
    </div>
  </Dialog>
</template>

<style>
</style>