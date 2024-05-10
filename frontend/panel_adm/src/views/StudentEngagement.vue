<script setup lang="ts">

import StudentEngagementTable from '@/components/DataTable/StudentEngagementTable.vue'
import { onMounted, ref } from 'vue'
import type { Position, StudentEngagement } from '@/types/studentEngagementInterface'
import axios from 'axios'
import '@/fixtures/studentEngagement';
import { useToast } from 'primevue/usetoast'

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

async function loadStudentEngagements() {
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
    await loadStudentEngagements();
  }
});
</script>

<template>
  <div class="engagement-etudiant">
    <div class="header">
      <div class="flex gap-5 p-5">
        <h1 class="text-2xl font-bold">Engagement étudiant</h1>
      </div>
    </div>
    <div class="card flex">
      <StudentEngagementTable :studentEngagements="studentEngagements" :positions="positions" />
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