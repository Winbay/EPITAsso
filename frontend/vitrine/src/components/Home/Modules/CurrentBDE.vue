<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Association } from '@/types/associationInterfaces'
import AssociationService from '@/services/association/association'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const listCurrentBde = ref<Association[]>([])
const currentSchoolBde = ref<Association | undefined>()
const toast = useToast()
const assoService = new AssociationService(toast)
const userStore = useUserStore()

const loadAssoBde = async () => {
  listCurrentBde.value = await assoService.getBde()
  if (listCurrentBde.value.length > 0) currentSchoolBde.value = listCurrentBde.value[0]
}

function capitalizeFirstLetter(string: string | undefined) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getCurrentUserSchool = computed(() => {
  return userStore.user?.school
})

onMounted(async () => {
  await loadAssoBde()
})
</script>

<template>
  <div class="module-current-bde flex flex-col items-center gap-1">
    <span class="text-xl font-semibold">BDE Actuel</span>
    <div v-if="!userStore.user" class="flex flex-col items-center gap-1">
      <span class="font-semibold text-center">Connectez-vous pour voir le BDE de votre école.</span>
    </div>
    <div v-else-if="currentSchoolBde" class="flex">
      <img :src="currentSchoolBde.logo" :alt="'Logo ' + currentSchoolBde.name" class="mr-2" />
      <div class="flex flex-col">
        <div class="flex">
          <span class="text-xl font-semibold">{{ currentSchoolBde.name }}</span>
        </div>
        <span class="bde-content text-sm">{{ currentSchoolBde.content }}</span>
      </div>
    </div>
    <div v-else>{{ capitalizeFirstLetter(getCurrentUserSchool) }} n'a actuellement aucun BDE.</div>
  </div>
</template>

<style>
.module-current-bde {
  border: 1px solid #aaaaaa;
  border-radius: 6px;
  padding: 20px 30px;
}

.module-current-bde > span {
  color: #287094;
  text-decoration: underline;
}

.module-current-bde img {
  width: 48px;
  height: 48px;
  border-radius: 100px;
}

.module-current-bde .bde-content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}
</style>
