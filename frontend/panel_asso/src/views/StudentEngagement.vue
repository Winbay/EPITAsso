<script setup lang="ts">

import '@/fixtures/studentEngagement';
import Button from 'primevue/button';
import StudentEngagementDialog from '@/components/Dialog/StudentEngagementDialog.vue'
import StudentEngagementTable from '@/components/DataTable/StudentEngagementTable.vue'
import { type StudentEngagement, type Position, type Status } from '@/types/studentEngagementInterface'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const displayDialog = ref(false);
const studentId = ref<number | null>(null);
const setDisplayDialog = (value: {visible: boolean, id: number | null}) => {
  displayDialog.value = value.visible;
  studentId.value = value.id;
}

const addStudentEngagement = async (studentEngagement : StudentEngagement) => {
  try {
    await axios.post('/api/studentEngagements', studentEngagement);
    toast.add({ severity: 'success', summary: 'Engagement étudiant',
      detail: 'L\'engagement étudiant a bien été ajouté.', life: 3000 });
    await reloadStudentEngagements();
    displayDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Engagement étudiant',
      detail: 'L\'engagement étudiant n\'a pas pu être ajouté.', life: 3000 });
    console.log(error);
  }
}

const updateStudentEngagement = async (studentEngagement : StudentEngagement) => {
  try {
    await axios.put(`/api/studentEngagements/${studentEngagement.id}`, studentEngagement);
    toast.add({ severity: 'success', summary: 'Engagement étudiant',
      detail: 'L\'engagement étudiant a bien été modifié.', life: 3000 });
    await reloadStudentEngagements();
    displayDialog.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Engagement étudiant',
      detail: 'L\'engagement étudiant n\'a pas pu être modifié.', life: 3000 });
    console.log(error);
  }
}

const deleteStudentEngagement = async (studentEngagementId: number) => {
  try {
    await axios.delete(`/api/studentEngagements/${studentEngagementId}`);
    toast.add({ severity: 'success', summary: 'Engagement étudiant',
      detail: 'L\'engagement étudiant a bien été supprimé.', life: 3000 });
    await reloadStudentEngagements();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Engagement étudiant',
      detail: 'L\'engagement étudiant n\'a pas pu être supprimé.', life: 3000 });
    console.log(error);
  }
}

const toast = useToast();

const positions = ref<Position[]>([]);
const status = ref<Status[]>([]);
const studentEngagements = ref<StudentEngagement[]>([])

async function loadPosition() {
  try {
    const response = await axios.get<Position[]>('/api/studentEngagements/positions');
    positions.value = response.data;
    return true;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Engagements étudiant',
      detail: 'La liste des tags des évènements n\'a pas pu être chargée.', life: 3000 });
    console.log(error);
    return false;
  }
}

async function loadStatus() {
  try {
    const response = await axios.get<Status[]>('/api/studentEngagements/status');
    status.value = response.data;
    return true;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Engagements étudiant',
      detail: 'La liste des status des évènements n\'a pas pu être chargée.', life: 3000 });
    console.log(error);
    return false;
  }
}

async function reloadStudentEngagements() {
  try {
    const response = await axios.get<StudentEngagement[]>('/api/studentEngagements');
    studentEngagements.value = response.data;
    return true;
  }
  catch (error) {
    toast.add({ severity: 'error', summary: 'Engagements étudiant',
      detail: 'La liste des engagements étudiant n\'a pas pu être chargée.', life: 3000 });
    console.log(error);
    return false;
  }
}

onMounted(async () => {
  if (await loadPosition() && await loadStatus()) {
    await reloadStudentEngagements();
  }
});

</script>

<template>
  <div class="student-engagement">
    <div class="header">
      <div class="flex gap-5 p-5">
        <h1 class="text-2xl font-bold">Engagement étudiant</h1>
        <Button
          class="cursor-pointer p-2"
          size="small"
          label="Ajouter un engagement étudiant"
          icon="pi pi-plus"
          @click="displayDialog = true"
          raised />
      </div>
      <StudentEngagementDialog
        :visible="displayDialog"
        :student-id="studentId"
        @update:visible="setDisplayDialog"
        @add:student-engagement="addStudentEngagement"
        @update:studentEngagement="updateStudentEngagement"/>
    </div>
    <div class="card flex justify-center">
      <StudentEngagementTable
        :studentEngagements="studentEngagements"
        :positions="positions"
        :status="status"
        @update:visible="setDisplayDialog"
        @delete:studentEngagement="deleteStudentEngagement"/>
    </div>
  </div>
</template>

<style scoped>

.student-engagement {
  background-color: #131923;
  padding: 20px;
  height: 100%
}

.header {
  flex-wrap: wrap;
  height: fit-content;
}


</style>
