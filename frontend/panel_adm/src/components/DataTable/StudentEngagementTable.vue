<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import {
  type Position,
  type StatusDetails,
  Status,
  type StudentEngagement
} from '@/types/studentEngagementInterface'
import { defineEmits } from 'vue'
import { statusSeverity } from '@/utils/studentEngagementUtils'

defineProps<{
  studentEngagements: StudentEngagement[]
  positions: Position[]
  status: StatusDetails[]
}>()

const emits = defineEmits(['update:visible'])

const openDialog = (studentEngagement: StudentEngagement | null) => {
  emits('update:visible', {
    visible: true,
    student: studentEngagement,
    canEdit: !studentEngagement ? true : studentEngagement?.status.name === Status.WAITING
  })
}
</script>

<template>
  <div class="engagement-list w-full">
    <DataTable
      :value="studentEngagements"
      show-gridlines
      striped-rows
      tableStyle="min-width: 50rem"
      size="small"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removable-sort
    >
      <Column field="login" header="Login" :sortable="true"></Column>
      <Column field="name" header="Nom" :sortable="true"></Column>
      <Column field="firstname" header="Prénom" :sortable="true"></Column>
      <Column field="promotion" header="Promotion" :sortable="true"></Column>
      <Column field="position" header="Poste dans l'association" :sortable="true">
        <template #body="slotProps">
          {{ slotProps.data.position.name }}
        </template>
      </Column>
      <Column field="totalHours" header="Total heures" :sortable="true"></Column>
      <Column field="status.name" header="Status" :sortable="true">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.status.name"
            :severity="statusSeverity[slotProps.data.status.name]"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex flex-col">
            <a href="javascript:void(0)" class="hover:underline" @click="openDialog(slotProps.data)"
              >Détails</a
            >
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
.engagement-list .p-paginator {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.engagement-list .p-paginator-bottom {
  border: none;
}

.engagement-list .p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}

.engagement-list a {
  color: var(--primary-color);
}
</style>
