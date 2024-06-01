<script setup lang="ts">

import '@/fixtures/associations'
import '@/fixtures/users'
import { onMounted, ref } from 'vue'

import Listbox from 'primevue/listbox';
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'

import type {Association} from "@/types/associationInterfaces";
import type {Conversation} from "@/types/conversationInterfaces";
import type {User} from "@/types/userInterfaces";
import MessagesView from '@/components/Messaging/MessagesView.vue'

import djangoApi from '@/services/api'

const props = defineProps<{
  user: User,
  association: Association
}>();

const selectedConversation = ref<Conversation | null>(null)
const conversations = ref<Conversation[]>([])
const newConversationName = ref<string | null>(null)
const associations = ref<Association[]>([])
const selectedAssociations = ref<Association[]>([])

const overlayPanel = ref()

function toggle(event: Event) {
  if (overlayPanel.value) {
    try {
      djangoApi.get<Association[]>(`/api/association`)
        .then(response => associations.value = response.data)
    } catch (error) {
      console.error(error)
    }
    overlayPanel.value.toggle(event)
  }
}

async function createConversation() {
  if (!newConversationName.value) {
    return
  }
  try {
    await djangoApi.post<Conversation>(`/api/conversation`, {
      name: newConversationName.value,
      associations: [props.association, ...selectedAssociations.value],
    }).then(response => conversations.value.push(response.data))
  } catch (error) {
    console.error(error)
  }

  selectedAssociations.value = []
  newConversationName.value = null
  overlayPanel.value.hide()
}

async function deleteConversation(conversation: Conversation) {
  try {
    await djangoApi.delete(`/api/conversation/${conversation.id}`)
    conversations.value = conversations.value.filter(c => c.id !== conversation.id)
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  try {
    const response = await djangoApi.get<Conversation[]>(`/api/conversation`, {
      params: {
        associationId: props.association.id
      }
    })
    conversations.value = response.data
  } catch (error) {
    console.error(error)
  }
})

</script>

<template>
  <div class="grid grid-cols-3 gap-4 mt-8 mx-8" style="height: 90vh">
    <div class="col-span-1">
      <div class="p-grid p-fluid mb-2">
        <Button icon="pi pi-plus" class="p-col-6 p-d-flex p-jc-end" text label="Nouvelle conversation" @click="toggle($event)" />
      </div>
      <Listbox v-if="conversations.length > 0" v-model="selectedConversation" :options="conversations" filter optionLabel="name">
        <template #option="slotProps">
          <div class="flex justify-between items-center">
            <span>{{ slotProps.option.name }}</span>
<!--            <Chip :key="slotProps.option.associations[0].id" :label="slotProps.option.associations[0].name" />-->
            <Button icon="pi pi-trash" class="p-button-danger" text @click.stop="deleteConversation(slotProps.option)"/>
          </div>
        </template>
      </Listbox>
    </div>
    <div class="col-span-2">
      <MessagesView v-if="selectedConversation" class="ml-4" :conversationId="selectedConversation.id" :user="user" :user-association-id="association.id" />
    </div>
  </div>

  <OverlayPanel ref="overlayPanel">
    <InputText class="mr-4" v-model="newConversationName" placeholder="Nom de la conversation" />
    <MultiSelect class="mr-4" display="chip" v-model="selectedAssociations" :options="associations.filter(asso => asso.id !== association.id)" filter option-label="name" placeholder="Selectionner des associations" />
    <Button type="button" label="Créer" @click="createConversation" :disabled="!newConversationName"/>
  </OverlayPanel>
</template>

<style scoped>

</style>