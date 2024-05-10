<script setup lang="ts">

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { Position, StudentEngagement } from '@/types/studentEngagementInterface'

const props = defineProps<{
  studentEngagements: StudentEngagement[]
  positions: Position[]
}>()

const getPositionName = (positionId: number): string => {
  return props.positions.find(item => item.id === positionId)?.name ?? "";
}


</script>

<template>
  <DataTable :value="studentEngagements">
    <Column field="login" header="Login" :sortable="true"></Column>
    <Column field="name" header="Nom" :sortable="true"></Column>
    <Column field="firstname" header="Prénom" :sortable="true"></Column>
    <Column field="promotion" header="Promotion" :sortable="true"></Column>
    <Column field="position" header="Poste dans l'association" :sortable="true">
      <template #body="slotProps">
        {{ getPositionName(slotProps.data.position) }}
      </template>
    </Column>
    <Column field="comment" header="Commentaire sur l'investissement au sein de l'association"></Column>
    <Column field="activity1" header="Activité 1 et heures travaillées">
      <template #body="slotProps">
        {{ slotProps.data.activities[0].text + " = " + slotProps.data.activities[0].hours + " h"}}
      </template>
    </Column>
    <Column field="activity2" header="Activité 2 et heures travaillées">
      <template #body="slotProps">
        {{
          (slotProps.data.activities.length > 1) ?
            slotProps.data.activities[1].text + " = " + slotProps.data.activities[1].hours + " h" :
            ""
        }}
      </template>
    </Column>
    <Column field="activity3" header="Activité 3 et heures travaillées">
      <template #body="slotProps">
        {{
          (slotProps.data.activities.length > 2) ?
            slotProps.data.activities[2].text + " = " + slotProps.data.activities[2].hours + " h" :
            ""
        }}
      </template>
    </Column>
    <Column field="totalHours" header="Total heures" :sortable="true">
    </Column>
    <Column field="totalDays" header="Total jour" :sortable="true"></Column>
  </DataTable>
</template>

<style scoped>

</style>