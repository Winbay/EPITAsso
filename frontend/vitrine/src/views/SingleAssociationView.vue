<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSingleAssoStore } from '@/stores/singleAsso'
import AssociationHeader from '@/components/SingleAssociation/AssociationHeader.vue'
import AllFaq from '@/components/SingleAssociation/AllFaq.vue'
import AssoEvents from '@/components/SingleAssociation/AssoEvents.vue'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const singleAssoStore = useSingleAssoStore()
const isLoading = ref(false)

const loadAssociation = async (slug: string) => {
  isLoading.value = true
  await singleAssoStore.init(slug)
  isLoading.value = false
}

onMounted(async () => {
  await loadAssociation(slug)
})

watch(
  () => route.params.slug,
  (newSlug) => {
    const newSlugValue = Array.isArray(newSlug) ? newSlug[0] : newSlug
    loadAssociation(newSlugValue)
  }
)
</script>

<template>
  <div v-if="!isLoading">
    <AssociationHeader v-if="singleAssoStore.currentAsso" />
    <AllFaq v-if="singleAssoStore.currentAsso && singleAssoStore.currentAsso.faqs?.length > 0" />
    <AssoEvents v-if="singleAssoStore.assoEvents.length > 0"/>
  </div>
</template>

<style scoped></style>
