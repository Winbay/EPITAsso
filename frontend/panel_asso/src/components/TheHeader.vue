<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Avatar from 'primevue/avatar'
import Dropdown, { type DropdownChangeEvent } from 'primevue/dropdown'
import Button from 'primevue/button'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import type {AssociationWithLogo} from "@/types/associationInterfaces";
import SelectedAssoService from "@/services/association/selectedAsso";
import { useAssociationStore } from '@/stores/selectedAssociation'

const userStore = useUserStore()
const user = ref(userStore.getUser)

const userAssociations = ref<AssociationWithLogo[]>([]);
const selectedAsso = ref<AssociationWithLogo | undefined>();

const stateMenu = () => {
  let sidePanel = document.getElementById('main-content')
  if (!sidePanel) {
    return
  }
  if (sidePanel.classList.contains('panel-inactive')) {
    sidePanel.classList.remove('panel-inactive')
  } else {
    sidePanel.classList.add('panel-inactive')
  }
}

const openProfile = () => {
  router.push('/profile')
  console.log('open profile')
}
const getCurrentUserAssociations = async () => {
  userAssociations.value = await SelectedAssoService.getUserAssociations();
}

const associationStore = useAssociationStore();
const handleSelectedAssoChange = (event: DropdownChangeEvent) => {
  SelectedAssoService.setAssociationId(event.value.id.toString())
  if (associationStore.selectedAssociationId !== event.value.id.toString()) {
    associationStore.setSelectedAssociation(event.value.id.toString());
    window.location.reload();
  }
}

onMounted(async () => {
  await getCurrentUserAssociations();
  if (userAssociations.value.length === 0) {
    return; // Rediriger vers une page qui dit qu'on a pas d'asso
  }
  let currAssoId = SelectedAssoService.getAssociationId();
  if (currAssoId === '0') {
    SelectedAssoService.setAssociationId(userAssociations.value[0].id.toString())
    currAssoId = SelectedAssoService.getAssociationId();
  }
  selectedAsso.value = userAssociations.value.find(asso => asso.id.toString() === currAssoId);
})
</script>

<template>
  <header class="w-full h-10 flex justify-between">
    <div class="header-left w-64 flex justify-between items-center">
      <div class="page-title w-56 flex justify-center">
        <span class="ml-2 text-lg font-bold uppercase text-wrap">Panel Association</span>
      </div>
      <div class="btn-menu flex justify-center cursor-pointer" v-on:click="stateMenu">
        <i class="pi pi-bars" style="font-size: 1.5rem" />
      </div>
    </div>
    <div class="header-right flex justify-center items-center mr-10">
      <Dropdown
        v-model="selectedAsso"
        :options="userAssociations"
        optionLabel="name"
        placeholder="Select an Asso"
        class="h-10 w-full md:w-14rem bg-transparent border-0 shadow-none"
        @change="handleSelectedAssoChange"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <Avatar :image="`${slotProps.value.logo}`" class="mr-1" shape="circle" />
            <div class="text-base flex items-center ml-1 mr-0">{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <Avatar :image="`${slotProps.option.logo}`" class="mr-1" shape="circle" />
            <div class="text-base flex items-center ml-1">{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>
      <Button
        v-if="user"
        :label="user!.login"
        icon="pi pi-user"
        class="text-white w-full h-8 pl-2"
        @click="openProfile"
      />
    </div>
  </header>
</template>

<style>
header {
  background-color: var(--primary-color);
}

.p-inputtext {
  padding: 0.2rem 0.5rem;
}

.p-dropdown-panel .p-dropdown-items {
  padding: 0;
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
  padding: 0.5rem 1.25rem;
}

.p-dropdown .p-dropdown-trigger {
  width: 2rem;
}
</style>
