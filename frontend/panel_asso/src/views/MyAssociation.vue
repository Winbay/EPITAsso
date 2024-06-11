<script setup lang="ts">
import Image from 'primevue/image'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'
import ProgressSpinner from 'primevue/progressspinner'

import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import DialogAssociation from '@/components/Dialog/DialogAssociation.vue'
import FAQ from '@/components/FAQ.vue'
import type { AssociationDetail } from '@/types/associationInterfaces'
import { getSocialNetworkImage } from '@/utils/associationUtils'
import '@/fixtures/association'
import AssociationDetailService from '@/services/association/associationDetailService'

// TODO associationId should be dynamic
const ASSOCIATION_ID = 1

const toast = useToast()
const associationDetailService: AssociationDetailService = new AssociationDetailService(toast, ASSOCIATION_ID)

const isLoading = ref(true)

const getDefaultAssociation = (): AssociationDetail => ({
  id: -1,
  name: '',
  description: '',
  location: '',
  logo: '',
  socialNetworks: [],
  faq: []
})
const associationRef = ref<AssociationDetail>(getDefaultAssociation())

const visibleDialogRef = ref(false)
const closeDialog = (): void => {
  visibleDialogRef.value = false
}

const reloadMyAssociation = async (): Promise<void> => {
  isLoading.value = true
  associationRef.value = await associationDetailService.getAssociationDetail(ASSOCIATION_ID)
  isLoading.value = false
}

onMounted(async () => {
  await reloadMyAssociation()
})
</script>

<template>
  <div v-if="isLoading" class="spinner">
    <ProgressSpinner />
  </div>
  <div v-else>
    <ScrollPanel
      class="flex content-center w-full h-full px-10 py-8"
      style="width: 100%; height: calc(100vh - 1.25rem - 20px)"
    >
      <div class="my-association h-10 mb-6 flex justify-start items-center">
        <span class="mr-4 text-2xl font-bold text-wrap">Mon association</span>
        <Button label="Modifier" class="add-btn py-0 px-4 h-full" @click="visibleDialogRef = true" />
      </div>
      <div class="flex gap-5 mt-5">
        <Image
          :src="associationRef.logo"
          width="250"
          height="250"
          title="Logo Association"
        ></Image>
        <div class="flex flex-col w-full">
          <h1>{{ associationRef.name }}</h1>
          <p class="association-description mb-2 whitespace-pre-wrap">{{ associationRef.description }}</p>
          <div class="flex pt-5">
            <div v-for="socialNetwork in associationRef.socialNetworks" :key="socialNetwork.name">
              <a :href="socialNetwork.link" target="_blank">
                <Avatar
                  :image="getSocialNetworkImage(socialNetwork.name)"
                  class="mr-2 avatar"
                  size="large"
                  shape="circle"
                  :title="socialNetwork.name"
                ></Avatar>
              </a>
            </div>
          </div>
        </div>
      </div>
      <DialogAssociation
        v-model:visible="visibleDialogRef"
        :set-hidden="closeDialog"
        :reload-association="reloadMyAssociation"
        :association="JSON.parse(JSON.stringify(associationRef))" />
      <FAQ
        :faq="associationRef.faq"
        :association-id="associationRef.id"></FAQ>
    </ScrollPanel>
  </div>
</template>

<style scoped>

.my-association .add-btn {
  color: var(--text-color);
}
.spinner {
  height: 100vh;
  align-content: center;
  text-align: center;
}

.avatar:hover {
  filter: brightness(80%);
}
</style>
