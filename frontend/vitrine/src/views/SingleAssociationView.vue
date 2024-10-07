<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useSingleAssoStore} from "@/stores/singleAsso";
import AssociationHeader from "@/components/SingleAssociation/AssociationHeader.vue";
import AllFaq from "@/components/SingleAssociation/AllFaq.vue";

const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
const singleAssoStore = useSingleAssoStore();

onMounted(async () => {
  await singleAssoStore.init(slug);
})
</script>

<template>
  <AssociationHeader v-if="singleAssoStore.currentAsso" />
  <AllFaq />
</template>

<style scoped>

</style>