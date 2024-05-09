<script setup lang="ts">
import { ref } from "vue";
import Avatar from 'primevue/avatar';
import Dropdown from "primevue/dropdown";

const items = ref([
  {
    icon: "pi pi-bars"
  }
])

const associations = ref([
  { name: 'EPTV', logo: "eptv.jpg" },
  { name: 'Kraken', logo: "kraken.png" }
]);
const selectedAsso = ref(associations.value[0]);

const stateMenu = () => {
  let sidePanel = document.getElementById("main-content");
  if (!sidePanel) {
    return;
  }
  if (sidePanel.classList.contains("panel-inactive")) {
    sidePanel.classList.remove("panel-inactive")
  } else {
    sidePanel.classList.add("panel-inactive");
  }
}
</script>

<template>
  <header class="w-full h-10 flex justify-between">
    <div class="header-left w-64 flex justify-between items-center">
      <div class="page-title w-56 flex justify-center">
        <span class="ml-2 text-lg font-bold uppercase text-wrap">Panel Admin</span>
      </div>
      <div class="btn-menu flex justify-center cursor-pointer" v-on:click="stateMenu">
        <i class="pi pi-bars" style="font-size: 1.5rem;"/>
      </div>
    </div>
    <div class="header-right flex justify-center items-center mr-10">
      <Dropdown v-model="selectedAsso" :options="associations" optionLabel="name" placeholder="Select an Asso" class="h-10 w-full md:w-14rem bg-transparent border-0 shadow-none">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <Avatar :image="`/images/${slotProps.value.logo}`" class="mr-1" shape="circle"/>
            <div class="text-base flex items-center ml-1 mr-0">{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
        </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <Avatar :image="`/images/${slotProps.option.logo}`" class="mr-1" shape="circle"/>
            <div class="text-base flex items-center ml-1">{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>
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