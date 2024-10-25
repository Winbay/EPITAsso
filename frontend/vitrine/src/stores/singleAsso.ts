import {defineStore} from "pinia";
import {ref} from "vue";
import type {AssociationDetail} from "@/types/associationInterfaces";
import type {Event} from "@/types/eventInterfaces";
import * as toast from '@/composables/toast'
import AssociationDetailSlugService from "@/services/association/detailsSlug";
import EventService from "@/services/event/event";

export const useSingleAssoStore = defineStore('single-asso', () => {
  const currSlug = ref<string>("");
  const currentAsso = ref<AssociationDetail | null>(null);
  const assoDetailsService = ref<AssociationDetailSlugService | null>(null);
  const eventService = ref<EventService | null>(null);
  const assoEvents = ref<Event[]>([]);

  async function init(slug: string) {
    currSlug.value = slug;
    assoDetailsService.value = new AssociationDetailSlugService(toast, slug);
    eventService.value = new EventService(toast);
    await fetchAssoDetails();
    await fetchAssoEvents();
  }

  async function fetchAssoDetails(): Promise<void> {
    if (assoDetailsService.value) {
      currentAsso.value = await assoDetailsService.value.getAssociationDetail()
    }
  }

  async function fetchAssoEvents(): Promise<void> {
    if (eventService.value) {
      assoEvents.value = await eventService.value.getAssoEvents(currSlug.value)
    }
  }

  return {
    currentAsso,
    assoEvents,
    init
  }
})