<script setup lang="ts">
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Avatar from 'primevue/avatar'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import Column from 'primevue/column'
import { defineProps, type PropType, ref } from 'vue'
import type { Equipment } from '@/types/equipmentInterfaces'
import { FilterMatchMode } from 'primevue/api'
import DialogEquipmentBorrow from '@/components/Dialog/DialogEquipmentBorrow.vue'

defineProps({
  otherAssosEquipment: {
    type: Object as PropType<Equipment[]>,
    required: true
  },
  reloadEquipments: {
    type: Function,
    required: true
  },
  reloadEquipmentRequests: {
    type: Function,
    required: true
  }
})

const visibleBorrow = ref<number>(0)

const filtersOtherAssos = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'assoOwner.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH }
})

const timestampToString = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${day}/${month}/${year}`
}

const closeDialog = () => {
  visibleBorrow.value = 0
}
</script>

<template>
  <div class="h-10 mt-8 mb-6 flex justify-start items-center">
    <span class="mr-4 text-2xl font-bold text-wrap">Matériel des autres associations</span>
  </div>
  <DataTable
    :value="otherAssosEquipment"
    v-model:filters="filtersOtherAssos"
    :globalFilterFields="['name', 'assoOwner.name']"
    show-gridlines
    striped-rows
    tableStyle="min-width: 50rem"
    size="small"
    paginator
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    removableSort
  >
    <template #header>
      <div class="flex justify-center">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText v-model="filtersOtherAssos['global'].value" placeholder="Recherche" />
        </IconField>
      </div>
    </template>
    <Column header="Disponibilité" class="w-10">
      <template #body="slotProps">
        <Tag
          :value="slotProps.data.equipmentRequest === null ? 'Disponible' : 'Indisponible'"
          :severity="slotProps.data.equipmentRequest === null ? 'success' : 'danger'"
          class="mx-1 my-0.5"
        />
      </template>
    </Column>
    <Column field="name" header="Matériel" sortable></Column>
    <Column field="quantity" header="Quantité" class="w-10" sortable></Column>
    <Column header="Association">
      <template #body="slotProps">
        <div class="flex items-center">
          <Avatar
            :image="slotProps.data.assoOwner.logo"
            size="xlarge"
            class="flex align-items-center justify-content-center mr-2"
          />
          <span>{{ slotProps.data.assoOwner.name }}</span>
        </div>
      </template>
    </Column>
    <Column header="Informations emprunt">
      <template #body="slotProps">
        <div class="flex items-center" v-if="slotProps.data.equipmentRequest !== null">
          <Avatar
            :image="slotProps.data.equipmentRequest.assoBorrower.logo"
            size="xlarge"
            class="flex align-items-center justify-content-center mr-2"
          />
          <div class="flex flex-col">
            <span>{{ slotProps.data.equipmentRequest.assoBorrower.name }}</span>
            <span class="text-xs"
              >Emprunt :
              {{ timestampToString(slotProps.data.equipmentRequest.borrowingDate) }}</span
            >
            <span class="text-xs"
              >Retour : {{ timestampToString(slotProps.data.equipmentRequest.dueDate) }}</span
            >
          </div>
        </div>
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <div class="flex flex-col">
          <DialogEquipmentBorrow
            :visible="visibleBorrow === slotProps.data.id"
            :equipment="slotProps.data"
            :reload-equipment-requests="reloadEquipmentRequests"
            :reload-equipments="reloadEquipments"
            :set-hidden="closeDialog"
          />
          <a
            href="javascript:void(0)"
            @click="visibleBorrow = slotProps.data.id"
            class="hover:underline"
            >Emprunter</a
          >
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
