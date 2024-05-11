<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Editor from 'primevue/editor'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import FloatLabel from 'primevue/floatlabel'
import axios from 'axios'

import { ref, onMounted, defineProps, type PropType } from 'vue'
import type { EventTag } from '@/types/tagInterfaces'
import type { EventCreation, EventModification } from '@/types/eventInterfaces'
import { useToast } from 'primevue/usetoast'

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

const currEvent = ref<EventCreation | EventModification>({
  title: '',
  content: '',
  tags: [],
  startDate: Date.now() / 1000,
  endDate: Date.now() / 1000,
  recurrent: false,
  frequency: 0,
  endRecurrence: Date.now() / 1000
})

const startDate = ref(new Date(currEvent.value.startDate * 1000))
const endDate = ref(new Date(currEvent.value.endDate * 1000))
const endRecurrence = ref(new Date(currEvent.value.endRecurrence * 1000))

const createOrSave = async () => {
  if (props.event) {
    // Modification
    try {
      await axios.put(`/api/events/${props.event.id}`, {
        ...currEvent.value,
        startDate: startDate.value.getTime() / 1000,
        endDate: endDate.value.getTime() / 1000,
        endRecurrence: endRecurrence.value.getTime() / 1000
      })
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Évènements',
        detail: "L'évènement n'a pas pu être modifié.",
        life: 3000
      })
      console.log(error)
      return false
    }
  } else {
    // Creation
    try {
      await axios.post(`/api/events`, {
        ...currEvent.value,
        startDate: startDate.value.getTime() / 1000,
        endDate: endDate.value.getTime() / 1000,
        endRecurrence: endRecurrence.value.getTime() / 1000
      })
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Évènements',
        detail: "L'évènement n'a pas pu être créé.",
        life: 3000
      })
      console.log(error)
      return false
    }
  }
  await props.reloadEvents()
  props.setHidden()
  return true
}

const cancelDialog = () => {
  // Reset all local values
  if (props.event) {
    currEvent.value = props.event
  } else {
    currEvent.value = {
      title: '',
      content: '',
      tags: [],
      startDate: Date.now() / 1000,
      endDate: Date.now() / 1000,
      recurrent: false,
      frequency: 0,
      endRecurrence: Date.now() / 1000
    }
  }
  startDate.value = new Date(currEvent.value.startDate * 1000)
  endDate.value = new Date(currEvent.value.endDate * 1000)
  endRecurrence.value = new Date(currEvent.value.endRecurrence * 1000)
  props.setHidden()
}

onMounted(() => {
  if (props.event) {
    currEvent.value = props.event
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
        v-model="currEvent.title"
        aria-describedby="username-help"
        placeholder="Titre de l'évènement"
        maxlength="255"
        class="max-w-3xl"
      />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="content" class="mb-2 text-2xl font-bold text-wrap">Contenu</label>
      <Editor id="content" v-model="currEvent.content" editorStyle="height: 320px" />
      <!--      <Button label="Display" @click="console.log(currEvent.frequency)"></Button>-->
    </div>
    <div class="mb-6 flex flex-col justify-start w-8/12">
      <label for="tags" class="mb-2 text-xl font-bold text-wrap">Tags</label>
      <MultiSelect
        v-model="currEvent.tags"
        :options="props.tags"
        option-label="name"
        option-value="id"
        display="chip"
      />
    </div>
    <div class="mb-6 flex flex-col justify-start">
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
        <Checkbox v-model="currEvent.recurrent" :binary="true" class="mr-4" input-id="recurrent" />
        <label for="recurrent" class="text-lg text-wrap">Évènement récurrent</label>
      </div>
      <div class="mb-8 flex justify-start items-center">
        <FloatLabel v-if="currEvent.recurrent" class="mr-4">
          <InputText id="frequency" v-model="currEvent.frequency" type="number" min="1" />
          <label for="frequency">Fréquence (en jours)</label>
        </FloatLabel>
        <FloatLabel v-if="currEvent.recurrent" class="w-1/3">
          <Calendar
            v-if="currEvent.recurrent"
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
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button
          :label="props.event ? 'Sauvegarder' : 'Créer'"
          severity="success"
          class="w-1/4"
          @click="createOrSave"
        />
      </div>
    </div>
  </Dialog>
</template>

<style>
.dialog-event {
  width: 764px;
}
</style>
