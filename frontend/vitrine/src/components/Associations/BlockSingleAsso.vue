<script setup lang="ts">
import { type PropType } from 'vue'
import type { AssociationWithSN } from '@/types/associationInterfaces'
import { useFunctionsStore } from '@/stores/functions'

defineProps({
  association: {
    type: Object as PropType<AssociationWithSN>,
    required: true
  }
})

const functionsStore = useFunctionsStore()
</script>

<template>
  <div class="block-asso flex flex-col items-center justify-between m-4 p-4 gap-4">
    <div class="flex flex-col items-center gap-4">
      <img :alt="'Logo ' + association.name" :src="association.logo" />
      <h2 class="text-3xl">{{ association.name }}</h2>
      <span class="asso-content">{{ association.content }}</span>
    </div>
    <div class="flex justify-center w-full gap-4">
      <div v-for="(socialNetwork, index) of association.socialNetworks" :key="index">
        <a :href="socialNetwork.link" target="_blank" rel="noopener noreferrer">
          <i
            :class="functionsStore.getSocialNetworkIcon(socialNetwork.name)"
            class="text-3xl cursor-pointer"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.block-asso {
  border: solid 2px var(--surface-300);
  border-radius: 8px;
  width: 30%;
  height: 32rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  color: var(--blue-800);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

.block-asso h2 {
  color: #4482a1;
}

.block-asso img {
  width: 196px;
  height: 196px;
}

.block-asso .asso-content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
}

@media (max-width: 1000px) {
  .block-asso {
    width: 40%;
  }
}

@media (max-width: 740px) {
  .block-asso {
    width: 80%;
  }
}
</style>
