<script setup lang="ts">

import '@/fixtures/associations'
import '@/fixtures/users'
import { onMounted, ref } from 'vue'

import Listbox from 'primevue/listbox';
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'

import type {Association} from "@/types/associationInterfaces";
import type {Conversation} from "@/types/conversationInterfaces";
import MessagesView from '@/components/Messaging/MessagesView.vue'
import ConversationService from '@/services/messaging/conversation'
import AssociationService from '@/services/association/association'

const ASSOCIATION_ID = 1

const toast = useToast()
const conversationService: ConversationService = new ConversationService(toast, ASSOCIATION_ID)
const associationService: AssociationService = new AssociationService(toast)

const isLoading = ref(true)
const conversationsRef = ref<Conversation[]>([])
const selectedConversation = ref<Conversation | null>(null)
const newConversationName = ref<string | null>(null)
const associations = ref<Association[]>([])
const selectedAssociations = ref<Association[]>([])

const overlayPanel = ref()

async function toggle(event: Event) {
  if (overlayPanel.value) {
    try {
      associationService.getAssociations()
        .then(response => associations.value = response)
    } catch (error) {
      console.error(error)
    }
    overlayPanel.value.toggle(event)
  }
}

async function fetchConversations() {
  isLoading.value = true
  conversationsRef.value = await conversationService.getConversations()
  isLoading.value = false
}

async function createConversation() {
  if (!newConversationName.value || selectedAssociations.value.length === 0) return
  const newConversation = {
    name: newConversationName.value,
    associationsInConversation: selectedAssociations.value,
    lastSentAt: new Date(),
  }
  await conversationService.createConversation(newConversation)
  newConversationName.value = null
  selectedAssociations.value = []
  overlayPanel.value.hide()
  await fetchConversations()
}

async function deleteConversation(conversation: Conversation) {
  await conversationService.deleteConversation(conversation.id)
  conversationsRef.value = conversationsRef.value.filter(conv => conv.id !== conversation.id)
}

onMounted(async () => {
  await fetchConversations()
})

</script>

<template>
  <div v-if="isLoading" class="content-center text-center h-full">
    <ProgressSpinner />
  </div>
  <div v-else class="grid grid-cols-3 gap-4 mt-8 mx-8" style="height: 90vh">
    <div class="col-span-1">
      <div class="p-grid p-fluid mb-2">
        <Button icon="pi pi-plus" class="p-col-6 p-d-flex p-jc-end" text label="Nouvelle conversation" @click="toggle($event)" />
      </div>
      <Listbox v-if="conversationsRef.length > 0" v-model="selectedConversation" :options="conversationsRef" filter optionLabel="name">
        <template #option="slotProps">
          <div class="flex justify-between items-center">
            <span>{{ slotProps.option.name }}</span>
            <Button icon="pi pi-trash" class="p-button-danger" text @click.stop="deleteConversation(slotProps.option)"/>
          </div>
        </template>
      </Listbox>
    </div>
    <div class="col-span-2">
      <MessagesView v-if="selectedConversation" :key="selectedConversation.id" class="ml-4" :conversation="selectedConversation"/>
    </div>
  </div>

  <OverlayPanel ref="overlayPanel">
    <InputText class="mr-4" v-model="newConversationName" placeholder="Nom de la conversation" />
    <MultiSelect class="mr-4" display="chip" v-model="selectedAssociations" :options="associations.filter(asso => asso.id !== ASSOCIATION_ID)" filter option-label="name" placeholder="Selectionner des associations" />
    <Button type="button" label="Créer" @click="createConversation" :disabled="!newConversationName"/>
  </OverlayPanel>
</template>

<style scoped>

</style>