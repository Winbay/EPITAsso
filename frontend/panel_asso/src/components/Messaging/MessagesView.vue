<script setup lang="ts">

import '@/fixtures/associations'
import '@/fixtures/conversations'
import '@/fixtures/messages'
import djangoApi from '@/services/api'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'

import ProgressSpinner from 'primevue/progressspinner';

import Divider from 'primevue/divider';
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import type { User } from '@/types/userInterfaces'
import type { Conversation } from '@/types/conversationInterfaces'
import MessageComponent from '@/components/Messaging/MessageComponent.vue'

const props = defineProps<{
  conversationId: number,
  user: User,
  userAssociationId: number
}>();

const conversation = ref<Conversation | null>(null)
const isLoading = ref(true)
const newMessage = ref("")
const socket = ref<WebSocket | null>(null)

const reversedMessages = computed(() => {
  return conversation.value?.messages.slice().reverse() || [];
});

async function fetchConversation() {
  isLoading.value = true
  try {
    const response = await djangoApi.get<Conversation>(`/api/conversation/${props.conversationId}`)
    conversation.value = response.data
    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

async function sendMessage() {
  if (newMessage.value.length === 0) {
    return
  }
  try {
    const response = await djangoApi.post(`/api/message`, {
      content: newMessage.value,
      user_sender: props.user.id,
      conversation: props.conversationId,
      association: props.userAssociationId
    })
    conversation.value!.messages.push(response.data)
    newMessage.value = ""
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.conversationId,
  () => {
    conversation.value = null
    fetchConversation()
  }
)


onMounted(() => {
  fetchConversation()
  // socket.value = new WebSocket(`ws://localhost:8000/ws/chat/${props.conversationId}/`)
  // socket.value.onmessage = (event) => {
  //   const message: MessageInterfaces = (JSON.parse(event.data)).message
  //   if (message.user_sender === props.user.id) {
  //     return
  //   }
  //   conversation.value!.messages.push(message)
  // }
})

onBeforeMount(() => {
  if (socket.value) {
    socket.value.close()
  }
})

</script>

<template>
  <div class="flex flex-col h-full p-4 rounded-lg shadow-md">
    <div v-if="isLoading" class="content-center text-center h-full">
      <ProgressSpinner />
    </div>
    <div v-else class="flex flex-col h-full">
      <div class="flex-grow">
        <h1 class="text-lg font-semibold">{{ conversation!.name }}</h1>
        <div class="flex flex-wrap mt-2">
          <Chip class="mr-2 mb-2" v-for="association in conversation!.associations" :key="association.id" :label="association.name" />
        </div>
        <Divider />
        <div id="messagesContainer">
          <div v-for="message in reversedMessages" :key="message.id">
            <MessageComponent :message="message" :user="user" class="mb-2"/>
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="mt-2 flex items-center">
        <InputText v-model="newMessage" placeholder="Écrivez un message" class="flex-grow p-inputtext-sm" />
        <Button :disabled="newMessage.length === 0" type="submit" label="Envoyer" class="ml-2 p-button-sm p-button-primary" />
      </form>
    </div>
  </div>
</template>

<style>

#messagesContainer {
  width: 100%;
  max-height: calc(90vh - 190px);
  padding: 25px 10px 10px;
  display: flex;
  overflow-y: auto;
  flex-direction: column-reverse;
}

#messagesContainer::-webkit-scrollbar {
  width: 10px;
}

#messagesContainer::-webkit-scrollbar-track {
  background: var(--surface-50);
}

#messagesContainer::-webkit-scrollbar-thumb {
  background: var(--surface-300);
  border-radius: 0;
  opacity: 1;
}

#messagesContainer::-webkit-scrollbar-thumb:hover {
  background: var(--surface-200);
  cursor: pointer;
}
</style>