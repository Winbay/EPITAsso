<script setup lang="ts">
import { defineProps } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import type { User } from '@/types/userInterfaces'
import type { PropType } from 'vue'

defineProps({
  members: {
    type: Array as PropType<User[]>,
    required: true
  }
})

</script>

<template>
  <DataTable
    :value="members"
    show-gridlines
    striped-rows
    tableStyle="min-width: 50rem"
    size="small"
    paginator
    sort-field="login"
    removable-sort
    :sort-order="-1"
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]">
    <Column field="login" header="Login" class="w-28" sortable>
      <template #body="slotProps">
        <span>{{ slotProps.data.login }}</span>
      </template>
    </Column>
    <Column field="firstName" header="Prénom" class="w-28" sortable>
      <template #body="slotProps">
        <span>{{ slotProps.data.firstName }}</span>
      </template>
    </Column>
    <Column field="lastName" header="Nom" class="w-28" sortable>
      <template #body="slotProps">
        <span>{{ slotProps.data.lastName }}</span>
      </template>
    </Column>
    <Column field="Ecole" header="École" class="w-28" sortable>
      <template #body="slotProps">
        <span>{{ slotProps.data.school }}</span>
      </template>
    </Column>
  </DataTable>
</template>

<style>
.p-paginator {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.p-paginator-bottom {
  border: none;
}

.p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}
</style>