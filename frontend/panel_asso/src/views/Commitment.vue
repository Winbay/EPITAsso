<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import DataTableCommitmentResume from '@/components/DataTable/DataTableCommitmentResume.vue'
import DataTableMemberCommitment from '@/components/DataTable/DataTableMemberCommitment.vue'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import ProgressSpinner from 'primevue/progressspinner'
import { on } from '@/utils/eventBus'

const isLoading = ref(false)

const activeTabIndex = ref(0)
const handleTabChange = (event: { index: number }): void => {
  activeTabIndex.value = event.index
}

onMounted(() => {
  on('association-changed', async () => {
    isLoading.value = true
    await nextTick()
    isLoading.value = false
  })
})
</script>

<template>
  <div v-if="isLoading" class="content-center text-center h-full">
    <ProgressSpinner />
  </div>
  <div v-else class="card w-full h-full px-10 py-8">
    <div class="h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Engagement Étudiant</span>
    </div>

    <TabView @tab-change="handleTabChange" :active-index="activeTabIndex">
      <TabPanel header="Résumé">
        <DataTableCommitmentResume v-if="activeTabIndex === 0" />
      </TabPanel>
      <TabPanel header="Engagements de bureau ">
        <DataTableMemberCommitment v-if="activeTabIndex === 1" />
      </TabPanel>
    </TabView>
  </div>
</template>

<style></style>
