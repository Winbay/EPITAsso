<script setup lang="ts">
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import ConfirmPopup from 'primevue/confirmpopup'
import Avatar from 'primevue/avatar'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import Column from 'primevue/column'
import { defineProps, ref } from 'vue'
import type { Equipment } from '@/types/equipmentInterfaces'
import Paginator from 'primevue/paginator'

import DialogEquipmentCreation from '@/components/Dialog/DialogEquipmentCreation.vue'
import DialogEquipmentModification from '@/components/Dialog/DialogEquipmentModification.vue'
import DialogEquipmentDetails from '@/components/Dialog/DialogEquipmentDetails.vue'
import type { PropType } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import EquipmentService from '@/services/equipment/equipment'

const props = defineProps({
  currAssoEquipment: {
    type: Object as PropType<Equipment[]>,
    required: true
  },
  reloadEquipments: {
    type: Function,
    required: true
  },
  paginatorData: {
    type: Object as PropType<{ rowsPerPage: number; currentPage: number; equipmentCount: number }>,
    required: true
  }
})

const filtersCurrAsso = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'assoOwner.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH }
})

const visibleCreation = ref(false)
const visibleModification = ref(0)
const visibleDetails = ref(0)
const confirm = useConfirm()
const toast = useToast()
const equipmentService: EquipmentService = new EquipmentService(toast)

const confirmDelete = (event: Event, equipmentId: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Êtes-vous sûr de vouloir supprimer ce matériel ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: async () => {
      await deleteEquipment(equipmentId)
    },
    reject: () => {}
  })
}

const confirmRetrieve = (event: Event, equipmentId: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Confirmez-vous la récupération du matériel ?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Confirmer',
    accept: async () => {
      await retrieveEquipment(equipmentId)
    },
    reject: () => {}
  })
}

const closeDialog = () => {
  visibleCreation.value = false
  visibleModification.value = 0
  visibleDetails.value = 0
}

async function deleteEquipment(equipmentId: number) {
  await equipmentService.deleteEquipment(equipmentId)
  // TODO not opti
  props.reloadEquipments()
}

async function retrieveEquipment(equipmentId: number) {
  await equipmentService.retrieveEquipment(equipmentId)
  // TODO not opti
  props.reloadEquipments()
}

const timestampToString = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${day}/${month}/${year}`
}

const emit = defineEmits(['pageChange'])

const onPageChange = (event: any) => {
  emit('pageChange', { component: "asso", page: event.page, rows: event.rows })
}
</script>

<template>
  <div class="h-10 mb-6 flex justify-start items-center">
    <span class="mr-4 text-2xl font-bold text-wrap">Matériel de mon association</span>
    <Button label="Ajouter" class="add-btn py-0 px-4 h-full" @click="visibleCreation = true" />
    <DialogEquipmentCreation
      v-model:visible="visibleCreation"
      :set-hidden="closeDialog"
      :reload-equipments="reloadEquipments"
    />
  </div>
  <DataTable
    :value="currAssoEquipment"
    v-model:filters="filtersCurrAsso"
    :globalFilterFields="['name', 'assoOwner.name']"
    show-gridlines
    striped-rows
    tableStyle="min-width: 50rem"
    size="small"
    removableSort
  >
    <template #header>
      <div class="flex justify-center">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText v-model="filtersCurrAsso['global'].value" placeholder="Recherche" />
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
        <ConfirmPopup></ConfirmPopup>
        <div class="flex flex-col" v-if="slotProps.data.equipmentRequest === null">
          <a
            href="javascript:void(0)"
            class="hover:underline"
            @click="visibleModification = slotProps.data.id"
            >Editer</a
          >
          <DialogEquipmentModification
            :visible="visibleModification === slotProps.data.id"
            :equipment="JSON.parse(JSON.stringify(slotProps.data))"
            :reload-equipments="reloadEquipments"
            :set-hidden="closeDialog"
          />
          <a
            href="javascript:void(0)"
            @click="confirmDelete($event, slotProps.data.id)"
            class="hover:underline"
            >Supprimer</a
          >
        </div>
        <div class="flex flex-col" v-else>
          <DialogEquipmentDetails
            :visible="visibleDetails === slotProps.data.id"
            :equipment="slotProps.data"
            :set-hidden="closeDialog"
          />
          <a
            href="javascript:void(0)"
            @click="visibleDetails = slotProps.data.id"
            class="hover:underline"
            >Détails</a
          >
          <a
            href="javascript:void(0)"
            @click="confirmRetrieve($event, slotProps.data.id)"
            class="hover:underline"
            >Récupérer</a
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
