<script setup lang="ts">

import '@/fixtures/associations'
import '@/fixtures/users'
import djangoApi from '@/services/api'
import { onMounted, ref } from 'vue'
import type { Association } from '@/types/associationInterfaces'
import type { User } from '@/types/userInterfaces'
import ConversationsView from '@/components/Messaging/ConversationsView.vue'

const selectedAsso = ref<Association>()
const selectedUser = ref<User>({ id: 1, name: 'John Doe'})

onMounted(async () => {
  try {
    const response = await djangoApi.get<Association>('/api/association/1')
    selectedAsso.value = response.data
    selectedUser.value = selectedAsso.value?.members[0]
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div>
    <ConversationsView v-if="selectedAsso" :user="selectedUser" :association="selectedAsso" />
  </div>
</template>

<style scoped>

</style>