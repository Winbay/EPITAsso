<script setup lang="ts">
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import { defineProps, type PropType, ref } from 'vue'
import type { EquipmentRequest } from '@/types/equipmentInterfaces'
import DialogEquipmentRequestDetails from '@/components/Dialog/DialogEquipmentRequestDetails.vue'

defineProps({
  equipmentRequests: {
    type: Object as PropType<EquipmentRequest[]>,
    required: true
  },
  reloadEquipmentRequests: {
    type: Function,
    required: true
  },
  paginatorData: {
    type: Object as PropType<{ rowsPerPage: number; currentPage: number; equipmentCount: number }>,
    required: true
  }
})
const visibleAccept = ref<number>(0)
const visibleRefuse = ref<number>(0)
const visibleDetails = ref<number>(0)

const timestampToString = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${day}/${month}/${year}`
}

const closeDialog = () => {
  visibleAccept.value = 0
  visibleRefuse.value = 0
  visibleDetails.value = 0
}

const emit = defineEmits(['pageChange'])

const onPageChange = (event: any) => {
  emit('pageChange', { component: 'reqSent', page: event.page, rows: event.rows })
}
</script>

<template>
  <DataTable
    :value="equipmentRequests"
    show-gridlines
    striped-rows
    tableStyle="min-width: 50rem"
    size="small"
  >
    <Column field="status" header="Statut" class="w-28" sortable>
      <template #body="slotProps">
        <Tag
          :value="
            slotProps.data.status === 'waiting'
              ? 'En attente'
              : slotProps.data.status === 'accepted'
                ? 'Acceptée'
                : 'Refusée'
          "
          :severity="
            slotProps.data.status === 'waiting'
              ? 'warning'
              : slotProps.data.status === 'accepted'
                ? 'success'
                : 'danger'
          "
          class="mx-1 my-0.5"
        />
      </template>
    </Column>
    <Column header="Matériel">
      <template #body="slotProps">
        <span>{{ slotProps.data.equipmentName }}</span>
      </template>
    </Column>
    <Column header="Dates d'emprunt">
      <template #body="slotProps">
        <div class="flex items-center">
          <div class="flex flex-col">
            <span>Emprunt : {{ timestampToString(slotProps.data.borrowingDate) }}</span>
            <span>Retour : {{ timestampToString(slotProps.data.dueDate) }}</span>
          </div>
        </div>
      </template>
    </Column>
    <Column header="Responsable">
      <template #body="slotProps">
        <span>{{ slotProps.data.userRespoBorrower.login }}</span>
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <div class="flex flex-col">
          <DialogEquipmentRequestDetails
            :visible="visibleDetails === slotProps.data.id"
            :equipment-request="slotProps.data"
            :set-hidden="closeDialog"
            :received="false"
          />
          <a
            v-if="slotProps.data.status !== 'waiting'"
            href="javascript:void(0)"
            @click="visibleDetails = slotProps.data.id"
            class="hover:underline"
            >Détails</a
          >
        </div>
      </template>
    </Column>
  </DataTable>
  <Paginator
    :rows="paginatorData.rowsPerPage"
    :totalRecords="paginatorData.equipmentCount"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="onPageChange"
  />
</template>

<style scoped></style>
