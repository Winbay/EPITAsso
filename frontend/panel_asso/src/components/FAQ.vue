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
import type { FAQItem } from '@/types/associationInterfaces'
import * as associationServices from '@/services/associationServices'

const toast = useToast()

const props = defineProps<{
  associationId: number
}>()

const faqItems = ref<FAQItem[]>([])
const newQuestion = ref<FAQItem>({ id: -1, question: '', answer: '' })
const showDialog = ref(false)
const editingIndex = ref<number | null>(null)

const isFormValid = computed(() => {
  return newQuestion.value.question.trim() && newQuestion.value.answer.trim()
})

async function addNewQuestion() : Promise<void>{
  if (editingIndex.value !== null) {
    const response = await associationServices.updateFaqItem(props.associationId, { ...newQuestion.value }, toast)
    if (response) {
      faqItems.value[editingIndex.value] = { ...response }
    }
  } else {
    const response = await associationServices.addFaqItem(props.associationId, { ...newQuestion.value }, toast)
    if (response) {
      faqItems.value.push({ ...response })
    }
  }
  hideFAQDialog()
}

function editQuestion(index: number) : void {
  editingIndex.value = index
  newQuestion.value = { ...faqItems.value[index] }
  showDialog.value = true
}

async function deleteQuestion(index: number) : Promise<void> {
  const response = await associationServices.deleteFaqItem(props.associationId, faqItems.value[index].id, toast)
  if (response) {
    const index = faqItems.value.findIndex((item) => item.id === response)
    faqItems.value.splice(index, 1)
  }
}

function hideFAQDialog() : void {
  editingIndex.value = null
  newQuestion.value = { id: -1, question: '', answer: '' }
  showDialog.value = false
}

async function fetchQuestions() : Promise<void>{
  await associationServices.getFaqByAssociationId(props.associationId, toast).then((response) => {
    if (response) {
      faqItems.value = response
    }
  })
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
    <div v-if="faqItems?.length === 0" class="p-20 text-center">
      <h3>Pas encore de questions</h3>
    </div>
    <div v-else class="card">
      <Accordion :activeIndex="0">
        <AccordionTab v-for="(question, index) in faqItems" :key="question.question">
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
          v-model="newQuestion.question"
          placeholder="Nouvelle question"
          class="w-full mb-3 h-12"
        />
        <Textarea
          v-model="newQuestion.answer"
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
