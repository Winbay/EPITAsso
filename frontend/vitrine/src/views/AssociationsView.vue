<script setup lang="ts">
import BlockSingleAsso from "@/components/Associations/BlockSingleAsso.vue";
import {onMounted, ref} from "vue";
import type {Association} from "@/types/associationInterfaces";
import {useToast} from "primevue/usetoast";
import AssociationService from "@/services/association/association";

const listAllAssociations = ref<Association[]>([]);
const offset = ref<number>(0);
const moreResults = ref<boolean>(true);
const toast = useToast();
const associationService = new AssociationService(toast);
const OFFSET = 12;

const loadMoreAssociations = async () => {
  if (!moreResults.value) return;
  const response = await associationService.getAssociationsPagination(OFFSET, offset.value);
  offset.value += OFFSET;
  if (!response.next) moreResults.value = false;
  listAllAssociations.value = listAllAssociations.value.concat(response.results);
}

onMounted(async () => {
  await loadMoreAssociations();
})
</script>

<template>
  <main class="py-6 flex flex-wrap justify-center">
    <BlockSingleAsso v-for="(asso, index) of listAllAssociations" :key="index" :association="asso" />
  </main>
</template>

<style>

</style>