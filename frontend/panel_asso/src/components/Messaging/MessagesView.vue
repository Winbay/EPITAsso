<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, type PropType, ref } from 'vue'

import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import Chip from 'primevue/chip'
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

const userStore = useUserStore()
if (userStore.user === null) throw new Error('User is not logged in') // TODO should be handled in another way
const user = ref<UserDetail>(userStore.user)

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
    selectedMessageRef.value?.associationSender.id === +SelectedAssoService.getAssociationId()
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
const editableDivRef = ref<HTMLElement | null>(null)


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
  const updatedMessage = await messageService.updateMessage(
    selectedMessageRef.value.id,
    modifiedMessage
  )
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
  const editableDiv = editableDivRef.value
  if (editableDiv) {
    editableDiv.focus()
  }
}

const updateMessageContent = (event: Event): void => {
  const target = event.target as HTMLElement;
  if (target.innerHTML === '<br>') {
    target.innerHTML = '';
  }
  newMessageContentRef.value = target.innerText.trim();
};

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
    const editableDiv = editableDivRef.value
    if (editableDiv) {
      editableDiv.innerText = modifiedMessageRef.value.content
    }
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
  const editableDiv = editableDivRef.value
  if (editableDiv) {
    editableDiv.innerText = ''
  }
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

const handleWebSocketMessage = (event: MessageEvent): void => {
  const data = JSON.parse(event.data)
  const messageData = JSON.parse(data.message)

  if (data.type === 'message_sent') {
    const message = messageService.transformMessageFromWS(messageData)
    if (
      message.author.login !== user.value.login ||
      message.associationSender.id !== +SelectedAssoService.getAssociationId()
    ) {
      messagesRef.value.push(message)
    }
  } else if (data.type === 'message_deleted') {
    messagesRef.value = messagesRef.value.filter((msg) => msg.id !== messageData.id)
  } else if (data.type === 'message_updated') {
    const message = messageService.transformMessageFromWS(messageData)
    const index = messagesRef.value.findIndex((msg) => msg.id === message.id)
    if (index !== -1) {
      messagesRef.value[index].content = message.content
      messagesRef.value[index].updatedAt = new Date()
    }
  }
}

onMounted(async () => {
  await fetchConversation()
  const accessToken = localStorage.getItem('accessToken')
  const wsUrl = import.meta.env.VITE_WS_URL
  socket = new WebSocket(`${wsUrl}/chat/${props.conversation?.id}/?token=${accessToken}`)

  socket.onmessage = handleWebSocketMessage

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

const showAllAssociations = ref(false)
const limitAssociations = 5

const limitedAssociations = computed(() => {
  return showAllAssociations.value
    ? associationsRef.value
    : associationsRef.value.slice(0, limitAssociations)
})

const toggleShowAllAssociations = () => {
  showAllAssociations.value = !showAllAssociations.value
}
</script>

<template>
  <div class="message-view flex flex-col p-4 rounded-lg shadow-md">
    <div v-show="isLoading" class="content-center text-center h-full">
      <ProgressSpinner />
    </div>
    <div v-show="!isLoading" class="flex flex-col h-full">
      <div>
        <h1 class="text-lg font-semibold">{{ conversation!.name }}</h1>
        <div class="flex flex-wrap gap-2 mt-2">
          <Chip
            v-for="association in limitedAssociations"
            :key="association.id"
            :label="association.name"
          />
          <Button
            v-if="!showAllAssociations && associationsRef.length > limitAssociations"
            label="Voir plus"
            class="p-button-text p-button-sm"
            @click="toggleShowAllAssociations"
          />
          <Button
            v-else-if="showAllAssociations"
            label="Voir moins"
            class="p-button-text p-button-sm"
            @click="toggleShowAllAssociations"
          />
        </div>
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
      <form @submit.prevent="sendOrModifyMessage" class="mt-3 flex items-center">
        <div
          ref="editableDivRef"
          class="flex-grow p-2 border rounded resize-none bg-[#111827] text-white focus:outline-none"
          contenteditable="true"
          placeholder="Écrivez un message"
          @input="updateMessageContent"
          @keydown="handleTextAreaKeyDown"
        ></div>
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
  display: flex;
  flex-direction: column;
  height: 90vh;
  padding-bottom: 0;
}

#messagesContainer {
  background-color: #171f2c;
  width: 100%;
  padding: 25px 10px 10px;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  flex: 1;
  border-radius: 0.5rem;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: var(--surface-50);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--surface-300);
    border-radius: 0;
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--surface-200);
    cursor: pointer;
  }
}

form {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

form div[contenteditable="true"] {
  flex-grow: 1;
  resize: none;
  padding: 0.5rem;
  border: 1px solid var(--surface-300);
  border-radius: 0.25rem;
  background-color: #111827;
  min-height: 2rem;
  color: white;
  outline: none;
}

form div[contenteditable="true"]:empty::before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
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
