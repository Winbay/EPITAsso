<script setup lang="ts">

import { nextTick, onMounted, type PropType, ref } from 'vue'

import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from 'primevue/usetoast'

import type { Conversation } from '@/types/conversationInterfaces'
import type { Message } from '@/types/messageInterfaces'
import type { FetchedUser } from '@/types/userInterfaces'
import MessageComponent from '@/components/Messaging/MessageComponent.vue'
import MessageService from '@/services/messaging/message'
import { useUserStore } from '@/stores/user'

const ASSOCIATION_ID = 1

const userStore = useUserStore()
if (userStore.user === null) throw new Error("User is not logged in")
const user = ref<FetchedUser>(userStore.user)

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  },
});

const toast = useToast()
const messageService = ref<MessageService>(new MessageService(toast, props.conversation.id))

const isLoading = ref(true)
const messagesRef = ref<Omit<Message, 'id'>[]>([])
const newMessageContentRef = ref("")
const limit = 10
const offset = ref(0)

const messageContainerRef = ref<HTMLElement | null>(null)

async function fetchConversation(firstLoad: boolean = true): Promise<void> {
  if (firstLoad) {
    isLoading.value = true
  }
  offset.value = messagesRef.value.length
  const messages = await messageService.value.getMessages(limit, offset.value)
  messagesRef.value = [...messages, ...messagesRef.value]
  if (firstLoad) {
    isLoading.value = false
  }
}

async function sendMessage(): Promise<void> {
  if (newMessageContentRef.value.length === 0) return
  // TODO: set right author and association sender
  const associationSender = props.conversation?.associationsInConversation.find(association => association.id === ASSOCIATION_ID)
  if (!associationSender) throw new Error("Association not found")
  const newMessage = {
    conversation: props.conversation,
    content: newMessageContentRef.value,
    author: user.value,
    associationSender: associationSender,
    sentAt: new Date()
  }
  await messageService.value.createMessage(newMessage)
  newMessageContentRef.value = ""
  messagesRef.value.push(newMessage)
  await scrollToEnd()
}

async function handleScrollTop(event: Event): Promise<void> {
  const target = event.target as HTMLElement;
  const lastScrollHeight = target.scrollHeight
  if (target.scrollTop === 0){
    await fetchConversation(false)
    await nextTick(() => {
      target.scrollTop = target.scrollHeight - lastScrollHeight;
    })
  }
}

async function scrollToEnd(): Promise<void> {
  const messagesContainer = messageContainerRef.value
  if (messagesContainer) {
    await nextTick(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
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
        <div id="messagesContainer" ref="messageContainerRef" @scroll="handleScrollTop">
          <div v-for="message in messagesRef" :key="message.content">
            <MessageComponent :message="message" class="mb-2"/>
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="mt-2 flex items-center">
        <InputText v-model="newMessageContentRef" placeholder="Écrivez un message" class="flex-grow p-inputtext-sm" />
        <Button :disabled="newMessageContentRef.length === 0" type="submit" label="Envoyer" class="ml-2 p-button-sm p-button-primary" />
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