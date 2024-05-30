<script setup lang="ts">
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ConfirmPopup from 'primevue/confirmpopup'

import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import DialogEvent from '@/components/Dialog/DialogEvent.vue'
import type { EventModification } from '@/types/eventInterfaces'
import type { EventTag } from '@/types/tagInterfaces'
import EventService from '@/services/event/event'
import TagService from '@/services/tag'

const tagsRef = ref<EventTag[]>([])
const eventsRef = ref<EventModification[]>([])

const visibleDialogRef = ref(false)
const selectedEventRef = ref<EventModification | null>(null)
const confirm = useConfirm()
const toast = useToast()

const eventService: EventService = new EventService(toast)
const tagService: TagService = new TagService(toast, 'events')

const confirmDelete = (event: Event, eventId: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Êtes-vous sûr de vouloir supprimer cet évènement ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: async () => {
      await deleteEvent(eventId)
    }
  });
};

const closeDialog = () => {
  visibleDialogRef.value = false;
  selectedEventRef.value = null;
};

const loadTags = async () => {
  tagsRef.value = await tagService.getTags()
};

const reloadEvents = async () => {
  eventsRef.value = await eventService.getEvents()
};

const deleteEvent = async (eventId: number) => {
  await eventService.deleteEvent(eventId);
  await reloadEvents();
};

onMounted(async () => {
  await loadTags();
  await reloadEvents();
});

const formatDate = (date: Date): string => {
  if (!date) return '';
  const d = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>

<template>
  <div class="events-list w-full h-full px-10 py-8">
    <div class="events-list-header h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Évènements</span>
      <Button label="Ajouter" class="add-btn py-0 px-4 h-full" @click="visibleDialogRef = true" />
      <DialogEvent
        v-model:visible="visibleDialogRef"
        :set-hidden="closeDialog"
        :reloadEvents="reloadEvents"
        :tags="tagsRef"
      />
    </div>
    <DataTable
      :value="eventsRef"
      show-gridlines
      striped-rows
      tableStyle="min-width: 50rem"
      size="small"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
    >
      <Column field="name" header="Titre" sortable></Column>
      <Column field="author" header="Auteur" sortable></Column>
      <Column header="Tags" class="max-w-60">
        <template #body="slotProps">
          <Tag v-for="(tag, index) in slotProps.data.tags" :key="index" :value="tag.name" :style="{
            backgroundColor: tag.backgroundColor ?? 'var(--primary-color)',
            color: tag.textColor ?? ''
          }" severity="primary" class="mx-1 my-0.5" />
        </template>
      </Column>
      <Column field="startDate" header="Date de l'évènement" class="max-w-48" sortable>
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.startDate) }}</span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex flex-col">
            <a
              href="javascript:void(0)"
              class="hover:underline"
              @click="visibleDialogRef = slotProps.data.id"
              >Editer</a
            >
            <DialogEvent
              :visible="visibleDialogRef === slotProps.data.id"
              :set-hidden="closeDialog"
              :reloadEvents="reloadEvents"
              :tags="tagsRef"
              :event="JSON.parse(JSON.stringify(slotProps.data))"
            />
            <ConfirmPopup></ConfirmPopup>
            <a
              href="javascript:void(0)"
              @click="confirmDelete($event, slotProps.data.id)"
              class="hover:underline"
              >Supprimer</a
            >
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
.events-list .add-btn {
  color: var(--text-color);
}

.events-list a {
  color: var(--primary-color);
}

.events-list .p-paginator-bottom {
  border: none;
}

.events-list .p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}
</style>
