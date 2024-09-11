<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { Equipment, EquipmentRequest } from '@/types/equipmentInterfaces'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import EquipmentService from '@/services/equipment/equipment'
import EquipmentRequestService from '@/services/equipment/equipmentRequest'
import DataTableEquipmentCurrAsso from '@/components/DataTable/DataTableEquipmentCurrAsso.vue'
import DataTableEquipmentOtherAssos from '@/components/DataTable/DataTableEquipmentOtherAssos.vue'
import DataTableEquipmentRequestsReceived from '@/components/DataTable/DataTableEquipmentRequestsReceived.vue'
import DataTableEquipmentRequestsSent from '@/components/DataTable/DataTableEquipmentRequestsSent.vue'

const assoEquipments = ref<Equipment[]>([])
const otherAssoEquipments = ref<Equipment[]>([])
const equipmentRequestsReceived = ref<EquipmentRequest[]>([])
const equipmentRequestsSent = ref<EquipmentRequest[]>([])
const toast = useToast()
const equipmentService: EquipmentService = new EquipmentService(toast)
const equipmentRequestService: EquipmentRequestService = new EquipmentRequestService(toast)

const assoEquipmentPaginator = ref({
  rowsPerPage: 5,
  currentPage: 0,
  equipmentCount: 0
})

const otherAssoEquipmentPaginator = ref({
  rowsPerPage: 5,
  currentPage: 0,
  equipmentCount: 0
})

const equipmentRequestPaginator = ref({
  rowsPerPage: 5,
  currentPage: 0,
  equipmentCount: 0
})

const equipmentRequestSentPaginator = ref({
  rowsPerPage: 5,
  currentPage: 0,
  equipmentCount: 0
})

const handlePageChange = ({ component, page, rows }: { component: "asso" | "otherAsso" | "reqReceived" | "reqSent" ,page: number; rows: number }) => {
  switch (component) {
    case "asso":
      assoEquipmentPaginator.value.currentPage = page
      assoEquipmentPaginator.value.rowsPerPage = rows
      reloadAssociationEquipments()
      break
    case "otherAsso":
      otherAssoEquipmentPaginator.value.currentPage = page
      otherAssoEquipmentPaginator.value.rowsPerPage = rows
      reloadOtherAssociationEquipments()
      break
    case "reqReceived":
      equipmentRequestPaginator.value.currentPage = page
      equipmentRequestPaginator.value.rowsPerPage = rows
      reloadEquipmentRequests()
      break
    case "reqSent":
      equipmentRequestSentPaginator.value.currentPage = page
      equipmentRequestSentPaginator.value.rowsPerPage = rows
      reloadEquipmentRequests()
      break
  }
}

async function reloadAssociationEquipments() {
  const offset = assoEquipmentPaginator.value.currentPage * assoEquipmentPaginator.value.rowsPerPage
  const equipments = await equipmentService.getAssoEquipments(assoEquipmentPaginator.value.rowsPerPage, offset)
  assoEquipments.value = equipments.results
  assoEquipmentPaginator.value.equipmentCount = equipments.count
}

async function reloadOtherAssociationEquipments() {
  const offset = otherAssoEquipmentPaginator.value.currentPage * otherAssoEquipmentPaginator.value.rowsPerPage
  const equipments = await equipmentService.getOtherAssoEquipments(otherAssoEquipmentPaginator.value.rowsPerPage, offset)
  otherAssoEquipments.value = equipments.results
  otherAssoEquipmentPaginator.value.equipmentCount = equipments.count
}

async function reloadEquipmentRequests() {
  const offsetReceived = equipmentRequestPaginator.value.currentPage * equipmentRequestPaginator.value.rowsPerPage
  const request = await equipmentRequestService.getRequestsReceived(equipmentRequestPaginator.value.rowsPerPage, offsetReceived)
  equipmentRequestsReceived.value = request.results
  equipmentRequestPaginator.value.equipmentCount = request.count

  const offsetSent = equipmentRequestSentPaginator.value.currentPage * equipmentRequestSentPaginator.value.rowsPerPage
  const sent = await equipmentRequestService.getRequestsSent(equipmentRequestSentPaginator.value.rowsPerPage, offsetSent)
  equipmentRequestsSent.value = sent.results
  equipmentRequestSentPaginator.value.equipmentCount = sent.count
}

onMounted(async () => {
  await reloadAssociationEquipments()
  await reloadOtherAssociationEquipments()
  await reloadEquipmentRequests()
})
</script>

<template>
  <div class="equipment-list w-full h-full px-10 py-8 flex flex-col">
    <DataTableEquipmentCurrAsso
      :curr-asso-equipment="assoEquipments"
      :reload-equipments="reloadAssociationEquipments"
      :paginator-data="assoEquipmentPaginator"
      @page-change="handlePageChange"
    />
    <DataTableEquipmentOtherAssos
      :other-assos-equipment="otherAssoEquipments"
      :reload-equipments="reloadOtherAssociationEquipments"
      :reload-equipment-requests="reloadEquipmentRequests"
      :paginator-data="otherAssoEquipmentPaginator"
      @page-change="handlePageChange"
    />
    <div class="h-10 mt-8 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Demandes de prêt</span>
    </div>
    <TabView>
      <TabPanel header="Reçues">
        <DataTableEquipmentRequestsReceived
          :equipment-requests="equipmentRequestsReceived"
          :reload-equipments="reloadAssociationEquipments"
          :reload-equipment-requests="reloadEquipmentRequests"
          :paginator-data="equipmentRequestPaginator"
          @page-change="handlePageChange"
        />
      </TabPanel>
      <TabPanel header="Envoyées">
        <DataTableEquipmentRequestsSent
          :equipment-requests="equipmentRequestsSent"
          :reload-equipment-requests="reloadEquipmentRequests"
          :paginator-data="equipmentRequestSentPaginator"
          @page-change="handlePageChange"
        />
      </TabPanel>
    </TabView>
  </div>
</template>

<style>
.equipment-list .add-btn {
  color: var(--text-color);
}

.equipment-list a {
  color: var(--primary-color);
}

.p-icon-field-left > .p-inputtext {
  padding-left: 2.5rem;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link,
.p-tabview .p-tabview-nav li .p-tabview-nav-link,
.p-tabview .p-tabview-panels {
  background: transparent;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.75rem 1.25rem;
}
</style>
