<script setup lang="ts">
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'
import AssociationDetails from '@/components/AssociationDetails.vue'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import AssociationDetailService from '@/services/association/details'
import type { AssociationDetail, AssociationWithLogo } from '@/types/associationInterfaces'
import ProgressSpinner from 'primevue/progressspinner'
import Members from '@/components/DataTable/DataTableMembers.vue'
import SelectedAssoService from '@/services/association/selectedAsso'
import { on } from '@/utils/eventBus'
import SelectAssociation from '@/components/SelectAssociation.vue'

const toast = useToast()
let associationDetailService: AssociationDetailService

const isLoading = ref(false)
const membersLoaded = ref(false)
const activeTab = ref(0)

const userAssociations = ref<AssociationWithLogo[]>([])

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  content: '',
  location: '',
  logo: '',
  webhook: '',
  socialNetworks: [],
  faqs: []
})

const associationRef = ref<AssociationDetail>(getDefaultAssociation())

const reloadMyAssociation = async (): Promise<void> => {
  isLoading.value = true
  associationRef.value = await associationDetailService.getAssociationDetail()
  isLoading.value = false
}

onMounted(async () => {
  const initialAssociationId = SelectedAssoService.getAssociationId()

  on('association-changed', async (newAssociationId: number) => {
    associationDetailService = new AssociationDetailService(toast, +newAssociationId)
    await reloadMyAssociation()
  })

  if (initialAssociationId && +initialAssociationId !== 0) {
    associationDetailService = new AssociationDetailService(toast, +initialAssociationId)
    await reloadMyAssociation()
  } else {
    userAssociations.value = await SelectedAssoService.getUserAssociations()
  }
})

const handleTabChange = (event: { index: number }): void => {
  activeTab.value = event.index
  if (event.index === 1 && !membersLoaded.value) {
    membersLoaded.value = true
  }
}
</script>

<template>
  <div v-if="isLoading" class="spinner">
    <ProgressSpinner />
  </div>
  <div v-else>
    <div v-if="associationRef.id > 0" class="w-full h-full px-10 py-8">
      <TabView @tab-change="handleTabChange">
        <TabPanel header="Mon association">
          <AssociationDetails
            :association-details="associationRef"
            :reload-association="reloadMyAssociation"
          />
        </TabPanel>
        <TabPanel header="Les membres">
          <Members v-if="membersLoaded" :association-id="+SelectedAssoService.getAssociationId()" />
        </TabPanel>
      </TabView>
    </div>
    <div v-else-if="userAssociations.length > 0" class="select-association-container">
      <Card class="card flex flex-col justify-center text-center pl-6 pr-6 rounded-lg bg-1f2937">
        <template #title>
          <h2 class="text-2xl font-bold">Mes associations</h2>
        </template>
        <template #content>
          <SelectAssociation
            :user-associations="userAssociations"
            class="select-association-dropdown"
          />
        </template>
      </Card>
    </div>
    <div v-else class="h-full flex flex-col items-center justify-center">
      <h3>Vous n'avez pas encore rejoint d'associations</h3>
    </div>
  </div>
</template>

<style>
.spinner {
  height: 100vh;
  align-content: center;
  text-align: center;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link,
.p-tabview .p-tabview-nav li .p-tabview-nav-link,
.p-tabview .p-tabview-panels {
  background: transparent;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.75rem 1.25rem;
}

.select-association-container {
  background-color: #131923;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.select-association-dropdown {
  background-color: #19212f;
}

.select-association-dropdown:hover {
  background-color: #293749;
}
</style>
