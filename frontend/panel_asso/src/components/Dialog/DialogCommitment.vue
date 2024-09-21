<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Listbox from 'primevue/listbox'
import { defineProps, ref, onMounted, type PropType } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { CommitmentResume, EventMemberCommitment } from '@/types/commitmentInterface'
import CommitmentResumeEventsService from '@/services/commitment/resumeEvents'
import SelectedAssoService from '@/services/association/selectedAsso'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  commitmentResume: {
    type: Object as PropType<CommitmentResume>,
    required: true
  }
})

const toast = useToast()
const commitmentResumeEventsService: CommitmentResumeEventsService =
  new CommitmentResumeEventsService(
    toast,
    +SelectedAssoService.getAssociationId(),
    props.commitmentResume?.id
  )

const commitmentResumeEventsRef = ref<EventMemberCommitment[]>([])
const commitmentResume = ref<CommitmentResume>({ ...props.commitmentResume })

const closeDialog = async () => {
  props.setHidden()
}

onMounted(async () => {
  commitmentResumeEventsRef.value = await commitmentResumeEventsService
    .getCommitmentResumeEvents()
    .then((events) => {
      return events.filter((event) => event.hours > 0)
    })
})
</script>

<template>
  <Dialog modal :visible="true" @update:visible="closeDialog" :style="{ width: '40vw' }">
    <template #header>
      <div class="items-center">
        <h2 class="m-0 font-semibold text-xl text-primary">
          {{ commitmentResume.firstName }} {{ commitmentResume.lastName }}
        </h2>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex gap-3 items-center justify-center pb-2">
        <label for="officeHours">Heures de bureau</label>
        <p id="officeHours" class="hours-display">{{ commitmentResume.commitmentHours }} h</p>
      </div>
    </div>

    <Divider class="mt-4 mb-2" />

    <p v-if="commitmentResume.eventCommitmentHours === 0" class="flex justify-center">
      Aucun évènement pour cet engagement
    </p>
    <div v-else-if="commitmentResumeEventsRef">
      <div v-if="commitmentResumeEventsRef.length > 0">
        <div class="flex justify-between p-2">
          <h3 class="text-lg font-semibold text-primary">Évènements</h3>
          <div class="text-lg font-semibold text-primary">
            {{ commitmentResume.eventCommitmentHours }} h
          </div>
        </div>
        <Listbox :options="commitmentResumeEventsRef" optionLabel="name">
          <template #option="slotProps">
            <div class="flex justify-between items-center">
              <div>{{ slotProps.option.name }}</div>
              <div>{{ slotProps.option.hours }} h</div>
            </div>
          </template>
        </Listbox>
      </div>
    </div>
    <div v-else>
      <p>Chargement des détails...</p>
    </div>
  </Dialog>
</template>

<style scoped>
.hours-display {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 0;
}
</style>
