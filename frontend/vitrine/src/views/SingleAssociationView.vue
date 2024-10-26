<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSingleAssoStore } from '@/stores/singleAsso'
import AssociationHeader from '@/components/SingleAssociation/AssociationHeader.vue'
import AllFaq from '@/components/SingleAssociation/AllFaq.vue'
import AssoEvents from '@/components/SingleAssociation/AssoEvents.vue'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const singleAssoStore = useSingleAssoStore()

const loadAssociation = async (slug: string) => {
  await singleAssoStore.init(slug)
}

onMounted(async () => {
  await loadAssociation(slug)
})

watch(() => route.params.slug, (newSlug) => {
  const newSlugValue = Array.isArray(newSlug) ? newSlug[0] : newSlug
  loadAssociation(newSlugValue)
})
</script>

<template>
  <AssociationHeader v-if="singleAssoStore.currentAsso" />
  <AllFaq />
  <AssoEvents />
</template>

<style scoped></style>
