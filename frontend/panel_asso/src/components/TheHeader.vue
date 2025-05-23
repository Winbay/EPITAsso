<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { useGlobalStore } from '@/stores/globalStore'
import SelectAssociation from '@/components/SelectAssociation.vue'
import SelectedAssoService from '@/services/association/selectedAsso'
import type { Association } from '@/types/associationInterfaces'
import { on } from '@/utils/eventBus'
import { ASSOCIATION_ID } from '@/services/api'
import Profile from '@/views/Profile.vue'

const userStore = useUserStore()
const globalStore = useGlobalStore()
const user = ref(userStore.getUser)

const userAssociations = ref<Association[]>([])
const selectedAssociation = ref<Association | undefined>()

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

const showProfileModalRef = ref(false)
const toggleOpenProfile = () => {
  showProfileModalRef.value = !showProfileModalRef.value
}

const refreshUserAssociations = async (): Promise<void> => {
  userAssociations.value = await SelectedAssoService.getUserAssociations()
  if (userAssociations.value.length === 0) {
    localStorage.removeItem(ASSOCIATION_ID)
  }
  selectedAssociation.value = userAssociations.value.find(
    (asso) => asso.id.toString() === SelectedAssoService.getAssociationId()
  )
  if (selectedAssociation.value) {
    globalStore.currentAssociation = selectedAssociation.value
  }
}

onMounted(async () => {
  await refreshUserAssociations()
  on('association-changed', async () => {
    await refreshUserAssociations()
  })
})
</script>

<template>
  <header class="w-full h-10 flex justify-between absolute top-0 z-10">
    <div class="header-left w-64 flex justify-between items-center">
      <div class="page-title w-56 flex justify-center">
        <span class="ml-2 text-lg font-bold uppercase text-wrap">Panel Association</span>
      </div>
      <div class="btn-menu flex justify-center cursor-pointer" v-on:click="stateMenu">
        <i class="pi pi-bars" style="font-size: 1.5rem" />
      </div>
    </div>
    <div class="header-right flex justify-center items-center mr-10">
      <SelectAssociation
        v-if="userAssociations.length > 0"
        v-model="selectedAssociation"
        :user-associations="userAssociations"
      />
      <div>
        <Button
          v-if="user"
          :label="user!.login"
          icon="pi pi-user"
          class="text-white w-full h-8 pl-2 pr-2"
          @click="toggleOpenProfile"
        />
      </div>
    </div>
  </header>
  <Profile v-if="showProfileModalRef" @close="showProfileModalRef = false" />
</template>

<style>
header {
  background-color: var(--primary-color);
}

.p-inputtext {
  padding: 0.2rem 0.5rem;
}
</style>
