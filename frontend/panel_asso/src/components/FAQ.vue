<script setup lang="ts">
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import Divider from 'primevue/divider'
import AccordionTab from 'primevue/accordiontab'

import { type PropType, ref } from 'vue'
import type { Faq } from '@/types/associationInterfaces'
import DialogFAQ from '@/components/Dialog/DialogFAQ.vue'

const props = defineProps({
  editing: {
    type: Boolean,
    required: false,
    default: false
  },
  faqs: {
    type: Array as PropType<Faq[]>,
    required: true
  }
})

const getDefaultFaqItem = (): Faq => ({
  id: -1,
  question: '',
  answer: ''
})

const faqItemsRef = ref<Faq[]>(props.faqs)
const selectedFaqItemRef = ref<Faq>(getDefaultFaqItem())

const visibleDialogRef = ref(false)

const closeDialog = (faqItem: Faq | null, isEditing: boolean = false): void => {
  if (faqItem) {
    if (isEditing) {
      const index = faqItemsRef.value.findIndex((item) => item.id === faqItem.id)
      faqItemsRef.value[index] = faqItem
    } else {
      faqItemsRef.value.push(faqItem)
    }
  }
  visibleDialogRef.value = false
}

const isEditingQuestion = ref(false)
const editQuestion = (index: number): void => {
  isEditingQuestion.value = true
  selectedFaqItemRef.value = faqItemsRef.value[index]
  visibleDialogRef.value = true
}

const deleteQuestion = (index: number): void => {
  faqItemsRef.value.splice(index, 1)
}
</script>

<template>
  <div class="faq">
    <div class="flex justify-between items-center">
      <label class="block mb-2 text-2xl font-bold text-wrap">FAQ</label>
      <Button
        v-if="editing"
        @click="
          () => {
            selectedFaqItemRef = getDefaultFaqItem()
            visibleDialogRef = true
          }
        "
        label="Ajouter une question"
        icon="pi pi-plus"
        class="mb-5"
        outlined
      />
    </div>
    <Divider class="mt-0"></Divider>
    <div v-if="faqItemsRef?.length === 0" class="p-20 text-center">
      <h3>Pas encore de questions</h3>
    </div>
    <div v-else class="card">
      <Accordion :activeIndex="0">
        <AccordionTab v-for="(question, index) in faqItemsRef" :key="question.question">
          <template #header>
            <div class="flex justify-between h-fit w-full items-center">
              <span>{{ question.question }}</span>
              <div v-if="editing">
                <Button
                  icon="pi pi-pencil"
                  @click.stop="editQuestion(index)"
                  class="ml-2"
                  severity="info"
                  text
                />
                <Button
                  icon="pi pi-trash"
                  @click.stop="deleteQuestion(index)"
                  class="ml-2"
                  severity="danger"
                  text
                />
              </div>
            </div>
          </template>
          <p class="m-0">{{ question.answer }}</p>
        </AccordionTab>
      </Accordion>
    </div>
    <DialogFAQ
      v-if="visibleDialogRef"
      v-model:visible="visibleDialogRef"
      :set-hidden="closeDialog"
      :faq-item="{ ...selectedFaqItemRef }"
      :editing="isEditingQuestion"
    />
  </div>
</template>

<style>
.faq {
  width: 100%;
  margin: 20px auto;
}

h1 {
  margin: 0;
  color: #ffffff;
  font-weight: bold;
  font-size: 2rem;
}

h3 {
  margin: 0;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
}

p {
  color: #ffffff;
  font-size: 1rem;
  margin-top: 5px;
  white-space: pre-wrap;
}

.p-accordion-content {
  background-color: transparent;
}
</style>
