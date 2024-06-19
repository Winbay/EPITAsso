<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import type { FetchedUser } from '@/types/userInterfaces'
import { useUserStore } from '@/stores/user'
import type { Message } from '@/types/conversationInterfaces'

const userStore = useUserStore()
if (userStore.user === null) throw new Error('User is not logged in') // TODO should be handled in another way
const user = ref<FetchedUser>(userStore.user)

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true
  }
})

const showDateRef = ref(false)

const isUserMessage = computed(() => {
  return props.message.author.id === user.value.id
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
</script>

<template>
  <div
    v-if="message"
    class="mb-4 relative w-full flex flex-col"
    :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
    @mouseover="showDateRef = true"
    @mouseleave="showDateRef = false"
  >
    <span
      v-if="showDateRef"
      class="text-gray-500 text-sm absolute message-date mr-2"
      :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
    >
      {{ formatDate(message.sentAt) }}
    </span>
    <span
      class="font-bold mr-2"
      :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
    >
      {{ message.author.login }} ({{ message.associationSender.name }})
    </span>
    <div
      class="message-bubble"
      :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }"
    >
      <div class="message-content whitespace-pre-wrap">
        {{ message.content }}
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
}

.message-user {
  align-self: flex-end;
}

.message-other {
  align-self: flex-start;
}

.message-date {
  top: -1rem; /* Adjust this value as needed */
}
</style>
