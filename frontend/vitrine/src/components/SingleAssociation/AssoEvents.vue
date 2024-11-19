<script setup lang="ts">
import { useSingleAssoStore } from '@/stores/singleAsso'
import { useFunctionsStore } from '@/stores/functions'
import CommentAndLike from '@/components/Events/CommentAndLike.vue'
import { nextTick, onMounted, type PropType } from 'vue'
import type { Event } from '@/types/eventInterfaces'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'

defineProps({
  lastEvents: {
    type: Array as PropType<Event[]>,
    required: false
  }
})

const userStore = useUserStore()
const singleAssoStore = useSingleAssoStore()
const functionsStore = useFunctionsStore()

const route = useRoute()

onMounted(async () => {
  if (route.hash) {
    await nextTick()
    const element = document.querySelector(route.hash) as HTMLElement
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
})

const handleEventClick = (event: Event) => {
  const eventSlug = event.association.slug
  const eventId = event.id
  const currentSlug = route.params.slug

  if (currentSlug !== eventSlug) {
    userStore.user && router.push(`/associations/${eventSlug}#event-${eventId}`)
  }
}
</script>

<template>
  <div class="all-events flex flex-col px-24 py-6 gap-8">
    <div
      class="single-event flex flex-col gap-4"
      v-for="(event, index) of lastEvents ?? singleAssoStore.assoEvents"
      :key="index"
      :id="'event-' + event.id"
      @click="handleEventClick(event)"
      :class="{'hover-enabled cursor-pointer': lastEvents}"
    >
    <div class="header flex justify-between items-center">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-semibold">{{ event.name }}</h2>
        <span class="font-semibold text-gray-400">{{
            functionsStore.formatDateRange(event.startDate, event.endDate)
          }}</span>
      </div>
      <div v-if="lastEvents" :class="['asso-info-btn flex gap-1 items-center', { 'button-style': userStore.user }]">
        <img :alt="'Logo ' + event.association.name" :src="event.association.logo" />
        <span>{{ event.association.name }}</span>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="tag" v-for="(tag, index) of event.tags" :key="index">
        {{ tag.name }}
      </div>
    </div>
    <div class="content" v-html="event.content"></div>
      <CommentAndLike v-if="!lastEvents" :event="event" />
    </div>
  </div>
</template>

<style>
.single-event {
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  padding: 1rem 1rem;
  transition: all 0.3s ease;
}

.single-event.hover-enabled:hover {
  cursor: pointer;
  border-color: #4A90E2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f7f9fc;
}

.single-event .content * {
  background-color: unset !important;
  color: var(--text-color) !important;
}

.single-event .tag {
  padding: 2px 6px;
  border: 1px solid #aaaaaa;
  border-radius: 4px;
}

.asso-info-btn {
  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
}

@media (max-width: 708px) {
  .all-events {
    padding: 2rem 3rem;
  }
  .header {
    flex-direction: column;
    display: contents;
  }
}
</style>
