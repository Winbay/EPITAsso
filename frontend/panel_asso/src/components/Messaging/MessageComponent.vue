<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import Button from 'primevue/button'

import { useUserStore } from '@/stores/user'
import { useAssociationStore } from '@/stores/selectedAssociation'
import type { UserDetail } from '@/types/userInterfaces'
import type { Message } from '@/types/conversationInterfaces'
import type { Association } from '@/types/associationInterfaces'

const userStore = useUserStore()
if (userStore.user === null) throw new Error('User is not logged in') // TODO should be handled in another way
const user = ref<UserDetail>(userStore.user)

const associationStore = useAssociationStore()
const associationId = associationStore.selectedAssociationId
if (!associationId) throw new Error('No association selected') // TODO should be handled in another way
const selectedAssociation = ref<Pick<Association, 'id'>>({ id: parseInt(associationId) })

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['onRightClick'])

const messageOnHover = ref(false)

const isUserMessage = computed(() => {
  return (
    props.message.author.login === user.value.login &&
    props.message.associationSender.id === selectedAssociation.value.id
  )
})

const isMessageModified = computed(() => {
  const sentAt = new Date(props.message.sentAt)
  const updatedAt = props.message.updatedAt ? new Date(props.message.updatedAt) : null

  if (updatedAt === null) {
    return false;
  }

  const sentAtSeconds = Math.floor(sentAt.getTime() / 1000);
  const updatedAtSeconds = Math.floor(updatedAt.getTime() / 1000);

  return sentAtSeconds !== updatedAtSeconds;
})

const formatDate = (date: Date | string): string => {
  const dateObj = new Date(date)

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric'
  }

  const formattedDate = dateObj.toLocaleDateString('fr-FR', optionsDate)
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', optionsTime)

  return `${formattedTime} ${formattedDate}`
}

const openMessageMenu = (event: MouseEvent): void => {
  emits('onRightClick', event, props.message)
}
</script>

<template>
  <div
    v-if="message"
    class="mb-4 relative w-full flex flex-col"
    :class="{
      'message-user': isUserMessage,
      'message-other': !isUserMessage,
      'message-editing': props.isEditing
    }"
    @mouseover="messageOnHover = true"
    @mouseleave="messageOnHover = false"
  >
    <span
      v-if="messageOnHover"
      class="text-gray-500 text-sm absolute message-date mr-2"
      :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
    >
      {{ formatDate(message.sentAt) }}
    </span>
    <span
      class="font-bold mr-2 flex"
      :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
    >
      <Button
        v-if="messageOnHover && isUserMessage"
        icon="pi pi-ellipsis-h"
        class="button-options mr-2"
        @click="openMessageMenu"
      />
      {{ message.author.login }} ({{ message.associationSender.name }})
      <Button
        v-if="messageOnHover && !isUserMessage"
        icon="pi pi-ellipsis-h"
        class="button-options ml-2"
        @click="openMessageMenu"
      />
    </span>
    <div
      class="message-bubble"
      :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
      @contextmenu="openMessageMenu"
    >
      <div class="message-content">
        {{ message.content }}
        <span
          v-if="isMessageModified"
          class="modified-text"
          :class="{ 'left-align': isUserMessage, 'right-align': !isUserMessage }"
        >
          (modifié)
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  width: fit-content;
  max-width: 80%;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 5px;
  position: relative;
  background: var(--highlight-bg);
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-line;
}

.message-user {
  align-self: flex-end;
}

.message-other {
  align-self: flex-start;
}

.message-date {
  top: -1rem;
}

.button-options {
  background-color: rgba(71, 76, 90, 0.49);
  color: white;
  border: none;
  padding: 0.5rem;
  font-size: 0.8rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.button-options:hover {
  background-color: rgba(71, 76, 90, 0.78);
  transform: scale(1.1);
}

.message-editing {
  background-color: rgba(71, 76, 90, 0.32);
}

.modified-text {
  font-size: 12px;
  color: #6b7280;
  margin-top: 5px;
  display: block;
}

.left-align {
  text-align: left;
}

.right-align {
  text-align: right;
}
</style>
