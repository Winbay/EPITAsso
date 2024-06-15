<script setup lang="ts">

import '@/fixtures/messages'
import { computed, nextTick, onMounted, type PropType, ref, watch } from 'vue'

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
const limit = 10
const offset = ref(0)


async function fetchConversation() {
  isLoading.value = true
  offset.value = messagesRef.value.length
  const messages = await messageService.value.getMessages(limit, offset.value)
  messagesRef.value = [...messagesRef.value, ...messages]
  isLoading.value = false
}

async function sendMessage() {
  if (newMessageContent.value.length === 0) return
  // TODO: set right author and association sender
  const newMessage = {
    id: 1,
    conversation: props.conversation,
    content: newMessageContent.value,
    author: {
      id: "1",
      login: "nathan.lenogue",
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
  messagesRef.value.push(newMessage)
  await scrollToEnd()
}

async function handleScrollEnd(event: Event) {
  const target = event.target as HTMLElement;
  const lastScrollHeight = target.scrollHeight
  if (target.scrollTop === 0){
    await fetchConversation()
    await nextTick(() => {
      target.scrollTop = target.scrollHeight - lastScrollHeight;
    })
  }
}

async function scrollToEnd() {
  const scrollElement = document.querySelector("#messagesContainer");
  if (scrollElement) {
    await nextTick(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight
    })
  }
}

onMounted(async () => {
  await fetchConversation()
  await scrollToEnd()
})

</script>

<template>
  <div class="flex flex-col h-full p-4 rounded-lg shadow-md">
    <div v-show="isLoading" class="content-center text-center h-full">
      <ProgressSpinner />
    </div>
    <div v-show="!isLoading" class="flex flex-col h-full">
      <div class="flex-grow">
        <h1 class="text-lg font-semibold">{{ conversation!.name }}</h1>
        <div class="flex flex-wrap mt-2">
          <Chip class="mr-2 mb-2" v-for="association in conversation!.associationsInConversation" :key="association.id" :label="association.name" />
        </div>
        <Divider />
        <div id="messagesContainer" @scroll="handleScrollEnd">
          <div v-for="message in messagesRef" :key="message.id">
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
  flex-direction: column;
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