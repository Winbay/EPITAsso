<script setup lang="ts">

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
const conversationService: ConversationService = new ConversationService(toast)
const associationService: AssociationService = new AssociationService(toast)

const isLoading = ref(true)
const conversationsRef = ref<Conversation[]>([])
const selectedConversationRef = ref<Conversation | null>(null)
const newConversationNameRef = ref<string | null>(null)
const selectedAssociationsRef = ref<Association[]>([])
const associationsRef = ref<Association[]>([])

const overlayPanelRef = ref<OverlayPanel>()

async function openOverlayPanel(event: Event): Promise<void> {
  if (overlayPanelRef.value) {
    overlayPanelRef.value.toggle(event)
  }
}

async function fetchConversations(): Promise<void> {
  isLoading.value = true
  conversationsRef.value = await conversationService.getConversations()
  isLoading.value = false
}

async function createConversation(): Promise<void> {
  if (!newConversationNameRef.value || selectedAssociationsRef.value.length === 0) return
  const newConversation = {
    name: newConversationNameRef.value,
    associationIds: [...selectedAssociationsRef.value.map(asso => asso.id), ASSOCIATION_ID],
    lastSentAt: new Date(),
  }
  await conversationService.createConversation(newConversation)
  newConversationNameRef.value = null
  selectedAssociationsRef.value = []
  if (overlayPanelRef.value) {
    overlayPanelRef.value.hide()
  }
  await fetchConversations()
}

async function deleteConversation(conversation: Conversation): Promise<void> {
  await conversationService.deleteConversation(conversation.id) // TODO can not be smth like that
  conversationsRef.value = conversationsRef.value.filter(conv => conv.id !== conversation.id)
}

onMounted(async () => {
  const associations = await associationService.getAssociations()
  associationsRef.value = associations
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
        <Button icon="pi pi-plus" class="p-col-6 p-d-flex p-jc-end" text label="Nouvelle conversation" @click="openOverlayPanel($event)" />
      </div>
      <Listbox v-if="conversationsRef.length > 0" v-model="selectedConversationRef" :options="conversationsRef" filter optionLabel="name">
        <template #option="slotProps">
          <div class="flex justify-between items-center">
            <span>{{ slotProps.option.name }}</span>
            <Button icon="pi pi-trash" class="p-button-danger" text @click.stop="deleteConversation(slotProps.option)"/>
          </div>
        </template>
      </Listbox>
      <div v-else class="p-20 text-center">
        <h3> Pas de conversations </h3>
      </div>
    </div>
    <div class="col-span-2">
      <MessagesView 
        v-if="selectedConversationRef"
        :key="selectedConversationRef.id"
        class="ml-4"
        :conversation="selectedConversationRef"
        :associations="associationsRef.filter(asso => (selectedConversationRef as Conversation).associationIds.includes(asso.id))"
      />
    </div>
  </div>

  <OverlayPanel ref="overlayPanelRef">
    <InputText class="mr-4" v-model="newConversationNameRef" placeholder="Nom de la conversation" />
    <MultiSelect class="mr-4" display="chip" v-model="selectedAssociationsRef" :options="associationsRef.filter(asso => asso.id !== ASSOCIATION_ID)" filter option-label="name" placeholder="Selectionner des associations" />
    <Button type="button" label="Créer" @click="createConversation" :disabled="!newConversationNameRef"/>
  </OverlayPanel>
</template>

<style scoped>

</style>