<script setup lang="ts">

import '@/fixtures/associations'
import '@/fixtures/users'
import { computed, onMounted, ref } from 'vue'

import type { User } from '@/types/userInterfaces'
import type { MessageInterfaces } from '@/types/messageInterfaces'
import type { Association } from '@/types/associationInterfaces'
import djangoApi from '@/services/api'

const props = defineProps<{
  message: MessageInterfaces,
  user: User
}>();

const user_sender_obj = ref<User | null>(null);
const association_sender_obj = ref<Association | null>(null);

const isUserMessage = computed(() => {
  return props.message.user_sender === props.user.id;
});

function formatDate(date: Date | string) {
  const dateObj = new Date(date);
  const optionsDate = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const optionsTime = { hour: 'numeric', minute: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('fr-FR', optionsDate);
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', optionsTime);
  return `${formattedTime} ${formattedDate}`;
}

onMounted(async () => {
  try {
    const response = await djangoApi.get<User>(`/api/user/${props.message.user_sender}`)
    user_sender_obj.value = response.data
    const response2 = await djangoApi.get<Association>(`/api/association/${props.message.association}`)
    association_sender_obj.value = response2.data
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div v-if="user_sender_obj && association_sender_obj" class="flex mb-4" :class="{ 'justify-end': isUserMessage, 'justify-start': !isUserMessage }">
    <div class="flex flex-col flex-start mb-1" :class="{ 'flex-end': isUserMessage, 'flex-start': !isUserMessage }">
      <div class="flex justify-between w-full px-2">
        <span class="font-bold mr-2">{{ user_sender_obj.name }} ({{ association_sender_obj.name }})</span>
        <span class="text-gray-500 text-sm flex items-center justify-center">{{ formatDate(message.sent_date) }}</span>
      </div>
      <div class="message-bubble" :class="{ 'message-user': isUserMessage, 'message-other': !isUserMessage }">
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.message-bubble {
  max-width: 70%;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 5px;
  position: relative;
  background: var(--highlight-bg);
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
}

.message-user {
  align-self: flex-end;
}

.message-other {
  align-self: flex-start;
}
</style>


