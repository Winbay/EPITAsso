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
import DiscordWebhookService from '@/services/discordWebhook'
import { useGlobalStore } from '@/stores/globalStore'

const tagsRef = ref<EventTag[]>([])
const eventsRef = ref<EventModification[]>([])

const visibleDialogRef = ref(false)
const selectedEventRef = ref<EventModification | null>(null)
const confirm = useConfirm()
const toast = useToast()
const globalStore = useGlobalStore()

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
  })
}

const closeDialog = () => {
  visibleDialogRef.value = false
  selectedEventRef.value = null
}

const loadTags = async () => {
  tagsRef.value = await tagService.getTags()
}

const reloadEvents = async () => {
  eventsRef.value = await eventService.getEvents()
}

const deleteEvent = async (eventId: number) => {
  await eventService.deleteEvent(eventId)
  await reloadEvents()
}

const downloadPdf = async (eventId: number) => {
  try {
    const data = await eventService.downloadEventPdf(eventId)
    const blob = new Blob([data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `fiche-event-${eventId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur de téléchargement',
      detail: 'Impossible de télécharger le PDF',
      life: 5000
    })
  }
}

const sendWebhookEvent = async (event: EventModification) => {
  const discordMessages = DiscordWebhookService.eventContentToDiscordMessages(event.content)
  if (await DiscordWebhookService.sendWebhook(
    globalStore.currentAssociation,
    event.name,
    discordMessages
  )
  ) {
    toast.add({
      severity: 'success',
      summary: 'Évènement envoyé',
      detail: "L'évènement a bien été posté sur le channel Discord",
      life: 5000
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'L\'évènement n\'a pas pu être envoyé',
    detail: "L'url du webhook n'est pas définie ou est fausse",
    life: 5000
  })
}

onMounted(async () => {
  await loadTags()
  await reloadEvents()
})

const formatDate = (date: Date): string => {
  if (!date) return ''
  const d = new Date(date)
  const pad = (num: number) => num.toString().padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>

<template>
  <div class="events-list w-full h-full px-10 py-8">
    <div class="events-list-header h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Évènements</span>
      <Button label="Ajouter" class="add-btn py-0 px-4 h-full" @click="visibleDialogRef = true" />
      <DialogEvent v-model:visible="visibleDialogRef" :set-hidden="closeDialog" :reloadEvents="reloadEvents"
        :tags="tagsRef" />
    </div>
    <DataTable :value="eventsRef" show-gridlines striped-rows tableStyle="min-width: 50rem" size="small" paginator
      :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" removableSort>
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
          <div class="actions">
            <Button icon="pi pi-pen-to-square" @click="visibleDialogRef = slotProps.data.id"
              v-tooltip="'Editer l\'évènement'" />
            <DialogEvent :visible="visibleDialogRef === slotProps.data.id" :set-hidden="closeDialog"
              :reloadEvents="reloadEvents" :tags="tagsRef" :event="JSON.parse(JSON.stringify(slotProps.data))" />
            <ConfirmPopup></ConfirmPopup>
            <Button icon="pi pi-trash" @click="confirmDelete($event, slotProps.data.id)"
              v-tooltip="'Supprimer l\'évènement'" />
            <Button icon="pi pi-download" @click="downloadPdf(slotProps.data.id)"
              v-tooltip="'Télécharger la fiche évent'" />
            <Button icon="pi pi-send" @click="sendWebhookEvent(slotProps.data)"
              v-tooltip="'Poster l\'évènement via le Webhook'" />
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

.p-paginator-bottom {
  border: none;
}

.p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
