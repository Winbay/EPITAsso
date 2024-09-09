<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, type PropType, ref } from 'vue'

import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import Chip from 'primevue/chip'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import ContextMenu from 'primevue/contextmenu'
import type { MenuItem } from 'primevue/menuitem'

import MessageComponent from '@/components/Messaging/MessageComponent.vue'
import MessageService from '@/services/messaging/message'
import type { Conversation, Message } from '@/types/conversationInterfaces'
import type { Association } from '@/types/associationInterfaces'
import type { UserDetail } from '@/types/userInterfaces'
import SelectedAssoService from '@/services/association/selectedAsso'
import { useUserStore } from '@/stores/user'
import { useAssociationStore } from '@/stores/selectedAssociation'

const userStore = useUserStore()
if (userStore.user === null) throw new Error('User is not logged in') // TODO should be handled in another way
const user = ref<UserDetail>(userStore.user)

const associationStore = useAssociationStore()
const associationId = associationStore.selectedAssociationId
if (!associationId) throw new Error('No association selected') // TODO should be handled in another way
const selectedAssociation = ref<Pick<Association, 'id'>>({ id: parseInt(associationId) })

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  },
  associations: {
    type: Array as PropType<Association[]>,
    required: true
  }
})

const isUserMessage = computed(() => {
  return (
    selectedMessageRef.value?.author.login === user.value.login &&
    selectedMessageRef.value?.associationSender.id === selectedAssociation.value.id
  )
})

const isMessageEditing = computed(() => {
  return buttonLabelTextRef.value === 'Modifier'
})

const toast = useToast()
const messageService = new MessageService(toast, props.conversation.id)
const associationsRef = ref<Association[]>(props.associations)

let socket: WebSocket | null = null

const isLoading = ref(true)
const messagesRef = ref<Message[]>([])
const newMessageContentRef = ref('')
let buttonLabelTextRef = ref('Envoyer')
const limit = 10
const nextRef = ref<string | null | undefined>(undefined)

const messageContainerRef = ref<HTMLElement | null>(null)

const loadMessages = async (): Promise<void> => {
  if (nextRef.value === null) return // Already fetched all messages
  try {
    const { next, messages } =
      nextRef.value === undefined
        ? await messageService.getMessages(limit, 0)
        : await messageService.getMessagesWithNext(nextRef.value)
    messagesRef.value = [...messages.reverse(), ...messagesRef.value]
    nextRef.value = next
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

const fetchConversation = async (): Promise<void> => {
  try {
    isLoading.value = true
    await loadMessages()
  } catch (error) {
    console.error('Failed to fetch conversation:', error)
  } finally {
    isLoading.value = false
  }
}

const sendOrModifyMessage = async (): Promise<void> => {
  if (newMessageContentRef.value.length === 0) return
  // TODO: set right author and association sender
  // TODO: ahah taht convert

  if (isMessageEditing.value && isUserMessage.value) {
    await modifyMessage()
  } else {
    await sendMessage()
  }
}

const sendMessage = async (): Promise<void> => {
  const associationSender = props.conversation?.associationIds.find(
    (associationid: Association['id']) => associationid === +SelectedAssoService.getAssociationId()
  )
  if (!associationSender) throw new Error('Association not found')
  const newMessage: Omit<
    Message,
    'id' | 'author' | 'conversationId' | 'sentAt' | 'associationSender' | 'updatedAt'
  > = {
    content: newMessageContentRef.value
  }
  messagesRef.value.push(await messageService.createMessage(newMessage))
  resetMessageContent()
  await scrollToEnd()
}

const modifyMessage = async (): Promise<void> => {
  if (!selectedMessageRef.value) return
  const idSelectedMessage = selectedMessageRef.value.id
  const modifiedMessage: Omit<
    Message,
    'id' | 'author' | 'conversationId' | 'sentAt' | 'associationSender' | 'updatedAt'
  > = {
    content: newMessageContentRef.value
  }
  // TODO: backend should return the updateAt field in the response
  const updatedMessage = await messageService.updateMessage(selectedMessageRef.value.id, modifiedMessage)
  const index = messagesRef.value.findIndex((msg) => msg.id === idSelectedMessage)
  messagesRef.value[index].content = updatedMessage.content
  messagesRef.value[index].updatedAt = new Date()
  resetMessageContent()
}

let lastScrollTop = 0
const scrollDeadzone = 10

const handleScrollTop = async (event: Event): Promise<void> => {
  const target = event.target as HTMLElement
  const currentScrollTop = target.scrollTop

  if (Math.abs(currentScrollTop - lastScrollTop) > scrollDeadzone) {
    menuMessageRef.value?.hide()
  }

  lastScrollTop = currentScrollTop

  const lastScrollHeight = target.scrollHeight
  if (target.scrollTop === 0) {
    await loadMessages()
    await nextTick(() => {
      target.scrollTop = target.scrollHeight - lastScrollHeight
    })
  }
}

const scrollToEnd = async (): Promise<void> => {
  const messagesContainer = messageContainerRef.value
  if (messagesContainer) {
    await nextTick(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    })
  }
}

const handleTextAreaKeyDown = async (event: KeyboardEvent): Promise<void> => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    await sendOrModifyMessage()
  }
}

