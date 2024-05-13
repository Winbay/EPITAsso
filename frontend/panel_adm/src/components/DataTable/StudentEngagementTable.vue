<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import type { Position, Status, StudentEngagement } from '@/types/studentEngagementInterface'
import { defineEmits } from 'vue'

const props = defineProps<{
  studentEngagements: StudentEngagement[]
  positions: Position[]
  status: Status[]
}>()

const emits = defineEmits(['update:visible'])

const getPositionName = (positionId: number): string => {
  return props.positions.find((item) => item.id === positionId)?.name ?? ''
}

const getStatusName = (statusId: number): string => {
  return props.status.find((item) => item.id === statusId)?.name ?? ''
}

const getStatusSeverity = (status: number) => {
  switch (status) {
    case 1:
      return 'warning'
    case 2:
    case 3:
      return 'success'
    case 4:
      return 'danger'
    default:
      return ''
  }
}

const openDialog = (studentId: number) => {
  emits('update:visible', { visible: true, id: studentId, canEdit: true })
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
          {{ getPositionName(slotProps.data.position) }}
        </template>
      </Column>
      <Column field="totalHours" header="Total heures" :sortable="true"></Column>
      <Column field="status.id" header="Status" :sortable="true">
        <template #body="slotProps">
          <Tag
            :value="getStatusName(slotProps.data.status.id)"
            :severity="getStatusSeverity(slotProps.data.status.id)"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex flex-col">
            <a
              href="javascript:void(0)"
              class="hover:underline"
              @click="openDialog(slotProps.data.id)"
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
