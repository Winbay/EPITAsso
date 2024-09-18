<script setup lang="ts">
import BlockSingleAsso from "@/components/Associations/BlockSingleAsso.vue";
import {ref} from "vue";
import type {Association} from "@/types/associationInterfaces";
import {useToast} from "primevue/usetoast";
import AssociationService from "@/services/association/association";

const listAllAssociations = ref<Association[]>([]);
const offset = ref<number>(0);
const moreResults = ref<boolean>(true);
const toast = useToast();
const associationService = new AssociationService(toast);

const loadMoreAssociations = async () => {
  const newAssos = await associationService.getAssociationsPagination(10, offset.value);
  offset.value += 10;
}
</script>

<template>
  <main class="py-6">
<!--    <BlockSingleAsso v-for="" association="" />-->
  </main>
</template>

<style>

</style>