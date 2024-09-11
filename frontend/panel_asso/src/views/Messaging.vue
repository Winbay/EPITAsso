<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Listbox from 'primevue/listbox'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

import type { Association } from '@/types/associationInterfaces'
import type { Conversation } from '@/types/conversationInterfaces'
import MessagesView from '@/components/Messaging/MessagesView.vue'
import ConversationService from '@/services/messaging/conversation'
import AssociationService from '@/services/association/association'
import SelectedAssoService from '@/services/association/selectedAsso'
import { on } from '@/utils/eventBus'
import AssociationDetailService from '@/services/association/details'

const confirm = useConfirm()
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

const openOverlayPanel = async (event: Event): Promise<void> => {
  if (overlayPanelRef.value) {
    overlayPanelRef.value.toggle(event)
  }
}

const fetchConversations = async (): Promise<void> => {
  isLoading.value = true
  conversationsRef.value = await conversationService.getConversations()
  isLoading.value = false
}

const createConversation = async (): Promise<void> => {
  if (!newConversationNameRef.value || selectedAssociationsRef.value.length === 0) return
  const newConversation = {
    name: newConversationNameRef.value,
    associationIds: [
      ...selectedAssociationsRef.value.map((asso) => asso.id),
      +SelectedAssoService.getAssociationId()
    ],
    lastSentAt: new Date()
  }
  const conversation = await conversationService.createConversation(newConversation)
  newConversationNameRef.value = conversation.name
  selectedConversationRef.value = conversation
  conversationsRef.value.push(conversation)
  selectedAssociationsRef.value = []
  if (overlayPanelRef.value) {
    overlayPanelRef.value.hide()
  }

  newConversationNameRef.value = null
}

const confirmDelete = (event: Event, conversation: Conversation) => {
  event.stopPropagation()
  confirm.require({
    target: event.currentTarget as HTMLElement,
    header: `Suppression de la conversation "${conversation.name}"`,
    message: 'Êtes-vous sûr de vouloir supprimer cette conversation ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: async () => {
      await deleteConversation(conversation)
    }
  })
}

const deleteConversation = async (conversation: Conversation): Promise<void> => {
  await conversationService.deleteConversation(conversation.id) // TODO can not be smth like that
  conversationsRef.value = conversationsRef.value.filter((conv) => conv.id !== conversation.id)
  if (selectedConversationRef.value?.id === conversation.id) {
    selectedConversationRef.value = null
  }
}

onMounted(async () => {
  associationsRef.value = await associationService.getAssociations()
  await fetchConversations()

  on('association-changed', async () => {
    await fetchConversations()
  })
})
</script>

<template>
  <div v-if="isLoading" class="content-center text-center h-full">
    <ProgressSpinner />
  </div>
  <div v-else class="grid grid-cols-3 gap-4 mt-8 mx-8" style="height: 90vh">
    <div class="col-span-1">
      <div class="p-grid p-fluid mb-2">
        <Button
          icon="pi pi-plus"
          class="add-btn px-4 h-full"
          label="Nouvelle conversation"
          @click="openOverlayPanel($event)"
        />
      </div>
      <Listbox
        v-if="conversationsRef.length > 0"
        v-model="selectedConversationRef"
        :options="conversationsRef"
        filter
        optionLabel="name"
      >
        <template #option="slotProps">
          <div class="flex justify-between items-center">
            <span>{{ slotProps.option.name }}</span>
            <!-- <Button
              icon="pi pi-trash"
              class="p-button-danger delete-btn"
              text
              @click="confirmDelete($event, slotProps.option)"
            /> -->
          </div>
        </template>
      </Listbox>
      <div v-else class="p-20 text-center">
        <h3>Pas de conversations</h3>
      </div>
    </div>
    <div class="col-span-2">
      <MessagesView
        v-if="selectedConversationRef"
        :key="selectedConversationRef.id"
        class="ml-4"
        :conversation="selectedConversationRef"
        :associations="
          associationsRef.filter((asso) =>
            (selectedConversationRef as Conversation).associationIds.includes(asso.id)
          )
        "
      />
    </div>
  </div>

  <OverlayPanel ref="overlayPanelRef">
    <InputText class="mr-4" v-model="newConversationNameRef" placeholder="Nom de la conversation" />
    <MultiSelect
      class="mr-4"
      display="chip"
      v-model="selectedAssociationsRef"
      :options="
        associationsRef.filter((asso) => asso.id !== +SelectedAssoService.getAssociationId())
      "
      filter
      option-label="name"
      placeholder="Selectionner des associations"
    />
    <Button
      type="button"
      label="Créer"
      @click="createConversation"
      :disabled="!newConversationNameRef"
    />
  </OverlayPanel>

  <ConfirmDialog />
</template>

<style scoped>
.add-btn {
  color: var(--text-color);
}
</style>
