<script setup lang="ts">
import BlockSingleAsso from '@/components/Associations/BlockSingleAsso.vue'
import { onMounted, ref } from 'vue'
import type { AssociationWithSN } from '@/types/associationInterfaces'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import ListAssociationService from '@/services/association/listAsso'
import router from '@/router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const listAllAssociations = ref<AssociationWithSN[]>([])
const offset = ref<number>(0)
const moreResults = ref<boolean>(true)
const toast = useToast()
const listAssociationService = new ListAssociationService(toast)
const OFFSET = 12

const loadMoreAssociations = async () => {
  if (!moreResults.value) return
  const response = await listAssociationService.getAssociationsPagination(OFFSET, offset.value)
  offset.value += OFFSET
  if (!response.next) moreResults.value = false
  listAllAssociations.value = listAllAssociations.value.concat(response.results)
}

onMounted(async () => {
  if (userStore.user) {
    await loadMoreAssociations()
  }
})
</script>

<template>
  <main class="py-6 flex flex-wrap justify-center">
    <BlockSingleAsso
      v-for="(asso, index) of listAllAssociations"
      :key="index"
      :association="asso"
      @click="router.push('associations/' + asso.slug)"
    />
    <Button
      v-if="userStore.user"
      v-show="moreResults"
      label="Charger plus d'associations"
      class="btn-route text-xl"
      @click="loadMoreAssociations"
    />
    <div v-else class="flex flex-col justify-center items-center gap-2">
      <span class="text-xl font-semibold text-center"
        >Connectez-vous avec le compte Microsoft de votre école pour voir vos associations.</span>
      <Button
        class="btn-connection p-2 w-1/4"
        label="Connexion"
        @click="userStore.checkLoginAndFetchUser(true)"
      />
    </div>
  </main>
</template>

<style></style>
