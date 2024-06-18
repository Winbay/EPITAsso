<script setup lang="ts">

import { nextTick, onMounted, type PropType, ref } from 'vue'

import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from 'primevue/usetoast'

import type { Conversation, Message } from '@/types/conversationInterfaces'
import MessageComponent from '@/components/Messaging/MessageComponent.vue'
import MessageService from '@/services/messaging/message'
import type { Association } from '@/types/associationInterfaces';

const ASSOCIATION_ID = 1

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  },
  associations: {
    type: Array as PropType<Association[]>,
    required: true
  }
});

const toast = useToast()
const messageService = new MessageService(toast, props.conversation.id)
const associationsRef = ref<Association[]>(props.associations)

const isLoading = ref(true)
const messagesRef = ref<Message[]>([])
const newMessageContentRef = ref("")
const limit = 10
const offset = ref(0)
const nextRef = ref<string | null | undefined>(undefined)

const messageContainerRef = ref<HTMLElement | null>(null)

const loadMessages = async (): Promise<void> => {
  if (nextRef.value === null) return // Already fetched all messages
  let next
  let messages
  if (nextRef.value === undefined) {
    // First fetch (no next url)
    const res = await messageService.getMessages(limit, 0)
    next = res.next
    messages = res.messages
  } else {
    const res = await messageService.getMessagesWithNext(nextRef.value)
    next = res.next
    messages = res.messages
  }
  messagesRef.value = [...messages, ...messagesRef.value]
  nextRef.value = next
}

const fetchConversation = async (): Promise<void> => {
  isLoading.value = true
  offset.value = messagesRef.value.length
  await loadMessages()
  isLoading.value = false
}

async function sendMessage(): Promise<void> {
  if (newMessageContentRef.value.length === 0) return
  // TODO: set right author and association sender
  const associationSender = props.conversation?.associationIds.find((associationid: Association['id']) => associationid === ASSOCIATION_ID)
  if (!associationSender) throw new Error("Association not found")
  const newMessage: Omit<Message, 'id' | 'author' | 'conversationId' | 'sentAt' | 'associationSender'> = {
    content: newMessageContentRef.value,
  }
  messagesRef.value.push(await messageService.createMessage(newMessage))
  newMessageContentRef.value = ""
  await scrollToEnd()
}

async function handleScrollTop(event: Event): Promise<void> {
  const target = event.target as HTMLElement;
  const lastScrollHeight = target.scrollHeight
  if (target.scrollTop === 0){
    await loadMessages()
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
          <Chip class="mr-2 mb-2" v-for="association in associationsRef" :key="association.id" :label="association.name" />
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