<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Listbox from 'primevue/listbox';
import { defineProps, ref, onMounted, type PropType } from 'vue'
import { useToast } from 'primevue/usetoast';
import type { CommitmentResume, EventMemberCommitment } from '@/types/commitmentInterface'
import CommitmentResumeEventsService from '@/services/commitment/resumeEvents'
import SelectedAssoService from '@/services/association/selectedAsso'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  selectedCommitmentId: {
    type: Number,
    required: true
  },
  commitmentResume: {
    type: Object as PropType<CommitmentResume>,
    required: true
  }
});

const toast = useToast();
const commitmentResumeEventsService: CommitmentResumeEventsService = new CommitmentResumeEventsService(toast, +SelectedAssoService.getAssociationId() ,props.selectedCommitmentId);

const commitmentResumeEvents = ref<EventMemberCommitment[]>(commitmentResumeEventsService.getCommitmentResumeEvents());

const cancelDialog = () => {
  props.setHidden();
};

onMounted(() => {

});
</script>

<template>
  <Dialog modal :visible="true" @update:visible="cancelDialog" :style="{ width: '40vw' }">
    <!-- Custom header -->
    <template #header>
      <div class="items-center">
        <h2 class="m-0 font-semibold text-xl text-primary">{{ commitmentResume.firstName }}
          {{ commitmentResume.lastName }}</h2>
<!--        <p class="m-0 text-sm text-secondary">{{ studentCommitmentDetail.member.role }} - -->
<!--          {{ studentCommitmentDetail.member.school }}</p>-->
      </div>
    </template>

    <div v-if="commitmentResumeEvents">
      <div>
        <div class="text-sm text-secondary">
          <div class="flex gap-3 items-center justify-center">
            <p class="m-0 font-medium">Heures Staff :</p>
            <p class="m-0">{{ commitmentResume.eventCommitmentHours }} h</p>
          </div>
          <div class="flex gap-3 items-center justify-center">
            <p class="m-0 font-medium">Heures Bureau :</p>
            <p class="m-0">{{ commitmentResume.commitmentHours }} h</p>
          </div>
        </div>
      </div>

      <Divider clas="m-0"/>
      <div v-if="commitmentResumeEvents.length > 0">
        <h3 class="text-lg pb-2 font-semibold text-primary">Évènements</h3>
        <Listbox :options="commitmentResumeEvents" optionLabel="name">
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
.text-secondary {
  color: #757575;
}

</style>
