<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

import { computed, defineProps, type PropType, ref } from 'vue'
import type { Faq } from '@/types/associationInterfaces'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true,
  },
  faqItem: {
    type: Object as PropType<Faq>,
    required: true
  }
});

const getDefaultFaqItem = (): Faq => ({
  id: -1,
  question: '',
  answer: ''
})

const faqItemRef = ref<Faq>(props.faqItem)

const isFormValid = computed(() => {
  return faqItemRef.value.question.trim() && faqItemRef.value.answer.trim()
})

const editOrCreate = (): void => {
  props.setHidden(faqItemRef.value)
}

const cancelDialog = () => {
  faqItemRef.value = getDefaultFaqItem()
  props.setHidden(null);
};
</script>

<template>
  <Dialog
    :visible="true"
    modal
    @update:visible="cancelDialog"
    header="Nouvelle question"
  >
    <div>
      <InputText
        id="socialNetworkName"
        v-model="faqItemRef.question"
        placeholder="Question"
        class="w-full mb-2 h-12"
      />
      <InputText
        id="socialNetworkLink"
        v-model="faqItemRef.answer"
        placeholder="Réponse"
        class="w-full mb-2 h-12"
      />
      <div class="flex justify-start mt-5 gap-4">
        <Button
          label="Annuler"
          icon="pi pi-times"
          @click="cancelDialog"
          severity="secondary"
        />
        <Button
          :label="faqItemRef.id === -1 ? 'Ajouter' : 'Modifier'"
          icon="pi pi-check"
          @click="editOrCreate"
          :disabled="!isFormValid"
          severity="success"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>

</style>