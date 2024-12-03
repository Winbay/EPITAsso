<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import { onMounted } from 'vue'

const items = [
  {
    label: 'Tableau de bord',
    icon: 'pi pi-building-columns'
  },
  // {
  //   label: 'Mon association',
  //   icon: 'pi pi-info-circle',
  //   path: 'mon-association'
  // },
  {
    label: 'Messagerie',
    icon: 'pi pi-inbox',
    path: 'messaging'
  },
  {
    label: 'Évènements',
    icon: 'pi pi-calendar',
    path: 'events'
  },
  {
    label: 'Articles',
    icon: 'pi pi-book',
    path: 'articles'
  },
  {
    label: 'Engagement étudiant',
    icon: 'pi pi-users',
    path: 'commitments'
  },
  {
    label: 'Matériel',
    icon: 'pi pi-database',
    path: 'equipment'
  }
]

onMounted(() => {
  // document.getElementById("side-panel").classList.remove("-left-56");
})
</script>

<template>
  <div id="side-panel" class="h-full w-56">
    <PanelMenu :model="items" class="w-full h-full">
      <template #item="{ item }">
        <router-link
          :to="`/${item.path || ''}`"
          :Ripple="true"
          class="flex align-items-center px-3 py-2 cursor-pointer"
        >
          <span :class="[item.icon, 'text-primary text-lg']" />
          <span :class="['ml-2 text-sm', { 'font-semibold': 'item.items' }]">{{ item.label }}</span>
          <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
        </router-link>
      </template>
    </PanelMenu>
  </div>
</template>

<style>
#side-panel {
  background-color: #1f2937;
  transition: transform 0.2s;
  position: fixed;
  top: 2.5rem;
  left: 0;
}

#main-content.panel-inactive #side-panel {
  transform: translateX(-100%);
}

.p-panelmenu-panel {
  margin: 0;
  border-radius: 0;
}

.p-panelmenu-header-content,
.p-panelmenu-content {
  border: initial;
  border-radius: 0;
}
</style>
