<script setup lang="ts">
import {ref} from "vue";
import type {AssociationWithLogo} from "@/types/associationInterfaces";

const userAssociations = ref<AssociationWithLogo[]>([]);

const getUserAssociations = async (): Promise<void> => {

}
</script>

<template>
  <div>
  </div>
</template>

<style scoped>
.test {
  border: solid 1px red;
}
</style>