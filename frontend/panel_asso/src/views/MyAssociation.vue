<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import AssociationDetails from '@/components/AssociationDetails.vue'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import AssociationDetailService from '@/services/association/associationDetailService'
import type { AssociationDetail } from '@/types/associationInterfaces'
import ProgressSpinner from 'primevue/progressspinner'
import Members from '@/components/DataTable/DataTableMembers.vue'

const ASSOCIATION_ID = 2
const toast = useToast()
const associationDetailService: AssociationDetailService = new AssociationDetailService(toast, ASSOCIATION_ID)

const isLoading = ref(true)

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  description: '',
  location: '',
  logo: '',
  members: [],
  socialNetworks: [],
  faq: []
})

const associationRef = ref<AssociationDetail>(getDefaultAssociation())

const reloadMyAssociation = async (): Promise<void> => {
  isLoading.value = true
  associationRef.value = await associationDetailService.getAssociationDetail()
  isLoading.value = false
}

onMounted(async () => {
  await reloadMyAssociation()
})
</script>

<template>
  <div v-if="isLoading" class="spinner">
    <ProgressSpinner />
  </div>
  <div v-else>
      <TabView class="content-center w-full h-full px-10 py-4">
        <TabPanel header="Mon association">
          <ScrollPanel
            class="flex content-center w-full h-full"
            style="width: 100%; height: calc(100vh - 7rem)"
          >
            <AssociationDetails
              :association-details="associationRef"
              :reload-association="reloadMyAssociation"
            />
          </ScrollPanel>

        </TabPanel>
        <TabPanel header="Les membres">
          <ScrollPanel
            class="flex content-center w-full h-full"
            style="width: 100%; height: calc(100vh - 7rem)"
          >
            <Members
              :members="associationRef.members"
            />
          </ScrollPanel>
        </TabPanel>
      </TabView>
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
</style>
