<script setup lang="ts">
import Image from 'primevue/image'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

import { type PropType, ref } from 'vue'
import DialogAssociation from '@/components/Dialog/DialogAssociation.vue'
import FAQ from '@/components/FAQ.vue'
import type { AssociationDetail } from '@/types/associationInterfaces'
import { getSocialNetworkImage } from '@/utils/associationUtils'

const props = defineProps({
  associationDetails: {
    type: Object as PropType<AssociationDetail>,
    required: true
  },
  reloadAssociation: {
    type: Function,
    required: true
  }
})

const visibleDialogRef = ref(false)
const closeDialog = async (): Promise<void> => {
  await props.reloadAssociation()
  visibleDialogRef.value = false
}
</script>

<template>
  <div>
    <div class="association-details h-10 mb-6 flex justify-start items-center">
      <Button label="Modifier" class="add-btn px-4 h-full" @click="visibleDialogRef = true" />
    </div>
    <div class="flex gap-5 mt-5">
      <Image
        :src="associationDetails.logo"
        width="250"
        height="250"
        title="Logo Association"
      ></Image>
      <div class="flex flex-col w-full">
        <h1>{{ associationDetails.name }}</h1>
        <p class="association-content mb-2 whitespace-pre-wrap">
          {{ associationDetails.content }}
        </p>
        <div class="flex pt-5">
          <div v-for="socialNetwork in associationDetails.socialNetworks" :key="socialNetwork.name">
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
      v-if="visibleDialogRef"
      v-model:visible="visibleDialogRef"
      :set-hidden="closeDialog"
      :association="associationDetails"
    />
    <FAQ :faqs="associationDetails.faqs" :association-id="associationDetails.id" />
  </div>
</template>

<style scoped>
.association-details .add-btn {
  color: var(--text-color);
}

.avatar:hover {
  filter: brightness(80%);
}
</style>
