<script setup lang="ts">
import PanelMenu from "primevue/panelmenu";
import {onMounted} from "vue";

const items = [
  {
    label: "Tableau de bord",
    icon: 'pi pi-building-columns'
  },
  {
    label: "Mon association",
    icon: "pi pi-info-circle"
  },
  {
    label: "Messagerie",
    icon: "pi pi-inbox"
  },
  {
    label: "Évènements",
    icon: "pi pi-calendar"
  },
  {
    label: "Articles",
    icon: "pi pi-book"
  },
  {
    label: "Formulaires",
    icon: "pi pi-list",
    items: [
      {label: "Engagement étudiant"},
      {label: "Fiche évènement"},
      {label: "Création d'association"}
    ]
  },
  {
    label: "Matériel",
    icon: "pi pi-database"
  }
];

onMounted(() => {
  // document.getElementById("side-panel").classList.remove("-left-56");
})
</script>

<template>
  <div id="side-panel" class="absolute -left-56 h-full w-56">
    <PanelMenu :model="items" class="w-full h-full">
      <template #item="{ item }">
        <a :Ripple="true" class="flex align-items-center px-3 py-2 cursor-pointer">
          <span :class="[item.icon, 'text-primary text-lg']"/>
          <span :class="['ml-2 text-sm', { 'font-semibold': 'item.items'}]">{{ item.label }}</span>
          <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto"/>
        </a>
      </template>
    </PanelMenu>
  </div>
</template>

<style>
.p-panelmenu-panel {
  margin: 0;
  border-radius: 0;
}

.p-panelmenu-header-content, .p-panelmenu-content {
  border: initial;
  border-radius: 0;
}

#side-panel {
  background-color: #1F2937;
  transition: left 0.8s;
}
</style>