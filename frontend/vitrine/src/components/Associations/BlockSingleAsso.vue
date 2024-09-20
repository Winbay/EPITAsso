<script setup lang="ts">
import type {PropType} from "vue";
import type {Association} from "@/types/associationInterfaces";

defineProps({
  association: {
    type: Object as PropType<Association>,
    required: true
  }
})

const getSocialNetworkIcon = (name: string): string => {
  switch (name) {
    case "Website": {
      return "pi pi-globe";
    }
    case "Mail": {
      return "pi pi-at"
    }
    case "Facebook": {
      return "pi pi-facebook"
    }
    case "Instagram": {
      return "pi pi-instagram"
    }
    case "X": {
      return "pi pi-twitter"
    }
    case "Discord": {
      return "pi pi-discord"
    }
    default: {
      return "pi pi-external-link\n"
    }
  }
}
</script>

<template>
  <div class="block-asso flex flex-col items-center justify-between m-4 p-4 gap-2">
    <div class="flex flex-col items-center">
      <img :alt="'Logo ' + association.name" :src="association.logo" />
      <h2 class="text-3xl">{{ association.name }}</h2>
      <span>{{ association.content }}</span>
    </div>
    <div class="flex">

    </div>
  </div>
</template>

<style>
.block-asso {
  border: solid 2px var(--surface-300);
  border-radius: 8px;
  width: 30%;
  height: 32rem;
  box-shadow: 0 0 20px rgba(0,0,0,.1);
  color: var(--blue-800);
}

.block-asso h2 {
  color: #4482A1;
}

.block-asso img {
  width: 196px;
  height: 196px;
}
</style>