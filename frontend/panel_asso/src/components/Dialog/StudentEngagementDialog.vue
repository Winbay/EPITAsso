<script setup lang="ts">

import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Panel from 'primevue/panel'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { defineEmits, ref, computed, watch, reactive } from 'vue'
import { type StudentEngagement } from '@/types/studentEngagementInterface'
import axios from 'axios'

const toast = useToast();

const props = defineProps<{
  visible: boolean
  studentId: number | null
  canEdit: boolean
}>()

const emits = defineEmits(['update:visible', 'add:student-engagement', 'update:student-engagement'])

const hideDialog = () => {
  studentEngagementUtils.reset();
  emits('update:visible', { visible: false, id: null, canEdit: true});
}

async function loadStudentEngagement() {
  if (!props.visible || props.studentId === null) {
    return;
  }
  try {
    const response = await axios.get<StudentEngagement>(`/api/studentEngagements/${props.studentId}`);
    studentEngagementUtils.set(response.data);
    return true;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Engagements étudiant',
      detail: 'L\'engagement étudiant n\'a pas pu être chargée.', life: 3000 });
    console.log(error);
    return false;
  }
}

const studentEngagement = ref<StudentEngagement>({
  id: -1,
  login: '',
  name: '',
  firstname: '',
  promotion: '',
  position: -1,
  comment: '',
  activities: [
    { text: '', hours: null }
  ],
  totalHours: 0,
  totalDays: 0,
  status: -1
});

const positions = ref(
  [
    { name: 'Membre', code: 1 },
    { name: 'Président', code: 2 },
    { name: 'Vice-président', code: 3 },
    { name: 'Secrétaire', code: 4 },
    { name: 'Trésorier', code: 5 },
  ]
);
const selectedPosition = ref<{ name: string; code: number } | undefined>(undefined);

const studentEngagementUtils = {
  reset() {
    studentEngagement.value = {
      id: -1,
      login: '',
      name: '',
      firstname: '',
      promotion: '',
      position: -1,
      comment: '',
      activities: [
        { text: '', hours: null }
      ],
      totalHours: 0,
      totalDays: 0,
      status: -1
    };
    selectedPosition.value = undefined;
  },
  set(value: StudentEngagement) {
    studentEngagement.value = { ...value };
    selectedPosition.value = positions.value.find(position => position.code === value.position);
  },
  addActivity() {
    studentEngagement.value.activities.push({ text: '', hours: null });
  },
  removeActivity(index: number) {
    studentEngagement.value.activities.splice(index, 1);
  }
};

watch(() => props.visible, async (newValue) => {
  if (newValue) {
    await loadStudentEngagement();
  }
});

const submit = () => {
  studentEngagement.value.activities = studentEngagement.value.activities.filter(activity => activity.text !== '' && activity.hours !== 0);
  const totalHours = studentEngagement.value.activities.reduce((acc, activity) => {
    if (activity.hours === null || isNaN(activity.hours)) {
      return acc;
    }
    return acc + parseInt(String(activity.hours));
  }, 0);
  if (selectedPosition.value !== undefined) {
    studentEngagement.value.position = selectedPosition.value.code;
  }
  const body = { ...studentEngagement.value, totalHours, totalDays: (totalHours === 0) ? 0 : Math.floor(totalHours / 7 + 1), status: 2 };
  emits('add:student-engagement', body);
  hideDialog();
}

</script>

<template>
  <Dialog
    class="w-fit"
    :visible="visible"
    :header="canEdit ? 'Ajout d\'un engagement étudiant' : 'Détails'"
    modal
    @update:visible="hideDialog">
    <div class="p-5" :class="{ 'disabled': !canEdit }">
      <div class="flex justify-center">
        <FloatLabel>
          <InputText id="login" v-model="studentEngagement.login"/>
          <label for="login">Login</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-8">
        <FloatLabel class="w-1/2">
          <InputText id="nom" v-model="studentEngagement.name" />
          <label for="nom">Nom</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <InputText id="prenom" v-model="studentEngagement.firstname" class="w-full"/>
          <label for="prenom">Prénom</label>
        </FloatLabel>
      </div>
      <div class="flex gap-5 mt-8">
        <FloatLabel class="w-1/2">
          <InputText id="promotion" v-model="studentEngagement.promotion" />
          <label for="promotion">Promotion</label>
        </FloatLabel>
        <FloatLabel class="w-1/2">
          <Dropdown id="poste" v-model="selectedPosition" :options="positions" optionLabel="name" class="w-full"/>
          <label for="poste">Poste dans l'association</label>
        </FloatLabel>
      </div>
      <FloatLabel class="flex justify-center mt-8">
        <Textarea v-model="studentEngagement.comment" rows="5" cols="30" class="w-full" autoResize/>
        <label for="commentaire">Commentaire sur l'investissement au sein de l'association</label>
      </FloatLabel>
      <Panel v-for="(activity, index) in studentEngagement.activities" :key="index" class="mt-5" :header="'Activité ' + (index + 1)" toggleable>
        <div class="mt-2 flex gap-5">
          <FloatLabel>
            <InputText :id="'activite' + index + '.text'" v-model="activity.text" />
            <label :for="'activite' + index + '.text'">Description activité</label>
          </FloatLabel>
          <FloatLabel>
            <InputText type="number" :id="'activite' + index + '.heures'" v-model="activity.hours" min="0"/>
            <label :for="'activite' + index + '.heures'">Heures travaillées</label>
          </FloatLabel>
        </div>
        <template #icons>
          <button class="delete-activity p-panel-header-icon p-link mr-2" @click="studentEngagementUtils.removeActivity(index)" v-show="canEdit">
            <span class="pi pi-trash"></span>
          </button>
        </template>
      </Panel>
      <div class="mt-5" v-show="canEdit">
        <Button label="Ajouter une activité" icon="pi pi-plus" class="p-button-sm p-button-outlined p-button-rounded-none p-button-full-width" @click="studentEngagementUtils.addActivity()" />
      </div>
    </div>
    <div class="flex justify-end mt-5" v-show="canEdit">
      <Button label="Annuler" icon="pi pi-times" class="mx-2" severity="secondary" @click="hideDialog" />
      <Button label="Ajouter" icon="pi pi-check" class="mx-2" severity="success" @click="submit"/>
    </div>
  </Dialog>
</template>

<style>

.disabled {
  input, textarea, .p-dropdown {
    pointer-events: none;
    opacity: 0.4;
  }
}

.delete-activity:hover {
  color: red;
}

</style>