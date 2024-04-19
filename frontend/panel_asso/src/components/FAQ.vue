<template>
  <div class="faq">
    <div class="faq-header">
      <h1>FAQ</h1>
      <Button label="Ajouter une question" icon="pi pi-plus" @click="showDialog = true" class="add-question-btn"/>
    </div>
    <div v-if="questions.length !== 0" class="questions">
      <div v-for="(item, index) in questions" :key="index" :class="{ 'question': true, 'last': index === questions.length - 1 }">
        <div>
          <h3>{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </div>
        <div class="action-buttons">
          <Button icon="pi pi-pencil" @click="editQuestion(index)" class="edit-button" severity="info"/>
          <Button icon="pi pi-trash" @click="deleteQuestion(index)" class="delete-button"  severity="danger"/>
        </div>
      </div>
    </div>
    <Dialog
        v-model:visible="showDialog"
        header="Nouvelle question"
        @hide="resetNewQuestion"
        modal>
      <div>
        <InputText v-model="newQuestion.question" placeholder="Nouvelle question" class="input-field"/>
        <Textarea v-model="newQuestion.answer" placeholder="Réponse" class="input-field"/>
        <div class="button-container">
          <Button label="Annuler" icon="pi pi-times" @click="cancelNewQuestion" class="cancel-button" severity="secondary"/>
          <Button label="Poster" icon="pi pi-check" @click="addNewQuestion" :disabled="!isFormValid" class="add-button" severity="success"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

interface FAQItem {
  question: string;
  answer: string;
}

const questions = ref<FAQItem[]>([
  { question: "Question 1", answer: "Réponse 1" },
  // { question: "Question 2", answer: "Réponse 2" },
]);

const newQuestion = ref({ question: '', answer: '' });
const showDialog = ref(false);
const editingIndex = ref<number | null>(null);

const isFormValid = computed(() => {
  return newQuestion.value.question.trim() && newQuestion.value.answer.trim();
});

const addNewQuestion = () => {
  if (editingIndex.value !== null) {
    questions.value[editingIndex.value] = { ...newQuestion.value };
  } else {
    questions.value.push({ ...newQuestion.value });
  }
  resetNewQuestion();
};

const editQuestion = (index: number) => {
  editingIndex.value = index;
  newQuestion.value = { ...questions.value[index] };
  showDialog.value = true;
};

const deleteQuestion = (index: number) => {
  questions.value.splice(index, 1);
};

const resetNewQuestion = () => {
  newQuestion.value = { question: '', answer: '' };
  showDialog.value = false;
};

const cancelNewQuestion = () => {
  resetNewQuestion();
};
</script>

<style scoped>
.faq {
  width: 800px;
  margin: 20px auto 0;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.questions {
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 120px;
}

.question {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  width: 100%;
}

.question>.action-buttons {
  display: flex;
  flex-direction: column;
}

.question.last {
  border-bottom: none;
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

.input-field {
  width: 100%;
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.add-question-btn {
  margin-bottom: 20px;
}

.add-button, .cancel-button {
  margin-left: 10px;
}

.edit-button,
.delete-button {
  margin-top: 10px;
  margin-right: 5px;
}
</style>
