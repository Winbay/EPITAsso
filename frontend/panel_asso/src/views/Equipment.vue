<script setup lang="ts">
import axios from 'axios'
import {onMounted, ref} from 'vue';
import {useToast} from 'primevue/usetoast';
import type {Equipment, EquipmentRequest} from "@/types/equipmentInterfaces";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTableEquipmentCurrAsso from "@/components/DataTable/DataTableEquipmentCurrAsso.vue";
import DataTableEquipmentOtherAssos from "@/components/DataTable/DataTableEquipmentOtherAssos.vue";
import DataTableEquipmentRequestsReceived from "@/components/DataTable/DataTableEquipmentRequestsReceived.vue";
import DataTableEquipmentRequestsSent from "@/components/DataTable/DataTableEquipmentRequestsSent.vue";

const allEquipment = ref<Equipment[]>([]);
const equipmentRequestsReceived = ref<EquipmentRequest[]>([]);
const equipmentRequestsSent = ref<EquipmentRequest[]>([]);
const currAsso = {id: 1, name: "EPTV", logo: "/images/eptv.jpg", description: "", location: "KB"};
const toast = useToast()

async function reloadEquipments() {
  try {
    const rep = await axios.get<Equipment[]>('/api/equipment');
    allEquipment.value = rep.data;
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Évènements',
      detail: "La liste des matériels n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
}

async function reloadEquipmentRequests() {
  try {
    const rep = await axios.post<EquipmentRequest[]>('/api/equipment/requests/received',
        {assoId: currAsso.id});
    equipmentRequestsReceived.value = rep.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Demandes de prêt',
      detail: "La liste des demandes de prêt reçues n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
  try {
    const rep = await axios.post<EquipmentRequest[]>('/api/equipment/requests/sent',
        {assoId: currAsso.id});
    equipmentRequestsSent.value = rep.data;
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Demandes de prêt',
      detail: "La liste des demandes de prêt envoyées n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
}

onMounted(async () => {
  await reloadEquipments();
  await reloadEquipmentRequests();
})
</script>

<template>
  <div class="equipment-list w-full h-full px-10 py-8 flex flex-col">
    <DataTableEquipmentCurrAsso
        :curr-asso-equipment="allEquipment.filter(eq => eq.assoOwner.id === currAsso.id)"
        :reload-equipments="reloadEquipments"
    />
    <DataTableEquipmentOtherAssos
        :other-assos-equipment="allEquipment.filter(eq => eq.assoOwner.id !== currAsso.id)"
        :reload-equipments="reloadEquipments"
        :reload-equipment-requests="reloadEquipmentRequests"
    />
    <div class="h-10 mt-8 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Demandes de prêt</span>
    </div>
    <TabView>
      <TabPanel header="Reçues">
        <DataTableEquipmentRequestsReceived
            :curr-asso-equipments="allEquipment.filter(eq => eq.assoOwner.id === currAsso.id)"
            :equipment-requests="equipmentRequestsReceived"
            :reload-equipments="reloadEquipments"
            :reload-equipment-requests="reloadEquipmentRequests"
        />
      </TabPanel>
      <TabPanel header="Envoyées">
        <DataTableEquipmentRequestsSent
            :curr-asso-equipments="allEquipment.filter(eq => eq.assoOwner.id === currAsso.id)"
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