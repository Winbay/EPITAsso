<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSingleAssoStore } from '@/stores/singleAsso'
import AssociationHeader from '@/components/SingleAssociation/AssociationHeader.vue'
import AllFaq from '@/components/SingleAssociation/AllFaq.vue'
import AssoEvents from '@/components/SingleAssociation/AssoEvents.vue'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const singleAssoStore = useSingleAssoStore()

onMounted(async () => {
  await singleAssoStore.init(slug)
})
</script>

<template>
  <AssociationHeader v-if="singleAssoStore.currentAsso" />
  <AllFaq />
  <AssoEvents />
</template>

<style scoped></style>
