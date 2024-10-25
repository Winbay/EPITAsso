<script setup lang="ts">
import type {Event} from "@/types/eventInterfaces";
import EventService from "@/services/event/event";
import {onMounted, ref} from "vue";
import * as toast from '@/composables/toast'

const listLastEvents = ref<Event[]>([]);

const eventService = new EventService(toast);

const loadLastEvents = async () => {
  listLastEvents.value = await eventService.getLastEvents();
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

function getInnerText(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

onMounted(async () => {
  await loadLastEvents();
})
</script>

<template>
  <div class="module-last-events flex flex-col items-center gap-2">
    <span class="text-xl font-semibold">Derniers évènements</span>
    <div v-for="(event, index) of listLastEvents" :key="index" class="event-item flex flex-col gap-2 w-full">
      <div class="header flex justify-between">
        <div class="flex gap-1 items-center">
          <span class="title font-semibold">{{ event.name }}</span>
          <span class="text-sm text-gray-500">- {{ formatDate(event.startDate) }}</span>
        </div>
        <div class="asso-info flex gap-1 items-center">
          <img :alt="'Logo ' + event.association.name" :src="event.association.logo"/>
          <span>{{ event.association.name }}</span>
        </div>
      </div>
      <span class="event-content">{{ getInnerText(event.content) }}</span>
      <!-- TODO: "Voir plus" avec lien vers l'asso avec fragment vers events -->
    </div>
    <a class="btn-route" v-if="listLastEvents.length > 0" href="/events">Tous les évènements</a>
    <div v-if="listLastEvents.length === 0" class="font-semibold text-center">
      Aucun évènement n'est prévu prochainement.
    </div>
  </div>
</template>

<style>
.module-last-events {
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  padding: 20px 30px;
}

.module-last-events > span {
  color: #287094;
  text-decoration: underline;
}

.module-last-events .asso-info img {
  width: 32px;
  height: 32px;
  border-radius: 100px;
}

.module-last-events .title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  display: inline-block;
}

.module-last-events .event-content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-align: justify;
}

.module-last-events .event-item:not(:last-child) {
  border-bottom: solid 1px var(--surface-300);
  padding-bottom: 5px;
}

@media (max-width: 708px) {
  .module-last-events .header {
    flex-direction: column;
  }
}
</style>