<script setup lang="ts">
import Panel from 'primevue/panel'
import { useSingleAssoStore } from '@/stores/singleAsso'

const singleAssoStore = useSingleAssoStore()
</script>

<template>
  <div class="all-faq flex flex-col px-24 py-16 gap-2">
    <Panel
      v-for="(faq, index) of singleAssoStore.currentAsso?.faqs"
      :key="index"
      :header="faq.question"
      toggleable
      collapsed
    >
      <p class="text-justify">{{ faq.answer }}</p>
    </Panel>
  </div>
</template>

<style>
@media (max-width: 708px) {
  .all-faq {
    padding: 2rem 3rem;
  }
}
</style>
