<script setup lang="ts">
import type {PropType} from "vue";
import type {Association} from "@/types/associationInterfaces";

const props = defineProps({
  association: {
    type: Object as PropType<Association>,
    required: true
  }
})
</script>

<template>
  <div class="block-asso h-96 w-1/4">

  </div>
</template>

<style>
.block-asso {
  background-color: red;
}
</style>