<script setup lang="ts">
import type { Event } from '@/types/eventInterfaces'
import EventService from '@/services/event/event'
import { onMounted, ref } from 'vue'
import * as toast from '@/composables/toast'
import AssoEvents from '@/components/SingleAssociation/AssoEvents.vue'
import Button from 'primevue/button'

const eventService = new EventService(toast)

const offset = ref<number>(0)
const moreResults = ref<boolean>(true)
const listLastEvents = ref<Event[]>([])
const LIMIT = 10

const loadMoreEvents = async () => {
  if (!moreResults.value) return
  const response = await eventService.getLastEvents(LIMIT, offset.value)
  offset.value += response.results.length
  if (!response.next) moreResults.value = false
  listLastEvents.value = listLastEvents.value.concat(response.results)
}

onMounted(async () => {
  await loadMoreEvents()
})
</script>

<template>
  <main class="py-6">
    <div v-if="listLastEvents.length > 0" class="flex flex-col gap-2">
      <AssoEvents :lastEvents="listLastEvents" />
      <Button
        v-show="moreResults"
        label="Charger plus d'évènements"
        class="btn-route text-xl self-center"
        @click="loadMoreEvents"
      />
    </div>
    <div v-else class="font-semibold text-center">
      Aucun évènement n'est prévu prochainement.
    </div>
  </main>
</template>

<style scoped>
</style>
