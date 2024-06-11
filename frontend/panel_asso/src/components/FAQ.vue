<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Accordion from 'primevue/accordion'
import Divider from 'primevue/divider'
import AccordionTab from 'primevue/accordiontab'
import { useToast } from 'primevue/usetoast'
import type { Faq } from '@/types/associationInterfaces'
import FaqService from '@/services/association/faq'

const toast = useToast()

const props = defineProps<{
  associationId: number
}>()

const faqService = new FaqService(toast, props.associationId)

const faqItemsRef = ref<Faq[]>([])
const newFaqItemRef = ref<Faq>({ id: -1, question: '', answer: '' })
const showDialog = ref(false)
const editingIndex = ref<number | null>(null)

const isFormValid = computed(() => {
  return newFaqItemRef.value.question.trim() && newFaqItemRef.value.answer.trim()
})

const addNewQuestion = async (): Promise<void> => {
  if (editingIndex.value !== null) {
    await faqService.updateFaq(newFaqItemRef.value)
  } else {
    await faqService.createFaq(newFaqItemRef.value)
  }
  hideFAQDialog()
}

const editQuestion = (index: number): void => {
  editingIndex.value = index
  newFaqItemRef.value = { ...faqItemsRef.value[index] }
  showDialog.value = true
}

const deleteQuestion = async (index: number): Promise<void> => {
  await faqService.deleteFaq(faqItemsRef.value[index].id)
  faqItemsRef.value.splice(index, 1)
}

const hideFAQDialog = (): void => {
  editingIndex.value = null
  newFaqItemRef.value = { id: -1, question: '', answer: '' }
  showDialog.value = false
}

const fetchQuestions = async (): Promise<void> => {
  const response = await faqService.getFaqs()
  if (response) {
    faqItemsRef.value = response
  }
}

onMounted(async () => {
  await fetchQuestions()
})
</script>

<template>
  <div class="faq">
    <div class="flex justify-between items-center">
      <h1>FAQ</h1>
      <Button
        label="Ajouter une question"
        icon="pi pi-plus"
        @click="showDialog = true"
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
              <div>
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
    <Dialog v-model:visible="showDialog" header="Nouvelle question" @hide="hideFAQDialog" modal>
      <div>
        <InputText
          v-model="newFaqItemRef.question"
          placeholder="Nouvelle question"
          class="w-full mb-3 h-12"
        />
        <Textarea
          v-model="newFaqItemRef.answer"
          placeholder="Réponse"
          rows="5"
          class="w-full min-h-32"
        />
        <div class="flex justify-end mt-5">
          <Button
            label="Annuler"
            icon="pi pi-times"
            @click="hideFAQDialog"
            class="p-button-secondary"
          />
          <Button
            label="Poster"
            icon="pi pi-check"
            @click="addNewQuestion"
            :disabled="!isFormValid"
            class="p-button-success ml-4"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style>
.faq {
  width: 800px;
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
