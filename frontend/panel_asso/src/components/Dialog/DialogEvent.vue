<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Editor from 'primevue/editor'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import FloatLabel from 'primevue/floatlabel'

import { ref, onMounted, defineProps, type PropType } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import type { EventTag } from '@/types/tagInterfaces'
import type { EventCreation, EventModification } from '@/types/eventInterfaces'
import { useToast } from 'primevue/usetoast'
import EventService from '@/services/event/event'
import DiscordWebhookService from '@/services/discordWebhook'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  reloadEvents: {
    type: Function,
    required: true
  },
  tags: {
    type: Object as PropType<EventTag[]>,
    required: true
  },
  event: {
    type: Object as PropType<EventModification | null>,
    default: null
  }
})

const toast = useToast()
const globalStore = useGlobalStore()
const eventService: EventService = new EventService(toast)
const postOnDiscord = ref<boolean>(!!globalStore.currentAssociation.webhook);

const getDefaultEvent = (): EventCreation | EventModification => ({
  name: '',
  content: '',
  tags: [],
  startDate: new Date(),
  endDate: new Date(),
  recurrent: false,
  frequency: 0,
  endRecurrence: new Date()
})

const currEventRef = ref<EventCreation | EventModification>({
  ...getDefaultEvent(),
  ...(props.event || {}) // Spread existing event if it's passed
})

const startDate = ref(currEventRef.value.startDate)
const endDate = ref(currEventRef.value.endDate)
const endRecurrence = ref(currEventRef.value.endRecurrence)

const editOrCreate = async (): Promise<void> => {
  if (props.event) {
    await eventService.updateEvent(currEventRef.value as EventModification)
  } else {
    await eventService.createEvent(currEventRef.value)
  }
  if (!!globalStore.currentAssociation.webhook && postOnDiscord.value) {
    const discordMessages = DiscordWebhookService.eventContentToDiscordMessages(currEventRef.value.content)
    await DiscordWebhookService.sendEventWebhook(globalStore.currentAssociation, currEventRef.value.name, discordMessages)
  }
  await props.reloadEvents()
  props.setHidden()
}

const cancelDialog = () => {
  if (props.event) {
    currEventRef.value = props.event
  } else {
    currEventRef.value = getDefaultEvent()
  }
  startDate.value = new Date(currEventRef.value.startDate)
  endDate.value = new Date(currEventRef.value.endDate)
  endRecurrence.value = new Date(currEventRef.value.endRecurrence)
  props.setHidden()
}

onMounted(() => {
  if (props.event) {
    currEventRef.value = props.event
    startDate.value = new Date(props.event.startDate)
    endDate.value = new Date(props.event.endDate)
    endRecurrence.value = new Date(props.event.endRecurrence)
  }
})
</script>

<template>
  <Dialog
    class="dialog-event h-full"
    modal
    @update:visible="cancelDialog"
    :header="props.event ? 'Modification de l\'évènement' : 'Création d\'un évènement'"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="title" class="mb-2 text-2xl font-bold text-wrap">Titre</label>
      <InputText
        id="title"
        v-model="currEventRef.name"
        aria-describedby="username-help"
        placeholder="Titre de l'évènement"
        maxlength="255"
        class="max-w-3xl"
      />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="content" class="mb-2 text-2xl font-bold text-wrap">Contenu</label>
      <Editor id="content" v-model="currEventRef.content" editorStyle="height: 320px" />
      <!--      <Button label="Display" @click="console.log(currEvent.frequency)"></Button>-->
    </div>
    <div class="mb-6 flex flex-col justify-start w-8/12">
      <label for="tags" class="mb-2 text-xl font-bold text-wrap">Tags</label>
      <MultiSelect
        v-model="currEventRef.tags"
        :options="props.tags"
        option-label="name"
        display="chip"
      />
    </div>
    <div class="mb-2 flex flex-col justify-start">
      <div class="mb-6 justify-start items-center">
        <label for="date" class="text-xl mr-8 font-bold text-wrap">Date de l'évènement</label>
      </div>
      <div class="flex justify-start items-center mb-6">
        <Calendar
          v-model="startDate"
          showTime
          hourFormat="24"
          dateFormat="dd/mm/yy"
          class="w-1/3"
        />
        <span class="text-l font-bold mx-5">-</span>
        <Calendar v-model="endDate" showTime hourFormat="24" dateFormat="dd/mm/yy" class="w-1/3" />
      </div>
      <div class="mb-8 flex justify-start items-center">
        <Checkbox
          v-model="currEventRef.recurrent"
          :binary="true"
          class="mr-4"
          input-id="recurrent"
        />
        <label for="recurrent" class="text-lg text-wrap">Évènement récurrent</label>
      </div>
      <div class="mb-8 flex justify-start items-center">
        <FloatLabel v-if="currEventRef.recurrent" class="mr-4">
          <InputNumber
            id="frequency"
            v-model="currEventRef.frequency"
            inputId="minmax-buttons"
            :min="1"
            :max="999"
            mode="decimal"
            show-buttons
          />
          <label for="frequency">Fréquence (en jours)</label>
        </FloatLabel>
        <FloatLabel v-if="currEventRef.recurrent" class="w-1/3">
          <Calendar
            v-if="currEventRef.recurrent"
            dateFormat="dd/mm/yy"
            class="w-full"
            id="end-recurrence"
            v-model="endRecurrence"
            showTime
            hourFormat="24"
          />
          <label for="end-recurrence">Date de fin</label>
        </FloatLabel>
      </div>
    </div>
    <div class="mb-6 flex justify-start" v-if="!props.event">
      <Checkbox
        v-model="postOnDiscord"
        inputId="postOnDiscord"
        :binary="true"
        :disabled="!globalStore.currentAssociation.webhook"
      />
      <label for="postOnDiscord" :class="'ml-2 mr-2' + (!!globalStore.currentAssociation.webhook ? '' : ' text-gray-500')">Poster l'évènement sur Discord</label>
      <i class="pi pi-info-circle flex self-center" v-show="!globalStore.currentAssociation.webhook" v-tooltip.top="DiscordWebhookService.webhookTooltipDisabled"/>
    </div>
    <div class="flex justify-start items-center">
      <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
      <Button
        :label="props.event ? 'Sauvegarder' : 'Créer'"
        severity="success"
        class="w-1/4"
        @click="editOrCreate"
      />
    </div>
  </Dialog>
</template>

<style>
.dialog-event {
  width: 764px;
}
</style>
