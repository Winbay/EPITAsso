<script setup lang="ts">
import { ref } from 'vue'
import DialogStudentCommitment from '@/components/Dialog/DialogCommitment.vue'
import DataTableCommitmentResume from '@/components/DataTable/DataTableCommitmentResume.vue'
import type { CommitmentResume } from '@/types/commitmentInterface'
import DataTableCommitment from '@/components/DataTable/DataTableCommitment.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const visibleDialogRef = ref(false)
const selectedCommitment = ref<CommitmentResume>()
const commitmentResumeLoaded = ref(true)

const closeDialog = () => {
  visibleDialogRef.value = false
}

const onRowSelect = (event: { data: CommitmentResume }) => {
  selectedCommitment.value = event.data
  visibleDialogRef.value = true
}

const handleTabChange = (event: { index: number }): void => {
  commitmentResumeLoaded.value = event.index === 0
}
</script>

<template>
  <div class="card w-full h-full px-10 py-8">
    <div class="h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Engagement Étudiant</span>
    </div>
    <TabView @tab-change="handleTabChange">
      <TabPanel header="Résumé">
        <DataTableCommitmentResume v-if="commitmentResumeLoaded" @rowSelect="onRowSelect" />
      </TabPanel>
      <TabPanel header="Détails">
        <DataTableCommitment v-if="!commitmentResumeLoaded" />
      </TabPanel>
    </TabView>
    <DialogStudentCommitment
      v-if="visibleDialogRef && selectedCommitment"
      v-model:visible="visibleDialogRef"
      :set-hidden="closeDialog"
      :commitment-resume="selectedCommitment"
    />
  </div>
</template>
