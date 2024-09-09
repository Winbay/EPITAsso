<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'

import { ref, defineProps, type PropType } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { AssociationDetail } from '@/types/associationInterfaces'
import FAQ from '@/components/FAQ.vue'
import SocialNetworks from '@/components/SocialNetworks.vue'
import AssociationDetailService from '@/services/association/details'
import DiscordWebhookService from '@/services/discordWebhook'
import { emit } from '@/utils/eventBus'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  association: {
    type: Object as PropType<AssociationDetail>,
    required: true
  }
})

const toast = useToast()

const associationDetailService: AssociationDetailService = new AssociationDetailService(
  toast,
  props.association.id
)

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  content: '',
  location: '',
  logo: '',
  webhook: '',
  socialNetworks: [],
  faqs: []
})

const currAssociationRef = ref<AssociationDetail>(props.association)

const saveUpdate = async (): Promise<void> => {
  if (currAssociationRef.value) {
    if (!DiscordWebhookService.checkAttributeValidity(currAssociationRef.value.webhook)) {
      toast.add({
        severity: 'error',
        summary: 'Webhook Discord',
        detail: 'Le lien du Webhook Discord est invalide.',
        life: 3000
      })
      return
    }
    await associationDetailService.updateAssociationDetail(currAssociationRef.value).then(() => {
      emit('association-changed', currAssociationRef.value.id)
    })
  }
  props.setHidden()
}

const cancelDialog = (): void => {
  if (props.association) {
    currAssociationRef.value = props.association
  } else {
    currAssociationRef.value = getDefaultAssociation()
  }
  props.setHidden()
}

const handleImageClick = (): void => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', handleImageChange)
  input.click()
}

const handleImageChange = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (!input || !input.files || input.files.length === 0) {
    return
  }
  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = () => {
    if (reader.result && currAssociationRef.value) {
      currAssociationRef.value.logo = reader.result.toString()
    }
  }

  if (file) {
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <Dialog
    class="dialog-association"
    modal
    :visible="true"
    @update:visible="cancelDialog"
    :header="'Modification de l\'association'"
  >
    <div v-if="currAssociationRef">
      <div class="mb-6 mt-6 flex items-center justify-center">
        <div class="relative">
          <Avatar
            :image="currAssociationRef.logo"
            shape="circle"
            style="width: 10rem; height: 10rem"
          />
          <div class="edit-overlay" @click="handleImageClick" style="width: 10rem; height: 10rem">
            <i class="pi pi-pencil" style="font-size: 2rem"></i>
          </div>
        </div>
        <div class="ml-4">
          <label for="associationName" class="block mb-2 text-2xl font-bold text-wrap"
            >Nom de l'association</label
          >
          <InputText
            id="associationName"
            v-model="currAssociationRef.name"
            aria-describedby="name-help"
            placeholder="Nom de l'association"
            maxlength="255"
            class="w-full"
          />
        </div>
      </div>

      <div class="mb-6">
        <label for="associationDescription" class="block mb-2 text-2xl font-bold text-wrap"
          >Description de l'association</label
        >
        <Textarea
          id="associationDescription"
          v-model="currAssociationRef.content"
          class="w-full"
          rows="5"
          autoResize
        />
      </div>

      <div class="mb-6">
        <div class="flex items-center mb-2">
          <label for="associationWebhook" class="block mr-2 text-2xl font-bold text-wrap"
            >Évènements - Webhook Discord (optionnel)</label
          >
          <i class="pi pi-info-circle" v-tooltip.top="DiscordWebhookService.webhookTooltip" />
        </div>

        <InputText
          id="associationWebhook"
          v-model="currAssociationRef.webhook"
          placeholder="Url du webhook"
          maxlength="255"
          type="url"
          class="w-full"
          :invalid="!DiscordWebhookService.checkAttributeValidity(currAssociationRef.webhook)"
        />
      </div>

      <SocialNetworks :socialNetworks="currAssociationRef.socialNetworks" />

      <FAQ :editing="true" :faqs="currAssociationRef.faqs" />

      <div class="mt-6 flex justify-start gap-4">
        <Button label="Annuler" severity="secondary" @click="cancelDialog" />
        <Button label="Sauvegarder" severity="success" @click="saveUpdate" />
      </div>
    </div>
  </Dialog>
</template>

<style>
.dialog-association {
  width: 764px;
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.edit-overlay:hover {
  opacity: 1;
}
</style>
