<script setup lang="ts">
import { defineProps, onMounted, ref, computed, type PropType } from 'vue'
import type { EventModification } from '@/types/eventInterfaces'
import Dialog from 'primevue/dialog'
import Listbox from 'primevue/listbox'
import InputNumber from 'primevue/inputnumber'
import EventCommitmentService from '@/services/event/eventCommitment'
import { useToast } from 'primevue/usetoast'
import EventCommitmentUpdateService from '@/services/event/eventCommitmentUpdate'
import type { MemberCommitment } from '@/types/commitmentInterface'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  event: {
    type: Object as PropType<EventModification>,
    default: null
  }
})
const toast = useToast()

const eventCommitmentUpdateService: EventCommitmentUpdateService = new EventCommitmentUpdateService(
  toast
)
const eventCommitmentService: EventCommitmentService = new EventCommitmentService(
  toast,
  props.event.id
)
const eventCommitmentsRef = ref<MemberCommitment[]>([])
const originalCommitments = ref<MemberCommitment[]>([])

const fetchEventCommitment = async () => {
  eventCommitmentsRef.value = await eventCommitmentService.getEventCommitments()
  originalCommitments.value = JSON.parse(JSON.stringify(eventCommitmentsRef.value)) // Create a deep copy
}

const updateEventCommitments = async () => {
  const modifiedCommitments = eventCommitmentsRef.value.filter((commitment, index) => {
    return JSON.stringify(commitment) !== JSON.stringify(originalCommitments.value[index])
  })

  if (modifiedCommitments.length > 0) {
    await eventCommitmentUpdateService.updateEventCommitment(modifiedCommitments)
  }
}

const closeDialog = async () => {
  await updateEventCommitments()
  props.setHidden()
}

const sortedCommitments = computed(() => {
  return [...eventCommitmentsRef.value].sort((a, b) => {
    const loginA = a.member.login.toLowerCase()
    const loginB = b.member.login.toLowerCase()
    return loginA.localeCompare(loginB)
  })
})

onMounted(async () => {
  await fetchEventCommitment()
})
</script>

<template>
  <Dialog modal @update:visible="closeDialog" :style="{ width: '40vw' }">
    <template #header>
      <h3>Engagements</h3>
    </template>
    <div v-if="eventCommitmentsRef.length === 0">
      <p>Aucun engagement pour cet évènement</p>
    </div>
    <div v-else>
      <Listbox
        :options="sortedCommitments"
        optionLabel="member.login"
        filter
        filterPlaceholder="Rechercher un engagement"
        emptyFilterMessage="Aucun engagement trouvé"
      >
        <template #option="slotProps">
          <div class="flex justify-between items-center">
            <div>{{ slotProps.option.member.login }}</div>
            <InputNumber
              id="hoursInput"
              v-model="slotProps.option.hours"
              :value="slotProps.option.hours || 0"
              type="number"
              :min="0"
              showButtons
              :step="1"
              suffix=" h"
            />
          </div>
        </template>
      </Listbox>
    </div>
  </Dialog>
</template>

<style>
#hoursInput .p-inputtext.p-component.p-inputnumber-input {
  width: 5rem;
  border: none;
}
</style>
