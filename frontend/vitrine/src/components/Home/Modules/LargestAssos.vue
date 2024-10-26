<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AssociationWithLogo } from '@/types/associationInterfaces'
import SelectedAssoService from '@/services/association/selectedAsso'

const listLargestAssos = ref<AssociationWithLogo[]>([])

const loadLargestAssos = async () => {
  listLargestAssos.value = await SelectedAssoService.getLargestAssociations()
}

onMounted(async () => {
  await loadLargestAssos()
})
</script>

<template>
  <div class="module-largest-assos flex flex-col items-center gap-2">
    <span class="text-xl font-semibold">Plus grandes associations</span>
    <div class="flex flex-col items-start w-full gap-1">
      <div v-for="(asso, index) of listLargestAssos" :key="index" class="flex">
        <img class="mr-4" :src="asso.logo" :alt="'Logo ' + asso.name" />
        <span>{{ asso.name }}</span>
      </div>
    </div>
    <a class="btn-route" href="/associations">Toutes les associations</a>
  </div>
</template>

<style>
.module-largest-assos {
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  padding: 20px 30px;
}

.module-largest-assos > span {
  color: #287094;
  text-decoration: underline;
}

.module-largest-assos img {
  width: 32px;
  height: 32px;
  border-radius: 100px;
}
</style>
