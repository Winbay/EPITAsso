<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

interface FAQItem {
  question: string
  answer: string
}

const questions = ref<FAQItem[]>([
  { question: 'Question 1', answer: 'Réponse 1' },
  { question: "Question 2", answer: "Réponse 2" },
  { question: "Question 3", answer: "Réponse 3" },
  { question: "Question 4", answer: "Réponse 4" },
])

const newQuestion = ref({ question: '', answer: '' })
const showDialog = ref(false)
const editingIndex = ref<number | null>(null)

const isFormValid = computed(() => {
  return newQuestion.value.question.trim() && newQuestion.value.answer.trim()
})

const addNewQuestion = () => {
  if (editingIndex.value !== null) {
    questions.value[editingIndex.value] = { ...newQuestion.value }
  } else {
    questions.value.push({ ...newQuestion.value })
  }
  resetNewQuestion()
}

const editQuestion = (index: number) => {
  editingIndex.value = index
  newQuestion.value = { ...questions.value[index] }
  showDialog.value = true
}

const deleteQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const resetNewQuestion = () => {
  editingIndex.value = null
  newQuestion.value = { question: '', answer: '' }
  showDialog.value = false
}

const cancelNewQuestion = () => {
  resetNewQuestion()
}
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
    <div class="card">
      <Accordion :activeIndex="0">
        <AccordionTab
          v-for="(question, index) in questions"
          :key="question.question"
        >
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
    <Dialog v-model:visible="showDialog" header="Nouvelle question" @hide="resetNewQuestion" modal>
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
            @click="cancelNewQuestion"
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

.p-accordion-content{
  background-color: transparent;
}
</style>
