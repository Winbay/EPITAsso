<script setup lang="ts">

import '@/fixtures/messages'
import { computed, onMounted, type PropType, ref, watch } from 'vue'

import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from 'primevue/usetoast'

import type { Conversation } from '@/types/conversationInterfaces'
import type { Message } from '@/types/messageInterfaces'
import MessageComponent from '@/components/Messaging/MessageComponent.vue'
import MessageService from '@/services/messaging/message'

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  },
});

const toast = useToast()
const messageService = ref<MessageService>(new MessageService(toast, props.conversation.id))

const messagesRef = ref<Message[]>([])
const isLoading = ref(true)
const newMessageContent = ref("")

const reversedMessages = computed(() => {
  return messagesRef.value?.slice().sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime()).reverse() || [];
});

async function fetchConversation() {
  isLoading.value = true
  messagesRef.value = await messageService.value.getMessages()
  isLoading.value = false
}

async function sendMessage() {
  if (newMessageContent.value.length === 0) return
  const newMessage = {
    id: 1,
    conversation: props.conversation,
    content: newMessageContent.value,
    author: {
      id: "1",
      login: "Moi",
      firstName: "Moi",
      lastName: "Moi",
    },
    associationSender: {
      id: 1,
      name: "Asso",
      description: "Description",
      location: "Location",
      logo: "https://via.placeholder.com/150"
    },
    sentAt: new Date()
  }
  await messageService.value.createMessage(newMessage)
  newMessageContent.value = ""
  await fetchConversation()
}

onMounted(() => {
  fetchConversation()
})

watch(() => props.conversation.id, async (newConversationId) => {
  messageService.value = new MessageService(toast, newConversationId)
  await fetchConversation()
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
          <Chip class="mr-2 mb-2" v-for="association in conversation!.associationsInConversation" :key="association.id" :label="association.name" />
        </div>
        <Divider />
        <div id="messagesContainer">
          <div v-for="message in reversedMessages" :key="message.id">
            <MessageComponent :message="message" class="mb-2"/>
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="mt-2 flex items-center">
        <InputText v-model="newMessageContent" placeholder="Écrivez un message" class="flex-grow p-inputtext-sm" />
        <Button :disabled="newMessageContent.length === 0" type="submit" label="Envoyer" class="ml-2 p-button-sm p-button-primary" />
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