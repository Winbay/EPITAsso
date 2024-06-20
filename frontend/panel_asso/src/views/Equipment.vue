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
import SelectedAssoService from '@/services/association/selectedAsso'

const allEquipment = ref<Equipment[]>([])
const equipmentRequestsReceived = ref<EquipmentRequest[]>([])
const equipmentRequestsSent = ref<EquipmentRequest[]>([])
const toast = useToast()
const equipmentService: EquipmentService = new EquipmentService(toast)
const equipmentRequestService: EquipmentRequestService = new EquipmentRequestService(toast)

async function reloadEquipments() {
  allEquipment.value = await equipmentService.getEquipments()
}

async function reloadEquipmentRequests() {
  equipmentRequestsReceived.value = await equipmentRequestService.getRequestsReceived()
  equipmentRequestsSent.value = await equipmentRequestService.getRequestsSent()
}

onMounted(async () => {
  await reloadEquipments()
  await reloadEquipmentRequests()
})
</script>

<template>
  <div class="equipment-list w-full h-full px-10 py-8 flex flex-col">
    <DataTableEquipmentCurrAsso
      :curr-asso-equipment="
        allEquipment.filter((eq) => eq.assoOwner.id === +SelectedAssoService.getAssociationId())
      "
      :reload-equipments="reloadEquipments"
    />
    <DataTableEquipmentOtherAssos
      :other-assos-equipment="
        allEquipment.filter((eq) => eq.assoOwner.id !== +SelectedAssoService.getAssociationId())
      "
      :reload-equipments="reloadEquipments"
      :reload-equipment-requests="reloadEquipmentRequests"
    />
    <div class="h-10 mt-8 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Demandes de prêt</span>
    </div>
    <TabView>
      <TabPanel header="Reçues">
        <DataTableEquipmentRequestsReceived
          :curr-asso-equipments="
            allEquipment.filter((eq) => eq.assoOwner.id === +SelectedAssoService.getAssociationId())
          "
          :equipment-requests="equipmentRequestsReceived"
          :reload-equipments="reloadEquipments"
          :reload-equipment-requests="reloadEquipmentRequests"
        />
      </TabPanel>
      <TabPanel header="Envoyées">
        <DataTableEquipmentRequestsSent
          :curr-asso-equipments="
            allEquipment.filter((eq) => eq.assoOwner.id === +SelectedAssoService.getAssociationId())
          "
          :equipment-requests="equipmentRequestsSent"
          :reload-equipment-requests="reloadEquipmentRequests"
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
