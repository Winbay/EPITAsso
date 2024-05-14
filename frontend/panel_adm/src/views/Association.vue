<script setup lang="ts">
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DialogAssoCreation from '@/components/Dialog/DialogAssoCreation.vue'
import type { Association } from '@/types/assoInterfaces'
import '@/fixtures/associations'

const assos = ref<Association[]>([])

const visibleCreation = ref(false)
const toast = useToast()

const closeDialog = () => {
  visibleCreation.value = false
}

async function reloadAssos() {
  try {
    const rep2 = await axios.get<Association[]>('/api/associations')
    assos.value = rep2.data
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Associations',
      detail: "La liste des associations n'a pas pu être chargée.",
      life: 3000
    })
    return false
  }
}

onMounted(async () => {
  await reloadAssos()
})
</script>

<template>
  <div class="events-list w-full h-full px-10 py-8">
    <div class="events-list-header h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Associations</span>
      <Button label="Ajouter" class="add-btn py-0 px-4 h-full" @click="visibleCreation = true" />
      <DialogAssoCreation
        v-model:visible="visibleCreation"
        :set-hidden="closeDialog"
        :reload-assos="reloadAssos"
      />
    </div>
    <DataTable
      :value="assos"
      show-gridlines
      striped-rows
      size="small"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
    >
      <Column field="date" header="Logo" class="max-w-28" sortable>
        <template #body="slotProps">
          <img
            :src="slotProps.data.logo.url"
            :alt="`logo ${slotProps.data.name}`"
            style="width: 100px"
          />
        </template>
      </Column>
      <Column field="name" header="Nom" sortable></Column>
      <Column field="description" header="Description" sortable></Column>
      <Column field="location" header="Campus" sortable></Column>
    </DataTable>
  </div>
</template>

<style>
.events-list .add-btn {
  color: var(--text-color);
}

.events-list a {
  color: var(--primary-color);
}

.events-list .p-paginator-bottom {
  border: none;
}

.events-list .p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}
</style>
