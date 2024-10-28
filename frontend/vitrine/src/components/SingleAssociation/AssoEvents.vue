<script setup lang="ts">
import { useSingleAssoStore } from '@/stores/singleAsso'
import { useFunctionsStore } from '@/stores/functions'
import CommentAndLike from '@/components/Events/CommentAndLike.vue'

const singleAssoStore = useSingleAssoStore()
const functionsStore = useFunctionsStore()
</script>

<template>
  <div class="all-events flex flex-col px-24 py-16 gap-8">
    <div
      class="single-event flex flex-col gap-4"
      v-for="(event, index) of singleAssoStore.assoEvents"
      :key="index"
    >
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-semibold">{{ event.name }}</h2>
        <span class="font-semibold text-gray-400">{{
          functionsStore.formatDateRange(event.startDate, event.endDate)
        }}</span>
      </div>
      <div class="flex gap-4">
        <div class="tag" v-for="(tag, index) of event.tags" :key="index">
          {{ tag.name }}
        </div>
      </div>
      <div class="content" v-html="event.content"></div>
      <CommentAndLike :event="event" />
    </div>
  </div>
</template>

<style>
.single-event {
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  padding: 1rem 1rem;
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

@media (max-width: 708px) {
  .all-events {
    padding: 2rem 3rem;
  }
}
</style>