const menuMessageRef = ref<ContextMenu | null>(null)
const selectedMessageRef = ref<Message | null>(null)
const modifiedMessageRef = ref<Message | null>(null)
const menuMessageItemsRef = ref<MenuItem[]>([
  { label: 'Copier', icon: 'pi pi-copy', command: () => copyMessage() },
  {
    label: 'Modifier',
    icon: 'pi pi-file-edit',
    command: () => fillMessageContentForEditing(),
    visible: () => isUserMessage.value
  },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    command: () => deleteMessage(),
    class: 'delete-item',
    visible: () => isUserMessage.value
  }
])

const onMessageRightClick = (event: MouseEvent, message: Message): void => {
  menuMessageRef.value?.show(event)
  selectedMessageRef.value = message
}

const copyMessage = async (): Promise<void> => {
  if (!selectedMessageRef.value) return

  try {
    await navigator.clipboard.writeText(selectedMessageRef.value.content)
    selectedMessageRef.value = null
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const fillMessageContentForEditing = (): void => {
  if (!selectedMessageRef.value) return

  try {
    modifiedMessageRef.value = selectedMessageRef.value
    newMessageContentRef.value = modifiedMessageRef.value.content
    buttonLabelTextRef.value = 'Modifier'
  } catch (err) {
    console.error('Failed to fill message content for editing:', err)
  }
}

const resetMessageContent = (): void => {
  selectedMessageRef.value = null
  newMessageContentRef.value = ''
  buttonLabelTextRef.value = 'Envoyer'
}

const deleteMessage = async () => {
  if (!selectedMessageRef.value) return

  try {
    await messageService.deleteMessage(selectedMessageRef.value.id)
    messagesRef.value = messagesRef.value.filter((msg) => msg.id !== selectedMessageRef.value?.id)
  } catch (err) {
    console.error('Failed to delete message:', err)
  }
}

onMounted(async () => {
  await fetchConversation()
  const accessToken = localStorage.getItem('accessToken')
  const wsUrl = import.meta.env.VITE_WS_URL
  socket = new WebSocket(`${wsUrl}/chat/${props.conversation?.id}/?token=${accessToken}`)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const messageType = data.type
    const message = JSON.parse(data.message)
    if (messageType === 'message_sent' && message.author.login !== user.value.login) {
      messagesRef.value.push(message)
      scrollToEnd()
    }
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  await scrollToEnd()
})

onBeforeMount(() => {
  return () => {
    if (socket) {
      socket.close()
    }
  }
})
</script>

<template>
  <div class="message-view flex flex-col h-full p-4 rounded-lg shadow-md">
    <div v-show="isLoading" class="content-center text-center h-full">
      <ProgressSpinner />
    </div>
    <div v-show="!isLoading" class="flex flex-col h-full">
      <div class="flex-grow">
        <h1 class="text-lg font-semibold">{{ conversation!.name }}</h1>
        <div class="flex flex-wrap mt-2">
          <Chip
            class="mr-2"
            v-for="association in associationsRef"
            :key="association.id"
            :label="association.name"
          />
        </div>
        <Divider />
        <div id="messagesContainer" ref="messageContainerRef" @scroll="handleScrollTop">
          <div v-for="message in messagesRef" :key="message.content">
            <MessageComponent
              :message="message"
              :isEditing="modifiedMessageRef?.id === message.id && isMessageEditing"
              class="mb-2"
              @on-right-click="onMessageRightClick"
            />
          </div>
          <ContextMenu ref="menuMessageRef" :model="menuMessageItemsRef" />
        </div>
      </div>
      <form @submit.prevent="sendOrModifyMessage" class="mt-3 flex items-center">
        <Textarea
          v-model="newMessageContentRef"
          placeholder="Écrivez un message"
          class="flex-grow p-inputtextarea-sm"
          rows="1"
          @keydown="handleTextAreaKeyDown"
        />
        <Button
          v-if="isMessageEditing"
          type="button"
          label="Annuler"
          class="ml-2 p-button-sm p-button-secondary justify-center"
          @click="resetMessageContent"
        />
        <Button
          :disabled="newMessageContentRef.trim().length === 0"
          type="submit"
          :label="buttonLabelTextRef"
          class="ml-2 p-button-sm p-button-primary justify-center"
        />
      </form>
    </div>
  </div>
</template>

<style>
.message-view {
  background-color: #1f2937;
  height: 90vh;
}

#messagesContainer {
  background-color: #171f2c;
  width: 100%;
  height: calc(90vh - 190px);
  max-height: calc(90vh - 190px);
  padding: 25px 10px 10px;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  border-radius: 0.5rem;
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

textarea {
  width: 100%;
  height: 100%;
  resize: none;
  overflow-y: hidden;
  padding: 0.5rem;
  border: 1px solid var(--surface-300);
  border-radius: 0.25rem;
  background-color: #111827;
}

.p-contextmenu {
  background-color: #1f2937 !important;
  border: transparent;
}

.p-contextmenu .p-menuitem-text {
  font-size: 14px !important;
}

.delete-item .p-menuitem-text,
.delete-item .p-menuitem-icon {
  color: #da373c;
}

.delete-item:hover {
  background-color: #da373c;
  .p-menuitem-text,
  .p-menuitem-icon {
    color: white !important;
  }
}
</style>
