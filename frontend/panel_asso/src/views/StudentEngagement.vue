<script setup lang="ts">

import '@/fixtures/studentEngagement';
import { onMounted, ref } from 'vue'
import Button from 'primevue/button';
import DialogEngagementEtudiant from '@/components/Dialog/StudentEngagementDialog.vue'
import TableEngagementEtudiant from '@/components/DataTable/StudentEngagementTable.vue'
import { type StudentEngagement, type Position } from '@/types/studentEngagementInterface'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const displayDialog = ref(false);

const setDisplayDialog = (value: boolean) => {
  displayDialog.value = value;
}

const addEngagementEtudiant = async (engagementetudiant : StudentEngagement) => {
  try {
    await axios.post('/api/studentEngagements', engagementetudiant);
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

const toast = useToast();

const positions = ref<Position[]>([]);
const studentEngagements = ref<StudentEngagement[]>([])

async function loadPosition() {
  try {
    const response = await axios.get<Position[]>('/api/studentEngagements/positions');
    positions.value = response.data;
    return true;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Évènements',
      detail: 'La liste des tags des évènements n\'a pas pu être chargée.', life: 3000 });
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
  if (await loadPosition()) {
    await reloadStudentEngagements();
  }
});

</script>

<template>
  <div class="engagement-etudiant">
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
      <DialogEngagementEtudiant :visible="displayDialog" :positions="positions" @update:visible="setDisplayDialog" @add:add-engagement-etudiant="addEngagementEtudiant" />
    </div>
    <div class="card flex">
      <TableEngagementEtudiant :studentEngagements="studentEngagements" :positions="positions"/>
    </div>
  </div>
</template>

<style scoped>

.engagement-etudiant {
  background-color: #131923;
  padding: 20px;
  height: 100%
}

.header {
  flex-wrap: wrap;
  height: fit-content;
}


</style>
