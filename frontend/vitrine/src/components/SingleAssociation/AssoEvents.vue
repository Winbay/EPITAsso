<script setup lang="ts">
import { useSingleAssoStore } from '@/stores/singleAsso'
import { useFunctionsStore } from '@/stores/functions'
import CommentAndLike from '@/components/Events/CommentAndLike.vue'
import type { PropType } from 'vue'
import type { Event } from '@/types/eventInterfaces'
import router from '@/router'
import { useUserStore } from '@/stores/user'

defineProps({
  lastEvents: {
    type: Array as PropType<Event[]>,
    required: false
  }
})

const userStore = useUserStore()

const singleAssoStore = useSingleAssoStore()
const functionsStore = useFunctionsStore()
</script>

<template>
  <div class="all-events flex flex-col px-24 py-6 gap-8">
    <div
      class="single-event flex flex-col gap-4"
      v-for="(event, index) of lastEvents ?? singleAssoStore.assoEvents"
      :key="index"
    >
      <div class="header flex justify-between items-center">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-semibold">{{ event.name }}</h2>
          <span class="font-semibold text-gray-400">{{
            functionsStore.formatDateRange(event.startDate, event.endDate)
          }}</span>
        </div>
        <div
          v-if="lastEvents"
          :class="['asso-info-btn flex gap-1 items-center', { 'button-style': userStore.user }]"
          @click="userStore.user && router.push(`/associations/${event.association.slug}`)"
        >
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

  &.button-style {
    cursor: pointer;
    border: 1px solid #aaaaaa;
    border-radius: 8px;
    padding: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  &.button-style:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
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
