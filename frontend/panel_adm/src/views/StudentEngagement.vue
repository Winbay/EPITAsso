<script setup lang="ts">
import '@/fixtures/studentEngagement'
import StudentEngagementTable from '@/components/DataTable/StudentEngagementTable.vue'
import {
  type StudentEngagement,
  type Position,
  type Status
} from '@/types/studentEngagementInterface'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import StudentEngagementDialog from '@/components/Dialog/StudentEngagementDialog.vue'

const displayDialog = ref(false)
const studentId = ref<number | null>(null)
const canEditDialog = ref(true)
const setDisplayDialog = (value: { visible: boolean; id: number | null; canEdit: boolean }) => {
  displayDialog.value = value.visible
  studentId.value = value.id
  canEditDialog.value = value.canEdit

  for (const studentEngagement of studentEngagements.value) {
    if (studentEngagement.id === value.id && studentEngagement.status.id !== 1) {
      canEditDialog.value = false
      break
    }
  }
}

const compareActivities = (
  activities1: { text: string; hours: number | null }[],
  activities2: { text: string; hours: number | null }[]
) => {
  if (activities1.length !== activities2.length) {
    return false
  }
  for (let i = 0; i < activities1.length; i++) {
    const activity1 = activities1[i]
    const activity2 = activities2[i]
    if (activity1.text !== activity2.text || activity1.hours !== activity2.hours) {
      return false
    }
  }
  return true
}

const checkHasChanges = (studentEngagement: StudentEngagement) => {
  for (const student of studentEngagements.value) {
    if (student.id === studentEngagement.id) {
      if (
        student.login !== studentEngagement.login ||
        student.name !== studentEngagement.name ||
        student.firstname !== studentEngagement.firstname ||
        student.promotion !== studentEngagement.promotion ||
        student.position !== studentEngagement.position ||
        student.comment !== studentEngagement.comment ||
        !compareActivities(student.activities, studentEngagement.activities)
      ) {
        return true
      }
      break
    }
  }
  return false
}

const updateStudentEngagement = async (studentEngagement: StudentEngagement) => {
  try {
    let hasChanges = checkHasChanges(studentEngagement)

    if (hasChanges && studentEngagement.status.id === 2) {
      studentEngagement.status.id = 3
    }

    await axios.put(`/api/studentEngagements/${studentEngagement.id}`, studentEngagement)
    toast.add({
      severity: 'success',
      summary: 'Engagement étudiant',
      detail: "L'engagement étudiant a bien été modifié.",
      life: 3000
    })
    await reloadStudentEngagements()
    displayDialog.value = false
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Engagement étudiant',
      detail: "L'engagement étudiant n'a pas pu être modifié.",
      life: 3000
    })
    console.log(error)
  }
}

const toast = useToast()

const positions = ref<Position[]>([])
const status = ref<Status[]>([])
const studentEngagements = ref<StudentEngagement[]>([])

async function loadPosition() {
  try {
    const response = await axios.get<Position[]>('/api/studentEngagements/positions')
    positions.value = response.data
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Engagements étudiant',
      detail: "La liste des tags des évènements n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
}

async function loadStatus() {
  try {
    const response = await axios.get<Status[]>('/api/studentEngagements/status')
    status.value = response.data
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Engagements étudiant',
      detail: "La liste des status des évènements n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
}

async function reloadStudentEngagements() {
  try {
    const response = await axios.get<StudentEngagement[]>('/api/studentEngagements')
    studentEngagements.value = response.data
    return true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Engagements étudiant',
      detail: "La liste des engagements étudiant n'a pas pu être chargée.",
      life: 3000
    })
    console.log(error)
    return false
  }
}

onMounted(async () => {
  if ((await loadPosition()) && (await loadStatus())) {
    await reloadStudentEngagements()
  }
})
</script>

<template>
  <div class="student-engagement">
    <div class="header">
      <div class="flex gap-5 p-5">
        <h1 class="text-2xl font-bold">Engagement étudiant</h1>
      </div>
      <StudentEngagementDialog
        :visible="displayDialog"
        :student-id="studentId"
        :canEdit="canEditDialog"
        :status="status"
        @update:visible="setDisplayDialog"
        @update:studentEngagement="updateStudentEngagement"
      />
    </div>
    <div class="card flex justify-center">
      <StudentEngagementTable
        :studentEngagements="studentEngagements"
        :positions="positions"
        :status="status"
        @update:visible="setDisplayDialog"
      />
    </div>
  </div>
</template>

<style scoped>
.student-engagement {
  background-color: #131923;
  padding: 20px;
  height: 100%;
}

.header {
  flex-wrap: wrap;
  height: fit-content;
}
</style>
